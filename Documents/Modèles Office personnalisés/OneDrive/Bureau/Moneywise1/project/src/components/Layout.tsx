import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  PiggyBank,
  Target,
  BarChart3,
  Users,
  CreditCard,
  Menu,
  X,
  TrendingUp
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Budgets', href: '/budgets', icon: PiggyBank },
    { name: 'Objectifs', href: '/goals', icon: Target },
    { name: 'Rapports', href: '/reports', icon: BarChart3 },
    { name: 'Comparaisons', href: '/social', icon: Users },
    { name: 'Abonnements', href: '/subscriptions', icon: CreditCard },
  ];

  const getPageTitle = () => {
    const currentPath = navigation.find(nav => nav.href === location.pathname);
    return currentPath?.name || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 bg-white shadow-sm">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <h1 className="text-xl font-bold text-gray-900">MoneyWise</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center px-6 py-4 border-b border-gray-200">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">MoneyWise</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>

            {/* User profile */}
            <div className="px-4 py-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-700 font-medium">K</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Khadija</p>
                  <p className="text-xs text-gray-500">tourek014@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          <div className="px-4 py-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
