import { z } from 'zod';
/**
 * Converts a Zod schema to a JSON Schema object. Strips the `$schema`
 * meta-property. Represents bigints and dates as `{ type: "string" }`
 * since JSON lacks native types for them.
 */
export declare function toJsonSchema(schema: z.ZodType): Record<string, unknown>;
//# sourceMappingURL=Schema.d.ts.map