import {Hono} from "hono";
import {fileRoute} from "./v1/file";
import { rateLimitFactory } from "./middlewares/rate-limit";
import { ServiceDIMiddleware } from "./middlewares/service-di";
import { getAuth } from "../libs/auth";
import { contextStorage } from "hono/context-storage";
import {ZodError} from "zod";
import { BizError } from "../errors";
import {timing} from "hono/timing";
import {taskRoute} from "./v1/task";
import {taskV2Route} from "./v2/task";
import {balanceRoute} from "./v1/balance";
import {BaseError} from "../errors/base";
import {setCloudflareEnv} from "../utils";
import {commonRoute} from "./v1/common";
import {userRoute} from "./v1/user";
import {upstashRoute} from "./v1/upstash";
import {authn, authRequire} from "./middlewares/auth";

const app = new Hono().basePath('/api')
app.use('*', async (c, next) => {
	setCloudflareEnv(c.env as any)
	await next()
})
app.use(contextStorage())
app.use(ServiceDIMiddleware())


app.use(rateLimitFactory({max: 60, windowMs: 300 * 1000, strategy: 'ip'}))

fileRoute.use(rateLimitFactory({prefix: 'file', strategy: 'ip'}))
taskRoute.use(rateLimitFactory({prefix: 'ai', strategy: 'user', max: 5, windowMs: 180 * 1000}))

app.use(
	'*',
	timing({
		enabled: (c) => c.req.method === 'POST' || c.req.method === 'PUT',
	})
)
app.use(authn)
app.onError((err, c) => {
	console.error(err)
	if(err instanceof BizError) {
		return c.json({error: err.message}, err.code as any)
	}
	if(err instanceof ZodError) {
		return c.json({error: err.message}, 400)
	}
	if(err instanceof BaseError) {
		return c.json({error: err.message}, 400)
	}
	return c.json({error: "Unknown Error"}, 500)
})

app.on(["POST", "GET"], "/auth/*", (c) => {
	return getAuth().handler(c.req.raw);
});
app.route('/', commonRoute)

app.route('/', fileRoute)
app.route('/', taskRoute)
app.route('/', balanceRoute)
app.route('/', userRoute)
app.route('/', upstashRoute)
app.route('/v2', taskV2Route)

export { app as route }