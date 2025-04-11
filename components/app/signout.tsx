"use client";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();
  return (
    <div
      className="flex cursor-pointer items-center justify-between w-full text-neutral-700"
      onClick={async () => {
        try {
          await signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/");
              },
            },
          });
        } catch (error) {
          console.log(error);
        }
      }}
    >
      Sign Out
    </div>
  );
}
