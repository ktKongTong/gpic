import {Hono} from "hono";
import {getService} from "../middlewares/service-di";
import {i18nCode} from "../shared";

const app = new Hono().basePath('/style')
app.get('/', async (c) => {
  const  {styleService} = getService(c)
  const res = await styleService
    .getStyles(i18nCode.EN)
  return c.json(res)
})

export { app as styleRoute }