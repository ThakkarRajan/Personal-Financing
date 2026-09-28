import { google } from "googleapis";
import { parseMoney } from "./parse-money";
import type {
  DashboardSnapshot,
  CashFlowPoint,
  ExpenseRank,
  TransactionRow,
  BillRow,
} from "./types";

const SID = () => process.env.SPREADSHEET_ID!;

export function getSheetsClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.sheets({ version: "v4", auth });
}

export async function fetchDashboardSnapshot(
  accessToken: string,
): Promise<DashboardSnapshot> {
  const sheets = getSheetsClient(accessToken);
  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: SID(),
    ranges: [
      "'New Dashboard'!C3",
      "'Data Entry'!D9",
      "'Data Entry'!D10",
      "'Data Entry'!D13",
      "'Bills & Savings'!F17",
      "'New Dashboard'!B10:C13",
      "'Chart Data'!A41:B54",
    ],
    valueRenderOption: "FORMATTED_VALUE",
  });
  const v = res.data.valueRanges ?? [];
  const month = v[0]?.values?.[0]?.[0] ?? "";
  const income = parseMoney(v[1]?.values?.[0]?.[0]);
  const expenses = parseMoney(v[2]?.values?.[0]?.[0]);
  const balance = parseMoney(v[3]?.values?.[0]?.[0]);
  const billsLeft = parseMoney(v[4]?.values?.[0]?.[0]);
  const cashFlow: CashFlowPoint[] = (v[5]?.values ?? []).map((row) => ({
    label: String(row[0] ?? ""),
    amount: parseMoney(row[1]),
  }));
  const highestExpenses: ExpenseRank[] = (v[6]?.values ?? [])
    .filter((row) => row[0])
    .map((row) => ({ category: String(row[0]), actual: parseMoney(row[1]) }));
  return {
    month: String(month),
    balance,
    income,
    expenses,
    billsLeft,
    cashFlow,
    highestExpenses,
  };
}

export async function setMonth(accessToken: string, label: string): Promise<void> {
  const sheets = getSheetsClient(accessToken);
  await sheets.spreadsheets.values.update({
    spreadsheetId: SID(),
    range: "'New Dashboard'!C3",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[label]] },
  });
}

const MONTH_ABBR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Format a Date or YYYY-MM-DD string as sheet style `28-Sep-26`. */
export function formatSheetDate(input: string | Date): string {
  const d =
    typeof input === "string"
      ? (() => {
          const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
          if (m) {
            return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
          }
          return new Date(input);
        })()
      : input;
  if (Number.isNaN(d.getTime())) return String(input);
  const day = String(d.getDate()).padStart(2, "0");
  const mon = MONTH_ABBR[d.getMonth()];
  const yy = String(d.getFullYear()).slice(-2);
  return `${day}-${mon}-${yy}`;
}

export async function fetchCategories(accessToken: string): Promise<string[]> {
  const sheets = getSheetsClient(accessToken);
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SID(),
    range: "'Chart Data'!V5:V",
    valueRenderOption: "FORMATTED_VALUE",
  });
  const values = res.data.values ?? [];
  return values
    .map((row) => String(row[0] ?? "").trim())
    .filter((name) => name.length > 0);
}

export async function fetchRecentTransactions(
  accessToken: string,
  limit = 30,
): Promise<TransactionRow[]> {
  const sheets = getSheetsClient(accessToken);
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SID(),
    range: "Transactions!B4:G200",
    valueRenderOption: "FORMATTED_VALUE",
  });
  const values = res.data.values ?? [];
  const rows: TransactionRow[] = [];
  values.forEach((row, i) => {
    const date = String(row[0] ?? "").trim();
    const category = String(row[1] ?? "").trim();
    const subCategory = String(row[2] ?? "").trim();
    const amountRaw = row[3];
    const comment = String(row[4] ?? "").trim();
    const check = String(row[5] ?? "").trim();
    if (!date && !category && (amountRaw == null || amountRaw === "")) return;
    rows.push({
      row: 4 + i,
      date,
      category,
      subCategory,
      amount: parseMoney(amountRaw),
      comment,
      check,
    });
  });
  return rows.slice(-limit);
}

export type AppendTransactionInput = {
  date: string;
  category: string;
  subCategory: string;
  amount: number;
  comment: string;
};

export async function appendTransaction(
  accessToken: string,
  input: AppendTransactionInput,
): Promise<void> {
  const sheets = getSheetsClient(accessToken);
  const dateStr = formatSheetDate(input.date);
  await sheets.spreadsheets.values.append({
    spreadsheetId: SID(),
    range: "Transactions!B:F",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [dateStr, input.category, input.subCategory, input.amount, input.comment],
      ],
    },
  });
}

export type BillsSnapshot = {
  monthLabel: string;
  rows: BillRow[];
  totalLeft: number;
};

export async function fetchBills(accessToken: string): Promise<BillsSnapshot> {
  const sheets = getSheetsClient(accessToken);
  const res = await sheets.spreadsheets.values.batchGet({
    spreadsheetId: SID(),
    ranges: [
      "'Bills & Savings'!B4",
      "'New Dashboard'!C3",
      "'Bills & Savings'!B7:F15",
      "'Bills & Savings'!F17",
    ],
    valueRenderOption: "FORMATTED_VALUE",
  });
  const v = res.data.valueRanges ?? [];
  const showingText = String(v[0]?.values?.[0]?.[0] ?? "").trim();
  const dashboardMonth = String(v[1]?.values?.[0]?.[0] ?? "").trim();
  // Prefer Bills & Savings B4 if it looks like a month or "Showing …"; else New Dashboard C3
  let monthLabel = dashboardMonth;
  if (showingText) {
    // B4 may be "Showing: September 2026" or just a month label
    const stripped = showingText.replace(/^showing:?\s*/i, "").trim();
    monthLabel = stripped || showingText || dashboardMonth;
  }
  const rawRows = v[2]?.values ?? [];
  const rows: BillRow[] = rawRows
    .map((row) => {
      const name = String(row[0] ?? "").trim();
      const dueRaw = row[1];
      const dueDay =
        typeof dueRaw === "number"
          ? dueRaw
          : Number(String(dueRaw ?? "").replace(/[^0-9.-]/g, ""));
      return {
        name,
        dueDay: Number.isFinite(dueDay) ? dueDay : 0,
        budget: parseMoney(row[2]),
        paid: parseMoney(row[3]),
        left: parseMoney(row[4]),
      };
    })
    .filter((r) => r.name !== "");
  const totalLeft = parseMoney(v[3]?.values?.[0]?.[0]);
  return { monthLabel, rows, totalLeft };
}
