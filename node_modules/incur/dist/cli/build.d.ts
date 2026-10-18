import { z } from 'zod';
import * as Cli from '../Cli.js';
declare const _default: Cli.FileCommand<z.ZodObject<{
    entry: z.ZodString;
}, z.core.$strip>, undefined, z.ZodObject<{
    installer: z.ZodOptional<z.ZodBoolean>;
    name: z.ZodOptional<z.ZodString>;
    output: z.ZodOptional<z.ZodString>;
    repository: z.ZodOptional<z.ZodString>;
    tag: z.ZodOptional<z.ZodString>;
    target: z.ZodOptional<z.ZodArray<z.ZodString>>;
    version: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, undefined>;
export default _default;
//# sourceMappingURL=build.d.ts.map