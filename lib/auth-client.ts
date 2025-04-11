import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";
import dotenv from "dotenv";

dotenv.config();

const authClient = createAuthClient({
  baseURL: process.env.BASE_URL! as string,
  plugins: [customSessionClient<typeof auth>()],
});

export const { signIn, useSession, signOut } = authClient;
export type Session = typeof auth.$Infer.Session;
