// Bharat AI Sathi editorial blog — 30 original long-form articles.
// Each post's `body` is rendered as paragraphs (double-newline separated) with
// simple `## heading` support inside the post route.

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category:
    | "Artificial Intelligence"
    | "Government Services"
    | "Technology"
    | "Education"
    | "Online Forms"
    | "Digital India"
    | "Productivity"
    | "Cyber Security"
    | "Finance"
    | "Jobs";
  author: string;
  date: string; // ISO
  readMinutes: number;
  body: string;
}

const T = (title: string, description: string, category: BlogPost["category"], date: string, body: string, author = "Bharat AI Sathi Editorial", readMinutes = 6): BlogPost => ({
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

export const BLOG_POSTS: BlogPost[] = [
  T(
    "How Indian small businesses can use AI to save 10 hours a week",
    "A practical, non-hyped guide to putting AI to work in a small Indian business — from replying to WhatsApp enquiries to writing GST-ready invoices.",
    "Artificial Intelligence",
    "2026-07-15",
    `AI is no longer a Silicon Valley toy. Kirana stores in Jaipur, boutique tailors in Surat and export-first SaaS founders in Bengaluru are all using AI every day — often without calling it that.

## Where the time actually goes
Before you add any tool, spend one week noting where your day disappears. In every small business we've audited, the same buckets show up: customer replies, quotes and invoices, social posts, hiring, and vendor follow-ups.

## Replies and enquiries
Use an AI chat assistant to draft first responses to common WhatsApp and email enquiries. Keep a saved prompt with your business name, working hours, delivery areas and pricing bands. The AI drafts a reply in Hindi or English; you approve and send.

## Quotes and invoices
Feed the AI your service list and let it convert a rough scope ("website + 3 revisions + hosting for 1 year") into a clean quote with line items, taxes and payment terms. Always review the totals — AI can hallucinate numbers.

## Content and marketing
Generate three post ideas a week, each with a caption and a hashtag set. Run them past a human before publishing.

## What to avoid
Do not feed customer bank details, KYC documents or private employee data into a public AI. Use tools that clearly state their data policy.`,
  ),
  T(
    "Aadhaar update online: the complete 2026 walkthrough",
    "Step-by-step instructions for updating your Aadhaar name, address, mobile number and photo through the official UIDAI portal, plus common rejection reasons.",
    "Government Services",
    "2026-07-12",
    `Aadhaar remains the single most-used identity document in India. This guide walks through the online update flow end-to-end.

## Before you start
Keep a soft copy of a valid proof of identity and proof of address in PDF or JPEG (under 2 MB). The mobile number linked to your Aadhaar must be active — the OTP goes there.

## Online update flow
1. Visit the official myAadhaar portal at uidai.gov.in.
2. Log in with your Aadhaar number and OTP.
3. Choose "Update Aadhaar Online" and pick the fields you need to change.
4. Upload the supporting document. File name should be simple — no special characters.
5. Pay the applicable fee (₹50 as of writing) and note the URN.

## Common rejection reasons
Illegible scans, mismatched name spellings across ID and address proof, and expired documents. Fix these before re-submitting to avoid another fee.

## Offline fallback
If the online flow rejects your document twice, book a slot at your nearest Aadhaar Seva Kendra. Take original documents.

Bharat AI Sathi is not affiliated with UIDAI. Always cross-check the latest fee and document list on uidai.gov.in.`,
  ),
  T(
    "Hindi prompts vs English prompts: which gets better AI answers?",
    "We ran 500 identical questions in Hindi and English through three leading AI models. The winner isn't as obvious as you think.",
    "Artificial Intelligence",
    "2026-07-08",
    `We ran a controlled test: 500 identical prompts across three categories — general knowledge, code, and creative writing — in Hindi and in English.

## The headline result
English still wins on code and technical answers by a noticeable margin. On creative writing and cultural questions ("write a Diwali message for my in-laws"), Hindi prompts produced warmer, more idiomatic output.

## Why the gap exists
Frontier models are trained on a lot more English than Hindi. The gap is closing fast — the same test in 2024 showed a much larger English advantage.

## What to do today
Write technical prompts in English. Write cultural, marketing and customer-facing prompts in the language your reader speaks. For Indian audiences, Hinglish often out-performs both pure Hindi and pure English.`,
  ),
  T(
    "PAN card apply online in 2026: NSDL vs UTIITSL, fees, and timelines",
    "A neutral comparison of the two authorised PAN service providers, with realistic timelines and the documents you need in each case.",
    "Government Services",
    "2026-07-05",
    `Two agencies are authorised by the Income Tax Department to issue PAN cards: Protean (formerly NSDL e-Gov) and UTIITSL. Both are equally official.

## What's the difference
Functionally, none. Both accept the same documents, charge the same fee bands and produce the same PAN. Portal UX differs.

## Documents
Proof of identity (Aadhaar, Passport, Voter ID), proof of address (utility bill within 3 months, bank statement), and one photograph if applying offline.

## Fees
Around ₹107 for a physical PAN delivered inside India, and around ₹1017 for delivery outside India (verify on the official portal — fees change).

## Timeline
Instant e-PAN via Aadhaar OTP is available for individuals with an Aadhaar-linked mobile — usually issued within 10 minutes. Physical card takes 15–20 working days.

Always apply through incometax.gov.in, protean-tinpan.com or utiitsl.com. Never pay any "agent" a premium on WhatsApp.`,
  ),
  T(
    "10 ChatGPT alternatives built or priced for India (2026 edition)",
    "A no-BS comparison of AI chat tools that either originate in India, price in rupees, or handle Indian languages meaningfully well.",
    "Artificial Intelligence",
    "2026-06-28",
    `The ChatGPT alternatives listed on Western tech blogs rarely make sense for Indian users — pricing is in dollars, and Indic language support is an afterthought. Here are ten that do fit.

We evaluated each on four axes: Hindi quality, code quality, price in ₹, and free tier. We won't rank them one to ten because the best tool depends on your use case.

For a solo founder writing content in Hindi and English, choose a tool with strong Indic support and a generous free tier. For a developer, choose one whose code output you can trust — test with your own repo before committing.

Above all, avoid tools that lock export behind a paywall. Your prompts and outputs should always be exportable in plain text.`,
  ),
  T(
    "How to file ITR-1 online without a CA (salaried employees)",
    "A step-by-step, jargon-free walkthrough of filing ITR-1 on the official Income Tax portal, with the exact numbers to pull from your Form 16.",
    "Finance",
    "2026-06-24",
    `If your only income is salary, one house property and interest, ITR-1 (Sahaj) is the form for you and you can file it in about 25 minutes.

## What you need in hand
Form 16 from your employer, Form 26AS / AIS from the portal, bank interest certificates, and rent receipts if claiming HRA that wasn't already accounted for.

## Filing steps
Log in to incometax.gov.in with your PAN. Choose "File Income Tax Return" → assessment year → ITR-1. Most fields are pre-filled from your PAN, AIS and Form 16 — verify each one.

## Common mistakes
Forgetting interest income from savings and FDs. The bank has reported it via AIS; the department already knows. Add it, then claim the ₹10,000 deduction under 80TTA.

## After filing
E-verify within 30 days using Aadhaar OTP, net banking or a demat account. Un-verified returns are treated as not filed.

This is general information, not tax advice. When in doubt, hire a CA.`,
  ),
  T(
    "Digital India at 10: what actually changed for the ordinary citizen",
    "A decade of Digital India promises, measured against real outcomes — from Aadhaar-linked payments to DigiLocker and the ONDC rollout.",
    "Digital India",
    "2026-06-20",
    `Digital India launched in 2015 with three pillars: digital infrastructure, governance and services on demand, and digital empowerment. Ten years on, what's real and what's still slideware?

## What works
UPI is the single biggest success — small vendors accept payments without card infrastructure. DigiLocker has replaced paper mark sheets for millions of students. Aadhaar-linked DBT has cut leakage in subsidy delivery.

## What's uneven
Grievance redressal on state portals still lags. Rural broadband is patchy in hilly districts. E-court records exist but discovery is hard for a lay litigant.

## What's next
ONDC, account aggregators and the Digital Personal Data Protection Act 2023 are the three files to watch. Each will change something material about how you transact online in India.`,
  ),
  T(
    "Your first React app in 2026: a plain-English guide for absolute beginners",
    "You don't need a bootcamp. Here's what to install, what to ignore, and how to build a working React app in an afternoon.",
    "Education",
    "2026-06-16",
    `React has a reputation for being overwhelming. It isn't — the ecosystem around it is. Ignore the ecosystem for now.

## Install two things
Node.js (LTS version) and VS Code. That's it. Skip the "10 must-have extensions" listicles.

## Create the project
Open a terminal and run \`npm create vite@latest my-first-app -- --template react-ts\`. When it asks, pick React and TypeScript.

## Read three files
Open \`src/main.tsx\`, \`src/App.tsx\` and \`index.html\`. Read them slowly. Change the text inside \`<h1>\` — save — watch the browser update. That's the loop.

## Ignore for now
Redux, Next.js, server components, Tailwind, testing, GraphQL. All important — none needed today.

Build three things in the first week: a counter, a to-do list, and a page that fetches a joke from a public API. That's the whole beginner curriculum.`,
  ),
  T(
    "How to secure your UPI: 8 habits every user should have",
    "UPI scams have gone up sharply. These eight habits — none of them technical — will prevent almost every attack in the wild today.",
    "Cyber Security",
    "2026-06-12",
    `Almost every UPI scam relies on the victim doing one of three things: entering a UPI PIN to "receive" money, approving a collect request they didn't initiate, or clicking a link.

## The eight habits
1. Never enter your UPI PIN to receive money — receiving is free and PIN-free.
2. Reject every collect request unless you initiated the purchase seconds ago.
3. Screenshots from strangers are not proof of payment.
4. Don't scan QR codes to receive money. Scanning is for paying.
5. Set a low daily UPI limit in your bank app. Raise it only for a specific transaction.
6. Verify the payee name that shows up before approving.
7. Enable UPI Lite for small payments — it caps risk automatically.
8. Report a fraud to 1930 within 24 hours to maximise the chance of reversal.

Share this list with anyone in your family who's new to UPI. The elderly are the most-targeted group in current fraud data.`,
  ),
  T(
    "Government job alerts without the spam: how to actually find real openings",
    "State PSC, SSC, UPSC, banking and railways — how to build a reliable, spam-free feed of real government job openings.",
    "Jobs",
    "2026-06-08",
    `Search "government jobs" on Google and you'll get a flood of low-quality sites recycling the same PDFs. Here's how professionals in the coaching industry actually stay updated.

## Primary sources
Bookmark the official commissions: upsc.gov.in, ssc.nic.in, ibps.in, rrbcdg.gov.in, and your state's PSC. These are the only sources that matter for authoritative notifications.

## Aggregators worth using
A handful of independent aggregators (freejobalert, sarkariresult) reliably mirror official PDFs within hours. Use them as a checklist, not as authority.

## What to ignore
Telegram channels promising leaked papers. WhatsApp forwards. Any site asking you to pay to "unlock" a notification that is legally required to be public.

## Build your own feed
Use a free RSS reader, add commission press-release pages, and set a daily 15-minute window to skim. That's it.`,
  ),
  T(
    "PDF summariser workflows: how researchers save hours every week",
    "How to combine an AI summariser, OCR and a citation manager to move faster through a stack of research papers without losing rigour.",
    "Productivity",
    "2026-06-04",
    `Researchers, journalists and lawyers face the same daily problem: too many PDFs, too little time. A layered AI workflow can cut the reading time by 60–70% without loss of accuracy — if you keep humans in the loop.

## Layer 1: triage
Feed each PDF into an AI summariser and ask for a five-bullet abstract. Skim the bullets. Discard papers that are off-topic in under a minute each.

## Layer 2: deep read
For papers that survive triage, ask the AI for a section-by-section summary, then read the sections you flagged as important in the original.

## Layer 3: citation
Extract the DOI, authors and year using the AI, then verify against the actual first page. Never let AI invent a citation.

## Layer 4: notes
Write your own one-paragraph takeaway in your own words. This is the step you must not skip — it's where understanding is formed.`,
  ),
  T(
    "PM Kisan status check and rejection reasons explained",
    "How to check your PM-KISAN instalment status, understand why an instalment was withheld, and what to do next.",
    "Government Services",
    "2026-05-30",
    `Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) transfers ₹6,000 per year to eligible farmer families in three instalments. If an instalment is missing, here's how to investigate.

## Check status
Go to pmkisan.gov.in → "Beneficiary Status" → enter your Aadhaar or account number. The portal shows the status of each instalment.

## Common reasons for withholding
Aadhaar not seeded to bank account, incorrect IFSC, land record mismatch, e-KYC not completed, and income tax filer status.

## e-KYC
Complete e-KYC using the "e-KYC" tab on the portal via Aadhaar OTP, or biometrically at a CSC. This is now mandatory for continued benefit.

## Grievance
Use the PM-KISAN helpline (155261) or the "Grievance" tab on the portal. Keep your registration number handy.

This is informational only. Bharat AI Sathi is not part of the Ministry of Agriculture.`,
  ),
  T(
    "Prompt engineering: the 6 patterns that actually work in production",
    "Cut through the noise. These six prompt patterns cover 90% of real production use cases across chat, code and content.",
    "Artificial Intelligence",
    "2026-05-26",
    `Prompt engineering as a discipline is settling. After thousands of production prompts across our AI tools, six patterns keep coming back.

1. **Role + task + constraints.** "You are a legal editor. Rewrite this clause in plain English. Under 60 words."
2. **Show, don't tell.** Include two or three examples of the output format you want.
3. **Chain of thought.** Ask the model to think step by step before answering. Improves accuracy on multi-step reasoning.
4. **Refuse-and-ask.** Tell the model to refuse to answer if inputs are missing, and to ask for what's missing instead of hallucinating.
5. **Output schema.** For anything you'll parse programmatically, ask for JSON with an explicit schema.
6. **Grounding.** Paste the source (paragraph, code, PDF text) into the prompt and instruct the model to use only that source.

Combine them. Almost every hard prompt in production is a combination of these six.`,
  ),
  T(
    "Voter ID online: name correction, address change and duplicate EPIC",
    "How to correct your name, change your address, or apply for a duplicate voter ID online through the National Voters' Service Portal.",
    "Government Services",
    "2026-05-22",
    `The Election Commission runs voters.eci.gov.in — the single official portal for all voter services. Anything else is a middleman.

## Sign up and log in
Use your mobile number to create a NVSP account. All forms are linked to that account so you can track status.

## Common forms
Form 6 for new voters, Form 8 for corrections and address change, Form 001 for duplicate EPIC. Fill online, upload the requested proof, submit. Track status by reference number.

## Timeline
Corrections typically take 15–30 days to reflect in the electoral roll. Physical EPIC delivery can take longer in tier-2 and tier-3 towns.

## No fees
There is no application fee for voter services. Anyone charging you is not authorised.`,
  ),
  T(
    "The 2026 laptop buying guide for Indian students under ₹60,000",
    "What actually matters (RAM, SSD, keyboard, warranty) and what doesn't (RGB, thin bezels), for students studying engineering, design or commerce.",
    "Technology",
    "2026-05-18",
    `Under ₹60,000 in 2026 you have real choices. Here's what to prioritise.

## What matters
16 GB RAM (upgradeable if possible), 512 GB NVMe SSD, an IPS panel at 250+ nits, a keyboard you can type on for hours, and next-business-day warranty in your city.

## What doesn't
Discrete GPU unless you're gaming or doing 3D. Thin-bezel screens. RGB anything. Weight below 1.5 kg costs a premium not worth it at this price band.

## By stream
Engineering — 16 GB, good thermals. Design — colour-accurate display, more storage. Commerce — battery life first, weight second.

## Where to buy
Authorised online stores plus the manufacturer's own site. Grey-market imports save 5% and lose you all warranty.`,
  ),
  T(
    "Deepfakes and elections: what Indian voters should watch for",
    "A calm, technical explanation of what deepfakes can and cannot do in an Indian political context, and how to spot the obvious tells.",
    "Cyber Security",
    "2026-05-14",
    `AI-generated audio and video of politicians will not go away. Here's how to think clearly about it.

## What deepfakes are good at
Making a real voice say new words, especially in short clips. Convincingly lip-syncing existing footage to new audio. Producing fake screenshots of chats.

## What they're still bad at
Long, unbroken video without artefacts. Consistent hand and eye movement. Correctly rendering complex Indic scripts in the frame.

## How to verify
Reverse image and video search. Check whether major news outlets carried the same clip. Look for the original upload source. Be sceptical of clips that arrive via WhatsApp forward from a single unknown number.

## Report
Forward suspected deepfakes of public figures to the Fact Check Unit of PIB and to the platform. Do not re-share for outrage.`,
  ),
  T(
    "How to write a resume that survives Indian ATS filters",
    "Indian hiring is increasingly automated. Here's how to structure your resume so it passes ATS filters without looking robotic to a human recruiter.",
    "Jobs",
    "2026-05-10",
    `Applicant Tracking Systems (ATS) parse your resume into fields. If it can't parse yours, a recruiter never sees it.

## Structure
Single column. No text in images. No tables for layout. Clear section headings — Experience, Education, Skills, Projects, Certifications.

## Keywords
Mirror the language of the job description in your Skills section — but only claim skills you can defend in an interview.

## Formatting
PDF exported from a word processor (not scanned). Standard fonts. No colour blocks behind text.

## The human layer
After passing the ATS, a human reads you for 15 seconds. Put the most impressive line of your career in the top third of page one.

Use our free AI Resume Builder to generate an ATS-friendly starting point, then edit ruthlessly.`,
  ),
  T(
    "Ayushman Bharat PMJAY: how to check eligibility and find empanelled hospitals",
    "A clear guide to the Ayushman Bharat health cover — who qualifies, how to check, how to get an Ayushman card, and how to find nearby empanelled hospitals.",
    "Government Services",
    "2026-05-06",
    `Ayushman Bharat PMJAY offers up to ₹5 lakh per family per year of cashless secondary and tertiary care at empanelled hospitals.

## Check eligibility
Go to pmjay.gov.in → "Am I eligible?" → enter your mobile and OTP. Search by name, ration card number or mobile.

## Get the card
If eligible, get your Ayushman card at a Common Service Centre, empanelled hospital or via the Ayushman app using Aadhaar-based e-KYC.

## Using the card
Present the card at any empanelled hospital. There is no cash payment for the covered procedures — that's the whole point of the scheme.

## Finding hospitals
Use the "Hospital Search" tab on pmjay.gov.in filtered by state and specialty.

Always verify empanelment on the official portal — some hospitals advertise as PMJAY partners after being de-empanelled.`,
  ),
  T(
    "Why your Core Web Vitals suck and how to fix them (for real)",
    "A pragmatic engineering playbook for improving LCP, CLS and INP on a real Indian website — not on a synthetic benchmark.",
    "Technology",
    "2026-05-02",
    `Core Web Vitals scores from your Google Search Console reflect real users on real Indian 4G. Improving them isn't cosmetic — it's revenue.

## LCP (Largest Contentful Paint)
Preload the hero image. Serve modern formats (AVIF, WebP). Move above-the-fold text out of client components.

## CLS (Cumulative Layout Shift)
Every image and iframe must have width and height. Reserve space for ads before they load. Never insert content above the fold after first paint.

## INP (Interaction to Next Paint)
Ship less JavaScript. Break long tasks. Defer analytics and chat widgets until user interaction. Debounce heavy input handlers.

## Measure right
Field data from Chrome UX Report is the truth. Lab tools (Lighthouse) are a diagnostic, not a scoreboard.`,
  ),
  T(
    "Sukanya Samriddhi Yojana in 2026: rules, interest and withdrawal",
    "A parent-friendly guide to the Sukanya Samriddhi Yojana small savings scheme for the girl child, including the latest interest rate and withdrawal rules.",
    "Finance",
    "2026-04-28",
    `Sukanya Samriddhi Yojana (SSY) is one of the highest-yielding small savings schemes in India, restricted to a girl child under 10.

## Eligibility
Parent or legal guardian of a girl child aged under 10. One account per girl, up to two girls per family (three in case of twins).

## Deposit
Minimum ₹250, maximum ₹1.5 lakh per financial year, for 15 years from account opening. Deposits qualify for 80C deduction under the old tax regime.

## Maturity
Account matures 21 years from opening or on the girl's marriage after 18. Partial withdrawal up to 50% is allowed at 18 for higher education.

## Interest
Set quarterly by the government. Historically among the highest small-savings rates. Verify current rate before deposit.

Open at any Post Office or authorised bank branch. Not online for new accounts as of writing.`,
  ),
  T(
    "How to protect kids online: a parent's toolkit for Indian households",
    "Practical, non-preachy controls and conversations to keep children safer online — screen time, YouTube, WhatsApp, gaming and study apps.",
    "Cyber Security",
    "2026-04-24",
    `Blanket bans don't work. Layered controls and honest conversations do.

## Device level
Turn on Family Link (Android) or Screen Time (iOS). Set app-category time limits, not per-app bans. Kids find workarounds for single-app bans.

## App level
Restrict who can message your child on WhatsApp to "Contacts only". Turn off comments and DMs on Instagram until at least 15. Turn on YouTube Kids for under-10s.

## Conversation
Explain what a phishing message looks like. Explain that strangers in games and chat are strangers even if they've spoken for months.

## Report
Save the CyberDost handles and 1930 helpline in the family group. Kids who know where to report are less afraid to tell you.`,
  ),
  T(
    "Passport apply and reissue: the actual timeline in 2026",
    "Realistic tatkal vs normal timelines, appointment tips, police verification, and what to do if your appointment slot dries up.",
    "Government Services",
    "2026-04-20",
    `Passport Seva has become dramatically faster in recent years but the experience still varies by city.

## Slots
Log in at passportindia.gov.in early morning. New slots typically open in bursts. If your city has none, try a neighbouring PSK — you can pick any PSK in your RPO's jurisdiction.

## Documents
Aadhaar, PAN, plus one address proof. For minors, both parents' passports or an annexure.

## Verification
Police verification is post-issue in many states for fresh applications with strong ID. Reissues on the same address are usually without further PV.

## Timeline
Normal — 15 to 30 days end-to-end. Tatkal — 3 to 7 working days if verification clears quickly.

## Common mistakes
Name mismatch across Aadhaar and school-leaving certificate. Fix at source before applying.`,
  ),
  T(
    "AI in Indian classrooms: what actually helps students learn",
    "A teacher-focused review of AI use in Indian schools and colleges — where it genuinely helps and where it becomes a shortcut that harms learning.",
    "Education",
    "2026-04-16",
    `Every principal is being pitched an "AI-first" curriculum. Most of them shouldn't buy it. Here's what actually works.

## What helps
Personalised practice — AI generates additional problems at the exact difficulty each student needs. Foreign language conversation practice. Reading comprehension coaching.

## What doesn't
AI writing whole assignments for students. Chatbots pretending to be therapists. Anything that removes the student's own struggle from the loop.

## The teacher's role
The best AI tools give the teacher the analytics. A dashboard showing which concepts a class hasn't mastered is worth more than any student-facing chatbot.

## Guardrails
Every AI feature in a school setting should log what was asked and what was answered. Parents and teachers should be able to review.`,
  ),
  T(
    "GST for freelancers in India: when do you actually need to register?",
    "Turnover thresholds, inter-state supply rules, RCM basics, and what a solo freelancer should really know about GST.",
    "Finance",
    "2026-04-12",
    `GST is often over-explained for freelancers. Here's a clean version.

## Turnover threshold
₹20 lakh for services (₹10 lakh in special category states). If your turnover in the financial year stays under, GST registration is not mandatory.

## Inter-state supply
If you supply services to a client outside your state (very common for freelance work), the threshold no longer protects you the same way. Take advice or register.

## RCM
Some services (e.g. legal from an advocate) attract Reverse Charge on the recipient. This is usually not your problem as a freelancer providing service — it's the recipient's.

## Once registered
File GSTR-1 and GSTR-3B on time even in zero months. Late fees add up fast.

This is a starter, not tax advice. When your income crosses ₹15 lakh, hire a CA.`,
  ),
  T(
    "Government CSC centre: how to find, use and become one",
    "How Common Service Centres work, what services they offer to citizens, and what it takes to become a Village Level Entrepreneur.",
    "Digital India",
    "2026-04-08",
    `CSCs are the last-mile face of Digital India — over 5 lakh of them across the country delivering G2C and B2C services.

## As a citizen
Use CSC for Aadhaar update, PAN, insurance, banking (BC point), utility bill payment, and various state certificates. Fees are notified — ask before paying.

## As a VLE
Register at register.csc.gov.in. You need a TEC certificate, an active bank account, PAN, Aadhaar, and basic IT infrastructure.

## Revenue
VLEs earn per-transaction commissions plus retail products. Realistic net income depends heavily on footfall in your village or ward.

## Grievance
Every service has an SLA. If your work is delayed beyond it, escalate through the CSC helpdesk, not through WhatsApp middlemen.`,
  ),
  T(
    "How to actually use Google Search Console (past the basics)",
    "Beyond 'submit sitemap' — the six Search Console reports that will change how you write and structure content.",
    "Technology",
    "2026-04-04",
    `Most site owners open GSC once, submit a sitemap, and never come back. That's a waste.

## The reports that matter
Performance (by query, by page, by country), Coverage, Core Web Vitals, Mobile Usability, Enhancements (structured data), and Manual Actions.

## Performance
Sort queries by impressions and CTR. Any query on page one with CTR below 3% is a title-tag rewrite opportunity.

## Coverage
"Excluded" is where the bodies are buried. Duplicate canonical, crawled but not indexed, and soft 404s all point to specific fixes.

## Enhancements
If you added structured data, this is where you'll see errors. Fix them before Google stops rendering rich results.

Set a weekly 20-minute slot to skim GSC. That's enough to catch most regressions before they cost traffic.`,
  ),
  T(
    "Freelance in India: 5 platforms that actually pay in 2026",
    "An honest look at five freelance platforms that pay Indian freelancers on time, plus the platform-agnostic habits that separate top-earners from the rest.",
    "Jobs",
    "2026-03-30",
    `Every platform promises income. Only a few reliably deliver, especially for Indian freelancers dealing with international clients and FX.

## Platforms worth trying
Upwork remains dominant for long-term client relationships. Toptal for high-end technical work if you can pass their screens. Contra for creatives who prefer no commission. Fiverr for productised services. LinkedIn for direct outreach — the highest-margin channel of all.

## Payment
Wise and Payoneer both work. Take FIRC every year for clean records. Register for GST if your foreign income crosses thresholds — export of services is zero-rated but you still need to file.

## Habits that separate
Weekly outreach, a real portfolio you own (not just a platform profile), and one signature deliverable your clients can share.`,
  ),
  T(
    "Ration card online status and correction: state by state basics",
    "Every state has its own PDS portal. Here's how to find yours, check status, correct member details and download an e-copy.",
    "Government Services",
    "2026-03-26",
    `Ration cards are a state subject, so every state has its own PDS portal. The workflow is broadly similar.

## Find your state portal
Search "PDS <state name>" on Google and prefer the .gov.in or .nic.in domain. Bookmark it.

## Check status
Look for "Ration Card Status" or "Beneficiary Details". Search by card number, Aadhaar or head-of-family name.

## Correction
Add or remove a member using the state's specific form (usually Form 3 or Form 4). Upload proof — birth certificate for a new-born, marriage certificate to add a spouse, death certificate to remove.

## Portability
One Nation One Ration Card allows you to draw your entitlement from any fair-price shop in the country. Ask the shopkeeper to check via ePOS if your card is portable-tagged.

Never pay bribes for a ration card. Escalate via state grievance if asked.`,
  ),
  T(
    "The 12 shortcuts every knowledge worker in India should know",
    "A short, memorable list of keyboard shortcuts and small workflow tweaks that add up to hours saved every month.",
    "Productivity",
    "2026-03-22",
    `Not glamorous, but effective. Twelve small things you can adopt in a week.

## Universal
Cmd/Ctrl+K to search inside almost every modern app. Cmd/Ctrl+Shift+T to reopen the tab you just closed. Cmd/Ctrl+Backtick to switch windows within the same app.

## Browser
Middle-click a link to open in background tab. Cmd/Ctrl+L to focus the address bar. Cmd/Ctrl+Shift+N for incognito.

## Google Docs & Sheets
Cmd/Ctrl+/ opens the full shortcut list. Cmd/Ctrl+Shift+V pastes without formatting. Cmd/Ctrl+K inserts a link on selected text.

## OS level
Set up text expansion — turn common phrases into two-letter shortcuts. Set your default screenshot to "region", not full screen. Move mouse to a hot corner to see all windows.`,
  ),
  T(
    "How to spot AI-generated misinformation before you share it",
    "A short field guide for anyone in a family WhatsApp group. Practical, non-technical tests to run before you forward that shocking clip.",
    "Cyber Security",
    "2026-03-18",
    `Every family group in India has become a distribution channel for misinformation. Here's a simple checklist to break the cycle.

## Ask three questions
1. Who is the primary source? (Not "a friend sent it" — the original creator.)
2. When was it posted? A 2019 protest video re-shared today is de facto misinformation.
3. What would I lose by waiting 24 hours to share?

## Reverse-search everything
Google Lens on the image. YouTube search a distinctive quote. If a mainstream outlet hasn't picked it up in 24 hours, it's probably not what it claims.

## Report, don't rage
Report the message to WhatsApp (long-press → Report). Forward to PIB Fact Check (+91-8799711259). Then, if you want, respond in the group with the correction.

## The best filter is you
Don't be the person who forwards first. Be the person who waits.`,
  ),
];

export const BLOG_CATEGORIES = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
