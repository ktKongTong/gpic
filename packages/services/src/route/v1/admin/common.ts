import {Hono} from "hono";
import {getService} from "../../middlewares/service-di";
import {z} from "zod";
import {authRequire} from "../../middlewares/auth";

const app = new Hono().basePath('/admin')

app.use(authRequire({
  role: "admin"
}))

const redeemSchema = z.object({
  count: z.coerce.number(),
  amount: z.coerce.number(),
  msg: z.string().optional()
})

app.post('/redeem', async (c) => {
  const { count, amount, msg } = redeemSchema.parse(await c.req.json())
  const  { userBalanceService } = getService(c)
  const result = await userBalanceService.createRedeemCode(count, amount, msg)
  return c.json(result)
})


export { app as adminRoute }