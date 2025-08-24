import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { useFinance } from '../contexts/FinanceContext';

type VariationView = 'jour' | 'semaine' | 'mois';

function groupTransactionsBy(transactions: any[], granularity: VariationView) {
  const results: Record<string, { income: number; expenses: number }> = {};

  if (granularity === 'jour') {
    transactions.forEach(t => {
      const dateKey = new Date(t.date).toLocaleDateString();
      if (!results[dateKey]) results[dateKey] = { income: 0, expenses: 0 };
      if (t.type === 'income') results[dateKey].income += t.amount;
      if (t.type === 'expense') results[dateKey].expenses += t.amount;
    });
    return Object.entries(results)
      .map(([period, vals]) => ({ period, ...vals }))
      .sort((a, b) => {
        const dA = new Date(a.period.split('/').reverse().join('-')).getTime();
        const dB = new Date(b.period.split('/').reverse().join('-')).getTime();
        return dA - dB;
      })
      .slice(-14);
  }
  if (granularity === 'semaine') {
    // Group by week number
    transactions.forEach(t => {
    const date = new Date(t.date);
      // Get ISOWeek
      const tempDate = new Date(date);
      tempDate.setHours(0,0,0,0);
      tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay()||7));
      const yearStart = new Date(tempDate.getFullYear(),0,1);
      const weekNum = Math.ceil((((tempDate.getTime()-yearStart.getTime())/86400000)+1)/7);
      const period = `Sem. ${weekNum} ${date.getFullYear()}`
      if (!results[period]) results[period] = { income: 0, expenses: 0 };
      if (t.type === 'income') results[period].income += t.amount;
      if (t.type === 'expense') results[period].expenses += t.amount;
  });
    return Object.entries(results)
      .map(([period, vals]) => ({ period, ...vals }))
      .sort((a, b) => a.period.localeCompare(b.period, undefined, { numeric: true }))
      .slice(-8);
  }
  if (granularity === 'mois') {
    transactions.forEach(t => {
      const d = new Date(t.date);
      const period = d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
      if (!results[period]) results[period] = { income: 0, expenses: 0 };
      if (t.type === 'income') results[period].income += t.amount;
      if (t.type === 'expense') results[period].expenses += t.amount;
    });
    return Object.entries(results)
      .map(([period, vals]) => ({ period, ...vals }))
      .sort((a, b) => {
        const [mA, yA] = a.period.split(' ');
        const [mB, yB] = b.period.split(' ');
        const getMonth = (m: string) => {
          const mois = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
          return mois.indexOf(m);
      };
        return (parseInt(yA) - parseInt(yB)) || (getMonth(mA) - getMonth(mB));
      }).slice(-6);
  }
  return [];
}

export default function Dashboard() {
  const { transactions, categories, balance } = useFinance();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const totalIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

  const expensesByCategory = categories
    .filter(cat => cat.type === 'expense')
    .map(cat => {
      const amount = currentMonthTransactions
        .filter(t => t.category === cat.name && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        name: cat.name,
        value: amount,
        color: cat.color,
  };
    })
    .filter(item => item.value > 0);

  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    monthlyData.push({
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      income,
      expenses,
      net: income - expenses,
    });
  }

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getProjectedBalance = () => {
    const projectedIncome = totalIncome;
    const projectedExpenses = totalExpenses;
    return balance + projectedIncome - projectedExpenses;
  };
  const [showExpensePercentage, setShowExpensePercentage] = useState(false);
  const expensePercentage = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;

  // Variation (jour/semaine/mois)
  const [variationView, setVariationView] = useState<VariationView>('jour');
  const variationChartData = groupTransactionsBy(transactions, variationView);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your finances.</p>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(balance)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${balance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <Wallet className={`h-6 w-6 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dépenses du mois</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                <button
                  onClick={() => setShowExpensePercentage(v => !v)}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded-full text-lg font-bold"
                  title="Afficher le pourcentage"
                >
                  {showExpensePercentage ? '-' : '+'}
                </button>
                {showExpensePercentage && (
                  <span className="ml-3 text-sm text-gray-700">
                    {expensePercentage}% du revenu
                  </span>
                )}
              </div>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Suivi des revenus et dépenses (variation) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-2 p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Suivi des revenus et dépenses (variation)
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setVariationView('jour')}
              className={`px-3 py-1 rounded-full border ${variationView === 'jour' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            >Jour</button>
            <button
              onClick={() => setVariationView('semaine')}
              className={`px-3 py-1 rounded-full border ${variationView === 'semaine' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            >Semaine</button>
            <button
              onClick={() => setVariationView('mois')}
              className={`px-3 py-1 rounded-full border ${variationView === 'mois' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            >Mois</button>
          </div>
          </div>
        <div className="p-6 pb-8">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={variationChartData}>
              <XAxis dataKey="period" />
              <YAxis tickFormatter={value => `${formatCurrency(Number(value))}`} />
              <Tooltip formatter={value => formatCurrency(Number(value))} />
              <Bar dataKey="income" fill="#10B981" name="Revenus" />
              <Bar dataKey="expenses" fill="#EF4444" name="Dépenses" />
            </BarChart>
          </ResponsiveContainer>
          {variationChartData.length === 0 && (
            <div className="text-center text-gray-500 mt-4">Aucune donnée pour cette période.</div>
          )}
      </div>
        </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          {expensesByCategory.length > 0 ? (
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
                    </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No expenses data available
            </div>
          )}
          {/* Legend */}
          <div className="mt-4 space-y-2">
            {expensesByCategory.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
        </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(item.value)}
                </span>
      </div>
            ))}
      </div>
    </div>

        {/* Monthly Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h3>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="income" fill="#10B981" name="Income" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="p-6">
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => {
                const category = categories.find(c => c.name === transaction.category);
                return (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: category?.color + '20' }}
                      >
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
  );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No transactions yet. Add your first transaction to get started!
            </div>
          )}
        </div>
      </div>

      {/* Projected Balance */}
      <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-200 my-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Prévision basique</h3>
        <p>
          Solde projeté pour la fin du mois : <b>{formatCurrency(getProjectedBalance())}</b>
        </p>
        <small className="text-blue-700">Si les habitudes actuelles continuent.</small>
      </div>
    </div>
  );
}
































































