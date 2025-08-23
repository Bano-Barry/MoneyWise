import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [comparisonPeriod, setComparisonPeriod] = useState('previous');
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [currency, setCurrency] = useState('FCFA');
  const [totalIncome, setTotalIncome] = useState(0);
  const [historicalData, setHistoricalData] = useState([]);

  // Charger les données depuis le localStorage au montage
  useEffect(() => {
    const savedBudgets = localStorage.getItem('budgets');
    const savedGoals = localStorage.getItem('goals');
    const savedCurrency = localStorage.getItem('currency');
    const savedTotalBudget = localStorage.getItem('totalBudget');
    const savedHistoricalData = localStorage.getItem('historicalData');

    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }

    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }

    if (savedCurrency) {
      setCurrency(savedCurrency);
    }

    if (savedTotalBudget) {
      setTotalIncome(parseFloat(savedTotalBudget) || 0);
    }

    if (savedHistoricalData) {
      setHistoricalData(JSON.parse(savedHistoricalData));
    } else {
      // Initialiser avec les données du mois actuel si aucune donnée historique
      const currentData = generateCurrentMonthData();
      setHistoricalData([currentData]);
    }
  }, []);

  // Générer les données du mois actuel basées sur les budgets
  const generateCurrentMonthData = () => {
    const totalExpenses = budgets.reduce((sum, budget) => sum + budget.spent, 0);
    const totalSavings = totalIncome - totalExpenses;
    const currentMonth = new Date().toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    
    return {
      month: currentMonth,
      income: totalIncome,
      expenses: totalExpenses,
      savings: totalSavings
    };
  };

  // Sauvegarder les données historiques
  useEffect(() => {
    if (historicalData.length > 0) {
      localStorage.setItem('historicalData', JSON.stringify(historicalData));
      
      // Mettre à jour les données du mois en cours
      const currentMonth = new Date().toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      const currentData = generateCurrentMonthData();
      
      const monthExists = historicalData.some(item => item.month === currentMonth);
      
      if (monthExists) {
        const updatedData = historicalData.map(item => 
          item.month === currentMonth ? currentData : item
        );
        setHistoricalData(updatedData);
      } else {
        setHistoricalData([...historicalData, currentData]);
      }
    }
  }, [budgets, totalIncome]);

  // Calculer les données basées sur les informations utilisateur
  const currentMonthData = historicalData.length > 0 
    ? historicalData[historicalData.length - 1] 
    : generateCurrentMonthData();
  
  const totalExpenses = currentMonthData.expenses;
  const totalSavings = currentMonthData.savings;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

  // Données pour les graphiques (basées sur les budgets)
  const categoryData = budgets.map(budget => ({
    category: budget.category,
    amount: budget.spent,
    limit: budget.limit,
    percentage: budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0
  }));

  // Données pour la comparaison périodique (réelles)
  const comparisonData = historicalData.length >= 2 
    ? [
        { 
          period: historicalData[historicalData.length - 2].month, 
          income: historicalData[historicalData.length - 2].income, 
          expenses: historicalData[historicalData.length - 2].expenses, 
          savings: historicalData[historicalData.length - 2].savings 
        },
        { 
          period: historicalData[historicalData.length - 1].month, 
          income: historicalData[historicalData.length - 1].income, 
          expenses: historicalData[historicalData.length - 1].expenses, 
          savings: historicalData[historicalData.length - 1].savings 
        }
      ]
    : [
        { period: 'Mois précédent', income: 0, expenses: 0, savings: 0 },
        { period: currentMonthData.month, income: totalIncome, expenses: totalExpenses, savings: totalSavings }
      ];

  // Tendance des catégories (basée sur les budgets réels)
  const categoryTrends = budgets.map(budget => {
    return {
      category: budget.category,
      thisMonth: budget.spent,
      lastMonth: budget.spent, // Même valeur car données historiques manquantes
      change: 0 // Sans données historiques, changement à 0
    };
  });

  // Indicateurs de santé financière
  const financialHealth = {
    savingsRate: savingsRate,
    debtToIncome: 12.5, // Valeur fixe pour l'exemple
    emergencyFund: calculateEmergencyFund(),
    investmentRate: 8.5 // Valeur fixe pour l'exemple
  };

  // Calculer le fonds d'urgence (mois de dépenses couverts)
  function calculateEmergencyFund() {
    const monthlyExpenses = totalExpenses;
    const totalSavings = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    return monthlyExpenses > 0 ? totalSavings / monthlyExpenses : 0;
  }

  // Couleurs pour les graphiques
  const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

  const getHealthColor = (value, type) => {
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

  // Fonction pour exporter les données en PDF (simulée)
  const handleExportPDF = () => {
    alert(`Exportation des rapports financiers en PDF...`);
  };

  // Fonction pour ajouter des données de test
  const addTestData = () => {
    const testData = [
      { month: 'janv. 2024', income: 4300, expenses: 2750, savings: 1550 },
      { month: 'févr. 2024', income: 3900, expenses: 3100, savings: 800 },
      { month: 'mars 2024', income: 4100, expenses: 2900, savings: 1200 },
      { month: 'avr. 2024', income: 4200, expenses: 3200, savings: 1000 },
      { month: 'mai 2024', income: 4000, expenses: 2800, savings: 1200 },
    ];
    setHistoricalData([...testData, ...historicalData]);
    localStorage.setItem('historicalData', JSON.stringify([...testData, ...historicalData]));
  };

  return (
    <div className="space-y-6">
      {/* Avertissement sur les données */}
      {historicalData.length <= 1 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-yellow-800">Données limitées</h3>
              <p className="text-sm text-yellow-600">
                Les graphiques afficheront des données plus précises après plusieurs mois d'utilisation.
              </p>
            </div>
            <button 
              onClick={addTestData}
              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
            >
              Charger des données de test
            </button>
          </div>
        </Card>
      )}

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
          <button 
            onClick={handleExportPDF}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Exporter PDF</span>
          </button>
        </div>
      </Card>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus totaux</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalIncome.toLocaleString()} {currency}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dépenses totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalExpenses.toLocaleString()} {currency}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Épargne totale</p>
              <p className="text-2xl font-bold text-green-600">
                {totalSavings.toLocaleString()} {currency}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Financial Health Indicators */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Indicateurs de santé financière</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Taux d'épargne</p>
            <p className={`text-2xl font-bold ${getHealthColor(financialHealth.savingsRate, 'savings')}`}>
              {financialHealth.savingsRate.toFixed(1)}%
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
              {financialHealth.emergencyFund.toFixed(1)} mois
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
        {/* Monthly Evolution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution mensuelle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value) => [`${value} ${currency}`, '']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid ',
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
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="period" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value) => [`${value} ${currency}`, '']}
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

      {/* Category Distribution */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des dépenses</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
                nameKey="category"
                label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} ${currency}`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            {categoryData.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm font-medium">{category.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold">{category.amount.toLocaleString()} {currency}</span>
                  <span className="text-xs text-gray-500 block">{category.percentage.toFixed(1)}% du budget</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

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
                    Ce mois: {trend.thisMonth.toLocaleString()} {currency}
                  </span>
                  <span className="text-sm text-gray-600">
                    Mois précédent: {trend.lastMonth.toLocaleString()} {currency}
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
              <li>• Votre taux d'épargne de {savingsRate.toFixed(1)}% est {savingsRate >= 20 ? 'excellent' : 'bon'} (objectif: 20%)</li>
              {financialHealth.debtToIncome <= 15 && (
                <li>• Votre ratio dette/revenus est très sain à {financialHealth.debtToIncome}%</li>
              )}
              {financialHealth.emergencyFund >= 3 && (
                <li>• Votre fonds d'urgence de {financialHealth.emergencyFund.toFixed(1)} mois est une bonne base</li>
              )}
            </ul>
          </div>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">⚠️ Points d'amélioration</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              {financialHealth.emergencyFund < 6 && (
                <li>• Votre fonds d'urgence couvre seulement {financialHealth.emergencyFund.toFixed(1)} mois (objectif: 6 mois)</li>
              )}
              {financialHealth.investmentRate < 10 && (
                <li>• Envisagez d'augmenter votre taux d'investissement de {financialHealth.investmentRate}% à 10%</li>
              )}
              {savingsRate < 20 && (
                <li>• Essayez d'augmenter votre taux d'épargne progressivement pour atteindre 20%</li>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;