import React, { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet, FileJson, Calendar } from 'lucide-react';
import exportService from '../../services/exportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialExportType?: 'transactions' | 'monthly' | 'yearly';
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, initialExportType = 'transactions' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [exportType, setExportType] = useState<'transactions' | 'monthly' | 'yearly'>(initialExportType);
  const [format, setFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [transactionType, setTransactionType] = useState<'all' | 'revenu' | 'depense'>('all');

  // Mettre à jour le type d'export quand le modal s'ouvre
  React.useEffect(() => {
    if (isOpen && initialExportType) {
      setExportType(initialExportType);
    }
  }, [isOpen, initialExportType]);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsLoading(true);
    try {
      console.log('🚀 Début de l\'export:', { exportType, format });

      // Test de connexion à l'API avant l'export
      const isConnected = await exportService.testConnection();
      if (!isConnected) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
      }

      if (exportType === 'transactions') {
        if (!startDate || !endDate) {
          alert('Veuillez sélectionner une période pour l\'export des transactions');
          return;
        }

        const params = {
          startDate,
          endDate,
          ...(transactionType !== 'all' && { type: transactionType })
        };

        console.log('📋 Paramètres d\'export transactions:', params);
        await exportService.exportTransactions(params, format);
        
      } else if (exportType === 'monthly') {
        console.log('📊 Paramètres rapport mensuel:', { year, month, format });
        await exportService.generateMonthlyReport({ year, month, format });
        
      } else if (exportType === 'yearly') {
        console.log('📅 Paramètres rapport annuel:', { year, format });
        await exportService.generateYearlyReport({ year, format });
      }

      // Message de succès
      alert('✅ Export réussi ! Le fichier a été téléchargé.');
      onClose();
    } catch (error) {
      console.error('❌ Erreur lors de l\'export:', error);
      
      let errorMessage = 'Erreur inconnue';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Messages d'erreur plus spécifiques
        if (errorMessage.includes('Token d\'authentification manquant')) {
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        } else if (errorMessage.includes('Impossible de se connecter au serveur')) {
          errorMessage = 'Le serveur backend n\'est pas accessible. Vérifiez qu\'il est démarré sur http://localhost:3000';
        } else if (errorMessage.includes('Erreur serveur interne')) {
          errorMessage = 'Erreur 500 du serveur. Vérifiez les logs du backend pour plus de détails.';
        } else if (errorMessage.includes('Service d\'export non disponible')) {
          errorMessage = 'L\'endpoint d\'export n\'est pas disponible. Vérifiez la configuration du backend.';
        }
      }
      
      alert(`❌ Erreur lors de l'export:\n\n${errorMessage}\n\nVeuillez vérifier votre connexion et réessayer.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction utilitaire pour formater les dates en J-M-AAAA
  const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getCurrentMonthRange = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);
  };

  const getCurrentYearRange = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), 0, 1);
    const lastDay = new Date(now.getFullYear(), 11, 31);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Exporter les données
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Type d'export */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type d'export
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setExportType('transactions')}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                exportType === 'transactions'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              <FileText className="w-4 h-4 mx-auto mb-1" />
              Transactions
            </button>
            <button
              onClick={() => setExportType('monthly')}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                exportType === 'monthly'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              <Calendar className="w-4 h-4 mx-auto mb-1" />
              Mensuel
            </button>
            <button
              onClick={() => setExportType('yearly')}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                exportType === 'yearly'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              <Calendar className="w-4 h-4 mx-auto mb-1" />
              Annuel
            </button>
          </div>
        </div>

        {/* Format */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setFormat('pdf')}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                format === 'pdf'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              <FileText className="w-4 h-4 mx-auto mb-1" />
              PDF
            </button>
            <button
              onClick={() => setFormat('csv')}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                format === 'csv'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 mx-auto mb-1" />
              CSV
            </button>
            <button
              onClick={() => setFormat('json')}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                format === 'json'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              <FileJson className="w-4 h-4 mx-auto mb-1" />
              JSON
            </button>
          </div>
        </div>

        {/* Paramètres spécifiques */}
        {exportType === 'transactions' && (
          <>
            {/* Période */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Période
              </label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={getCurrentMonthRange}
                  className="p-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border"
                >
                  Mois en cours
                </button>
                <button
                  onClick={getCurrentYearRange}
                  className="p-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border"
                >
                  Année en cours
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded text-sm w-full"
                    placeholder="Date de début"
                  />
                  {startDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDateForDisplay(startDate)}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 border border-gray-300 dark:border-gray-600 rounded text-sm w-full"
                    placeholder="Date de fin"
                  />
                  {endDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDateForDisplay(endDate)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Type de transaction */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type de transaction
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTransactionType('all')}
                  className={`p-2 rounded border text-sm font-medium transition-colors ${
                    transactionType === 'all'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setTransactionType('revenu')}
                  className={`p-2 rounded border text-sm font-medium transition-colors ${
                    transactionType === 'revenu'
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  Revenus
                </button>
                <button
                  onClick={() => setTransactionType('depense')}
                  className={`p-2 rounded border text-sm font-medium transition-colors ${
                    transactionType === 'depense'
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  Dépenses
                </button>
              </div>
            </div>
          </>
        )}

        {exportType === 'monthly' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mois et année
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>
                    {new Date(2024, m - 1).toLocaleDateString('fr-FR', { month: 'long' })}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded text-sm"
                placeholder="Année"
              />
            </div>
          </div>
        )}

        {exportType === 'yearly' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Année
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm"
              placeholder="Année"
            />
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 p-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleExport}
            disabled={isLoading}
            className="flex-1 p-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Export...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Exporter
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
