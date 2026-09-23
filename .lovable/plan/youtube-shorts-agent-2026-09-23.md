# YouTube Shorts Agent

## Goal
Create a modern, responsive page at `/shorts-agent` where signed-in users can generate and save a complete YouTube Shorts content package.

## Page experience
- Add the heading **“Bharat AI Sathi - Shorts Agent”**.
- Add a topic field with placeholder **“Enter topic e.g. AI se paise kaise kamaye”**.
- Add a language selector for Hindi, Punjabi, and English.
- Add a prominent blue **“Generate Shorts Script”** button with loading and validation states.
- Display results in three distinct boxes:
  1. Video Script
  2. Title + Description
  3. Tags and Hashtags
- Add **“Connect YouTube Channel”** and **“Upload to YouTube”** as polished ready-state controls. They will clearly indicate that connection/upload is not active yet, rather than pretending to publish.
- Match the existing Bharat AI Sathi dark visual system and make the layout work cleanly on mobile and desktop.

## AI and saved results
- Reuse the existing authenticated AI service and keep the prompt server-side through the current protected AI endpoint.
- Ask AI for a predictable structured response and safely separate it into script, title, description, tags, and hashtags.
- Require sign-in for generation and saving; show the existing sign-in guidance when no session is available.
- Save each successful result to the database with status `generated`.

## Database
Create `public.generated_shorts` with:
- Requested fields: `id`, `topic`, `script`, `title`, `description`, `tags`, `status`
- Supporting fields needed for secure ownership and display: `user_id`, `language`, `created_at`, `updated_at`
- Validate language/status values and input lengths.
- Grant authenticated access, enable row-level security, and allow users to read, create, update, and delete only their own rows. Service access remains available for trusted backend work.

## Verification
- Confirm the new route and metadata load correctly.
- Test empty-topic validation, signed-in generation, database save, all three result boxes, and ready-state YouTube buttons.
- Check desktop and mobile layouts and confirm the project typecheck remains clean.
