import type { z } from 'zod';
/** Parses raw argv tokens against Zod schemas for args and options. */
export declare function parse<const args extends z.ZodObject<any> | undefined = undefined, const options extends z.ZodObject<any> | undefined = undefined>(argv: string[], options?: parse.Options<args, options>): parse.ReturnType<args, options>;
export declare namespace parse {
    /** Options for parsing. */
    type Options<args extends z.ZodObject<any> | undefined = undefined, options extends z.ZodObject<any> | undefined = undefined> = {
        /** Zod schema for positional arguments. Keys define order. */
        args?: args;
        /** Config-backed option defaults merged before argv parsing. */
        defaults?: options extends z.ZodObject<any> ? Partial<z.input<options>> | undefined : undefined;
        /** Zod schema for named options/flags. */
        options?: options;
        /** Map of option names to single-char aliases. */
        alias?: Record<string, string> | undefined;
    };
    /** Parsed result with args and options. */
    type ReturnType<args extends z.ZodObject<any> | undefined = undefined, options extends z.ZodObject<any> | undefined = undefined> = {
        /** Parsed positional arguments. */
        args: args extends z.ZodObject<any> ? z.output<args> : {};
        /** Parsed named options. */
        options: options extends z.ZodObject<any> ? z.output<options> : {};
    };
}
/** Wraps zod schema.parse(), converting ZodError to ValidationError. */
export declare function zodParse(schema: z.ZodObject<any>, data: Record<string, unknown>): Record<string, unknown>;
/** Parses environment variables against a Zod schema. Falls back to `process.env` → `Deno.env` when no source is provided. */
export declare function parseEnv<const env extends z.ZodObject<any>>(schema: env, source?: Record<string, string | undefined>): z.output<env>;
/** Parses known global options from argv, passing unknown flags and positionals through to `rest`. */
export declare function parseGlobals<const globals extends z.ZodObject<any>>(argv: string[], schema: globals, alias?: Record<string, string>, options?: parseGlobals.Options): {
    parsed: z.output<globals>;
    rest: string[];
};
export declare namespace parseGlobals {
    /** Options for parsing global flags. */
    type Options = {
        /** Whether to validate parsed globals against the schema. */
        validate?: boolean | undefined;
    };
}
/** Returns the best available env source for the current runtime. */
export declare function defaultEnvSource(): Record<string, string | undefined>;
//# sourceMappingURL=Parser.d.ts.map