import type * as Cli from './Cli.js';
/** @internal Hidden flag used by a detached Windows update handoff. */
export declare const applyFlag = "--incur-binary-apply";
/** Name embedded by `incur build`, or `undefined` outside a compiled artifact. */
export declare const name: string | undefined;
/** Target embedded by `incur build`, or `undefined` outside a compiled artifact. */
export declare const target: string | undefined;
/** Version embedded by `incur build`, or `undefined` outside a compiled artifact. */
export declare const version: string | undefined;
/**
 * Creates a GitHub Releases update provider for an Incur-built binary.
 *
 * Returns no overrides outside a compiled artifact, preserving package-manager updates.
 */
export declare function github(options: github.Options): Cli.create.UpdateOptions;
export declare namespace github {
    /** Options for a GitHub Releases binary update provider. */
    type Options = {
        /** Public GitHub repository in `owner/name` form. */
        repository: string;
    };
}
/**
 * @internal
 * Handles the internal Windows update handoff argument.
 *
 * Call this before normal CLI argument parsing and stop when it returns `true`.
 */
export declare function handleArgv(argv?: string[]): Promise<boolean>;
//# sourceMappingURL=Binary.d.ts.map