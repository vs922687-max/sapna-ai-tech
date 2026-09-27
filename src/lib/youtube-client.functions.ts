import { createServerFn } from "@tanstack/react-start";

/** A Google OAuth web client ID is public by design; never return a client secret. */
export const getYoutubeClientId = createServerFn({ method: "GET" }).handler(async () => {
  const clientId = process.env["GOOGLE_OAUTH_CLIENT_ID"]?.trim();
  if (!clientId || !/^\d+-[a-z0-9]+\.apps\.googleusercontent\.com$/.test(clientId)) {
    throw new Error("A valid Google web client ID is not configured.");
  }
  return clientId;
});