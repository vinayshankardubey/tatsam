export type UserRole = "seeker" | "acharya" | "admin";
export type ReadingPlan = "darshan" | "signature" | "legacy";
export type ReadingStatus = "pending" | "in_review" | "delivered" | "cancelled";
export type RemedyCategory = "mantra" | "gemstone" | "ritual" | "practice" | "charity";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  dob: string | null;
  tob: string | null;
  birth_place: string | null;
  language: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type Reading = {
  id: string;
  user_id: string;
  plan: ReadingPlan;
  status: ReadingStatus;
  acharya_id: string | null;
  acharya_name: string | null;
  acharya_summary: string | null;
  seeker_note: string | null;
  report_url: string | null;
  price_inr: number | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ReadingEvent = {
  id: string;
  reading_id: string;
  kind:
    | "created"
    | "assigned"
    | "status_change"
    | "note"
    | "report_uploaded"
    | "delivered";
  payload: Record<string, unknown>;
  actor_id: string | null;
  created_at: string;
};

export type ReadingRemedy = {
  id: string;
  reading_id: string;
  category: RemedyCategory;
  title: string;
  detail: string | null;
  sort_order: number;
  created_at: string;
};

export type ReadingMessage = {
  id: string;
  reading_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export const PLAN_META: Record<ReadingPlan, { label: string; priceInr: number | null }> = {
  darshan: { label: "Darshan", priceInr: 499 },
  signature: { label: "Signature", priceInr: 2499 },
  legacy: { label: "Legacy", priceInr: null },
};

export const STATUS_LABEL: Record<ReadingStatus, string> = {
  pending: "Awaiting acharya",
  in_review: "Under reading",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const REMEDY_LABEL: Record<RemedyCategory, string> = {
  mantra: "Mantra",
  gemstone: "Gemstone",
  ritual: "Ritual",
  practice: "Daily practice",
  charity: "Charity / Daan",
};

export const EVENT_LABEL: Record<ReadingEvent["kind"], string> = {
  created: "Reading requested",
  assigned: "Acharya assigned",
  status_change: "Status updated",
  note: "Acharya added a note",
  report_uploaded: "Report uploaded",
  delivered: "Reading delivered",
};
