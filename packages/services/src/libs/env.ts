import {z} from "zod";
import {getCloudflareEnv} from "../utils";

export const backedEnvSchema = z.object({
  S3_AK: z.string(),
  S3_SK: z.string(),
  S3_ENDPOINT: z.string(),
  S3_UC_ENDPOINT: z.string(),
  S3_BUCKET: z.string(),
  ENV: z.enum(['prod', 'dev', 'prev']).optional(),
  AI_BASE_URL: z.string(),
  AI_API_KEY: z.string(),
  AI_MODEL_NAME: z.string(),
  BETTER_AUTH_TRUST_ORIGIN: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
})

type Env = z.infer<typeof backedEnvSchema>
let env: Env | undefined = undefined

export const backendEnv = (_env?: CloudflareEnv) => {
  if (!env) {
    env = backedEnvSchema.parse(_env ?? getCloudflareEnv())
  }
  return env as Env
}