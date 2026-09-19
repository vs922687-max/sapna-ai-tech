# Add Devotional Animator natively

## What will change
- Replace the broken external iframe with the supplied interactive devotional canvas animation.
- Keep the existing `/devotional-darshan` page, header link, page styling, and metadata.
- Adapt the controls to the website’s existing color tokens and reusable buttons.
- Keep play, pause, restart, timed Punjabi verses, and optional spiritual sound working on desktop and mobile.

## Technical details
- Run the animation only in the browser and clean up animation/audio resources when leaving the page.
- Avoid per-frame React effect restarts by keeping animation timing in refs while updating visible verse progress safely.
- Verify the page visually and test its controls in the live preview.
