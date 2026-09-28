import { auth } from "@/auth";
import { fetchBills } from "@/lib/sheets";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await fetchBills(session.accessToken);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Could not load sheet — try signing in again" },
      { status: 500 },
    );
  }
}
