import Link from "next/link";

type SheetLoadErrorProps = {
  message?: string;
};

export function SheetLoadError({
  message = "Could not load sheet — try signing in again",
}: SheetLoadErrorProps) {
  return (
    <div
      role="alert"
      className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      <p>{message}</p>
      <p className="mt-2">
        Your Google session or Sheets token may have expired.{" "}
        <Link
          href="/signin"
          className="font-semibold underline underline-offset-2 hover:text-amber-950"
        >
          Sign in again
        </Link>
      </p>
    </div>
  );
}
