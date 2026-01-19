import { z } from "zod";

export const checkoutSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address_1: z.string().min(1, "Street address is required"),
  address_2: z.string(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  postcode: z.string().min(5, "ZIP code is required"),
  country: z.enum(["US", "CA"]),
  coupon_code: z.string(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
