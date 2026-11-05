import { describe, expect, it } from "vitest";
import { formatPrice, rupeesToPaise, shippingFor } from "@/lib/money";
import { safeRedirectPath } from "@/lib/session";
import { addressSchema, registerSchema } from "@/lib/validation";

describe("formatPrice", () => {
  it("formats whole rupees", () => expect(formatPrice(69900)).toBe("₹699"));
  it("keeps paise", () => expect(formatPrice(69950)).toBe("₹699.50"));
  it("uses Indian grouping", () => expect(formatPrice(12345600)).toBe("₹1,23,456"));
});

describe("rupeesToPaise", () => {
  it("parses whole and decimal amounts", () => {
    expect(rupeesToPaise("699")).toBe(69900);
    expect(rupeesToPaise("699.5")).toBe(69950);
    expect(rupeesToPaise("0.29")).toBe(29);
  });
  it("rejects bad input", () => {
    for (const bad of ["", "abc", "-5", "1.234", "1,000"]) {
      expect(rupeesToPaise(bad)).toBeNull();
    }
  });
});

describe("shippingFor", () => {
  it("charges the fee below the threshold", () => expect(shippingFor(69900, 9900, 149900)).toBe(9900));
  it("is free at the threshold", () => expect(shippingFor(149900, 9900, 149900)).toBe(0));
  it("is free for an empty cart", () => expect(shippingFor(0, 9900, 149900)).toBe(0));
});

describe("safeRedirectPath", () => {
  it("allows local paths", () => expect(safeRedirectPath("/checkout")).toBe("/checkout"));
  it("blocks other sites", () => {
    for (const bad of ["https://evil.test", "//evil.test", "/\\evil.test", "evil"]) {
      expect(safeRedirectPath(bad)).toBe("/account");
    }
  });
});

describe("validation", () => {
  const address = {
    fullName: "Test Person",
    phone: "9876543210",
    line1: "1 Fort Road",
    city: "Bidar",
    state: "Karnataka",
    pincode: "585401",
    isDefault: false,
  };

  it("accepts a valid address", () => expect(addressSchema.safeParse(address).success).toBe(true));
  it("rejects a bad PIN code", () => {
    expect(addressSchema.safeParse({ ...address, pincode: "12" }).success).toBe(false);
  });
  it("rejects a bad phone number", () => {
    expect(addressSchema.safeParse({ ...address, phone: "12345" }).success).toBe(false);
  });
  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      name: "Test",
      email: "a@b.test",
      phone: "9876543210",
      password: "password1",
      confirmPassword: "password2",
    });
    expect(result.success).toBe(false);
  });
});
