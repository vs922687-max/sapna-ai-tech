# Work & Earn notifications

## Goal
Add reliable in-app and email alerts for the four requested Work & Earn events, while preserving the existing design and workflows.

## What will change
- Add a notifications store with unread/read state, event type, recipient, related job/application, message, and timestamp.
- Add payment status to accepted work, with clear states such as pending, processing, paid, and payment issue. Payment tracking will remain informational; no automatic money transfer will be introduced.
- Generate notifications when:
  - a worker submits a new application (notify the client),
  - a client approves completed work (notify the worker),
  - a worker submits completed work (notify the client),
  - a client changes payment status (notify the worker).
- Add a notification bell to the signed-in header with unread count, recent alerts, links to the relevant Work & Earn page, and mark-read controls.
- Show payment status in My Work for both client and worker, with client-only status controls after approval.
- Add matching branded transactional emails containing the job name, update, and a safe link back to My Work.

## Safety and access
- Only the intended recipient can read or mark an in-app notification.
- Only the job owner can change approval and payment status; only the assigned worker can submit work.
- Event writes will be validated on the server so notification recipients cannot be forged from the browser.
- Existing jobs and applications will remain intact; existing approved work will default to payment pending.

## Email prerequisite
Email sending requires verification of a sender domain owned by the project. The complete email flow can be built now, but delivery will begin only after that domain is configured and verified.

## Verification
- Check database access rules and generated types.
- Test all four event flows, unread counts, read state, deep links, and payment status permissions.
- Confirm the Work & Earn pages still render correctly on desktop and mobile.
