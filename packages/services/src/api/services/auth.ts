import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDB } from "../storage/db";
import { backendEnv } from "./env";
import {anonymous} from "better-auth/plugins";

export let auth: ReturnType<typeof getIns>

const getIns = () =>  betterAuth({
    database: drizzleAdapter(getDB(), {
        provider: 'sqlite',
    }),
    plugins: [
        anonymous({
            // onLinkAccount: async ({ anonymousUser, newUser }) => {
            //
            // }
        })
    ],
    socialProviders: {
        github: {
            clientId: backendEnv().GITHUB_CLIENT_ID,
            clientSecret: backendEnv().GITHUB_CLIENT_SECRET,
        }
    },
});

export const getAuth = () => {
    if (!auth) auth = getIns()
    return auth;
}