"use client";

import { useEffect } from "react";

export function FormDebugInterceptor() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const originalFetch = window.fetch;

    // @ts-ignore
    window.fetch = async function (...args) {
      const [url, options] = args;

      // Check if this is a GraphQL request
      if (url && typeof url === "string" && url.includes("/graphql")) {
        try {
          const body = options?.body;
          if (body) {
            let parsedBody;
            if (typeof body === "string") {
              try {
                parsedBody = JSON.parse(body);
              } catch (e) {
                // Not JSON, skip
              }
            }

            // Check if it's a form submission mutation
            if (parsedBody?.query?.includes("submitGfForm")) {
              console.log("🔍 INTERCEPTED GRAVITY FORM SUBMISSION");
              console.log("═══════════════════════════════════");
              console.log(
                "📋 Full Mutation:",
                JSON.stringify(parsedBody, null, 2)
              );

              // Log each field value in detail
              if (parsedBody.variables?.fieldValues) {
                console.log("\n📊 FIELD VALUES BREAKDOWN:");
                console.log("═══════════════════════════════════");
                parsedBody.variables.fieldValues.forEach(
                  (field: any, index: number) => {
                    console.log(`\n📝 Field ${index + 1} (ID: ${field.id}):`);
                    console.log("  All keys:", Object.keys(field));
                    console.log("  Full data:", JSON.stringify(field, null, 2));

                    // Highlight potential issues
                    Object.keys(field).forEach((key) => {
                      const value = field[key];
                      if (
                        key !== "id" &&
                        typeof value === "string" &&
                        (key.includes("Values") || key.includes("value"))
                      ) {
                        console.warn(
                          `  ⚠️  ${key} is a STRING (might need to be array):`,
                          value
                        );
                      }
                      if (Array.isArray(value)) {
                        console.log(
                          `  ✓ ${key} is an array (length: ${value.length})`
                        );
                      }
                    });
                  }
                );
                console.log("\n═══════════════════════════════════\n");
              }
            }
          }
        } catch (e) {
          console.error("Error in fetch interceptor:", e);
        }
      }

      return originalFetch.apply(this, args);
    };

    console.log("✅ Form submission debugger installed");

    return () => {
      // @ts-ignore
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
