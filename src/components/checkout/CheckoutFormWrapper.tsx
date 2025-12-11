"use client";

import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/graphql/stripe/client";
import CheckoutForm from "./CheckoutForm";

export default function CheckoutFormWrapper() {
  const stripePromise = getStripe();

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
