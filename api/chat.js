// api/chat.js - Vercel serverless function: server-side RAG + Gemini
const CHUNKS = [
{id:"dinacharya-subah", title:"Subah ki dinacharya", tags:["subah","morning","routine","dinacharya","uthna","wake","brahma","pani","water","ushapan","धूप","सुबह","दिनचर्या","उठ"],
text:"ब्रह्म मुहूर्त (4-5 बजे) में उठना श्रेष्ठ; देर से उठने को पेट के रोगों से जोड़ा गया है. उठकर 2-3 गिलास गुनगुना पानी घूंट-घूंट कर, बैठकर पिएं (उषापान). रातभर गुड़ डालकर रखा पानी सुबह छानकर पीने की परंपरा भी है. नंगे पैर हरी घास पर चलना और आंवला खाना नेत्रज्योति के लिए; धूप लेना; प्राणायाम-ध्यान-हल्का व्यायाम. सुबह नाश्ते में फल सर्वोत्तम. खाली पेट चाय/कॉफी पूर्ण वर्जित (पाचनशक्ति मंद, नींद और भूख पर असर). सुबह जूस पिएं तो काला नमक + अदरक डालकर."},
{id:"dinacharya-bhojan", title:"Bhojan ke niyam", tags:["khana","bhojan","eat","meal","food rules","chaba","chew","pani kab","भोजन","खाना","चबा","नियम","vajrasana","वज्रासन"],
text:"भोजन कम से कम 25 मिनट, खूब चबा-चबाकर (बकरी की तरह - अजवत् चर्वणं); लार सबसे बड़ी प्राकृतिक औषधि है. आधा पेट ठोस, चौथाई पानी, चौथाई खाली रखें. भूख लगने पर ही खाएं; पिछला भोजन न पचा हो तो अगला भोजन विष समान (अजीर्णे भोजनं विषम). भोजन में छहों रस हों (मीठा, नमकीन, खट्टा, कड़वा, कसैला, तीखा). भोजन से आधा घंटा पहले सलाद. भोजन के बाद वज्रासन में बैठें (वात नियंत्रण), फिर 100 कदम से आधा घंटा टहलें. पानी भोजन के लगभग डेढ़ घंटे बाद; भोजन के तुरंत बाद या फल/मीठे पर पानी नहीं. खाने के तुरंत बाद स्नान वर्जित. भोजन के बाद सौंफ-गुड़-अजवाइन पाचन में सहायक; छाछ में हींग + सेंधा नमक + जीरा."},
{id:"dinacharya-raat", title:"Raat aur neend ke niyam", tags:["raat","night","sona","sleep","neend","नींद","रात","सोना","karwat","दूध"],
text:"रात में दूध श्रेष्ठ; भारी प्रोटीन (दाल, पनीर, राजमा, लोबिया) रात में वर्जित. ठीक से सोना आधी बीमारियों की दवा (अर्धरोगहरी अनिद्रा). दिन में दायीं करवट, रात में बायीं करवट विश्राम की परंपरा; पेट के बल सोने से बचें (हर्निया, प्रोस्टेट से जोड़ा गया). सोने से आधा घंटा पहले पानी पीना वायु-नियंत्रण की परंपरा. देर रात जागना अपच और नेत्र-रोगों से जोड़ा गया है. अनिद्रा में: बैंगन के भरते में शहद मिलाकर शाम के भोजन में; दिन में धूप + नियमित दिनचर्या; बुजुर्गों में नींद की गोली से बचने की सलाह दी गई है."},
{id:"khali-pet", title:"Khali pet kya na lein", tags:["khali pet","empty stomach","खाली पेट","dahi","kela","banana","chai","coffee","tamatar"],
text:"खाली पेट वर्जित: चाय/कॉफी (सबसे घातक), दही (मरोड़), कच्चा टमाटर (पथरी से जोड़ा गया), केला (कैल्शियम-मैग्नीशियम असंतुलन), सोडा, चटपटा-मसालेदार, शराब, शकरकंद. खाली पेट हल्का गुनगुना पानी सर्वोत्तम शुरुआत है."},
{id:"rasoi-swaps", title:"Rasoi ke 8 sudhaar", tags:["namak","salt","gud","jaggery","tel","oil","ghee","atta","maida","sugar","cheeni","रसोई","सेंधा","बिलोना","मटका","matka","refined"],
text:"6 महीने में फर्क वाले रसोई सुधार: (1) समुद्री/आयोडीन नमक की जगह सेंधा नमक, केवल पकाते समय; ऊपर से नमक कभी नहीं (BP). (2) सफेद चीनी त्याग; ऑर्गेनिक गुड़, देसी खांड, शक्कर. (3) रिफाइंड तेल की जगह कच्ची घानी का सरसों/पीली सरसों/मूंगफली/तिल का तेल. (4) घी केवल बिलोना विधि का, देसी गाय के दूध से (दूध से दही, दही से मक्खन, मक्खन से घी). (5) दूध केवल देसी गाय का. (6) आटा मोटा पिसा, चोकर सहित; मैदा कभी नहीं. (7) पानी मटके का या गुनगुना; फ्रिज का ठंडा नहीं. (8) एल्युमिनियम के बर्तन वर्जित."},
{id:"pachan-kadha", title:"Deepan-pachan kadha", tags:["pachan","digestion","kadha","drink","agni","bhookh","appetite","काढ़ा","पाचन","जठराग्नि","मंदाग्नि"],
text:"जठराग्नि बढ़ाने का काढ़ा: 1 बड़ा गिलास पानी में 1 इंच घिसा अदरक, चौथाई चम्मच अजवाइन, 1 इंच दालचीनी डालकर आधा रहने तक उबालें; छानकर आधा नींबू का रस और काला नमक मिलाएं; भोजन से 1 घंटा पहले पिएं. भोजन से पहले अदरक के 2-4 टुकड़े सेंधा नमक और नींबू के साथ लेने से मंदाग्नि दूर होती है. अपच में सादा गुनगुना पानी ही औषधि (अजीर्णे भेषजं वारि)."},
{id:"acidity", title:"Acidity / अम्लपित्त", tags:["acidity","अम्लपित्त","एसिडिट","jalan","khatti dakar","seene","heartburn","gerd","खट्टी"],
text:"एसिडिटी पित्त असंतुलन है (कारण: खाली पेट रहना, तला-तीखा, अनियमित खानपान, तनाव, नींद की कमी). नुस्खे: पिसी सोंठ + सूखा धनिया 4-4 चम्मच एक गिलास पानी में आधा रहने तक उबालकर दिन में 3 बार. गुड़ में थोड़ी अजवाइन. पित्त बढ़ने पर घृतकुमारी (एलोवेरा) + आंवला रस. घूंट-घूंट पानी पीने की आदत एसिडिटी और मोटापे दोनों में सहायक. खाली पेट चाय/कॉफी बंद करें."},
{id:"gas-kabz", title:"Gas aur kabz", tags:["gas","kabz","constipation","कब्ज","गैस","pet saaf","motion","triphala","त्रिफला","harad"],
text:"गैस: भोजन में अजवाइन शुरू करें (अपान वायु ठीक करती है); लहसुन की 2 कली + 2 चम्मच घी चबाकर तुरंत राहत. कब्ज: रात में 1 चम्मच त्रिफला गुनगुने पानी से; हरड़ दूध के साथ; सुबह पानी पीकर एड़ियों के बल चलना; मल बंधा हो तो अदरक रस या सोंठ; भोजन के बाद सौंफ-गुड़-अजवाइन. मुंह के छाले अक्सर कब्ज से जुड़े होते हैं, दोनों साथ ठीक करें."},
{id:"loose-motion", title:"Loose motion / dast", tags:["dast","loose motion","diarrhea","दस्त","pet kharab","पेचिश"],
text:"लूज मोशन: अदरक का रस हल्का गर्म कर नाभि के आसपास लगाएं; आधा कप उबलते पानी में आधा चम्मच अदरक रस चाय की तरह; 1 चम्मच सोंठ + नमक की फंकी दिन में 3 बार; दालचीनी पाउडर पानी के साथ. गर्भवती के दस्त में संतरे का रस + शहद दिन में 3 बार की परंपरा. पेचिश में 6 ग्राम गोंद कतीरा रातभर भिगोकर चीनी के साथ. पानी-नमक-चीनी का घोल लेते रहें; बच्चों या लगातार दस्त में डॉक्टर जरूरी."},
{id:"muh-chhale", title:"Munh ke chhale", tags:["chhale","ulcer","mouth","मुंह","छाले","muh"],
text:"मुंह के छालों के नुस्खे: हरे धनिये का रस लगाना और सूखे धनिये के उबले पानी से गरारे; शहद-पानी का कुल्ला; रात में देसी घी लगाकर सोना; हल्दी के पानी से गरारे; भोजन के बाद गुड़ चूसना; दही के साथ पका केला; गुनगुने नमक-पानी के कुल्ले. विटामिन B-C युक्त आहार (पालक, अंकुरित अनाज, अमरूद, संतरा, आंवला). मसालेदार-तैलीय से परहेज. छाले बार-बार हों तो कब्ज का इलाज साथ करें."},
{id:"sardi-khansi", title:"Sardi, khansi, gala", tags:["sardi","khansi","cough","cold","gala","throat","kaph","cough","सर्दी","खांसी","गला","कफ","जुकाम","balgam"],
text:"सर्दी: अदरक रस + शहद समान मात्रा; गुनगुना पानी; खजूर गर्म पानी के साथ (कफ). खांसी/कफ: अजवाइन की भाप; मुलहठी चूसना (आवाज भी सुरीली); 20 ग्राम आंवला + 1 ग्राम हल्दी; तुलसी के पत्ते. गला खराश: सुबह सौंफ चबाना; शहद. बहती नाक: युकेलिप्टस तेल रूमाल में सूंघना. बच्चों की छाती पर गाय का पुराना घी मलने से बलगम निकालने में मदद की परंपरा. चैत्र मास में रोज नीम की कोंपल की परंपरा."},
{id:"bukhar", title:"Bukhar", tags:["bukhar","fever","बुखार","ज्वर","tez","viral"],
text:"परंपरा में बुखार में लंघन (हल्का उपवास) परम औषधि माना गया है; गर्म पानी में पैर रखकर बैठना और गुनगुना पानी सिप-सिप पीना. लेकिन ध्यान रहे: तेज बुखार, 2 दिन से ज्यादा, डेंगू के लक्षण (तेज बदन दर्द, चकत्ते), बच्चों या बुजुर्गों का बुखार - इनमें तुरंत डॉक्टर को दिखाना जरूरी है. चल रही दवा अपने मन से बंद नहीं करनी."},
{id:"sirdard", title:"Sirdard aur migraine", tags:["sirdard","headache","migraine","माइग्रेन","सिरदर्द","sir","नस्य","swar"],
text:"स्वर चिकित्सा: सिरदर्द में दायां नथुना बंद कर बाएं से 5 मिनट सांस लें; थकान में उल्टा (बायां बंद, दाएं से सांस). सुबह खाली पेट सेब छीलकर थोड़े नमक के साथ. माइग्रेन में गाय के घी की 2 बूंद नाक में सुबह-शाम (नस्य) की परंपरा. सिर में गर्मी लगे तो तलवों पर घी की मालिश. कपूर-नींबू के गुनगुने पानी में पैर डुबोने का प्रयोग भी सिरदर्द-माइग्रेन से जोड़ा गया है."},
{id:"platelets", title:"Platelets / dengue sahayak", tags:["platelets","dengue","डेंगू","प्लेटलेट","chikungunya","papita","papaya"],
text:"डेंगू/चिकनगुनिया में प्लेटलेट्स गिरने पर पारंपरिक सहायक (डॉक्टर के इलाज के साथ, उसकी जगह नहीं): पपीते की पत्तियों (डंठल हटाकर) का रस 2 चम्मच दिन में 3 बार; आधा गिलास कद्दू रस + शहद दिन में 2-3 बार; पालक उबालकर टमाटर रस के साथ; रोज सुबह 3-4 आंवला; चुकंदर रस 1 चम्मच दिन में 3 बार. डेंगू में डॉक्टर की निगरानी और प्लेटलेट जांच अनिवार्य है."},
{id:"anemia", title:"Khoon ki kami / raktavardhak", tags:["khoon","anemia","hemoglobin","हीमोग्लोबिन","खून","रक्त","iron","आयरन","कमी"],
text:"रक्तवर्धक प्रयोग: रोज 1 गिलास गाजर-चुकंदर का रस; नाश्ते में अनार या सेब; 1 चम्मच काले तिल पाउडर + गुड़ + देसी घी; 4-5 खजूर + 10-12 किशमिश रातभर भिगोकर सुबह; 2 चम्मच आंवला रस + 1 चम्मच शहद रोज सुबह; गिलोय रस + गुड़ गर्म पानी से; बकरी का दूध. मंडूर भस्म, लोह भस्म जैसी औषधियां केवल योग्य वैद्य की देखरेख में."},
{id:"kamzori", title:"Kamzori aur taqat", tags:["kamzori","weakness","takat","energy","thakan","fatigue","कमजोरी","थकान","ताकत","tonic"],
text:"कमजोरी: आंवला रस (खट्टा लगे तो शहद मिलाकर) दिन में 2-3 बार; एक गिलास दूध + 1 चम्मच गाय का घी + मिश्री; च्यवनप्राश दूध/नाश्ते के साथ; गर्म दूध में 2 चम्मच अश्वगंधा + 1 चम्मच घी. साझा किया गया होम्योपैथिक टॉनिक: Alfalfa Q + Ashwagandha Q + Avena Sativa Q + Ginseng Q बराबर मात्रा में मिलाकर, 20-30 बूंद आधे कप पानी में, भोजन से आधा घंटा पहले, दिन में 2-3 बार, 4-5 महीने. थकान में बायां नथुना बंद कर दाएं से सांस लेना ताजगी देता है."},
{id:"vajan", title:"Vajan badhana (dublapan)", tags:["vajan","weight gain","dubla","patla","दुबला","वजन","मोटा होना","thin"],
text:"दुबलेपन के कारण: मंद पाचन, तनाव, हार्मोन असंतुलन, पेट के कीड़े, अनिद्रा, खून की कमी. उपाय: 6 भीगे अंजीर + 25-30 ग्राम किशमिश दिन में 2 बार; दोपहर-रात भोजन के बाद पका केला; दाल में 1 चम्मच देसी घी; उबला आलू; नाश्ते में दलिया; मूंगफली, अंकुरित चने; आम, खजूर, दूध, घी, सूखा मेवा; अश्वगंधा दूध (2 चम्मच + घी, दिन में 2 बार, 1 महीना); शतावरी कल्प, यष्टिमधु. वजन बढ़ाने वाले 8 योगासन भी साझा हुए हैं."},
{id:"thyroid", title:"Thyroid", tags:["thyroid","थायराइड","goiter","गला ग्रंथि","hypothyroid","kanchanar"],
text:"थायराइड में परहेज: सोया और सोया उत्पाद (दुश्मन नंबर 1); फूलगोभी, ब्रोकली, पत्तागोभी (गॉइट्रोजन). लें: आयोडीन, विटामिन D (धूप, दूध, मशरूम), सेलेनियम (अखरोट, बादाम), नियंत्रित व्यायाम. पारंपरिक: कांचनार + पुनर्नवा का क्वाथ 30ml खाली पेट सुबह-शाम; रातभर भीगे धनिये का पानी सुबह; गॉइटर पर पिसी अलसी का लेप; प्रातः 7 काली मिर्च का क्रम. थायराइड की चल रही दवा बिना डॉक्टर के बंद न करें."},
{id:"jod", title:"Jodon aur haddi ka dard", tags:["jod","joint","ghutna","knee","arthritis","गठिया","जोड़","घुटन","हड्डी","kamar","back"],
text:"जोड़ों का दर्द: लहसुन के तेल में थोड़ी हींग और अजवाइन पकाकर मालिश. घुटनों के लिए सुबह खाली पेट 3-4 अखरोट की गिरियां कुछ दिन. हड्डियों के लिए दादी-नानी दूध में चीजें मिलाती थीं (मेथी भी हड्डी-जोड़ के लिए साझा हुई). मेथी-अजवाइन-कालीजीरी चूर्ण गठिया में परंपरागत रूप से प्रयोग होता है. भोजन के बाद वज्रासन वात नियंत्रित करता है."},
{id:"nas-sunn", title:"Nas chadhna, sunnpan, jhanjhanahat", tags:["nas","sunn","numb","jhanjhanahat","नस","सुन्न","झनझनाहट","cramp","magnesium","kapoor","neuropathy"],
text:"हाथ-पैर सुन्न/झनझनाहट: तुलसी, अलसी (ओमेगा-3), गिलोय, अश्वगंधा का सेवन; नारियल तेल की मालिश; B-विटामिन (खासकर B12) की जांच कराएं. नसें खोलने का प्रयोग: डेढ़-दो लीटर गुनगुने पानी में आधा नींबू का रस + 3 कपूर गोली पीसकर, 5-10 मिनट पैर डुबोएं, 5 दिन (पैरों के प्रेशर पॉइंट सिद्धांत). नस चढ़ना, खराब नींद, थकान, BP - ये मैग्नीशियम कमी के संकेत हैं; स्रोत: दही, दूध, बादाम, केला, कद्दू के बीज."},
{id:"ang-shuddhi", title:"Ang shuddhi (liver, kidney, heart, dimag, phephde)", tags:["liver","kidney","detox","safai","लिवर","किडनी","सफाई","fatty liver","lungs","फेफड़","dimag","brain","heart cleanse"],
text:"पारंपरिक अंग-शुद्धि प्रयोग: लिवर - 20 ग्राम काली किशमिश + 1 गिलास पानी का जूस खाली पेट, 15 दिन. किडनी - 40 ग्राम हरा धनिया + 1 गिलास पानी पीसकर खाली पेट, 10 दिन. हृदय - 60 ग्राम पिसी अलसी में से 10-10 ग्राम सुबह-शाम खाली पेट, 1 महीना. दिमाग - 8 बादाम + 2 अखरोट रातभर भिगोकर सुबह, 2 महीने. फेफड़े - 2 चम्मच शहद + 1 चम्मच नींबू रस + 1 चम्मच अदरक रस खाली पेट, 20 दिन (धूम्रपान से हुए नुकसान की परंपरागत भरपाई). फैटी लिवर में चुकंदर का रस भी साझा हुआ."},
{id:"garmi-loo", title:"Loo aur garmi", tags:["loo","garmi","heat","summer","लू","गर्मी","heat stroke","jalan","pyas"],
text:"लू: 2 ग्राम जीरा चूर्ण + पिसी प्याज + मिश्री; प्याज का रस कनपटियों और छाती पर मलना; धूप में निकलते समय जेब में कच्चा प्याज; प्याज-सिरके की चटनी. गर्मियों में बेल, गुलकंद, तरबूज, खरबूजा. शरीर की गर्मी/जलन में गोंद कतीरा रातभर भिगोकर मिश्री-शर्बत के साथ सुबह-शाम; हाथ-पैर की जलन में भी यही या तलवों पर घी की मालिश. तरबूज अकेले खाएं, भोजन से 3 घंटे दूर, ठंडा नहीं; ऊपर भुना जीरा/काला नमक/पुदीना डाल सकते हैं."},
{id:"chhoti-samasya", title:"Chhoti-moti samasyaen", tags:["hichki","ulti","vomit","chakkar","dizzy","peshab","jalan","हिचकी","उल्टी","चक्कर","पेशाब","bedwetting","bistar"],
text:"हिचकी: अदरक चूसना; आधा चम्मच गाय का घी. उल्टी: लौंग पानी में उबालकर पीना; प्याज + नींबू का रस. चक्कर: सौंफ में चीनी मिलाकर. पेशाब में जलन: छोटी इलायची का चूर्ण पानी से; पतली छाछ + चुटकी सोडा. बच्चों का बिस्तर में पेशाब: सोते समय अजवाइन पानी से. मुंह की बदबू: दालचीनी का टुकड़ा मुंह में. कीड़ा काटे तो कच्चे आलू का टुकड़ा + नमक रगड़ें. पेट के कीड़े: छाछ में 5 ग्राम अजवाइन चूर्ण."},
{id:"aankhen", title:"Aankhon ki dekhbhal", tags:["aankh","eye","nazar","नेत्र","आंख","रोशनी","ज्योति","vision","chashma"],
text:"नेत्रज्योति: रोज स्नान से पहले पैरों के अंगूठों पर सरसों का तेल; सुबह नंगे पैर हरी घास पर चलना; आंवला खाना; 20mg आंवला रस + 5 ग्राम शहद चाटना; गाजर रस 20 ग्राम + आंवला रस 40 ग्राम (BP-हृदय में भी); त्रिफला + घी + शहद का क्लासिक संयोजन (शहद चक्षुष्य है). दुखती आंखों में धनिया पत्ती मसलकर रस की बूंद की परंपरा है, पर आंख में कुछ भी डालने से पहले डॉक्टर से पूछना ही समझदारी है. अति गर्म पानी से स्नान नेत्रज्योति घटाता है."},
{id:"kaan", title:"Kaan ki samasyaen", tags:["kaan","ear","कान","दर्द","bahara","मवाद","pus"],
text:"कान दर्द: अदरक का रस की बूंदें परंपरा में. मवाद: सरसों/तिल के तेल में लहसुन पकाकर 1-2 बूंद सुबह-शाम. सामान्य कान दर्द: तिल के तेल में तुलसी पत्ते पकाकर छानकर 2-4 बूंद. कान में कीड़ा जाए: शहद/अरंडी तेल/प्याज रस. ध्यान दें: कान बहना, तेज दर्द, सुनाई कम देना - ये ENT डॉक्टर का काम है; कान के परदे के दावों पर घरेलू प्रयोग न करें. सुनने की सेहत के लिए सहायक 6 आहार पर लेख भी साझा हुआ है."},
{id:"baal-twacha", title:"Baal aur twacha", tags:["baal","hair","twacha","skin","chehra","face","glow","झड़","dandruff","रूसी","निखार","fati"],
text:"बाल: नहाने से पहले प्याज का पेस्ट (सफेद बाल); चायपत्ती के उबले पानी से धोना (झड़ना); भोजन के बाद कंघी की परंपरा; महीने में एक बार नमक से स्कैल्प मसाज (रूसी). त्वचा: बेसन + नींबू रस + शहद + पानी का उबटन; कच्चे आलू का रस (जलन, झुलसी त्वचा, झुर्रियां, दाग); आलू का छिलका प्राकृतिक ब्लीच; मक्खन + केसर (होंठ गुलाबी); सर्दियों में रात को शहद लगाना (निखार); एलोवेरा आइस क्यूब्स. फटी एड़ियां: कपूर-नींबू के गुनगुने पानी में पैर डुबोना."},
{id:"ghee", title:"Desi ghee ke prayog", tags:["ghee","घी","bilona","nasya","नस्य","gaay"],
text:"देसी गाय का घी त्रिदोष-संतुलक माना गया है. प्रमुख पारंपरिक प्रयोग: नाक में 2 बूंद (नस्य) - माइग्रेन, मानसिक शांति, याददाश्त, बाल, नाक की खुश्की; तलवों पर मालिश - जलन और गर्मी वाला सिरदर्द; बच्चों की छाती-पीठ पर पुराना घी - कफ; दूध + घी + मिश्री - कमजोरी; घी + काला चना + खांड के लड्डू - बल. हृदय के लिए कहा गया: अलसी, तिल, नारियल, घी, सरसों का तेल खाएं. घी असली बिलोना विधि का ही (दूध से दही, दही से मक्खन, मक्खन से घी)."},
{id:"shahad", title:"Shahad ke niyam", tags:["shahad","honey","मधु","शहद","madhu"],
text:"शहद का स्वभाव शीतल है (मधु शीतलम् - भावप्रकाश), प्रभाव कफहर. गुण: लघु, रुक्ष, ग्राही, लेखन (जमा मेद-कफ खुरचता है), सूक्ष्म, योगवाही (साथ की औषधि को गहराई तक पहुंचाता है), चक्षुष्य (आंखों के लिए), स्वर्य (आवाज के लिए), व्रणशोधन-रोपण (घाव). उपयोगी: खांसी, दमा, हिचकी, गला, घाव, त्वचा, मोटापा-फैटी लिवर; दस्त और कब्ज दोनों में संतुलक. मात्रा: आधा से 1 चम्मच एक बार, दिन में 2-3 चम्मच से ज्यादा नहीं. कठोर नियम: शहद कभी गर्म नहीं करना, गर्म पानी या गर्म भोजन के साथ नहीं - गर्म शहद विष समान. पुराना शहद ज्यादा गुणकारी. वात=तेल, पित्त=घी, कफ=शहद."},
{id:"churna", title:"Methi-ajwain-kalijiri churna", tags:["methi","ajwain","kalijiri","churna","चूर्ण","मेथी","अजवाइन","कालीजीरी","detox"],
text:"प्रसिद्ध शरीर-शुद्धि चूर्ण: 250 ग्राम मेथीदाना + 100 ग्राम अजवाइन + 50 ग्राम कालीजीरी, तीनों हल्का सेंककर पाउडर बनाकर कांच की शीशी में. रात को सोते समय 1 चम्मच गुनगुने पानी से, बाद में कुछ नहीं खाना. परंपरा में 80-90 दिन में लाभ: जोड़, पाचन, ऊर्जा, त्वचा. जरूरी: कालीजीरी (Purple Fleabane/सोमराजी) कलौंजी नहीं है, पंसारी से अलग मिलती है; स्वाद कड़वा. यह उष्ण-उग्र है: 1-3 ग्राम से ज्यादा कभी नहीं; गर्भावस्था में पूर्ण वर्जित; साइड इफेक्ट हो तो गाय का दूध या आंवला रस. डायबिटीज की चल रही दवा बंद नहीं करनी."},
{id:"gond-katira", title:"Gond katira", tags:["gond","katira","गोंद","कतीरा","garmi","jalan","sharbat"],
text:"गोंद कतीरा ठंडी तासीर का है. 10-20 ग्राम रातभर पानी में फुलाकर मिश्री मिले शर्बत के साथ सुबह-शाम. पारंपरिक प्रयोग: शरीर की गर्मी, हाथ-पैर-सिर की जलन, पेशाब की जलन, अधिक प्यास; मासिक संबंधी समस्याएं (मिश्री के साथ कच्चे दूध से); गले के रोग; पेचिश (6 ग्राम + चीनी); सिरदर्द (मेहंदी के फूल के साथ). गर्मियों में विशेष उपयोगी."},
{id:"herbs", title:"Rasoi ki aushadhiyan", tags:["amla","आंवला","adrak","ginger","tulsi","तुलसी","giloy","गिलोय","ajwain","jamun","karela","alsi","chach","छाछ","neem","नीम","haldi","triphala","त्रिफला"],
text:"आंवला: विटामिन C, इम्युनिटी, कमजोरी, नेत्र; रस + शहद. अदरक/सोंठ: पाचन, दस्त, दांत दर्द में चबाना. अजवाइन: गैस, कफ-भाप, त्वचा लेप. तुलसी: रोज 5-10 पत्ते; नसें, इम्युनिटी. नीम: चैत्र मास में कोंपल; खाली पेट 7 पत्ते की डायबिटीज-परंपरा. गिलोय: रक्तशुद्धि, इम्युनिटी. त्रिफला: त्रिदोष-शामक अमृत; रात में गुनगुने पानी से; मोटापे में त्रिकटु (सोंठ+कालीमिर्च+पिप्पली). छाछ: भोजन के बाद, हींग + सेंधा नमक + जीरा डालकर. जामुन: गुठली का रस सुबह-शाम (शुगर); जामुन सिरका. करेला + टमाटर + खीरा जूस: मधुमेह परंपरा. अलसी: ओमेगा-3, हृदय, नसें. पपीते की पत्ती: प्लेटलेट्स."},
{id:"tridosh", title:"Vat-Pitt-Kaph basics", tags:["vat","pitt","kaph","dosha","वात","पित्त","कफ","tridosh","prakriti","दोष"],
text:"मूल सूत्र: वात के लिए तेल, पित्त के लिए घी, कफ के लिए शहद. निद्रा से पित्त शांत, मालिश से वात शांत, वमन से कफ शांत, लंघन (उपवास) से ज्वर शांत. व्यायाम-क्रम: वात प्रकृति - मालिश के बाद व्यायाम; पित्त - व्यायाम के बाद मालिश; कफ - स्नान के बाद मालिश. वात में नींद कम आती है; पित्त में पढ़ाई अच्छी; कफ में आलस्य और स्नेह अधिक. शाम को वात-नाशक चीजें खाएं. अम्लीय चीजें/फल सूर्यास्त से पहले, क्षारीय बाद में. भारत की जलवायु वात-प्रधान है, दौड़ से बेहतर सूर्य नमस्कार. एसिडिटी पित्त की समस्या है. आंखों के अधिकतर रोग कफ से जोड़े गए हैं."},
{id:"naturopathy", title:"Shatkarma / prakritik chikitsa", tags:["neti","jal neti","kunjal","oil pulling","gandush","nasya","enema","basti","massage","abhyang","steam","नेति","कुंजल","नस्य","मिट्टी","detox","panchakarma"],
text:"ऋतु परिवर्तन पर डिटॉक्स की प्राकृतिक विधियां: जल नेति (नाक-साइनस सफाई; सर्दी, दमा, सिरदर्द, अनिद्रा); कुंजल/वमन क्रिया (त्रिदोषज रोग, पाचन); नयन नेति/आई वॉश; गंडूष यानी oil pulling (मुख-स्वास्थ्य, सेंसिटिविटी); नस्य (नाक से औषधि - माइग्रेन, साइनस, बाल); मिट्टी चिकित्सा (कब्ज, त्वचा रोग, BP); एनीमा/बस्ती (बड़ी आंत की सफाई); अभ्यंग मालिश (रक्तसंचार, स्ट्रेस हार्मोन); स्टीम बाथ. अति गर्म पानी से स्नान वर्जित (आत्मबल, नेत्रज्योति); स्नान अवसाद-नाशक है. हमेशा नाक से सांस लें, मुंह से नहीं - दीर्घायु का सूत्र. ये क्रियाएं पहली बार प्रशिक्षित व्यक्ति की देखरेख में सीखें."},
{id:"millets", title:"Millets / Siridhanya (Dr. Khadar Vali)", tags:["millet","siridhanya","मिलेट","सिरिधान्य","kangni","foxtail","kodo","ragi","jowar","bajra","रागी","ज्वार","बाजरा","ambali","kashayam","anaaj","grain"],
text:"डॉ. खादर वली के अनुसार 5 positive millets (सिरिधान्य): कंगनी (foxtail), सांवा (barnyard), हरी कंगनी (browntop), कुटकी (little), कोदो (kodo). ये fibre-rich हैं और glucose धीरे छोड़ते हैं; गेहूं-चावल को रोज के मुख्य अनाज से हटाने पर जोर. अंबली (खमीर उठाया millet दलिया) और कषायम (काढ़े) उनके protocol के स्तंभ हैं. Ragi, jowar, bajra neutral millets हैं; शरीर की प्रकृति के अनुसार चुनें (कफ में बाजरा गर्म, पित्त में ज्वार-रागी ठंडे). गर्मियों के लिए ठंडी तासीर के millets पर भी सामग्री है. नारियल के जले खोल से दंत-मंजन बनाने की विधि भी डॉ. खादर की पुस्तकों में है. शुरुआत: हफ्ते में 2-3 दिन एक millet को रात भिगोकर खिचड़ी/अंबली रूप में."},
{id:"phal", title:"Phal aur unke laabh", tags:["phal","fruit","फल","kela","seb","anar","aam","papita","tarbuj","अंगूर","अंजीर"],
text:"पारंपरिक फल-लाभ सूची: केला (BP, हड्डी, खांसी; रात के भोजन के बाद पका केला वजन के लिए), जामुन (शुगर, स्मृति), सेब (हृदय, फेफड़े), चुकंदर (BP, खून), नींबू (त्वचा), अंगूर (रक्तप्रवाह, पथरी), आम (पाचन), अखरोट (मूड, स्मृति, घुटने), तरबूज (अकेले खाएं), अंकुरित गेहूं-चने (कब्ज, शक्ति; अंकुरित होने पर पोषण कई गुना), अंजीर (BP, वजन), अलसी (मस्तिष्क, हृदय), जौ (कोलेस्ट्रॉल, त्वचा), पपीता. अनानास सूजन (inflammation) घटाता है. फल सुबह के नाश्ते में सर्वोत्तम; फल खाकर तुरंत पानी नहीं."},
{id:"salad-vajan-ghatana", title:"Vajan ghatane ke salad", tags:["salad","vajan ghatana","weight loss","मोटापा","सलाद","slim","fat"],
text:"वजन घटाने के 5 सलाद: (1) स्प्राउट सलाद - मूंग स्प्राउट्स + टमाटर, प्याज, खीरा, गाजर, नींबू, चाट मसाला. (2) ग्रीन वेजी सलाद - खीरा, टमाटर, गाजर, पत्तागोभी, पालक, शिमला मिर्च. (3) क्विनोआ-वेजी सलाद. (4) चना सलाद - उबला चना + सब्जियां + नींबू. (5) फ्रूट-दही सलाद. साथ में: घूंट-घूंट पानी (एसिडिटी-मोटापा दोनों में), HDL बढ़ाना, छिलके वाली दाल-सब्जियां (कोलेस्ट्रॉल घटाती हैं), शहद का लेखन गुण (मेद खुरचना), त्रिफला, भोजन से आधा घंटा पहले सलाद."},
{id:"gut-fermented", title:"Gut health aur fermented foods", tags:["gut","fermented","probiotic","आंत","kanji","achaar","dahi","kombucha","idli","digestion weekly"],
text:"आंत-स्वास्थ्य के लिए साप्ताहिक fermented भारतीय भोजन की सलाह बार-बार साझा हुई: कांजी, घर का दही-छाछ, देसी अचार, इडली-डोसा-ढोकला संस्कृति, kimchi-sauerkraut के देसी विकल्प, घर पर kombucha. दही से ज्यादा probiotic वाले भोजन और घर पर बनने वाली 7 probiotic recipes (आयुर्वेदिक विशेषज्ञ) के लेख समूह में हैं. AIIMS गैस्ट्रो विशेषज्ञ की 8 रसोई-जड़ी सूची भी साझा हुई - उपचार रसोई से शुरू होता है."},
{id:"mann", title:"Mann, mood aur tanav", tags:["mann","mood","stress","tanav","तनाव","oxytocin","khushi","happy","depression","udaas","anxiety"],
text:"मन अच्छा रखने के साझा उपाय: पसंदीदा खाना बनाना-खाना, ध्यान, व्यायाम (एंडोर्फिन), मालिश, दोस्तों के साथ समय, योग, स्वयं के प्रति दया, गहरी सांस. चिंता-क्रोध-ईर्ष्या को कब्ज, BP, थायराइड जैसी समस्याओं से जोड़ा गया है; चिंता बुढ़ापा लाती है (चिंता जरा नाम मनुष्याणाम्). स्नान अवसाद-नाशक है. सत्संग सूत्र: अपेक्षा दुख देती है; प्रतिक्रिया से पहले गहरी सांस; खुश रहना है तो किसी और को खुश करो; खुश रहने का निर्णय भी एक दवा है. अगर मन बहुत भारी रहे, नींद-भूख लंबे समय से बिगड़ी हो, तो किसी अपने से और professional से बात जरूर करें."},
{id:"budhapa", title:"Budhapa bimari nahi", tags:["budhapa","old","elderly","बुजुर्ग","बुढ़ापा","aging","yaaddasht","memory","parents"],
text:"साझा लेख का सार - बीमारी नहीं, बुढ़ापा है: हल्की भूलने की आदत डिमेंशिया नहीं (चाबी भूलें पर ढूंढ लें तो चिंता नहीं); धीमा चलना लकवा नहीं, मांसपेशियों को movement चाहिए, दवा नहीं; बुजुर्गों की अनिद्रा में नींद की गोलियों से बचें - धूप और नियमित दिनचर्या सबसे अच्छी नींद की दवा; 99% शरीर-दर्द central sensitization है - व्यायाम, सोने से पहले गर्म पानी में पैर, सेंक, हल्की मालिश; बुजुर्गों का BP लक्ष्य <150/90 पर्याप्त; थोड़ा अधिक कोलेस्ट्रॉल सामान्य. तीन बातें: हर असुविधा बीमारी नहीं; रिपोर्ट से डरें नहीं; बच्चों का असली कर्तव्य साथ टहलना, धूप, भोजन और बातें. एकाकीपन सबसे बड़ी समस्या; जीवन का नियंत्रण अपने हाथ में रखें."},
{id:"jeevan-sutra", title:"Jeevan ke sutra (satsang saar)", tags:["satsang","spiritual","सत्संग","gyan","quote","prerna","motivation","sukh","khushi","anti bucket"],
text:"सत्संग सार: स्वयं का पुरुषार्थ ही तकदीर बदलता है, दूसरे केवल मार्ग दिखा सकते हैं. संगति की शुद्धि - व्यवहार संग से बनता है. संबंध जोड़ना नहीं, निभाना साधना है; विश्वास संबंधों की ईंट है. क्षमा देवता का गुण है. वर्तमान का आनंद; परिवर्तन की स्वीकृति. अपेक्षा हमेशा दुख देती है. Anti-bucket list का विचार: यह तय करना कि किन चीजों की आपको जरूरत नहीं, उतना ही मुक्तिदायक है जितना लक्ष्य बनाना; हर अनुभव को content बनाने की जरूरत नहीं, बिना upload किए जिए पल सबसे कीमती. जीवन-सूत्र: प्रतिक्रिया से पहले गहरी सांस, बोलने से पहले सुनना, आलोचना से पहले आत्म-दर्शन."},
{id:"jaipur", title:"Jaipur ke wellness kendra", tags:["jaipur","centre","clinic","kendra","जयपुर","naturopathy centre","panchakarma","vaidya","नाड़ी"],
text:"जयपुर के केंद्र (समूह में साझा): The Nature - A Complete Wellness Centre (योग, प्राकृतिक एवं पंचकर्म चिकित्सालय), प्रथम तल 3/186, संत गंगाराम साहिब मंदिर, सेक्टर 3, मालवीय नगर, जयपुर 302017; संपर्क 9413224577 / 9667937093. पंचतत्वम प्राकृतिक चिकित्सा केंद्र, मालवीय नगर - डॉ. दीपाली वार्ष्णेय (सुजोक थेरेपिस्ट एवं नेचुरोपैथ) 9887149904. श्री श्री तत्वा - मंत्र पंचम आयुर्वेद सेंटर, जयपुर 9351157100 (नाड़ी परीक्षण, positive millets आधारित). Yogashray Sewayatan (naturopathy और योग)."},
{id:"videos-food", title:"Videos: khanpan", tags:["video","reel","dekhna","watch","खानपान video","food video"],
text:"खानपान-पोषण से जुड़े कुछ video links (Facebook reels, समूह से): 03/06/2026 - facebook.com/share/r/1DUFSt3bSK , facebook.com/share/r/17TTMwwiPr , facebook.com/share/r/1J4tvj9PHB ; 06/04/2026 - facebook.com/share/r/1HDJQo5jP4 . कुल 83 food/nutrition videos tag हुए हैं; पूरी सूची video index file में है. Video ka content dekhe bina pata nahi chal sakta, links kholkar dekh sakte hain."},
{id:"videos-pachan", title:"Videos: pachan", tags:["video pachan","digestion video","pet video"],
text:"पाचन से जुड़े कुछ video links: 12/04/2026 - facebook.com/share/r/1Gg2QfupLr , facebook.com/share/r/1Caig3uTwm ; 30/03/2026 - facebook.com/share/r/1GCn2ku6ZR , facebook.com/share/r/187GnmdCqP . कुल 70 digestion videos; पूरी सूची video index file में."},
{id:"videos-yoga-mann", title:"Videos: yoga, neend, mann", tags:["yoga video","sleep video","meditation video","gurudev"],
text:"योग/प्राणायाम videos: 01/06/2026 - facebook.com/share/r/1Kv4sPufNU , facebook.com/share/r/17dtHFe9Sx ; 20/11/2025 - facebook.com/share/r/1DAn6aebDS . नींद/मन: 03/12/2025 - facebook.com/share/v/1FmZtsFVMA ; 15/01/2026 - facebook.com/share/v/168KmngEir . YouTube: Mahakumbh Meditation With Gurudev - youtube.com/watch?v=Nu_vLANMpYQ . पूरी सूची video index file में."},
{id:"videos-heart-millets", title:"Videos: hriday, millets, satsang", tags:["heart video","millet video","satsang video","bp video"],
text:"हृदय/BP videos: 25/05/2026 - facebook.com/share/r/1CuLeMLKPS , facebook.com/share/r/1F85grZe1N . Millets: 22/04/2026 - facebook.com/share/r/1BQufZHfPd , facebook.com/share/r/1AsyKEctZ5 ; 01/06/2026 - facebook.com/share/r/1NiYktmfBg . सत्संग: 26/04/2026 - facebook.com/share/v/19Rb9X9aw1 . जोड़ों के लिए: 01/10/2025 - facebook.com/share/r/1CeRa88bQD . कुल 1,495 video links में से 257 topic-tagged हैं; बाकी video index file में month-wise हैं."},
{id:"safety", title:"Suraksha niyam", tags:["emergency","danger","saanp","snake","heart attack","lakwa","stroke","chest pain","seene mein dard","behosh","saans","breathing","108","vaccine","टीका","दौरा","आपात"],
text:"आपात स्थिति के नियम (अनिवार्य): सीने में दर्द/हृदयाघात, लकवे के लक्षण (चेहरा टेढ़ा, बोलने-उठने में दिक्कत), सांप का काटना, सांस की गंभीर तकलीफ, बेहोशी, तेज लगातार बुखार, डेंगू - इनमें कोई घरेलू नुस्खा नहीं, तुरंत 108 पर कॉल करें या नजदीकी अस्पताल जाएं. सुई चुभोकर खून निकालना, सांप के काटने पर घी पिलाना - ये खतरनाक मिथक हैं, कभी न करें. टीकाकरण (vaccines) जरूरी है. डॉक्टर की चल रही दवा (BP, शुगर, थायराइड) कभी अपने मन से बंद न करें - नुस्खे दवा के साथ सहायक हैं, विकल्प नहीं. भस्में और कालीजीरी केवल योग्य वैद्य की देखरेख में; गर्भावस्था में कालीजीरी पूर्ण वर्जित. गर्भावस्था, स्तनपान, शिशु, बुजुर्ग और गंभीर रोगों में हर नुस्खा डॉक्टर/वैद्य से पूछकर."}
];


const SYN = {
 "acidity":["एसिडिट","अम्लपित्त","jalan"], "gas":["गैस","अपान"], "constipation":["कब्ज","kabz"], "kabz":["कब्ज","constipation"],
 "pet":["पेट","pachan","पाचन","digestion"], "stomach":["पेट","pachan","digestion"], "digestion":["पाचन","pachan","pet"],
 "fever":["बुखार","bukhar","ज्वर"], "bukhar":["बुखार","fever"], "cough":["खांसी","khansi","कफ"], "cold":["सर्दी","sardi","जुकाम"],
 "sleep":["नींद","neend","sona","अनिद्रा"], "neend":["नींद","sleep","अनिद्रा"], "insomnia":["अनिद्रा","नींद","neend"],
 "headache":["सिरदर्द","sirdard","migraine"], "migraine":["माइग्रेन","sirdard","सिरदर्द"],
 "weight":["वजन","vajan","मोटापा"], "vajan":["वजन","weight"], "mota":["वजन","weight","मोटापा"],
 "hair":["बाल","baal"], "skin":["त्वचा","twacha","chehra"], "eye":["आंख","aankh","नेत्र"], "ear":["कान","kaan"],
 "honey":["शहद","shahad","मधु"], "shahad":["शहद","honey"], "ghee":["घी"], "milk":["दूध","doodh"],
 "millet":["मिलेट","सिरिधान्य","siridhanya","ragi","jowar","bajra"], "sugar":["शुगर","डायबिट","diabetes","मधुमेह"],
 "diabetes":["डायबिट","शुगर","मधुमेह","jamun"], "bp":["रक्तचाप","blood pressure","hriday"], "heart":["हृदय","hriday","दिल"],
 "thyroid":["थायराइड"], "liver":["लिवर","यकृत"], "kidney":["किडनी"], "immunity":["रोग प्रतिरोध","आंवला","गिलोय","तुलसी"],
 "stress":["तनाव","tanav","mann"], "tanav":["तनाव","stress"], "anxiety":["तनाव","चिंता","mann"],
 "joint":["जोड़","jod","घुटन","गठिया"], "knee":["घुटन","जोड़","jod"], "arthritis":["गठिया","जोड़"],
 "video":["reel","videos"], "morning":["सुबह","subah","दिनचर्या"], "routine":["दिनचर्या","dinacharya"],
 "weakness":["कमजोरी","kamzori","थकान"], "energy":["ताकत","कमजोरी","थकान"], "tired":["थकान","कमजोरी"],
 "anemia":["खून","रक्त","हीमोग्लोबिन"], "blood":["खून","रक्त"], "detox":["सफाई","shuddhi","शुद्धि"],
 "summer":["गर्मी","लू","garmi"], "garmi":["गर्मी","लू"], "dosha":["वात","पित्त","कफ","दोष"],
 "salt":["नमक","सेंधा"], "oil":["तेल"], "water":["पानी","जल"], "fruit":["फल","phal"], "salad":["सलाद"],
 "mouth":["मुंह","छाले","chhale"], "ulcer":["छाले","chhale"], "throat":["गला","gala"],
 "elderly":["बुजुर्ग","बुढ़ापा"], "old":["बुजुर्ग","बुढ़ापा"], "parents":["बुजुर्ग","माता-पिता"],
 "jaipur":["जयपुर","kendra"], "doctor":["वैद्य","kendra","जयपुर"]
};


function expand(q){
  const words = q.toLowerCase().replace(/[?!.,:;'"()]/g,' ').split(/\s+/).filter(w=>w.length>1);
  const terms = new Set(words);
  for (const w of words){ (SYN[w]||[]).forEach(t=>terms.add(t.toLowerCase())); }
  return [...terms];
}

function retrieve(query, k=5){
  const terms = expand(query);
  const scored = CHUNKS.map(c=>{
    const tagStr = c.tags.join(' ').toLowerCase();
    const titleStr = c.title.toLowerCase();
    const textStr = c.text.toLowerCase();
    let s = 0;
    for (const t of terms){
      if (tagStr.includes(t)) s += 3;
      if (titleStr.includes(t)) s += 2;
      if (textStr.includes(t)) s += 1;
    }
    return {c, s};
  }).filter(x=>x.s>0).sort((a,b)=>b.s-a.s);

  let picked = scored.slice(0,k).map(x=>x.c);
  // emergency terms force the safety chunk
  const EMERG = ["heart attack","chest pain","seene","सीने","saanp","snake","सांप","lakwa","लकवा","stroke","behosh","बेहोश","saans","सांस नहीं","emergency","108","poison","zeher","जहर","suicide","khudkushi"];
  const ql = query.toLowerCase();
  if (EMERG.some(t=>ql.includes(t)) && !picked.find(c=>c.id==="safety")){
    picked = [CHUNKS.find(c=>c.id==="safety"), ...picked].slice(0,k);
  }
  if (picked.length===0) picked = [CHUNKS.find(c=>c.id==="dinacharya-subah"), CHUNKS.find(c=>c.id==="herbs")];
  return picked;
}


const BASE_RULES = `You are "Dadi", a warm Indian grandmother who shares paramparik gharelu nuskhe. You speak with affection (beta, bachche), simple language, and practical steps.

Rules:
1. Answer in the user's language: Hinglish gets Hinglish, Hindi gets Hindi, English gets English. Keep answers under ~180 words unless more detail is asked. No em dashes, simple punctuation.
2. Use ONLY the retrieved nuskhe below in <nuskhe> tags as your primary knowledge. Refer to them naturally as "mere nuskhon mein" or "parampara mein". Never mention any WhatsApp group, any person named Sudhir, chunks, retrieval, or a knowledge base.
3. If the retrieved nuskhe do not cover the question, say honestly "yeh mere pitare mein nahi hai beta" and give brief, well-accepted general guidance, clearly marked as general gyaan.
4. Frame remedies as traditional practice, never guaranteed cures. Never claim cures for cancer, deafness, or that vaccines are unnecessary.
5. SAFETY (non-negotiable): chest pain, stroke signs, snake bite, breathing trouble, unconsciousness, high or persistent fever, dengue: tell them to call 108 or reach a hospital immediately, with no folk emergency remedies. Never advise stopping prescribed medicines. Kalijiri is fully forbidden in pregnancy; bhasmas only under a qualified vaidya. For pregnancy, breastfeeding, infants, elderly with conditions, or anyone on medication, add one line to confirm with their doctor or vaidya.
6. End remedy answers with one short caring line like "Aur haan beta, takleef bani rahe to doctor ko zaroor dikhana." Do not repeat it robotically in casual chats.
7. If asked for videos, share the links present in the retrieved nuskhe (write them as plain URLs) and mention that a fuller video index exists.`;



export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).json({error:'POST only'});
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({error:'GEMINI_API_KEY not set'});

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 40)
    return res.status(400).json({error:'bad messages'});

  const lastUser = [...messages].reverse().find(m=>m.role==='user');
  const prevUser = messages.filter(m=>m.role==='user').slice(-2,-1).map(m=>m.content).join(' ');
  const retrieved = retrieve((lastUser?.content || '') + ' ' + prevUser, 5);

  const system = BASE_RULES + '\n\n<nuskhe>\n' +
    retrieved.map(c=>'['+c.title+']\n'+c.text).join('\n\n') + '\n</nuskhe>';

  const contents = messages.slice(-20).map(m=>({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(m.content).slice(0, 4000) }]
  }));

  try{
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' +
      (process.env.GEMINI_MODEL || 'gemini-2.5-flash') + ':generateContent?key=' + apiKey, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents,
        generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
      })
    });
    const data = await r.json();
    if (data.error) return res.status(502).json({error: data.error.message});
    const text = (data.candidates?.[0]?.content?.parts || []).map(p=>p.text||'').join('').trim();
    return res.status(200).json({ text, sources: retrieved.slice(0,3).map(c=>c.title) });
  } catch(e){
    return res.status(502).json({error: e.message});
  }
}
