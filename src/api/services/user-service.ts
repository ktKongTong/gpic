import { getAuth } from "@/api/services/auth";
import { Context } from "hono";
import {User} from 'better-auth'
import { getContext } from 'hono/context-storage'
import {AIImageService} from "@/api/services/ai/image";
import {FileService} from "@/api/services/file";
import {UserQuotaService} from "@/api/services/quota";
import {HistoryService} from "@/api/services/history";

declare module 'hono' {
    interface ContextVariableMap {
        [userSymbol]: User | undefined
    }
}



const userSymbol = Symbol('user_service_user')

export class UserService {
    async getCurrentUser(c?: Context) {
        const ctx = c ?? getContext()
        const cached = ctx.get(userSymbol)
        if(cached) {
            return cached
        }
        const session = await getAuth().api.getSession({ headers: ctx.req.raw.headers })
        ctx.set(userSymbol, session?.user)
        return session?.user
    }


}