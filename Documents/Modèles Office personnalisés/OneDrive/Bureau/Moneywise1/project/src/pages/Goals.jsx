import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Target, Calendar, TrendingUp, Plus, X } from 'lucide-react';
import { format, differenceInMonths, addMonths } from 'date-fns';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currency, setCurrency] = useState('FCFA');
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: format(addMonths(new Date(), 12), 'yyyy-MM-dd'),
  });

  // Catégories prédéfinies pour les objectifs
  const categories = [
    'Voyage', 'Maison', 'Voiture', 'Éducation', 'Retraite', 
    'Urgences', 'Mariage', 'Projet personnel', 'Autre'
  ];

  // Options de devise
  const currencyOptions = [
    { value: 'FCFA', symbol: 'FCFA' },
    { value: '€', symbol: '€' },
    { value: '$', symbol: '$' },
    { value: '£', symbol: '£' },
    { value: '¥', symbol: '¥' },
    { value: '₹', symbol: '₹' }
  ];

  // Charger les objectifs et la devise depuis le localStorage au montage
  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    const savedCurrency = localStorage.getItem('currency');
    
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
    
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  // Sauvegarder les objectifs et la devise dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
    localStorage.setItem('currency', currency);
  }, [goals, currency]);

  const calculateMonthlyNeeded = (goal) => {
    const remaining = goal.targetAmount - goal.currentAmount;
    const monthsLeft = differenceInMonths(new Date(goal.targetDate), new Date());
    return monthsLeft > 0 ? remaining / monthsLeft : remaining;
  };

  const getProgressColor = (current, target) => {
    const percentage = (current / target) * 100;
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.category && newGoal.targetAmount) {
      const goalToAdd = {
        id: Date.now().toString(),
        title: newGoal.title,
        category: newGoal.category,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: parseFloat(newGoal.currentAmount) || 0,
        targetDate: newGoal.targetDate,
      };
      
      const updatedGoals = [...goals, goalToAdd];
      setGoals(updatedGoals);
      setNewGoal({
        title: '',
        category: '',
        targetAmount: '',
        currentAmount: '',
        targetDate: format(addMonths(new Date(), 12), 'yyyy-MM-dd'),
      });
      setShowAddModal(false);
    }
  };

  const handleDeleteGoal = (id) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
  };

  const handleUpdateGoal = (id, field, value) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === id) {
        return { ...goal, [field]: value };
      }
      return goal;
    });
    setGoals(updatedGoals);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  return (
    <div className="space-y-6">
      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Objectifs actifs</p>
              <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
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
                {totalTargetAmount.toLocaleString()} {currency}
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
                {totalCurrentAmount.toLocaleString()} {currency}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Header avec sélecteur de devise */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Mes objectifs d'épargne</h2>
        <div className="flex items-center space-x-4">
          <select
            value={currency}
            onChange={handleCurrencyChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {currencyOptions.map(option => (
              <option key={option.value} value={option.value}>{option.symbol}</option>
            ))}
          </select>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvel objectif</span>
          </button>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.length > 0 ? (
          goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const monthlyNeeded = calculateMonthlyNeeded(goal);
            const monthsLeft = differenceInMonths(new Date(goal.targetDate), new Date());

            return (
              <Card key={goal.id}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <input
                        type="text"
                        value={goal.title}
                        onChange={(e) => handleUpdateGoal(goal.id, 'title', e.target.value)}
                        className="font-semibold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                      />
                      <select
                        value={goal.category}
                        onChange={(e) => handleUpdateGoal(goal.id, 'category', e.target.value)}
                        className="text-sm text-gray-500 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <input
                          type="date"
                          value={goal.targetDate}
                          onChange={(e) => handleUpdateGoal(goal.id, 'targetDate', e.target.value)}
                          className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <button 
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
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
                      <div className="flex items-center">
                        <span className="text-xs mr-1">{currency}</span>
                        <input
                          type="number"
                          value={goal.currentAmount}
                          onChange={(e) => handleUpdateGoal(goal.id, 'currentAmount', parseFloat(e.target.value) || 0)}
                          className="font-semibold text-green-600 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600">Objectif</p>
                      <div className="flex items-center">
                        <span className="text-xs mr-1">{currency}</span>
                        <input
                          type="number"
                          value={goal.targetAmount}
                          onChange={(e) => handleUpdateGoal(goal.id, 'targetAmount', parseFloat(e.target.value) || 0)}
                          className="font-semibold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Monthly Calculation */}
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">À économiser par mois:</span>
                      <span className="font-semibold text-blue-600">{monthlyNeeded.toFixed(0)} {currency}</span>
                    </div>
                    {monthsLeft > 0 ? (
                      <p className="text-xs text-gray-500 mt-1">
                        Il reste {monthsLeft} mois pour atteindre cet objectif
                      </p>
                    ) : (
                      <p className="text-xs text-red-500 mt-1">
                        La date cible est dépassée
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
                      <p className="text-sm text-blue-800">Plus que {(goal.targetAmount - goal.currentAmount).toLocaleString()} {currency} pour atteindre votre objectif!</p>
                    </div>
                  ) : (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-sm text-orange-800">Continuez vos efforts! Vous avez encore du chemin à parcourir.</p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-12">
            <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500">Aucun objectif défini</h3>
            <p className="text-gray-400 mt-2">Commencez par créer votre premier objectif d'épargne</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="mt-4 flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Créer un objectif</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nouvel objectif</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'objectif</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Achat voiture"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant cible ({currency})</label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant déjà économisé ({currency})</label>
                <input
                  type="number"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal({...newGoal, currentAmount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date cible</label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddGoal}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Créer l'objectif
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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