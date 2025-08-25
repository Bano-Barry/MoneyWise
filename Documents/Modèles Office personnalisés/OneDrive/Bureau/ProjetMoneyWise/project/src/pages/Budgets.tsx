import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Plus, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { mockBudgets } from '../data/mockData';

const Budgets: React.FC = () => {
  const [budgets] = useState(mockBudgets);
  const [showAddModal, setShowAddModal] = useState(false);

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return { status: 'exceeded', color: 'text-red-600', bg: 'bg-red-100' };
    if (percentage >= 80) return { status: 'warning', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { status: 'good', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remainingBudget = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget total</p>
              <p className="text-2xl font-bold text-gray-900">€{totalBudget.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dépensé</p>
              <p className="text-2xl font-bold text-gray-900">€{totalSpent.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Restant</p>
              <p className="text-2xl font-bold text-green-600">€{remainingBudget.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Add Budget Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Budgets par catégorie</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau budget</span>
        </button>
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.limit) * 100;
          const status = getBudgetStatus(budget.spent, budget.limit);
          
          return (
            <Card key={budget.id}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                {status.status !== 'good' && (
                  <div className={`p-1 rounded-full ${status.bg}`}>
                    <AlertTriangle className={`h-4 w-4 ${status.color}`} />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Dépensé</span>
                  <span className={status.color}>€{budget.spent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget</span>
                  <span className="text-gray-900">€{budget.limit.toLocaleString()}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      percentage >= 100 ? 'bg-red-500' : 
                      percentage >= 80 ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className={`font-medium ${status.color}`}>
                    {percentage.toFixed(1)}% utilisé
                  </span>
                  <span className="text-gray-600">
                    Reste: €{(budget.limit - budget.spent).toLocaleString()}
                  </span>
                </div>
              </div>

              {status.status === 'exceeded' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    Attention! Vous avez dépassé votre budget de €{(budget.spent - budget.limit).toLocaleString()}
                  </p>
                </div>
              )}

              {status.status === 'warning' && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    Attention! Vous approchez de votre limite budgétaire.
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Budget Suggestions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggestions intelligentes</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Basé sur vos dépenses des 3 derniers mois, nous suggérons d'augmenter votre budget Alimentation à €450
              </span>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Appliquer
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">
                Félicitations! Vous économisez 15% sur votre budget Transport ce mois-ci
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Budgets;