import { useState } from 'react';
import AppLayout from '../layouts/AppLayout';
import { Download, FileText, Calendar, BarChart3 } from 'lucide-react';
import ExportModal from '../components/export/ExportModal';

const ExportPage = () => {


  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedExportType, setSelectedExportType] = useState<'transactions' | 'monthly' | 'yearly'>('transactions');

  const exportOptions = [
    {
      title: 'Export des Transactions',
      description: 'Exporter vos transactions en PDF, CSV ou JSON',
      icon: FileText,
      color: '#3B82F6',
      onClick: () => {
        setSelectedExportType('transactions');
        setIsExportModalOpen(true);
      }
    },
    {
      title: 'Rapport Mensuel',
      description: 'Générer un rapport détaillé du mois en cours',
      icon: Calendar,
      color: '#10B981',
      onClick: () => {
        setSelectedExportType('monthly');
        setIsExportModalOpen(true);
      }
    },
    {
      title: 'Rapport Annuel',
      description: 'Vue d\'ensemble complète de l\'année',
      icon: BarChart3,
      color: '#8B5CF6',
      onClick: () => {
        setSelectedExportType('yearly');
        setIsExportModalOpen(true);
      }
    }
  ];



  return (
    <AppLayout title="Exports et Rapports">
      <div className="space-y-6">
        {/* En-tête */}
        <div className="bg-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Download className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Exports et Rapports</h1>
          </div>
          <p className="text-green-100">
            Exportez vos données financières et générez des rapports détaillés pour analyser vos finances
          </p>
        </div>

                {/* Options d'export rapide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exportOptions.map((option, index) => (
            <div
              key={index}
              onClick={option.onClick}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: option.color }}
              >
                <option.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {option.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {option.description}
              </p>
            </div>
          ))}
        </div>


      </div>

      {/* Modal d'export */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        initialExportType={selectedExportType}
      />
    </AppLayout>
  );
};

export default ExportPage;
