import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Plus, Calendar, AlertTriangle, Play, Pause, Trash2, CreditCard, Bell } from 'lucide-react';
import { format, addDays, addMonths, addYears } from 'date-fns';
import { fr } from 'date-fns/locale';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    amount: '',
    frequency: 'monthly',
    category: 'Divertissement',
    nextPayment: format(new Date(), 'yyyy-MM-dd')
  });
  const [currency, setCurrency] = useState('FCFA');

  // Catégories d'abonnements
  const categories = [
    'Divertissement', 'Productivité', 'Santé', 'Éducation', 
    'Transport', 'Alimentation', 'Sport', 'Musique', 'Jeux'
  ];

  // Services populaires pré-définis
  const popularServices = [
    { name: 'Netflix', category: 'Divertissement', logo: 'N' },
    { name: 'Spotify', category: 'Musique', logo: 'S' },
    { name: 'Deezer', category: 'Musique', logo: 'D' },
    { name: 'CANAL+', category: 'Divertissement', logo: 'C' },
    { name: 'Microsoft 365', category: 'Productivité', logo: 'M' },
    { name: 'Google One', category: 'Productivité', logo: 'G' },
    { name: 'iCloud', category: 'Productivité', logo: 'I' },
    { name: 'Uber Pass', category: 'Transport', logo: 'U' },
    { name: 'Amazon Prime', category: 'Divertissement', logo: 'A' },
    { name: 'Adobe Creative Cloud', category: 'Productivité', logo: 'Ad' }
  ];

  // Charger les données depuis le localStorage au montage
  useEffect(() => {
    const savedSubscriptions = localStorage.getItem('subscriptions');
    const savedCurrency = localStorage.getItem('currency');

    if (savedSubscriptions) {
      setSubscriptions(JSON.parse(savedSubscriptions));
    }

    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  // Sauvegarder les abonnements dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  const getNextPaymentDate = (nextPayment, frequency) => {
    const date = new Date(nextPayment);
    switch (frequency) {
      case 'weekly':
        return addDays(date, 7);
      case 'monthly':
        return addMonths(date, 1);
      case 'yearly':
        return addYears(date, 1);
      default:
        return date;
    }
  };

  const getAnnualCost = (amount, frequency) => {
    switch (frequency) {
      case 'weekly':
        return amount * 52;
      case 'monthly':
        return amount * 12;
      case 'yearly':
        return amount;
      default:
        return amount * 12;
    }
  };

  const activeSubscriptions = subscriptions.filter(sub => sub.active);
  const pausedSubscriptions = subscriptions.filter(sub => !sub.active);
  
  const totalMonthlyActive = activeSubscriptions.reduce((sum, sub) => {
    const monthly = sub.frequency === 'yearly' ? sub.amount / 12 : 
                   sub.frequency === 'weekly' ? sub.amount * 4.33 : sub.amount;
    return sum + monthly;
  }, 0);
  
  const totalAnnualActive = activeSubscriptions.reduce((sum, sub) => 
    sum + getAnnualCost(sub.amount, sub.frequency), 0
  );

  const upcomingPayments = activeSubscriptions
    .sort((a, b) => new Date(a.nextPayment).getTime() - new Date(b.nextPayment).getTime())
    .slice(0, 5);

  const toggleSubscription = (id) => {
    const updatedSubscriptions = subscriptions.map(sub => 
      sub.id === id ? { ...sub, active: !sub.active } : sub
    );
    setSubscriptions(updatedSubscriptions);
  };

  const deleteSubscription = (id) => {
    const updatedSubscriptions = subscriptions.filter(sub => sub.id !== id);
    setSubscriptions(updatedSubscriptions);
  };

  const addSubscription = () => {
    if (newSubscription.name && newSubscription.amount) {
      const subscriptionToAdd = {
        id: Date.now().toString(),
        name: newSubscription.name,
        amount: parseFloat(newSubscription.amount),
        frequency: newSubscription.frequency,
        category: newSubscription.category,
        nextPayment: newSubscription.nextPayment,
        active: true
      };
      
      setSubscriptions([...subscriptions, subscriptionToAdd]);
      setNewSubscription({
        name: '',
        amount: '',
        frequency: 'monthly',
        category: 'Divertissement',
        nextPayment: format(new Date(), 'yyyy-MM-dd')
      });
      setShowAddModal(false);
    }
  };

  const addPopularService = (service) => {
    const subscriptionToAdd = {
      id: Date.now().toString(),
      name: service.name,
      amount: service.category === 'Divertissement' ? 5000 : 
              service.category === 'Productivité' ? 8000 : 3000,
      frequency: 'monthly',
      category: service.category,
      nextPayment: format(new Date(), 'yyyy-MM-dd'),
      active: true,
      logo: service.logo
    };
    
    setSubscriptions([...subscriptions, subscriptionToAdd]);
  };

  const getDaysUntilPayment = (nextPayment) => {
    const days = Math.ceil((new Date(nextPayment).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Divertissement': 'bg-purple-100 text-purple-800',
      'Productivité': 'bg-blue-100 text-blue-800',
      'Santé': 'bg-green-100 text-green-800',
      'Éducation': 'bg-yellow-100 text-yellow-800',
      'Transport': 'bg-indigo-100 text-indigo-800',
      'Alimentation': 'bg-red-100 text-red-800',
      'Sport': 'bg-orange-100 text-orange-800',
      'Musique': 'bg-pink-100 text-pink-800',
      'Jeux': 'bg-teal-100 text-teal-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Calculer les économies potentielles
  const calculateSavingsTips = () => {
    const tips = [];
    
    // Vérifier les abonnements annuels vs mensuels
    const monthlySubs = subscriptions.filter(sub => sub.frequency === 'monthly' && sub.active);
    if (monthlySubs.length > 0) {
      const potentialSavings = monthlySubs.reduce((sum, sub) => sum + (sub.amount * 12 * 0.15), 0);
      if (potentialSavings > 5000) {
        tips.push(`💡 Passez aux formules annuelles pour économiser ${potentialSavings.toLocaleString()} ${currency} par an (15% d'économie)`);
      }
    }
    
    // Vérifier les abonnements similaires
    const entertainmentSubs = subscriptions.filter(sub => 
      sub.category === 'Divertissement' && sub.active
    );
    if (entertainmentSubs.length > 2) {
      tips.push(`🎬 Vous avez ${entertainmentSubs.length} abonnements divertissement. Envisagez de regrouper ou de partager des comptes.`);
    }
    
    // Vérifier les abonnements inactifs
    if (pausedSubscriptions.length > 0) {
      tips.push(`⏸️ Vous avez ${pausedSubscriptions.length} abonnements en pause. Pensez à les résilier définitivement pour éviter les frais surprises.`);
    }
    
    // Message par défaut si pas de conseils spécifiques
    if (tips.length === 0 && activeSubscriptions.length > 0) {
      tips.push(`✅ Bon travail! Vous gérez bien vos abonnements. Continuez à surveiller vos dépenses régulièrement.`);
    }
    
    return tips;
  };

  const savingsTips = calculateSavingsTips();

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Abonnements actifs</p>
            <p className="text-2xl font-bold text-gray-900">{activeSubscriptions.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Coût mensuel</p>
            <p className="text-2xl font-bold text-red-600">{totalMonthlyActive.toLocaleString()} {currency}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Coût annuel</p>
            <p className="text-2xl font-bold text-orange-600">{totalAnnualActive.toLocaleString()} {currency}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">En pause</p>
            <p className="text-2xl font-bold text-gray-500">{pausedSubscriptions.length}</p>
          </div>
        </Card>
      </div>

      {/* Add Subscription Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Mes abonnements</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvel abonnement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Subscriptions */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Abonnements actifs</h3>
          
          {activeSubscriptions.length > 0 ? (
            <div className="space-y-4">
              {activeSubscriptions.map((subscription) => {
                const daysUntil = getDaysUntilPayment(subscription.nextPayment);
                const isUpcoming = daysUntil <= 7;
                
                return (
                  <Card key={subscription.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {subscription.logo ? (
                            <span className="text-gray-600 font-medium">{subscription.logo}</span>
                          ) : (
                            <CreditCard className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{subscription.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(subscription.category)}`}>
                              {subscription.category}
                            </span>
                            <span className="text-sm text-gray-500 capitalize">
                              {subscription.frequency === 'monthly' ? 'Mensuel' : 
                              subscription.frequency === 'yearly' ? 'Annuel' : 'Hebdomadaire'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{subscription.amount.toLocaleString()} {currency}</p>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {format(new Date(subscription.nextPayment), 'dd/MM', { locale: fr })}
                            </span>
                            {isUpcoming && (
                              <AlertTriangle className="h-3 w-3 text-orange-500 ml-1" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleSubscription(subscription.id)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Suspendre"
                          >
                            <Pause className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteSubscription(subscription.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {isUpcoming && (
                      <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-800 flex items-center">
                          <Bell className="h-4 w-4 mr-1" />
                          Renouvellement dans {daysUntil} jour{daysUntil > 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucun abonnement actif</p>
                <p className="text-sm text-gray-400 mt-1">Commencez par ajouter vos premiers abonnements</p>
              </div>
            </Card>
          )}
          
          {/* Paused Subscriptions */}
          {pausedSubscriptions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Abonnements en pause</h3>
              <div className="space-y-4">
                {pausedSubscriptions.map((subscription) => (
                  <Card key={subscription.id} className="opacity-60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {subscription.logo ? (
                            <span className="text-gray-400 font-medium">{subscription.logo}</span>
                          ) : (
                            <CreditCard className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-600">{subscription.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(subscription.category)}`}>
                            {subscription.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <p className="font-semibold text-gray-600">{subscription.amount.toLocaleString()} {currency}</p>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleSubscription(subscription.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Réactiver"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteSubscription(subscription.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Payments */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prochains paiements</h3>
            {upcomingPayments.length > 0 ? (
              <div className="space-y-3">
                {upcomingPayments.map((subscription) => {
                  const daysUntil = getDaysUntilPayment(subscription.nextPayment);
                  return (
                    <div key={subscription.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{subscription.name}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(subscription.nextPayment), 'dd MMMM', { locale: fr })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 text-sm">{subscription.amount.toLocaleString()} {currency}</p>
                        <p className={`text-xs ${daysUntil <= 3 ? 'text-red-600' : daysUntil <= 7 ? 'text-orange-600' : 'text-gray-500'}`}>
                          {daysUntil} jour{daysUntil > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">Aucun paiement à venir</p>
            )}
          </Card>

          {/* Annual Breakdown */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition annuelle</h3>
            {activeSubscriptions.length > 0 ? (
              <div className="space-y-3">
                {Array.from(new Set(activeSubscriptions.map(s => s.category))).map((category) => {
                  const categoryTotal = activeSubscriptions
                    .filter(s => s.category === category)
                    .reduce((sum, s) => sum + getAnnualCost(s.amount, s.frequency), 0);
                  
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                        {category}
                      </span>
                      <span className="font-semibold">{categoryTotal.toLocaleString()} {currency}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">Aucune donnée disponible</p>
            )}
          </Card>

          {/* Popular Services */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Services populaires</h3>
            <div className="grid grid-cols-2 gap-2">
              {popularServices.map((service, index) => (
                <button
                  key={index}
                  onClick={() => addPopularService(service)}
                  className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                    <span className="text-xs font-medium text-gray-600">{service.logo}</span>
                  </div>
                  <span className="text-xs text-gray-700">{service.name}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Savings Tips */}
          {savingsTips.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conseils d'économies</h3>
              <div className="space-y-3">
                {savingsTips.map((tip, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">{tip}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Ajouter un abonnement</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'abonnement</label>
                <input
                  type="text"
                  value={newSubscription.name}
                  onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Netflix, Spotify..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant ({currency})</label>
                <input
                  type="number"
                  value={newSubscription.amount}
                  onChange={(e) => setNewSubscription({...newSubscription, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fréquence</label>
                  <select
                    value={newSubscription.frequency}
                    onChange={(e) => setNewSubscription({...newSubscription, frequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="monthly">Mensuel</option>
                    <option value="yearly">Annuel</option>
                    <option value="weekly">Hebdomadaire</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={newSubscription.category}
                    onChange={(e) => setNewSubscription({...newSubscription, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prochain paiement</label>
                <input
                  type="date"
                  value={newSubscription.nextPayment}
                  onChange={(e) => setNewSubscription({...newSubscription, nextPayment: e.target.value})}
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
                  onClick={addSubscription}
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
  );
};

export default Subscriptions;