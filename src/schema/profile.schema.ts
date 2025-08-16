import * as z from "zod";

// Contact Info Schema
export const shopContactInfoSchema = z.object({
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  email: z.email({ message: "Invalid email address" }), // new way
});

// Address Info Schema
export const shopAddressInfoSchema = z.object({
  streetAddress: z.string().min(1, { message: "Street address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  pincode: z.string().regex(/^\d{6}$/, { message: "Invalid pincode" }), // 6-digit
});

// Main Shop Info Schema (using .and instead of .merge)
export const shopInfoSchema = z
  .object({
    shopName: z.string().min(1, { message: "Shop name is required" }),
    ownerName: z.string().min(1, { message: "Owner name is required" }),
    shopDescription: z.string().min(1, { message: "Shop description is required" }),
  })
  .and(shopContactInfoSchema)
  .and(shopAddressInfoSchema);

// Inferred Types
export type IShopContactInfo = z.infer<typeof shopContactInfoSchema>;
export type IShopAddressInfo = z.infer<typeof shopAddressInfoSchema>;
export type IShopInfo = z.infer<typeof shopInfoSchema>;
