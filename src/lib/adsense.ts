/**
 * Google AdSense configuration.
 *
 * PUBLISHER_ID is the client id from your AdSense account (safe to keep in code).
 *
 * SLOTS: paste the numeric "data-ad-slot" id of each ad unit you create inside
 * AdSense → Ads → By ad unit. Leave a value empty ("") and that placement simply
 * renders nothing — no empty ad boxes, no policy risk.
 */
export const ADSENSE_PUBLISHER_ID = "ca-pub-4119150710486933";

export const ADSENSE_SLOTS = {
  /** Below the article intro / between content sections */
  articleTop: "",
  /** Bottom of an article, above related posts */
  articleBottom: "",
  /** In the blog listing grid */
  listing: "",
  /** Below tool output / long content pages */
  contentBottom: "",
} as const;

export type AdSlotName = keyof typeof ADSENSE_SLOTS;
