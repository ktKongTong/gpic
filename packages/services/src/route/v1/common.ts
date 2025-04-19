import {Hono} from "hono";
import {getService} from "../middlewares/service-di";
import {i18nCode} from "../../shared";
import {z} from "zod";
import {authRequire} from "../middlewares/auth";

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

const redeemSchema = z.object({
  code: z.string()
})

app.post('/redeem', authRequire(), async (c) => {
  const { code } = redeemSchema.parse(await c.req.json())
  const  { userBalanceService } = getService(c)
  const result = await userBalanceService.redeemCode(code)
  return c.json(result)
})

export { app as commonRoute }