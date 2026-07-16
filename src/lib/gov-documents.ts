// AI Document Generator template registry.
export type DocTemplate = {
  slug: string;
  name: string;
  hindi: string;
  category: "Affidavit" | "Application" | "Declaration" | "Letter" | "Legal" | "Certificate";
  description: string;
  // Prompt used to instruct AI to draft the document.
  prompt: (ctx: string, lang: "en" | "hi" | "bilingual") => string;
};

const base = (bodyEn: string, bodyHi: string, ctx: string, lang: "en" | "hi" | "bilingual") =>
  lang === "hi"
    ? `${bodyHi}\n\nविवरण:\n${ctx}\n\nनियम: औपचारिक भारतीय सरकारी दस्तावेज़ शैली, स्पष्ट, त्रुटिरहित। तिथि, स्थान, हस्ताक्षर स्थान शामिल करें।`
    : lang === "bilingual"
      ? `Draft the same document in English AND Hindi (side by side or one after the other).\n\n${bodyEn}\n\nDetails:\n${ctx}\n\nRules: Formal Indian government style. Include date, place, signature line.`
      : `${bodyEn}\n\nDetails:\n${ctx}\n\nRules: Formal Indian government style. Concise, error-free. Include date, place, signature line.`;

export const DOC_TEMPLATES: DocTemplate[] = [
  { slug: "self-declaration", name: "Self Declaration", hindi: "स्व-घोषणा पत्र", category: "Declaration",
    description: "General self declaration by applicant.",
    prompt: (c, l) => base("Draft a Self Declaration in formal English.", "औपचारिक हिंदी में स्व-घोषणा पत्र लिखें।", c, l) },
  { slug: "affidavit-general", name: "General Affidavit", hindi: "सामान्य शपथ पत्र", category: "Affidavit",
    description: "Sworn affidavit for general use.",
    prompt: (c, l) => base("Draft a General Affidavit on ₹10/₹20/₹100 non-judicial stamp paper format. Start with 'I, [Name] S/o D/o [Father], aged ... resident of ... do hereby solemnly affirm and declare as under:' Number the deponent statements and end with a Verification.", "शपथ पत्र लिखें: 'मैं, [नाम], पुत्र/पुत्री [पिता], आयु ..., निवासी ..., सत्यनिष्ठा से यह शपथ लेता हूँ कि—' कथन क्रमांकित करें और अंत में सत्यापन जोड़ें।", c, l) },
  { slug: "affidavit-name-change", name: "Affidavit for Name Change", hindi: "नाम परिवर्तन शपथ पत्र", category: "Affidavit",
    description: "Affidavit to change name legally.",
    prompt: (c, l) => base("Draft an Affidavit for Change of Name (old name -> new name) suitable for gazette notification.", "गजट अधिसूचना हेतु नाम परिवर्तन शपथ पत्र लिखें।", c, l) },
  { slug: "affidavit-address-proof", name: "Affidavit for Address Proof", hindi: "पते का शपथ पत्र", category: "Affidavit",
    description: "Address proof affidavit.",
    prompt: (c, l) => base("Draft an Affidavit certifying current residential address.", "वर्तमान निवास का शपथ पत्र तैयार करें।", c, l) },
  { slug: "gap-certificate", name: "Gap Year Certificate", hindi: "गैप ईयर प्रमाण पत्र", category: "Affidavit",
    description: "Gap year affidavit for education/employment.",
    prompt: (c, l) => base("Draft a Gap Year affidavit explaining the study/employment gap.", "अध्ययन/रोज़गार में अंतराल हेतु गैप ईयर शपथ पत्र लिखें।", c, l) },
  { slug: "noc-general", name: "No Objection Certificate", hindi: "अनापत्ति प्रमाण पत्र", category: "Letter",
    description: "General purpose NOC.",
    prompt: (c, l) => base("Draft a No Objection Certificate (NOC).", "अनापत्ति प्रमाण पत्र (एनओसी) तैयार करें।", c, l) },
  { slug: "authorization-letter", name: "Authorization Letter", hindi: "अधिकार पत्र", category: "Letter",
    description: "Authorize another person to act on behalf.",
    prompt: (c, l) => base("Draft an Authorization Letter authorizing another person to act on the applicant's behalf for a specific purpose.", "किसी अन्य व्यक्ति को विशेष कार्य हेतु अधिकृत करने का पत्र तैयार करें।", c, l) },
  { slug: "consent-letter", name: "Consent Letter", hindi: "सहमति पत्र", category: "Letter",
    description: "Formal consent letter (e.g. minor travel, parental consent).",
    prompt: (c, l) => base("Draft a Consent Letter (formal).", "औपचारिक सहमति पत्र तैयार करें।", c, l) },
  { slug: "bonafide-letter", name: "Bonafide Certificate Request", hindi: "बोनाफाइड प्रमाण पत्र अनुरोध", category: "Application",
    description: "Request to institution for a bonafide certificate.",
    prompt: (c, l) => base("Draft a request letter to the Principal/HOD for a Bonafide Certificate.", "प्रधानाचार्य/एचओडी को बोनाफाइड प्रमाण पत्र हेतु अनुरोध पत्र लिखें।", c, l) },
  { slug: "leave-application", name: "Leave Application", hindi: "अवकाश प्रार्थना पत्र", category: "Application",
    description: "Application for leave.",
    prompt: (c, l) => base("Draft a formal Leave Application to employer / school / college.", "नियोक्ता/विद्यालय/महाविद्यालय हेतु अवकाश प्रार्थना पत्र लिखें।", c, l) },
  { slug: "rti-application", name: "RTI Application", hindi: "आरटीआई आवेदन", category: "Application",
    description: "RTI application under RTI Act 2005.",
    prompt: (c, l) => base("Draft an RTI application under Section 6(1) of the RTI Act, 2005 addressed to the Public Information Officer (PIO) with clear, numbered questions.", "सूचना का अधिकार अधिनियम 2005 की धारा 6(1) के तहत जन सूचना अधिकारी को स्पष्ट क्रमांकित प्रश्नों सहित आरटीआई आवेदन तैयार करें।", c, l) },
  { slug: "police-complaint", name: "Police Complaint Letter", hindi: "पुलिस शिकायत पत्र", category: "Legal",
    description: "Formal police complaint.",
    prompt: (c, l) => base("Draft a formal Complaint Letter to the SHO / Officer-in-Charge of Police Station.", "थाना प्रभारी को औपचारिक शिकायत पत्र लिखें।", c, l) },
  { slug: "complaint-letter", name: "Complaint Letter (Consumer/Service)", hindi: "शिकायत पत्र", category: "Letter",
    description: "Complaint against product/service.",
    prompt: (c, l) => base("Draft a Consumer Complaint letter to the company/service provider requesting resolution.", "उपभोक्ता के रूप में कंपनी/सेवा प्रदाता को शिकायत पत्र तैयार करें।", c, l) },
  { slug: "rental-agreement", name: "Rental Agreement (Draft)", hindi: "किराया अनुबंध", category: "Legal",
    description: "Basic residential rental agreement.",
    prompt: (c, l) => base("Draft a residential Rental Agreement between Landlord and Tenant with rent, deposit, term, notice period, and standard clauses.", "मकान मालिक और किरायेदार के बीच किराया अनुबंध तैयार करें जिसमें किराया, जमा राशि, अवधि, नोटिस अवधि और मानक शर्तें हों।", c, l) },
  { slug: "employment-letter", name: "Employment / Experience Letter", hindi: "अनुभव पत्र", category: "Letter",
    description: "Draft employment or experience letter.",
    prompt: (c, l) => base("Draft a formal Employment / Experience Letter on company letterhead.", "कंपनी लेटरहेड पर औपचारिक रोज़गार/अनुभव पत्र तैयार करें।", c, l) },
  { slug: "income-declaration", name: "Income Declaration Letter", hindi: "आय घोषणा पत्र", category: "Declaration",
    description: "Self declaration of income.",
    prompt: (c, l) => base("Draft an Income Declaration Letter suitable for scholarship / loan applications.", "छात्रवृत्ति/ऋण आवेदन हेतु उपयुक्त आय घोषणा पत्र तैयार करें।", c, l) },
  { slug: "government-request", name: "Government Request Letter", hindi: "सरकारी अनुरोध पत्र", category: "Letter",
    description: "Formal request to a government department.",
    prompt: (c, l) => base("Draft a formal request letter addressed to a government department/officer.", "किसी सरकारी विभाग/अधिकारी को औपचारिक अनुरोध पत्र तैयार करें।", c, l) },
  { slug: "bank-letter", name: "Bank Request Letter", hindi: "बैंक अनुरोध पत्र", category: "Letter",
    description: "Bank request (statement, KYC update, cheque book).",
    prompt: (c, l) => base("Draft a Bank Request Letter to the Branch Manager.", "शाखा प्रबंधक को बैंक अनुरोध पत्र तैयार करें।", c, l) },
  { slug: "passport-cover", name: "Passport Application Cover Letter", hindi: "पासपोर्ट कवर लेटर", category: "Letter",
    description: "Cover letter to accompany passport documents.",
    prompt: (c, l) => base("Draft a Cover Letter to accompany Passport application documents at the PSK.", "पासपोर्ट सेवा केंद्र में जमा हेतु पासपोर्ट आवेदन कवर पत्र तैयार करें।", c, l) },
  { slug: "court-affidavit", name: "Court Affidavit (Generic)", hindi: "न्यायालय शपथ पत्र", category: "Legal",
    description: "Generic court affidavit.",
    prompt: (c, l) => base("Draft a generic Court Affidavit suitable for filing before a Magistrate/District Court, with proper cause-title format.", "मजिस्ट्रेट/जिला न्यायालय समक्ष दायर हेतु उपयुक्त सामान्य शपथ पत्र, सही कॉज़-टाइटल स्वरूप के साथ तैयार करें।", c, l) },
  { slug: "scholarship-letter", name: "Scholarship Request Letter", hindi: "छात्रवृत्ति अनुरोध पत्र", category: "Application",
    description: "Request for scholarship consideration.",
    prompt: (c, l) => base("Draft a Scholarship Request letter to the institution/authority.", "संस्थान/प्राधिकरण को छात्रवृत्ति अनुरोध पत्र तैयार करें।", c, l) },
];

export function getTemplate(slug: string) {
  return DOC_TEMPLATES.find((t) => t.slug === slug);
}
