import {Hono} from "hono";
import {getService} from "../middlewares/service-di";
import {i18nCode} from "../../shared";

const app = new Hono()
app.get('/style', async (c) => {
  const  {styleService} = getService(c)
  const res = await styleService
    .getStyles(i18nCode.EN)
  return c.json(res)
})

app.get('/gallery', async (c) => {
  const {galleryService} = getService(c)
  const recent =await galleryService.getLatestGalleries()
  return c.json(recent)
})

export { app as commonRoute }