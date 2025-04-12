import Navbar from "@/components/app/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { instrumentSerif } from "@/lib/fonts";
import { redirect } from "next/navigation";

export default function Home() {

  redirect("/dashboard");

  return (
    <main className="py-10 px-6 max-w-7xl mx-auto">
      <header>
        <Navbar />
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1
          className={`${instrumentSerif.className} text-4xl md:text-6xl font-medium mb-6 text-slate-800`}
        >
          Smart Cash Flow Optimization for Your Business
        </h1>
        <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-10">
          AI-powered cash management that maximizes your returns while ensuring
          you never miss a payment
        </p>
        <Link href="/dashboard">
          <Button className="h-9 font-normal">Optimize Your Cash Flow</Button>
        </Link>
      </section>
    </main>
  );
}
