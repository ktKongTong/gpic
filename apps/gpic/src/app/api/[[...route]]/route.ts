import {route} from "@repo/service";
import {handle} from 'hono/vercel'
export const GET = handle(route)
export const POST = handle(route)
export const PUT = handle(route)
export const PATCH = handle(route)