import { auth } from "@/auth";
import { isValidMonthLabel } from "@/lib/month";
import { setMonth } from "@/lib/sheets";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const month =
    typeof body === "object" &&
    body !== null &&
    "month" in body &&
    typeof (body as { month: unknown }).month === "string"
      ? (body as { month: string }).month
      : null;

  if (!month || !isValidMonthLabel(month)) {
    return NextResponse.json({ error: "Invalid month" }, { status: 400 });
  }

  await setMonth(session.accessToken, month);
  return new NextResponse(null, { status: 204 });
}
