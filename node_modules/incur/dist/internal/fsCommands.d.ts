/** @internal A command module discovered from its filesystem route. */
export type Route = {
    file: string;
    segments: string[];
};
/** @internal A command loader supplied by a standalone build manifest. */
export type ManifestRoute = Route & {
    load: () => Promise<unknown>;
};
/** @internal A loaded command and its filesystem route. */
export type LoadedRoute = Route & {
    command: unknown;
};
/** @internal Global key shared by generated standalone entrypoints and the runtime loader. */
export declare const manifestKey = "incur.fs.manifests";
/** @internal Discovers command module files below a directory. */
export declare function discover(directory: string, options?: {
    exclude?: string | undefined;
}): Promise<Route[]>;
/** @internal Consumes the next manifest embedded by a standalone build. */
export declare function consumeManifest(): ManifestRoute[] | undefined;
/** @internal Loads commands deferred by a standalone build manifest. */
export declare function loadManifest(routes: ManifestRoute[]): Promise<LoadedRoute[]>;
//# sourceMappingURL=fsCommands.d.ts.map