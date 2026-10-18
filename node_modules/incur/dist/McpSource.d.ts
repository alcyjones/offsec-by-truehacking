import { z } from 'zod';
import type * as Fetch from './Fetch.js';
import type * as Mcp from './Mcp.js';
/** A remote MCP streamable-HTTP server source. */
export type Source = string | URL | {
    /** Streamable-HTTP MCP endpoint URL. */
    url: string | URL;
    /** Headers merged into every MCP request. */
    headers?: HeadersInit | undefined;
    /** Fetch handler used for MCP requests. Defaults to `globalThis.fetch`. */
    fetch?: Fetch.Handler | undefined;
};
/** A resolved remote MCP server. */
export type Resolved = {
    /** Tool discovery strategy exposed by the remote server. */
    discovery?: 'direct' | 'progressive' | undefined;
    /** Tools returned by `tools/list`. */
    tools: Tool[];
    /** Session state reused for later MCP calls. */
    session: Session;
};
/** Remote MCP session state. */
export type Session = {
    /** Fetch handler used for MCP requests. */
    fetch: Fetch.Handler;
    /** Headers merged into every MCP request. */
    headers?: HeadersInit | undefined;
    /** Last captured MCP session ID. */
    id?: string | undefined;
    /** Whether the server completed initialization. */
    initialized?: boolean | undefined;
    /** Streamable-HTTP MCP endpoint URL. */
    url: URL;
};
/** Remote MCP tool metadata. */
export type Tool = {
    /** Tool name. */
    name: string;
    /** Tool description. */
    description?: string | undefined;
    /** JSON Schema for tool input. */
    inputSchema?: Record<string, unknown> | undefined;
    /** JSON Schema for tool output. */
    outputSchema?: Record<string, unknown> | undefined;
    /** Behavioral hints advertised by the remote tool. */
    annotations?: Mcp.ToolAnnotations | undefined;
};
/** Resolves a remote MCP server by initializing it and listing its tools. */
export declare function resolve(source: Source, options?: resolve.Options): Promise<Resolved>;
/** Options for resolving a remote MCP server. */
export declare namespace resolve {
    /** Remote MCP resolve options. */
    type Options = {
        /** Client version reported during MCP initialization. */
        version?: string | undefined;
    };
}
/** Generates incur command entries from remote MCP tools. */
export declare function generateCommands(resolved: Resolved): Map<string, GeneratedEntry>;
/** Generated command entry for a remote MCP tool. */
export type GeneratedEntry = {
    /** Command description. */
    description?: string | undefined;
    /** Options schema generated from the MCP tool input schema. */
    options?: z.ZodObject<any> | undefined;
    /** Output schema generated from the MCP tool output schema. */
    output?: z.ZodType | undefined;
    /** MCP annotations preserved from the remote tool. */
    mcp?: {
        annotations: Mcp.ToolAnnotations;
    } | undefined;
    /** Proxies a command invocation to `tools/call`. */
    run(context: any): Promise<unknown>;
};
//# sourceMappingURL=McpSource.d.ts.map