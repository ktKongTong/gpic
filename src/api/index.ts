import {Hono} from "hono";
import {fileRoute} from "./routes/file";
import {aiRoute} from "./routes/ai";
import { rateLimitFactory } from "./middlewares/rate-limit";
import { ServiceDIMiddleware } from "./middlewares/service-di";
import { getAuth } from "./services/auth";
import { contextStorage } from "hono/context-storage";

const app = new Hono().basePath('/api')

app.use(contextStorage())
app.use(ServiceDIMiddleware())

app.use(rateLimitFactory({max: 60, windowMs: 300 * 1000, strategy: 'ip'}))

fileRoute.use(rateLimitFactory({prefix: 'file', strategy: 'ip'}))
aiRoute.use(rateLimitFactory({prefix: 'ai', strategy: 'user'}))

app.on(["POST", "GET"], "/api/auth/*", (c) => {
	return getAuth().handler(c.req.raw);
});

app.route('/', fileRoute)
app.route('/', aiRoute)

export { app as route }