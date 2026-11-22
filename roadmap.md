- [x] Load the saved Google web client ID for the Shorts Agent connection flow from the server environment; expose only the validated public ID to Google Identity Services.
- [x] Confirm Google sign-in is enabled and verify the signed-in YouTube connection button opens Google.
- [ ] Google recognizes the saved OAuth client, but consent is blocked by `400 origin_mismatch` in the local preview. The owner must add the app's exact website origins in Google Cloud (including the published domain and any preview origin used for testing), enable YouTube Data API v3, and finish channel consent to verify the channel read.
- [x] Add a Creator Studio workflow that turns a script into narration, visual scenes, and a downloadable MP4 with honest browser support and failure states.
- [x] Replace text-only video scenes with generated, previewable scene imagery while retaining user-uploaded photos and MP4 export.
- [x] Build no-paid-API Shorts animation with recorded Hindi narration, burned subtitles, vertical MP4 and direct YouTube upload.
- [ ] Verify a real MP4 export and YouTube upload after Chrome/Edge AVC+AAC support and Google OAuth origin/consent are available; local headless Chromium lacks the codecs, and Google Cloud still blocks consent with origin_mismatch.
- [x] Let creators publish the already-exported Creator Studio MP4 straight to YouTube without another AI generation or credit charge.
- [x] Default Creator Studio Shorts prompts to truthful contrarian first-three-second hooks, fast visual cues and seamless looping endings.
- [x] Allow up to 10,000 characters in Script to MP4 narration input and API, and clarify the existing 65-second MP4 limit in the FAQ.
- [x] Make the Script to MP4 narration box visibly larger and show its 10,000-character capacity beside the label.
- [x] Improve AI Content Creator with streamed complete packages, strict validation, preserved drafts and clear errors.
- [x] Add a browser-only festival poster maker with five templates, local lead saving, watermarked download and a clearly labelled demo HD modal.
- [x] Fix the signed-in homepage 500 caused by notification channel reuse and verify repeated menu remounts without a crash.
- [x] Replace poster demo checkout with the owner's Paytm QR, ₹29 UPI link and manual WhatsApp payment confirmation.

## AdSense readiness (Nov 2026)
- [x] Legal pages: refund policy (new), /privacy-policy alias, privacy policy covering AdSense/cookies/AI/payments, footer + header links
- [x] Contact form: Name/Email/Message (phone optional), support@bharataisathi.com
- [x] Cookie banner connected to Google Consent Mode (analytics + advertising)
- [x] 10 new 1000+ word Hinglish blog posts; author box, related posts, featured images
- [x] Homepage: remove invented testimonials/ratings, add How it works, 8-question FAQ, Free vs Pro pricing, public intro text
- [x] Labelled empty ad placeholders: blog sidebar, after 2nd paragraph, blog footer
- [x] Per-page title/description/og tags on every public page; sitemap + robots
- [x] Broken-link / public-access check of homepage, blog, about, contact
- [x] Fix tool and government detail pages that failed to load (500) and the top-menu dropdowns being cut off
- [ ] Owner to confirm the refund rules, Pro/Team prices and the Bengaluru address shown on Contact
- [ ] Create real AdSense ad units and paste their slot IDs (placeholders show until then)

## Plan payments (UPI)
- [ ] Pricing page UPI QR payment for Pro/Team (QR, UPI copy, amount, 12-digit UTR, saved submission, success message)
- [ ] Activate the plan instantly on UTR submit; admin can reject fake payments to revoke the plan
- [ ] Admin panel list of plan payments with verify/reject
- [ ] Tests for plan payment rules
