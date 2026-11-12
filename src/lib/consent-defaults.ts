// Inline script for the root <head>: sets Google Consent Mode defaults and
// re-applies stored answers before any tag (AdSense, Lovable analytics) loads.
// Also copies the analytics answer saved by the earlier banner
// ("bas-cookie-consent-v1") into the per-purpose key once.
const LEGACY_MOVE = `(function () {
  try {
    if (localStorage.getItem("cookie_consent_analytics") !== null) return;
    var old = JSON.parse(localStorage.getItem("bas-cookie-consent-v1") || "null");
    if (!old || typeof old.analytics !== "boolean") return;
    localStorage.setItem("cookie_consent_analytics", JSON.stringify({ choice: old.analytics ? "granted" : "denied", at: Date.now() }));
  } catch (e) {}
})();`;

const DEFAULTS = `window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("consent", "default", {
  analytics_storage: "granted",
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
});
gtag("consent", "default", {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  wait_for_update: 500,
  region: "AT,BE,BG,HR,CY,CZ,DK,EE,FI,FR,DE,GR,HU,IE,IT,LV,LT,LU,MT,NL,PL,PT,RO,SK,SI,ES,SE,IS,LI,NO,GB,CH,RE,GP,MQ,GF,YT,MF,AX,CA-QC".split(","),
});
(function () {
  var signals = {
    analytics: ["analytics_storage"],
    advertising: ["ad_storage", "ad_user_data", "ad_personalization"],
  };
  for (var purpose in signals) {
    var choice = null;
    try {
      var saved = JSON.parse(localStorage.getItem("cookie_consent_" + purpose) || "null");
      if (
        saved &&
        (saved.choice === "denied" || (saved.choice === "granted" && Date.now() - saved.at < 365 * 86400000))
      ) {
        choice = saved.choice;
      }
    } catch (e) {}
    if (navigator.globalPrivacyControl === true) choice = "denied";
    if (!choice) continue;
    var update = {};
    signals[purpose].forEach(function (signal) {
      update[signal] = choice;
    });
    gtag("consent", "update", update);
  }
})();`;

export const CONSENT_DEFAULTS_SCRIPT = `${LEGACY_MOVE}\n${DEFAULTS}`;
