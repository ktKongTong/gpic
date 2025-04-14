import {Hono} from "hono";
import {getAuth} from "../../libs/auth";

const app = new Hono()

app.get('/me', async (c) => {
  const res = await getAuth().api.getSession({headers: c.req.raw.headers})
  return c.json(res)
})

export { app as userRoute }