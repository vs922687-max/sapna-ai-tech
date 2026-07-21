import { createFileRoute } from "@tanstack/react-router";
import { BusinessGuidePage } from "@/components/business-guide-page";

const TITLE = "FSSAI License Guide - Food Business Registration | Bharat AI Sathi";
const DESCRIPTION =
  "FSSAI License (fssai.gov.in) simple guide - khane-peene ka business karne walon ke liye zaroori food safety license, Basic/State/Central types.";
const URL = "https://bharataisathi.com/business/fssai";

export const Route = createFileRoute("/business/fssai")({
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
      title="FSSAI License - Simple Guide"
      breadcrumb="FSSAI License"
      intro={
        <>
          FSSAI (Food Safety and Standards Authority of India) ka license har us business ke liye
          zaroori hai jo khana ya peene ki cheezein bech raha hai - chahe wo chhoti dukaan ho,
          restaurant ho, ya food manufacturer ho. Bina FSSAI license ke food business chalana
          <strong> illegal</strong> hai aur bhaari penalty lag sakti hai.
        </>
      }
      keyPoints={[
        <>Bina FSSAI license ke food business chalana <strong>illegal</strong> hai - penalty ₹5 lakh tak ho sakti hai.</>,
        <>Business size ke hisaab se 3 types ke license hote hain: <strong>Basic</strong> (₹12 lakh se kam turnover), <strong>State</strong> (₹12 lakh - ₹20 crore), aur <strong>Central</strong> (₹20 crore se zyada).</>,
        <>Application <strong>online fssai.gov.in par</strong> ho jata hai - koi middleman ki zaroorat nahi.</>,
        <>License number apni <strong>packaging, menu aur invoice</strong> par clearly dikhana zaroori hai.</>,
      ]}
      officialUrl="https://www.fssai.gov.in/"
      officialLabel="Official FSSAI Portal par Jayein"
    />
  ),
});
