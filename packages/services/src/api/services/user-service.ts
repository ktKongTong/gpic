import { getAuth } from "./auth";
import { Context } from "hono";
import {User} from 'better-auth'
import { getContext } from 'hono/context-storage'

declare module 'hono' {
    interface ContextVariableMap {
        [userSymbol]: User | undefined
    }
}



const userSymbol = Symbol.for('user_service_user')

export class UserService {
    async getCurrentUser(c?: Context) {
        const ctx = c ?? getContext()
        const cached = ctx.get(userSymbol)
        if(cached) {
            return cached
        }
        const session = await getAuth().api
          .getSession({headers:ctx.req.raw.headers})
        console.log("session", session)
        ctx.set(userSymbol, session?.user)
        return session?.user
    }

    async isAnonymousUser() {
        const user = await this.getCurrentUser()
        if(!user) {
            return true
        }
        // @ts-ignore
        return (user?.isAnonymous ?? false) as boolean
    }


}