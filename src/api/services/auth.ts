import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDB } from "../storage/db";
import { backendEnv } from "./env";

export let auth: ReturnType<typeof betterAuth>

export const getAuth = () => {
    if (!auth) {
        auth = betterAuth({
            database: drizzleAdapter(getDB(), {
                provider: 'sqlite',
            }),
            socialProviders: {
                github: {
                    clientId: backendEnv().GITHUB_CLIENT_ID,
                    clientSecret: backendEnv().GITHUB_CLIENT_SECRET,
                }
            },
        });
    }
    return auth;
}