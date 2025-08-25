import React from 'react';
import { Card } from '../components/ui/Card';
import { Target, Calendar, TrendingUp, Plus } from 'lucide-react';
import { mockGoals } from '../data/mockData';
import { format, differenceInMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

const Goals: React.FC = () => {
  const calculateMonthlyNeeded = (goal: typeof mockGoals[0]) => {
    const remaining = goal.targetAmount - goal.currentAmount;
    const monthsLeft = differenceInMonths(new Date(goal.targetDate), new Date());
    return monthsLeft > 0 ? remaining / monthsLeft : remaining;
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="space-y-6">
      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Objectifs actifs</p>
              <p className="text-2xl font-bold text-gray-900">{mockGoals.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total objectifs</p>
              <p className="text-2xl font-bold text-gray-900">
                €{mockGoals.reduce((sum, goal) => sum + goal.targetAmount, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Économisé</p>
              <p className="text-2xl font-bold text-green-600">
                €{mockGoals.reduce((sum, goal) => sum + goal.currentAmount, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Add Goal Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Mes objectifs d'épargne</h2>
        <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          <span>Nouvel objectif</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockGoals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const monthlyNeeded = calculateMonthlyNeeded(goal);
          const monthsLeft = differenceInMonths(new Date(goal.targetDate), new Date());

          return (
            <Card key={goal.id}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                    <p className="text-sm text-gray-500">{goal.category}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(goal.targetDate), 'MMM yyyy', { locale: fr })}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progression</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${getProgressColor(goal.currentAmount, goal.targetAmount)}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Amount Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Économisé</p>
                    <p className="font-semibold text-green-600">€{goal.currentAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Objectif</p>
                    <p className="font-semibold text-gray-900">€{goal.targetAmount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Monthly Calculation */}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">À économiser par mois:</span>
                    <span className="font-semibold text-blue-600">€{monthlyNeeded.toFixed(0)}</span>
                  </div>
                  {monthsLeft > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Il reste {monthsLeft} mois pour atteindre cet objectif
                    </p>
                  )}
                </div>

                {/* Progress Status */}
                {progress >= 100 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800 font-medium">🎉 Objectif atteint!</p>
                  </div>
                ) : progress >= 75 ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">Plus que €{(goal.targetAmount - goal.currentAmount).toLocaleString()} pour atteindre votre objectif!</p>
                  </div>
                ) : (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-sm text-orange-800">Continuez vos efforts! Vous avez encore du chemin à parcourir.</p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Motivation Section */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conseils pour atteindre vos objectifs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Automatisez vos économies</h4>
            <p className="text-sm text-blue-800">
              Mettez en place des virements automatiques vers vos comptes d'épargne pour rester constant dans vos efforts.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">🎯 Fixez des étapes</h4>
            <p className="text-sm text-green-800">
              Divisez vos gros objectifs en petites étapes pour maintenir votre motivation et célébrer vos victoires.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Goals;