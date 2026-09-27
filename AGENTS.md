<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep Shorts Agent generation in an authenticated server function using the existing AI gateway helper, then save through the caller's RLS-scoped database client; this avoids exposing keys and keeps each user's scripts private.
- Keep YouTube channel authorization separate from Google app sign-in: expose only the validated public Google web client ID from the server environment, then hold the short-lived read/upload token and video bytes in browser memory for direct YouTube uploads; app sign-in alone does not grant YouTube access.
- Record public visits through a server function that accepts no row fields while keeping direct database inserts closed to visitors; the public footer still needs an anonymous cumulative count.
- Encode short Creator Studio MP4 videos in the browser with WebCodecs via Mediabunny and fetch AI narration through an authenticated streaming route; this avoids server-side native renderers and keeps uploaded scene photos on the user's device.
- Generate Creator Studio scene imagery through an authenticated streaming image route and keep generated/user-selected image bytes in browser memory for MP4 export; this keeps gateway credentials private and avoids storing personal photos.
- Render free Shorts animations, recorded narration and timed captions locally with browser MediaRecorder, Canvas and Mediabunny; this avoids paid generation and keeps microphone recordings on the user's device.
