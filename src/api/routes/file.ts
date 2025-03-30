import {Hono} from "hono";
import { getService } from "../middlewares/service-di";
import { bodyLimit } from 'hono/body-limit'
const app = new Hono().basePath('/file')


app.post('/upload',
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
    const url = await fileService.uploadFile(await file.bytes())
    return c.json({ url: url })
  })

export {app as fileRoute}