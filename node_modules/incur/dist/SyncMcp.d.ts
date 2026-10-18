/** Registers the CLI as an MCP server via `npx add-mcp` and direct config writes for unsupported agents. */
export declare function register(name: string, options?: register.Options): Promise<register.Result>;
export declare namespace register {
    /** Options for registering an MCP server. */
    type Options = {
        /** Target specific agents (e.g. `'claude-code'`, `'cursor'`). */
        agents?: string[] | undefined;
        /** CLI name used to derive the default command. Defaults to the MCP server name. */
        cli?: string | undefined;
        /** Override the command agents will run. Defaults to `<runner> <name> --mcp`. */
        command?: string | undefined;
        /** Install globally. Defaults to `true`. */
        global?: boolean | undefined;
        /** Trusted npm package used to run the CLI. */
        package?: string | undefined;
        /** Exact CLI version appended to `package` when provided. */
        version?: string | undefined;
    };
    /** Result of a register operation. */
    type Result = {
        /** Agents the server was registered with. */
        agents: string[];
        /** The command registered. */
        command: string;
    };
}
/** @internal Detects the safe package specifier used to run this CLI. */
export declare function detectPackageSpecifier(name: string, pkg?: string, version?: string): string;
//# sourceMappingURL=SyncMcp.d.ts.map