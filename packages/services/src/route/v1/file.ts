import {Hono} from "hono";
import { getService } from "../middlewares/service-di";
import { bodyLimit } from 'hono/body-limit'
import {every} from 'hono/combine'
import { startTime, endTime } from 'hono/timing'
import {getCloudflareEnv} from "../../utils";
import {authRequire} from "../middlewares/auth";
import {backendEnv} from "../../libs/env";

const app = new Hono().basePath('/file')


const getKey = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('')

app.put('/upload',
every(
  authRequire(),
  bodyLimit({
    maxSize: 10 * 1024 * 1024,
    onError: (c) => {
      return c.json({message: 'overflow :(, maximum file size is 10MB'}, 413)
    },
  })
),
  async (c) => {
    const fileService = getService(c).fileService
    const form = await c.req.formData()
    const file = form.get('file') as File
    startTime(c, 'receive');
    const bytes = await file.bytes()
    endTime(c, 'receive');
    startTime(c, 'digest');
    // https://developers.cloudflare.com/workers/runtime-apis/web-crypto/#footnote-3
    // const digest = await crypto.subtle.digest({name: 'MD5',}, bytes);
    const digest = await crypto.subtle.digest({name: 'SHA-1',}, bytes);

    const key = getKey(digest)
    endTime(c, 'digest');
    // @ts-ignore
    const kv = getCloudflareEnv().KV
    let url = await kv.get(`file_${key}`)
    if(url) {
      return c.json({ url: url })
    }
    startTime(c, 'upload');
    url = await fileService.uploadFile(bytes, 'user')
    endTime(c, 'upload');
     c.executionCtx.waitUntil(kv.put(`file_${key}`, url!))
    return c.json({ url: url })
  })

export {app as fileRoute}