import {getAuth} from "../../libs/auth";
import { createMiddleware } from 'hono/factory'
import {Session, User} from "better-auth";
import {Context} from "hono";
import {UnauthorizedError} from "../../errors";


declare module 'hono' {
  interface ContextVariableMap {
    user: User | null,
    session: Session | null
  }
}

const getSession = (c: Context) => {
  return {
    user: c.get('user'),
    session: c.get('session')
  }
}

export const authn = createMiddleware(async (c, next) => {
  const session = await getAuth().api.getSession({ headers: c.req.raw.headers })
  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);
  return next();
})

type Options = {
  permission?: {
    [key: string]: string[];
  }
}

export const authRequire = (options?: Options) => createMiddleware(async (c, next) => {
  const { user } = getSession(c)
  if(!user) {
    throw new UnauthorizedError()
  }
  // if(options?.permission) {
  //   const res = await getAuth().api.userHasPermission({
  //     body: options.permission,
  //   })
  //   if(!res.success) {
  //     throw new AccessDeniedError('No permission to access this resource')
  //   }
  // }

  return next();
})