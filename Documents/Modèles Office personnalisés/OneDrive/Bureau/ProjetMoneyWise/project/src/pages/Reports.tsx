import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Download, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous');

  const monthlyComparison = [
    { period: 'Nov 2023', income: 3200, expenses: 2800, savings: 400 },
    { period: 'Dec 2023', income: 3800, expenses: 3400, savings: 400 },
    { period: 'Jan 2024', income: 4300, expenses: 2750, savings: 1550 },
  ];

  const yearlyOverview = [
    { month: 'Jan', income: 4300, expenses: 2750, savings: 1550 },
    { month: 'Fév', income: 3900, expenses: 3100, savings: 800 },
    { month: 'Mar', income: 4100, expenses: 2900, savings: 1200 },
    { month: 'Avr', income: 4200, expenses: 3200, savings: 1000 },
    { month: 'Mai', income: 4000, expenses: 2800, savings: 1200 },
    { month: 'Jun', income: 4500, expenses: 3100, savings: 1400 },
  ];

  const categoryTrends = [
    { category: 'Logement', thisMonth: 1200, lastMonth: 1200, change: 0 },
    { category: 'Alimentation', thisMonth: 285, lastMonth: 320, change: -10.9 },
    { category: 'Transport', thisMonth: 165, lastMonth: 200, change: -17.5 },
    { category: 'Divertissement', thisMonth: 96, lastMonth: 150, change: -36 },
    { category: 'Santé', thisMonth: 45, lastMonth: 80, change: -43.7 },
  ];

  const financialHealth = {
    savingsRate: 36.1,
    debtToIncome: 12.5,
    emergencyFund: 3.2,
    investmentRate: 8.5
  };

  const getHealthColor = (value: number, type: string) => {
    switch (type) {
      case 'savings':
        return value >= 20 ? 'text-green-600' : value >= 10 ? 'text-yellow-600' : 'text-red-600';
      case 'debt':
        return value <= 15 ? 'text-green-600' : value <= 30 ? 'text-yellow-600' : 'text-red-600';
      case 'emergency':
        return value >= 6 ? 'text-green-600' : value >= 3 ? 'text-yellow-600' : 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Comparer avec:</span>
              <select
                value={comparisonPeriod}
                onChange={(e) => setComparisonPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="previous">Période précédente</option>
                <option value="year">Année précédente</option>
              </select>
            </div>
          </div>
          <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Download className="h-4 w-4" />
            <span>Exporter PDF</span>
          </button>
        </div>
      </Card>

      {/* Financial Health Indicators */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Indicateurs de santé financière</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Taux d'épargne</p>
            <p className={`text-2xl font-bold ${getHealthColor(financialHealth.savingsRate, 'savings')}`}>
              {financialHealth.savingsRate}%
            </p>
            <p className="text-xs text-gray-500">Objectif: 20%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Ratio dette/revenus</p>
            <p className={`text-2xl font-bold ${getHealthColor(financialHealth.debtToIncome, 'debt')}`}>
              {financialHealth.debtToIncome}%
            </p>
            <p className="text-xs text-gray-500">Objectif: &lt;15%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Fonds d'urgence</p>
            <p className={`text-2xl font-bold ${getHealthColor(financialHealth.emergencyFund, 'emergency')}`}>
              {financialHealth.emergencyFund} mois
            </p>
            <p className="text-xs text-gray-500">Objectif: 6 mois</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Taux d'investissement</p>
            <p className="text-2xl font-bold text-blue-600">{financialHealth.investmentRate}%</p>
            <p className="text-xs text-gray-500">Objectif: 10%</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Comparison */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution mensuelle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={yearlyOverview}>
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
              <Area
                type="monotone"
                dataKey="savings"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Épargne"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stackId="2"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
                name="Dépenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Period Comparison */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparaison périodique</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="period" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="income" fill="#10b981" name="Revenus" />
              <Bar dataKey="expenses" fill="#ef4444" name="Dépenses" />
              <Bar dataKey="savings" fill="#3b82f6" name="Épargne" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Category Trends */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution par catégorie</h3>
        <div className="space-y-4">
          {categoryTrends.map((trend) => (
            <div key={trend.category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{trend.category}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-600">
                    Ce mois: €{trend.thisMonth}
                  </span>
                  <span className="text-sm text-gray-600">
                    Mois précédent: €{trend.lastMonth}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {trend.change > 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500" />
                )}
                <span className={`font-medium text-sm ${
                  trend.change > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Insights */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyses et recommandations</h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">✅ Points positifs</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Votre taux d'épargne de 36.1% est excellent (objectif: 20%)</li>
              <li>• Vos dépenses de divertissement ont diminué de 36% ce mois-ci</li>
              <li>• Votre ratio dette/revenus est très sain à 12.5%</li>
            </ul>
          </div>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">⚠️ Points d'amélioration</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Votre fonds d'urgence couvre seulement 3.2 mois (objectif: 6 mois)</li>
              <li>• Envisagez d'augmenter votre taux d'investissement de 8.5% à 10%</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;