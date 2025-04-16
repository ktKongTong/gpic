import {User} from 'better-auth'
import {getAuth} from "../libs/auth";
import {ServiceError} from "../errors";

const userSymbol = Symbol.for('user_service_user')

interface ICache<K, V> {
    get: (key: K) => V | null | undefined
    set: (key:K, value: V) => void
}

type Option = {
    reqGetter?:  () => Request,
    cache: ICache<typeof userSymbol, User | null | undefined>,
}

export class UserService {
    private cache?: ICache<typeof userSymbol, User | null | undefined>
    private reqGetter?: () => Request
    constructor(options?: Option) {
        this.reqGetter = options?.reqGetter;
        this.cache =  options?.cache;
    }
    // can only work in request ctx, instead do/queue ctx
    async getCurrentUser(req?: Request) {
        const cached = this.cache?.get(userSymbol)
        if(cached) {
            return cached
        }
        let _req = req ?? this.reqGetter?.()
        if (!_req) {
            throw new ServiceError("Failed to get current request info")
        }
        const session = await getAuth().api
          .getSession({headers:_req.headers})
        this.cache?.set(userSymbol, session?.user)
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