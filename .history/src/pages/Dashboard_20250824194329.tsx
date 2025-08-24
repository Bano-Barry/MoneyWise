//import React, { useEffect, useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
import { Transaction, Category } from '../types';

export default function Dashboard() {
  const { transactions, categories } = useFinance();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    setTotalIncome(income);
    setTotalExpense(expense);
  }, [transactions]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Income: {totalIncome}</p>
      <p>Total Expense: {totalExpense}</p>
      <h2>Transactions</h2>
      <ul>
        {transactions.map(t => (
          <li key={t.id}>
            {t.description} - {t.amount} - {categories.find(c => c.id === t.categoryId)?.name || 'Unknown'}
          </li>
        ))}
      </ul>
    </div>
  );
}
