import { createFileRoute } from "@tanstack/react-router";
import { BusinessGuidePage } from "@/components/business-guide-page";

const TITLE = "Udyam Registration Guide - Free MSME Registration | Bharat AI Sathi";
const DESCRIPTION =
  "Udyam Registration (udyamregistration.gov.in) ki simple guide - MSME ke liye free registration, Aadhaar se turant certificate. Sirf jaankari.";
const URL = "https://bharataisathi.com/business/udyam";

export const Route = createFileRoute("/business/udyam")({
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
      title="Udyam Registration - Simple Guide"
      breadcrumb="Udyam Registration"
      intro={
        <>
          Udyam Registration (udyamregistration.gov.in) Government of India ka official portal hai
          jahan Micro, Small aur Medium Enterprises (MSME) apna business register kar sakte hain.
          Ye <strong>bilkul free</strong> hai aur sirf Aadhaar number se ho jata hai. Registration
          ke baad aapko government schemes, loans aur subsidies ka fayda milta hai.
        </>
      }
      keyPoints={[
        <>Bank loans, government subsidies aur tenders mein participate karne ke liye <strong>Udyam certificate zaroori</strong> hai.</>,
        <>Registration <strong>sirf Aadhaar number</strong> aur basic business details se ho jata hai - koi document upload nahi.</>,
        <>Certificate <strong>turant online generate</strong> hota hai aur lifetime valid hota hai.</>,
        <>Registration <strong>bilkul free</strong> hai - agar koi paisa maang raha hai to wo scam hai.</>,
      ]}
      officialUrl="https://udyamregistration.gov.in/"
      officialLabel="Official Udyam Portal par Jayein"
    />
  ),
});
