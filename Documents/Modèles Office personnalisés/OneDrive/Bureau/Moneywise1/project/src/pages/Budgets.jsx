import React, { useState, useEffect } from 'react';

// Données initiales
const initialBudgets = [
  { id: '1', category: 'Alimentation', spent: 320, limit: 400 },
  { id: '2', category: 'Transport', spent: 150, limit: 200 },
  { id: '3', category: 'Loisirs', spent: 100, limit: 150 },
  { id: '4', category: 'Shopping', spent: 220, limit: 250 },
];

// Couleurs pour les barres de progression
const progressColors = [
  'bg-blue-500', 
  'bg-purple-500', 
  'bg-pink-500', 
  'bg-indigo-500', 
  'bg-teal-500', 
  'bg-amber-500', 
  'bg-rose-500', 
  'bg-cyan-500'
];

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [totalBudget, setTotalBudget] = useState('');
  const [currency, setCurrency] = useState('FCFA');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    spent: '',
    limit: '',
  });

  // Charger les données depuis le localStorage au montage
  useEffect(() => {
    const savedBudgets = localStorage.getItem('budgets');
    const savedTotalBudget = localStorage.getItem('totalBudget');
    const savedCurrency = localStorage.getItem('currency');

    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    } else {
      setBudgets(initialBudgets);
    }

    if (savedTotalBudget) {
      setTotalBudget(savedTotalBudget);
    }

    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  // Sauvegarder les données dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
    localStorage.setItem('totalBudget', totalBudget.toString());
    localStorage.setItem('currency', currency);
  }, [budgets, totalBudget, currency]);

  const getBudgetStatus = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return { status: 'exceeded', color: 'text-red-600', bg: 'bg-red-100' };
    if (percentage >= 80) return { status: 'warning', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { status: 'good', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const totalSpent = budgets.reduce((sum, budget) => sum + (parseFloat(budget.spent) || 0), 0);
  const remainingBudget = (parseFloat(totalBudget) || 0) - totalSpent;

  const handleAddBudget = () => {
    if (newBudget.category && newBudget.limit > 0) {
      const budgetToAdd = {
        id: Date.now().toString(),
        category: newBudget.category,
        spent: parseFloat(newBudget.spent) || 0,
        limit: parseFloat(newBudget.limit),
      };
      
      const updatedBudgets = [...budgets, budgetToAdd];
      setBudgets(updatedBudgets);
      setNewBudget({ category: '', spent: '', limit: '' });
      setShowAddModal(false);
    }
  };

  const handleDeleteBudget = (id) => {
    const updatedBudgets = budgets.filter(budget => budget.id !== id);
    setBudgets(updatedBudgets);
  };

  const handleUpdateBudget = (id, field, value) => {
    const updatedBudgets = budgets.map(budget => {
      if (budget.id === id) {
        return { ...budget, [field]: value };
      }
      return budget;
    });
    setBudgets(updatedBudgets);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleTotalBudgetChange = (e) => {
    setTotalBudget(e.target.value);
  };

  // Fonction pour obtenir une couleur unique pour chaque barre de progression
  const getProgressColor = (index) => {
    return progressColors[index % progressColors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Gestionnaire de Budgets</h1>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 flex justify-between items-center border border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget total</p>
              <div className="flex items-center mt-1">
                <select
                  value={currency}
                  onChange={handleCurrencyChange}
                  className="mr-2 bg-transparent border-none text-2xl font-bold text-gray-800 focus:ring-0 p-0"
                >
                  <option value="FCFA">FCFA</option>
                  <option value="€">€</option>
                  <option value="$">$</option>
                  <option value="£">£</option>
                </select>
                <input
                  type="number"
                  value={totalBudget}
                  onChange={handleTotalBudgetChange}
                  className="text-2xl font-bold text-gray-800 w-32 bg-transparent border-b border-gray-300 focus:border-green-500 focus:outline-none placeholder-gray-400"
                  placeholder="0.00"
                  onWheel={(e) => e.target.blur()} // Désactive le scroll sur le focus
                />
              </div>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 flex justify-between items-center border border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-600">Dépensé</p>
              <p className="text-2xl font-bold text-gray-800">{currency} {totalSpent.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 flex justify-between items-center border border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-600">Restant</p>
              <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currency} {remainingBudget.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Add Budget Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Budgets par catégorie</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Nouveau budget</span>
          </button>
        </div>

        {/* Budget Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {budgets.map((budget, index) => {
            const percentage = (budget.spent / budget.limit) * 100;
            const status = getBudgetStatus(budget.spent, budget.limit);
            const progressColor = getProgressColor(index);
            
            return (
              <div key={budget.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={budget.category}
                    onChange={(e) => handleUpdateBudget(budget.id, 'category', e.target.value)}
                    className="text-lg font-semibold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-green-500 focus:outline-none"
                  />
                  <div className="flex items-center space-x-2">
                    {status.status !== 'good' && (
                      <div className={`p-2 rounded-full ${status.bg}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${status.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                    )}
                    <button 
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Dépensé</span>
                    <div className="flex items-center">
                      <span className="text-xs mr-1 text-gray-500">{currency}</span>
                      <input
                        type="number"
                        value={budget.spent}
                        onChange={(e) => handleUpdateBudget(budget.id, 'spent', parseFloat(e.target.value) || 0)}
                        className={`w-24 text-right ${status.color} bg-transparent border-b border-transparent hover:border-gray-300 focus:border-green-500 focus:outline-none`}
                        onWheel={(e) => e.target.blur()} // Désactive le scroll sur le focus
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Budget</span>
                    <div className="flex items-center">
                      <span className="text-xs mr-1 text-gray-500">{currency}</span>
                      <input
                        type="number"
                        value={budget.limit}
                        onChange={(e) => handleUpdateBudget(budget.id, 'limit', parseFloat(e.target.value) || 0)}
                        className="w-24 text-right text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-green-500 focus:outline-none"
                        onWheel={(e) => e.target.blur()} // Désactive le scroll sur le focus
                      />
                    </div>
                  </div>

                  {/* Progress Bar avec couleur unique */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${progressColor}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className={`font-medium ${status.color}`}>
                      {percentage.toFixed(1)}% utilisé
                    </span>
                    <span className="text-gray-600">
                      Reste: {currency} {(budget.limit - budget.spent).toLocaleString()}
                    </span>
                  </div>
                </div>

                {status.status === 'exceeded' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      Attention! Vous avez dépassé votre budget de {currency} {(budget.spent - budget.limit).toLocaleString()}
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
              </div>
            );
          })}
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Suggestions intelligentes</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Basé sur vos dépenses des 3 derniers mois, nous suggérons d'augmenter votre budget Alimentation à {currency} 450
                </span>
              </div>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                Appliquer
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-700">
                  Félicitations! Vous économisez 15% sur votre budget Transport ce mois-ci
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Budget Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Ajouter un nouveau budget</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <input
                    type="text"
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Alimentation"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant dépensé ({currency})</label>
                  <input
                    type="number"
                    value={newBudget.spent}
                    onChange={(e) => setNewBudget({...newBudget, spent: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                    onWheel={(e) => e.target.blur()} // Désactive le scroll sur le focus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Limite du budget ({currency})</label>
                  <input
                    type="number"
                    value={newBudget.limit}
                    onChange={(e) => setNewBudget({...newBudget, limit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                    onWheel={(e) => e.target.blur()} // Désactive le scroll sur le focus
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
                    onClick={handleAddBudget}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budgets;