import { z } from "zod";

/**
 * Zod schema for validating redirect rules from GraphQL/JSON
 */
export const RedirectRuleSchema = z.object({
  fromPath: z.string().min(1),
  toPath: z.string().min(1),
  statusCode: z.number().int().refine((n) => [301, 302, 307, 308].includes(n), {
    message: "Status code must be 301, 302, 307, or 308",
  }),
  enabled: z.boolean(),
});

export const RedirectRulesSchema = z.array(RedirectRuleSchema);

/**
 * A single redirect rule
 */
export type RedirectRule = z.infer<typeof RedirectRuleSchema>;

/**
 * Result of matching a path against redirect rules
 */
export type MatchResult = {
  matched: true;
  destination: string;
  statusCode: number;
} | {
  matched: false;
};
