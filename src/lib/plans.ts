// Plans shown on the homepage and the Pricing page. Keep both in sync from here.
export type Plan = {
  name: string;
  price: string;
  priceNumber: number;
  period: string;
  tag: string;
  features: string[];
  cta: string;
  to: "/auth" | "/contact";
  highlight: boolean;
};

export const PLANS: Plan[] = [
  {
    name: "Free",
    price: "₹0",
    priceNumber: 0,
    period: "forever",
    tag: "Start here",
    features: [
      "20 messages per day (resets every 24h)",
      "Hindi + English + 9 languages",
      "Community support",
    ],
    cta: "Get started",
    to: "/auth",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹499",
    priceNumber: 499,
    period: "/month",
    tag: "Most popular",
    features: [
      "Everything in Free",
      "Priority Gemini Pro access",
      "PDF chat + voice assistant",
      "Save & export conversations",
    ],
    cta: "Upgrade to Pro",
    to: "/auth",
    highlight: true,
  },
  {
    name: "Team",
    price: "₹1,499",
    priceNumber: 1499,
    period: "/month",
    tag: "For businesses",
    features: [
      "Everything in Pro",
      "5 seats included",
      "Team workspaces",
      "Admin analytics dashboard",
      "Priority email support",
    ],
    cta: "Contact sales",
    to: "/contact",
    highlight: false,
  },
];
