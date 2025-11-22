"use client";
import { useForm, ValidationError } from "@formspree/react";
import { Button } from "@/components/Button";
import "./form.css";

const formId = process.env.NEXT_PUBLIC_CONTACT_FORM;

export default function ContactForm() {
  const [state, handleSubmit] = useForm(formId!);

  if (state.succeeded) {
    return (
      <p>
        Your form was successfully submitted. Someone from our office will be
        responding to you shortly. If you don&apos;t hear back from us within
        the next 24 hours, please check your junk mail to ensure we weren&apos;t
        flagged by the spam filter.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="inputWrap">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          required
          style={{ border: "1px solid var(--grey20)" }}
        />
        <ValidationError prefix="Name" field="name" errors={state.errors} />
      </div>
      <div className="inputWrap">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          name="email"
          required
          style={{ border: "1px solid var(--grey20)" }}
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} />
      </div>
      <div className="inputWrap">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          id="phoneNumber"
          type="tel"
          name="phoneNumber"
          required
          style={{ border: "1px solid var(--grey20)" }}
        />
        <ValidationError
          prefix="Email"
          field="phoneNumber"
          errors={state.errors}
        />
      </div>
      <div className="inputWrap">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          style={{ border: "1px solid var(--grey20)" }}
        />
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
        />
      </div>
      <Button
        type="submit"
        color="var(--darkColor)"
        textColor="var(--grey05)"
        disabled={state.submitting}
      >
        Submit
      </Button>
    </form>
  );
}
