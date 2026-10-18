/** Structured input parsed from curl-style argv. */
export type FetchInput = {
    body: string | undefined;
    headers: Headers;
    method: string;
    path: string;
    query: URLSearchParams;
};
/** Structured output from a fetch Response. */
export type FetchOutput = {
    data: unknown;
    headers: Headers;
    ok: boolean;
    status: number;
};
/** A standard Fetch API handler. */
export type Handler = (req: Request) => Response | Promise<Response>;
/** Fetch source accepted by fetch-backed CLI commands. */
export type Source = Handler | RequestSource;
/** Hosted request source created from a base URL. */
export type RequestSource = {
    /** Handles a forwarded request. */
    fetch: Handler;
    /** Base URL used to resolve relative OpenAPI documents. */
    url: URL;
};
/** Creates a hosted fetch source from a base request URL and shared request options. */
export declare function fromRequest(url: string | URL, options?: fromRequest.Options): RequestSource;
export declare namespace fromRequest {
    /** Request options applied to every forwarded request. */
    type Options = Omit<RequestInit, 'body' | 'headers' | 'method'> & {
        /** Headers merged into every forwarded request. Per-request headers take precedence. */
        headers?: HeadersInit | undefined;
    };
}
/** Parses curl-style argv into a structured fetch input. */
export declare function parseArgv(argv: string[]): FetchInput;
/** Constructs a standard Request from a FetchInput. */
export declare function buildRequest(input: FetchInput): Request;
/** Returns true if the response body is a stream that should be consumed incrementally. */
export declare function isStreamingResponse(response: Response): boolean;
/** Parses a streaming response body as an async generator of parsed NDJSON chunks. */
export declare function parseStreamingResponse(response: Response): AsyncGenerator<unknown, void, unknown>;
/** Parses a fetch Response into structured output. */
export declare function parseResponse(response: Response): Promise<FetchOutput>;
/**
 * Extracts an error code and message from a failed fetch output. Reads a top-level `message`
 * or a nested `{ error: { code, message } }` envelope, falling back to the HTTP status.
 */
export declare function parseError(output: FetchOutput): parseError.ReturnType;
export declare namespace parseError {
    /** Error code and message extracted from a failed response. */
    type ReturnType = {
        /** Upstream `error.code` when it is a string, otherwise `HTTP_<status>`. */
        code: string;
        /** Human-readable error message. */
        message: string;
    };
}
//# sourceMappingURL=Fetch.d.ts.map