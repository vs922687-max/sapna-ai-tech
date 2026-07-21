import { createFileRoute } from "@tanstack/react-router";
import { BusinessGuidePage } from "@/components/business-guide-page";

const TITLE = "PM SVANidhi Guide - Street Vendor Loan Yojana | Bharat AI Sathi";
const DESCRIPTION =
  "PM SVANidhi (pmsvanidhi.mohua.gov.in) simple guide - rehri-patri walon ke liye ₹10,000 se ₹50,000 tak bina guarantee loan aur digital payment cashback.";
const URL = "https://bharataisathi.com/business/svanidhi";

export const Route = createFileRoute("/business/svanidhi")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: () => (
    <BusinessGuidePage
      title="PM SVANidhi - Simple Guide"
      breadcrumb="PM SVANidhi"
      intro={
        <>
          PM SVANidhi (PM Street Vendor's AtmaNirbhar Nidhi) Government of India ki ek special
          scheme hai street vendors aur rehri-patri walon ke liye. Isme aapko <strong>bina kisi
          guarantee ke ₹10,000 se ₹50,000 tak ka working capital loan</strong> milta hai, taaki
          aap apna chhota business aage badha sakein.
        </>
      }
      keyPoints={[
        <>Pehli baar apply karne par <strong>₹10,000 tak ka loan</strong> milta hai, bina kisi guarantee ke.</>,
        <>Loan time par chukane par agli baar <strong>₹20,000 aur phir ₹50,000</strong> tak milta hai.</>,
        <>Digital payments (UPI, QR code) accept karne par <strong>har mahine cashback</strong> bhi milta hai.</>,
        <>Interest par government <strong>subsidy</strong> deti hai, jisse EMI ka bojh kam ho jata hai.</>,
      ]}
      officialUrl="https://pmsvanidhi.mohua.gov.in/"
      officialLabel="Official PM SVANidhi Portal par Jayein"
    />
  ),
});
