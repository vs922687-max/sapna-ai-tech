# Improve AI Content Creator reliability

## Goal
Make `/creator/content-generator` produce complete, useful content packages reliably, preserve user work, and show clear recovery messages when AI, login, credits, or connectivity fail.

## Changes
- Modernize the authenticated AI request used by the Content Creator to the supported streaming gateway flow and current default model, while keeping the API key server-only.
- Validate and limit incoming prompts safely; preserve exact gateway status messages for credits, access, rate limits, and configuration failures.
- Add bounded retry only for temporary rate-limit/server failures, with no duplicate instant requests.
- Prevent double generation, reject blank AI responses, and retain the existing output if regeneration fails.
- Improve the generation prompt so every requested section is complete, duration-aware, factual, and consistently formatted; keep the Viral Hook Engine only for short-form projects.
- Make the output area resilient for long packages, with visible generation status and reliable copy/download/save actions.
- Verify the signed-in generation flow, error states, saved draft behavior, desktop/mobile layout, and current build diagnostics.

## Scope
Only the AI Content Creator and its shared AI request path will change. Other Creator Studio tools and existing features will not be redesigned or removed.

## Technical details
- Use the existing authenticated `/api/ai` boundary and server-held `LOVABLE_API_KEY`.
- Use the assigned `openai/gpt-6-astra` Responses API contract with streamed server consumption and inline request history.
- Keep project saves in the existing Creator Studio project store; no database schema changes.
