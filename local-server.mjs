// local-server.js - Lightweight native Node.js development server to test Punarvasu Vaidya locally without Vercel CLI
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Load .env file
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

// 2. Import the API handler dynamically
const apiModule = await import('./api/chat.js');
const chatHandler = apiModule.default;

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Route API requests
  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        req.body = body ? JSON.parse(body) : {};
      } catch (err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }

      // Mock Vercel res methods status() and json()
      res.status = (statusCode) => {
        res.statusCode = statusCode;
        return res;
      };
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
        return res;
      };

      try {
        await chatHandler(req, res);
      } catch (err) {
        console.error('Error in API handler:', err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Internal Server Error', details: err.message }));
      }
    });
    return;
  }

  // Serve static files (index.html)
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Error loading index.html');
      } else {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(data);
      }
    });
    return;
  }

  // Fallback for other static assets if any
  res.statusCode = 404;
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`\n🚀 Punarvasu Vaidya local server is running at http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop the server\n`);
});
