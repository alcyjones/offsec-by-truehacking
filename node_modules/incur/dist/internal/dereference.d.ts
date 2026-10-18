/**
 * Dereferences all local `$ref` pointers in a JSON object (e.g. `{"$ref": "#/components/schemas/User"}`),
 * replacing them inline with the resolved values. Only handles local (`#/...`) references.
 *
 * Handles circular references by caching a mutable placeholder before recursing.
 *
 * Minimal reimplementation of the dereferencing behavior from `@apidevtools/json-schema-ref-parser`
 * (https://github.com/APIDevTools/json-schema-ref-parser). Only supports in-memory, local-pointer
 * resolution — no file/URL resolution, no `$id` scoping.
 */
export declare function dereference<value>(root: value): value;
//# sourceMappingURL=dereference.d.ts.map