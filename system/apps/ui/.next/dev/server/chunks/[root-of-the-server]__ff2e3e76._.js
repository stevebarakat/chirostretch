module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/app/api/gravity-forms/submit/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const dynamic = "force-dynamic";
const runtime = "nodejs";
const GRAPHQL_ENDPOINT = ("TURBOPACK compile-time value", "https://chirostretch-copy.local/graphql");
// Field types that need special value mapping
const EMAIL_FIELD_TYPES = [
    "EMAIL"
];
const CONSENT_FIELD_TYPES = [
    "CONSENT"
];
const CHECKBOX_FIELD_TYPES = [
    "CHECKBOX"
];
const NAME_FIELD_TYPES = [
    "NAME"
];
// Extract numeric field ID from key (handles both numeric IDs and base64 GraphQL IDs)
function extractFieldId(key) {
    // If already numeric
    const numericId = parseInt(key, 10);
    if (!isNaN(numericId)) {
        return numericId;
    }
    // Try to decode base64 GraphQL ID (format: gf_form_field:formId:fieldId)
    try {
        const decoded = Buffer.from(key, "base64").toString("utf-8");
        const parts = decoded.split(":");
        if (parts.length === 3 && parts[0] === "gf_form_field") {
            const fieldId = parseInt(parts[2], 10);
            if (!isNaN(fieldId)) {
                return fieldId;
            }
        }
    } catch  {
    // Not a valid base64 string
    }
    return null;
}
// Transform form data object to GraphQL fieldValues array
function transformFormDataToFieldValues(formData, fieldTypes) {
    return Object.entries(formData).map(([key, value])=>{
        const fieldId = extractFieldId(key);
        if (fieldId === null) return null;
        const fieldType = fieldTypes?.[key]?.toUpperCase();
        // Handle email fields
        if (fieldType && EMAIL_FIELD_TYPES.includes(fieldType)) {
            return {
                id: fieldId,
                emailValues: {
                    value: String(value || "")
                }
            };
        }
        // Handle consent fields - single checkbox with value "1"
        if (fieldType && CONSENT_FIELD_TYPES.includes(fieldType)) {
            const isChecked = value === "1" || value === true;
            return {
                id: fieldId,
                checkboxValues: isChecked ? [
                    {
                        inputId: parseFloat(`${fieldId}.1`),
                        value: "1"
                    }
                ] : []
            };
        }
        // Handle checkbox fields (array of selected values)
        if (fieldType && CHECKBOX_FIELD_TYPES.includes(fieldType)) {
            const valuesArray = Array.isArray(value) ? value : value ? [
                value
            ] : [];
            const checkboxValues = valuesArray.map((v, index)=>({
                    inputId: parseFloat(`${fieldId}.${index + 1}`),
                    value: String(v)
                }));
            return {
                id: fieldId,
                checkboxValues
            };
        }
        // Handle name fields
        if (fieldType && NAME_FIELD_TYPES.includes(fieldType)) {
            // Value could be an object with first/last or a simple string
            if (typeof value === "object" && value !== null) {
                const nameObj = value;
                return {
                    id: fieldId,
                    nameValues: {
                        first: String(nameObj.first || ""),
                        last: String(nameObj.last || ""),
                        middle: nameObj.middle ? String(nameObj.middle) : undefined,
                        prefix: nameObj.prefix ? String(nameObj.prefix) : undefined,
                        suffix: nameObj.suffix ? String(nameObj.suffix) : undefined
                    }
                };
            }
            // Simple string - treat as first name only
            return {
                id: fieldId,
                nameValues: {
                    first: String(value || "")
                }
            };
        }
        // Handle arrays (multi-select, etc.)
        if (Array.isArray(value)) {
            return {
                id: fieldId,
                values: value.map(String)
            };
        }
        // Default: simple value field
        return {
            id: fieldId,
            value: String(value || "")
        };
    }).filter((item)=>item !== null);
}
async function GET() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        message: "Gravity Forms submit endpoint. Use POST to submit forms."
    });
}
async function POST(request) {
    try {
        const body = await request.json();
        const { formId, formData, fieldTypes } = body;
        if (!formId || !formData) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Form ID and form data are required."
            }, {
                status: 400
            });
        }
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // Transform form data to GraphQL fieldValues format
        const fieldValues = transformFormDataToFieldValues(formData, fieldTypes);
        // GraphQL mutation for form submission
        const mutation = `
      mutation SubmitGfForm($id: ID!, $fieldValues: [FormFieldValuesInput]!) {
        submitGfForm(input: { id: $id, fieldValues: $fieldValues }) {
          errors {
            id
            message
          }
          entry {
            ... on GfSubmittedEntry {
              databaseId
            }
          }
          confirmation {
            type
            message
            url
          }
        }
      }
    `;
        const response = await fetch(GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: mutation,
                variables: {
                    id: String(formId),
                    fieldValues
                }
            })
        });
        const result = await response.json();
        // Check for GraphQL errors
        if (result.errors && result.errors.length > 0) {
            console.error("GraphQL errors:", result.errors);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                is_valid: false,
                message: result.errors[0]?.message || "Failed to submit form.",
                errors: result.errors
            }, {
                status: 400
            });
        }
        // Check for form validation errors
        const submitResult = result.data?.submitGfForm;
        if (submitResult?.errors && submitResult.errors.length > 0) {
            // Transform GF GraphQL errors to the format expected by error mapper
            const validationMessages = {};
            for (const error of submitResult.errors){
                if (error.id) {
                    validationMessages[error.id] = error.message;
                }
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                is_valid: false,
                validation_messages: validationMessages,
                message: "Please correct the errors below."
            }, {
                status: 400
            });
        }
        // Success
        const confirmation = submitResult?.confirmation;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Form submitted successfully.",
            confirmation_message: confirmation?.message || "Thank you for your submission!",
            confirmation_type: confirmation?.type,
            confirmation_url: confirmation?.url,
            entry_id: submitResult?.entry?.databaseId
        });
    } catch (error) {
        console.error("Form submission error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: error instanceof Error ? error.message : "An error occurred while submitting the form."
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ff2e3e76._.js.map