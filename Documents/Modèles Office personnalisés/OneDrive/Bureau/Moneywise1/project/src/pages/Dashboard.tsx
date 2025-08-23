import React from 'react';
import { Card, StatCard } from '../components/ui/Card';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { monthlyData, expensesByCategory, mockTransactions } from '../data/mockData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const totalIncome = monthlyData[monthlyData.length - 1].income;
  const totalExpenses = monthlyData[monthlyData.length - 1].expenses;
  const balance = totalIncome - totalExpenses;
  const savingsRate = ((balance / totalIncome) * 100).toFixed(1);

  const recentTransactions = mockTransactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Revenus ce mois"
          value={`€${totalIncome.toLocaleString()}`}
          change="12.5%"
          isPositive={true}
          icon={<TrendingUp className="h-6 w-6 text-green-600" />}
        />
        <StatCard
          title="Dépenses ce mois"
          value={`€${totalExpenses.toLocaleString()}`}
          change="8.2%"
          isPositive={false}
          icon={<TrendingDown className="h-6 w-6 text-red-600" />}
        />
        <StatCard
          title="Solde disponible"
          value={`€${balance.toLocaleString()}`}
          change="4.3%"
          isPositive={true}
          icon={<Wallet className="h-6 w-6 text-green-600" />}
        />
        <StatCard
          title="Taux d'épargne"
          value={`${savingsRate}%`}
          change="2.1%"
          isPositive={true}
          icon={<Target className="h-6 w-6 text-green-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution financière</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={3}
                name="Revenus"
                dot={{ fill: '#10b981', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={3}
                name="Dépenses"
                dot={{ fill: '#ef4444', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Expenses by Category */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dépenses par catégorie</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {expensesByCategory.map((category, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-gray-600">{category.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Transactions récentes</h3>
          <button className="text-green-600 hover:text-green-700 font-medium">
            Voir tout
          </button>
        </div>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
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
                  {transaction.type === 'income' ? '+' : ''}€{Math.abs(transaction.amount).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(transaction.date), 'dd MMM', { locale: fr })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;