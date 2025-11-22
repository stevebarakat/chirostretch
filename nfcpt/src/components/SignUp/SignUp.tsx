"use client";
import { Button } from "@/components/Button";
import { useForm, ValidationError } from "@formspree/react";
import "./signup.css";

export default function SignUp() {
  const [state, handleSubmit] = useForm(
    process.env.NEXT_PUBLIC_CLAIM_OFFER_FORM!,
  );

  if (state.succeeded) {
    return (
      <div className="signUpWrap">
        <p
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            textAlign: "center",
            margin: "16px 0 0",
          }}
        >
          Thank You!
        </p>
        <p style={{ lineHeight: "1.5" }}>
          Your form was successfully submitted. Someone from our office will be
          responding to you shortly. If you don&apos;t hear back from us within
          the next 24 hours, please check your junk mail to ensure we
          weren&apos;t flagged by the spam filter.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="signUpWrap">
        <label htmlFor="name">Name</label>
        <input id="name" type="text" name="name" autoComplete="name" required />
        <ValidationError prefix="Name" field="name" errors={state.errors} />
      </div>
      <div className="signUpWrap">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          required
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} />
      </div>
      <div className="signUpWrap">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          id="phoneNumber"
          type="tel"
          name="phoneNumber"
          autoComplete="tel"
          required
        />
        <ValidationError
          prefix="Email"
          field="phoneNumber"
          errors={state.errors}
        />
      </div>
      <Button
        type="submit"
        color="var(--accentColor)"
        borderColor="white"
        textColor="white"
        width="100%"
        disabled={state.submitting}
      >
        Submit
      </Button>
    </form>
  );
}
