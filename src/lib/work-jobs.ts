export type WorkCategory = { slug: string; name: string };

export const WORK_CATEGORIES: WorkCategory[] = [
  { slug: "ai-data-annotation", name: "AI Data Annotation" },
  { slug: "data-entry", name: "Data Entry" },
  { slug: "punjabi-translation", name: "Punjabi Translation" },
  { slug: "hindi-translation", name: "Hindi Translation" },
  { slug: "english-translation", name: "English Translation" },
  { slug: "transcription", name: "Transcription" },
  { slug: "content-writing", name: "Content Writing" },
  { slug: "ai-assisted-writing", name: "AI-assisted Writing" },
  { slug: "image-tagging", name: "Image Tagging" },
  { slug: "document-formatting", name: "Document Formatting" },
  { slug: "web-research", name: "Web Research" },
  { slug: "social-media-content", name: "Social Media Content" },
  { slug: "graphic-design", name: "Graphic Design" },
  { slug: "video-editing", name: "Video Editing" },
  { slug: "website-testing", name: "Website Testing" },
];

export function categoryName(slug: string): string {
  return WORK_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug.replace(/-/g, " ");
}

export const PLATFORM_FEE_PERCENT = 10;

export function formatInr(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function workerPayout(budget: number): number {
  return Math.round(budget * (1 - PLATFORM_FEE_PERCENT / 100));
}

export const JOB_STATUS_LABEL: Record<string, string> = {
  open: "Open",
  in_progress: "In progress",
  completed: "Completed",
  closed: "Closed",
};

export const APPLICATION_STATUS_LABEL: Record<string, string> = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  accepted: "Accepted",
  submitted: "Work submitted",
  approved: "Approved",
  rejected: "Not selected",
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: "Payment pending",
  processing: "Payment processing",
  paid: "Paid",
  issue: "Payment issue",
};
