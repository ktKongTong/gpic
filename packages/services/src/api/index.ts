import {Hono} from "hono";
import {fileRoute} from "./routes/file";
import {aiRoute} from "./routes/ai";
import { rateLimitFactory } from "./middlewares/rate-limit";
import { ServiceDIMiddleware } from "./middlewares/service-di";
import { getAuth } from "./services/auth";
import { contextStorage } from "hono/context-storage";
import {ZodError} from "zod";
import {BizError, ParameterError} from "./errors/route";
import {timing} from "hono/timing";
import {taskRoute} from "./routes/task";

const app = new Hono().basePath('/api')

app.use(contextStorage())
app.use(ServiceDIMiddleware())

app.use(rateLimitFactory({max: 60, windowMs: 300 * 1000, strategy: 'ip'}))

fileRoute.use(rateLimitFactory({prefix: 'file', strategy: 'ip'}))
aiRoute.use(rateLimitFactory({prefix: 'ai', strategy: 'user', max: 5, windowMs: 180 * 1000}))


app.use(
	'*',
	timing({
		enabled: (c) => c.req.method === 'POST' || c.req.method === 'PUT',
	})
)

app.onError((err, c) => {
	console.error(err)
	if(err instanceof BizError) {
		return c.json({error: err.message}, err.code as any)
	}
	if(err instanceof ZodError) {
		return c.json({error: 'schema validate failed'}, 400)
	}
	if(err instanceof ParameterError) {
		return c.json({error: 'schema validate failed'}, 400)
	}
	return c.json({error: "Unknown Error"}, 500)
})

app.on(["POST", "GET"], "/api/auth/*", (c) => {
	return getAuth().handler(c.req.raw);
});

app.route('/', fileRoute)
app.route('/', aiRoute)
app.route('/', taskRoute)

export { app as route }