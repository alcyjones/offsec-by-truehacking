import type * as Mcp from './Mcp.js';
/** Generates skill files from a command map and installs them natively. */
export declare function sync(name: string, commands: Map<string, any>, options?: sync.Options): Promise<sync.Result>;
export declare namespace sync {
    /** Options for syncing skills. */
    type Options = {
        /** Working directory for resolving `include` globs. Defaults to `process.cwd()`. */
        cwd?: string | undefined;
        /** Grouping depth for skill files. Defaults to `1`. */
        depth?: number | undefined;
        /** CLI description, used as the top-level group description. */
        description?: string | undefined;
        /** Install globally (`~/.config/agents/skills/`) instead of project-local. Defaults to `true`. */
        global?: boolean | undefined;
        /** Glob patterns for directories containing SKILL.md files to include (e.g. `"skills/*"`, `"my-skill"`). Skill name is the parent directory name. */
        include?: string[] | undefined;
        /** Root command definition (when the CLI itself has a `run` handler). */
        rootCommand?: {
            description?: string | undefined;
            args?: any;
            destructive?: boolean | undefined;
            env?: any;
            hint?: string | undefined;
            mcp?: false | {
                annotations?: Mcp.ToolAnnotations | undefined;
            } | undefined;
            options?: any;
            output?: any;
            examples?: any[] | undefined;
        } | undefined;
    };
    /** Result of a sync operation. */
    type Result = {
        /** Per-agent install details (non-universal agents only). */
        agents: import('./internal/agents.js').install.AgentInstall[];
        /** Canonical install paths. */
        paths: string[];
        /** Synced skills with metadata. */
        skills: Skill[];
    };
    /** A synced skill entry. */
    type Skill = {
        /** Description extracted from the skill frontmatter. */
        description?: string | undefined;
        /** Whether this skill was included from a local file (not generated from commands). */
        external?: boolean | undefined;
        /** Skill directory name. */
        name: string;
    };
}
/** Lists skills derived from a CLI's command map with install status. */
export declare function list(name: string, commands: Map<string, any>, options?: list.Options): Promise<list.Skill[]>;
/** Returns whether any previously synced skills are still installed on disk. */
export declare function hasInstalledSkills(name: string, options?: {
    cwd?: string | undefined;
}): boolean;
export declare namespace list {
    /** Options for listing skills. */
    type Options = {
        /** Working directory for resolving `include` globs. Defaults to `process.cwd()`. */
        cwd?: string | undefined;
        /** Grouping depth for skill files. Defaults to `1`. */
        depth?: number | undefined;
        /** CLI description, used as the top-level group description. */
        description?: string | undefined;
        /** Glob patterns for directories containing SKILL.md files to include. */
        include?: string[] | undefined;
        /** Root command definition (when the CLI itself is a command). */
        rootCommand?: {
            description?: string | undefined;
            args?: any;
            destructive?: boolean | undefined;
            env?: any;
            hint?: string | undefined;
            mcp?: false | {
                annotations?: Mcp.ToolAnnotations | undefined;
            } | undefined;
            options?: any;
            output?: any;
            examples?: any[] | undefined;
        } | undefined;
    };
    /** A skill entry with install status. */
    type Skill = {
        /** Description extracted from the skill frontmatter. */
        description?: string | undefined;
        /** Whether this skill is currently installed. */
        installed: boolean;
        /** Skill name. */
        name: string;
    };
}
/** Reads the stored skills hash for a CLI. Returns `undefined` if no hash exists. */
export declare function readHash(name: string): string | undefined;
//# sourceMappingURL=SyncSkills.d.ts.map