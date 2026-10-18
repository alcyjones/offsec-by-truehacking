import { z } from 'zod';
import * as Cli from '../Cli.js';
declare const _default: Cli.FileCommand<undefined, undefined, z.ZodObject<{
    configSchema: z.ZodOptional<z.ZodBoolean>;
    dir: z.ZodOptional<z.ZodString>;
    entry: z.ZodOptional<z.ZodString>;
    output: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, undefined>;
export default _default;
//# sourceMappingURL=gen.d.ts.map