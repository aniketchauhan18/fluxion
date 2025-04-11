import { betterFetch } from "@better-fetch/fetch";
import { headers } from "next/headers";
import { Session } from "./auth-client";

export async function getSession() {
  const headersList = await headers();
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.BETTER_AUTH_URL,
      headers: {
        // get the cookie from the request
        cookie: headersList.get("cookie") || "",
      },
    },
  );
  return session?.user ? session.user : null;
}
