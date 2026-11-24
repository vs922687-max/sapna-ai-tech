/**
 * Adds campaign tags (utm_source / utm_medium / utm_campaign) to a link so
 * visits from shared links show their real source in analytics instead of "Direct".
 */
export function withUtm(url: string, source: string, medium = "social", campaign?: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", source);
    u.searchParams.set("utm_medium", medium);
    if (campaign) u.searchParams.set("utm_campaign", campaign);
    return u.toString();
  } catch {
    return url;
  }
}
