import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {getDAO, getDB} from "./storage/db";
import { backendEnv } from "./env";
import {admin, anonymous, apiKey} from "better-auth/plugins";

export let auth: ReturnType<typeof getIns>

const getIns = () =>  betterAuth({
    database: drizzleAdapter(getDB(), {
        provider: 'sqlite',
    }),
    advanced: {
        ipAddress: {
            ipAddressHeaders: ["x-client-ip", "x-forwarded-for", 'cf-connection-ip']
        }
    },
    trustedOrigins: [backendEnv().BETTER_AUTH_TRUST_ORIGIN!],
    plugins: [
        admin(),
        apiKey()
    ],
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google", "github"]
        }
    },
    databaseHooks: {
      user: {
          create: {
              after: async (user, context) => {
                  await getDAO().balance.createWalletByUserId(user.id, 10)
              }
          }
      }
    },
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