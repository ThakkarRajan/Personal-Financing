export type CashFlowPoint = { label: string; amount: number };
export type ExpenseRank = { category: string; actual: number };

export type DashboardSnapshot = {
  month: string;
  balance: number;
  income: number;
  expenses: number;
  billsLeft: number;
  cashFlow: CashFlowPoint[];
  highestExpenses: ExpenseRank[];
};

export type TransactionRow = {
  row: number;
  date: string;
  category: string;
  subCategory: string;
  amount: number;
  comment: string;
  check: string;
};

export type BillRow = {
  name: string;
  dueDay: number;
  budget: number;
  paid: number;
  left: number;
};
