// Non-async exports shared between the server action and the client form.
// This file intentionally has NO "use server" directive so constants and
// types can be imported by client components.

export const HONEYPOT_FIELD = "company_website";

export type LeadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "clinic" | "email", string>>;
};

export const initialLeadState: LeadFormState = { status: "idle" };
