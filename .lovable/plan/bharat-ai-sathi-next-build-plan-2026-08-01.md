# Bharat AI Sathi — Next Build Plan

Based on your choices, this plan delivers **Smart Government Assistant upgrade** + **Career & Student Hub**, and fixes the runtime error first.

## Phase 0: Fix runtime errors (prerequisite)

- Resolve the TanStack `default-entry/client.tsx` dynamic import failure caused by version mismatch (`@tanstack/react-router` 1.170.18 vs `@tanstack/react-start` 1.168.32). Align package versions to a compatible pair and verify the dev build loads.
- Fix the AdSense `<ins>` hydration mismatch by rendering ad slots only after client hydration (client-only guard).

## Phase 1: Smart Government Assistant upgrade

End-to-end functional upgrade of the Gov module without redesigning UI or changing routes.

- **AI Form Auto-Fill**: User enters basic details once on `/gov/profile`. On any `/gov/forms/$slug` page, AI pre-fills the form fields using profile data. Generates a printable/fillable PDF copy of the form.
- **Document Vault / DigiLocker readiness**: New route `/gov/vault` (or `/gov/documents` enhancement) where signed-in users can save frequently used documents (Aadhaar, PAN, marksheets, income certificates). Documents are listed with upload status; actual upload uses Supabase Storage with RLS.
- **Application Tracker dashboard**: New route `/gov/tracker` becomes a real dashboard. Users add applications manually (scheme name, department, applied date, application ID, status). AI can suggest next steps and generate reminder messages. Uses Lovable Cloud DB with RLS.
- **Smart Reminders**: Connect tracker deadlines to the tracker dashboard; show overdue/follow-up cards. Optional browser notification prompt for future PWA push.
- Schema: create `gov_applications`, `gov_documents`, and extend `profiles` with auto-fill fields (`full_name`, `address`, `state`, `pincode`, etc.). All tables get GRANTs and RLS policies.

## Phase 2: Career & Student Hub

New `/career` route with 5 integrated AI tools, mobile-responsive and SEO-ready.

- **AI Mock Interview**: Choose role/domain, AI asks 5-7 interview questions, user types/speaks answers, AI gives feedback and score.
- **Study Planner**: Input exam/target (UPSC, JEE, NEET, SSC, Banking, School), available hours per day, and weak subjects; AI generates a personalized weekly study timetable.
- **Exam Prep Assistant**: Topic-wise notes, MCQ practice generation, and AI explanation of wrong answers.
- **Scholarship Finder**: Search/filter from a curated list of 50+ real Indian scholarships (PMSSS, NSIGST, NSP, state schemes) with eligibility, deadline, and direct apply link.
- **Skills Roadmap**: Input career goal (e.g., AI Engineer, IAS Officer, Full Stack Developer); AI outputs month-by-month learning path with free resources.
- Add tool card to `/tools` directory and home page, update sitemap, add dynamic Open Graph image support consistent with blog articles.

## Out of scope (you skipped)

- Premium / Razorpay monetization and credit usage limits.

## Verification

- Build passes without TanStack errors.
- New Gov tools verified with authenticated and unauthenticated users.
- Career Hub tested on mobile viewport; all exports (copy/TXT/CSV) work.
- Routes added to `/sitemap.xml.ts` and search index updated if needed.
