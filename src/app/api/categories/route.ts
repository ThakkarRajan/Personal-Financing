import { auth } from "@/auth";
import { fetchCategories } from "@/lib/sheets";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const categories = await fetchCategories(session.accessToken);
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { error: "Could not load sheet — try signing in again" },
      { status: 500 },
    );
  }
}
