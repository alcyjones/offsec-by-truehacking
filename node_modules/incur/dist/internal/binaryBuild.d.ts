/** Canonical standalone-binary targets supported by Incur. */
export declare const targets: readonly ["darwin-arm64", "darwin-x64", "linux-arm64-glibc", "linux-x64-glibc-baseline", "linux-arm64-musl", "linux-x64-musl-baseline", "windows-arm64", "windows-x64-baseline"];
/** A canonical standalone-binary target. */
export type Target = (typeof targets)[number];
/** Builds compressed standalone executables with embedded release metadata. */
export declare function build(options: build.Options): Promise<build.Result>;
export declare namespace build {
    /** A built executable and its compressed release asset. */
    type Artifact = {
        /** Absolute path to the compressed release asset. */
        asset: string;
        /** Absolute path to the runnable executable. */
        executable: string;
        /** SHA-256 digest of the compressed release asset. */
        sha256: string;
        /** Canonical target embedded in the executable. */
        target: Target;
    };
    /** Command execution context. */
    type ExecuteContext = {
        /** Project working directory. */
        cwd: string;
        /** Target being compiled, when applicable. */
        target?: Target | undefined;
    };
    /** Command executor used for Bun discovery and compilation. */
    type Execute = (command: string, args: string[], context: ExecuteContext) => Promise<void>;
    /** Standalone-binary build options. */
    type Options = {
        /** Bun executable name or path. */
        bun?: string | undefined;
        /** Working directory used to resolve relative paths. */
        cwd?: string | undefined;
        /** CLI entrypoint file or project directory. */
        entry: string;
        /** Command executor override used by tests and build integrations. */
        execute?: Execute | undefined;
        /** Generate release-pinned shell and PowerShell installers. */
        installer?: boolean | undefined;
        /** CLI name override. */
        name?: string | undefined;
        /** Output directory, relative to `cwd` by default. */
        output?: string | undefined;
        /** Public GitHub repository used by generated installers. */
        repository?: string | undefined;
        /** Exact GitHub release tag used by generated installers. */
        tag?: string | undefined;
        /** Canonical targets to build. Defaults to the full supported matrix. */
        targets?: string[] | undefined;
        /** CLI version override. */
        version?: string | undefined;
    };
    /** Standalone-binary build result. */
    type Result = {
        /** Built executables and release assets. */
        artifacts: Artifact[];
        /** Absolute path to `SHA256SUMS`. */
        checksums: string;
        /** Absolute resolved entrypoint path. */
        entry: string;
        /** Generated initial-install scripts. */
        installers?: {
            /** Absolute path to `install.ps1`. */
            powershell: string;
            /** Absolute path to `install.sh`. */
            shell: string;
        } | undefined;
        /** Resolved CLI name. */
        name: string;
        /** Absolute output directory. */
        output: string;
        /** Resolved CLI version. */
        version: string;
    };
}
//# sourceMappingURL=binaryBuild.d.ts.map