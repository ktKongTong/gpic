import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDB } from "./storage/db";
import { backendEnv } from "./env";
import {admin, anonymous, apiKey} from "better-auth/plugins";

export let auth: ReturnType<typeof getIns>

const getIns = () =>  betterAuth({
    database: drizzleAdapter(getDB(), {
        provider: 'sqlite',
    }),
    trustedOrigins: [backendEnv().BETTER_AUTH_TRUST_ORIGIN!],
    plugins: [
        admin(),
        anonymous(),
        apiKey()
    ],
    socialProviders: {
        github: {
            clientId: backendEnv().GITHUB_CLIENT_ID!,
            clientSecret: backendEnv().GITHUB_CLIENT_SECRET!,
        },
        google: {
            clientId: backendEnv().GOOGLE_CLIENT_ID!,
            clientSecret: backendEnv().GOOGLE_CLIENT_SECRET!,
        }
    },
});

export const getAuth = () => {
    if (!auth) auth = getIns()
    return auth;
}