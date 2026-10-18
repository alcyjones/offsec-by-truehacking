import type { Document } from '@scalar/openapi-types/3.2';
import { z } from 'zod';
import * as Cli from './Cli.js';
import type * as Mcp from './Mcp.js';
/** A minimal OpenAPI 3.x spec shape. Accepts both hand-written specs and generated ones (e.g. from `@hono/zod-openapi`). */
export type OpenAPISpec = {
    components?: {
        securitySchemes?: Record<string, SecurityScheme> | undefined;
    } | undefined;
    info?: Record<string, unknown> | undefined;
    openapi?: string | undefined;
    paths?: {} | undefined;
    security?: readonly SecurityRequirement[] | undefined;
};
/** OpenAPI document source accepted by fetch-backed CLI commands. */
export type OpenAPISource = OpenAPISpec | string | URL;
/** Strategy used to name commands generated from OpenAPI operations. */
export type Mode = 'namespace' | 'operation';
/** Configuration for generating commands from an OpenAPI document. */
export type Config = {
    /** Strips `examples`, oversized `pattern` regexes, and regex-deriving date/time formats from generated schemas, shrinking MCP tool listings. Defaults to `false`. */
    compact?: boolean | undefined;
    /** Header names copied from the inbound request onto upstream requests when not explicitly set. */
    forwardHeaders?: string[] | undefined;
    /** Command naming strategy. Defaults to `'operation'`. */
    mode?: Mode | undefined;
    /** Generates credential options from the document's `security` requirements. Defaults to `true`. */
    security?: boolean | undefined;
};
/** Options for generating an OpenAPI document from an incur CLI. */
export type GenerateOptions = {
    /** API description. Defaults to the CLI description. */
    description?: string | undefined;
    /** Server URLs to advertise in the generated document. */
    servers?: {
        url: string;
        description?: string | undefined;
    }[] | undefined;
    /** API title. Defaults to the CLI name. */
    title?: string | undefined;
    /** API version. Defaults to `0.0.0`. */
    version?: string | undefined;
};
/** Generates an OpenAPI 3.2 document from an incur CLI's command tree. */
export declare function fromCli(cli: Cli.Cli, options?: GenerateOptions): Document;
type SecurityRequirement = Record<string, readonly string[]>;
type SecurityScheme = {
    description?: string | undefined;
    in?: 'cookie' | 'header' | 'query' | undefined;
    name?: string | undefined;
    scheme?: string | undefined;
    type?: string | undefined;
};
/** A fetch handler. */
type FetchHandler = (req: Request) => Response | Promise<Response>;
/** A generated command entry compatible with incur's internal CommandEntry. */
type GeneratedCommand = {
    args?: z.ZodObject<any> | undefined;
    description?: string | undefined;
    mcp?: {
        annotations: Mcp.ToolAnnotations;
        description?: string | undefined;
    } | undefined;
    options?: z.ZodObject<any> | undefined;
    run: (context: any) => any;
};
type GeneratedEntry = GeneratedCommand | GeneratedGroup;
type GeneratedGroup = {
    _group: true;
    description?: string | undefined;
    commands: Map<string, GeneratedEntry>;
    root?: GeneratedCommand | undefined;
};
/** Resolves an OpenAPI document from a JSON object or JSON URL. */
export declare function resolve(source: OpenAPISource, options?: resolve.Options): Promise<OpenAPISpec>;
export declare namespace resolve {
    /** Options for resolving an OpenAPI document source. */
    type Options = {
        /** Base URL used to resolve relative OpenAPI document paths. */
        baseUrl?: string | URL | undefined;
    };
}
/** Generates incur command entries from an OpenAPI spec. Resolves all `$ref` pointers. */
export declare function generateCommands(spec: OpenAPISpec, fetch: FetchHandler, options?: generateCommands.Options): Promise<Map<string, GeneratedEntry>>;
export declare namespace generateCommands {
    /** Options for generating incur commands from an OpenAPI spec. */
    type Options = {
        /** Base path prepended to generated request paths. */
        basePath?: string | undefined;
        /** Configuration for generated OpenAPI commands. */
        config?: Config | undefined;
    };
}
/** Converts a JSON Schema object to a Zod schema. */
export declare function toZod(schema: Record<string, unknown>): z.ZodType;
/** Wraps a Zod schema with coercion if the base type is number or boolean (argv is always strings). */
export declare function coerceIfNeeded(schema: z.ZodType): z.ZodType;
export {};
//# sourceMappingURL=Openapi.d.ts.map