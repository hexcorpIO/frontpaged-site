"use server";

import { leadSchema } from "@/lib/leadSchema";
import { sendLeadEmail } from "@/lib/mailer";

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "clinic" | "email", string>>;
};

export const initialLeadState: LeadFormState = { status: "idle" };

type FieldErrorKey = "name" | "clinic" | "email";
const FIELD_ERROR_KEYS = new Set<string>(["name", "clinic", "email"]);

export async function submitLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  // Honeypot: humans never fill this hidden field. Pretend success, drop it.
  const honeypot = formData.get("company_website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success" };
  }

  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    clinic: formData.get("clinic"),
    email: formData.get("email"),
    plan: formData.get("plan"),
    message: formData.get("message") ?? undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Partial<Record<FieldErrorKey, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && FIELD_ERROR_KEYS.has(key)) {
        const typedKey = key as FieldErrorKey;
        fieldErrors[typedKey] ??= issue.message;
      }
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
  }

  try {
    await sendLeadEmail(parsed.data);
    return { status: "success" };
  } catch (err) {
    console.error("[submitLead] failed to send lead email:", err);
    return {
      status: "error",
      message:
        "Something went wrong sending your request. Please email hello@frontpaged.io directly.",
    };
  }
}
