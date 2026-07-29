// Bharat AI Sathi — long-form editorial guides (part A).
// Each article is 800-1000+ words, written for Indian readers, with
// H2 (##) and H3 (###) structure and bilingual Hindi/English notes.

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

export const GUIDE_POSTS_A: BlogPost[] = [
  G(
    "PM Awas Yojana 2026: eligibility, documents aur apply karne ka poora tarika",
    "PMAY-Urban 2.0 aur PMAY-Gramin ki poori guide — kaun eligible hai, kitni subsidy milti hai, kaunse documents chahiye, online application ke steps aur rejection se kaise bachein.",
    "Government Services",
    "2026-07-28",
    15,
    `Pradhan Mantri Awas Yojana (PMAY) India ka sabse bada housing mission hai. 2026 mein yeh scheme PMAY-Urban 2.0 aur PMAY-Gramin — do dhaaron mein chal rahi hai. Har saal lakhon parivaar apply karte hain, lekin ek badi sankhya sirf isliye reject ho jaati hai kyunki unhone galat vertical chuna, ya document mismatch ho gaya. Yeh guide us poore process ko step-by-step kholti hai, taaki aapki application pehli baar mein hi sahi jaaye.

## PMAY kya hai, aur 2026 mein kya badla hai

PMAY ka maqsad simple hai: har eligible parivaar ke paas ek pakka ghar ho, jisme paani, bijli, toilet aur rasoi ho. Urban areas ke liye Ministry of Housing and Urban Affairs (MoHUA) scheme chalata hai, aur rural areas ke liye Ministry of Rural Development (PMAY-G).

PMAY 2.0 ka sabse bada badlav yeh hai ki ab focus "interest subsidy" se aage badhkar rental housing aur affordable housing partnership tak gaya hai. Isliye apply karne se pehle apni vertical samajhna zaroori hai — subsidy ka amount aur documents dono usi par depend karte hain.

### Char verticals, aasan bhasha mein

**1. Beneficiary-Led Construction (BLC).** Agar aapke paas apni khud ki zameen hai aur aap uspar ghar banana chahte hain, ya purane kacche ghar ko pakka karna chahte hain — yeh vertical aapke liye hai. Assistance direct bank transfer ke roop mein, kaam ki progress ke hisaab se instalments mein aati hai.

**2. Affordable Housing in Partnership (AHP).** Yahan state agency ya private developer flats banata hai, aur eligible beneficiaries ko subsidised rate par milte hain. Aapke paas zameen nahi honi chahiye — bas eligibility honi chahiye.

**3. Affordable Rental Housing (ARH).** Sheher mein kaam karne wale migrant workers, students aur industrial labour ke liye — kharidne ki jagah kiraye par sasta, sarkari-supervised ghar.

**4. Interest Subsidy Scheme (ISS).** Home loan par interest subsidy. Yeh un logon ke liye hai jo bank loan lekar ghar khareedna chahte hain. Subsidy loan account mein credit hoti hai, jisse EMI kam ho jaati hai.

## Eligibility: kaun apply kar sakta hai

Teen income categories hain, aur income sabse important filter hai:

- **EWS (Economically Weaker Section)** — annual household income ₹3 lakh tak
- **LIG (Low Income Group)** — ₹3 lakh se ₹6 lakh
- **MIG (Middle Income Group)** — ₹6 lakh se ₹9 lakh (PMAY 2.0 ke ISS vertical mein)

Iske alawa teen shartein har vertical par lagti hain:

1. Bharat mein aapke parivaar ke naam par koi pakka ghar nahi hona chahiye. "Parivaar" ka matlab hai pati, patni aur unmarried bachche.
2. Aapne pehle kisi bhi central housing scheme ka fayda nahi liya ho.
3. Aadhaar mandatory hai — har adult family member ka.

### Ek galti jo sabse zyada hoti hai

Bahut se log sochte hain ki agar ghar unke pita ke naam hai, to woh eligible nahi hain. Aisa nahi hai. Agar aap shaadi-shuda hain aur aapka apna alag "household" hai jiske naam par koi pakka makaan nahi hai, to aap alag beneficiary family maane jaate hain. Lekin dhyaan rahe — ration card, Aadhaar address aur income certificate mein yeh alagav consistent dikhna chahiye.

## Documents ki checklist

Application se pehle in sabki scanned copies (PDF/JPEG, mostly 200 KB se 2 MB tak) tayyar rakhein:

- Aadhaar card — applicant aur sabhi family members ke
- Income proof — salary slip, Form 16, ya tehsildar ka income certificate
- Bank passbook ka pehla page (Aadhaar-linked account)
- Property/land documents — BLC vertical ke liye zaroori (patta, khasra, registry)
- Caste/category certificate — agar SC/ST/OBC reservation claim kar rahe hain
- Passport-size photo
- Self-declaration ki aapke paas pakka ghar nahi hai

Ek chhota sa tip: file ke naam mein space aur special characters mat rakhiye. "income-proof.pdf" chalega, "income proof (final)#2.pdf" aksar upload par error deta hai.

## Online apply karne ka process

1. Official PMAY-U portal kholiye. Sirf "pmay-urban.gov.in" ya state housing board ki official site use kariye — Google par dikhne wale "PMAY apply ₹99" type sites fraud hote hain.
2. "Apply for PMAY-U 2.0" par click kariye aur eligibility questionnaire bhariye. Yeh aapko sahi vertical par bhej dega.
3. Aadhaar number daaliye aur OTP se verify kariye. Naam bilkul wahi hona chahiye jo Aadhaar par hai.
4. Personal, income aur bank details bhariye.
5. Documents upload kariye.
6. Submit karke **application number** note kar lijiye. Screenshot bhi rakh lijiye.

Gramin areas ke liye process alag hai: PMAY-G mein aap khud portal par apply nahi karte. Gram Panchayat SECC/Awaas+ data ke aadhaar par list banati hai, jise Gram Sabha approve karti hai. Aapka kaam hai apna naam Awaas+ survey mein darj karwana — iske liye Panchayat Secretary ya Block Development Office se sampark kariye.

## Application status kaise track karein

Portal par "Track Your Assessment Status" section hota hai. Aap teen tareeke se dekh sakte hain: assessment ID se, naam + mobile + city se, ya Aadhaar number se. Status update hone mein 30-90 din lag sakte hain, aur sanction ke baad funds instalments mein aate hain — foundation, lintel, aur roof stage par.

## Rejection ke top 5 kaaran

1. **Aadhaar naam mismatch** — application mein "Ram Kumar Singh", Aadhaar par "Ramkumar Singh". Pehle Aadhaar update kariye, phir apply.
2. **Income proof aur declared income alag** — self-employed logon ke saath yeh sabse zyada hota hai. Tehsildar ka income certificate lein.
3. **Duplicate application** — ek hi parivaar se do log apply kar dete hain. Sirf ek.
4. **Bank account Aadhaar-linked nahi** — DBT tabhi hoga jab account seeded ho. Bank se NPCI mapping confirm karwaiye.
5. **Land document clear nahi** — BLC mein zameen ka ownership proof crystal clear hona chahiye.

## Fraud se bachiye

PMAY ke liye **koi application fee nahi hai** (CSC centre par nominal service charge lag sakta hai, jo displayed hota hai). Koi bhi vyakti jo "list mein naam lagwa dunga" bolkar paisa maange, woh scam hai. Sarkari communication kabhi bhi OTP ya bank PIN nahi maangti.

## Aage kya

Agar aapko yeh confirm karna hai ki aap eligible hain ya nahi, hamare AI Eligibility Checker se aap apni income, state aur family details daalkar ek indicative answer paa sakte hain. Lekin final faisla hamesha official portal aur aapke ULB (Urban Local Body) ka hota hai. Bharat AI Sathi ek independent platform hai — hum sarkari website nahi hain, aur hum aapki taraf se koi application submit nahi karte. Hum sirf process ko samajhne mein madad karte hain.`,
  ),

  G(
    "Aadhaar update 2026: naam, address, mobile aur photo badalne ki complete guide",
    "UIDAI portal par Aadhaar update karne ka step-by-step process — kaunse documents valid hain, fees kitni hai, online vs enrolment centre, aur rejection se bachne ke practical tips.",
    "Government Services",
    "2026-07-27",
    13,
    `Aadhaar aaj India ka sabse zyada istemal hone wala identity document hai — bank account se lekar school admission, SIM card se lekar pension tak. Isliye jab Aadhaar mein koi detail galat ho, to woh ek chhoti si galti nahi rehti; woh har jagah rukavat ban jaati hai. Achhi baat yeh hai ki zyadatar updates aap ghar baithe kar sakte hain.

## Pehle yeh samajhiye: kaunsa update online ho sakta hai

UIDAI do tarah ke updates alag karta hai — **demographic** (naam, janm-tithi, address, gender, mobile, email) aur **biometric** (fingerprint, iris, photo).

Online (myAadhaar portal se) sirf yeh ho sakta hai:

- Address update — supporting document ke saath
- Naam mein chhota correction — spelling level, life mein 2 baar tak
- Date of birth — sirf ek baar, valid proof ke saath
- Gender — sirf ek baar
- Language preference

Enrolment / Aadhaar Seva Kendra jaana zaroori hai in cases mein:

- Mobile number ya email add ya change karna
- Photo update
- Fingerprint ya iris update
- 5 aur 15 saal ki umar par bachchon ka mandatory biometric update (MBU)

Yeh distinction bahut important hai. Internet par bahut se blogs kehte hain "mobile number online update kariye" — yeh galat hai. Mobile update ke liye biometric authentication chahiye, jo sirf centre par hoti hai.

## Online address update: step by step

1. "myaadhaar.uidai.gov.in" par jaaiye. Aadhaar number daaliye, captcha bhariye, aur registered mobile par aaye OTP se login kariye.
2. Dashboard par "Update Aadhaar Online" chuniye.
3. "Address" select karke Proceed kariye.
4. Naya address English aur apni local language dono mein bhariye. Portal transliteration suggest karta hai — usse verify zaroor kariye, kyunki auto-transliteration aksar naam-gaon galat likh deta hai.
5. Proof of Address (PoA) upload kariye — original scanned colour copy, 2 MB se kam, JPEG/PNG/PDF.
6. ₹50 fee online pay kariye.
7. **URN (Update Request Number)** note kar lijiye. Yahi aapka tracking number hai.

Processing normally 7 se 30 din leti hai. Update hone par SMS aata hai, aur aap naya e-Aadhaar download kar sakte hain.

### Valid Proof of Address ki list

Passport, bank passbook ya statement, ration card, voter ID, driving licence, electricity/water/gas/telephone bill (3 mahine se purana nahi), registered rent agreement, property tax receipt, insurance policy, gazetted officer ka signed address certificate, aur employer ka certificate (kuch categories ke liye).

Agar aapke paas apne naam par koi document nahi hai — jaise students ya newly-married mahilaayein — to **Head of Family (HoF) based update** ka option hai. Isme parivaar ka mukhiya apna Aadhaar aur relationship proof (ration card, marriage certificate, passport) deta hai, aur uske Aadhaar par OTP consent aata hai.

## Naam update ka nazuk mamla

Naam update ke do case hote hain: spelling correction (Rahul Kumr → Rahul Kumar) aur legal name change (shaadi ke baad surname). Dono ke liye document alag hote hain.

Spelling correction ke liye PAN, passport, voter ID, ya service photo ID chal jaata hai. Legal name change ke liye marriage certificate, gazette notification, ya court order jaisa strong proof chahiye. UIDAI naam update life mein sirf **do baar** allow karta hai — isliye pehli baar mein hi bilkul sahi spelling dijiye, jaise aap chahte hain ki woh har jagah dikhe.

## Mobile number update — centre par

Mobile number Aadhaar ka sabse critical field hai, kyunki har OTP wahin jaata hai. Agar aapka purana number band ho gaya hai:

1. Nazdeeki Aadhaar Seva Kendra ya authorised bank/post office centre par jaaiye.
2. Aadhaar update form bhariye ya operator ko details bataiye.
3. Fingerprint se biometric authentication kariye — koi document zaroori nahi.
4. ₹50 fee dijiye aur acknowledgement slip lijiye.

Yeh update aksar 24 se 72 ghante mein reflect ho jaata hai.

## Bachchon ka Aadhaar aur MBU

5 saal se chhote bachche ka Aadhaar "Baal Aadhaar" hota hai — usme biometrics nahi hote. 5 saal aur phir 15 saal ki umar par Mandatory Biometric Update karana zaroori hai, warna Aadhaar inactive ho sakta hai. Yeh update nishulk hai agar samay par karayein.

## Aadhaar ko 10 saal baad update karna

UIDAI ne salaah di hai ki agar aapka Aadhaar 10 saal se update nahi hua hai, to aap identity aur address proof dobara upload karein. Yeh compulsory nahi hai lekin isse aapka record verified rehta hai aur baad mein bank ya passport verification mein dikkat nahi aati.

## Fees, ek nazar mein

- Demographic update (online ya centre): ₹50
- Biometric update: ₹100
- Bachchon ka MBU (samay par): free
- e-Aadhaar download: free
- PVC Aadhaar card order: ₹50

Agar koi operator isse zyada maange, to receipt maangiye aur UIDAI helpline 1947 par shikayat kariye.

## Status track karna aur rejection

"myaadhaar.uidai.gov.in" par "Check Enrolment & Update Status" mein URN daalkar status dekhiye. Agar request reject ho jaaye, to reason bataya jaata hai — sabse aam kaaran hain: document blurry hona, document par naam aur Aadhaar naam ka mismatch, aur address document 3 mahine se purana hona.

Reject hone par fee wapas nahi milti, isliye upload se pehle scan ko zoom karke padhiye — agar aap nahi padh paa rahe, verifier bhi nahi padh payega.

## Suraksha: yeh zaroor kariye

- **Aadhaar lock** kar dijiye jab tak zaroorat na ho, aur biometric lock hamesha on rakhiye.
- Kisi ko bhi Aadhaar OTP mat batayiye. UIDAI kabhi call karke OTP nahi maangta.
- Public computer par e-Aadhaar download mat kariye; agar karna pade, download folder khaali kar dijiye.
- Saal mein ek baar "Aadhaar Authentication History" check kariye — isse pata chalta hai ki aapka Aadhaar kahan-kahan use hua.

Bharat AI Sathi ek independent platform hai, UIDAI se juda nahi. Hum sirf process samjhaate hain; koi bhi update sirf official UIDAI portal ya authorised centre par hi kariye.`,
  ),

  G(
    "PAN card guide: apply, correction, Aadhaar linking aur e-PAN download",
    "New PAN application se lekar name correction, Aadhaar-PAN linking, instant e-PAN aur duplicate PAN tak — fees, timelines aur common mistakes ke saath poori guide.",
    "Government Services",
    "2026-07-26",
    12,
    `PAN (Permanent Account Number) India ka financial identity number hai. Bank account, income tax return, ₹50,000 se upar ke transactions, property purchase, mutual funds — sab jagah PAN chahiye. Yeh guide PAN se judi har common zaroorat ko cover karti hai.

## PAN kya hai aur kaise structure hota hai

PAN ek 10-character alphanumeric code hota hai, jaise ABCDE1234F. Isme pehle paanch letters, phir chaar digits, phir ek letter hota hai. Chautha character card-holder ka type batata hai — 'P' individual person ke liye, 'C' company, 'H' HUF, 'F' firm. Paanchwa character aapke surname ka pehla akshar hota hai. Isliye agar aapka PAN 'P' aur phir aapke surname ke akshar se match nahi karta, to kahin data entry error hui hai.

## Naya PAN kaise apply karein

Do official channels hain: **NSDL/Protean** aur **UTIITSL**. Dono valid hain, dono ka result ek hi PAN hota hai.

### Steps

1. Portal par "New PAN — Indian Citizen (Form 49A)" chuniye. NRI ke liye Form 49AA hota hai.
2. Application type aur category (Individual/HUF/Company) select kariye.
3. Naam, janm-tithi, pita ka naam (ya maa ka naam — ab option hai), address, aur contact details bhariye.
4. AO code (Assessing Officer code) — portal aapke pincode se auto-suggest karta hai. Usi ko rakhiye.
5. Documents: identity proof, address proof, date of birth proof. Aadhaar akela teenon ka kaam kar deta hai.
6. Fee pay kariye — Indian address ke liye lagbhag ₹107 (physical card) aur e-PAN ke liye kam.
7. Aadhaar-based e-KYC chuniye to koi physical document bhejna nahi padta; sab OTP se ho jaata hai.

Physical card 15-20 working days mein aata hai; e-PAN aksar 3-7 din mein email par.

## Instant e-PAN — 10 minute mein, bilkul free

Income Tax portal ("incometax.gov.in") par "Instant e-PAN" service hai. Shart sirf itni hai ki aapke paas Aadhaar ho, usme mobile linked ho, aur aapke paas pehle se PAN na ho.

1. Portal par "Instant e-PAN" → "Get New e-PAN"
2. Aadhaar number daaliye, consent tick kariye
3. OTP verify kariye
4. Aadhaar se details auto-fill hongi — confirm kariye
5. e-PAN turant generate hota hai aur PDF download ho jaata hai

Yeh e-PAN poori tarah valid hai — digitally signed, aur har jagah accept hota hai. Fees zero.

## PAN correction ya update

Naam, janm-tithi, photo, signature ya address badalna ho to "Changes or Correction in existing PAN" form use kariye. Zaroori baat: correction form mein aapko **sirf woh field tick karni hai jo badalni hai**. Baaki fields ko chhed diya to unke liye bhi proof maanga jaayega.

Shaadi ke baad surname change ke liye marriage certificate ya gazette notification chahiye. Spelling correction ke liye Aadhaar kaafi hai.

Correction ki fee bhi lagbhag ₹107 hoti hai, aur naya card 15-20 din mein aata hai. Aapka PAN number nahi badalta — sirf card ke details update hote hain.

## Aadhaar-PAN linking

Income Tax Act ke section 139AA ke tehat PAN ko Aadhaar se link karna zaroori hai. Agar link nahi hai to PAN "inoperative" ho jaata hai — matlab aap ITR file nahi kar sakte, refund nahi mil sakta, aur TDS zyada rate par katega.

### Linking kaise karein

1. "incometax.gov.in" par jaaiye
2. "Link Aadhaar" par click kariye
3. PAN aur Aadhaar number daaliye
4. Agar deadline nikal chuki hai to ₹1,000 late fee challan (Minor Head 500) pay karna hoga
5. OTP se validate kariye

Status check karne ke liye usi page par "Link Aadhaar Status" hai. Agar naam mismatch ke kaaran linking fail ho rahi hai, to pehle Aadhaar ya PAN mein se ek ko correct karwaiye taaki dono par naam bilkul same ho.

## Duplicate ya lost PAN

Agar card kho gaya hai lekin number yaad hai, to "Reprint of PAN card" service se ₹50 mein duplicate mangwaya ja sakta hai. Number bhi yaad nahi? Income Tax portal par "Know Your PAN" / "Verify Your PAN" service se naam aur DOB daalkar pata chal jaata hai.

**Kabhi bhi doosra naya PAN apply mat kariye.** Do PAN rakhna Income Tax Act ke section 272B ke tehat ₹10,000 tak ke jurmaane ka kaaran ban sakta hai. Agar galti se do PAN ban gaye hain, to ek ko surrender kariye — correction form mein "additional PAN" field mein purana number likhkar.

## Common galtiyaan

1. **Surname aur first name ki jagah badalna.** Form mein "Last Name" pehle aata hai. Log ulta bhar dete hain aur card par naam ulta chhap jaata hai.
2. **Father's name mein initials.** Poora naam likhiye, jaise Aadhaar/certificate par hai.
3. **Signature box se bahar.** Physical form mein signature box ke andar hona chahiye, warna reject.
4. **Photo purani ya blurry.** Recent, plain background wali passport photo lagaiye.
5. **Third-party agent ko documents dena.** Agent ₹500-1,500 charge karte hain aur aapke documents unke paas reh jaate hain. Official portal par khud kariye — 15 minute lagte hain.

## PAN aur privacy

PAN aapki poori financial identity se juda hai. Isliye:

- PAN card ki photo WhatsApp par forward mat kariye
- Kisi bhi random website par PAN number "verification" ke liye mat daaliye
- Job application mein PAN tabhi dein jab offer letter mil chuka ho
- Saal mein ek baar Form 26AS aur AIS check kariye — usme aapke PAN par hui saari transactions dikhti hain, aur koi anjaan entry ho to turant pata chal jaata hai

## Aage kya

Agar aapko ITR file karna hai ya PAN se judi kisi specific situation par salah chahiye, to ek qualified Chartered Accountant se baat kariye. Bharat AI Sathi ek independent guidance platform hai — hum government ya Income Tax Department se affiliated nahi hain, aur hum aapki taraf se koi application file nahi karte.`,
  ),

  G(
    "Passport apply kaise karein: fresh, tatkaal, renewal aur police verification",
    "Passport Seva portal par online apply karne ki poori guide — appointment, documents, fees, tatkaal rules, police verification aur status tracking, sab kuch Hindi-English mein.",
    "Government Services",
    "2026-07-25",
    14,
    `Passport banwana pehle ek lambi, thakane wali process thi. Aaj Passport Seva portal aur PSK/POPSK network ke saath yeh kaafi predictable ho gaya hai — agar aap documents sahi le jaayein. Yeh guide poora process cover karti hai.

## Kaunsa passport aapko chahiye

- **Fresh passport** — pehli baar
- **Re-issue** — expiry, pages khatam, ya details change
- **Tatkaal** — urgent, extra fee ke saath
- **Diplomatic/Official** — government officials ke liye

Zyadatar log Fresh ya Re-issue category mein aate hain.

## Step 1: Registration

"passportindia.gov.in" par "New User Registration" kariye. Yahan aapko woh Passport Seva Kendra (PSK) ya Post Office Passport Seva Kendra (POPSK) chunna hota hai jo aapke present address ke district mein aata hai. Login ID aur password banaiye — email verification link aata hai.

## Step 2: Application form bharna

Login karke "Apply for Fresh Passport/Re-issue of Passport" chuniye. Do tareeke hain — online form bharna, ya XML form download karke offline bharkar upload karna. Online form aasan hai kyunki woh real-time validation deta hai.

Form mein yeh sections aate hain:

**Applicant details.** Naam bilkul waise likhiye jaise aap passport par chahte hain aur jaise aapke documents par hai. Agar aap ek hi naam use karte hain (koi surname nahi), to "Surname" field mein poora naam aur "Given Name" khaali chhodiye — yeh officially allowed hai.

**Family details.** Mata-pita ka naam. Single parent ke case mein sirf ek naam bhi chalega, declaration ke saath.

**Present aur permanent address.** Present address woh hona chahiye jahan police verification ho sake. Agar aap kaam ke liye doosre sheher mein hain, to wahan ka address dijiye — lekin rent agreement ya employer letter ready rakhiye.

**Emergency contact aur references.** Do references chahiye jo aapke area mein rehte hon aur aapko jaante hon. Unka phone number sahi hona zaroori hai — police unko call kar sakti hai.

## Step 3: Appointment aur fee

Form submit karne ke baad "Pay and Schedule Appointment" par jaaiye. Fee online (net banking, card, UPI) pay hoti hai. Appointment slots roz release hote hain — aksar subah ke waqt. Slot na mile to agle din phir try kariye.

### Fees (approx, 2026)

- Fresh/Re-issue, 36 pages, 10 saal validity — ₹1,500
- 60 pages — ₹2,000
- Tatkaal additional — ₹2,000
- Minor (18 se kam), 5 saal — ₹1,000
- Lost/damaged passport replacement — ₹3,000

## Step 4: Documents

PSK par **original documents aur ek self-attested photocopy set** le jaaiye. Original wapas mil jaate hain.

**Proof of Date of Birth (koi ek):** Birth certificate, school leaving certificate, PAN, Aadhaar, driving licence, voter ID, LIC policy bond.

**Proof of Present Address (koi ek):** Aadhaar, electricity/water/telephone bill, bank passbook (photo ke saath), rent agreement (registered), gas connection proof, employer certificate.

**Non-ECR proof (agar applicable):** 10th pass certificate ya usse upar. Non-ECR status hone se kai deshon mein emigration clearance ki zaroorat nahi padti.

**Annexures.** Kuch cases mein specific annexure chahiye — minor ke liye parents ka declaration (Annexure D), government employee ke liye NOC ya Identity Certificate, single parent ke liye Annexure C. Ye sab portal ke "Documents Advisor" section se pata chal jaate hain — appointment se pehle woh zaroor check kariye.

## Step 5: PSK visit

PSK par teen counters hote hain:

- **Counter A** — document scanning, photo aur biometrics
- **Counter B** — verification officer
- **Counter C** — granting officer, final approval

Appointment time se 15 minute pehle pahunchiye. Mobile allowed hai lekin photography nahi. Poora process 60-90 minute leta hai. Nikalte waqt aapko acknowledgement letter milta hai jisme file number hota hai.

## Step 6: Police verification

Teen tarah ki verification hoti hai:

- **Pre-police verification** — passport print hone se pehle (fresh applications mein aam)
- **Post-police verification** — passport pehle mil jaata hai, verification baad mein (kuch re-issue cases)
- **No verification** — government employees jo Identity Certificate laate hain

Police station se call aata hai. Unhe original documents dikhaiye. Yahan ek important baat: police verification ke liye **koi official fee nahi hai**. Agar koi paisa maange to woh bribe hai, aur aap Passport Seva ke grievance portal ya state police complaint cell mein shikayat kar sakte hain.

## Tatkaal scheme

Tatkaal un logon ke liye hai jinhe passport jaldi chahiye. Isme:

- Extra ₹2,000 fee lagti hai
- Verification post-passport hoti hai (zyadatar cases mein)
- Passport aksar 3-5 working days mein mil jaata hai
- Verification Certificate (Annexure F) ya kuch specified documents mein se teen chahiye

Tatkaal har case mein grant nahi hota — granting officer discretion rakhta hai. Agar aapka case complicated hai (naam change, pehle passport lost, criminal case pending), to Tatkaal reject ho sakta hai aur fee refund nahi hoti.

## Minor ka passport

18 saal se kam umar walon ke liye:

- Dono parents ka passport ya Aadhaar chahiye
- Annexure D (dono parents ka consent) zaroori hai
- Agar ek parent consent nahi de raha, to Annexure G ke saath apply hota hai aur process lamba hota hai
- Validity 5 saal ya 18 saal ki umar tak, jo pehle ho

## Status tracking aur delivery

Portal par ya mPassport Seva app par file number daalkar status dekhiye. Status "Passport printed and dispatched" hone ke baad Speed Post tracking number milta hai. Passport aapke present address par register post se aata hai — ghar par koi hona chahiye jo receive kar sake, ID ke saath.

## Common galtiyaan

1. **Address proof present address se match nahi karna** — sabse bada rejection reason.
2. **Naam ke spelling mein inconsistency** — Aadhaar par kuch, 10th certificate par kuch aur.
3. **References ka phone number galat** — verification ruk jaati hai.
4. **Purana passport na le jaana** — re-issue mein original purana passport zaroori hai.
5. **Agent ke through apply karna** — agent aksar galat address ya galat category bhar dete hain, aur baad mein aap phanste hain.

Bharat AI Sathi ek independent guidance platform hai — hum Ministry of External Affairs se affiliated nahi hain. Application hamesha official Passport Seva portal se hi kariye.`,
  ),

  G(
    "AI se professional resume kaise banayein: 2026 ka practical guide",
    "ATS-friendly resume banane ka poora tarika — kaunse sections chahiye, AI ko kaise prompt karein, kya galtiyaan avoid karein, aur Indian job market ke liye specific tips.",
    "Jobs",
    "2026-07-24",
    12,
    `Ek achha resume aapko job nahi dilata — woh aapko interview dilata hai. Aur 2026 ke Indian job market mein us interview tak pahunchne ke liye aapke resume ko do audiences ko khush karna hota hai: ek software (ATS) aur ek insaan jiske paas aapke resume ke liye lagbhag 7 second hain.

AI dono ke liye madad kar sakta hai — lekin sirf tab jab aap usse sahi tarah use karein.

## Pehle samajhiye: ATS kya hai

ATS (Applicant Tracking System) woh software hai jo companies resumes filter karne ke liye use karti hain. Jab aap Naukri, LinkedIn ya company portal par apply karte hain, aapka resume pehle ATS mein jaata hai. Woh text extract karta hai, keywords match karta hai, aur recruiter ko ranked list deta hai.

Iska matlab hai ki:

- **Fancy design aksar nuksaan karta hai.** Multi-column layouts, text boxes, tables aur graphics ATS parse nahi kar paata. Aapka beautifully designed resume machine ko khaali dikh sakta hai.
- **PDF safest hai**, jab tak woh text-based ho (scanned image nahi).
- **Standard section headings** use kariye: "Work Experience", "Education", "Skills". Creative headings jaise "My Journey" ATS confuse karti hain.

## Resume ka sahi structure

### 1. Header
Naam, phone, email, city, LinkedIn URL. Bas. Photo India mein optional hai aur zyadatar tech/corporate roles mein zaroori nahi. Full address mat likhiye — sirf "Pune, Maharashtra" kaafi hai.

### 2. Professional summary (3-4 lines)
Yeh sabse zyada padha jaane wala hissa hai. Isme aapka current role, saal ka experience, do-teen core skills, aur ek concrete achievement hona chahiye.

Kamzor: "Hardworking professional seeking a challenging role in a reputed organisation."
Mazboot: "Backend developer with 4 years building payment systems in Node.js and PostgreSQL. Reduced transaction failure rate from 3.2% to 0.8% at a fintech handling 2 lakh daily orders."

### 3. Work experience
Reverse chronological. Har role ke liye 3-5 bullet points. Har bullet ek **action verb** se shuru ho aur ek **number** par khatam ho jahan possible ho.

Formula: "Kya kiya + kaise kiya + kya result nikla"

- "Migrated 40+ microservices from EC2 to Kubernetes, cutting infra cost by ₹18 lakh annually"
- "Led a 6-person team to deliver the Hindi UI localisation, growing tier-2 city signups by 34%"

### 4. Skills
Do groups mein baantiye: technical skills aur tools. Woh keywords include kariye jo job description mein hain — lekin sirf woh jo aap sach mein jaante hain.

### 5. Education aur certifications
Degree, institute, saal. Agar aap 5+ saal ke experienced hain to marks likhna optional hai. Freshers ke liye CGPA relevant hai.

### 6. Projects (freshers ke liye zaroori)
Har project ke saath: kya banaya, kaunsi tech, aur ek live link ya GitHub repo.

## AI ko sahi tarah prompt kaise karein

Sabse badi galti yeh hai: "Mera resume bana do." AI ke paas aapke baare mein koi information nahi hai, isliye woh generic, khokla text likh dega jo har doosre resume jaisa lagega.

### Achha workflow

**Step 1 — Raw material dijiye.** AI ko apna purana resume, ya bullet points mein apne kaam ka kachcha description dijiye. Jitna detail, utna behtar. Numbers, tools, team size, timeline — sab.

**Step 2 — Target job description paste kariye.** Yeh sabse powerful step hai. Prompt aisa:

> "Yeh meri current resume hai [paste]. Yeh woh job description hai jiske liye main apply kar raha hoon [paste]. Meri work experience ke bullets ko is role ke liye rewrite karo. Sirf woh cheezein rakho jo is role se relevant hain. Har bullet action verb se shuru ho aur measurable outcome include kare. Koi aisi skill mat jodo jo meri original resume mein nahi hai."

Aakhri line critical hai — warna AI woh skills likh dega jo aapke paas nahi hain, aur interview mein aap phans jaayenge.

**Step 3 — Summary alag se likhwaiye.** "Upar ke details ke aadhaar par ek 3-line professional summary likho jisme mera experience, top 3 skills aur sabse bada achievement ho."

**Step 4 — Keyword gap check.** "Is job description ke important keywords ki list banao jo meri resume mein missing hain." Phir aap khud decide kariye ki kaunse genuinely applicable hain.

**Step 5 — Tone aur length polish.** "Isse ek page mein fit karo, passive voice hatao, aur repetition kam karo."

## Kya AI se nahi karwana chahiye

**Jhooth mat likhwaiye.** AI confidently aisi achievements likh deta hai jo hui hi nahi. Har line padhiye aur poochhiye: "Kya main interview mein iske baare mein 2 minute bol sakta hoon?" Agar nahi, to hata dijiye.

**Buzzword soup se bachiye.** "Synergistic, results-driven, dynamic self-starter" — yeh shabd recruiters ko kuch nahi batate.

**Blindly copy mat kariye.** AI ka output aapka pehla draft hai, aakhri nahi. Har resume ko apni aawaz mein padhiye.

## Indian job market ke liye specific tips

- **Notice period** likhiye agar aap currently employed hain — recruiters ke liye yeh important filter hai.
- **Current aur expected CTC** resume mein mat daaliye. Woh baat baad mein hoti hai.
- **Date of birth, marital status, father's name** — ab inki zaroorat nahi hai. Jagah bachaiye.
- **Ek page** agar 5 saal se kam experience hai; do page zyada experience par. Teen page kabhi nahi.
- **File name** professional rakhiye: "Rahul-Sharma-Backend-Engineer.pdf", na ki "resume_final_2_updated.pdf".

## Cover letter ka role

Zyadatar Indian applications mein cover letter optional hai, lekin agar aap career switch kar rahe hain ya gap explain karna hai, to ek chhota, specific cover letter bahut madad karta hai. AI se: "150 shabdon ka cover letter likho jo bataye ki main marketing se product management mein kyun jaa raha hoon, aur mere paas kaunse transferable skills hain."

## Final checklist

1. Ek page (ya do, agar senior)
2. PDF, text-selectable
3. Har bullet mein ek number
4. Job description ke keywords naturally included
5. Koi spelling ya grammar mistake nahi
6. Contact details sahi
7. Kisi doosre insaan ne ek baar padh liya ho

Bharat AI Sathi ka Resume Builder isi workflow par bana hai — aap apni details daalte hain, AI structure aur bhasha polish karta hai, aur aap final output edit karke download karte hain. Lekin content hamesha aapka hona chahiye. AI ek acha editor hai; woh aapki kahani nahi jaanta.`,
  ),

  G(
    "PDF ko AI se kaise samjhein: contracts, reports aur sarkari documents",
    "Lambe PDF documents ko AI se padhne, summarise karne aur unse sawaal poochhne ka practical tareeka — accuracy kaise check karein aur kaunsi documents AI mein daalna khatarnaak hai.",
    "Productivity",
    "2026-07-23",
    11,
    `Hum sab ke paas aise PDF hote hain jinhe padhne ka mann nahi karta — 40 page ka rent agreement, insurance policy ka fine print, 120 page ki annual report, ya sarkari scheme ka guidelines document. AI in documents ko minute mein samajhne layak bana sakta hai. Lekin isme kuch asli risks hain jinhe jaanna zaroori hai.

## PDF Chat kaam kaise karta hai

Jab aap PDF upload karte hain, to teen cheezein hoti hain:

1. **Text extraction.** Tool PDF se raw text nikaalta hai. Agar PDF scanned image hai (jaise photocopy), to pehle OCR chalti hai jo image se text pehchanti hai.
2. **Chunking.** Poora document AI mein ek saath nahi jaata. Usse chhote hisson mein toda jaata hai.
3. **Retrieval.** Jab aap sawaal poochhte hain, system un chunks ko dhoondhta hai jo aapke sawaal se sabse zyada relevant hain, aur sirf woh AI ko bhejta hai.

Yeh samajhna kyun zaroori hai? Kyunki isse pata chalta hai ki AI kab galat ho sakta hai. Agar aapka jawab document ke 5 alag-alag jagah bikhre hue hai, to retrieval sirf 2 hisse utha sakta hai aur AI adhoora jawab dega.

## Sahi sawaal kaise poochhein

### Kamzor sawaal
"Is document ke baare mein batao."

Yeh AI ko poora document summarise karne ko kehta hai, aur aapko ek generic paragraph milta hai.

### Mazboot sawaal
- "Is rent agreement mein security deposit kitna hai, kab wapas milega, aur kaunsi conditions mein katega?"
- "Notice period ke clause ko exact shabdon mein quote karo aur phir simple Hindi mein samjhao."
- "Is policy mein kya cover NAHI hota? Sabhi exclusions list karo."
- "Page number ke saath batao ki penalty clauses kahan hain."

Pattern dekhiye: **specific + structured + source maango**.

## Sabse useful prompts

**Summary with structure**
> "Is document ka 10-point summary banao. Har point ek line ka ho. Sabse important point pehle."

**Red flag scan (contracts ke liye)**
> "Ek tenant/employee/customer ke nazariye se is agreement mein kaunse clauses risky ya one-sided hain? Har ek ke liye clause ka number aur wajah batao."

**Obligation extraction**
> "Is contract mein mujhpar kya-kya obligations hain aur unki deadlines kya hain? Table format mein do."

**Comparison**
> "Is scheme ke eligibility criteria aur documents ki list banao, aur bataao ki agar aavedak ke paas income certificate nahi hai to kya alternative allowed hai."

**Plain-language translation**
> "Section 7.3 ko aise samjhao jaise aap kisi aise vyakti ko samjha rahe ho jo legal terms nahi jaanta. Hindi mein."

**Jargon glossary**
> "Is document ke sabhi technical/legal terms ki ek glossary banao, har ek ki ek-line definition ke saath."

## Accuracy kaise verify karein

Yeh sabse important section hai. AI kabhi-kabhi "hallucinate" karta hai — matlab woh aisi baat confidently likh deta hai jo document mein hai hi nahi.

**Hamesha quote maangiye.** Prompt mein likhiye: "Har jawab ke saath document se exact line quote karo. Agar document mein jawab nahi hai to bolo 'document mein yeh nahi likha'."

**Ctrl+F se check kariye.** Jo number ya clause AI ne bataya, usse PDF mein search kariye. 30 second lagte hain aur aap galti se bach jaate hain.

**Do baar alag tareeke se poochhiye.** Agar dono jawab match karte hain, confidence badhta hai. Agar alag hain, document khud padhiye.

**Numbers par extra dhyaan.** AI ke saath sabse aam galti dates, amounts aur percentages mein hoti hai. Financial ya legal figures hamesha manually verify kariye.

## Scanned documents aur OCR

Purane sarkari documents, court orders, ya photocopied certificates aksar scanned images hote hain. Inke liye OCR (Optical Character Recognition) chalti hai. OCR ki accuracy depend karti hai:

- **Scan quality par** — 300 DPI ya usse upar best hai
- **Bhasha par** — Devanagari OCR English se thodi kam accurate hoti hai
- **Handwriting par** — handwritten text ki accuracy bahut kam hoti hai, ispar bharosa mat kariye
- **Table structure par** — tables aksar jumble ho jaate hain

Agar OCR output mein "l" aur "1", ya "O" aur "0" mix ho gaye hain, to numbers definitely manually check kariye.

## Suraksha: kya PDF AI mein NAHI daalna chahiye

Yeh list seriously lijiye:

- **Bank statements aur cheque images** — account number aur balance
- **Aadhaar, PAN aur passport ki scanned copies** — identity theft ka direct risk
- **Medical records** jo aapke ya kisi aur ke bare mein sensitive information rakhte hain
- **Company ka confidential data** — NDA ke tehat aap legally bound ho sakte hain
- **Doosron ka personal data** — jaise employees ki salary sheet ya customers ki list

Agar aapko aisa document samajhna hi hai, to pehle **redact** kariye: numbers aur naam blackout karke, ya sirf relevant paragraph copy karke. Bharat AI Sathi ka PDF tool text browser mein extract karta hai aur sirf zaroori hissa AI ko bhejta hai, lekin phir bhi principle yahi rehna chahiye — jitna kam sensitive data bahar jaaye, utna achha.

## Practical workflows

**Rent agreement sign karne se pehle:** Deposit terms, lock-in period, notice period, maintenance responsibility, aur rent escalation clause — in paanchon ke liye alag-alag poochhiye.

**Insurance policy khareedne se pehle:** Exclusions list, waiting period, claim process, aur sub-limits.

**Sarkari scheme guidelines padhte waqt:** Eligibility, documents, deadline, aur competent authority (kaun approve karega).

**Job offer letter:** Notice period, bond/clawback clause, non-compete, aur variable pay ki conditions.

**Company annual report:** Revenue trend, debt levels, auditor's qualifications (agar koi hai), aur management discussion ka tone.

## Ek aakhri baat

AI aapka pehla reader hai, aakhri nahi. Woh aapko document tak pahunchne ka rasta dikhata hai — 40 page ke bajaye 4 paragraph. Lekin agar faisla bada hai — paisa, naukri, property, ya kanoon — to final review ek insaan ko karna chahiye: aap khud, ya ek professional. AI ka summary kabhi bhi legal ya financial advice ki jagah nahi le sakta.`,
  ),

  G(
    "Hindi aur Indian languages mein AI: kya kaam karta hai, kya nahi",
    "Indian bhashaon mein AI tools ka realistic assessment — translation quality, Hinglish, code-mixing, transliteration aur apni bhasha mein behtar results paane ke practical tips.",
    "Artificial Intelligence",
    "2026-07-22",
    11,
    `India mein 22 scheduled languages hain aur 120 se zyada major bhashaein. Phir bhi zyadatar AI tools angrezi ke liye bane hain, aur Indian languages ka support "translate karke chipka diya" wala hota hai. 2026 mein tasveer kaafi behtar hai — lekin ekdum ek-jaisi nahi.

Yeh article batata hai ki aaj Indian bhashaon mein AI se kya realistically expect kiya ja sakta hai.

## Language support ke teen levels

**Level 1 — Strong.** Hindi, Bengali aur (kaafi hadd tak) Tamil, Telugu, Marathi. In bhashaon mein internet par bahut text hai, isliye models ne inhe theek se seekha hai. Chat, summary, email, translation — sab reasonable quality mein.

**Level 2 — Workable.** Gujarati, Kannada, Malayalam, Punjabi, Odia. Simple kaam achhe hote hain, lekin lambe creative writing ya nuanced legal text mein galtiyaan badh jaati hain.

**Level 3 — Limited.** Maithili, Santhali, Konkani, Bodo aur zyadatar tribal aur regional bhashaein. Yahan AI aksar approximate karta hai. Important kaam ke liye human verification zaroori hai.

Yeh ranking data ki availability se aati hai, bhasha ki complexity se nahi.

## Translation: kahan achhi hai, kahan nahi

**Achhi performance:** Roz-marra ki baat, product descriptions, emails, news-style content, aur simple instructions. Angrezi se Hindi aur Hindi se angrezi dono directions mein.

**Kamzor performance:**

- **Idioms aur muhaavare.** "Naach na jaane aangan tedha" ka literal translation bekaar hota hai. Achha AI meaning-based translation deta hai, lekin hamesha nahi.
- **Legal aur administrative Hindi.** Sarkari Hindi ka apna register hai — "tatsambandhi", "yathaasthiti", "upbandh". AI aksar isse zyada simple bana deta hai, jo formal document mein galat lagta hai.
- **Poetry aur wordplay.** Rhythm aur shabdon ka khel translation mein kho jaata hai.
- **Technical terms.** Kya "database" ko "aankda-kosh" likhna chahiye ya "database" hi rehne dena chahiye? AI inconsistent hota hai. Aap prompt mein bata dijiye: "Technical terms angrezi mein hi rakhna."

### Behtar translation ke liye prompt

> "Is paragraph ko Hindi mein translate karo. Tone formal rakho lekin aasan shabd use karo. Technical terms (API, server, database) angrezi mein hi rakho. Literal translation mat karo — matlab sahi aana chahiye."

## Hinglish aur code-mixing

Bharat mein log ek hi vaakya mein do bhashaein mila dete hain: "Kal meeting hai, please confirm kar dena." Yeh code-mixing hai, aur yeh galat Hindi nahi hai — yeh ek asli, widely-spoken register hai.

Achhi khabar: modern AI models Hinglish kaafi achhi tarah samajhte hain, khaaskar Roman script mein likhi Hindi. Aap "mujhe ek email likhna hai boss ko chhutti ke liye" likhein, to jawab sahi aayega.

Buri khabar: AI ka **output** aksar over-formal hota hai. Woh Hinglish input ka jawab shuddh Hindi mein de deta hai, jo natural nahi lagta. Iska solution simple hai — prompt mein explicitly bataiye:

> "Jawab Hinglish mein do, Roman script mein, jaise WhatsApp par baat karte hain."

## Script aur transliteration

Do alag cheezein hain jinhe log confuse karte hain:

- **Translation** — bhasha badalna (English → Hindi)
- **Transliteration** — script badalna ("namaste" → "नमस्ते")

Agar aap Roman mein Hindi type karte hain aur Devanagari output chahte hain, to aapko transliteration chahiye, translation nahi. Prompt: "Isse Devanagari script mein likho, shabd wahi rakhna."

Transliteration mein sabse aam galti proper nouns mein hoti hai — gaon ke naam, surname, scheme ke naam. "Bhagalpur" ko "भागलपुर" ya "भगलपुर" — yeh chhota antar sarkari form mein bada issue ban jaata hai. Isliye Aadhaar ya passport form bharte waqt AI transliteration par blindly bharosa mat kariye; original document se milaiye.

## Voice aur speech

Speech-to-text Hindi mein ab kaafi achhi hai — saaf audio mein 90%+ accuracy possible hai. Lekin:

- **Background noise** accuracy bahut girata hai
- **Strong regional accents** — Bhojpuri-influenced Hindi ya Malayali-accented English — error rate badhaate hain
- **Code-mixing** speech mein extra mushkil hai, kyunki model ko beech mein bhasha switch pakadni padti hai
- **Technical vocabulary** aur naam aksar galat likhe jaate hain

Practical tip: dictation ke baad hamesha text padhiye. Numbers, naam aur dates par khaas dhyaan dijiye.

## Apni bhasha mein behtar results paane ke 7 tips

1. **Bhasha explicitly bataiye.** "Hindi mein jawab do" ek line mein likh dena results kaafi improve karta hai.
2. **Audience bataiye.** "Ek gaon ke kisan ko samajh aaye aisi bhasha mein" vs "ek corporate email ke liye" — dono bilkul alag output dete hain.
3. **Length control kariye.** "150 shabdon mein" — warna AI lamba likh deta hai aur Hindi mein lamba text aksar repetitive ho jaata hai.
4. **Example dijiye.** Ek chhota sample de dijiye jaisa aap chahte hain. Yeh sabse effective technique hai.
5. **Do-step kaam kariye.** Pehle English mein content banwaiye (jahan model sabse strong hai), phir usse translate karwaiye. Aksar direct Hindi generation se behtar nikalta hai.
6. **Numbers aur naam khud check kariye.** Har baar.
7. **Iterate kariye.** "Yeh thoda zyada formal hai, aasan kariye" — AI se baat kariye, ek hi prompt par mat rukiye.

## Kya aage aa raha hai

Indian language AI teen dishaon mein tezi se badh raha hai: India-specific models (jaise BharatGPT-type efforts aur AI4Bharat ke open datasets), better speech models jo accents handle karte hain, aur government ke Bhashini jaise translation infrastructure projects.

Iska matlab hai ki agle kuch saal mein Level 2 aur Level 3 bhashaein kaafi upar aayengi. Lekin abhi ke liye rule simple hai: **AI ko draft banane dijiye, final approval insaan ka rakhiye** — khaaskar tab jab document kisi sarkari, kanooni ya vyavsayik kaam ke liye jaa raha ho.`,
  ),

  G(
    "Digital India: 12 sarkari apps aur portals jo aapka samay bachaate hain",
    "DigiLocker, UMANG, e-Shram, ABHA, FASTag, mParivahan aur baaki zaroori digital services — kya karte hain, kaise setup karein, aur real-life mein kahan kaam aate hain.",
    "Digital India",
    "2026-07-21",
    12,
    `Pichhle dus saal mein Indian government ne darjanon digital services launch ki hain. Problem yeh hai ki zyadatar logon ko sirf do-teen ke baare mein pata hai. Yeh guide un services par focus karti hai jo sach mein roz kaam aati hain — aur unhe setup karne ka sabse chhota rasta batati hai.

## 1. DigiLocker — aapke documents cloud mein

DigiLocker sarkari documents ka digital wallet hai. Isme rakha document **legally original ke barabar** hai (IT Act ke Rule 9A ke tehat), matlab traffic police, airport, ya school admission mein accept karna hoga.

**Setup:** Aadhaar aur linked mobile chahiye. App download → Aadhaar OTP → 6-digit PIN set.

**Kya milta hai:** Driving licence, RC (vehicle registration), PAN, class 10/12 marksheets (CBSE aur kai state boards), insurance policies, Ayushman card, aur kai state-level certificates.

**Real use:** Traffic stop par phone se DL dikhaiye. Hotel check-in par Aadhaar ka masked version share kariye. Job application mein marksheet turant.

## 2. UMANG — 2,000+ services ek app mein

UMANG (Unified Mobile Application for New-age Governance) ek chhatri app hai jisme central aur state, dono ki services hain.

**Sabse useful:** EPFO passbook aur claim status, PAN services, gas cylinder booking, electricity bill, Bharat Bill Pay, crop insurance status, aur pension services.

**Tip:** Login Aadhaar OTP ya MPIN se hota hai. Ek baar login karke apne favourite services "pin" kar lijiye, warna 2,000 services mein dhoondhna mushkil hai.

## 3. e-Shram — unorganised workers ka registry

Agar aap unorganised sector mein kaam karte hain — construction, domestic work, street vending, gig work, farming labour — to e-Shram card banwaiye.

**Kyun:** Yeh ek Universal Account Number (UAN) deta hai, ₹2 lakh ka accidental insurance cover (PMSBY-linked) aata hai, aur bahut si welfare schemes ka delivery ab e-Shram database se hoti hai.

**Kaise:** "eshram.gov.in" par Aadhaar-linked mobile se self-registration, ya CSC centre par. Free hai.

## 4. ABHA (Ayushman Bharat Health Account) — health records

ABHA ek 14-digit health ID hai jo aapke medical records ko digitally link karta hai.

**Kyun useful:** Doctor badalne par purani reports dobara nahi banwaani padti. Hospital, lab aur pharmacy ke records ek jagah.

**Setup:** "abha.abdm.gov.in" par Aadhaar ya driving licence se. 2 minute lagte hain.

**Privacy note:** Records tabhi share hote hain jab aap consent dete hain, har baar. Consent ki history bhi app mein dikhti hai — usse review karte rahiye.

## 5. FASTag — toll ke liye zaroori

FASTag ab har four-wheeler ke liye practically compulsory hai; bina iske toll double lagta hai.

**Tip jo log nahi jaante:** Ek gaadi par sirf ek active FASTag hona chahiye. Purani gaadi bechte waqt FASTag close karwana zaroori hai, warna naye maalik ke toll aapke account se katenge. Aur "Annual Pass" jaise naye options highway commuters ke liye bahut paisa bachate hain.

## 6. mParivahan — DL aur RC digital

Transport ministry ka app. Virtual DL aur RC, vehicle details by number, challan status aur payment, aur pollution certificate validity.

**Real use:** Purani gaadi khareedne se pehle uska number daalkar check kariye — registration date, insurance validity, aur pending challan sab dikh jaate hain. Yeh 30-second check hazaaron rupaye bacha sakta hai.

## 7. Income Tax e-filing portal

"incometax.gov.in" sirf ITR file karne ke liye nahi hai. Yahan aap dekh sakte hain:

- **Form 26AS** — aapke PAN par kata hua saara TDS
- **AIS (Annual Information Statement)** — aapki saari reported financial transactions
- **e-Verify** — return ko Aadhaar OTP se verify kariye (bina iske ITR invalid hai)
- **Grievance** — refund atka ho to yahin se shikayat

Saal mein ek baar AIS dekhna acchi aadat hai — kabhi-kabhi usme aisi transaction dikhti hai jo aapne ki hi nahi.

## 8. GST portal (business ke liye)

Agar aap business chalate hain: return filing, e-way bill, aur sabse useful — **counterparty GSTIN verification**. Naye vendor ke saath kaam shuru karne se pehle uska GSTIN check kariye ki active hai ya nahi.

## 9. NPS aur EPFO portals

**EPFO:** UAN activate karke passbook, KYC, aur online claim. Job change par transfer ab online ho jaata hai — pehle jaisa physical form nahi chahiye.

**NPS:** Retirement corpus track karna, aur Tier-II account se tax-efficient investing.

## 10. National Scholarship Portal

Students ke liye ek hi jagah par central aur state scholarships. Deadlines aksar October-November mein hoti hain. Yahan sabse badi galti bank account mismatch hoti hai — account Aadhaar-seeded hona chahiye.

## 11. CPGRAMS — shikayat ka official rasta

"pgportal.gov.in" central government ka grievance system hai. Kisi bhi ministry ya department ke against complaint file kar sakte hain, aur usse track kar sakte hain. Har complaint ko ek registration number milta hai aur nodal officer assign hota hai.

**Practical tip:** Complaint mein emotion kam, facts zyada rakhiye — date, reference number, kya hua, kya expected tha, kya chahiye. Attachments lagaiye. Escalation ka option bhi hota hai agar reply satisfactory na ho.

## 12. Bhashini — bhasha ki deewar todne ke liye

Government ka translation aur speech platform, jo kai sarkari apps mein integrate ho raha hai. Iska sabse bada asar yeh hai ki aane wale saalon mein sarkari services aur zyada bhashaon mein available hongi.

## Setup karne ka smart order

Agar aap shuru se kar rahe hain, is sequence mein kariye:

1. **Aadhaar mein mobile number update** — sab kuch iske upar chalta hai
2. **DigiLocker** — documents ek jagah
3. **UMANG** — ek app, kai services
4. **e-Shram ya EPFO** — aapke kaam ke hisaab se
5. **ABHA** — health records
6. **Income Tax portal** — saal mein kam se kam ek baar

## Suraksha ke chaar niyam

1. **Sirf official app store se download kariye.** APK links WhatsApp par forward hote hain — woh aksar malware hote hain.
2. **URL check kariye.** Official government sites ".gov.in" ya ".nic.in" par hoti hain.
3. **OTP kabhi share mat kariye.** Koi bhi sarkari adhikari OTP nahi maangta.
4. **Screen sharing apps se bachiye.** "Main aapki madad karta hoon, AnyDesk download kariye" — yeh fraud ka sabse aam pattern hai.

Bharat AI Sathi in services ka official partner nahi hai. Hum sirf process samjhaate hain aur official links par bhejte hain — application hamesha official portal se hi kariye.`,
  ),
];
