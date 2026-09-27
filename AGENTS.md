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
- Keep YouTube channel authorization separate from Google app sign-in: use the public Google web client ID with a short-lived, read-only YouTube token in browser memory, since app sign-in alone does not grant YouTube access and no server-side client secret is configured.
