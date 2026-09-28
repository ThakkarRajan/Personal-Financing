import { auth } from "@/auth";
import { appendTransaction, fetchRecentTransactions } from "@/lib/sheets";
import { NextResponse } from "next/server";

const CATEGORIES = new Set(["Expenses", "Income", "Bills", "Savings"]);

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limitRaw = url.searchParams.get("limit");
  const limit = limitRaw ? Number(limitRaw) : 30;
  const safeLimit =
    Number.isFinite(limit) && limit > 0 ? Math.min(Math.floor(limit), 200) : 30;

  try {
    const rows = await fetchRecentTransactions(session.accessToken, safeLimit);
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json(
      { error: "Could not load sheet — try signing in again" },
      { status: 500 },
    );
  }
}

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

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const date = typeof b.date === "string" ? b.date.trim() : "";
  const category = typeof b.category === "string" ? b.category.trim() : "";
  const subCategory =
    typeof b.subCategory === "string" ? b.subCategory.trim() : "";
  const comment = typeof b.comment === "string" ? b.comment.trim() : "";
  const amount =
    typeof b.amount === "number"
      ? b.amount
      : typeof b.amount === "string"
        ? Number(b.amount)
        : NaN;

  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 });
  }
  if (!CATEGORIES.has(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  if (!subCategory) {
    return NextResponse.json(
      { error: "subCategory is required" },
      { status: 400 },
    );
  }
  if (!Number.isFinite(amount)) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  try {
    await appendTransaction(session.accessToken, {
      date,
      category,
      subCategory,
      amount,
      comment,
    });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Could not append transaction — try signing in again" },
      { status: 500 },
    );
  }
}
