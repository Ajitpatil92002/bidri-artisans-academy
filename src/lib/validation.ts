import { z } from "zod";

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export const emailSchema = z
  .email("Enter a valid email address.")
  .max(254)
  .transform((value) => value.toLowerCase());

export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(128, "Use 128 characters or fewer.");

const phoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number.");

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name.").max(100),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "The passwords don't match.",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password.").max(128),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100),
  phone: phoneSchema,
});

export const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the recipient's name.").max(100),
  phone: phoneSchema,
  line1: z.string().trim().min(3, "Enter the address.").max(200),
  line2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2, "Enter the city.").max(100),
  state: z.enum(INDIAN_STATES, { error: "Choose a state." }),
  pincode: z.string().trim().regex(/^[1-9]\d{5}$/, "Enter a 6-digit PIN code."),
  isDefault: z.boolean(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100),
  email: emailSchema,
  message: z.string().trim().min(10, "Tell us a little more.").max(5000),
});
