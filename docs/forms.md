# Gravity Forms + React Hook Form + Zod Integration

This module provides a clean integration pattern for Gravity Forms with React Hook Form and Zod, following the principle:

> **Zod is a seatbelt. React Hook Form is the steering wheel. Gravity Forms is the law.**

## Philosophy

- **Gravity Forms**: The authoritative validator for business rules (required fields, email format, conditional logic, anti-spam)
- **React Hook Form**: Manages form state, handles dirty state, accessibility, keyboard flow, error focus
- **Zod**: Validates structure only (field exists, correct type) - a "seatbelt" before submission

## Usage Patterns

### Pattern 1: Using the Hook (Recommended)

```tsx
"use client";

import { useGravityForm } from "@/lib/forms";
import type { GravityFormField } from "@/lib/graphql/queries/gravity-forms";

type MyFormProps = {
  formFields: GravityFormField[];
  formId: string;
};

export function MyForm({ formFields, formId }: MyFormProps) {
  const { register, handleSubmit, formState: { errors }, submitError } = useGravityForm({
    fields: formFields,
    onSubmit: async (data) => {
      const response = await fetch("/api/gravity-forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId,
          formData: data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData; // Error mapper will handle this
      }

      return response.json();
    },
    onSuccess: (response) => {
      console.log("Form submitted:", response);
      // Handle success (redirect, show message, etc.)
    },
    onError: (error) => {
      console.error("Submission error:", error);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      {/* Render your fields using register() */}
      {formFields.map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id}>
            {field.label}
            {field.isRequired && <span>*</span>}
          </label>
          <input
            {...register(field.id)}
            id={field.id}
            type={field.inputType === "email" ? "email" : "text"}
          />
          {errors[field.id] && (
            <span>{errors[field.id]?.message}</span>
          )}
        </div>
      ))}

      {submitError && <div>{submitError}</div>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Pattern 2: Manual Integration (More Control)

If you need more control or are using `next-gravity-forms`, you can use the utilities directly:

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  generateGravityFormSchema,
  mapGravityFormErrorsToRHF,
  extractGravityFormErrorMessage,
} from "@/lib/forms";
import type { GravityFormField } from "@/lib/graphql/queries/gravity-forms";

export function MyForm({ fields }: { fields: GravityFormField[] }) {
  // Generate schema from GF metadata
  const schema = generateGravityFormSchema(fields);

  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setSubmitError(null);

    try {
      const response = await fetch("/api/gravity-forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: "123",
          formData: data,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.is_valid === false) {
        // Map GF errors to RHF
        mapGravityFormErrorsToRHF(result, form.setError);

        // Extract general error message
        const errorMessage = extractGravityFormErrorMessage(result);
        if (errorMessage) {
          setSubmitError(errorMessage);
        }
        return;
      }

      // Success
      console.log("Form submitted:", result);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "An error occurred";
      setSubmitError(errorMessage);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Your form fields */}
    </form>
  );
}
```

### Pattern 3: Custom Schema (Strict/Loose Strategy)

For multi-step forms or when you need stricter validation:

```tsx
import { z } from "zod";
import { generateGravityFormSchema } from "@/lib/forms";

// Generate base schema
const baseSchema = generateGravityFormSchema(fields);

// Extend with custom rules (still structural, not business logic)
const strictSchema = baseSchema.extend({
  // Add any structural validations you need
  // But remember: GF handles required/email format/etc.
});

// Or make it looser for multi-step forms
const looseSchema = baseSchema.partial(); // All fields optional
```

## API

### `generateGravityFormSchema(fields: GravityFormField[])`

Generates a minimal Zod schema from Gravity Forms metadata. The schema:
- Validates field structure (exists, correct type)
- Makes all fields optional (GF handles required validation)
- Handles complex fields (NAME, ADDRESS, CHECKBOX, FILEUPLOAD, LIST)

### `mapGravityFormErrorsToRHF(errorResponse, setError)`

Maps Gravity Forms API errors to React Hook Form's `setError`. Handles:
- `validation_messages`: Field-specific errors
- `errors`: Alternative error format
- Generic error messages

### `extractGravityFormErrorMessage(errorResponse)`

Extracts a user-friendly error message from GF error response. Useful for displaying general submission errors.

### `useGravityForm(options)`

Hook that combines RHF + Zod + GF error mapping. Returns:
- All RHF form methods (`register`, `handleSubmit`, `formState`, etc.)
- `submitError`: General submission error message
- `handleSubmit`: Wrapped submit handler that handles error mapping

## Error Handling

Gravity Forms returns errors in this format:

```json
{
  "is_valid": false,
  "validation_messages": {
    "input_1": "This field is required.",
    "input_2": "Please enter a valid email address."
  },
  "errors": {
    "input_1": "This field is required."
  },
  "error": {
    "code": "validation_failed",
    "message": "Please correct the errors below."
  }
}
```

The error mapper automatically handles all these formats and maps them to RHF's error state.

## Best Practices

1. **Don't duplicate GF validation rules in Zod** - GF is the source of truth
2. **Use Zod for structure only** - "Does this field exist and is it the right type?"
3. **Let GF handle business rules** - Required, email format, conditional logic, anti-spam
4. **Map GF errors back to RHF** - Use `mapGravityFormErrorsToRHF` after submission
5. **Validate on submit, not on change** - Keep the UX smooth, let GF do the heavy validation

## Example: Multi-Step Form

For multi-step forms, you can use different schemas per step:

```tsx
// Step 1: Only validate fields on this step
const step1Schema = generateGravityFormSchema(step1Fields);

// Step 2: Validate all fields so far
const step2Schema = generateGravityFormSchema([...step1Fields, ...step2Fields]);

// Final step: Full validation
const finalSchema = generateGravityFormSchema(allFields);
```

This allows progressive validation while still maintaining structural integrity.

