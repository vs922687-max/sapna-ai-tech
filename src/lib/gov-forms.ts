// AI Form Center registry.
// Each form maps government fields to a common profile schema so AI Auto-Fill
// can populate values from useGovProfile(). Extensible to 500+ forms — this
// seed ships 60 representative real-world forms across every major category.
import type { GovProfile } from "./gov-profile";

export type FormCategory =
  | "Identity" | "Certificates" | "Welfare" | "Pension" | "Health"
  | "Education" | "Labour" | "Utilities" | "Municipal" | "Business"
  | "Tax" | "Transport" | "Police" | "RTI" | "Banking";

export type FormField = {
  key: string;
  label: string;
  hint?: string;
  type: "text" | "textarea" | "date" | "number" | "email" | "tel" | "select";
  options?: string[];
  required?: boolean;
  // Maps this field to a GovProfile key so auto-fill can populate it.
  profileKey?: keyof GovProfile;
  // Regex or format hint (for smart validation).
  pattern?: string;
  maxLength?: number;
};

export type GovForm = {
  slug: string;
  name: string;
  hindi: string;
  category: FormCategory;
  authority: string;
  official?: string;
  description: string;
  fields: FormField[];
};

const P = {
  fullName: { key: "fullName", label: "Full Name", type: "text" as const, required: true, profileKey: "fullName" as const },
  father: { key: "fatherName", label: "Father's Name", type: "text" as const, profileKey: "fatherName" as const },
  mother: { key: "motherName", label: "Mother's Name", type: "text" as const, profileKey: "motherName" as const },
  dob: { key: "dob", label: "Date of Birth", type: "date" as const, required: true, profileKey: "dob" as const },
  gender: { key: "gender", label: "Gender", type: "select" as const, options: ["Male", "Female", "Other"], profileKey: "gender" as const },
  mobile: { key: "mobile", label: "Mobile Number", type: "tel" as const, required: true, profileKey: "mobile" as const, pattern: "^[6-9]\\d{9}$", maxLength: 10 },
  email: { key: "email", label: "Email", type: "email" as const, profileKey: "email" as const },
  aadhaar: { key: "aadhaar", label: "Aadhaar Number", type: "text" as const, profileKey: "aadhaar" as const, pattern: "^\\d{12}$", maxLength: 12 },
  pan: { key: "pan", label: "PAN", type: "text" as const, profileKey: "pan" as const, pattern: "^[A-Z]{5}[0-9]{4}[A-Z]$", maxLength: 10 },
  address: { key: "address", label: "Address", type: "textarea" as const, required: true, profileKey: "address" as const },
  city: { key: "city", label: "City / Town / Village", type: "text" as const, profileKey: "city" as const },
  district: { key: "district", label: "District", type: "text" as const, profileKey: "district" as const },
  state: { key: "state", label: "State", type: "text" as const, profileKey: "state" as const },
  pincode: { key: "pincode", label: "PIN Code", type: "text" as const, profileKey: "pincode" as const, pattern: "^\\d{6}$", maxLength: 6 },
  income: { key: "annualIncome", label: "Annual Income (₹)", type: "number" as const, profileKey: "annualIncome" as const },
  category: { key: "category", label: "Category", type: "select" as const, options: ["General", "OBC", "SC", "ST", "EWS"], profileKey: "category" as const },
  bankAccount: { key: "bankAccount", label: "Bank Account Number", type: "text" as const, profileKey: "bankAccount" as const },
  ifsc: { key: "ifsc", label: "IFSC Code", type: "text" as const, profileKey: "ifsc" as const, pattern: "^[A-Z]{4}0[A-Z0-9]{6}$", maxLength: 11 },
  bankName: { key: "bankName", label: "Bank Name", type: "text" as const, profileKey: "bankName" as const },
  occupation: { key: "occupation", label: "Occupation", type: "text" as const, profileKey: "occupation" as const },
  reason: { key: "reason", label: "Reason for Application", type: "textarea" as const, required: true },
};

const baseIdentity: FormField[] = [P.fullName, P.father, P.mother, P.dob, P.gender, P.mobile, P.email, P.address, P.city, P.district, P.state, P.pincode];

function form(
  slug: string, name: string, hindi: string, category: FormCategory,
  authority: string, description: string, extra: FormField[] = [], official?: string,
): GovForm {
  return { slug, name, hindi, category, authority, official, description, fields: [...baseIdentity, ...extra] };
}

export const GOV_FORMS: GovForm[] = [
  // Identity
  form("aadhaar-update", "Aadhaar Update / Correction", "आधार अपडेट", "Identity", "UIDAI", "Update name, address, DOB, mobile or biometrics in Aadhaar.", [P.aadhaar, { key: "updateType", label: "Update Type", type: "select", options: ["Name", "Address", "DOB", "Mobile", "Email", "Biometrics"], required: true }], "https://myaadhaar.uidai.gov.in"),
  form("aadhaar-enrolment", "Aadhaar Enrolment", "आधार नामांकन", "Identity", "UIDAI", "New Aadhaar enrolment for residents.", [{ key: "relationName", label: "Head of Family Name", type: "text" }]),
  form("pan-new", "PAN Card (Form 49A)", "पैन कार्ड", "Identity", "Income Tax Dept", "Apply for a new Permanent Account Number.", [P.father, { key: "sourceIncome", label: "Source of Income", type: "text" }], "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html"),
  form("pan-correction", "PAN Correction", "पैन सुधार", "Identity", "Income Tax Dept", "Correct name, DOB, photo or signature on existing PAN.", [P.pan, { key: "changeReason", label: "What to correct?", type: "textarea", required: true }]),
  form("pan-aadhaar-link", "PAN-Aadhaar Linking", "पैन-आधार लिंक", "Identity", "Income Tax Dept", "Link PAN with Aadhaar (mandatory).", [P.pan, P.aadhaar], "https://www.incometax.gov.in"),
  form("voter-id-new", "Voter ID (Form 6)", "मतदाता पहचान", "Identity", "Election Commission", "New voter registration.", [{ key: "constituency", label: "Assembly Constituency", type: "text" }], "https://voters.eci.gov.in"),
  form("voter-id-correction", "Voter ID Correction (Form 8)", "मतदाता सुधार", "Identity", "Election Commission", "Correct details or change address in electoral roll.", [P.aadhaar]),
  form("passport-new", "Passport (Fresh)", "पासपोर्ट नया", "Identity", "MEA — Passport Seva", "Fresh Indian passport application.", [{ key: "passportType", label: "Passport Type", type: "select", options: ["Ordinary 36 pages", "Ordinary 60 pages", "Tatkaal"] }, { key: "placeOfBirth", label: "Place of Birth", type: "text" }], "https://www.passportindia.gov.in"),
  form("passport-renewal", "Passport Renewal / Reissue", "पासपोर्ट नवीनीकरण", "Identity", "MEA — Passport Seva", "Renew or reissue existing passport.", [{ key: "oldPassport", label: "Old Passport Number", type: "text", required: true }]),
  form("driving-license-learner", "Learner's Driving Licence", "लर्नर लाइसेंस", "Transport", "RTO / Parivahan", "Apply for learner's licence.", [{ key: "vehicleClass", label: "Vehicle Class", type: "select", options: ["LMV", "MCWG", "MCWOG", "HMV", "TRANS"], required: true }], "https://parivahan.gov.in"),
  form("driving-license-permanent", "Permanent Driving Licence", "स्थायी लाइसेंस", "Transport", "RTO / Parivahan", "Convert learner's licence to permanent.", [{ key: "learnerLL", label: "Learner Licence No.", type: "text", required: true }, { key: "vehicleClass", label: "Vehicle Class", type: "text" }]),
  form("rc-transfer", "Vehicle RC Transfer", "आरसी ट्रांसफर", "Transport", "RTO / Parivahan", "Transfer ownership of vehicle registration.", [{ key: "regNo", label: "Registration No.", type: "text", required: true }, { key: "chassis", label: "Chassis No.", type: "text" }]),
  form("vehicle-noc", "Vehicle NOC (Inter-state)", "वाहन एनओसी", "Transport", "RTO", "NOC to move vehicle to another state.", [{ key: "regNo", label: "Registration No.", type: "text", required: true }, { key: "toState", label: "Moving to State", type: "text", required: true }]),

  // Certificates
  form("birth-certificate", "Birth Certificate", "जन्म प्रमाण पत्र", "Certificates", "Municipal Registrar", "Register a birth or obtain a birth certificate.", [{ key: "childName", label: "Child's Name", type: "text" }, { key: "birthPlace", label: "Place of Birth", type: "text", required: true }, { key: "birthDate", label: "Date of Birth", type: "date", required: true }]),
  form("death-certificate", "Death Certificate", "मृत्यु प्रमाण पत्र", "Certificates", "Municipal Registrar", "Register death and get certificate.", [{ key: "deceasedName", label: "Name of Deceased", type: "text", required: true }, { key: "deathDate", label: "Date of Death", type: "date", required: true }, { key: "deathPlace", label: "Place of Death", type: "text", required: true }]),
  form("marriage-certificate", "Marriage Certificate", "विवाह प्रमाण पत्र", "Certificates", "Municipal Registrar", "Register marriage.", [{ key: "spouseName", label: "Spouse Name", type: "text", required: true }, { key: "marriageDate", label: "Date of Marriage", type: "date", required: true }, { key: "marriagePlace", label: "Place of Marriage", type: "text", required: true }]),
  form("income-certificate", "Income Certificate", "आय प्रमाण पत्र", "Certificates", "Tehsildar / SDM", "State-issued proof of annual family income.", [P.income, { key: "familyMembers", label: "Family Members", type: "number" }, P.reason]),
  form("caste-certificate", "Caste Certificate", "जाति प्रमाण पत्र", "Certificates", "Tehsildar / SDM", "SC/ST/OBC caste certificate.", [P.category, { key: "subCaste", label: "Sub-Caste", type: "text" }]),
  form("residence-certificate", "Residence Certificate", "निवास प्रमाण पत्र", "Certificates", "Tehsildar / SDM", "Proof of residence.", [{ key: "residenceSince", label: "Residing Since", type: "date" }]),
  form("domicile-certificate", "Domicile Certificate", "अधिवास प्रमाण पत्र", "Certificates", "Tehsildar / SDM", "State domicile certificate.", [{ key: "residenceSince", label: "Domicile Since", type: "date", required: true }]),
  form("ews-certificate", "EWS Certificate", "ईडब्ल्यूएस प्रमाण पत्र", "Certificates", "Tehsildar / SDM", "Economically Weaker Section certificate.", [P.income]),
  form("noc-general", "NOC (No Objection Certificate)", "एनओसी", "Certificates", "Local Authority", "General purpose NOC.", [P.reason]),
  form("character-certificate", "Character Certificate", "चरित्र प्रमाण पत्र", "Certificates", "Local Police / Institution", "Character certificate for jobs/education.", [P.reason]),
  form("disability-certificate", "Disability Certificate (UDID)", "दिव्यांगता प्रमाण पत्र", "Certificates", "Ministry of Social Justice", "Unique Disability ID card.", [{ key: "disabilityType", label: "Type of Disability", type: "text", required: true }, { key: "disabilityPercent", label: "Percentage (%)", type: "number" }], "https://www.swavlambancard.gov.in"),
  form("senior-citizen-card", "Senior Citizen ID Card", "वरिष्ठ नागरिक कार्ड", "Certificates", "State Social Welfare Dept", "Senior citizen identity for benefits.", []),

  // Welfare / Schemes
  form("ration-card", "Ration Card", "राशन कार्ड", "Welfare", "Food & Civil Supplies Dept", "New ration card / add member.", [{ key: "cardType", label: "Card Type", type: "select", options: ["APL", "BPL", "AAY"] }, { key: "familyMembers", label: "Family Members", type: "number", required: true }]),
  form("ayushman-bharat", "Ayushman Bharat (PMJAY)", "आयुष्मान भारत", "Health", "NHA", "₹5 lakh/year health cover for eligible families.", [P.aadhaar, { key: "sechcId", label: "SECC Household ID", type: "text" }], "https://beneficiary.nha.gov.in"),
  form("abha-health-id", "ABHA Health ID", "आभा हेल्थ आईडी", "Health", "NHA", "14-digit ABHA (Ayushman Bharat Health Account).", [P.aadhaar], "https://healthid.ndhm.gov.in"),
  form("pm-kisan", "PM Kisan Samman Nidhi", "पीएम किसान", "Welfare", "Ministry of Agriculture", "₹6,000/year to eligible farmers.", [P.aadhaar, P.bankAccount, P.ifsc, { key: "landHolding", label: "Land Holding (hectare)", type: "number" }], "https://pmkisan.gov.in"),
  form("pm-awas-gramin", "PM Awas Yojana (Gramin)", "पीएमएवाई-जी", "Welfare", "Ministry of Rural Development", "Housing for rural poor.", [P.aadhaar, P.income, { key: "houseStatus", label: "Current House Status", type: "select", options: ["No house", "Kutcha house"] }], "https://pmayg.nic.in"),
  form("pm-awas-urban", "PM Awas Yojana (Urban)", "पीएमएवाई-यू", "Welfare", "Ministry of Housing & Urban Affairs", "Housing subsidy for EWS/LIG/MIG.", [P.aadhaar, P.income, { key: "houseType", label: "Applying for", type: "select", options: ["EWS", "LIG", "MIG-I", "MIG-II"] }], "https://pmaymis.gov.in"),
  form("e-shram", "e-Shram Card", "ई-श्रम कार्ड", "Labour", "Ministry of Labour & Employment", "Universal ID for unorganised workers.", [P.aadhaar, P.occupation, P.bankAccount], "https://eshram.gov.in"),
  form("labour-card", "Labour / BOCW Card", "श्रमिक कार्ड", "Labour", "State Labour Welfare Board", "Construction worker welfare card.", [P.aadhaar, { key: "workType", label: "Type of Work", type: "text", required: true }]),
  form("scholarship-nsp", "National Scholarship (NSP)", "एनएसपी छात्रवृत्ति", "Education", "Ministry of Education", "Pre/post-matric and merit scholarships.", [P.aadhaar, { key: "instituteName", label: "Institute Name", type: "text", required: true }, { key: "courseName", label: "Course", type: "text", required: true }, P.income], "https://scholarships.gov.in"),
  form("pension-old-age", "Old Age Pension (IGNOAPS)", "वृद्धावस्था पेंशन", "Pension", "Ministry of Rural Development", "Monthly pension for citizens 60+.", [P.aadhaar, P.bankAccount, P.ifsc]),
  form("pension-widow", "Widow Pension (IGNWPS)", "विधवा पेंशन", "Pension", "Ministry of Rural Development", "Monthly pension for widows.", [P.aadhaar, P.bankAccount]),
  form("pension-disability", "Disability Pension (IGNDPS)", "दिव्यांग पेंशन", "Pension", "Ministry of Rural Development", "Monthly pension for persons with disability.", [P.aadhaar, { key: "disabilityPercent", label: "Disability %", type: "number", required: true }]),
  form("apy", "Atal Pension Yojana (APY)", "अटल पेंशन योजना", "Pension", "PFRDA", "Guaranteed monthly pension after 60.", [P.aadhaar, P.bankAccount, { key: "pensionAmount", label: "Desired Pension (₹/month)", type: "select", options: ["1000", "2000", "3000", "4000", "5000"] }]),

  // Utilities
  form("lpg-new-connection", "LPG New Gas Connection", "एलपीजी नया कनेक्शन", "Utilities", "OMC (IOCL/BPCL/HPCL)", "New domestic LPG connection.", [P.aadhaar, { key: "distributor", label: "Preferred Distributor", type: "text" }]),
  form("pmuy", "PM Ujjwala Yojana (PMUY)", "पीएम उज्ज्वला योजना", "Welfare", "MoPNG", "Free LPG connection for women in BPL families.", [P.aadhaar, { key: "cardType", label: "BPL / SECC?", type: "select", options: ["BPL", "SECC", "AAY"] }], "https://pmuy.gov.in"),
  form("electricity-new", "New Electricity Connection", "नया बिजली कनेक्शन", "Utilities", "State DISCOM", "Domestic electricity connection.", [{ key: "loadKw", label: "Sanctioned Load (kW)", type: "number" }, { key: "premiseType", label: "Premise Type", type: "select", options: ["Owned", "Rented"] }]),
  form("water-new", "New Water Connection", "नया पानी कनेक्शन", "Utilities", "Municipal Corporation / Jal Board", "Domestic water supply connection.", [{ key: "propertyId", label: "Property ID", type: "text" }]),
  form("property-tax", "Property Tax Payment / Assessment", "संपत्ति कर", "Municipal", "Municipal Corporation", "Assess or pay annual property tax.", [{ key: "propertyId", label: "Property ID / UPIC", type: "text", required: true }, { key: "ward", label: "Ward", type: "text" }]),

  // Business / Tax
  form("gst-registration", "GST Registration", "जीएसटी पंजीकरण", "Tax", "GSTN", "Register for GST under CGST/SGST/IGST.", [P.pan, { key: "businessName", label: "Legal Business Name", type: "text", required: true }, { key: "constitution", label: "Constitution", type: "select", options: ["Proprietorship", "Partnership", "LLP", "Pvt Ltd", "HUF"] }], "https://www.gst.gov.in"),
  form("msme-udyam", "Udyam (MSME) Registration", "उद्यम पंजीकरण", "Business", "Ministry of MSME", "Free MSME/Udyam registration.", [P.pan, P.aadhaar, { key: "businessName", label: "Enterprise Name", type: "text", required: true }, { key: "activity", label: "Activity", type: "select", options: ["Manufacturing", "Services", "Trading"] }], "https://udyamregistration.gov.in"),
  form("startup-india", "Startup India Recognition", "स्टार्टअप इंडिया", "Business", "DPIIT", "DPIIT recognition for startups.", [{ key: "entityName", label: "Entity Name", type: "text", required: true }, { key: "sector", label: "Sector", type: "text" }], "https://www.startupindia.gov.in"),
  form("trade-license", "Trade License", "व्यापार लाइसेंस", "Business", "Municipal Corporation", "Local trade license for business.", [{ key: "businessName", label: "Business Name", type: "text", required: true }, { key: "activity", label: "Nature of Business", type: "text" }]),
  form("shops-establishment", "Shops & Establishment Registration", "दुकान अधिनियम पंजीकरण", "Business", "State Labour Dept", "Registration under S&E Act.", [{ key: "businessName", label: "Establishment Name", type: "text", required: true }, { key: "employeeCount", label: "No. of Employees", type: "number" }]),
  form("fssai-license", "FSSAI Food License", "एफएसएसएआई लाइसेंस", "Business", "FSSAI", "Food business license/registration.", [{ key: "businessName", label: "Business Name", type: "text", required: true }, { key: "licenseType", label: "License Type", type: "select", options: ["Basic", "State", "Central"] }], "https://foscos.fssai.gov.in"),
  form("itr-1", "Income Tax Return (ITR-1 Sahaj)", "आयकर रिटर्न", "Tax", "Income Tax Dept", "Salaried individuals — up to ₹50L income.", [P.pan, P.aadhaar, P.bankAccount, P.ifsc, { key: "assessmentYear", label: "Assessment Year", type: "text", required: true }], "https://www.incometax.gov.in"),

  // Labour / Employment
  form("epfo-uan", "EPFO UAN Activation", "यूएएन सक्रियण", "Labour", "EPFO", "Activate Universal Account Number.", [P.aadhaar, P.pan, { key: "uan", label: "UAN (if known)", type: "text" }], "https://unifiedportal-mem.epfindia.gov.in"),
  form("epf-withdrawal", "EPF Withdrawal (Form 19)", "पीएफ निकासी", "Labour", "EPFO", "Final PF settlement.", [{ key: "uan", label: "UAN", type: "text", required: true }, P.bankAccount, P.ifsc]),
  form("esic-registration", "ESIC Employee Registration", "ईएसआईसी पंजीकरण", "Labour", "ESIC", "Employee State Insurance registration.", [P.aadhaar, { key: "employerCode", label: "Employer Code", type: "text" }], "https://www.esic.in"),

  // Police / Legal
  form("police-verification", "Police Verification", "पुलिस सत्यापन", "Police", "State Police", "Police verification for jobs/passport/tenants.", [P.aadhaar, P.reason]),
  form("fir-online", "Online FIR / e-FIR", "ई-एफआईआर", "Police", "State Police", "Online complaint / e-FIR.", [{ key: "incidentDate", label: "Incident Date", type: "date", required: true }, { key: "incidentDetails", label: "What happened?", type: "textarea", required: true }]),
  form("rti-application", "RTI Application", "आरटीआई आवेदन", "RTI", "Public Authority", "Request information under RTI Act 2005.", [{ key: "publicAuthority", label: "Public Authority", type: "text", required: true }, { key: "infoSought", label: "Information Sought", type: "textarea", required: true }], "https://rtionline.gov.in"),
  form("consumer-complaint", "Consumer Complaint (NCH)", "उपभोक्ता शिकायत", "RTI", "National Consumer Helpline", "File consumer grievance.", [{ key: "company", label: "Company / Seller", type: "text", required: true }, { key: "complaint", label: "Complaint Details", type: "textarea", required: true }], "https://consumerhelpline.gov.in"),

  // Banking
  form("jan-dhan", "Jan Dhan Account (PMJDY)", "जन धन खाता", "Banking", "Ministry of Finance", "Zero-balance basic savings account.", [P.aadhaar], "https://pmjdy.gov.in"),
  form("sukanya-samriddhi", "Sukanya Samriddhi Yojana", "सुकन्या समृद्धि", "Banking", "Ministry of Finance", "Small savings for girl child.", [{ key: "childName", label: "Girl Child Name", type: "text", required: true }, { key: "childDob", label: "Child DOB", type: "date", required: true }, P.aadhaar]),
  form("mudra-loan", "PM Mudra Loan (PMMY)", "मुद्रा लोन", "Banking", "MUDRA", "Micro loans up to ₹10 lakh.", [{ key: "loanType", label: "Category", type: "select", options: ["Shishu (upto 50K)", "Kishore (50K-5L)", "Tarun (5L-10L)"] }, { key: "purpose", label: "Purpose of Loan", type: "textarea", required: true }], "https://www.mudra.org.in"),
  form("kcc", "Kisan Credit Card (KCC)", "किसान क्रेडिट कार्ड", "Banking", "Ministry of Agriculture", "Short-term credit for farmers.", [P.aadhaar, { key: "landHolding", label: "Land Holding (hectare)", type: "number" }, { key: "crops", label: "Crops Grown", type: "text" }]),

  // Municipal
  form("khata-transfer", "Khata Transfer (Property)", "खाता स्थानांतरण", "Municipal", "Municipal Corporation", "Transfer property khata after sale/inheritance.", [{ key: "propertyId", label: "Property ID", type: "text", required: true }, { key: "sellerName", label: "Previous Owner", type: "text" }]),
  form("marriage-registration", "Marriage Registration (Special)", "विवाह पंजीकरण", "Certificates", "Sub-Registrar", "Registration under Special Marriage Act / Hindu Marriage Act.", [{ key: "spouseName", label: "Spouse Name", type: "text", required: true }, { key: "marriageDate", label: "Marriage Date", type: "date", required: true }]),
];

export function getForm(slug: string): GovForm | undefined {
  return GOV_FORMS.find((f) => f.slug === slug);
}

export const FORM_CATEGORIES = Array.from(new Set(GOV_FORMS.map((f) => f.category))) as FormCategory[];
