import { signIn } from "@/auth";

export default function SignInPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-[#F1F5F9] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold tracking-tight text-slate-900">
          Budget Planner
        </h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          Private app — signs in with Google and uses your Budget Planner sheet
          only.
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}
