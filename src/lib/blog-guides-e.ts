// Bharat AI Sathi — long-form editorial guides (part E).
// Each article is 1,000+ words, written for Indian readers, with
// H2 (##) and H3 (###) structure in simple Hinglish.

import type { BlogPost } from "./blog-posts";

const G = (
  title: string,
  description: string,
  category: BlogPost["category"],
  date: string,
  readMinutes: number,
  body: string,
  author = "Bharat AI Sathi Editorial",
): BlogPost => ({
  slug: title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, ""),
  title,
  description,
  category,
  author,
  date,
  readMinutes,
  body: body.trim(),
});

export const GUIDE_POSTS_E: BlogPost[] = [
  G(
    "UPI payment fail ho gaya par paise kat gaye? Refund, complaint aur galat UPI transfer ka poora tareeka",
    "Account se paise kat gaye par saamne wale ko nahi mile, ya galti se galat UPI ID par bhej diye? Kitna intezaar karein, app aur bank mein complaint kaise karein aur RBI tak kab jaayein.",
    "Finance",
    "2026-11-22",
    7,
    `UPI ne roz ka lena-dena bahut aasaan kar diya hai, lekin kabhi-kabhi ek ajeeb situation aati hai: screen par "Failed" ya "Pending" likha aata hai, phir bhi bank ka SMS bata deta hai ki account se paise kat gaye. Pehli baar aisa ho toh ghabrahat hoti hai. Achhi baat yeh hai ki zyaadatar failed transactions mein paise apne-aap wapas aa jaate hain. Is guide mein hum samjhenge ki kis situation mein kitna intezaar karna sahi hai, complaint kahan aur kaise karein, aur galat UPI ID par paise chale jaayein toh kya karein.

Ek zaroori baat shuru mein hi: refund ke naam par koi bhi call, SMS ya social media account aapse UPI PIN, OTP ya "collect request approve" karne ko kahe toh samajh lijiye ki yeh fraud hai. Paise wapas lene ke liye kabhi bhi PIN daalne ki zaroorat nahi padti.

## Pehle samjhein: aapka transaction kis category mein hai

Har problem ka hal alag hai. Isliye sabse pehle apne case ko pehchaanein.

### 1. Failed, par account se debit ho gaya

Yeh sabse aam case hai. Network ya bank server ki dikkat ki wajah se payment beech mein ruk jaata hai. Aise mein system aam taur par paise apne-aap reverse kar deta hai. RBI ke failed transactions wale turnaround time ke niyam ke anusaar, UPI mein agar aapka account debit hua aur saamne wale ko credit nahi hua, toh auto-reversal aam taur par agle working din (T+1) tak ho jaana chahiye. Der hone par bank ki taraf se compensation ka bhi pravdhaan hai. Niyam samay ke saath badal sakte hain, isliye current details RBI ya apne bank ki website par check karein.

### 2. Pending ya "processing"

Pending ka matlab hai ki final status abhi tay nahi hua. Is dauraan baar-baar wahi payment dobara na karein, warna dono payment success ho sakte hain. Kuch ghante ya agle working din tak status update hone ka intezaar karein. Dukaandaar ke saath ho toh unke app ya bank statement mein bhi check karwa lein.

### 3. Success, par merchant keh raha hai paise nahi mile

Agar aapke app mein Success dikh raha hai aur UTR/UPI reference number bana hai, toh merchant ko woh number dein. Bahut baar paise merchant ke account mein aa chuke hote hain, bas unka notification late hota hai.

### 4. Galat UPI ID ya number par paise bhej diye

Yeh failed transaction nahi hai. Paise sahi tareeke se doosre vyakti ko pahunch gaye hain, isliye auto-reversal nahi hota. Ismein saamne wale ki sahmati aur bank ki madad chahiye hoti hai. Iske steps neeche alag se diye gaye hain.

## Turant kya karein: pehle 10 minute ki checklist

- App ki transaction history mein jaakar status dekhein aur screenshot lein.
- UPI transaction ID ya UTR number note karein. Yeh 12 digit ka reference hota hai.
- Bank ka debit SMS ya statement entry sambhaal kar rakhein.
- Date, samay, amount aur jisko bheja uska naam ya UPI ID likh lein.
- Wahi payment dobara karne se pehle pakka kar lein ki pehla wala fail hi hua hai.

Yeh details aage har complaint mein kaam aayengi. Bina UTR ke complaint ko track karna mushkil hota hai.

## Complaint kahan karein: sahi kram

Seedha RBI ke paas jaane se pehle ek tay kram follow karna zaroori hai. Har level par complaint number zaroor lein.

### Step 1: UPI app ke andar

Lagbhag har UPI app mein transaction par click karne ke baad "Help", "Raise dispute" ya "Report issue" jaisa option hota hai. Wahan se complaint karna sabse tez tareeka hai, kyunki transaction ki saari details apne-aap jud jaati hain. Complaint ka reference number save karein.

### Step 2: Apne bank mein

Jis bank account se paise kate, uske customer care, net banking ke complaint section ya branch mein likhit complaint karein. UTR number, date aur amount saaf likhein. Bank ki official website ya passbook par diye gaye number hi istemal karein. Google search mein dikhne wale "customer care number" par bharosa na karein, kyunki fraudsters nakli number daal dete hain.

### Step 3: NPCI ka UPI complaint section

NPCI ki official website (npci.org.in) par UPI ke liye dispute redressal ki jaankari aur complaint form hota hai. Agar app aur bank se samadhan na mile toh yahan transaction ki details ke saath complaint darj kar sakte hain.

### Step 4: RBI Ombudsman

Agar bank ne complaint ka jawab 30 din mein nahi diya, ya jawab se aap santusht nahi hain, toh RBI ki Integrated Ombudsman Scheme ke tahat cms.rbi.org.in par complaint kar sakte hain. Isme pehle bank ko di gayi complaint ki copy aur reference number kaam aate hain. Yeh service free hai; iske liye kisi agent ko paise dene ki zaroorat nahi.

## Galat UPI ID par paise chale gaye: kya karein

Jaldi action lena sabse zaroori hai.

1. Agar aap us vyakti ko jaante hain, toh seedha sampark karke politely paise wapas maangein. Kai baar log khud lauta dete hain.
2. Apne UPI app mein us transaction par complaint darj karein aur "sent to wrong account" chunein.
3. Apne bank ko turant likhit mein batayein. Bank saamne wale bank se sampark kar sakta hai, lekin paise lautana aam taur par saamne wale ki sahmati par nirbhar karta hai.
4. Agar saamne wala mana kare ya maamla dhokhe ka lage, toh bank aur zaroorat ho toh police ki salah lein.

Seedhi baat yeh hai ki galat transfer mein wapsi ki guarantee nahi hoti. Isliye bachav hi sabse achha ilaaj hai.

## Agar yeh fraud hai, failed transaction nahi

Agar kisi ne aapko dhokhe se payment karwaya, aapke account se bina jaankari ke paise nikle, ya "refund" ke naam par PIN daalwaya, toh yeh cyber fraud hai. Aise mein turant national cyber crime helpline 1930 par call karein aur cybercrime.gov.in par complaint darj karein. Saath hi bank ko card/UPI block karne ke liye kahein. Jitni jaldi report hogi, paise rokne ki sambhavna utni behtar hogi.

## Aage se bachne ke 8 aadatein

- Paise bhejne se pehle screen par dikh raha naam (registered name) zaroor padhein.
- Naye vyakti ko badi rakam bhejne se pehle ₹1 bhejkar confirm karein.
- QR code sirf paise bhejne ke liye scan hota hai; paise lene ke liye kabhi scan ya PIN ki zaroorat nahi.
- Anjaan "collect request" ko kabhi approve na karein.
- Ek hi bank account ko UPI ke liye rakhein jismein seemit balance ho.
- App aur phone ka software update rakhein.
- Screen lock aur app lock on rakhein.
- Customer care number sirf official app ya website se lein.

## Bharat AI Sathi kaise madad kar sakta hai

Bank ko likhit complaint ya follow-up email likhne mein dikkat ho toh Bharat AI Sathi ka Letter Writer (/letter) ya AI Chat (/chat) aapki details se ek saaf draft bana sakta hai. Draft mein sirf zaroori jaankari daalein: date, amount, UTR aur aapka naam. Apna UPI PIN, card number, CVV ya OTP kisi bhi AI tool, chat ya form mein kabhi na likhein. Final draft ko khud padhkar bank ke official channel se hi bhejein.

## Nishkarsh

Zyaadatar failed UPI payments mein paise apne-aap wapas aa jaate hain; bas thoda intezaar aur sahi records chahiye. Agar samay seema ke baad bhi paise na aayein toh app, bank, NPCI aur phir RBI Ombudsman ka kram follow karein, aur har step par reference number sambhaalein. Galat transfer aur fraud alag maamle hain, isliye unmein turant action lein. Sabse badi suraksha yeh yaad rakhna hai: paise wapas lene ke liye PIN kabhi nahi lagta.`,
  ),
  G(
    "Sarkari naukri ka online form bharne ki poori checklist: photo-signature, fees aur final submit se pehle jaanch",
    "SSC, railway, bank, police ya state recruitment form bharte waqt hone wali galtiyon se bachein — notification padhne, documents taiyar karne, photo size, fees payment aur printout tak step-by-step.",
    "Jobs",
    "2026-11-21",
    7,
    `Sarkari naukri ki taiyari mein mahine lag jaate hain, lekin kabhi-kabhi ek chhoti si galti — galat category, dhundhli photo ya fees ka adhoora payment — saari mehnat par paani pher deti hai. Online application form dekhne mein simple lagta hai, par har recruitment ke apne niyam hote hain. Yeh guide ek practical checklist hai jo SSC, railway, banking, police, teaching ya state PSC jaise zyaadatar recruitment forms par laagu hoti hai. Har exam ke specific niyam uske official notification se hi confirm karein; yahan diye gaye points sirf general tareeka hain.

## Step 1: Notification poora padhein, sirf headline nahi

Form bharne se pehle official notification ka PDF download karein aur dhyaan se padhein. Social media post ya coaching ka summary kaafi nahi hai, kyunki usmein zaroori shartein chhoot sakti hain.

### Notification mein yeh cheezein dhoondhein

- Last date aur fees bharne ki alag last date (kai baar dono alag hoti hain).
- Umra seema aur kis tareekh ke hisaab se umra ginni hai.
- Shaikshik yogyata aur kis tareekh tak result aa jaana chahiye.
- Category ke hisaab se umra mein chhoot aur fees mein chhoot.
- Photo, signature aur doosre documents ka size, format aur dimension.
- Exam centre chunne ke niyam aur kitne options milte hain.
- Correction window milegi ya nahi.

Ek kaagaz par apni eligibility ka chhota summary likh lein. Agar koi shart samajh na aaye toh helpdesk number ya FAQ section dekhein jo notification mein diya hota hai.

## Step 2: Sirf official website se apply karein

Har saal nakli websites aur fake links failte hain jo bilkul sarkari portal jaise dikhte hain. Website ka address notification PDF se milayein. Sarkari portals ka domain aam taur par gov.in ya nic.in hota hai, lekin kuch recruitment bodies apne alag official domain bhi use karti hain, isliye notification mein diya link hi sabse bharosemand hai. WhatsApp par aaye "direct apply" link par click na karein.

## Step 3: Documents pehle se taiyar rakhein

Form bharte waqt documents dhoondhne se session timeout ho sakta hai. Ek folder banakar sab kuch pehle se ready rakhein.

### Aam taur par zaroori documents

- 10th ki marksheet ya certificate (naam aur janm tithi ke liye).
- Highest qualification ki marksheet/degree.
- Category certificate (SC/ST/OBC/EWS) — validity aur format notification ke hisaab se.
- Domicile, PwBD ya ex-serviceman certificate, agar laagu ho.
- Aadhaar ya doosra photo ID.
- Kaam karne wala mobile number aur email ID jo aap khud chalaate hain.

Ek important baat: OBC (non-creamy layer) aur EWS certificate mein aksar ek tay financial year ya tareekh ki shart hoti hai. Purana certificate kaam nahi bhi aa sakta. Notification mein diya format zaroor dekhein.

## Step 4: Photo aur signature sahi banayein

Photo-signature ki galti sabse zyaada rejection ki wajah banti hai. Har recruitment ka size alag hota hai, isliye koi bhi fixed number yaad karke na chalein; notification mein diya size (KB mein) aur dimension hi follow karein.

### Photo ke liye dhyaan rakhein

- Haal hi ki rangeen photo, saaf safed ya halke rang ka background.
- Chehra seedha, aankhein khuli, chashma ho toh reflection na ho.
- Selfie ya filter wali photo na lagayein.
- Kuch forms mein photo par naam aur tareekh likhi honi chahiye — notification check karein.

### Signature ke liye dhyaan rakhein

- Safed kaagaz par kaale ya neele pen se sign karein.
- Capital letters mein naam likhna aam taur par signature nahi maana jaata.
- Wahi signature baad mein exam hall aur joining par bhi karna hoga, isliye apna asli sign hi karein.

Image ka size kam-zyada karne ke liye Bharat AI Sathi ke tools section (/tools) mein image se jude utility tools dekh sakte hain. Resize karne ke baad photo ko zoom karke dekhein ki chehra dhundhla toh nahi hua.

## Step 5: Registration aur form bharna

### Naam aur janm tithi

Naam bilkul waise hi likhein jaise 10th ke certificate mein hai. Spelling ka chhota sa farak bhi document verification ke samay dikkat de sakta hai. Janm tithi DD/MM/YYYY format mein dhyaan se bharein.

### Category aur chhoot

Sirf wahi category chunein jiska valid certificate aapke paas hai. Galat category chunne par form baad mein reject ho sakta hai, chahe aap exam pass kar lein.

### Exam centre aur post preference

Centre aur post ki preference sochkar bharein. Kai exams mein submit ke baad ise badalna sambhav nahi hota.

### Registration number sambhaalein

Registration ke baad mila number aur password kahin likh lein ya screenshot lein. Admit card aur result ke samay iski zaroorat padegi.

## Step 6: Fees payment

- Payment sirf form ke andar diye gaye official payment gateway se karein.
- Network achha ho tab payment karein; beech mein page refresh na karein.
- Payment ke baad status "Success" dikhe aur transaction ID mile, tab tak page band na karein.
- Agar paise kat gaye par status pending hai, toh turant dobara payment na karein. Portal par "verify payment" ya "payment status" option dekhein ya helpdesk se sampark karein.

Fees ki last date ka intezaar na karein. Aakhri din server par bheed hoti hai aur payment fail hone ki sambhavna badh jaati hai.

## Step 7: Final submit se pehle 10-point jaanch

1. Naam, pita/mata ka naam aur janm tithi certificate se milte hain.
2. Category, gender aur PwBD status sahi hai.
3. Qualification aur marks sahi bhare gaye hain.
4. Photo aur signature apni sahi jagah par hain, ulte nahi lage.
5. Mobile number aur email sahi hai.
6. Exam centre ki choice sahi hai.
7. Post preference sahi order mein hai.
8. Fees ka status Success hai.
9. Preview page ka PDF save kiya.
10. Final submit ke baad confirmation page download kiya.

Preview ko jaldi-jaldi scroll na karein. Har field ko ek baar zor se padhkar dekhein — isse galti pakadna aasaan hota hai.

## Step 8: Submit ke baad kya karein

- Confirmation page aur fees receipt ki do printout nikaal kar rakhein.
- Email aur SMS par aane wale updates dekhte rahein.
- Correction window khule toh zaroorat ho tabhi aur dhyaan se badlaav karein.
- Admit card ki tareekh official website par check karte rahein.

Apni saari applications ki list ek jagah rakhne ke liye Bharat AI Sathi ka Government Hub (/gov) dekh sakte hain. Kisi bhi online service mein apna Aadhaar number, bank details ya password share karne se pehle samjhein ki woh kahan aur kyun store ho raha hai.

## Fraud se savdhaan

Koi bhi vyakti jo paise lekar "pakki naukri" ya "setting" ka vaada kare, woh dhokha hai. Sarkari recruitment ki fees sirf official portal par bharti jaati hai. Agar aisa koi call ya message aaye toh cybercrime.gov.in par ya 1930 helpline par report karein.

## Nishkarsh

Sarkari naukri ka form bharna mushkil nahi, bas dhyaan aur taiyari chahiye. Notification poora padhein, documents pehle se ready rakhein, photo-signature notification ke hisaab se banayein, aur final submit se pehle har field jaanch lein. Aakhri din ka intezaar na karein. Ek baar sahi bhara form aapki mehnat ko exam hall tak pahunchata hai.`,
  ),
  G(
    "Google Sheets aur Excel ke 12 formulas jo dukaan, office aur ghar ka hisaab aasaan karein",
    "SUM, SUMIF, COUNTIF, IF, VLOOKUP, XLOOKUP, UNIQUE aur FILTER jaise zaroori formulas — asli Indian examples ke saath: dukaan ki bikri, staff attendance, ghar ka budget aur student marks.",
    "Productivity",
    "2026-11-20",
    8,
    `Bahut se log spreadsheet ko sirf ek badi table samajhte hain jismein numbers likhe jaate hain. Lekin kuch basic formulas seekh lene se wahi sheet aapka hisaab apne-aap laga sakti hai: din ki bikri, mahine ka kharcha, staff ki haaziri ya class ke marks. Is guide mein hum 12 aise formulas dekhenge jo Google Sheets aur Microsoft Excel dono mein lagbhag ek jaise chalte hain, aur har ek ka asli zindagi ka example denge. Aapko coding nahi aani chahiye — bas thoda practice chahiye.

## Shuru karne se pehle 3 basic baatein

### Cell address samjhein

Har cell ka ek address hota hai, jaise A1 (column A, row 1). Range ka matlab hai cells ka group, jaise A2:A31 yaani A2 se A31 tak.

### Har formula = se shuru hota hai

Cell mein =SUM(B2:B10) likhenge toh sheet use formula samjhegi. Bina = ke woh sirf text hai.

### Data saaf rakhein

Ek column mein ek hi tarah ka data rakhein: date ke column mein sirf dates, amount ke column mein sirf numbers. "₹500" ko text ki tarah type karne ki jagah 500 likhein aur format se ₹ lagayein. Saaf data ke bina koi formula sahi kaam nahi karega.

## Roz ke hisaab ke formulas

### 1. SUM — kul jod

Example: Column B mein mahine bhar ki roz ki bikri hai. =SUM(B2:B31) poore mahine ka total de dega. Naya din jodne par total apne-aap update hoga.

### 2. AVERAGE — ausat

=AVERAGE(B2:B31) se pata chalega ki ek din mein ausatan kitni bikri hui. Student ke marks ka average nikaalne mein bhi yahi kaam aata hai.

### 3. MAX aur MIN — sabse zyaada aur sabse kam

=MAX(B2:B31) sabse achhe din ki bikri batayega, =MIN(B2:B31) sabse kamzor din ki. Isse aap samajh sakte hain ki kaunse din offers chalaane chahiye.

### 4. ROUND — decimal theek karna

GST ya discount ke baad amount 1,234.5678 jaisa aa sakta hai. =ROUND(C2, 2) use do decimal tak kar dega. Rupaye mein poora number chahiye toh =ROUND(C2, 0).

## Shart (condition) wale formulas

### 5. IF — haan ya na ka faisla

Example: Column C mein student ke marks hain aur pass hone ke liye 33 chahiye. =IF(C2>=33, "Pass", "Fail"). Dukaan mein: =IF(D2<10, "Stock mangwao", "Theek hai") batayega ki kis item ka stock kam ho raha hai.

### 6. COUNTIF — ginti shart ke saath

Staff attendance sheet mein P aur A likha hai. =COUNTIF(B2:AF2, "P") batayega ki us vyakti ne mahine mein kitne din haaziri di. Class mein kitne bachche pass hue: =COUNTIF(D2:D50, "Pass").

### 7. SUMIF — jod shart ke saath

Ghar ke budget mein Column A mein category (Ration, Bijli, Petrol, Dawai) aur Column B mein amount hai. =SUMIF(A2:A100, "Petrol", B2:B100) poore mahine ka petrol ka kharcha jod dega. Dukaan mein yahi formula "Cash" aur "UPI" bikri alag-alag nikaalne mein madad karta hai.

### 8. COUNTIFS aur SUMIFS — ek se zyaada shartein

Agar aapko "November mein UPI se hui bikri" chahiye, toh ek se zyaada shart lagani hogi. =SUMIFS(C2:C500, B2:B500, "UPI", A2:A500, ">="&DATE(2026,11,1)) jaisa formula do shartein ek saath lagata hai. Pehle chhote data par practice karein, phir bade par lagayein.

## Dhoondhne wale formulas

### 9. VLOOKUP — table mein se value dhoondhna

Maan lijiye Sheet2 mein item ka naam aur rate likha hai. Bill banate waqt =VLOOKUP("Chini", Sheet2!A2:B100, 2, FALSE) Chini ka rate de dega. Aakhri FALSE ka matlab hai exact match — ise bhoolne par galat rate aa sakta hai.

### 10. XLOOKUP — VLOOKUP ka naya aur aasaan roop

Naye Excel aur Google Sheets mein XLOOKUP bhi milta hai: =XLOOKUP("Chini", Sheet2!A2:A100, Sheet2!B2:B100, "Nahi mila"). Ismein column number ginne ki zaroorat nahi, aur item na mile toh aapka diya hua message dikhta hai. Agar aapke version mein XLOOKUP nahi chalta, toh VLOOKUP use karein.

## Data ko saaf aur chhota karne wale formulas

### 11. UNIQUE — duplicate hataana

Customer list mein ek hi naam kai baar aa gaya ho, toh =UNIQUE(A2:A500) har naam ek baar dikha dega. Isse pata chalta hai ki asal mein kitne alag customers hain.

### 12. FILTER — shart ke hisaab se list

=FILTER(A2:C500, C2:C500>5000) sirf woh rows dikhayega jinmein amount 5,000 se zyaada hai. Bade orders ya bade kharche alag se dekhne ke liye yeh bahut kaam ka hai. UNIQUE aur FILTER Google Sheets aur naye Excel versions mein chalte hain.

## Bonus: kaam ki chhoti tricks

- =TODAY() aaj ki tareekh deta hai. Due date ke din ginne ho toh =D2-TODAY().
- =TRIM(A2) naam ke aage-peeche ke faltu space hata deta hai, jisse lookup sahi chalta hai.
- =PROPER(A2) "ramesh kumar" ko "Ramesh Kumar" bana deta hai.
- Data Validation se kisi column mein sirf list wale options (jaise Cash/UPI/Card) hi chunne dein, taaki spelling ki galti na ho.
- Header row ko "Freeze" karein taaki neeche scroll karne par bhi column ke naam dikhte rahein.

## Aam galtiyan jinse formula galat jawab deta hai

### Numbers text ki tarah save hona

Kai baar copy-paste ke baad number left side mein chipak jaate hain aur SUM unhe nahi jodta. Column ka format "Number" karein ya faltu space hatayein.

### Range copy karte waqt khisakna

Formula ko neeche drag karne par range bhi khisak jaati hai. Agar rate wali table fix rakhni hai toh $ lagayein: Sheet2!$A$2:$B$100.

### Merged cells

Merged cells dekhne mein achhe lagte hain par formulas aur sorting ko bigaad dete hain. Data wali sheet mein inse bachein.

## AI se formula kaise banwayein

Agar aap formula ka naam nahi jaante, toh Bharat AI Sathi ke AI Chat (/chat) mein simple bhasha mein likhein: "Column A mein category hai, Column B mein amount. Mujhe sirf Petrol ka total chahiye. Google Sheets formula batao." AI formula aur uska matlab samjha dega. Use pehle 5–10 rows ke chhote data par test karein aur haath se jodkar milayein. Data samajhne ke liye Data Analyzer (/data-analyzer) bhi dekh sakte hain. Customer ke phone number, bank details ya kisi ki personal jaankari wali poori sheet kisi bhi AI tool mein paste na karein; sirf column ke naam aur example values kaafi hain.

## Nishkarsh

SUM, IF, COUNTIF, SUMIF aur VLOOKUP jaise paanch formulas hi roz ka 80% hisaab sambhal lete hain. Baaki formulas tab seekhein jab zaroorat ho. Data saaf rakhein, chhote example par test karein aur har mahine ek nayi trick jodein. Kuch hi hafton mein aapki spreadsheet aapka sabse bharosemand munshi ban jayegi.`,
  ),
  G(
    "10th aur 12th ke baad career kaise chunein: stream, course aur entrance exams ki seedhi guide",
    "Science, Commerce, Arts, ITI, polytechnic ya skill course — rishtedaron ki salah se aage badhkar apni ruchi, kshamata aur kharche ke hisaab se sahi faisla kaise lein. Entrance exams aur scholarships ke saath.",
    "Education",
    "2026-11-19",
    8,
    `Class 10 aur Class 12 ke result ke baad ghar mein ek hi sawaal goonjta hai: "Ab aage kya?" Padosi ka beta engineer ban gaya, rishtedaar ki beti doctor ki taiyari kar rahi hai, aur dost kisi aur course mein ja raha hai. In sab awaazon ke beech apna faisla lena mushkil lagta hai. Is guide ka maqsad aapko koi ek "best career" batana nahi hai, kyunki aisa koi career sabke liye best nahi hota. Hum ek seedha tareeka batayenge jisse aap apni ruchi, kshamata, kharche aur mauke ko dekhkar sochkar faisla le sakein.

## Pehle khud ko samjhein, phir course ko

### Teen sawaal apne aap se poochhein

1. Mujhe kaunse kaam mein samay ka pata nahi chalta? (jaise cheezein banana, logon se baat karna, hisaab lagana, likhna, drawing, machines)
2. Kaunse subject mein mehnat karne par bhi mujhe achha lagta hai?
3. Mere ghar ki aarthik sthiti kitne saal ki padhai aur coaching ka kharcha utha sakti hai?

Inke jawab kaagaz par likhein. Sirf marks ke basis par faisla na karein; ek subject mein kam marks ka matlab yeh nahi ki aap us field mein achha nahi kar sakte, aur zyaada marks ka matlab yeh nahi ki wahi aapki ruchi hai.

### Ruchi aur "trend" mein farak

Har saal kuch courses "hot" ho jaate hain. Trend dekhna galat nahi, lekin sirf trend ke liye 4–5 saal ki padhai chunna risky hai. Job market badalta rehta hai; jo field aapko pasand hai, usmein aap lambe samay tak seekhte rehte hain, aur yahi aage badhne ki asli taakat hai.

## Class 10 ke baad ke raste

### Science (PCM ya PCB)

PCM (Physics, Chemistry, Maths) engineering, architecture, defence (jaise NDA), data aur technology se jude courses ke raaste kholta hai. PCB (Biology ke saath) medicine, nursing, pharmacy, agriculture aur life sciences ki taraf le jaata hai. Kai schools mein PCMB bhi milta hai. Science mein lagatar padhai aur practice chahiye, isliye sirf dabav mein yeh stream na lein.

### Commerce

Accounts, business studies aur economics wala stream CA, CS, CMA, B.Com, BBA, banking, finance aur apna business chalane ki samajh ke liye achha hai. Maths ke saath Commerce lene se aage economics, data aur finance ke zyaada options khulte hain.

### Arts / Humanities

History, political science, psychology, sociology, languages, geography jaise subjects law, civil services ki taiyari, journalism, teaching, design, social work aur research ki taraf le jaate hain. Yeh "kam marks walon ka stream" nahi hai — yeh ek alag aur mazboot raasta hai.

### ITI aur Polytechnic Diploma

Agar aapko haath se kaam karna, machines, wiring ya technical skills pasand hain, toh ITI (electrician, fitter, mechanic jaise trades) ya polytechnic diploma (engineering ki alag-alag branches) achha vikalp hai. Inse jaldi kaam ke mauke mil sakte hain, aur diploma ke baad kai states mein lateral entry se engineering degree ke doosre saal mein admission ka raasta bhi hota hai — apne state ke niyam check karein.

## Class 12 ke baad ke raste

### Degree courses

- Science ke baad: B.Tech/B.E., B.Sc, MBBS/BDS, nursing, pharmacy, agriculture, B.Sc (IT/computer science).
- Commerce ke baad: B.Com, BBA, CA/CS/CMA foundation, economics, banking.
- Arts ke baad: BA (alag subjects), BA LLB, journalism, design, hotel management, social work.

Kai courses, jaise BBA, BCA, design ya law, kisi bhi stream ke baad kiye ja sakte hain. Eligibility har college ke niyam se check karein.

### Mukhya entrance exams (general jaankari)

- Engineering: JEE Main aur uske baad JEE Advanced (IITs ke liye), plus state level engineering exams.
- Medical: NEET-UG (MBBS, BDS, AYUSH aur kuch doosre courses ke liye).
- Central aur kai doosri universities ke UG courses: CUET-UG.
- Law: CLAT aur kuch universities ke apne exams.
- Defence: NDA (UPSC dwara).
- Design aur architecture ke liye alag exams hote hain.

Exam pattern, eligibility aur tareekhein har saal badal sakti hain, isliye sirf official websites aur notifications par bharosa karein. Coaching ke ads mein bataye gaye "guaranteed selection" ke vaadon se savdhaan rahein.

### Skill aur short courses

Har kisi ko turant degree ki zaroorat nahi hoti. Digital marketing, graphic design, accounting software, coding basics, data entry, beauty aur wellness, ya mobile repair jaise short courses se bhi aap kamai shuru kar sakte hain aur saath mein padhai jaari rakh sakte hain. Course chunne se pehle uska syllabus, practical training aur pehle ke students ka anubhav zaroor dekhein.

## Kharcha aur scholarship: plan pehle banayein

Padhai ka kharcha sirf fees nahi hota — hostel, kitaabein, coaching, aana-jaana sab jodkar dekhein. Sarkari colleges aur central/state universities mein fees aksar kam hoti hai. Scholarship ke liye National Scholarship Portal (NSP) aur apne state ke scholarship portal par regularly check karein. Education loan lene se pehle interest rate, moratorium period aur repayment ki shartein samajhein. Hamari scholarship guide bhi blog par padh sakte hain.

## Ghar walon se baat kaise karein

Kai students ka sabse bada dar ghar walon ko apni pasand batana hota hai. Bhaavnaon ki jagah jaankari ke saath baat karein:

- Course ka naam, kitne saal ka hai aur kul kharcha kitna hai.
- Kaunse colleges mein hai aur admission kaise hota hai.
- Course ke baad kaunse kaam aur aage padhai ke raaste hain.
- Agar plan A na chale toh plan B kya hai.

Jab maata-pita dekhte hain ki aapne research ki hai, toh woh zyaada sunte hain.

## AI se career research kaise karein (sahi tareeke se)

Bharat AI Sathi ka Career Hub (/career) aur AI Chat (/chat) aapko courses ki tulna, roadmap aur sawaal taiyar karne mein madad kar sakte hain. Jaise poochh sakte hain: "Main 12th Commerce ki student hoon, maths achha lagta hai. Mere liye 5 career options aur har ek ka pehla saal kaisa hoga, batao." AI ke jawab ko shuruaati idea maanein. Fees, cut-off, admission ki tareekhein aur eligibility hamesha college ki official website ya notification se confirm karein, kyunki AI galat ya purani jaankari de sakta hai.

## Galtiyan jinse bachein

- Sirf dost ke saath rehne ke liye wahi course lena.
- Ek hi entrance exam par saara bharosa, bina backup plan ke.
- Fake ya bina manyata (recognition) wale colleges mein admission. UGC, AICTE ya sambandhit council ki manyata check karein.
- Lagatar coaching ke chakkar mein mental health ko nazarandaaz karna.
- Kisi agent ko paise dekar "pakka admission" lene ki koshish.

## Nishkarsh

Career chunna ek baar ka faisla nahi, balki ek safar hai. 10th ya 12th ke baad liya gaya raasta baad mein badla bhi ja sakta hai — bahut log aisa karte hain. Apni ruchi samjhein, kharche ka sach-sach hisaab lagayein, official sources se jaankari lein aur ek backup plan rakhein. Rishtedaron ki salah sunein, par faisla apni samajh se lein.`,
  ),
  G(
    "Gmail, WhatsApp aur bank account ko hack hone se kaise bachayein: strong password aur two-step verification guide",
    "Mazboot password kaise banayein, har account mein two-step verification kaise on karein, phone kho jaane par kya karein aur account hack ho jaaye toh pehle ghante mein kya steps lein — aasaan Hinglish mein.",
    "Cyber Security",
    "2026-11-18",
    7,
    `Aaj hamara Gmail sirf email nahi hai — usi se photos, contacts, YouTube, aur kai apps ka login juda hota hai. WhatsApp mein parivaar aur kaam ki baatein hain, aur phone mein bank ka app. Agar inmein se ek bhi account kisi aur ke haath lag jaaye, toh nuksaan paise ka bhi ho sakta hai aur izzat ka bhi. Achhi khabar yeh hai ki zyaadatar accounts kisi mushkil "hacking" se nahi, balki kamzor password, OTP share karne ya ek hi password har jagah use karne se hack hote hain. Kuch aadatein badalne se aap 90% khatron se bach sakte hain.

## Mazboot password ka asli matlab

### Kamzor password ki pehchaan

Apna naam, janm tithi, mobile number, "123456", "password", ya pet ka naam — yeh sab sabse pehle try kiye jaate hain. "Rahul@1995" jaisa password dekhne mein complex lagta hai par asaani se guess ho jaata hai.

### Lamba password, chhote se behtar

Password ki lambai uski taakat ka sabse bada hissa hai. Chaar-paanch aise shabdon ko jodein jo aapas mein sambandhit na hon, jaise "Neela-Chai-Cycle-Pahad-47". Yeh yaad rakhna aasaan hai aur todna mushkil. Kam se kam 12–14 characters ka lakshya rakhein.

### Har account ka alag password

Sabse badi galti ek hi password har jagah use karna hai. Agar kisi chhoti website ka data leak hua, toh hackers wahi email-password aapke Gmail aur doosre accounts par try karte hain. Kam se kam email, bank aur social media ke password alag aur unique rakhein.

### Password manager ka istemal

Itne saare password yaad rakhna mushkil hai. Google Password Manager (Chrome/Android mein), iPhone ka Passwords app ya doosre bharosemand password managers aapke liye password bana aur yaad rakh sakte hain. Aapko sirf ek mazboot master password ya phone lock yaad rakhna hota hai. Bharat AI Sathi ke Password Generator (/tools/password-generator) aur Password Strength Checker (/tools/password-strength) tools bhi password banane aur jaanchne mein madad kar sakte hain — yeh aapke browser mein hi chalte hain. Phir bhi apna asli bank password kisi bhi website par type karke "check" na karein.

## Two-step verification: doosra tala lagayein

Two-step verification (2SV) ya two-factor authentication (2FA) ka matlab hai ki password ke alawa ek aur saboot chahiye — jaise phone par aaya code ya app mein "Yes, it's me" dabana. Agar kisi ko aapka password pata bhi chal jaaye, toh bina doosre step ke woh login nahi kar payega.

### Gmail / Google account mein

Google Account settings mein "Security" section mein jaakar 2-Step Verification on karein. Google Prompt (phone par notification), authenticator app ya passkey jaise vikalp milte hain. Backup codes download karke surakshit jagah rakhein, taaki phone kho jaane par bhi account khol sakein. Saath hi recovery email aur recovery phone number sahi aur updated rakhein.

### WhatsApp mein

WhatsApp mein Settings → Account → Two-step verification par jaakar 6 digit ka PIN set karein aur ek email jodein. Iske baad koi naye phone par aapka number register karne ki koshish karega toh use yeh PIN bhi chahiye hoga. Yeh PIN aur WhatsApp ka 6 digit registration code kabhi kisi ko na batayein — chahe woh dost ki ID se hi message kyun na aaye.

### Bank aur UPI apps mein

Bank app par mazboot login PIN, fingerprint ya face lock on rakhein. UPI PIN sirf paise bhejne ke liye hai; paise lene ke liye kabhi nahi chahiye. Bank kabhi bhi call karke OTP, PIN, CVV ya password nahi maangta.

### Instagram, Facebook aur doosre apps

Lagbhag har bade app ki security settings mein two-factor authentication ka option hota hai. SMS ke bajaye authenticator app zyaada surakshit maana jaata hai, kyunki SIM swap fraud mein SMS code chori ho sakta hai.

## OTP: sabse aam dhokha

Zyaadatar hack password todkar nahi, OTP maangkar hote hain. Kuch aam bahaane:

- "Galti se aapke number par mera code aa gaya, bata do please."
- "Aapka KYC expire ho gaya, verify karne ke liye OTP batayein."
- "Aapne inaam jeeta hai, claim karne ke liye code bhejein."
- "Main bank/courier/bijli vibhaag se bol raha hoon."

Ek seedha niyam yaad rakhein: OTP sirf aapke liye hai. Koi bhi, kisi bhi bahaane se maange, toh mana karein. Message ko dhyaan se padhein — usmein aksar likha hota hai ki yeh code kis kaam ke liye hai.

## Phone ki suraksha bhi zaroori

- Mazboot screen lock (PIN, pattern se behtar lambe PIN ya fingerprint) lagayein.
- Phone aur apps ko update rakhein; updates mein security fixes hote hain.
- Apps sirf Play Store ya App Store se install karein. Kisi link se aaye APK file install na karein.
- Anjaan vyakti ke kehne par "screen sharing" ya "remote support" app install na karein.
- Public Wi-Fi par bank ka kaam karne se bachein.

### Phone kho jaaye ya chori ho jaaye

1. Turant SIM band karwane ke liye apne mobile operator se sampark karein.
2. Bank ko batakar UPI aur net banking block karwayein.
3. Google ke "Find My Device" ya iPhone ke "Find My" se phone lock ya erase karein.
4. Sarkar ke Sanchar Saathi portal (sancharsaathi.gov.in) par khoye/chori phone ko block karne ki request darj kar sakte hain.
5. Police mein report darj karayein.

## Account hack ho gaya? Pehle ghante mein yeh karein

1. Agar abhi bhi login kar pa rahe hain, toh turant password badlein aur "sign out of all devices" chunein.
2. Two-step verification on karein ya uske settings check karein.
3. Recovery email aur phone number dekhein — hacker ne badal diya ho toh wapas sahi karein.
4. Login nahi ho raha toh official recovery page (jaise Google Account Recovery) se account wapas lein.
5. Doston aur parivaar ko batayein ki aapke naam se paise ya OTP maangne wale message ko ignore karein.
6. Agar paise ka nuksaan hua hai, toh turant 1930 par call karein aur cybercrime.gov.in par complaint darj karein, aur bank ko inform karein.

## Har 3 mahine ki 5 minute wali jaanch

- Google Account ke "Security Checkup" ko chalayein.
- WhatsApp mein "Linked devices" dekhein; anjaan device ho toh log out karein.
- Social media apps mein "Where you're logged in" check karein.
- Purane, bekaar apps ko apne Google account ki access se hata dein.
- Bank statement dhyaan se dekhein.

## Nishkarsh

Online suraksha ke liye technical expert hona zaroori nahi. Lamba aur alag password, har zaroori account mein two-step verification, OTP kabhi share na karna aur phone ko update rakhna — yeh chaar aadatein zyaadatar hacking ko rok deti hain. Aaj hi 15 minute nikaalkar apne Gmail, WhatsApp aur bank app ki settings check karein. Kal ki pareshani se aaj ki thodi mehnat kahin behtar hai.`,
  ),
];
