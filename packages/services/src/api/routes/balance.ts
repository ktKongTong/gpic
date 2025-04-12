import {Hono} from "hono";
import {getService} from "../middlewares/service-di";


const app = new Hono().basePath('/')


app.get('/balance', async (c) => {
  const  { userBalanceService } = getService(c)
  const balance = await userBalanceService.getBalance()
  return c.json(balance)
})

app.get('/order', async (c) => {
  const  { userBalanceService } = getService(c)
  const orders = await userBalanceService.getConsumeHistory()
  return c.json(orders)
})

export { app as balanceRoute }