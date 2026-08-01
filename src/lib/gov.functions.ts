import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { completeGatewayChat } from "./ai-gateway.server";
import { z } from "zod";
import type { GovProfile } from "./gov-profile";

const profileKeyMap: Record<keyof GovProfile, string> = {
  fullName: "full_name",
  fatherName: "father_name",
  motherName: "mother_name",
  spouseName: "spouse_name",
  gender: "gender",
  dob: "dob",
  mobile: "mobile",
  email: "email",
  aadhaar: "aadhaar",
  pan: "pan",
  voterId: "voter_id",
  passport: "passport",
  drivingLicense: "driving_license",
  address: "address",
  city: "city",
  district: "district",
  state: "state",
  pincode: "pincode",
  country: "country",
  category: "category",
  religion: "religion",
  nationality: "nationality",
  occupation: "occupation",
  annualIncome: "annual_income",
  maritalStatus: "marital_status",
  bankAccount: "bank_account",
  ifsc: "ifsc",
  bankName: "bank_name",
};

function toSnake(profile: Partial<GovProfile>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(profile)) {
    const col = profileKeyMap[k as keyof GovProfile];
    if (col) out[col] = String(v ?? "");
  }
  return out;
}

function fromSnake(row: Record<string, unknown>): GovProfile {
  return Object.fromEntries(
    Object.entries(profileKeyMap).map(([camel, snake]) => [
      camel,
      String(row[snake] ?? ""),
    ])
  ) as GovProfile;
}

export type ApplicationRow = {
  id: string;
  service: string;
  refNo: string;
  status: string;
  submittedOn: string;
  followUp?: string;
  notes?: string;
  aiNextSteps?: string;
};

const ProfileSchema = z.object({}).catchall(z.string());

const AppSchema = z.object({
  id: z.string(),
  service: z.string(),
  refNo: z.string(),
  status: z.string(),
  submittedOn: z.string(),
  followUp: z.string().optional(),
  notes: z.string().optional(),
  aiNextSteps: z.string().optional(),
});

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("user_id", context.userId)
      .single();
    if (error || !data) {
      if (error?.code === "PGRST116") return null;
      throw new Error(error?.message || "Profile not found");
    }
    return fromSnake(data);
  });

export const upsertProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => ProfileSchema.parse(data) as Partial<GovProfile>)
  .handler(async ({ data, context }) => {
    const row = {
      user_id: context.userId,
      ...toSnake(data),
      updated_at: new Date().toISOString(),
    };
    const { error } = await context.supabase.from("profiles").upsert(row, { onConflict: "user_id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("gov_applications")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      id: String(r.id),
      service: String(r.service),
      refNo: String(r.ref_no),
      status: String(r.status),
      submittedOn: String(r.submitted_on),
      followUp: r.follow_up ? String(r.follow_up) : undefined,
      notes: r.notes ? String(r.notes) : undefined,
      aiNextSteps: r.ai_next_steps ? String(r.ai_next_steps) : undefined,
    }));
  });

export const upsertApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => AppSchema.parse(data))
  .handler(async ({ data, context }) => {
    const row: any = {
      id: data.id,
      user_id: context.userId,
      service: data.service,
      ref_no: data.refNo,
      status: data.status,
      submitted_on: data.submittedOn,
      follow_up: data.followUp || null,
      notes: data.notes || null,
      ai_next_steps: data.aiNextSteps || null,
    };
    const { error } = await context.supabase.from("gov_applications").upsert(row, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("gov_applications")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const suggestNextSteps = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({
      service: z.string(),
      refNo: z.string(),
      status: z.string(),
      submittedOn: z.string().optional(),
      notes: z.string().optional(),
    }).parse(data)
  )
  .handler(async ({ data }) => {
    const prompt = `Application: ${data.service}\nReference: ${data.refNo}\nStatus: ${data.status}\nSubmitted: ${data.submittedOn ?? "N/A"}\nNotes: ${data.notes ?? "None"}\n\nPretend you are an Indian government services expert. Return ONLY a numbered list of 3-5 most useful next steps to move this application forward. Keep each point short (under 140 characters), actionable, and bilingual (Hindi + English in same point). Do not add introductions or markdown.`;
    const res = await completeGatewayChat([
      { role: "system", content: "You are a helpful Indian government application assistant." },
      { role: "user", content: prompt },
    ]);
    if (!res.ok) throw new Error(res.error);
    const lines = res.text.split("\n").map((l) => l.replace(/^\s*\d+[.\)]\s*/, "").trim()).filter(Boolean);
    return lines.slice(0, 5);
  });
