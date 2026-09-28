import { auth } from "@/auth";
import { fetchDashboardSnapshot } from "@/lib/sheets";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await fetchDashboardSnapshot(session.accessToken);
  return NextResponse.json(data);
}
