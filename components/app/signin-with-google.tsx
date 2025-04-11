"use client";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

export default function SignInWithGoogle({
  redirectURL,
}: {
  redirectURL?: string;
}) {
  return (
    <Button
      onClick={async () => {
        try {
          await signIn.social({
            provider: "google",
            callbackURL: decodeURIComponent(redirectURL || "/"), // change this callback url according to user flow
            errorCallbackURL: "/auth-error",
          });
        } catch (error) {
          console.error(error);
        }
      }}
      type="button"
      className="shadow-none cursor-pointer text-neutral-700 hover:bg-neutral-100/95  flex items-center bg-neutral-50 rounded-lg border w-full transition duration-150 font-normal ease-in-out border-neutral-200/95"
    >
      <FcGoogle />
      Sign in with Google
    </Button>
  );
}
