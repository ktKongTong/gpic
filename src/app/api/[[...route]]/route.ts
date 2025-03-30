import {route} from "@/api";
import {handle} from 'hono/vercel'

export const GET = handle(route)
export const POST = handle(route)