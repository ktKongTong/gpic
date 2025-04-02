import {Hono} from "hono";
import { getService } from "../middlewares/service-di";
import { bodyLimit } from 'hono/body-limit'
import {getCloudflareContext} from "@opennextjs/cloudflare";
const app = new Hono().basePath('/file')

import { startTime, endTime } from 'hono/timing'
import {getCloudflareEnv} from "../utils";
const getKey = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('')
app.put('/upload',
  bodyLimit({
    maxSize: 4 * 1024 * 1024, // 50kb
    onError: (c) => {
      return c.json({message: 'overflow :(, maximum body size is 4MB'}, 413)
    },
  }),
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
    url = await fileService.uploadFile(bytes)
    endTime(c, 'upload');
    getCloudflareContext().ctx.waitUntil(kv.put(`file_${key}`, url))
    return c.json({ url: url })
  })

export {app as fileRoute}