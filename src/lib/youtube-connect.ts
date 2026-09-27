export const YOUTUBE_READ_SCOPE = "https://www.googleapis.com/auth/youtube.readonly";

export type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

export type GoogleTokenClient = {
  requestAccessToken: (options?: { prompt?: string }) => void;
};

export type GoogleAccounts = {
  oauth2: {
    initTokenClient: (options: {
      client_id: string;
      scope: string;
      callback: (response: GoogleTokenResponse) => void;
      error_callback?: (error: { type: string }) => void;
    }) => GoogleTokenClient;
    revoke: (token: string, callback?: () => void) => void;
  };
};

export function googleAccounts(): GoogleAccounts | undefined {
  return (window as Window & { google?: { accounts?: GoogleAccounts } }).google?.accounts;
}