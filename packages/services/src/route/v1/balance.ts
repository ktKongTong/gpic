import {Hono} from "hono";
import {getService} from "../middlewares/service-di";
import {authRequire} from "../middlewares/auth";
import { z } from "zod";


const app = new Hono().basePath('/')


app.get('/balance', authRequire(), async (c) => {
  const  { userBalanceService } = getService(c)
  const balance = await userBalanceService.getBalance()
  return c.json(balance)
})

app.get('/order', authRequire(), async (c) => {
  const  { userBalanceService } = getService(c)
  const orders = await userBalanceService.getOrders()
  return c.json(orders)
})

const pendingOrderSchema = z.object({
  priceId: z.string()
})
app.post('/order', authRequire(), async (c) => {
  const body = await c.req.json()
  const {priceId} = pendingOrderSchema.parse(body)
  const  {userService, userBalanceService } = getService(c)
  const uid =await userService.getCurrentUserId()
  const order = await userBalanceService.createPendingOrder({
    userId: uid,
    amount: 0,
    priceId
  })
  return c.json(order)
})

export { app as balanceRoute }