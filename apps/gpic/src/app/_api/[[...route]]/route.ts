import {route} from "@repo/service";
import {handle} from 'hono/vercel'
// use backend worker directly instead
// https://github.com/opennextjs/opennextjs-cloudflare/issues/207
export const GET = handle(route)
export const POST = handle(route)
export const PUT = handle(route)
export const PATCH = handle(route)