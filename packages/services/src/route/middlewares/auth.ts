import {getAuth} from "../../libs/auth";
import { createMiddleware } from 'hono/factory'
export const authn = createMiddleware(async (c, next) => {
  const session = await getAuth().api.getSession({ headers: c.req.raw.headers })
  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);
  return next();
})