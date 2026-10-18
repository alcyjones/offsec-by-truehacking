/** @internal Hidden flag used by detached update checks. */
export declare const checkFlag = "--incur-update-check";
/** Context passed to a custom update checker. */
export type CheckContext = {
    /** Current CLI version. */
    current: string;
    /** CLI name. */
    name: string;
    /** Registry package name when one is configured or inferred. */
    package?: string | undefined;
};
/** Context passed to a custom update installer. */
export type InstallContext = {
    /** Current CLI version when available. */
    current?: string | undefined;
    /** Latest cached version when available. */
    latest?: string | undefined;
    /** CLI name. */
    name: string;
    /** Registry package name when one is configured or inferred. */
    package?: string | undefined;
};
/** Internal options for resolving and running an update provider. */
export type Options = {
    /** Whether the executing CLI is an Incur-built standalone binary. */
    binary?: boolean | undefined;
    /** Custom latest-version checker for non-package distributions. */
    check?: ((context: CheckContext) => Promise<string | undefined> | string | undefined) | undefined;
    /** Whether installation finishes after the updating process exits. */
    deferred?: boolean | undefined;
    /** Custom installer for non-package distributions. */
    install?: ((context: InstallContext) => Promise<void> | void) | undefined;
    /** Minimum time between update checks in milliseconds. Defaults to one day. */
    interval?: number | undefined;
    /** Registry package name. Defaults to the package containing the executing binary. */
    package?: string | undefined;
    /** Current CLI version. Defaults to the executing package version. */
    version?: string | undefined;
};
/** @internal Returns a cached available update and schedules a detached refresh when needed. */
export declare function check(name: string, options?: Options): check.Result | undefined;
export declare namespace check {
    /** An available CLI update. */
    type Result = {
        /** Current CLI version. */
        current: string;
        /** Latest CLI version. */
        latest: string;
        /** Package or CLI name displayed to the user. */
        name: string;
    };
}
/** @internal Refreshes the cached latest version through the configured provider. */
export declare function refresh(name: string, options?: Options): Promise<void>;
/** @internal Installs the latest CLI version through the configured provider. */
export declare function install(name: string, options?: Options): Promise<install.Result>;
export declare namespace install {
    /** A completed CLI update. */
    type Result = {
        /** Package-manager-specific command that was run. */
        command?: string | undefined;
        /** Whether installation finishes after the updating process exits. */
        deferred?: boolean | undefined;
        /** Package or CLI name displayed to the user. */
        name: string;
    };
}
/** @internal Returns whether `candidate` is a newer semantic version than `current`. */
export declare function isNewerVersion(candidate: string, current: string): boolean;
//# sourceMappingURL=update.d.ts.map