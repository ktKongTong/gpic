import {z} from "zod";
import {getCloudflareContext} from "@opennextjs/cloudflare";

export const backedEnvSchema = z.object({
  S3_AK: z.string(),
  S3_SK: z.string(),
  S3_ENDPOINT: z.string(),
  S3_UC_ENDPOINT: z.string(),
  S3_BUCKET: z.string(),
  AI_BASE_URL: z.string(),
  AI_API_KEY: z.string(),
  AI_MODEL_NAME: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
})

type Env = z.infer<typeof backedEnvSchema>
let env: Env | undefined = undefined

export const backendEnv = () => {
  if (!env) {
    env = backedEnvSchema.parse(getCloudflareContext().env)
  }
  return env as Env
}
