import {Hono} from "hono";
import {getService} from "../middlewares/service-di";
import {authRequire} from "../middlewares/auth";


const app = new Hono().basePath('/')

app.use(authRequire())

app.get('/balance', async (c) => {
  const  { userBalanceService } = getService(c)
  const balance = await userBalanceService.getBalance()
  return c.json(balance)
})

app.get('/order', async (c) => {
  const  { userBalanceService } = getService(c)
  const orders = await userBalanceService.getOrders()
  return c.json(orders)
})

export { app as balanceRoute }