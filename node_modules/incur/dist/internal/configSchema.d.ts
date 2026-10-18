import * as Cli from '../Cli.js';
/** Returns `true` if the CLI has `config` enabled on `Cli.create()`. */
export declare function hasConfig(cli: Cli.Cli): boolean;
/** Imports a CLI from `input` (must `export default` a `Cli`), generates the JSON Schema, and writes it to `output`. */
export declare function generate(input: string, output: string): Promise<void>;
/** Generates a JSON Schema describing the config file structure for a CLI. */
export declare function fromCli(cli: Cli.Cli): Record<string, unknown>;
//# sourceMappingURL=configSchema.d.ts.map