import {
  createAuthClient
} from "better-auth/react";
import {adminClient, apiKeyClient} from "better-auth/client/plugins"


export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    apiKeyClient(),
    adminClient()
  ]
})

export const {
  signIn,
  signOut,
  signUp,
  useSession
} = authClient;