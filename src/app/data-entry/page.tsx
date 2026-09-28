import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppNav } from "@/components/AppNav";
import { DataEntryClient } from "@/components/DataEntryClient";

export default async function DataEntryPage() {
  const session = await auth();
  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="min-h-full bg-[#F1F5F9]">
      <AppNav />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <DataEntryClient />
      </main>
    </div>
  );
}
