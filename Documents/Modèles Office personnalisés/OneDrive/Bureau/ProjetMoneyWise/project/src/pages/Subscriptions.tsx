import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Plus, Calendar, AlertTriangle, Play, Pause, Trash2 } from 'lucide-react';
import { mockSubscriptions } from '../data/mockData';
import { format, addDays, addMonths, addYears } from 'date-fns';
import { fr } from 'date-fns/locale';

const Subscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [showAddModal, setShowAddModal] = useState(false);

  const getNextPaymentDate = (nextPayment: string, frequency: string) => {
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

  const getAnnualCost = (amount: number, frequency: string) => {
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

  const toggleSubscription = (id: string) => {
    setSubscriptions(subs => 
      subs.map(sub => 
        sub.id === id ? { ...sub, active: !sub.active } : sub
      )
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(subs => subs.filter(sub => sub.id !== id));
  };

  const getDaysUntilPayment = (nextPayment: string) => {
    const days = Math.ceil((new Date(nextPayment).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Divertissement': 'bg-purple-100 text-purple-800',
      'Productivité': 'bg-blue-100 text-blue-800',
      'Santé': 'bg-green-100 text-green-800',
      'Éducation': 'bg-yellow-100 text-yellow-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

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
            <p className="text-2xl font-bold text-red-600">€{totalMonthlyActive.toFixed(2)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Coût annuel</p>
            <p className="text-2xl font-bold text-orange-600">€{totalAnnualActive.toFixed(0)}</p>
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
          <div className="space-y-4">
            {activeSubscriptions.map((subscription) => {
              const daysUntil = getDaysUntilPayment(subscription.nextPayment);
              const isUpcoming = daysUntil <= 7;
              
              return (
                <Card key={subscription.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {subscription.name.slice(0, 2).toUpperCase()}
                        </span>
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
                        <p className="font-semibold text-gray-900">€{subscription.amount}</p>
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
                      <p className="text-sm text-orange-800">
                        🔔 Renouvellement dans {daysUntil} jour{daysUntil > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          
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
                          <span className="text-gray-400 font-medium">
                            {subscription.name.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-600">{subscription.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(subscription.category)}`}>
                            {subscription.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <p className="font-semibold text-gray-600">€{subscription.amount}</p>
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
                      <p className="font-semibold text-gray-900 text-sm">€{subscription.amount}</p>
                      <p className={`text-xs ${daysUntil <= 3 ? 'text-red-600' : daysUntil <= 7 ? 'text-orange-600' : 'text-gray-500'}`}>
                        {daysUntil} jour{daysUntil > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Annual Breakdown */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition annuelle</h3>
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
                    <span className="font-semibold">€{categoryTotal.toFixed(0)}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Savings Tips */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conseils d'économies</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 Vous pourriez économiser €120/an en passant à un plan familial pour vos abonnements streaming
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ Bon travail! Vous utilisez des abonnements annuels qui vous font économiser 15%
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;