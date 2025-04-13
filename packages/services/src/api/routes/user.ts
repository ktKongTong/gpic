import {Hono} from "hono";
import {getAuth} from "../services";

const app = new Hono()

app.get('/me', async (c) => {

  const res = await getAuth().api.getSession({headers: c.req.raw.headers})
  return c.json(res)
})

export { app as userRoute }