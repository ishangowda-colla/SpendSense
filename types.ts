export enum TransactionType {
  Income = 'income',
  Expense = 'expense',
}

export const ExpenseCategories = [
  'Food',
  'Transport',
  'Housing',
  'Utilities',
  'Entertainment',
  'Health',
  'Shopping',
  'Other',
] as const;

export type ExpenseCategory = typeof ExpenseCategories[number];

export const IncomeCategories = [
  'Salary',
  'Freelance',
  'Investment',
  'Gifts',
  'Other',
] as const;

export type IncomeCategory = typeof IncomeCategories[number];

export interface Transaction {
  id: string;
  date: string; // ISO string
  description: string;
  amount: number;
  type: TransactionType;
  category: ExpenseCategory | IncomeCategory;
}