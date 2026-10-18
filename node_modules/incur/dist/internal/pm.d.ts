/** Detects the package manager from the current process environment and executable path. */
export declare function detectPackageManager(): 'bun' | 'npm' | 'pnpm';
/** Detects the package manager runner (`npx`, `pnpx`, `bunx`) from the current process. */
export declare function detectRunner(): string;
/** Builds the package-manager-specific invocation for installing a package globally. */
export declare function globalInstall(name: string): globalInstall.Result;
export declare namespace globalInstall {
    /** A package-manager command invocation. */
    type Result = {
        /** Command arguments. */
        args: string[];
        /** Package-manager executable. */
        command: string;
    };
}
//# sourceMappingURL=pm.d.ts.map