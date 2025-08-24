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


  const [variationView, setVariationView] = useState<'jour' | 'semaine' | 'mois'>('jour');

  function getVariationKey(date: Date, type: 'jour' | 'semaine' | 'mois') {
    if (type === 'jour') return date.toLocaleDateString('fr-FR');
    if (type === 'semaine') {
      const d = new Date(date);
      const day = d.getDay() || 7;
      d.setDate(d.getDate() - day + 1);
      return `Semaine du ${d.toLocaleDateString('fr-FR')}`;
    }
    if (type === 'mois') {
      return date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
    }
  }

  const variationTransactions = currentMonthTransactions;

  const groupedVariationData: {[key: string]: {income: number, expenses: number}} = {};

  variationTransactions.forEach(tr => {
    const d = new Date(tr.date);
    const key = getVariationKey(d, variationView);
    if (!groupedVariationData[key]) groupedVariationData[key] = {income: 0, expenses: 0};
    if (tr.type === 'income') groupedVariationData[key].income += tr.amount;
    if (tr.type === 'expense') groupedVariationData[key].expenses += tr.amount;
  });
  const variationChartData = Object.entries(groupedVariationData)
    .map(([period, vals]) => ({period, ...vals}))
    .sort((a, b) => {
      let da: Date, db: Date;
      if (variationView === 'jour') {
        da = new Date(a.period);
        db = new Date(b.period);
      } else if (variationView === 'semaine') {
        // "Semaine du 14/06/2024"
        const aMatch = a.period.match(/\d{2}\/\d{2}\/\d{4}/);
        const bMatch = b.period.match(/\d{2}\/\d{2}\/\d{4}/);
        da = aMatch ? new Date(aMatch[0].split('/').reverse().join('-')) : new Date();
        db = bMatch ? new Date(bMatch[0].split('/').reverse().join('-')) : new Date();
      } else {
        // mois (ex: "juin 2024" → "01 mois année")
        // For fr-FR, months go: janvier, février, mars, avril, mai, juin, juillet, août, septembre, octobre, novembre, décembre
        const moisFr = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
        function parseMois(p: string) {
          const [m, y] = p.split(' ');
          const idx = moisFr.findIndex(mois => m.toLowerCase().startsWith(mois));
          return idx >= 0 ? new Date(Number(y), idx, 1) : new Date();
        }
        da = parseMois(a.period);
        db = parseMois(b.period);
      }
      return da.getTime() - db.getTime();
    });

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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Variation du mois courant</h3>
          {/* Toggle boutons */}
          <div className="mb-2 flex gap-2 items-center">
            <button
              className={`px-2 py-1 rounded-full text-sm font-medium border ${variationView === 'jour' ? 'bg-blue-500 text-white border-blue-600' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setVariationView('jour')}
            >
              Jour
            </button>
            <button
              className={`px-2 py-1 rounded-full text-sm font-medium border ${variationView === 'semaine' ? 'bg-blue-500 text-white border-blue-600' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setVariationView('semaine')}
            >
              Semaine
            </button>
            <button
              className={`px-2 py-1 rounded-full text-sm font-medium border ${variationView === 'mois' ? 'bg-blue-500 text-white border-blue-600' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setVariationView('mois')}
            >
              Mois
            </button>
          </div>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={variationChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" fontSize={11} interval={0} />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
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