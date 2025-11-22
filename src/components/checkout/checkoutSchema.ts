import { z } from "zod";

const addressSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  address_1: z.string().min(1, "Address is required"),
  address_2: z.string().optional().or(z.literal("")),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postcode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

const billingSchema = addressSchema.extend({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
});

export const checkoutFormSchema = z
  .object({
    billing: billingSchema,
    shipping: addressSchema,
    payment_method: z.string().min(1, "Payment method is required"),
    shipping_method: z.array(z.string()),
    sameAsBilling: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.sameAsBilling) {
        return true;
      }
      return addressSchema.safeParse(data.shipping).success;
    },
    {
      message: "Shipping address is incomplete",
      path: ["shipping"],
    }
  );

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
