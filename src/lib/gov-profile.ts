// User profile used by AI Form Auto-Fill and Document Generator.
// Stored locally — never sent to any third party without user action.
import { useGovStore } from "./gov-store";

export type GovProfile = {
  fullName: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  gender: "" | "Male" | "Female" | "Other";
  dob: string; // yyyy-mm-dd
  mobile: string;
  email: string;
  aadhaar: string;
  pan: string;
  voterId: string;
  passport: string;
  drivingLicense: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country: string;
  category: "" | "General" | "OBC" | "SC" | "ST" | "EWS";
  religion: string;
  nationality: string;
  occupation: string;
  annualIncome: string;
  maritalStatus: "" | "Single" | "Married" | "Divorced" | "Widowed";
  bankAccount: string;
  ifsc: string;
  bankName: string;
};

export const EMPTY_PROFILE: GovProfile = {
  fullName: "", fatherName: "", motherName: "", spouseName: "",
  gender: "", dob: "", mobile: "", email: "",
  aadhaar: "", pan: "", voterId: "", passport: "", drivingLicense: "",
  address: "", city: "", district: "", state: "", pincode: "", country: "India",
  category: "", religion: "", nationality: "Indian", occupation: "", annualIncome: "",
  maritalStatus: "", bankAccount: "", ifsc: "", bankName: "",
};

export function useGovProfile() {
  return useGovStore<GovProfile>("profile", EMPTY_PROFILE);
}

export function profileCompletion(p: GovProfile): number {
  const keys = Object.keys(EMPTY_PROFILE) as (keyof GovProfile)[];
  const filled = keys.filter((k) => String(p[k] ?? "").trim().length > 0).length;
  return Math.round((filled / keys.length) * 100);
}
