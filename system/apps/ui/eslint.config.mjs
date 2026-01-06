import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import reactHooks from "eslint-plugin-react-hooks";
import noUseEffect from "eslint-plugin-react-you-might-not-need-an-effect";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      "react-hooks": reactHooks,
      "no-use-effect": noUseEffect,
    },

    rules: {
      /* ---------------------------------
        Hooks & Effect Discipline
      --------------------------------- */

      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Strong signal: effects should be rare
      "no-use-effect/no-empty-effect": "warn",

      /* ---------------------------------
        Native UI First Enforcement
      --------------------------------- */

      // Discourage JS-only UI glue
      "no-restricted-imports": [
        "warn",
        {
          paths: [
            {
              name: "react",
              importNames: ["useEffect"],
              message:
                "useEffect should be rare. Prefer native HTML primitives and modern CSS before JS UI logic.",
            },
          ],
        },
      ],

      // Discourage Radix-by-default behavior
      "no-restricted-syntax": [
        "warn",
        {
          selector: "ImportDeclaration[source.value=/@radix-ui/] Literal",
          message:
            "Radix is an escape hatch. Confirm that native HTML (<dialog>, <details>, Popover API) is insufficient before using Radix components.",
        },
      ],

      /* ---------------------------------
        Imperative Pattern Suppression
      --------------------------------- */

      "no-implied-eval": "error",
      "no-new-func": "error",

      "no-restricted-syntax": [
        "error",
        {
          selector: "ClassDeclaration",
          message:
            "Prefer functional components and pure functions. Avoid class-based UI patterns.",
        },
      ],
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "vendor/**"]),
]);

export default eslintConfig;
