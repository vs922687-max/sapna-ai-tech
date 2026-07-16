import {
  IdCard, CreditCard, Vote, BookMarked, Car, Baby, IndianRupee, Users, MapPin,
  HardHat, Sprout, HeartPulse, Home, Hammer, Landmark, PiggyBank, Wallet, ShieldCheck, Sunrise,
  type LucideIcon,
} from "lucide-react";

export type GovCategory =
  | "Identity" | "Certificates" | "Welfare" | "Finance" | "Pension"
  | "Education" | "Scholarship" | "Jobs" | "Railways" | "Banking" | "Tax"
  | "Business" | "Vehicle" | "Transport" | "Municipal" | "Property" | "Legal"
  | "Utilities" | "Women" | "Minority" | "Disability" | "SeniorCitizen"
  | "Housing" | "Labour" | "Health" | "Insurance" | "Digital" | "Agriculture"
  | "Police" | "Consumer";

export type GovService = {
  slug: string;
  name: string;
  hindi: string;
  category: GovCategory;
  tagline: string;
  icon: LucideIcon;
  accent: string; // tailwind gradient classes
  official: string;
  ministry: string;
  eligibility: string[];
  documents: string[];
  steps: { title: string; detail: string }[];
  notes: string[];
  faqs: { q: string; a: string }[];
};

const A = {
  saffron: "from-[oklch(0.76_0.17_55)]/25 to-[oklch(0.76_0.17_55)]/5 ring-[oklch(0.76_0.17_55)]/30 text-[oklch(0.76_0.17_55)]",
  green: "from-[oklch(0.66_0.16_155)]/25 to-[oklch(0.66_0.16_155)]/5 ring-[oklch(0.66_0.16_155)]/30 text-[oklch(0.66_0.16_155)]",
  royal: "from-[oklch(0.55_0.2_265)]/25 to-[oklch(0.55_0.2_265)]/5 ring-[oklch(0.55_0.2_265)]/30 text-[oklch(0.7_0.18_265)]",
  rose: "from-[oklch(0.68_0.2_20)]/25 to-[oklch(0.68_0.2_20)]/5 ring-[oklch(0.68_0.2_20)]/30 text-[oklch(0.68_0.2_20)]",
  gold: "from-[oklch(0.78_0.15_85)]/25 to-[oklch(0.78_0.15_85)]/5 ring-[oklch(0.78_0.15_85)]/30 text-[oklch(0.78_0.15_85)]",
};

export const GOV_SERVICES: GovService[] = [
  {
    slug: "aadhaar", name: "Aadhaar", hindi: "आधार", category: "Identity",
    tagline: "12-digit unique identity issued by UIDAI.",
    icon: IdCard, accent: A.saffron, official: "https://uidai.gov.in",
    ministry: "UIDAI, Ministry of Electronics & IT",
    eligibility: ["Every resident of India (including infants)", "NRIs with valid Indian passport"],
    documents: ["Proof of Identity (PAN, Voter ID, Passport)", "Proof of Address (Utility bill, Bank statement)", "Proof of Date of Birth", "Proof of Relationship (for children)"],
    steps: [
      { title: "Find enrolment centre", detail: "Locate the nearest Aadhaar Seva Kendra on uidai.gov.in." },
      { title: "Book appointment", detail: "Book online or walk in with original documents." },
      { title: "Biometrics & photo", detail: "Fingerprints, iris scan and photo are captured." },
      { title: "Collect acknowledgement", detail: "Note the 14-digit enrolment ID (EID) to track status." },
      { title: "Download e-Aadhaar", detail: "In 7-30 days, download the PDF from myaadhaar.uidai.gov.in." },
    ],
    notes: ["Enrolment is free. Updates like address are ₹50, biometrics ₹100.", "Never share your Aadhaar OTP with anyone."],
    faqs: [
      { q: "Is Aadhaar mandatory?", a: "It is required for many government subsidies, PAN linking and welfare schemes, but not for private services by law." },
      { q: "How to update address online?", a: "Log in to myaadhaar.uidai.gov.in with your registered mobile OTP and upload a valid address proof." },
    ],
  },
  {
    slug: "pan-card", name: "PAN Card", hindi: "पैन कार्ड", category: "Identity",
    tagline: "Permanent Account Number for taxation and finance.",
    icon: CreditCard, accent: A.royal, official: "https://www.incometax.gov.in/iec/foportal/",
    ministry: "Income Tax Department",
    eligibility: ["Indian citizens, minors, HUFs, companies, NRIs earning in India"],
    documents: ["Aadhaar (for instant e-PAN)", "Proof of Identity & Address", "Proof of Date of Birth", "Passport-size photograph"],
    steps: [
      { title: "Choose portal", detail: "Apply on NSDL (protean-tinpan.com) or UTIITSL, or get instant e-PAN via Income Tax portal using Aadhaar." },
      { title: "Fill Form 49A / 49AA", detail: "49A for citizens, 49AA for foreign nationals." },
      { title: "Pay fee", detail: "₹107 for Indian address, ₹1,017 for foreign address (physical card)." },
      { title: "e-KYC / send documents", detail: "Complete Aadhaar e-KYC or courier signed acknowledgement." },
      { title: "Receive PAN", detail: "e-PAN in minutes, physical card in 15-20 days." },
    ],
    notes: ["Link PAN with Aadhaar to keep it active.", "One person can hold only one PAN — duplicates attract ₹10,000 penalty."],
    faqs: [
      { q: "How to get instant e-PAN?", a: "Visit incometax.gov.in → Instant e-PAN → enter Aadhaar → verify OTP. Free and issued in ~10 minutes." },
      { q: "PAN-Aadhaar linking fee?", a: "₹1,000 late fee applies for linking after the last deadline." },
    ],
  },
  {
    slug: "voter-id", name: "Voter ID", hindi: "वोटर आईडी", category: "Identity",
    tagline: "EPIC card issued by Election Commission of India.",
    icon: Vote, accent: A.green, official: "https://voters.eci.gov.in",
    ministry: "Election Commission of India",
    eligibility: ["Indian citizen aged 18+ as on qualifying date", "Ordinary resident of the constituency"],
    documents: ["Age proof (Aadhaar, PAN, Birth certificate)", "Address proof", "Passport-size photo"],
    steps: [
      { title: "Register on NVSP", detail: "Sign up at voters.eci.gov.in or the Voter Helpline app." },
      { title: "Fill Form 6", detail: "Form 6 for new voter, Form 8 for correction/shift." },
      { title: "Upload documents", detail: "Attach scanned proofs and photo." },
      { title: "BLO verification", detail: "Booth Level Officer verifies at your address." },
      { title: "Download e-EPIC", detail: "Digital voter ID available for download after approval." },
    ],
    notes: ["Registration is completely free.", "Check name in electoral roll before every election."],
    faqs: [
      { q: "Can I vote without a Voter ID?", a: "Yes, if your name is on the roll, you can vote with 11 alternative photo IDs like Aadhaar or Passport." },
      { q: "How to shift voter ID to a new city?", a: "File Form 8 online selecting 'Shifting of residence' with new address proof." },
    ],
  },
  {
    slug: "passport", name: "Passport", hindi: "पासपोर्ट", category: "Identity",
    tagline: "International travel document by Ministry of External Affairs.",
    icon: BookMarked, accent: A.royal, official: "https://www.passportindia.gov.in",
    ministry: "Ministry of External Affairs",
    eligibility: ["Indian citizens of any age"],
    documents: ["Aadhaar", "PAN / Voter ID", "Birth certificate or 10th marksheet", "Address proof"],
    steps: [
      { title: "Register on portal", detail: "Create an account on passportindia.gov.in." },
      { title: "Fill application", detail: "Choose Fresh / Reissue, Normal or Tatkaal." },
      { title: "Pay fee & book appointment", detail: "₹1,500 (36 pages) or ₹2,000 (60 pages); Tatkaal extra ₹2,000." },
      { title: "Visit PSK/POPSK", detail: "Carry originals for verification, biometrics and photo." },
      { title: "Police verification", detail: "Local police visits your address; passport dispatched in 15-30 days." },
    ],
    notes: ["Tatkaal issue in 1-3 working days after police clearance.", "Minors need both parents' consent (Annexure D)."],
    faqs: [
      { q: "Passport validity?", a: "10 years for adults, 5 years or till age 18 for minors." },
      { q: "Can I track my application?", a: "Yes, use the file number on passportindia.gov.in or the mPassport Seva app." },
    ],
  },
  {
    slug: "driving-licence", name: "Driving Licence", hindi: "ड्राइविंग लाइसेंस", category: "Identity",
    tagline: "Legal permit to drive issued by RTO.",
    icon: Car, accent: A.saffron, official: "https://parivahan.gov.in/parivahan/",
    ministry: "Ministry of Road Transport & Highways",
    eligibility: ["16+ for gearless two-wheeler (≤50cc)", "18+ for cars/geared vehicles", "20+ for commercial vehicles"],
    documents: ["Aadhaar / age proof", "Address proof", "Learner's Licence", "Form 1 (self-declaration of health)"],
    steps: [
      { title: "Apply for LL", detail: "Fill Form 2 on parivahan.gov.in and take online learner's test." },
      { title: "Practice 30 days", detail: "LL is valid 6 months; you must wait at least 30 days before DL test." },
      { title: "Book DL slot", detail: "Choose date, RTO and vehicle class." },
      { title: "Take driving test", detail: "Slot test at RTO track with your vehicle." },
      { title: "Receive DL", detail: "Smart card DL couriered within 2-3 weeks." },
    ],
    notes: ["DL is valid for 20 years or till age 40 (whichever earlier).", "Renew within 1 year of expiry to avoid re-test."],
    faqs: [
      { q: "Can I get an international DL?", a: "Yes — apply for IDP at your home RTO with valid DL, passport and visa." },
      { q: "Lost DL — what to do?", a: "File FIR, then apply for duplicate DL on parivahan.gov.in with LLD form and fee." },
    ],
  },
  {
    slug: "birth-certificate", name: "Birth Certificate", hindi: "जन्म प्रमाण पत्र", category: "Certificates",
    tagline: "Legal proof of birth issued by municipal authority.",
    icon: Baby, accent: A.rose, official: "https://crsorgi.gov.in",
    ministry: "Registrar General of India",
    eligibility: ["Any person born in India (registration free within 21 days)"],
    documents: ["Hospital discharge summary", "Parents' Aadhaar & marriage certificate", "Address proof"],
    steps: [
      { title: "Register on CRS", detail: "Create account on crsorgi.gov.in." },
      { title: "Fill birth details", detail: "Enter child's name, parents, hospital and address." },
      { title: "Upload documents", detail: "Attach hospital proof and parents' IDs." },
      { title: "Municipal verification", detail: "Local body verifies with hospital records." },
      { title: "Download certificate", detail: "Digitally signed certificate available in 7-15 days." },
    ],
    notes: ["Late registration (after 21 days) requires magistrate order and small fee.", "Mandatory for school admission, passport and Aadhaar for children."],
    faqs: [
      { q: "Can I get it for a birth 20 years ago?", a: "Yes, apply for delayed registration with affidavit at your municipal office." },
      { q: "Is it free?", a: "Free within 21 days; ₹10-₹100 late fee depending on state." },
    ],
  },
  {
    slug: "income-certificate", name: "Income Certificate", hindi: "आय प्रमाण पत्र", category: "Certificates",
    tagline: "Proof of annual family income for scholarships & subsidies.",
    icon: IndianRupee, accent: A.gold, official: "https://services.india.gov.in",
    ministry: "State Revenue Department",
    eligibility: ["Any Indian resident whose family income is below prescribed limit"],
    documents: ["Aadhaar", "Ration card", "Salary slips / Form 16 / self-declaration", "Address proof"],
    steps: [
      { title: "Visit state portal", detail: "Go to your state's e-district / Seva Sindhu / Meeseva portal." },
      { title: "Fill application", detail: "Enter family details, occupation and income sources." },
      { title: "Upload proofs", detail: "Attach Aadhaar, salary slips and self-declaration affidavit." },
      { title: "Tehsildar verification", detail: "Revenue officer verifies income; may inspect address." },
      { title: "Download certificate", detail: "Digitally signed PDF issued in 15-30 days, valid 1-3 years." },
    ],
    notes: ["Required for OBC/EWS quota, scholarships, government jobs.", "Validity differs by state — typically 1 to 3 years."],
    faqs: [
      { q: "What income sources are counted?", a: "Salary, business, agriculture, pensions and rental income of all family members." },
      { q: "How much fee?", a: "₹10 to ₹50 depending on state; some states waive it fully." },
    ],
  },
  {
    slug: "caste-certificate", name: "Caste Certificate", hindi: "जाति प्रमाण पत्र", category: "Certificates",
    tagline: "Proof of SC/ST/OBC status for reservation benefits.",
    icon: Users, accent: A.saffron, official: "https://services.india.gov.in",
    ministry: "State Social Welfare Department",
    eligibility: ["Members of Scheduled Castes, Scheduled Tribes or Other Backward Classes as notified"],
    documents: ["Aadhaar", "Father's caste certificate (if any)", "School leaving / birth certificate", "Ration card"],
    steps: [
      { title: "Apply on state portal", detail: "Use e-district / MeeSeva / Seva Sindhu of your state." },
      { title: "Fill caste details", detail: "Choose category and sub-caste from official list." },
      { title: "Upload proofs", detail: "Father's certificate is the strongest proof." },
      { title: "Field verification", detail: "Tehsildar / revenue inspector verifies community." },
      { title: "Certificate issued", detail: "PDF issued in 21-30 days; usually lifetime valid." },
    ],
    notes: ["OBC certificate for central jobs needs 'Non-Creamy Layer' clause (income below ₹8 lakh).", "SC/ST certificates are usually permanent."],
    faqs: [
      { q: "Is it valid across states?", a: "Central government purposes yes; state jobs may require state-issued certificate." },
      { q: "How to renew OBC-NCL?", a: "Fresh certificate needed every 1-3 years reflecting latest income." },
    ],
  },
  {
    slug: "domicile-certificate", name: "Domicile Certificate", hindi: "निवास प्रमाण पत्र", category: "Certificates",
    tagline: "Proof that you are a permanent resident of a state.",
    icon: MapPin, accent: A.green, official: "https://services.india.gov.in",
    ministry: "State Revenue Department",
    eligibility: ["Person residing in the state for a minimum period (usually 3-15 years)"],
    documents: ["Aadhaar", "Ration card", "School certificates showing state residency", "Electricity/water bill"],
    steps: [
      { title: "Open state e-district", detail: "Access the domicile module on your state portal." },
      { title: "Fill residency details", detail: "Provide years of residence and permanent address." },
      { title: "Upload proofs", detail: "Include long-standing residence evidence like school records." },
      { title: "Verification", detail: "Tehsildar office verifies claim." },
      { title: "Download", detail: "Digitally signed certificate in 15-30 days." },
    ],
    notes: ["Needed for state quota admissions and jobs.", "Rules vary — J&K, HP and NE states have special conditions."],
    faqs: [
      { q: "Difference from address proof?", a: "Address proof shows current address; domicile shows long-term/permanent state residency." },
      { q: "Can a person hold two domiciles?", a: "Generally no — only one state can be your permanent domicile at a time." },
    ],
  },
  {
    slug: "e-shram", name: "e-Shram Card", hindi: "ई-श्रम कार्ड", category: "Welfare",
    tagline: "Universal ID for unorganised workers with ₹2 lakh accident cover.",
    icon: HardHat, accent: A.gold, official: "https://eshram.gov.in",
    ministry: "Ministry of Labour & Employment",
    eligibility: ["Unorganised worker aged 16-59", "Not a member of EPFO/ESIC/NPS", "Not an income tax payer"],
    documents: ["Aadhaar linked with mobile", "Bank account (Aadhaar linked)"],
    steps: [
      { title: "Visit eshram.gov.in", detail: "Click 'Self Registration'." },
      { title: "Enter Aadhaar", detail: "Verify with mobile OTP." },
      { title: "Fill profile", detail: "Personal, address, occupation, education, bank & nominee details." },
      { title: "Preview & submit", detail: "UAN (12-digit) generated instantly." },
      { title: "Download card", detail: "e-Shram card downloadable as PDF immediately." },
    ],
    notes: ["Registration is 100% free.", "Accidental death / permanent disability cover ₹2 lakh under PMSBY."],
    faqs: [
      { q: "Do I get monthly income from e-Shram?", a: "No, e-Shram itself does not pay a monthly stipend. Some states run linked schemes." },
      { q: "Can farmers register?", a: "Only agricultural labourers and sharecroppers — not landowning farmers with PAN/EPFO." },
    ],
  },
  {
    slug: "pm-kisan", name: "PM Kisan Samman Nidhi", hindi: "पीएम किसान", category: "Welfare",
    tagline: "₹6,000/year direct benefit to eligible farmer families.",
    icon: Sprout, accent: A.green, official: "https://pmkisan.gov.in",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    eligibility: ["Landholding farmer families", "Aadhaar-seeded bank account", "e-KYC completed"],
    documents: ["Aadhaar", "Land record (Khasra/Khatauni)", "Bank passbook"],
    steps: [
      { title: "Farmer registration", detail: "Visit pmkisan.gov.in → New Farmer Registration." },
      { title: "Verify Aadhaar", detail: "Enter Aadhaar, state and captcha; OTP verification." },
      { title: "Fill land details", detail: "Enter Khasra number, area and bank details." },
      { title: "e-KYC", detail: "Complete OTP or biometric e-KYC — mandatory for every instalment." },
      { title: "Get ₹2,000 x 3", detail: "₹2,000 credited directly every 4 months (3 instalments/year)." },
    ],
    notes: ["Income tax payers, pensioners > ₹10,000 and constitutional post holders are NOT eligible.", "Check status → Beneficiary Status on the portal."],
    faqs: [
      { q: "Why did I not receive an instalment?", a: "Most common reasons: e-KYC pending, Aadhaar not linked to bank, or land not verified by state." },
      { q: "Can tenant farmers apply?", a: "No, only landholding farmer families are eligible per current guidelines." },
    ],
  },
  {
    slug: "ayushman-bharat", name: "Ayushman Bharat (PMJAY)", hindi: "आयुष्मान भारत", category: "Welfare",
    tagline: "₹5 lakh/year cashless health cover per family.",
    icon: HeartPulse, accent: A.rose, official: "https://pmjay.gov.in",
    ministry: "National Health Authority",
    eligibility: ["Families listed in SECC 2011 deprivation criteria", "Certain occupational categories (urban)", "70+ senior citizens (universal, 2024 expansion)"],
    documents: ["Aadhaar", "Ration card", "Mobile number for OTP"],
    steps: [
      { title: "Check eligibility", detail: "Visit beneficiary.nha.gov.in or pmjay.gov.in and search by mobile/Aadhaar/ration." },
      { title: "Locate CSC/hospital", detail: "Visit nearest Common Service Centre or empanelled hospital." },
      { title: "e-KYC verification", detail: "Aadhaar biometric or OTP verification done by operator." },
      { title: "Get Ayushman Card", detail: "PVC card printed (₹30) or download e-card free." },
      { title: "Avail treatment", detail: "Show card at any empanelled hospital for cashless treatment up to ₹5 lakh." },
    ],
    notes: ["Cover is per family, not per person.", "Over 1,900 medical procedures covered including cancer, cardiac, dialysis."],
    faqs: [
      { q: "Is registration mandatory?", a: "You must be pre-listed as eligible; new households cannot enrol unless a special scheme (like 70+) covers them." },
      { q: "Can I use it outside my state?", a: "Yes, portability is allowed at any empanelled hospital across India." },
    ],
  },
  {
    slug: "pm-awas-yojana", name: "PM Awas Yojana", hindi: "पीएम आवास योजना", category: "Welfare",
    tagline: "Housing subsidy for urban and rural poor.",
    icon: Home, accent: A.saffron, official: "https://pmaymis.gov.in",
    ministry: "Ministry of Housing & Urban Affairs / Rural Development",
    eligibility: ["Family without a pucca house anywhere in India", "Annual income within EWS (≤₹3L) / LIG (≤₹6L) / MIG limits", "Woman ownership preferred"],
    documents: ["Aadhaar of all members", "Income certificate", "Bank details", "Land documents (for rural)"],
    steps: [
      { title: "Choose scheme", detail: "PMAY-U (urban) via pmaymis.gov.in or PMAY-G (rural) via pmayg.nic.in." },
      { title: "Fill application", detail: "Enter Aadhaar, family details, income and land info." },
      { title: "Submit at ULB/Panchayat", detail: "Urban Local Body or Gram Panchayat verifies application." },
      { title: "Approval & installments", detail: "Central assistance released in tranches to bank account." },
      { title: "Construction", detail: "Complete construction with geo-tagged progress photos." },
    ],
    notes: ["Interest subsidy on home loan under CLSS up to ₹2.67 lakh (past scheme; check current status).", "Owning a pucca house anywhere in India disqualifies the family."],
    faqs: [
      { q: "How much financial help?", a: "Rural: ₹1.20 lakh (plain), ₹1.30 lakh (hilly). Urban: varies by vertical up to ₹2.5 lakh subsidy." },
      { q: "Can I apply if I own land?", a: "Yes for PMAY-G if you have land but no pucca house." },
    ],
  },
  {
    slug: "pm-vishwakarma", name: "PM Vishwakarma", hindi: "पीएम विश्वकर्मा", category: "Welfare",
    tagline: "Recognition, skill training and loans for 18 traditional trades.",
    icon: Hammer, accent: A.gold, official: "https://pmvishwakarma.gov.in",
    ministry: "Ministry of MSME",
    eligibility: ["Artisans in 18 notified trades (carpenter, blacksmith, tailor, potter, etc.)", "Aged 18+", "Self-employed in traditional craft"],
    documents: ["Aadhaar", "Mobile linked to Aadhaar", "Bank account", "Ration card"],
    steps: [
      { title: "Visit CSC", detail: "Registration done via Common Service Centre with biometric authentication." },
      { title: "Gram/ULB verification", detail: "Panchayat or Urban Local Body verifies trade." },
      { title: "Vishwakarma certificate & ID", detail: "Digital ID and certificate issued." },
      { title: "Skill training", detail: "5-7 day basic training with ₹500/day stipend + ₹15,000 toolkit voucher." },
      { title: "Credit support", detail: "Collateral-free loan ₹1 lakh (tranche 1) + ₹2 lakh (tranche 2) at 5% interest." },
    ],
    notes: ["Only one member per family can register.", "Beneficiaries of PMEGP/PM SVANidhi/Mudra in last 5 years may be ineligible for loan."],
    faqs: [
      { q: "Which trades are covered?", a: "Carpenter, boat maker, blacksmith, hammer/tool maker, locksmith, goldsmith, potter, sculptor, cobbler, mason, basket weaver, doll maker, barber, garland maker, washerman, tailor, fishing net maker, toy maker." },
      { q: "Is training paid?", a: "Yes, ₹500 per day stipend during basic and advanced training." },
    ],
  },
  {
    slug: "mudra-loan", name: "PM Mudra Loan", hindi: "मुद्रा लोन", category: "Finance",
    tagline: "Collateral-free business loans up to ₹20 lakh.",
    icon: Landmark, accent: A.royal, official: "https://www.mudra.org.in",
    ministry: "Ministry of Finance",
    eligibility: ["Non-corporate, non-farm small business", "Manufacturing, trading, services & allied agriculture"],
    documents: ["Aadhaar & PAN", "Business proof / GST", "Bank statements", "Project report / quotations"],
    steps: [
      { title: "Pick category", detail: "Shishu (up to ₹50K), Kishore (₹50K-₹5L), Tarun (₹5L-₹10L), Tarun Plus (₹10L-₹20L)." },
      { title: "Choose lender", detail: "Apply at any public/private bank, RRB, MFI, NBFC or via Jan Samarth portal." },
      { title: "Submit application", detail: "Fill Mudra loan form with business plan and quotations." },
      { title: "Bank appraisal", detail: "Lender assesses viability — no collateral, no processing fee (Shishu)." },
      { title: "Loan disbursement", detail: "Amount credited to business account; MUDRA card issued for working capital." },
    ],
    notes: ["Interest rates as per RBI (bank's MCLR).", "Repayment tenure up to 5-7 years."],
    faqs: [
      { q: "Do I need CIBIL score?", a: "New businesses can apply, but existing CIBIL of 650+ improves approval." },
      { q: "Is subsidy given?", a: "Mudra itself has no subsidy, but interest subvention exists for Shishu women beneficiaries under some schemes." },
    ],
  },
  {
    slug: "sukanya-samriddhi", name: "Sukanya Samriddhi Yojana", hindi: "सुकन्या समृद्धि योजना", category: "Finance",
    tagline: "Tax-free savings scheme for the girl child.",
    icon: PiggyBank, accent: A.rose, official: "https://www.nsiindia.gov.in",
    ministry: "Ministry of Finance (Post Offices & Banks)",
    eligibility: ["Girl child below age 10", "Only 2 accounts per family (3 if twins/triplets)"],
    documents: ["Girl's birth certificate", "Guardian's Aadhaar & PAN", "Address proof"],
    steps: [
      { title: "Visit post office/bank", detail: "Any post office or authorised bank (SBI, PNB, HDFC, ICICI etc.)." },
      { title: "Fill Form-1", detail: "Guardian fills SSY account opening form." },
      { title: "Initial deposit", detail: "Minimum ₹250, maximum ₹1.5 lakh per financial year." },
      { title: "Deposit for 15 years", detail: "Account matures in 21 years or on marriage after age 18." },
      { title: "Partial withdrawal", detail: "50% allowed for higher education after girl turns 18." },
    ],
    notes: ["Current interest ~8.2% p.a. (revised quarterly), fully tax-free under EEE.", "Missed deposits: ₹50 penalty + minimum ₹250 to revive."],
    faqs: [
      { q: "Can NRI open SSY?", a: "No, only resident Indian girls are eligible; account closes if she becomes NRI." },
      { q: "80C benefit?", a: "Yes, deposits qualify under Section 80C up to ₹1.5 lakh." },
    ],
  },
  {
    slug: "jan-dhan-yojana", name: "PM Jan Dhan Yojana", hindi: "जन धन योजना", category: "Finance",
    tagline: "Zero-balance bank account with RuPay card & insurance.",
    icon: Wallet, accent: A.green, official: "https://pmjdy.gov.in",
    ministry: "Ministry of Finance",
    eligibility: ["Any Indian citizen aged 10+", "Minors (age 10-18) with guardian"],
    documents: ["Aadhaar (preferred)", "Or any Officially Valid Document (Voter ID, DL, Passport)"],
    steps: [
      { title: "Visit any bank/BC", detail: "Public/private bank branch or Bank Mitra (business correspondent)." },
      { title: "Fill PMJDY form", detail: "Available in regional languages." },
      { title: "Submit KYC", detail: "Aadhaar-based e-KYC is fastest." },
      { title: "Account activation", detail: "Zero-balance savings account opened instantly." },
      { title: "Get RuPay card", detail: "Free RuPay debit card with ₹2 lakh accident cover, ₹10,000 overdraft after 6 months good conduct." },
    ],
    notes: ["No minimum balance required.", "Direct Benefit Transfers (LPG, PM-Kisan, MGNREGA) flow into this account."],
    faqs: [
      { q: "Is ₹10,000 overdraft automatic?", a: "No — bank sanctions based on 6 months of satisfactory operation and Aadhaar linkage." },
      { q: "How to check balance?", a: "Missed call to bank's toll-free number, USSD *99#, or Jan Dhan Darshak app." },
    ],
  },
  {
    slug: "nps", name: "National Pension System", hindi: "एनपीएस", category: "Pension",
    tagline: "Market-linked retirement scheme regulated by PFRDA.",
    icon: ShieldCheck, accent: A.royal, official: "https://enps.nsdl.com",
    ministry: "PFRDA, Ministry of Finance",
    eligibility: ["Indian citizen aged 18-70 (NPS Vatsalya for minors, 2024)", "NRIs allowed"],
    documents: ["Aadhaar & PAN", "Bank account", "Cancelled cheque", "Passport-size photo"],
    steps: [
      { title: "Open eNPS account", detail: "Visit enps.nsdl.com or Karvy — Aadhaar/PAN based registration." },
      { title: "Get PRAN", detail: "Permanent Retirement Account Number generated instantly." },
      { title: "Choose scheme & fund manager", detail: "Auto or Active choice; select from 10 pension fund managers." },
      { title: "Contribute", detail: "Minimum ₹500 per contribution and ₹1,000/year (Tier I)." },
      { title: "Withdraw at 60", detail: "60% lump sum tax-free, 40% mandatory annuity for monthly pension." },
    ],
    notes: ["Extra ₹50,000 deduction under Sec 80CCD(1B) over and above 80C.", "Partial withdrawal allowed for specific purposes after 3 years."],
    faqs: [
      { q: "Tier I vs Tier II?", a: "Tier I is the retirement account (withdrawal restricted); Tier II is a flexible savings account with no tax benefit." },
      { q: "Is NPS safe?", a: "Regulated by PFRDA with strict investment limits; returns are market-linked, historically 9-12% p.a." },
    ],
  },
  {
    slug: "apy", name: "Atal Pension Yojana", hindi: "अटल पेंशन योजना", category: "Pension",
    tagline: "Guaranteed ₹1,000-₹5,000 monthly pension after 60.",
    icon: Sunrise, accent: A.gold, official: "https://www.npscra.nsdl.co.in/scheme-details.php",
    ministry: "PFRDA, Ministry of Finance",
    eligibility: ["Indian citizen aged 18-40", "Savings bank / post office account", "Not an income tax payer (from Oct 2022)"],
    documents: ["Aadhaar", "Mobile number", "Bank account"],
    steps: [
      { title: "Visit your bank", detail: "Any bank / post office where you hold a savings account." },
      { title: "Fill APY form", detail: "Choose pension slab ₹1,000 / 2,000 / 3,000 / 4,000 / 5,000." },
      { title: "Auto-debit mandate", detail: "Contribution auto-debited monthly/quarterly/half-yearly." },
      { title: "Contribute till 60", detail: "Contribution amount depends on entry age and pension chosen." },
      { title: "Pension for life", detail: "Guaranteed pension for subscriber; then spouse; corpus to nominee." },
    ],
    notes: ["Government co-contributed 50% (max ₹1,000/yr) only to accounts opened before 31 Mar 2016.", "Continued default in contribution leads to account closure with penalty."],
    faqs: [
      { q: "Can I change pension amount later?", a: "Yes, once a year in April you may increase or decrease slab." },
      { q: "What if I die before 60?", a: "Spouse can continue account or receive accumulated corpus." },
    ],
  },
];

export const GOV_CATEGORIES: GovCategory[] = ["Identity", "Certificates", "Welfare", "Finance", "Pension"];

export function getGovService(slug: string) {
  return GOV_SERVICES.find((s) => s.slug === slug);
}
