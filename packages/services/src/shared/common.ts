import {z} from "zod";
export const versionSchema = z.object({
  version: z.string(),
}).catchall(z.any())
export type Versioned = z.infer<typeof versionSchema>

