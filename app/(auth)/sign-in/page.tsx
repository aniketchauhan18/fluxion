import SignInWithGoogle from "@/components/app/signin-with-google";
import { getSession } from "@/lib/data";
import { redirect } from "next/navigation";
export default async function SignInPage() {
  const session = await getSession();
  if (session?.id) {
    redirect("/");
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md px-5">
        <SignInWithGoogle />
      </div>
    </div>
  );
}
