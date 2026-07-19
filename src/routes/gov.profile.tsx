import { createFileRoute, Link } from "@tanstack/react-router";
import { UserCircle2, Save, RotateCcw, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { EMPTY_PROFILE, profileCompletion, useGovProfile, type GovProfile } from "@/lib/gov-profile";
import { toast } from "sonner";

export const Route = createFileRoute("/gov/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — AI Form Auto-Fill | Bharat AI Sathi" },
      { name: "description", content: "Save your details once. Auto-fill 500+ Indian government forms and letters instantly. Stored securely on your device." },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "https://bharataisathi.com/gov/profile" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/gov/profile" }],
  }),
  component: ProfilePage,
});

const GROUPS: { title: string; fields: (keyof GovProfile)[] }[] = [
  { title: "Personal", fields: ["fullName", "fatherName", "motherName", "spouseName", "gender", "dob", "maritalStatus", "religion", "category", "nationality"] },
  { title: "Contact", fields: ["mobile", "email"] },
  { title: "Address", fields: ["address", "city", "district", "state", "pincode", "country"] },
  { title: "Documents", fields: ["aadhaar", "pan", "voterId", "passport", "drivingLicense"] },
  { title: "Work & Bank", fields: ["occupation", "annualIncome", "bankAccount", "ifsc", "bankName"] },
];

const LABELS: Record<keyof GovProfile, string> = {
  fullName: "Full Name", fatherName: "Father's Name", motherName: "Mother's Name", spouseName: "Spouse Name",
  gender: "Gender", dob: "Date of Birth", mobile: "Mobile", email: "Email",
  aadhaar: "Aadhaar Number", pan: "PAN", voterId: "Voter ID (EPIC)", passport: "Passport Number", drivingLicense: "Driving Licence No.",
  address: "Address", city: "City", district: "District", state: "State", pincode: "PIN Code", country: "Country",
  category: "Category", religion: "Religion", nationality: "Nationality", occupation: "Occupation", annualIncome: "Annual Income (₹)",
  maritalStatus: "Marital Status", bankAccount: "Bank Account", ifsc: "IFSC", bankName: "Bank Name",
};

function ProfilePage() {
  const [profile, setProfile] = useGovProfile();
  const complete = profileCompletion(profile);

  const set = (k: keyof GovProfile, v: string) => setProfile({ ...profile, [k]: v } as GovProfile);

  const clear = () => { if (confirm("Reset all profile fields?")) setProfile(EMPTY_PROFILE); };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link to="/gov" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-3.5 w-3.5" /> Government
        </Link>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-border/60">
              <UserCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold sm:text-3xl">My Profile</h1>
              <p className="text-xs text-muted-foreground">Saved on this device only. Used for AI Auto-Fill across forms & documents.</p>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1">
            <div className="h-2 w-40 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${complete}%` }} />
            </div>
            <span className="text-[11px] text-muted-foreground">{complete}% complete</span>
          </div>
        </div>

        {GROUPS.map((g) => (
          <div key={g.title} className="mt-6 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">{g.title}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {g.fields.map((k) => (
                <div key={k} className={k === "address" ? "sm:col-span-2" : ""}>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">{LABELS[k]}</label>
                  {k === "address" ? (
                    <textarea rows={2} value={profile[k]} onChange={(e) => set(k, e.target.value)}
                      className="w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
                  ) : k === "gender" || k === "category" || k === "maritalStatus" ? (
                    <select value={profile[k]} onChange={(e) => set(k, e.target.value)}
                      className="w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60">
                      <option value="">—</option>
                      {(k === "gender" ? ["Male", "Female", "Other"]
                        : k === "category" ? ["General", "OBC", "SC", "ST", "EWS"]
                        : ["Single", "Married", "Divorced", "Widowed"]).map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={k === "dob" ? "date" : k === "email" ? "email" : k === "mobile" ? "tel" : "text"}
                      value={profile[k]} onChange={(e) => set(k, e.target.value)}
                      className="w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={() => toast.success("Profile saved on this device")}><Save className="mr-1 h-4 w-4" /> Save</Button>
          <Button variant="outline" onClick={clear}><RotateCcw className="mr-1 h-4 w-4" /> Reset</Button>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
