import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Download, 
  Plus, 
  Edit2, 
  Trash2,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFinance } from '../contexts/FinanceContext';
import jsPDF from 'jspdf';

export default function Profile() {
  const { user } = useAuth();
  const { transactions, categories, addCategory, updateCategory, deleteCategory } = useFinance();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
    color: '#EF4444',
  });

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      addCategory(newCategory);
      setNewCategory({ name: '', type: 'expense', color: '#EF4444' });
      setShowAddCategory(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    const pageHeight = pdf.internal.pageSize.height;
    let y = 20;

    // Title
    pdf.setFontSize(20);
    pdf.text('MoneyWise - Financial Report', 20, y);
    y += 20;

    // Date range
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, y);
    y += 15;

    // Summary
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    pdf.text(`Total Income: $${totalIncome.toFixed(2)}`, 20, y);
    y += 10;
    pdf.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 20, y);
    y += 10;
    pdf.text(`Net Balance: $${(totalIncome - totalExpenses).toFixed(2)}`, 20, y);
    y += 20;

    // Transactions
    pdf.setFontSize(14);
    pdf.text('Recent Transactions', 20, y);
    y += 10;

    pdf.setFontSize(10);
    const recentTransactions = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20);

    recentTransactions.forEach((transaction) => {
      if (y > pageHeight - 30) {
        pdf.addPage();
        y = 20;
      }

      const line = `${transaction.date} | ${transaction.type.toUpperCase()} | ${transaction.category} | ${transaction.description} | $${transaction.amount}`;
      pdf.text(line, 20, y);
      y += 8;
    });

    pdf.save('moneywise-report.pdf');
  };

  const exportToCSV = () => {
    const csvHeader = 'Date,Type,Category,Description,Amount\n';
    const csvData = transactions
      .map(t => `${t.date},${t.type},${t.category},"${t.description}",${t.amount}`)
      .join('\n');
    
    const blob = new Blob([csvHeader + csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'moneywise-transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const predefinedColors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
    '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
    '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#6B7280'
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Info */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-gray-500">{user?.email}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Transactions</span>
                  <span className="text-sm font-medium text-gray-900">{transactions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Categories</span>
                  <span className="text-sm font-medium text-gray-900">{categories.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
          {/* Export Data */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Download className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Download your financial data in different formats for backup or analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={exportToPDF}
               className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Export as PDF</span>
              </button>
              <button
                onClick={exportToCSV}
               className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export as CSV</span>
              </button>
            </div>
          </div>

          {/* Categories Management */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Manage Categories</h3>
              </div>
              <button
                onClick={() => setShowAddCategory(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Category</span>
              </button>
            </div>

            {showAddCategory && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Category</h4>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="Category name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <select
                      value={newCategory.type}
                      onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value as 'income' | 'expense' })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                    <input
                      type="color"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                      className="w-12 h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddCategory}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddCategory(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {categories.map(category => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <span className="font-medium text-gray-900">{category.name}</span>
                      <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                        category.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}