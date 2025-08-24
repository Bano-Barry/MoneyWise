// src/types/index.ts

export type User = {
  id: number;          // l'id doit être un nombre
  name: string;
  email: string;
};

export type Transaction = {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;        // ISO string, ex: "2025-08-24"
};

export type Category = {
  id: number;
  name: string;
  type: 'income' | 'expense';
  color: string;       // code couleur hex, ex: "#10B981"
};

export type FinanceState = {
  balance: number;
  transactions: Transaction[];
  categories: Category[];
};
