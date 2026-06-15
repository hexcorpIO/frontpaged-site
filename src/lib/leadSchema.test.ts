import { describe, it, expect } from "vitest";
import { leadSchema } from "@/lib/leadSchema";

describe("leadSchema", () => {
  const valid = {
    name: "Dr. Lin",
    clinic: "Glow Med Spa",
    email: "lin@glowmedspa.com",
    plan: "authority",
    message: "Interested in Botox content.",
  };

  it("accepts a valid lead", () => {
    const result = leadSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.plan).toBe("authority");
  });

  it("rejects a missing name", () => {
    const result = leadSchema.safeParse({ ...valid, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = leadSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("defaults plan to free-check when absent", () => {
    const { plan, ...noPlan } = valid;
    const result = leadSchema.safeParse(noPlan);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.plan).toBe("free-check");
  });

  it("falls back to free-check for an unknown plan", () => {
    const result = leadSchema.safeParse({ ...valid, plan: "platinum" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.plan).toBe("free-check");
  });

  it("allows an omitted message", () => {
    const { message, ...noMsg } = valid;
    const result = leadSchema.safeParse(noMsg);
    expect(result.success).toBe(true);
  });
});
