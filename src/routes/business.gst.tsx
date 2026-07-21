import { createFileRoute } from "@tanstack/react-router";
import { BusinessGuidePage } from "@/components/business-guide-page";

const TITLE = "GST Portal Guide - Registration, Returns & Invoice | Bharat AI Sathi";
const DESCRIPTION =
  "GST portal (gst.gov.in) ki simple guide - registration kab zaroori hai, return filing aur invoice rules. Sirf jaankari, official work official site par karein.";
const URL = "https://bharataisathi.com/business/gst";

export const Route = createFileRoute("/business/gst")({
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
      title="GST Portal - Simple Guide"
      breadcrumb="GST Portal"
      intro={
        <>
          GST Portal (gst.gov.in) Government of India ka official platform hai jahan business owners
          apna GST registration karte hain, monthly ya quarterly returns file karte hain aur
          GST-compliant invoices generate kar sakte hain. Chhote dukandaron aur traders ke liye ye
          samajhna zaroori hai ki GST kab lagta hai aur kya-kya karna hota hai.
        </>
      }
      keyPoints={[
        <>Agar aapke business ka annual turnover <strong>₹40 lakh se zyada</strong> hai (services ke liye ₹20 lakh), to GST registration zaroori hai.</>,
        <>Registration ke baad har mahine ya quarter mein <strong>GST returns file karni hoti hain</strong> - late hone par penalty lagti hai.</>,
        <>Har invoice par apna <strong>GSTIN number aur GST rate</strong> clearly dikhana zaroori hai.</>,
        <>Input Tax Credit (ITC) ka fayda lene ke liye purchases ki proper record aur supplier ka GST return dono zaroori hain.</>,
      ]}
      officialUrl="https://www.gst.gov.in/"
      officialLabel="Official GST Portal par Jayein"
    />
  ),
});
