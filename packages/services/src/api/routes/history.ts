import {Hono} from "hono";
import {getService} from "../middlewares/service-di";

const app = new Hono().basePath('/history')

app.post('/',
  async (c) => {
    const historyService = getService(c).historyService
    const history = await historyService.getRecentHistory()
    return c.json({ data: history })
  })

export { app as historyRoute }