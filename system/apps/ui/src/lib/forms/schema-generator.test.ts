import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateGravityFormSchema } from "./schema-generator";
import type { GravityFormField } from "@/lib/graphql/queries/gravity-forms";

// Suppress console.warn in tests
beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("generateGravityFormSchema", () => {
  describe("basic field types", () => {
    it("generates schema for TEXT field", () => {
      const fields: GravityFormField[] = [
        {
          id: "1",
          type: "TEXT",
          inputType: "text",
          label: "Name",
          visibility: "visible",
        },
      ];

      const schema = generateGravityFormSchema(fields);
      const result = schema.safeParse({ "1": "John Doe" });

      expect(result.success).toBe(true);
    });

    it("generates schema for EMAIL field", () => {
      const fields: GravityFormField[] = [
        {
          id: "2",
          type: "EMAIL",
          inputType: "email",
          label: "Email",
          visibility: "visible",
        },
      ];

      const schema = generateGravityFormSchema(fields);
      // Note: Schema only validates structure, not email format
      const result = schema.safeParse({ "2": "test@example.com" });

      expect(result.success).toBe(true);
    });

    it("generates schema for PHONE field", () => {
      const fields: GravityFormField[] = [
        {
          id: "3",
          type: "PHONE",
          inputType: "phone",
          label: "Phone",
          visibility: "visible",
        },
      ];

      const schema = generateGravityFormSchema(fields);
      const result = schema.safeParse({ "3": "555-123-4567" });

      expect(result.success).toBe(true);
    });

    it("generates schema for TEXTAREA field", () => {
      const fields: GravityFormField[] = [
        {
          id: "4",
          type: "TEXTAREA",
          inputType: "textarea",
          label: "Message",
          visibility: "visible",
        },
      ];

      const schema = generateGravityFormSchema(fields);
      const result = schema.safeParse({ "4": "Long message text here..." });

      expect(result.success).toBe(true);
    });

    it("generates schema for SELECT field", () => {
      const fields: GravityFormField[] = [
        {
          id: "5",
          type: "SELECT",
          inputType: "select",
          label: "Option",
          visibility: "visible",
          choices: [
            { text: "Option A", value: "a" },
            { text: "Option B", value: "b" },
          ],
        },
      ];

      const schema = generateGravityFormSchema(fields);
      const result = schema.safeParse({ "5": "a" });

      expect(result.success).toBe(true);
    });
  });

  describe("complex fields with sub-inputs", () => {
    it("generates schema for NAME field with sub-inputs", () => {
      const fields: GravityFormField[] = [
        {
          id: "6",
          type: "NAME",
          inputType: "name",
          label: "Full Name",
          visibility: "visible",
          inputs: [
            {
              id: "6.2",
              key: "first",
              label: "First",
              name: "first",
              isHidden: false,
            },
            {
              id: "6.4",
              key: "middle",
              label: "Middle",
              name: "middle",
              isHidden: true,
            },
            {
              id: "6.6",
              key: "last",
              label: "Last",
              name: "last",
              isHidden: false,
            },
          ],
        },
      ];

      const schema = generateGravityFormSchema(fields);
      const result = schema.safeParse({
        "6": {
          first: "John",
          last: "Doe",
        },
      });

      expect(result.success).toBe(true);
    });

    it("skips hidden sub-inputs", () => {
      const fields: GravityFormField[] = [
        {
          id: "7",
          type: "NAME",
          inputType: "name",
          label: "Name",
          visibility: "visible",
          inputs: [
            { id: "7.2", key: "first", label: "First", name: "first" },
            {
              id: "7.4",
              key: "middle",
              label: "Middle",
              name: "middle",
              isHidden: true,
            },
          ],
        },
      ];

      const schema = generateGravityFormSchema(fields);
      // Should accept object without hidden field
      const result = schema.safeParse({
        "7": { first: "John" },
      });

      expect(result.success).toBe(true);
    });

    it("generates schema for ADDRESS field", () => {
      const fields: GravityFormField[] = [
        {
          id: "8",
          type: "ADDRESS",
          inputType: "address",
          label: "Address",
          visibility: "visible",
          inputs: [
            { id: "8.1", key: "street", label: "Street", name: "street" },
            { id: "8.2", key: "line2", label: "Line 2", name: "line2" },
            { id: "8.3", key: "city", label: "City", name: "city" },
            { id: "8.4", key: "state", label: "State", name: "state" },
            { id: "8.5", key: "zip", label: "ZIP", name: "zip" },
            { id: "8.6", key: "country", label: "Country", name: "country" },
          ],
        },
      ];

      const schema = generateGravityFormSchema(fields);
      const result = schema.safeParse({
        "8": {
          street: "123 Main St",
          city: "Anytown",
          state: "FL",
          zip: "12345",
          country: "US",
        },
      });

      expect(result.success).toBe(true);
    });
  });

  describe("CHECKBOX field", () => {
    it("generates schema for CHECKBOX as array of strings", () => {
      const fields: GravityFormField[] = [
        {
          id: "9",
          type: "CHECKBOX",
          inputType: "checkbox",
          label: "Interests",
          visibility: "visible",
          choices: [
            { text: "Sports", value: "sports" },
            { text: "Music", value: "music" },
          ],
        },
      ];

      const schema = generateGravityFormSchema(fields);
      const result = schema.safeParse({ "9": ["sports", "music"] });

      expect(result.success).toBe(true);
    });

    it("accepts empty array for CHECKBOX", () => {
      const fields: GravityFormField[] = [
        {
          id: "10",
          type: "CHECKBOX",
          inputType: "checkbox",
          label: "Options",
          visibility: "visible",
        },
      ];

      const schema = generateGravityFormSchema(fields);
      const result = schema.safeParse({ "10": [] });

      expect(result.success).toBe(true);
    });
  });

  describe("CONSENT field", () => {
    it("generates schema for CONSENT field", () => {
      const fields: GravityFormField[] = [
        {
          id: "11",
          type: "CONSENT",
          inputType: "consent",
          label: "I agree",
          visibility: "visible",
        },
      ];

      const schema = generateGravityFormSchema(fields);

      // Checked consent
      expect(schema.safeParse({ "11": "1" }).success).toBe(true);

      // Unchecked consent (empty string)
      expect(schema.safeParse({ "11": "" }).success).toBe(true);
    });
  });

  describe("FILE upload fields", () => {
    it("generates schema for FILEUPLOAD field", () => {
      const fields: GravityFormField[] = [
        {
          id: "12",
          type: "FILEUPLOAD",
          inputType: "fileupload",
          label: "Upload",
          visibility: "visible",
        },
      ];

      const schema = generateGravityFormSchema(fields);

      // Array of file objects
      expect(schema.safeParse({ "12": [{ name: "file.pdf" }] }).success).toBe(
        true
      );

      // String (URL)
      expect(schema.safeParse({ "12": "https://example.com/file.pdf" }).success)
        .toBe(true);

      // Array of strings
      expect(schema.safeParse({ "12": ["file1.pdf", "file2.pdf"] }).success).toBe(
        true
      );
    });

    it("generates schema for POST_IMAGE field", () => {
      const fields: GravityFormField[] = [
        {
          id: "13",
          type: "POST_IMAGE",
          inputType: "post_image",
          label: "Image",
          visibility: "visible",
        },
      ];

      const schema = generateGravityFormSchema(fields);
      const result = schema.safeParse({ "13": "https://example.com/image.jpg" });

      expect(result.success).toBe(true);
    });
  });

  describe("LIST field", () => {
    it("generates schema for LIST field as array of arrays", () => {
      const fields: GravityFormField[] = [
        {
          id: "14",
          type: "LIST",
          inputType: "list",
          label: "Items",
          visibility: "visible",
        },
      ];

      const schema = generateGravityFormSchema(fields);
      const result = schema.safeParse({
        "14": [
          ["row1col1", "row1col2"],
          ["row2col1", "row2col2"],
        ],
      });

      expect(result.success).toBe(true);
    });
  });

  describe("PAGE field", () => {
    it("skips PAGE fields (UI only)", () => {
      const fields: GravityFormField[] = [
        {
          id: "15",
          type: "PAGE",
          inputType: "page",
          label: "Page Break",
          visibility: "visible",
        },
        {
          id: "16",
          type: "TEXT",
          inputType: "text",
          label: "Name",
          visibility: "visible",
        },
      ];

      const schema = generateGravityFormSchema(fields);

      // Should not include PAGE field, only TEXT field
      const result = schema.safeParse({ "16": "John" });
      expect(result.success).toBe(true);

      // PAGE field should not be required
      const resultWithoutPage = schema.safeParse({});
      expect(resultWithoutPage.success).toBe(true);
    });
  });

  describe("field ID handling", () => {
    it("uses id as field name", () => {
      const fields: GravityFormField[] = [
        {
          id: "42",
          type: "TEXT",
          inputType: "text",
          label: "Name",
          visibility: "visible",
        },
      ];

      const schema = generateGravityFormSchema(fields);
      const result = schema.safeParse({ "42": "value" });

      expect(result.success).toBe(true);
    });

    it("falls back to databaseId when id is missing", () => {
      const fields: GravityFormField[] = [
        {
          id: "",
          databaseId: 99,
          type: "TEXT",
          inputType: "text",
          label: "Name",
          visibility: "visible",
        },
      ];

      const schema = generateGravityFormSchema(fields);
      const result = schema.safeParse({ "99": "value" });

      expect(result.success).toBe(true);
    });

    it("skips fields without valid ID", () => {
      const fields: GravityFormField[] = [
        {
          id: "",
          type: "TEXT",
          inputType: "text",
          label: "Name",
          visibility: "visible",
        },
      ];

      const schema = generateGravityFormSchema(fields);
      // Should accept empty object since field was skipped
      const result = schema.safeParse({});

      expect(result.success).toBe(true);
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe("optional fields", () => {
    it("all fields are optional (GF handles required validation)", () => {
      const fields: GravityFormField[] = [
        {
          id: "1",
          type: "TEXT",
          inputType: "text",
          label: "Required Name",
          isRequired: true,
          visibility: "visible",
        },
        {
          id: "2",
          type: "EMAIL",
          inputType: "email",
          label: "Email",
          visibility: "visible",
        },
      ];

      const schema = generateGravityFormSchema(fields);

      // Empty object should pass (schema is structural only)
      const result = schema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts undefined values for optional fields", () => {
      const fields: GravityFormField[] = [
        {
          id: "1",
          type: "TEXT",
          inputType: "text",
          label: "Name",
          visibility: "visible",
        },
      ];

      const schema = generateGravityFormSchema(fields);
      const result = schema.safeParse({ "1": undefined });

      expect(result.success).toBe(true);
    });
  });

  describe("empty fields array", () => {
    it("returns schema that accepts empty object", () => {
      const schema = generateGravityFormSchema([]);
      const result = schema.safeParse({});

      expect(result.success).toBe(true);
    });
  });

  describe("case-insensitive type matching", () => {
    it("handles lowercase field types", () => {
      const fields: GravityFormField[] = [
        {
          id: "1",
          type: "checkbox",
          inputType: "checkbox",
          label: "Options",
          visibility: "visible",
        },
      ];

      const schema = generateGravityFormSchema(fields);
      const result = schema.safeParse({ "1": ["option1"] });

      expect(result.success).toBe(true);
    });

    it("handles mixed case field types", () => {
      const fields: GravityFormField[] = [
        {
          id: "1",
          type: "Checkbox",
          inputType: "Checkbox",
          label: "Options",
          visibility: "visible",
        },
      ];

      const schema = generateGravityFormSchema(fields);
      const result = schema.safeParse({ "1": ["option1"] });

      expect(result.success).toBe(true);
    });
  });
});
