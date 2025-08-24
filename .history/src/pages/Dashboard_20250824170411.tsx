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

  function getVariationKey(date: Date, view: 'jour' | 'semaine' | 'mois') {
    if(view === 'jour') return date.toLocaleDateString('fr-FR');
    if(view === 'semaine') {
      const d = new Date(date);
      const day = d.getDay() || 7;
      d.setDate(d.getDate() - day + 1);
      return `Semaine du ${d.toLocaleDateString('fr-FR')}`;
    }
    return date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
  }
  const groupedVariationData: { [key: string]: { income: number, expenses: number } } = {};
  currentMonthTransactions.forEach(tr => {
    const d = new Date(tr.date);
    const key = getVariationKey(d, variationView);
    if(!groupedVariationData[key]) groupedVariationData[key] = { income: 0, expenses: 0 };
    if(tr.type === 'income') groupedVariationData[key].income += tr.amount;
    if(tr.type === 'expense') groupedVariationData[key].expenses += tr.amount;
  });
  const variationChartData = Object.entries(groupedVariationData)
    .map(([period, vals]) => ({ period, ...vals }))
    .sort((a, b) => a.period.localeCompare(b.period, 'fr', {numeric: true}));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your finances.</p>
      </div>


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


      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

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


        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Variation ({variationView})</h3>
          <div className="mb-2 flex items-center space-x-2">
            <button
              onClick={() => setVariationView('jour')}
              className={`px-3 py-1 rounded-full text-sm font-semibold border ${variationView === 'jour' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`}
            >
              Jour
            </button>
            <button
              onClick={() => setVariationView('semaine')}
              className={`px-3 py-1 rounded-full text-sm font-semibold border ${variationView === 'semaine' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`}
            >
              Semaine
            </button>
            <button
              onClick={() => setVariationView('mois')}
              className={`px-3 py-1 rounded-full text-sm font-semibold border ${variationView === 'mois' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'}`}
            >
              Mois
            </button>
          </div>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={variationChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="income" fill="#10B981" name="Income" />
                <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
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
}