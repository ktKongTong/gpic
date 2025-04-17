import { Receiver } from "@upstash/qstash";
import {UnauthorizedError} from "../../../../errors";
export const upstashAdapter = async <T = any>(
  req: Request,
  env: CloudflareEnv
) => {
  const receiver = new Receiver({
    currentSigningKey: env.UPSTASH_QSTASH_CURRENT_SIGNING_KEY!,
    nextSigningKey: env.UPSTASH_QSTASH_NEXT_SIGNING_KEY!,
  });
  const signature = req.headers.get("Upstash-Signature")!
  const body = (await req.json()) as any[];
  const isValid = await receiver.verify({
    body: JSON.stringify(body),
    signature,
    url: `${env.BACKEND_HOST}/api/queue/upstash`,
  })
  if (!isValid) {
    throw new UnauthorizedError("Upstash verify failed.");
  }
  return {
    consume : async (consumer: (msg:T) => Promise<void>) => {
      await Promise.all(body.map(it => consumer(it)))
    }
  }
}