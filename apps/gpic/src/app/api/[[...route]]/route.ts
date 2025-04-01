import {route} from "@repo/service";
import {handle} from 'hono/vercel'
// console.log("route", JSON.stringify(route, null, 2));
export const GET = handle(route)
export const POST = handle(route)
export const PUT = handle(route)