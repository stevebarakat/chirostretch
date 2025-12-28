"use client";

import { Elements } from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { getStripe } from "@/lib/graphql/stripe/client";
import CheckoutForm from "./CheckoutForm";

export default function CheckoutFormWrapper() {
  const stripePromise = getStripe();

  const options: StripeElementsOptions = {
    locale: "en",
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}
