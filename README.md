# Punarvasu Vaidya - Deploy Guide (Vercel + Gemini)

## What's in this folder
- `index.html` - the Punarvasu Vaidya chat UI (static, no secrets inside)
- `api/chat.js` - serverless function that does the RAG retrieval server-side and calls the Gemini API. Your key lives only in Vercel's environment variables.

## Why this structure
Putting a Gemini key in front-end code means anyone can steal it from view-source. So the browser talks only to `/api/chat`, and the server talks to Gemini. The retrieval (chunks + scoring) also moved server-side so nobody can hijack your endpoint with their own prompts.

## Deploy in ~5 minutes

1. Get a FRESH Gemini API key from https://aistudio.google.com/apikey (revoke the old one you shared in chat).
2. Push this folder to a GitHub repo (or use Vercel CLI):
   - Option A (no terminal): go to https://vercel.com/new, import the repo, deploy.
   - Option B (CLI): `npm i -g vercel`, then `vercel` inside this folder.
3. In Vercel: Project > Settings > Environment Variables, add:
   - `GEMINI_API_KEY` = your new key
   - `GEMINI_MODEL` = gemini-2.5-flash (optional, this is the default; change anytime)
4. Redeploy. Open the URL, ask Punarvasu Vaidya something.

## Custom domain
Vercel > Project > Settings > Domains. e.g. vaidya.rooai.care - add the CNAME it shows in your DNS.

## Recommended hardening (when it goes beyond family)
- Vercel has basic DDoS protection, but add a rate limit if it's public: Vercel KV or Upstash, ~10 req/min per IP in chat.js.
- Set a spending cap / quota on the Gemini key in Google AI Studio.
- Keep the system prompt's safety rules intact if you edit chunks.

## Alternatives that also work
- Netlify: same structure, function goes to `netlify/functions/chat.js` with a tiny signature change.
- Cloudflare Pages + Workers: cheapest at scale, slightly more setup.

## Updating the knowledge base
All knowledge lives in the `CHUNKS` array at the top of `api/chat.js`. Add or edit chunks (id, title, tags, text) and redeploy. When you get video transcripts, they become new chunks here.
