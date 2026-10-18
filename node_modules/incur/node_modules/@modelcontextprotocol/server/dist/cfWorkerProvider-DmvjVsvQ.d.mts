import { i as jsonSchemaValidator, n as JsonSchemaValidator, t as JsonSchemaType } from "./types-DBYdVs-n.mjs";

//#region ../core-internal/src/validators/cfWorkerProvider.d.ts

/**
 * JSON Schema draft version supported by `@cfworker/json-schema`.
 */
type CfWorkerSchemaDraft = '4' | '7' | '2019-09' | '2020-12';
/**
 * `@cfworker/json-schema`-backed JSON Schema validator. See
 * `@modelcontextprotocol/{client,server}/validators/cf-worker` for the customisation entry point.
 *
 * Default validates as **JSON Schema 2020-12** (SEP-1613). Schemas declaring a different
 * `$schema` are rejected with a plain `Error`. Passing an explicit `draft` to the constructor
 * overrides this — that draft is used for every schema regardless of `$schema`.
 *
 * @example Use with default configuration (2020-12, shortcircuit on)
 * ```ts source="./cfWorkerProvider.examples.ts#CfWorkerJsonSchemaValidator_default"
 * const validator = new CfWorkerJsonSchemaValidator();
 * ```
 *
 * @example Use with custom configuration
 * ```ts source="./cfWorkerProvider.examples.ts#CfWorkerJsonSchemaValidator_customConfig"
 * const validator = new CfWorkerJsonSchemaValidator({
 *     draft: '2020-12',
 *     shortcircuit: false // Report all errors
 * });
 * ```
 */
declare class CfWorkerJsonSchemaValidator implements jsonSchemaValidator {
  private readonly shortcircuit;
  /** Caller-supplied draft; when set, the `$schema` check is skipped (caller owns dialect). */
  private readonly draft?;
  /**
   * Create a validator
   *
   * @param options - Configuration options
   * @param options.shortcircuit - If `true`, stop validation after first error (default: `true`)
   * @param options.draft - JSON Schema draft version to force for every schema. When set, the
   * `$schema` check is skipped. When omitted, the provider validates as 2020-12 and rejects
   * schemas declaring a different `$schema`.
   */
  constructor(options?: {
    shortcircuit?: boolean;
    draft?: CfWorkerSchemaDraft;
  });
  /**
   * Create a validator for the given JSON Schema
   *
   * Unlike AJV, this validator is not cached internally
   *
   * @param schema - Standard JSON Schema object
   * @returns A validator function that validates input data
   */
  getValidator<T>(schema: JsonSchemaType): JsonSchemaValidator<T>;
}
//#endregion
export { CfWorkerSchemaDraft as n, CfWorkerJsonSchemaValidator as t };
//# sourceMappingURL=cfWorkerProvider-DmvjVsvQ.d.mts.map