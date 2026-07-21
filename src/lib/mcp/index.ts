import { auth, defineMcp } from "@lovable.dev/mcp-js";
import whoamiTool from "./tools/whoami";
import listGovServicesTool from "./tools/list-gov-services";
import searchGovServicesTool from "./tools/search-gov-services";
import getGovServiceTool from "./tools/get-gov-service";

// The OAuth issuer MUST be the direct Supabase host, not the .lovable.cloud proxy.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "bharat-ai-sathi-mcp",
  title: "Bharat AI Sathi",
  version: "0.1.0",
  instructions:
    "Tools for Bharat AI Sathi. Use `whoami` to check the signed-in user, and `list_gov_services`, `search_gov_services`, and `get_gov_service` to explore Indian government services (Aadhaar, PAN, PMAY, GST, Udyam, PM SVANidhi, FSSAI, and 270+ more) with official portal URLs, eligibility, documents, and step-by-step guidance.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [whoamiTool, listGovServicesTool, searchGovServicesTool, getGovServiceTool],
});
