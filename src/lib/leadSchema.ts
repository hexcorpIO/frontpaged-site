import { z } from "zod";

// Plan a lead is interested in. "free-check" is the default (no specific tier).
export const PLANS = ["free-check", "visibility", "authority", "domination"] as const;
export type Plan = (typeof PLANS)[number];

export const PLAN_LABELS: Record<Plan, string> = {
  "free-check": "Free visibility check",
  visibility: "Visibility",
  authority: "Authority",
  domination: "Domination",
};

export const leadSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name"),
  clinic: z.string().trim().min(1, "Please enter your clinic name"),
  email: z.string().trim().email("Please enter a valid email"),
  // .catch() makes both "missing" and "unknown value" fall back to free-check.
  plan: z.enum(PLANS).catch("free-check"),
  message: z.string().trim().max(2000).optional(),
});

export type Lead = z.infer<typeof leadSchema>;
