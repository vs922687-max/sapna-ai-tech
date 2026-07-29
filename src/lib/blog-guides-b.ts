// Bharat AI Sathi — long-form editorial guides (part B).

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

export const GUIDE_POSTS_B: BlogPost[] = [
  G(
    "AI se GST invoice aur business documents kaise banayein",
    "Chhote business ke liye GST-compliant invoice, quotation, purchase order aur agreement banane ka practical workflow — kaunse fields legally zaroori hain aur AI kahan madad karta hai.",
    "Finance",
    "2026-07-20",
    11,
    `Har chhote business ke liye paperwork ek chhupi hui laagat hai. Ek freelancer mahine mein 3-4 ghante sirf invoice banane, follow-up karne aur agreement draft karne mein lagata hai. AI is samay ko kaafi kam kar sakta hai — lekin compliance ki zimmedari phir bhi aapki hai.

## Ek valid GST invoice mein kya-kya hona chahiye

CGST Rules ke tehat tax invoice mein yeh fields zaroori hain. Ise checklist ki tarah use kariye:

1. Supplier ka naam, address aur **GSTIN**
2. Consecutive **invoice number** — financial year ke andar unique, 16 characters tak
3. **Invoice date**
4. Recipient ka naam, address aur GSTIN (agar registered hai)
5. Unregistered recipient ke liye — agar value ₹50,000 se zyada hai to address aur delivery state
6. **HSN code** (goods) ya **SAC code** (services)
7. Description, quantity aur unit
8. Taxable value, discount ke baad
9. **Tax rate aur amount** — CGST + SGST (intra-state) ya IGST (inter-state) alag-alag
10. **Place of supply** — inter-state supply mein zaroori
11. Reverse charge applicable hai ya nahi
12. Supplier ya authorised person ka signature ya digital signature

Ek chhoti si baat jo bahut mehngi padti hai: **CGST/SGST vs IGST ka faisla "place of supply" se hota hai, buyer ke address se nahi.** Agar aap Delhi mein hain aur service Delhi mein hi consume hui, to CGST+SGST — chahe client Bengaluru ka ho. Services ke liye default rule recipient ka location hai, lekin exceptions hain (immovable property, event, transport). Confusion ho to CA se poochhiye.

## Invoice numbering ka system

Ek simple, consistent series banaiye: BAS/2026-27/001. Financial year include kariye, aur series kabhi break mat kariye. Agar invoice cancel karna pade to number reuse mat kariye — credit note issue kariye.

## AI ka role kahan hai

AI aapke liye tax calculate karne ka source of truth nahi hai. Uska sabse achha upyog yeh hai:

**Description likhna.** "Website redesign, 3 revisions, 2 months support" ko ek professional line item description mein badalna.

**Payment terms aur late fee clause draft karna.** "Ek line likho jo bataye ki 15 din baad 1.5% monthly interest lagega."

**Follow-up emails.** Pehla polite reminder, doosra firm, teesra formal. AI teenon ke drafts 30 second mein de deta hai.

**Quotation ko invoice mein badalna.** Scope description reuse karke.

**Terms and conditions section.** Standard clauses — jurisdiction, IP transfer on payment, revision limits.

Calculation hamesha tool ya spreadsheet se kariye. Bharat AI Sathi ka Invoice Generator GST rate select karte hi CGST/SGST/IGST split aur INR formatting khud handle karta hai, aur PDF download deta hai — yeh AI se number nikalwane se kaafi safe hai.

## Quotation aur proposal

Quotation invoice se pehle aata hai aur uska maqsad alag hai: client ko convince karna. Achhe quotation mein:

- **Scope** — kya included hai, aur saaf-saaf kya included nahi hai
- **Timeline** — milestones ke saath
- **Pricing** — line items mein toda hua, taaki client compare kar sake
- **Validity** — "Yeh quotation 15 din tak valid hai"
- **Payment schedule** — 40% advance, 40% milestone, 20% delivery

AI prompt: "Meri service [detail] ke liye ek professional quotation likho. Scope, out-of-scope, timeline, pricing table aur payment terms include karo. Tone professional lekin friendly ho."

"Out-of-scope" section sabse zyada disputes bachata hai. Usse zaroor rakhiye.

## Purchase order aur delivery challan

Agar aap goods deal karte hain to delivery challan bhi zaroori ho sakta hai — khaaskar job work ya approval basis par bheje gaye maal ke liye. Isme invoice jaise details hoti hain lekin tax amount optional hota hai.

## Agreements — kahan AI madad karta hai aur kahan nahi

Common business agreements: service agreement, NDA, freelance contract, rent agreement, vendor agreement.

**AI achha hai:** first draft banane mein, clause ka matlab samjhane mein, aur missing clauses batane mein ("Is agreement mein termination clause nahi hai").

**AI kaafi nahi hai:** stamp duty ki state-wise requirement, registration ki zaroorat, aur aise clauses jo aapke specific business risk se jude hain. Har state mein stamp duty alag hai, aur galat stamp paper par bana agreement court mein evidence ke roop mein weak ho jaata hai.

Practical approach: AI se draft banwaiye, phir ek advocate se ek baar review karwa lijiye. Ek baar ka legal review ka kharcha aap agle 50 contracts mein use kar sakte hain.

## Record keeping

GST ke tehat records 6 saal (72 mahine) tak rakhne hote hain — annual return ki due date se. Iska matlab:

- Har invoice ki PDF ek dated folder structure mein
- Purchase invoices bhi (input tax credit ke liye)
- Bank statements aur payment proofs
- E-way bills, agar applicable

Cloud backup rakhiye. Laptop chori ho jaana GST notice ke samay valid excuse nahi hota.

## Input Tax Credit ki chaar shartein

ITC claim karne ke liye:

1. Aapke paas valid tax invoice ho
2. Goods/services actually receive hue hon
3. Supplier ne tax government ko jama kiya ho (GSTR-2B mein dikhe)
4. Aapne return file kiya ho

Point 3 sabse important hai — agar aapka vendor return file nahi karta, to aapki credit atak jaati hai. Isliye naye vendor ka GSTIN status aur filing history check karna ek acchi aadat hai.

## Ek simple monthly rhythm

- **Har hafte:** naye invoices generate kariye, purane par follow-up
- **Mahine ke pehle hafte:** pichhle mahine ke purchase invoices reconcile kariye GSTR-2B se
- **11 tarikh tak:** GSTR-1
- **20 tarikh tak:** GSTR-3B aur tax payment
- **Har quarter:** cash flow aur outstanding receivables review

Yeh rhythm bana lene se saal ke ant mein hone wali bhaag-daud khatam ho jaati hai.

Yeh article general information hai, tax ya legal advice nahi. GST rates aur rules badalte rehte hain — apne specific case ke liye ek qualified Chartered Accountant se salah lijiye.`,
  ),

  G(
    "Online fraud se kaise bachein: UPI, KYC aur digital arrest scams ki poori guide",
    "India mein sabse aam online frauds ke patterns, warning signs, aur fraud ho jaane par pehle 24 ghante mein kya karna hai — cybercrime portal aur 1930 helpline ka sahi upyog.",
    "Cyber Security",
    "2026-07-19",
    12,
    `Digital payments ne India mein zindagi aasan kar di hai — aur scammers ke liye bhi. Ek baat samajh lijiye: aaj ke frauds technical hacking se nahi hote. Woh **aapse karwaaye jaate hain**. Scammer aapko itna dara ya lalchaa deta hai ki paisa aap khud bhejte hain. Isliye sabse achhi suraksha technology nahi, pattern pehchanna hai.

## Sabse aam frauds aur unke signature moves

### 1. UPI "collect request" trap
Aapko OLX ya Facebook Marketplace par kuch bechna hai. Buyer kehta hai "main advance bhej deta hoon" aur ek UPI request bhejta hai. Aap PIN daalte hain — aur paisa **kat jaata hai**.

**Yaad rakhiye ek golden rule:** Paisa **lene** ke liye kabhi PIN nahi lagta. PIN sirf paisa **dene** ke liye lagta hai. Agar koi paisa bhejne ke liye aapse PIN maang raha hai, woh 100% fraud hai.

### 2. Digital arrest scam
Call aata hai: "Main CBI/Customs/TRAI se bol raha hoon. Aapke naam par parcel mein drugs mila hai / aapka Aadhaar money laundering mein use hua hai." Phir video call par uniform mein baitha aadmi "arrest warrant" dikhata hai, aapko ghar mein "digital arrest" mein rakhta hai, aur "verification" ke naam par paise transfer karwaata hai.

**Sach:** Koi bhi Indian investigating agency video call par arrest nahi karti, paisa "verification" ke liye nahi maangti, aur na hi kisi ko ghar mein camera ke saamne baithne ko kehti hai. Call kaat dijiye. Parivaar ko batayiye.

### 3. KYC update fraud
SMS aata hai: "Aapka bank account aaj band ho jaayega, KYC update kariye" — ek link ke saath. Link par bank jaisa dikhne wala page kholta hai. Ya phir aapse AnyDesk/TeamViewer install karwaya jaata hai "help" ke naam par.

**Sach:** Bank kabhi link bhejkar KYC nahi karwata, aur kabhi screen-sharing app install karne ko nahi kehta.

### 4. Fake customer care number
Aap Google par "Paytm customer care" search karte hain. Top result ek fake number hota hai. Woh log aapse "refund process" ke naam par UPI PIN ya OTP le lete hain.

**Sach:** Customer care number hamesha official app ke andar se lijiye, Google search se nahi.

### 5. Job aur task scam
Telegram/WhatsApp par "ghar baithe ₹5,000 daily" ka message. Pehle chhote tasks par sach mein paisa milta hai (yeh trust banane ke liye hai). Phir bada "investment" maanga jaata hai, aur wahin sab khatam.

### 6. Loan app harassment
Illegal loan apps chhota loan dete hain, aapki contact list aur photos ka access le lete hain, aur phir default par aapke rishtedaron ko morphed photos bhejkar blackmail karte hain.

**Bachav:** Sirf RBI-registered NBFC ya bank ke apps se loan lijiye. Kisi bhi app ko contacts, gallery aur SMS permission mat dijiye.

### 7. SIM swap
Scammer aapke number ka duplicate SIM le leta hai, aur phir aapke saare OTP uske paas jaate hain.

**Warning sign:** Aapka phone achanak "No Service" dikhane lage aur kaafi der tak rahe. Turant operator ko call kariye (kisi doosre phone se).

## Sat warning signs jo har fraud mein common hain

1. **Urgency.** "Abhi karna hoga, warna account band."
2. **Dar ya lalach.** Arrest ka dar, ya lottery ka lalach.
3. **Secrecy.** "Kisi ko mat batana, investigation confidential hai."
4. **Unusual payment method.** UPI to a personal number, gift cards, crypto.
5. **Screen sharing ya remote app.**
6. **Aapse OTP/PIN/CVV maangna.**
7. **Grammar aur naam mein galtiyaan** official communication mein.

Agar teen se zyada signs hain, to woh fraud hai — chahe kitna bhi convincing lage.

## Fraud ho gaya? Pehle 60 minute sabse important hain

**Golden hour** concept yaad rakhiye. Jitni jaldi report karenge, paisa freeze hone ki sambhavna utni zyada.

1. **1930 par call kariye.** Yeh National Cyber Crime Helpline hai, 24x7. Details ready rakhiye: transaction ID/UTR, amount, time, beneficiary details.
2. **cybercrime.gov.in par complaint file kariye.** "Report Financial Fraud" section. Aapko acknowledgement number milega.
3. **Bank ko call kariye** aur account/card block karwaiye. RBI ke rules ke tehat agar aap **3 working days** ke andar unauthorised transaction report karte hain, to zero liability ho sakti hai (jab galti aapki na ho).
4. **Written complaint** bank ko email kariye — phone call ka record kamzor hota hai.
5. **Screenshots aur call recordings** save kariye. Chat delete mat kariye.
6. **Local police station** mein FIR — badi amount ke liye zaroori hai.

## Rozana ki 10 aadatein jo aapko safe rakhti hain

1. UPI PIN sirf paisa bhejne ke liye — kabhi lene ke liye nahi
2. Har account par **2-factor authentication** on
3. Bank aur email ke passwords alag aur lambe
4. Kisi bhi app ko contacts/SMS/gallery permission bina soche mat dijiye
5. Public WiFi par banking mat kariye
6. UPI par **transaction limit** set kar dijiye
7. Bank alerts SMS aur email dono par on rakhiye
8. Mahine mein ek baar statement padhiye — chhoti test transactions fraud ki shuruaat hoti hain
9. Phone ka OS aur apps update rakhiye
10. Ghar ke bujurgon ko yeh sab samjhaiye — 60+ age group sabse zyada target hota hai

## Bachchon aur bujurgon ke liye extra dhyaan

Bujurgon ke liye: unke phone par UPI limit kam rakhiye, aur ek rule banaiye — "koi bhi paisa bhejne se pehle ek family member ko call karna hai, chahe kitni bhi urgency ho." Yeh ek rule zyadatar scams rok deta hai.

Bachchon ke liye: gaming apps mein in-app purchase disable, aur unhe samjhaiye ki koi bhi "free skin/diamonds" offer jo OTP maange, fraud hai.

## AI aur naye frauds

2026 mein do naye pattern tezi se badh rahe hain:

**Voice cloning.** Scammer aapke bete ki aawaz clone karke call karta hai — "Papa main museebat mein hoon, paisa bhejo." Bachav: parivaar mein ek **secret code word** decide kar lijiye jo sirf aap log jaante hon. Emergency call par woh word poochhiye.

**Deepfake video.** Kisi celebrity ya officer ka fake video investment scheme promote karta hua. Bachav: koi bhi investment sirf official, regulated channel se — SEBI-registered advisor, ya bank.

## Kahan report karein — quick reference

- **Cyber fraud helpline:** 1930
- **Portal:** cybercrime.gov.in
- **Banking shikayat:** pehle bank, phir RBI Ombudsman (cms.rbi.org.in)
- **Fake loan app:** Google Play/App Store par report + cybercrime portal
- **Telecom fraud (fake calls/SMS):** Sanchar Saathi portal par report

Fraud ka shikaar hona sharm ki baat nahi hai — yeh scams professional teams chalati hain. Sharm mein chup rehna hi asli nuksaan hai. Report kariye, jaldi kariye, aur doosron ko batayiye.`,
  ),

  G(
    "AI se padhai kaise karein: students ke liye 10 practical techniques",
    "Competitive exams aur college ke liye AI ka sahi upyog — notes se questions banana, concepts samajhna, revision schedule, aur woh galtiyaan jo seekhna rok deti hain.",
    "Education",
    "2026-07-18",
    11,
    `AI students ke liye do bilkul alag cheez ho sakta hai: ek shortcut jo aapko kuch nahi sikhata, ya ek personal tutor jo aapke saath 24 ghante available hai. Antar sirf isme hai ki aap usse kaise use karte hain.

Yeh guide un techniques par hai jo actually seekhne mein madad karti hain.

## Pehle: woh galti jo sabse zyada hoti hai

Homework ka jawab AI se copy karke jama kar dena. Isse do nuksaan hote hain — aap kuch nahi seekhte, aur aapko jhoothi confidence milti hai ki aapko topic aata hai. Exam mein yeh confidence toot jaati hai.

Research consistently yeh dikhati hai ki seekhna **effort** se hota hai — jab dimaag jaankari ko dobara nikaalne ki koshish karta hai. Agar AI woh effort aapke liye kar de, to seekhna nahi hota.

Isliye rule yeh rakhiye: **AI se poochhiye "mujhe samjhao" aur "mujhe test karo", na ki "jawab do".**

## Technique 1 — Feynman method

Kisi topic ko padhne ke baad, usse apne shabdon mein AI ko samjhaiye. Phir kahiye:

> "Maine ise samjhane ki koshish ki hai. Bataao kahan meri samajh galat ya adhoori hai."

AI aapki explanation mein gaps pakad leta hai. Yeh sabse powerful technique hai kyunki isme mehnat aap karte hain.

## Technique 2 — Apne notes se question bank banwaiye

Apne class notes ya textbook chapter paste kariye:

> "Is content se 15 questions banao: 5 easy factual, 5 application-based, aur 5 tricky conceptual. Jawab abhi mat do — sirf questions."

Phir khud attempt kariye. Uske baad:

> "Ab answers do, aur har question ke saath bataao ki galti karne wale students aksar kya sochte hain."

Woh aakhri hissa — common misconceptions — bahut valuable hota hai.

## Technique 3 — Concept ko teen levels par samjhiye

> "Photosynthesis ko teen levels par samjhao: (1) ek 10 saal ke bachche ke liye, (2) ek class 12 student ke liye, (3) ek university exam ke liye."

Pehla level intuition deta hai, teesra level exam-ready depth. Beech ka level dono ko jodta hai.

## Technique 4 — Analogy maangiye, apne context se

> "Mujhe cricket pasand hai. Supply aur demand ko cricket ki misaal se samjhao."

Jab naya concept purani jaan-pehchaan wali cheez se judta hai, to woh yaad reh jaata hai.

## Technique 5 — Active recall schedule

> "Yeh mera syllabus hai [paste]. Mera exam 6 hafte baad hai. Ek spaced-repetition revision plan banao jisme har topic teen baar aaye — pehle padhne ke baad 1 din, 7 din aur 21 din par."

Spaced repetition ka scientific base bahut mazboot hai. AI ka kaam yahan sirf scheduling hai, jo woh achha karta hai.

## Technique 6 — Mock viva aur interview

> "Tum ek interviewer ho. Mujhse thermodynamics par 10 minute ka viva lo. Ek-ek karke sawaal poochho, mere jawab ka intezaar karo, aur end mein feedback do."

Yeh khaaskar UPSC interview, MBA admission aur job interview ki tayyari mein kaam aata hai.

## Technique 7 — Galtiyon ka pattern dhoondhiye

Apne test ke galat jawab AI ko dijiye:

> "Yeh mere 12 galat jawab hain. Inme koi pattern hai? Main kaunse concept mein baar-baar phans raha hoon?"

Aksar pata chalta hai ki 12 alag galtiyaan asal mein 2 hi kamzoriyaan hain.

## Technique 8 — Essay aur answer writing feedback

Apna likha hua answer dijiye:

> "Yeh mera UPSC mains answer hai, 250 shabd. Isse structure, content depth aur presentation par 10 mein score do. Bataao ki topper ka answer isse kaise alag hota. Mera answer rewrite mat karo — sirf feedback do."

"Rewrite mat karo" line critical hai. Warna aap doosre ka answer padhkar aage badh jaayenge.

## Technique 9 — Language barrier todiye

Agar aapka syllabus English mein hai lekin aap Hindi mein sochte hain:

> "Is paragraph ko Hindi mein samjhao, lekin technical terms English mein hi rakho, kyunki exam English mein dena hai."

Isse aap concept apni bhasha mein samajhte hain aur terminology exam ki bhasha mein yaad rakhte hain.

## Technique 10 — Study material ka triage

Bahut saara material ho to:

> "Yeh 40 page ka chapter hai. Exam pattern [detail] hai. Bataao kaunse 10 pages sabse important hain aur kaunse skip kiye ja sakte hain, wajah ke saath."

Phir woh 10 pages khud, dhyaan se padhiye.

## Kya verify karna zaroori hai

AI facts galat bol sakta hai, khaaskar:

- **Dates aur numbers** — historical dates, constitutional articles, statistics
- **Current affairs** — model ka data cutoff ho sakta hai
- **Formulas** — derivation aksar sahi, lekin constants galat ho sakte hain
- **Local/state-specific syllabus details**

Isliye: concepts ke liye AI, facts ke liye textbook aur official sources.

## Exam-specific notes

**Competitive exams (UPSC, SSC, banking):** AI current affairs ke liye reliable nahi hai. Uska use concept clarity, answer writing practice aur revision planning tak seemit rakhiye.

**Engineering/medical:** Numerical problems mein AI step dikhata hai — lekin har step verify kariye. Diagrams aur derivation textbook se.

**School board exams:** Marking scheme ke hisaab se answer structure sikhne mein AI bahut madad karta hai. "Is 5-marker ka answer board ke marking scheme ke hisaab se point-wise likhkar dikhao."

## Honesty ka sawaal

Agar aapka institute AI use ki policy rakhta hai, usse padhiye aur follow kariye. Assignment mein AI ka use disclose karna aksar allowed hota hai; chhupana nahi. Aur practical level par — jo aapne khud nahi samjha, woh viva ya exam mein pakda jaata hai.

## Ek din ka simple routine

- **Subah:** naya concept padhiye (khud, bina AI ke)
- **Padhne ke baad:** AI ko samjhaiye, gaps dhoondhiye
- **Dopahar:** AI se banaye questions attempt kariye
- **Shaam:** galtiyaan review, pattern nikaaliye
- **Raat:** kal ke liye 10-minute recall test

Yeh routine AI ko woh jagah deta hai jahan woh sabse achha hai — feedback aur testing — aur seekhne ka asli kaam aapke paas rehne deta hai.`,
  ),

  G(
    "Sarkari form bharte waqt hone wali 12 galtiyaan aur unse kaise bachein",
    "Aadhaar, PAN, passport, scholarship aur scheme applications mein rejection ke sabse aam kaaran — naam mismatch, document format, address proof aur bank seeding ke practical solutions.",
    "Online Forms",
    "2026-07-17",
    10,
    `Sarkari application reject hone ka dukh do tarah ka hota hai: samay ka nuksaan, aur yeh na pata chalna ki galti kya thi. Achhi baat yeh hai ki 90% rejections sirf ek darjan common galtiyon se aate hain. Ek baar inhe jaan lein, to aapki application pehli baar mein pass hone ki sambhavna kaafi badh jaati hai.

## 1. Naam ka mismatch — sabse bada killer

Aapke Aadhaar par "Ramesh Kumar Yadav", PAN par "Ramesh K Yadav", aur bank mein "R K Yadav". Har system inhe teen alag log samajhta hai.

**Solution:** Ek "master name" decide kariye — aksar Aadhaar wala best hai kyunki woh sabse zyada linked hai. Phir baaki documents ko dheere-dheere usse match karwaiye. Application bharte waqt hamesha wahi naam likhiye jo us specific document par hai jise aap proof ke roop mein laga rahe hain.

## 2. Document 3 mahine se purana

Utility bills, bank statements aur kuch certificates ki validity aksar 3 mahine hoti hai. Log purana bijli ka bill laga dete hain aur form reject ho jaata hai.

**Solution:** Application se ek hafta pehle fresh bill download kariye. Digital bill bhi valid hota hai — usme naam aur address clear dikhna chahiye.

## 3. Scan quality kharaab

Blurry, tedha, ya adha kata hua scan verifier reject kar deta hai. Mobile se photo lena bura nahi hai, lekin:

- Poori roshni mein, chhaya bina
- Document poora frame mein, chaaron kone dikhein
- Flash off — glare document ko unreadable bana deta hai
- Portrait mode ya document scanner app use kariye jo edges auto-crop kare

**Test:** Apne scan ko 100% zoom par kholiye. Agar aap chhote akshar nahi padh paa rahe, verifier bhi nahi padh payega.

## 4. File size aur format

Har portal ka apna rule hota hai — kabhi 50 KB se 200 KB, kabhi 2 MB tak. Format bhi JPEG, PNG ya PDF mein se koi ek.

**Solution:** Upload se pehle instructions dhyaan se padhiye. File compress karne ke liye online tool use kariye lekin itna compress mat kariye ki text dhundhla ho jaaye. File ka naam simple rakhiye — sirf letters, numbers aur hyphen.

## 5. Bank account Aadhaar se seeded nahi

Yeh galti scholarship, subsidy aur DBT wali har scheme mein paisa rok deti hai. Log sochte hain "Aadhaar bank mein diya tha" — lekin **Aadhaar linking aur NPCI seeding do alag cheezein hain**. DBT ke liye NPCI mapper mein aapka Aadhaar us account se juda hona chahiye.

**Solution:** Bank branch ya net banking se "Aadhaar seeding status" check kariye. Ya `bhimupi`-independent NPCI ki official Aadhaar mapper status service use kariye. Ek Aadhaar ek hi account se seeded ho sakta hai — agar aapke kai accounts hain, to woh choose kariye jise aap active rakhenge.

## 6. Mobile number registered nahi ya band

Har OTP-based process Aadhaar ya PAN se linked mobile par depend karta hai. Purana number band ho gaya to poora process ruk jaata hai.

**Solution:** Koi bhi bada application shuru karne se pehle apna Aadhaar mobile verify kar lijiye. Number badalna ho to Aadhaar Seva Kendra jaana padta hai — yeh online nahi hota, aur usme 2-3 din lagte hain. Isse pehle plan kariye.

## 7. Address proof present address se match nahi karta

Passport aur police verification mein yeh sabse aam problem hai. Aap Pune mein rehte hain lekin saara proof Patna ka hai.

**Solution:** Present address ke liye registered rent agreement, employer certificate, ya us address par aane wala bank statement banwaiye. Kam se kam ek proof jo aapke current address par ho.

## 8. Category certificate purana ya galat format

SC/ST certificate lifetime valid hota hai, lekin **OBC non-creamy layer certificate aur EWS certificate aksar ek financial year ke liye valid hote hain**, aur central government posts ke liye central format mein hone chahiye — state format alag hota hai.

**Solution:** Application ki instructions mein dekhiye ki "Central" format chahiye ya "State". Validity date check kariye.

## 9. Photo aur signature specification ignore karna

Portals aksar exact dimension maangte hain — photo 3.5cm x 4.5cm, background white, 20-50 KB; signature black ink, white paper, 10-20 KB.

**Solution:** Ek baar sahi spec wali photo aur signature bana kar phone aur email dono mein save kar lijiye. Har application mein kaam aayegi.

## 10. Draft save na karna

Lambi forms mein session timeout ho jaata hai aur saara data chala jaata hai.

**Solution:** Har section ke baad "Save Draft" dabaiye. Aur bharne se pehle saari information ek notepad file mein likh lijiye — phir copy-paste kariye. Isse typing ki galtiyaan bhi kam hoti hain.

## 11. Acknowledgement number save na karna

Submit karne ke baad log page band kar dete hain. Baad mein status check karne ka koi tareeka nahi bachta.

**Solution:** Submit hone ke turant baad: screenshot lijiye, PDF download kariye, aur number ek jagah note kar lijiye. Ek simple approach — apne aap ko email bhej dijiye jisme subject mein scheme ka naam aur number ho.

## 12. Agent par blind bharosa

Agent ₹500-2,000 lekar form bhar dete hain, lekin unke paas aapka login, aapka mobile number linked ho jaata hai, aur galti hone par aap kuch nahi kar sakte.

**Solution:** Agar agent ki madad leni hi hai, to apne saamne form bharwaiye, apne mobile number aur email use kariye, aur login credentials khud rakhiye. Kabhi bhi apna Aadhaar OTP kisi ko phone par mat batayiye.

## Ek pre-submission checklist

Submit dabane se pehle 5 minute ye check kariye:

1. Naam har jagah bilkul same hai?
2. Date of birth sab documents par match karti hai?
3. Address proof current hai aur 3 mahine se naya hai?
4. Bank account Aadhaar-seeded aur active hai?
5. Sabhi uploaded files khulti hain aur padhi ja sakti hain?
6. Mobile number active hai aur aapke paas hai?
7. Category certificate valid aur sahi format mein hai?
8. Preview page dhyaan se padha?

## Reject ho jaaye to kya karein

Ghabraiye mat. Zyadatar portals rejection reason batate hain. Woh padhiye, sirf woh cheez theek kariye, aur dobara apply kariye. Kai schemes mein re-submission ki koi limit nahi hoti.

Agar reason clear nahi hai, to grievance section use kariye ya CPGRAMS par complaint file kariye — usme application number aur rejection date zaroor likhiye.

Bharat AI Sathi ka Form Center aapke saved profile se forms auto-fill karta hai, jisse naam aur address ki consistency automatic ho jaati hai. Lekin final submission hamesha official portal par hi hoti hai — hum aapki taraf se kuch submit nahi karte.`,
  ),

  G(
    "AI se content likhne ka sahi tareeka: blog, social media aur emails",
    "AI writing ka professional workflow — prompt structure, brand voice, editing checklist, aur woh signs jinse pata chalta hai ki content AI-generated lagta hai.",
    "Productivity",
    "2026-07-16",
    11,
    `AI se likha hua content aksar door se pehchana jaata hai — woh saaf hota hai, vyakaran sahi hota hai, aur bilkul bhi yaad nahi rehta. Antar isme hai ki aap AI ko pehla draft banane ka tool maante hain ya aakhri.

Yeh guide ek professional workflow deti hai jo AI ki speed aur insaani aawaz dono rakhti hai.

## Step 1 — Likhne se pehle sochiye, prompt likhne se pehle nahi

Kisi bhi content ke liye chaar cheezein tay kariye:

- **Kaun padhega?** "Small business owner jo GST samajhna chahta hai" — na ki "general audience".
- **Woh kya sochkar aayega?** Uska sawaal ya dard kya hai?
- **Padhne ke baad woh kya kar payega?** Ek concrete outcome.
- **Aapki aawaz kaisi hai?** Formal, dostana, seedhi, ya thodi humorous?

Yeh chaar jawab aapke prompt ka aadha kaam kar dete hain.

## Step 2 — Prompt ka structure

Ek achha prompt paanch hisson mein hota hai:

1. **Role** — "Tum ek Indian personal finance writer ho jo aasan Hindi mein likhta hai."
2. **Task** — "Ek 900-shabd ka article likho..."
3. **Audience** — "...un logon ke liye jo pehli baar mutual fund mein invest kar rahe hain."
4. **Constraints** — "H2 headings use karo, har section 150 shabd se kam, jargon avoid karo, rupaye ke examples do, koi specific fund recommend mat karo."
5. **Format** — "Ek intro, 5 sections, ek closing checklist."

Constraints sabse zyada frak daalte hain. Bina constraints ke AI hamesha safe, average content deta hai.

## Step 3 — Ek draft se santusht mat hoiye

Professional workflow iterative hota hai:

**Round 1 — Outline.** "Sirf outline do, content mat likho. 6 sections, har ek ke saath ek line ka description."

Outline ko aap khud edit kariye. Yeh sabse important step hai kyunki structure hi content ka 70% hai.

**Round 2 — Section by section.** Poora article ek saath mat likhwaiye. Ek section, phir agla. Quality kaafi behtar rehti hai aur aap beech mein direction badal sakte hain.

**Round 3 — Specificity injection.** "Is section mein ek asli example add karo — ek Jaipur ke kirana store maalik ka, numbers ke saath."

**Round 4 — Cut.** "Isse 20% chhota karo bina koi information hataye." Yeh prompt magic hai — AI khud apni filler lines hata deta hai.

## Step 4 — AI ki aawaz ko apni aawaz banaiye

AI content ke pehchane jaane wale signs:

- Har paragraph ek jaisi lambai ka
- "In today's fast-paced world", "It is important to note that", "delve into", "moreover"
- Har list mein exactly teen points
- Har section ek chhoti summary se khatam
- Koi asli udaharan nahi, sirf general baatein
- Koi opinion nahi — sab kuch balanced aur khokla

Inko theek karne ka sabse aasan tareeka: **apne kuch purane likhe hue paragraphs AI ko dikhaiye** aur kahiye "Meri writing style ka analysis karo, phir isi style mein likho."

Aur khud editing mein: paragraph ki lambai badliye, ek-do jagah chhota vaakya rakhiye, ek apna nijee anubhav jodiye, aur ek jagah clear opinion likhiye.

## Step 5 — Facts verify kariye

AI numbers, dates, kanoon ki dhaara aur statistics confidently galat likh deta hai. Rule simple hai: **koi bhi number ya claim jo aap khud verify nahi kar sakte, hata dijiye.**

Khaaskar dhyaan dijiye:
- Sarkari scheme ke amounts aur deadlines
- Tax rates aur limits
- Historical dates
- "Studies show that..." — AI aksar study invent kar deta hai

## Social media ke liye alag approach

Long-form aur social media bilkul alag skill hai. Social par pehli line hi sab kuch hai.

**Achha prompt:**
> "Is blog post [paste] se 5 LinkedIn posts banao. Har post ka pehla vaakya scroll rokne wala ho. 120 shabd se kam. Koi hashtag spam nahi — 3 tak. Har post mein ek concrete insight ho, promotional tone bilkul nahi."

Instagram/WhatsApp ke liye Hinglish behtar chalta hai: "Roman script mein Hinglish, jaise log WhatsApp par likhte hain."

## Email ke liye

Emails mein AI ki sabse badi madad structure aur tone mein hai.

**Cold email:**
> "150 shabdon ka email likho. Pehla paragraph unke baare mein ho, mere baare mein nahi. Ek specific value proposition. Ek clear, chhota ask. Koi 'I hope this email finds you well' nahi."

**Difficult email (complaint, refusal, follow-up):**
> "Yeh situation hai [detail]. Ek professional email likho jo firm ho lekin rishta na bigaade. Do versions do — ek thoda soft, ek thoda direct."

Do versions maangna ek underused trick hai. Aap dono padhkar beech ka chun sakte hain.

## SEO ke saath balance

AI se SEO content banwana aasan hai, lekin keyword stuffing ab kaam nahi karta — Google ka "helpful content" framework original, first-hand value dekhta hai.

Practical rule: **pehle insaan ke liye likhiye, phir ek baar keyword check kariye.** Prompt: "Is article mein main keyword [X] naturally 4-5 baar aata hai kya? Agar forced lag raha ho to bataao kahan."

Aur E-E-A-T yaad rakhiye — Experience, Expertise, Authoritativeness, Trust. AI aapko expertise nahi de sakta; woh sirf aapki expertise ko theek se present kar sakta hai. Isliye har article mein kuch aisa hona chahiye jo sirf aap jaante hain.

## Ek final editing checklist

1. Pehli line dilchasp hai? (Agar nahi, poora article nahi padha jaayega)
2. Har section mein kam se kam ek concrete detail ya example hai?
3. Koi bhi vaakya aisa hai jo aap bolkar nahi kahenge? Usse badliye.
4. Saare numbers verify ho gaye?
5. Kya ismein aapki koi asli raay hai?
6. Kya padhne wala kuch **kar** sakta hai ise padhkar?
7. 10% aur chhota kar sakte hain?

## Transparency

Agar aapka content professional ya editorial hai, to AI ka use disclose karna aajkal acchi practice maani jaati hai — bilkul waise jaise Bharat AI Sathi apni AI Usage Policy aur Editorial Policy mein karta hai. Padhne wale isse bura nahi maante; woh chhupane par bura maante hain.`,
  ),

  G(
    "Voice assistant aur speech-to-text: Hindi mein dictation ka practical guide",
    "Bolkar likhne ka tareeka — kaunse kaam ke liye voice best hai, Hindi dictation ki accuracy kaise badhayein, aur meeting notes ya interview transcribe karne ka workflow.",
    "Technology",
    "2026-07-14",
    9,
    `Typing sabke liye aasan nahi hai — khaaskar Devanagari mein. Voice input isi gap ko bharta hai. Aaj Hindi speech recognition itni behtar ho chuki hai ki roz ke kaam ke liye woh practical hai, agar aap uski seemaayein jaante hon.

## Kahan voice typing se behtar hai

**Lamba first draft.** Bolna typing se 3 guna tez hai. Article, email ya report ka kachcha draft bolkar banaiye, phir edit kariye.

**Chalte-firte notes.** Idea aaya, phone nikala, bol diya. Baad mein organise kar lijiye.

**Meetings aur interviews.** Transcribe karke summary banwana — yeh sabse high-value use case hai.

**Un logon ke liye jo typing mein comfortable nahi.** Bujurg, ya woh log jinki bhasha ki keyboard layout unhe nahi aati.

## Kahan voice thik nahi hai

- Code likhna
- Numbers-heavy data entry
- Public jagah par confidential baat
- Aisa text jisme exact spelling critical hai (naam, account number)

## Hindi dictation ki accuracy kaise badhayein

**1. Environment sabse zyada matter karta hai.** Fan, AC, traffic aur TV accuracy ko 20-30% tak gira dete hain. Ek band kamra ya headset mic bahut farak daalta hai.

**2. Mic ke paas rahiye, lekin bilkul saamne nahi.** 15-20 cm ki doori, thoda side se — isse breath sounds nahi aate.

**3. Normal speed par boliye.** Log dhire bolne ki koshish karte hain, jisse actually accuracy girti hai. Natural rhythm sabse achha kaam karta hai.

**4. Punctuation bolna seekhiye.** "comma", "full stop", "naya paragraph" — zyadatar systems inhe samajhte hain. Yeh editing ka aadha kaam bacha deta hai.

**5. Proper nouns pehle likh lijiye.** Naam, gaon, company — inhe dictation ke baad manually theek kariye. Yeh sabse aam error zone hai.

**6. Ek baar mein 2-3 minute.** Lambe recordings mein error compound hota hai aur correction mushkil ho jaata hai.

**7. Code-mixing consistent rakhiye.** Agar aap Hinglish bol rahe hain to poore session mein wahi rakhiye — beech-beech mein shuddh Hindi aur English switch karna model ko confuse karta hai.

## Transcription se summary tak — ek workflow

Yeh workflow meetings, lectures aur interviews teenon ke liye kaam karta hai.

**Step 1 — Record kariye.** Phone ka voice recorder kaafi hai. Agar meeting online hai to platform ka recording use kariye (consent lekar).

**Step 2 — Transcribe kariye.** Audio file ko speech-to-text tool mein daaliye. Hindi, English aur Hinglish teenon mein modern models theek kaam karte hain.

**Step 3 — Clean up.** Transcript mein "umm", repetitions aur false starts hote hain. Prompt: "Is transcript ko clean karo — filler words hatao, lekin kisi ka matlab mat badlo."

**Step 4 — Structure nikaaliye.** Yahi asli value hai:

> "Is meeting transcript se yeh nikaalo: (1) 5-point summary, (2) liye gaye faisle, (3) action items — kis par, kya, kab tak, (4) woh sawaal jo unresolved reh gaye."

**Step 5 — Verify.** Action items aur dates hamesha khud check kariye. Yahan galti mehngi padti hai.

Bharat AI Sathi ka Meeting Notes tool exactly yahi pipeline chalata hai — audio upload ya live dictation se transcript, phir structured summary, action items aur decisions.

## Voice assistant vs dictation

Do alag cheezein hain:

**Dictation** — aap bolte hain, woh text banata hai. Ek-tarfa.

**Voice assistant** — aap sawaal poochhte hain, woh jawab bolkar deta hai. Do-tarfa conversation.

Voice assistant khaaskar tab useful hai jab aapke haath busy hon — gaadi chalate waqt, khaana banate waqt, ya kisi kaam ke beech mein.

Iski seema yeh hai ki lamba jawab sunna padhne se dheema hai. Isliye achha voice assistant chhote jawab deta hai. Prompt mein bata dijiye: "Jawab do line mein do."

## Privacy — yeh zaroor sochiye

Voice data normal text se zyada sensitive hai, kyunki:

- Usme aapki aawaz hoti hai, jo aaj clone ki ja sakti hai
- Background mein doosre log bol sakte hain, jinki consent nahi hai
- Meeting recordings mein confidential business information hoti hai

**Practical rules:**

1. Meeting record karne se pehle sabko bataiye — kai jagah yeh kanoonan zaroori bhi hai
2. Bank details, passwords aur medical information dictate mat kariye
3. Recording files ko kaam khatam hone ke baad delete kariye
4. On-device processing wale options prefer kariye jahan available hon
5. Kisi doosre vyakti ka interview transcribe karne se pehle unki permission lijiye

## Accessibility ka angle

Voice technology ka sabse bada asar un logon par hai jinke liye typing mushkil hai — motor disabilities, kam roshni, ya kam literacy. India mein yeh khaas taur par important hai, kyunki bahut se log bol to fluently sakte hain lekin apni bhasha mein type nahi kar paate.

Agar aap koi product ya seva bana rahe hain, to voice input add karna sirf ek feature nahi hai — woh aapke users ki sankhya kaafi badha sakta hai.

## Shuru kaise karein

Aaj hi ek chhota experiment kariye: apne agle email ko type karne ke bajaye bolkar banaiye, phir 2 minute edit kariye. Zyadatar log paate hain ki total samay aadha ho gaya — aur draft zyada natural lagta hai, kyunki hum bolte waqt zyada seedhe hote hain.`,
  ),

  G(
    "Ghar baithe sarkari kaam: 15 services jo ab online ho jaati hain",
    "Birth certificate se lekar ration card, pension, driving licence renewal aur property records tak — kaunse sarkari kaam ab bina office jaaye ho sakte hain aur unke official portals kaunse hain.",
    "Digital India",
    "2026-07-13",
    10,
    `Kuch saal pehle har sarkari kaam ka matlab tha lambi line, kai chakkar, aur "kal aana". Aaj kaafi kuch badal chuka hai. Yeh guide un 15 services par hai jo sach mein online ho jaati hain — aur woh kaam bhi batati hai jo abhi bhi office visit maangte hain.

## 1. Birth aur death certificate

Ab CRS (Civil Registration System) portal aur zyadatar municipal corporation websites par online application hota hai. Naye janm ke liye hospital khud registration kar deta hai; aapko sirf certificate download karna hota hai.

Purane records (jaise 1990 ka janm) ke liye aksar office visit lagta hai, kyunki digitisation sab jagah poori nahi hui.

## 2. Income, caste aur domicile certificate

Har state ka apna e-District portal hai — jaise UP ka e-Sathi, Maharashtra ka Aaple Sarkar, Delhi ka e-District. Application online, documents upload, aur certificate digitally signed PDF mein.

Processing 7-21 din leti hai. Tehsildar level par physical verification ho sakti hai.

## 3. Ration card

Naya card, member add/delete, aur address change — zyadatar states mein online. National Food Security portal se aap apna card status, entitlement aur nearest FPS shop bhi dekh sakte hain.

**One Nation One Ration Card** ke tehat ab aap kisi bhi state mein apna ration le sakte hain — bas Aadhaar biometric authentication chahiye.

## 4. Driving licence renewal

Parivahan Sarathi portal (`sarathi.parivahan.gov.in`) par renewal online hota hai. 40 saal se upar walon ko medical certificate (Form 1A) upload karna padta hai.

Naya licence lene ke liye learner's test ab kai states mein ghar se online ho gaya hai, lekin driving test ke liye RTO jaana hi padta hai.

## 5. Vehicle RC — transfer, address change, duplicate

Parivahan portal par. Ownership transfer mein dono parties ka Aadhaar OTP consent chahiye. Hypothecation removal (loan chukane ke baad) bhi online ho jaata hai — bank se NOC lekar.

## 6. Property registration ke documents dekhna

Har state ka apna registration department portal hai. Aap dekh sakte hain: encumbrance certificate, market value, aur registered deed ki copy. Registration khud abhi bhi sub-registrar office mein hota hai (biometric ke saath), lekin appointment aur stamp duty payment online.

## 7. Pension — jeevan pramaan

Sabse bada badlav pensioners ke liye aaya hai. **Digital Life Certificate (Jeevan Pramaan)** ab ghar se ban jaata hai — smartphone ke face authentication se. Pehle har saal bank ya treasury jaana padta tha.

App download kariye, Aadhaar aur PPO number daaliye, face scan kariye — ho gaya.

## 8. EPF withdrawal aur transfer

EPFO ka unified portal. UAN activate hone ke baad: passbook dekhna, KYC update, online claim (Form 19, 10C, 31), aur job change par transfer — sab online. Claim aksar 7-20 din mein settle hota hai.

Zaroori: UAN par Aadhaar, PAN aur bank account verified hone chahiye, aur employer ne DOJ/DOE update kiya ho.

## 9. Income tax return aur refund

`incometax.gov.in` par ITR filing, e-verification aur refund tracking. Simple salaried cases mein pre-filled data aa jaata hai — aapko sirf verify karna hota hai.

## 10. Passport appointment aur re-issue

Application aur payment online; ek PSK visit zaroori hai biometrics ke liye. Kuch re-issue cases mein police verification bhi skip ho jaati hai.

## 11. Voter ID (EPIC) services

NVSP / Voter Helpline app par: naya registration (Form 6), address change (Form 8), naam correction, aur e-EPIC download. Booth aur BLO ki jaankari bhi milti hai.

## 12. Court case status

eCourts portal aur app par case number, party name ya advocate name se status dekh sakte hain — district courts se lekar High Court tak. Cause list aur next hearing date bhi.

## 13. Police services

Zyadatar states mein online: FIR status, lost article report (khoye hue document ke liye), tenant verification, aur character certificate application. Note: **cognizable offence ki FIR ke liye aksar police station jaana hi padta hai**; online sirf lost-report aur non-cognizable complaint hoti hai.

## 14. Electricity, water aur property tax

Har state utility ka portal, plus Bharat BillPay aggregators. New connection application bhi ab kai jagah online hai. Property tax municipal corporation ke portal par — kai jagah early payment par discount milta hai.

## 15. Scholarship aur skill programs

National Scholarship Portal aur state portals par. Skill India aur PMKVY courses ki registration bhi online.

## Woh kaam jo abhi bhi office visit maangte hain

Realistic rehna zaroori hai. In cases mein aapko physically jaana hi hoga:

- Aadhaar mein mobile number ya biometric update
- Property registration ka final execution
- Driving test
- Passport biometrics
- Marriage registration (dono parties ki presence)
- Court appearances
- Cognizable FIR

## Ek smart approach

**Pehle official portal dhoondhiye, Google ke ad results nahi.** Search results mein sabse upar aksar paid, fake sites hoti hain jo ₹500 "service charge" leti hain us kaam ke liye jo free hai. Official sites `.gov.in` ya `.nic.in` par hoti hain.

**CSC (Common Service Centre) ek valid option hai** agar aapke paas internet ya device nahi hai. Unke charges government-notified hote hain aur displayed hone chahiye. Receipt zaroor lijiye.

**Har application ka record rakhiye.** Ek folder banaiye — physical aur digital dono — jisme har application ka number, date aur receipt ho. Yeh follow-up ke waqt sabse zyada kaam aata hai.

**Grievance system use kariye.** Agar koi application 30 din se zyada atki hai, to CPGRAMS (`pgportal.gov.in`) ya state grievance portal par shikayat file kariye. Yeh sach mein kaam karta hai — har complaint track hoti hai aur nodal officer ko jawab dena padta hai.

Bharat AI Sathi ke Government section mein 270+ services ke liye eligibility, documents aur official links ek jagah mil jaate hain — lekin application hamesha official government portal par hi kariye. Hum ek independent guidance platform hain, sarkari website nahi.`,
  ),

  G(
    "AI chatbot se behtar jawab kaise nikalein: prompting ka poora guide",
    "Prompt engineering ki practical techniques Indian users ke liye — context dena, role assign karna, format control, iteration, aur woh galtiyaan jo kharab jawab ki wajah banti hain.",
    "Artificial Intelligence",
    "2026-07-11",
    11,
    `Do log ek hi AI se ek hi kaam karwaate hain, aur ek ko shaandaar jawab milta hai jabki doosre ko bekaar. Farak model mein nahi hai — farak sawaal mein hai.

Yeh guide un techniques par hai jo sach mein output badalti hain.

## Sabse pehle: AI kya hai aur kya nahi

AI ek prediction machine hai jo agla shabd guess karta hai, us data ke aadhaar par jispar woh train hua. Iska matlab teen practical baatein:

1. **Woh aapke baare mein kuch nahi jaanta** jab tak aap bataayein na.
2. **Woh confident galat ho sakta hai** — usse "pata nahi" bolna aksar nahi aata jab tak aap kahein na.
3. **Woh aapke shabdon ka pattern follow karta hai** — achhe, specific shabd achha jawab laate hain.

## Technique 1 — Context dijiye, sawaal se pehle

Kamzor: "Ek business plan banao."

Behtar: "Main Nagpur mein ek cloud kitchen shuru kar raha hoon, budget ₹8 lakh, target office lunch crowd. Mera koi restaurant experience nahi hai. Ek 6-mahine ka launch plan banao jisme monthly milestones aur budget allocation ho."

Doosre prompt mein AI ke paas kaam karne ke liye kuch hai. Rule of thumb: **jitna context ek naye employee ko dete, utna AI ko dijiye.**

## Technique 2 — Role assign kariye

"Tum ek 15 saal ke experience wale Indian tax consultant ho" — yeh line jawab ka tone, depth aur vocabulary badal deti hai.

Lekin dhyaan rahe: role dene se AI expert nahi ban jaata. Woh sirf expert **jaisa bolne** lagta hai. Facts ki verification ki zaroorat kam nahi hoti.

## Technique 3 — Output ka format bataiye

AI default mein paragraph likhta hai. Agar aapko kuch aur chahiye to maangiye:

- "Table mein do, columns: option, cost, time, risk"
- "Sirf bullet points, har point 15 shabd se kam"
- "Pehle ek 2-line summary, phir detail"
- "JSON format mein do"
- "Ek checklist banao jise main print kar sakoon"

## Technique 4 — Examples dijiye (few-shot prompting)

Yeh sabse under-used aur sabse effective technique hai.

> "Main product descriptions likhwana chahta hoon. Yeh mera style hai:
>
> [Example 1]
> [Example 2]
>
> Ab isi style mein yeh 5 products ke liye likho: ..."

Do example dene se output ki quality dramatically badhti hai — kisi bhi lambe instruction se zyada.

## Technique 5 — Constraints lagaiye

Constraints creativity badhaate hain, ghataate nahi.

- "Sirf 100 shabd"
- "Koi jargon nahi — 10th class ka student samajh sake"
- "Sirf woh options do jo ₹50,000 ke andar hon"
- "Koi bhi aisi baat mat likho jo document mein nahi hai"
- "Agar tumhe pata nahi hai to bolo 'mujhe nahi pata'"

Aakhri wala hallucination kaafi kam kar deta hai.

## Technique 6 — Sochne ko kahiye

Complex problems mein: "Step by step socho, phir jawab do." Ya "Pehle teen alag approach socho, unki tulna karo, phir best chuno."

Isse AI ka reasoning behtar hota hai — aur aap uska logic dekh kar galti pakad sakte hain.

## Technique 7 — Iterate kariye, restart nahi

Zyadatar log pehle jawab se khush nahi hote aur naya prompt likhkar shuru se karte hain. Behtar hai conversation continue karna:

- "Yeh thoda formal hai, aasan kar do"
- "Point 3 par aur detail do"
- "Ab isko aadha kar do"
- "Ek aur alag angle se socho"

AI ko purani baat yaad rehti hai us conversation mein, isliye har follow-up mein woh behtar hota jaata hai.

## Technique 8 — AI se prompt banwaiye

Meta trick: "Main [yeh kaam] karwana chahta hoon. Mujhe ek achha prompt likhkar do jo main tumhe doon." Aksar woh aapse behtar prompt likhta hai, kyunki usse pata hai use kya chahiye.

## Technique 9 — Critic mode

Apna kaam AI se review karwaiye, lekin sahi tarah:

Kamzor: "Yeh kaisa hai?" (AI hamesha tareef karega)

Behtar: "Ek strict reviewer bano. Is plan mein teen sabse badi kamzoriyaan batao aur har ek ka concrete solution do. Tareef mat karo."

## Technique 10 — Do versions maangiye

"Do versions do — ek safe aur conventional, ek bold aur alag." Aap dono padhkar decide kar sakte hain, ya dono ka best mila sakte hain.

## Aam galtiyaan

**Bahut lamba, bikhra hua prompt.** Ek prompt mein 5 alag kaam mat maangiye. Ek-ek karke kariye.

**"Achha" ya "professional" jaise words.** Yeh AI ko kuch nahi batate. "Professional" ka matlab bataiye — "formal tone, koi exclamation nahi, third person mein".

**Facts par blind bharosa.** Har number, date, kanoon ki dhaara aur naam verify kariye.

**Sensitive data daalna.** Aadhaar, PAN, bank details, medical records, aur company ka confidential data AI mein mat daaliye.

**Ek hi conversation mein bilkul alag topic.** Naya kaam, naya chat — warna purana context jawab ko kharaab karta hai.

## Hindi aur Hinglish mein prompting

Modern models Hinglish achhe se samajhte hain. Lekin output ki bhasha explicitly bataiye:

- "Jawab Hindi mein do, Devanagari script mein"
- "Hinglish mein do, jaise WhatsApp par baat karte hain"
- "English mein likho lekin examples Indian context ke ho"

Aur ek useful trick: agar aapko lagta hai ki Hindi output ki quality kam hai, to pehle English mein banwaiye phir translate karwaiye. Do-step process aksar better nikalta hai.

## Ek prompt template jo hamesha kaam aata hai

> **Role:** Tum ek [role] ho.
> **Context:** [situation, background, constraints]
> **Task:** [exactly kya chahiye]
> **Format:** [structure, length]
> **Rules:** [kya nahi karna hai]

Ise ek note mein save kar lijiye aur har baar bhar lijiye. Paanch minute mein aap us level ke jawab paane lagenge jiske liye log "better AI" dhoondhte rehte hain.

## Aakhir mein

Prompting koi jaadu nahi hai — yeh saaf soch ka abhyaas hai. Jab aap AI ko kuch achhe se samjha paate hain, to iska matlab hai ki aapko khud clarity aa gayi hai ki aapko chahiye kya. Yahi is skill ka sabse bada fayda hai.`,
  ),
];
