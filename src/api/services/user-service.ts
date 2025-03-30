import { getAuth } from "@/api/services/auth";
import { Context } from "hono";

import { getContext } from 'hono/context-storage'
export class UserService {
    async getCurrentUser(c?: Context) {
        const ctx = c ?? getContext()
        const session = await getAuth().api.getSession({ headers: ctx.req.raw.headers })
        return session?.user
    }


}