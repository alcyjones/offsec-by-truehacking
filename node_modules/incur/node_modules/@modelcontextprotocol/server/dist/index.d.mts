import { $ as RequestOptions, $a as OAuthClientMetadata, $i as Task, $n as InputRequiredResult, $r as ProgressNotification, $t as CallToolResult, A as ResourceMetadata, Aa as LATEST_PROTOCOL_VERSION, Ai as Role, An as ElicitationCompleteNotification, Ar as LoggingLevel, At as InputResponseView, B as deserializeMessage, Ba as checkResourceAllowed, Bi as SetLevelRequest, Bn as GetTaskRequest, Br as MultiSelectEnumSchema, Bt as InboundLegacyRoute, C as PromptCallback, Ca as CLIENT_CAPABILITIES_META_KEY, Ci as ResourceRequestParams, Cn as DiscoverRequest, Cr as ListResourcesResult, Ct as MissingRequiredClientCapabilityError, D as RegisteredResource, Da as INVALID_PARAMS, Di as ResourceUpdatedNotificationParams, Dn as ElicitRequestParams, Dr as ListTasksResult, Dt as UrlElicitationRequiredError, E as RegisteredPrompt, Ea as INTERNAL_ERROR, Ei as ResourceUpdatedNotification, En as ElicitRequestFormParams, Er as ListTasksRequest, Et as UnsupportedProtocolVersionError, F as InMemoryTransport, Fa as RELATED_TASK_META_KEY, Fi as SamplingMessageContentBlock, Fn as GetPromptRequest, Fr as MetaObject, Ft as StandardSchemaV1Sync, G as getDisplayName, Ga as SdkHttpErrorData, Gi as SubscribeRequestParams, Gn as ImageContent, Gr as NumberSchema, Gt as Annotations, H as CacheHint, Ha as SdkError, Hi as SingleSelectEnumSchema, Hn as HandlerResultTypeMap, Hr as NotificationMethod, Ht as InboundModernRoute, I as UriTemplate, Ia as SUBSCRIPTION_ID_META_KEY, Ii as ServerCapabilities, In as GetPromptRequestParams, Ir as MethodNotFoundError, It as StandardSchemaWithJSON, J as DEFAULT_REQUEST_TIMEOUT_MSEC, Ja as AuthorizationServerMetadata, Ji as SubscriptionsAcknowledgedNotificationParams, Jn as InitializeRequestParams, Jr as PaginatedResult, Jt as BaseMetadata, K as BaseContext, Ka as OAuthError, Ki as SubscriptionFilter, Kn as Implementation, Kr as PaginatedRequest, Kt as AudioContent, L as Variables, La as SUPPORTED_PROTOCOL_VERSIONS, Li as ServerNotification, Ln as GetPromptResult, Lr as MissingRequiredClientCapabilityErrorData, Lt as InboundClassificationOutcome, M as ToolCallback, Ma as METHOD_NOT_FOUND, Mi as RootsListChangedNotification, Mn as EmbeddedResource, Mr as LoggingMessageNotificationParams, Mt as inputRequired, N as Server, Na as PARSE_ERROR, Ni as SamplingContent, Nn as EmptyResult, Nr as MessageClassification, Nt as inputResponse, O as RegisteredResourceTemplate, Oa as INVALID_REQUEST, Oi as Result, On as ElicitRequestURLParams, Or as ListToolsRequest, Ot as ProtocolErrorCode, P as ServerOptions, Pa as PROTOCOL_VERSION_META_KEY, Pi as SamplingMessage, Pn as EnumSchema, Pr as MessageExtraInfo, Pt as StandardSchemaV1, Q as RequestHandlerSchemas, Qa as OAuthClientInformationMixed, Qi as SubscriptionsListenResultMeta, Qn as InputRequests, Qr as Progress, Qt as CallToolRequestParams, R as ReadBuffer, Ra as TRACEPARENT_META_KEY, Ri as ServerRequest, Rn as GetTaskPayloadRequest, Rr as ModelHint, Rt as InboundHttpRequest, S as McpServer, Sa as BAGGAGE_META_KEY, Si as ResourceListChangedNotification, Sn as Cursor, Sr as ListResourcesRequest, St as parseJSONRPCMessage, T as ReadResourceTemplateCallback, Ta as DEFAULT_NEGOTIATED_PROTOCOL_VERSION, Ti as ResourceTemplateType, Tn as ElicitRequest, Tr as ListRootsResult, Tt as ResourceNotFoundError, U as CacheScope, Ua as SdkErrorCode, Ui as StringSchema, Un as Icon, Ur as NotificationParams, Ut as InboundValidationRung, V as serializeMessage, Va as resourceUrlFromServerUrl, Vi as SetLevelRequestParams, Vn as GetTaskResult, Vr as Notification, Vt as InboundLegacyRouteReason, W as ProtocolEra, Wa as SdkHttpError, Wi as SubscribeRequest, Wn as Icons, Wr as NotificationTypeMap, Wt as classifyInboundRequest, X as ProgressCallback, Xa as OAuthClientInformation, Xi as SubscriptionsListenRequestParams, Xn as InitializedNotification, Xr as PingRequest, Xt as BooleanSchema, Y as NotificationOptions, Ya as IdJagTokenExchangeResponse, Yi as SubscriptionsListenRequest, Yn as InitializeResult, Yr as ParseError, Yt as BlobResourceContents, Z as ProtocolOptions, Za as OAuthClientInformationFull, Zi as SubscriptionsListenResult, Zn as InputRequest, Zr as PrimitiveSchemaDefinition, Zt as CallToolRequest, _ as PerRequestResponseMode, _a as UnsubscribeRequest, _i as RequestParams, _n as CreateMessageRequestParamsBase, _r as ListChangedOptions, _t as isJSONRPCNotification, a as McpRequestContext, aa as TaskStatusNotificationParams, ai as PromptMessage, an as ClientNotification, ao as OAuthTokens, ar as JSONArray, at as createFetchWithInit, b as CompleteResourceTemplateCallback, ba as UntitledMultiSelectEnumSchema, bi as ResourceContents, bn as CreateMessageResultWithTools, br as ListResourceTemplatesRequest, bt as isJSONRPCResultResponse, c as isLegacyRequest, ca as TitledMultiSelectEnumSchema, ci as ReadResourceRequestParams, cn as CompatibilityCallToolResult, co as StoredOAuthClientInformation, cr as JSONRPCMessage, ct as isSpecType, d as ServerEvent, da as ToolAnnotations, di as Request$1, dn as CompleteRequestPrompt, dr as JSONRPCResponse, dt as assertCompleteRequestResourceTemplate, ea as TaskAugmentedRequestParams, ei as ProgressNotificationParams, en as CancelTaskRequest, eo as OAuthClientRegistrationError, er as InputResponse, et as RequestStateAccessor, f as ServerEventBus, fa as ToolChoice, fi as RequestId, fn as CompleteRequestResourceTemplate, fr as JSONRPCResultResponse, ft as isCallToolResult, g as PerRequestMessageExtra, ga as ToolUseContent, gi as RequestMethod, gn as CreateMessageRequestParams, gr as ListChangedHandlers, gt as isJSONRPCErrorResponse, h as PerRequestHTTPServerTransportOptions, ha as ToolResultContent, hi as RequestMetaObject, hn as CreateMessageRequest, hr as ListChangedCallback, ht as isInputRequiredResult, i as McpHttpHandler, ia as TaskStatusNotification, ii as PromptListChangedNotification, in as ClientCapabilities, io as OAuthTokenRevocationRequest, ir as InvalidRequestError, it as TransportSendOptions, j as ResourceTemplate, ja as LOG_LEVEL_META_KEY, ji as Root, jn as ElicitationCompleteNotificationParams, jr as LoggingMessageNotification, jt as acceptedContent, k as RegisteredTool, ka as JSONRPC_VERSION, ki as ResultTypeMap, kn as ElicitResult, kr as ListToolsResult, kt as InputRequiredSpec, l as legacyStatelessFallback, la as TitledSingleSelectEnumSchema, li as ReadResourceResult, ln as CompleteRequest, lo as StoredOAuthTokens, lr as JSONRPCNotification, lt as specTypeSchemas, m as PerRequestHTTPServerTransport, ma as ToolListChangedNotification, mi as RequestMetaEnvelope, mn as ContentBlock, mr as LegacyTitledEnumSchema, mt as isInitializedNotification, n as LegacyHttpHandler, na as TaskMetadata, ni as Prompt, nn as CancelledNotification, no as OAuthMetadata, nr as InternalError, nt as FetchLike, o as McpServerFactory, oa as TextContent, oi as PromptReference, on as ClientRequest, oo as OpenIdProviderDiscoveryMetadata, or as JSONObject, ot as SpecTypeName, p as ServerNotifier, pa as ToolExecution, pi as RequestMeta, pn as CompleteResult, pr as JSONValue, pt as isInitializeRequest, q as ClientContext, qa as OAuthErrorCode, qi as SubscriptionsAcknowledgedNotification, qn as InitializeRequest, qr as PaginatedRequestParams, qt as AuthInfo, r as McpHandlerRequestOptions, ra as TaskStatus, ri as PromptArgument, rn as CancelledNotificationParams, ro as OAuthProtectedResourceMetadata, rr as InvalidParamsError, rt as Transport, s as createMcpHandler, sa as TextResourceContents, si as ReadResourceRequest, sn as ClientResult, so as OpenIdProviderMetadata, sr as JSONRPCErrorResponse, st as SpecTypes, t as CreateMcpHandlerOptions, ta as TaskCreationParams, ti as ProgressToken, tn as CancelTaskResult, to as OAuthErrorResponse, tr as InputResponses, tt as ServerContext, u as InMemoryServerEventBus, ua as Tool, ui as RelatedTaskMetadata, un as CompleteRequestParams, ur as JSONRPCRequest, ut as assertCompleteRequestPrompt, v as AnyToolHandler, va as UnsubscribeRequestParams, vi as RequestTypeMap, vn as CreateMessageRequestParamsWithTools, vr as ListPromptsRequest, vt as isJSONRPCRequest, w as ReadResourceCallback, wa as CLIENT_INFO_META_KEY, wi as ResourceTemplateReference, wn as DiscoverResult, wr as ListRootsRequest, wt as ProtocolError, x as ListResourcesCallback, xa as UntitledSingleSelectEnumSchema, xi as ResourceLink, xn as CreateTaskResult, xr as ListResourceTemplatesResult, xt as isTaskAugmentedRequestParams, y as BaseToolCallback, ya as UnsupportedProtocolVersionErrorData, yi as Resource, yn as CreateMessageResult, yr as ListPromptsResult, yt as isJSONRPCResponse, z as STDIO_DEFAULT_MAX_BUFFER_SIZE, za as TRACESTATE_META_KEY, zi as ServerResult, zn as GetTaskPayloadResult, zr as ModelPreferences, zt as InboundLadderRejection } from "./createMcpHandler-Du3hjXvf.mjs";
import { t as AjvJsonSchemaValidator } from "./ajvProvider-Dzgk80kq.mjs";
import { i as jsonSchemaValidator, n as JsonSchemaValidator, r as JsonSchemaValidatorResult, t as JsonSchemaType } from "./types-DBYdVs-n.mjs";
import { n as CfWorkerSchemaDraft, t as CfWorkerJsonSchemaValidator } from "./cfWorkerProvider-DmvjVsvQ.mjs";

//#region src/server/completable.d.ts
declare const COMPLETABLE_SYMBOL: unique symbol;
type CompleteCallback<T extends StandardSchemaV1 = StandardSchemaV1> = (value: StandardSchemaV1.InferInput<T>, context?: {
  arguments?: Record<string, string>;
}) => StandardSchemaV1.InferInput<T>[] | Promise<StandardSchemaV1.InferInput<T>[]>;
type CompletableMeta<T extends StandardSchemaV1 = StandardSchemaV1> = {
  complete: CompleteCallback<T>;
};
type CompletableSchema<T extends StandardSchemaV1> = T & {
  [COMPLETABLE_SYMBOL]: CompletableMeta<T>;
};
/**
 * Wraps a schema to provide autocompletion capabilities. Useful for, e.g., prompt arguments in MCP.
 *
 * @example
 * ```ts source="./completable.examples.ts#completable_basicUsage"
 * server.registerPrompt(
 *     'review-code',
 *     {
 *         title: 'Code Review',
 *         argsSchema: z.object({
 *             language: completable(z.string().describe('Programming language'), value =>
 *                 ['typescript', 'javascript', 'python', 'rust', 'go'].filter(lang => lang.startsWith(value))
 *             )
 *         })
 *     },
 *     ({ language }) => ({
 *         messages: [
 *             {
 *                 role: 'user' as const,
 *                 content: {
 *                     type: 'text' as const,
 *                     text: `Review this ${language} code.`
 *                 }
 *             }
 *         ]
 *     })
 * );
 * ```
 *
 * @see {@linkcode server/mcp.McpServer.registerPrompt | McpServer.registerPrompt} for using completable schemas in prompt argument definitions
 */
declare function completable<T extends StandardSchemaV1>(schema: T, complete: CompleteCallback<T>): CompletableSchema<T>;
/**
 * Checks if a schema is completable (has completion metadata).
 */
declare function isCompletable(schema: unknown): schema is CompletableSchema<StandardSchemaV1>;
//#endregion
//#region src/server/middleware/hostHeaderValidation.d.ts
type HostHeaderValidationResult = {
  ok: true;
  hostname: string;
} | {
  ok: false;
  errorCode: 'missing_host' | 'invalid_host_header' | 'invalid_host';
  message: string;
  hostHeader?: string;
  hostname?: string;
};
/**
 * Parse and validate a `Host` header against an allowlist of hostnames (port-agnostic).
 *
 * - Input host header may include a port (e.g. `localhost:3000`) or IPv6 brackets (e.g. `[::1]:3000`).
 * - Allowlist items should be hostnames only (no ports). For IPv6, include brackets (e.g. `[::1]`).
 */
declare function validateHostHeader(hostHeader: string | null | undefined, allowedHostnames: string[]): HostHeaderValidationResult;
/**
 * Convenience allowlist for `localhost` DNS rebinding protection.
 */
declare function localhostAllowedHostnames(): string[];
/**
 * Web-standard `Request` helper for DNS rebinding protection.
 * @example
 * ```ts source="./hostHeaderValidation.examples.ts#hostHeaderValidationResponse_basicUsage"
 * const result = validateHostHeader(req.headers.get('host'), ['localhost']);
 * ```
 */
declare function hostHeaderValidationResponse(req: Request, allowedHostnames: string[]): Response | undefined;
//#endregion
//#region src/server/middleware/originValidation.d.ts
/**
 * Framework-agnostic Origin header validation helpers.
 *
 * Browsers attach an `Origin` header to cross-origin requests; validating it
 * against an allowlist (alongside Host header validation) protects local and
 * development MCP servers against DNS rebinding and cross-site request
 * forgery. The framework middleware packages (`@modelcontextprotocol/express`,
 * `@modelcontextprotocol/hono`, `@modelcontextprotocol/fastify`,
 * `@modelcontextprotocol/node`) wrap these helpers; use them directly when
 * mounting a handler bare on a fetch-native runtime.
 *
 * Validation is deny-on-failure: a present `Origin` value that cannot be
 * parsed (including the opaque `null` origin) is rejected, never passed
 * through. Requests without an `Origin` header pass — non-browser MCP clients
 * do not send one.
 */
type OriginValidationResult = {
  ok: true;
  origin?: string;
  hostname?: string;
} | {
  ok: false;
  errorCode: 'invalid_origin_header' | 'invalid_origin';
  message: string;
  originHeader?: string;
  hostname?: string;
};
/**
 * Validate an `Origin` header against an allowlist of hostnames (port-agnostic).
 *
 * - A missing/empty `Origin` header passes: non-browser clients do not send one,
 *   and only browser-originated requests carry the header this check defends against.
 * - Allowlist items are hostnames only (no scheme, no port), the same convention as
 *   `validateHostHeader`. For IPv6, include brackets (e.g. `[::1]`).
 * - Any present value that cannot be parsed as an origin URL — including the literal
 *   `null` origin browsers send for opaque contexts — is rejected (deny on failure).
 */
declare function validateOriginHeader(originHeader: string | null | undefined, allowedOriginHostnames: string[]): OriginValidationResult;
/**
 * Convenience allowlist of localhost-class origin hostnames, mirroring
 * `localhostAllowedHostnames`.
 */
declare function localhostAllowedOrigins(): string[];
/**
 * Web-standard `Request` helper for Origin validation: returns a `403` JSON-RPC
 * error response when the request's `Origin` header is not allowed, and
 * `undefined` when the request may proceed.
 *
 * ```ts
 * const rejected = originValidationResponse(request, localhostAllowedOrigins());
 * if (rejected) return rejected;
 * ```
 */
declare function originValidationResponse(req: Request, allowedOriginHostnames: string[]): Response | undefined;
//#endregion
//#region src/server/requestStateCodec.d.ts
/**
 * Options for {@linkcode createRequestStateCodec}.
 */
interface RequestStateCodecOptions {
  /**
   * The HMAC secret. A `string` value is UTF-8-encoded. MUST be at least
   * 32 bytes (256 bits) long; a `RangeError` is thrown at
   * construction otherwise. The same key must be available to every server
   * instance that may receive an echoed `requestState` (so a per-process
   * random key only works when one process serves every round of a flow).
   */
  key: Uint8Array | string;
  /**
   * How long a minted `requestState` stays valid, in seconds. An echoed
   * value past its expiry is rejected by {@linkcode RequestStateCodec.verify}.
   * Defaults to `600` (ten minutes).
   */
  ttlSeconds?: number;
  /**
   * Optional context binding. Called at mint time and again at verify time;
   * a `requestState` minted under one binding value is rejected when echoed
   * under a different one. Use this to bind state to the authenticated
   * principal and/or the originating method (the spec's user-binding MUST
   * for state that influences authorization), for example:
   *
   * ```ts
   * bind: ctx => `${ctx.mcpReq.method}\0${ctx.http?.authInfo?.clientId ?? ''}`
   * ```
   *
   * The returned value is stored in the envelope as a domain-separated HMAC
   * tag (keyed by the codec's `key`), not the raw string — so a principal
   * identifier in the binding does not appear in the wire value the client
   * holds.
   *
   * When configured, {@linkcode RequestStateCodec.mint} requires its `ctx`
   * argument.
   */
  bind?: (ctx: ServerContext) => string;
}
/**
 * The codec returned by {@linkcode createRequestStateCodec}: `mint` seals a
 * JSON-serializable payload into the wire string a handler returns from
 * `inputRequired({ requestState })`; `verify` is the function to drop into
 * {@linkcode server/server.ServerOptions | ServerOptions}`.requestState.verify`
 * (it throws on any failure, which the seam answers as the frozen `-32602`).
 * The decoded payload `verify` resolves with is handed to the handler by the
 * seam via the typed `ctx.mcpReq.requestState<T>()` accessor — `mint<T>` and
 * `requestState<T>()` are the typed encode/read pair.
 */
interface RequestStateCodec<T = unknown> {
  /**
   * Seal `payload` into an opaque wire string. The result is what the
   * handler returns from `inputRequired({ requestState })`.
   *
   * @param ctx The handler's context. Required when the codec was created
   *            with a {@linkcode RequestStateCodecOptions.bind | bind}
   *            callback; ignored otherwise.
   */
  mint(payload: T, ctx?: ServerContext): Promise<string>;
  /**
   * Verify an echoed `requestState` and return the original payload. Throws
   * on any failure (bad MAC, expired, bind mismatch, malformed). The thrown
   * message is a fixed opaque reason code (`'malformed'` / `'mac'` /
   * `'expired'` / `'bind'`) — never the decoded payload, the binding value,
   * or any other context-derived field.
   *
   * Pass this directly as `ServerOptions.requestState.verify`.
   */
  verify(state: string, ctx: ServerContext): Promise<T>;
}
/**
 * Create an opt-in HMAC-SHA256 codec for the multi-round-trip `requestState`
 * (protocol revision 2026-07-28).
 *
 * `requestState` round-trips through the client and is attacker-controlled
 * input on re-entry. The SDK applies no protection of its own; this helper is
 * the convenience implementation of the spec's integrity MUST so authors don't
 * hand-roll HMAC. Wire shape:
 *
 *     "v1." b64url({"p":<payload>,"exp":<unixSeconds>,"b":<bindTag>?}) "." b64url(mac)
 *
 * where `bindTag` is `b64url(HMAC(key, "mcp.requestState.bind:" + bind(ctx))[:16])`
 * — the binding value is never embedded raw.
 *
 * The codec is **signed, not encrypted**: the body is integrity-protected but
 * the client can base64url-decode it and read the payload (`p`) in clear. Do
 * not put secrets in the payload; use an AEAD construction if confidentiality
 * is required. The handler reads its payload back via the typed
 * `ctx.mcpReq.requestState<T>()` accessor — the seam has already run `verify`
 * (integrity proven, payload decoded) by the time the handler is entered.
 *
 * Verification is fail-closed and constant-time (WebCrypto `subtle.verify` for
 * the body MAC; a fixed-length XOR-accumulator compare for the bind tag).
 * See `examples/mrtr/server.ts` for a worked end-to-end example.
 *
 * Design comparison (mcp.d `secureRequestState`, the peer SDK's reference
 * implementation): mcp.d additionally offers an AES-256-GCM encrypted mode and
 * derives independent cipher / bind-HMAC sub-keys from the operator secret via
 * HKDF-SHA256, with an auto-generated per-process ephemeral key when none is
 * supplied. This codec deliberately ships only the signed mode and a single
 * keyed HMAC (domain-separated by input prefix) — HKDF sub-key derivation and
 * an encrypted mode are intentionally out of scope for the initial release.
 */
declare function createRequestStateCodec<T = unknown>(options: RequestStateCodecOptions): RequestStateCodec<T>;
//#endregion
//#region src/server/streamableHttp.d.ts
type StreamId = string;
type EventId = string;
/**
 * Interface for resumability support via event storage
 */
interface EventStore {
  /**
   * Stores an event for later retrieval
   * @param streamId ID of the stream the event belongs to
   * @param message The JSON-RPC message to store
   * @returns The generated event ID for the stored event
   */
  storeEvent(streamId: StreamId, message: JSONRPCMessage): Promise<EventId>;
  /**
   * Get the stream ID associated with a given event ID.
   * @param eventId The event ID to look up
   * @returns The stream ID, or `undefined` if not found
   *
   * Optional: If not provided, the SDK will use the `streamId` returned by
   * {@linkcode replayEventsAfter} for stream mapping.
   */
  getStreamIdForEventId?(eventId: EventId): Promise<StreamId | undefined>;
  replayEventsAfter(lastEventId: EventId, {
    send
  }: {
    send: (eventId: EventId, message: JSONRPCMessage) => Promise<void>;
  }): Promise<StreamId>;
}
/**
 * Configuration options for {@linkcode WebStandardStreamableHTTPServerTransport}
 */
interface WebStandardStreamableHTTPServerTransportOptions {
  /**
   * Function that generates a session ID for the transport.
   * The session ID SHOULD be globally unique and cryptographically secure (e.g., a securely generated UUID, a JWT, or a cryptographic hash)
   *
   * If not provided, session management is disabled (stateless mode).
   */
  sessionIdGenerator?: (() => string) | undefined;
  /**
   * A callback for session initialization events
   * This is called when the server initializes a new session.
   * Useful in cases when you need to register multiple mcp sessions
   * and need to keep track of them.
   * @param sessionId The generated session ID
   */
  onsessioninitialized?: ((sessionId: string) => void | Promise<void>) | undefined;
  /**
   * A callback for session close events
   * This is called when the server closes a session due to a `DELETE` request.
   * Useful in cases when you need to clean up resources associated with the session.
   * Note that this is different from the transport closing, if you are handling
   * HTTP requests from multiple nodes you might want to close each
   * {@linkcode WebStandardStreamableHTTPServerTransport} after a request is completed while still keeping the
   * session open/running.
   * @param sessionId The session ID that was closed
   */
  onsessionclosed?: ((sessionId: string) => void | Promise<void>) | undefined;
  /**
   * If `true`, the server will return JSON responses instead of starting an SSE stream.
   * This can be useful for simple request/response scenarios without streaming.
   * Default is `false` (SSE streams are preferred).
   */
  enableJsonResponse?: boolean;
  /**
   * Event store for resumability support
   * If provided, resumability will be enabled, allowing clients to reconnect and resume messages
   */
  eventStore?: EventStore;
  /**
   * List of allowed `Host` header values for DNS rebinding protection.
   * If not specified, host validation is disabled.
   * @deprecated Use external middleware for host validation instead.
   */
  allowedHosts?: string[];
  /**
   * List of allowed `Origin` header values for DNS rebinding protection.
   * If not specified, origin validation is disabled.
   * @deprecated Use external middleware for origin validation instead.
   */
  allowedOrigins?: string[];
  /**
   * Enable DNS rebinding protection (requires `allowedHosts` and/or `allowedOrigins` to be configured).
   * Default is `false` for backwards compatibility.
   * @deprecated Use external middleware for DNS rebinding protection instead.
   */
  enableDnsRebindingProtection?: boolean;
  /**
   * Retry interval in milliseconds to suggest to clients in SSE `retry` field.
   * When set, the server will send a `retry` field in SSE priming events to control
   * client reconnection timing for polling behavior.
   */
  retryInterval?: number;
  /**
   * List of protocol versions that this transport will accept.
   * Used to validate the `mcp-protocol-version` header in incoming requests.
   *
   * Note: When using {@linkcode server/server.Server.connect | Server.connect()}, the server automatically passes its
   * `supportedProtocolVersions` to the transport, so you typically don't need
   * to set this option directly.
   *
   * @default {@linkcode SUPPORTED_PROTOCOL_VERSIONS}
   */
  supportedProtocolVersions?: string[];
}
/**
 * Options for handling a request
 */
interface HandleRequestOptions {
  /**
   * Pre-parsed request body. If provided, the transport will use this instead of parsing `req.json()`.
   * Useful when using body-parser middleware that has already parsed the body.
   */
  parsedBody?: unknown;
  /**
   * Authentication info from middleware. If provided, will be passed to message handlers.
   */
  authInfo?: AuthInfo;
}
/**
 * Server transport for Web Standards Streamable HTTP: this implements the MCP Streamable HTTP transport specification
 * using Web Standard APIs (`Request`, `Response`, `ReadableStream`).
 *
 * This transport works on any runtime that supports Web Standards: Node.js 18+, Cloudflare Workers, Deno, Bun, etc.
 *
 * In stateful mode:
 * - Session ID is generated and included in response headers
 * - Session ID is always included in initialization responses
 * - Requests with invalid session IDs are rejected with `404 Not Found`
 * - Non-initialization requests without a session ID are rejected with `400 Bad Request`
 * - State is maintained in-memory (connections, message history)
 *
 * In stateless mode:
 * - No Session ID is included in any responses
 * - No session validation is performed
 *
 * @example Stateful setup
 * ```ts source="./streamableHttp.examples.ts#WebStandardStreamableHTTPServerTransport_stateful"
 * const server = new McpServer({ name: 'my-server', version: '1.0.0' });
 *
 * const transport = new WebStandardStreamableHTTPServerTransport({
 *     sessionIdGenerator: () => crypto.randomUUID()
 * });
 *
 * await server.connect(transport);
 * ```
 *
 * @example Stateless setup
 * ```ts source="./streamableHttp.examples.ts#WebStandardStreamableHTTPServerTransport_stateless"
 * const transport = new WebStandardStreamableHTTPServerTransport({
 *     sessionIdGenerator: undefined
 * });
 * ```
 *
 * @example Hono.js
 * ```ts source="./streamableHttp.examples.ts#WebStandardStreamableHTTPServerTransport_hono"
 * app.all('/mcp', async c => {
 *     return transport.handleRequest(c.req.raw);
 * });
 * ```
 *
 * @example Cloudflare Workers
 * ```ts source="./streamableHttp.examples.ts#WebStandardStreamableHTTPServerTransport_workers"
 * const worker = {
 *     async fetch(request: Request): Promise<Response> {
 *         return transport.handleRequest(request);
 *     }
 * };
 * ```
 */
declare class WebStandardStreamableHTTPServerTransport implements Transport {
  private sessionIdGenerator;
  private _started;
  private _closed;
  private _streamMapping;
  private _requestToStreamMapping;
  private _requestResponseMap;
  private _initialized;
  private _enableJsonResponse;
  private _standaloneSseStreamId;
  private _eventStore?;
  private _onsessioninitialized?;
  private _onsessionclosed?;
  private _allowedHosts?;
  private _allowedOrigins?;
  private _enableDnsRebindingProtection;
  private _retryInterval?;
  private _supportedProtocolVersions;
  sessionId?: string;
  onclose?: () => void;
  onerror?: (error: Error) => void;
  onmessage?: (message: JSONRPCMessage, extra?: MessageExtraInfo) => void;
  constructor(options?: WebStandardStreamableHTTPServerTransportOptions);
  /**
   * Starts the transport. This is required by the {@linkcode Transport} interface but is a no-op
   * for the Streamable HTTP transport as connections are managed per-request.
   */
  start(): Promise<void>;
  /**
   * Sets the supported protocol versions for header validation.
   * Called by the server during {@linkcode server/server.Server.connect | connect()} to pass its supported versions.
   */
  setSupportedProtocolVersions(versions: string[]): void;
  /**
   * Helper to create a JSON error response
   */
  private createJsonErrorResponse;
  /**
   * Validates request headers for DNS rebinding protection.
   * @returns Error response if validation fails, `undefined` if validation passes.
   */
  private validateRequestHeaders;
  /**
   * Handles an incoming HTTP request, whether `GET`, `POST`, or `DELETE`
   * Returns a `Response` object (Web Standard)
   */
  handleRequest(req: Request, options?: HandleRequestOptions): Promise<Response>;
  /**
   * Returns true if the client's protocol version supports empty SSE data in
   * priming events (the fix shipped with protocol version `2025-11-25`).
   *
   * The version is checked for membership in this transport instance's
   * supported protocol versions rather than with an open-ended
   * `>= '2025-11-25'` comparison: the value may come from an `initialize`
   * request body, which (unlike the `MCP-Protocol-Version` header) is not
   * validated against `supportedProtocolVersions` before reaching this
   * check. An unknown future version string must not silently enable
   * behavior reserved for versions this transport actually supports.
   */
  private supportsEmptySSEData;
  /**
   * Writes a priming event to establish resumption capability.
   * Only sends if `eventStore` is configured (opt-in for resumability) and
   * the client's protocol version supports empty SSE data (a supported
   * version that is >= `2025-11-25`).
   */
  private writePrimingEvent;
  /**
   * Handles `GET` requests for SSE stream
   */
  private handleGetRequest;
  /**
   * Replays events that would have been sent after the specified event ID
   * Only used when resumability is enabled
   */
  private replayEvents;
  /**
   * Writes an event to an SSE stream via controller with proper formatting
   */
  private writeSSEEvent;
  /**
   * Handles unsupported requests (`PUT`, `PATCH`, etc.)
   */
  private handleUnsupportedRequest;
  /**
   * Handles `POST` requests containing JSON-RPC messages
   */
  private handlePostRequest;
  /**
   * Handles `DELETE` requests to terminate sessions
   */
  private handleDeleteRequest;
  /**
   * Validates session ID for non-initialization requests.
   * Returns `Response` error if invalid, `undefined` otherwise
   */
  private validateSession;
  /**
   * Validates the `MCP-Protocol-Version` header on incoming requests.
   *
   * For initialization: Version negotiation handles unknown versions gracefully
   * (server responds with its supported version).
   *
   * For subsequent requests with `MCP-Protocol-Version` header:
   * - Accept if in supported list
   * - 400 if unsupported
   *
   * For HTTP requests without the `MCP-Protocol-Version` header:
   * - Accept and default to the version negotiated at initialization
   */
  private validateProtocolVersion;
  close(): Promise<void>;
  /**
   * Close an SSE stream for a specific request, triggering client reconnection.
   * Use this to implement polling behavior during long-running operations -
   * client will reconnect after the retry interval specified in the priming event.
   */
  closeSSEStream(requestId: RequestId): void;
  /**
   * Close the standalone `GET` SSE stream, triggering client reconnection.
   * Use this to implement polling behavior for server-initiated notifications.
   */
  closeStandaloneSSEStream(): void;
  send(message: JSONRPCMessage, options?: {
    relatedRequestId?: RequestId;
  }): Promise<void>;
}
//#endregion
//#region src/fromJsonSchema.d.ts
declare function fromJsonSchema<T = unknown>(schema: JsonSchemaType, validator?: jsonSchemaValidator): StandardSchemaWithJSON<T, T>;
//#endregion
export { type AjvJsonSchemaValidator, Annotations, type AnyToolHandler, AudioContent, AuthInfo, type AuthorizationServerMetadata, BAGGAGE_META_KEY, type BaseContext, BaseMetadata, type BaseToolCallback, BlobResourceContents, BooleanSchema, CLIENT_CAPABILITIES_META_KEY, CLIENT_INFO_META_KEY, type CacheHint, type CacheScope, CallToolRequest, CallToolRequestParams, CallToolResult, CancelTaskRequest, CancelTaskResult, CancelledNotification, CancelledNotificationParams, type CfWorkerJsonSchemaValidator, type CfWorkerSchemaDraft, ClientCapabilities, type ClientContext, ClientNotification, ClientRequest, ClientResult, CompatibilityCallToolResult, type CompletableSchema, type CompleteCallback, CompleteRequest, CompleteRequestParams, CompleteRequestPrompt, CompleteRequestResourceTemplate, type CompleteResourceTemplateCallback, CompleteResult, ContentBlock, type CreateMcpHandlerOptions, CreateMessageRequest, CreateMessageRequestParams, CreateMessageRequestParamsBase, CreateMessageRequestParamsWithTools, CreateMessageResult, CreateMessageResultWithTools, CreateTaskResult, Cursor, DEFAULT_NEGOTIATED_PROTOCOL_VERSION, DEFAULT_REQUEST_TIMEOUT_MSEC, DiscoverRequest, DiscoverResult, ElicitRequest, ElicitRequestFormParams, ElicitRequestParams, ElicitRequestURLParams, ElicitResult, ElicitationCompleteNotification, ElicitationCompleteNotificationParams, EmbeddedResource, EmptyResult, EnumSchema, type EventId, type EventStore, type FetchLike, GetPromptRequest, GetPromptRequestParams, GetPromptResult, GetTaskPayloadRequest, GetTaskPayloadResult, GetTaskRequest, GetTaskResult, type HandleRequestOptions, HandlerResultTypeMap, type HostHeaderValidationResult, INTERNAL_ERROR, INVALID_PARAMS, INVALID_REQUEST, Icon, Icons, type IdJagTokenExchangeResponse, ImageContent, Implementation, InMemoryServerEventBus, InMemoryTransport, type InboundClassificationOutcome, type InboundHttpRequest, type InboundLadderRejection, type InboundLegacyRoute, type InboundLegacyRouteReason, type InboundModernRoute, type InboundValidationRung, InitializeRequest, InitializeRequestParams, InitializeResult, InitializedNotification, InputRequest, InputRequests, InputRequiredResult, type InputRequiredSpec, InputResponse, type InputResponseView, InputResponses, InternalError, InvalidParamsError, InvalidRequestError, JSONArray, JSONObject, JSONRPCErrorResponse, JSONRPCMessage, JSONRPCNotification, JSONRPCRequest, JSONRPCResponse, JSONRPCResultResponse, JSONRPC_VERSION, JSONValue, type JsonSchemaType, type JsonSchemaValidator, type JsonSchemaValidatorResult, LATEST_PROTOCOL_VERSION, LOG_LEVEL_META_KEY, type LegacyHttpHandler, LegacyTitledEnumSchema, ListChangedCallback, ListChangedHandlers, ListChangedOptions, ListPromptsRequest, ListPromptsResult, ListResourceTemplatesRequest, ListResourceTemplatesResult, type ListResourcesCallback, ListResourcesRequest, ListResourcesResult, ListRootsRequest, ListRootsResult, ListTasksRequest, ListTasksResult, ListToolsRequest, ListToolsResult, LoggingLevel, LoggingMessageNotification, LoggingMessageNotificationParams, METHOD_NOT_FOUND, type McpHandlerRequestOptions, type McpHttpHandler, type McpRequestContext, McpServer, type McpServerFactory, MessageClassification, MessageExtraInfo, MetaObject, MethodNotFoundError, MissingRequiredClientCapabilityError, MissingRequiredClientCapabilityErrorData, ModelHint, ModelPreferences, MultiSelectEnumSchema, Notification, NotificationMethod, type NotificationOptions, NotificationParams, NotificationTypeMap, NumberSchema, type OAuthClientInformation, type OAuthClientInformationFull, type OAuthClientInformationMixed, type OAuthClientMetadata, type OAuthClientRegistrationError, OAuthError, OAuthErrorCode, type OAuthErrorResponse, type OAuthMetadata, type OAuthProtectedResourceMetadata, type OAuthTokenRevocationRequest, type OAuthTokens, type OpenIdProviderDiscoveryMetadata, type OpenIdProviderMetadata, type OriginValidationResult, PARSE_ERROR, PROTOCOL_VERSION_META_KEY, PaginatedRequest, PaginatedRequestParams, PaginatedResult, ParseError, PerRequestHTTPServerTransport, type PerRequestHTTPServerTransportOptions, type PerRequestMessageExtra, type PerRequestResponseMode, PingRequest, PrimitiveSchemaDefinition, Progress, type ProgressCallback, ProgressNotification, ProgressNotificationParams, ProgressToken, Prompt, PromptArgument, type PromptCallback, PromptListChangedNotification, PromptMessage, PromptReference, type ProtocolEra, ProtocolError, ProtocolErrorCode, type ProtocolOptions, RELATED_TASK_META_KEY, ReadBuffer, type ReadResourceCallback, ReadResourceRequest, ReadResourceRequestParams, ReadResourceResult, type ReadResourceTemplateCallback, type RegisteredPrompt, type RegisteredResource, type RegisteredResourceTemplate, type RegisteredTool, RelatedTaskMetadata, Request$1 as Request, type RequestHandlerSchemas, RequestId, RequestMeta, RequestMetaEnvelope, RequestMetaObject, RequestMethod, type RequestOptions, RequestParams, type RequestStateAccessor, type RequestStateCodec, type RequestStateCodecOptions, RequestTypeMap, Resource, ResourceContents, ResourceLink, ResourceListChangedNotification, type ResourceMetadata, ResourceNotFoundError, ResourceRequestParams, ResourceTemplate, ResourceTemplateReference, ResourceTemplateType, ResourceUpdatedNotification, ResourceUpdatedNotificationParams, Result, ResultTypeMap, Role, Root, RootsListChangedNotification, STDIO_DEFAULT_MAX_BUFFER_SIZE, SUBSCRIPTION_ID_META_KEY, SUPPORTED_PROTOCOL_VERSIONS, SamplingContent, SamplingMessage, SamplingMessageContentBlock, SdkError, SdkErrorCode, SdkHttpError, type SdkHttpErrorData, Server, ServerCapabilities, type ServerContext, type ServerEvent, type ServerEventBus, ServerNotification, type ServerNotifier, type ServerOptions, ServerRequest, ServerResult, SetLevelRequest, SetLevelRequestParams, SingleSelectEnumSchema, type SpecTypeName, type SpecTypes, type StandardSchemaV1, type StandardSchemaV1Sync, type StandardSchemaWithJSON, type StoredOAuthClientInformation, type StoredOAuthTokens, type StreamId, StringSchema, SubscribeRequest, SubscribeRequestParams, SubscriptionFilter, SubscriptionsAcknowledgedNotification, SubscriptionsAcknowledgedNotificationParams, SubscriptionsListenRequest, SubscriptionsListenRequestParams, SubscriptionsListenResult, SubscriptionsListenResultMeta, TRACEPARENT_META_KEY, TRACESTATE_META_KEY, Task, TaskAugmentedRequestParams, TaskCreationParams, TaskMetadata, TaskStatus, TaskStatusNotification, TaskStatusNotificationParams, TextContent, TextResourceContents, TitledMultiSelectEnumSchema, TitledSingleSelectEnumSchema, Tool, ToolAnnotations, type ToolCallback, ToolChoice, ToolExecution, ToolListChangedNotification, ToolResultContent, ToolUseContent, type Transport, type TransportSendOptions, UnsubscribeRequest, UnsubscribeRequestParams, UnsupportedProtocolVersionError, UnsupportedProtocolVersionErrorData, UntitledMultiSelectEnumSchema, UntitledSingleSelectEnumSchema, UriTemplate, UrlElicitationRequiredError, type Variables, WebStandardStreamableHTTPServerTransport, type WebStandardStreamableHTTPServerTransportOptions, acceptedContent, assertCompleteRequestPrompt, assertCompleteRequestResourceTemplate, checkResourceAllowed, classifyInboundRequest, completable, createFetchWithInit, createMcpHandler, createRequestStateCodec, deserializeMessage, fromJsonSchema, getDisplayName, hostHeaderValidationResponse, inputRequired, inputResponse, isCallToolResult, isCompletable, isInitializeRequest, isInitializedNotification, isInputRequiredResult, isJSONRPCErrorResponse, isJSONRPCNotification, isJSONRPCRequest, isJSONRPCResponse, isJSONRPCResultResponse, isLegacyRequest, isSpecType, isTaskAugmentedRequestParams, type jsonSchemaValidator, legacyStatelessFallback, localhostAllowedHostnames, localhostAllowedOrigins, originValidationResponse, parseJSONRPCMessage, resourceUrlFromServerUrl, serializeMessage, specTypeSchemas, validateHostHeader, validateOriginHeader };
//# sourceMappingURL=index.d.mts.map