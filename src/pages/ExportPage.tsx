import { useState } from 'react';
import AppLayout from '../layouts/AppLayout';
import { Download, FileText, Calendar, Filter, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { exportTransactions } from '../services/exportService';
import toast from 'react-hot-toast';
import type { ExportFormat, ExportPeriod } from '../types';

const ExportPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [exportConfig, setExportConfig] = useState({
        format: 'pdf' as ExportFormat,
        period: 'all' as ExportPeriod,
        startDate: '',
        endDate: '',
        includeCategories: true,
        includeCharts: true
    });

    const getDateRange = (period: ExportPeriod) => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        
        switch (period) {
            case 'current_month':
                return {
                    startDate: startOfMonth.toISOString().split('T')[0],
                    endDate: endOfMonth.toISOString().split('T')[0]
                };
            case 'last_month':
                const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
                return {
                    startDate: lastMonthStart.toISOString().split('T')[0],
                    endDate: lastMonthEnd.toISOString().split('T')[0]
                };
            case 'current_year':
                return {
                    startDate: startOfYear.toISOString().split('T')[0],
                    endDate: endOfYear.toISOString().split('T')[0]
                };
            case 'custom':
                return {
                    startDate: exportConfig.startDate || '',
                    endDate: exportConfig.endDate || ''
                };
            case 'all':
            default:
                // Pour "all", utiliser une période très large
                return {
                    startDate: '2020-01-01',
                    endDate: now.toISOString().split('T')[0]
                };
        }
    };

    const handleExport = async () => {
        setLoading(true);
        try {
            // Convertir la période en dates spécifiques
            const { startDate, endDate } = getDateRange(exportConfig.period);
            
            // Créer la configuration d'export avec les dates
            const exportConfigWithDates = {
                ...exportConfig,
                startDate,
                endDate
            };
            
            const response = await exportTransactions(exportConfigWithDates);
            
            // Créer un lien de téléchargement
            const blob = new Blob([response.data], { 
                type: exportConfig.format === 'pdf' ? 'application/pdf' : 'text/csv' 
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `moneywise-export-${new Date().toISOString().split('T')[0]}.${exportConfig.format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success(`Export ${exportConfig.format.toUpperCase()} généré avec succès !`);
        } catch (error) {
            toast.error("Erreur lors de la génération de l'export.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const isDateRangeValid = () => {
        if (exportConfig.period === 'custom') {
            return exportConfig.startDate && exportConfig.endDate && 
                   new Date(exportConfig.startDate) <= new Date(exportConfig.endDate);
        }
        return true;
    };

    return (
        <AppLayout title="Export des Données">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* En-tête */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-text-primary">Export de vos Données</h2>
                    <p className="text-text-secondary mt-2">
                        Téléchargez vos transactions dans différents formats pour analyse ou sauvegarde
                    </p>
                </div>

                {/* Configuration de l'export */}
                <div className="bg-background-surface p-6 rounded-lg border border-border">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-x-2">
                        <Filter size={20} />
                        Configuration de l'export
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Format d'export */}
                        <div>
                            <label className="font-medium text-text-primary mb-2 block">Format d'export</label>
                            <div className="space-y-3">
                                <label className="flex items-center gap-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="format"
                                        value="pdf"
                                        checked={exportConfig.format === 'pdf'}
                                        onChange={(e) => setExportConfig({ ...exportConfig, format: e.target.value as ExportFormat })}
                                        className="text-primary"
                                    />
                                    <FileText size={20} className="text-negative" />
                                    <span className="text-text-primary">PDF (Rapport détaillé)</span>
                                </label>
                                <label className="flex items-center gap-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="format"
                                        value="csv"
                                        checked={exportConfig.format === 'csv'}
                                        onChange={(e) => setExportConfig({ ...exportConfig, format: e.target.value as ExportFormat })}
                                        className="text-primary"
                                    />
                                    <FileSpreadsheet size={20} className="text-positive" />
                                    <span className="text-text-primary">CSV (Données brutes)</span>
                                </label>
                            </div>
                        </div>

                        {/* Période */}
                        <div>
                            <label className="font-medium text-text-primary mb-2 block">Période</label>
                            <select
                                value={exportConfig.period}
                                onChange={(e) => setExportConfig({ ...exportConfig, period: e.target.value as ExportPeriod })}
                                className="w-full px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                            >
                                <option value="all">Toutes les transactions</option>
                                <option value="current_month">Mois en cours</option>
                                <option value="last_month">Mois dernier</option>
                                <option value="current_year">Année en cours</option>
                                <option value="custom">Période personnalisée</option>
                            </select>
                        </div>
                    </div>

                    {/* Période personnalisée */}
                    {exportConfig.period === 'custom' && (
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="font-medium text-text-primary mb-2 block">Date de début</label>
                                <input
                                    type="date"
                                    value={exportConfig.startDate}
                                    onChange={(e) => setExportConfig({ ...exportConfig, startDate: e.target.value })}
                                    className="w-full px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="font-medium text-text-primary mb-2 block">Date de fin</label>
                                <input
                                    type="date"
                                    value={exportConfig.endDate}
                                    onChange={(e) => setExportConfig({ ...exportConfig, endDate: e.target.value })}
                                    className="w-full px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                                />
                            </div>
                        </div>
                    )}

                    {/* Options supplémentaires pour PDF */}
                    {exportConfig.format === 'pdf' && (
                        <div className="mt-4 space-y-3">
                            <label className="flex items-center gap-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={exportConfig.includeCategories}
                                    onChange={(e) => setExportConfig({ ...exportConfig, includeCategories: e.target.checked })}
                                    className="text-primary"
                                />
                                <span className="text-text-primary">Inclure l'analyse par catégories</span>
                            </label>
                            <label className="flex items-center gap-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={exportConfig.includeCharts}
                                    onChange={(e) => setExportConfig({ ...exportConfig, includeCharts: e.target.checked })}
                                    className="text-primary"
                                />
                                <span className="text-text-primary">Inclure les graphiques</span>
                            </label>
                        </div>
                    )}
                </div>

                {/* Bouton d'export */}
                <div className="text-center">
                    <button
                        onClick={handleExport}
                        disabled={loading || !isDateRangeValid()}
                        className="flex items-center gap-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed mx-auto"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Génération en cours...
                            </>
                        ) : (
                            <>
                                <Download size={20} />
                                Exporter en {exportConfig.format.toUpperCase()}
                            </>
                        )}
                    </button>
                    
                    {exportConfig.period === 'custom' && !isDateRangeValid() && (
                        <p className="text-negative text-sm mt-2">
                            Veuillez sélectionner une période valide
                        </p>
                    )}
                </div>

                {/* Informations */}
                <div className="bg-background-surface p-6 rounded-lg border border-border">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Informations sur l'export</h3>
                    <div className="space-y-3 text-text-secondary">
                        <div className="flex items-start gap-x-3">
                            <FileText size={16} className="mt-1 text-primary" />
                            <div>
                                <p className="font-medium text-text-primary">Format PDF</p>
                                <p>Rapport détaillé avec résumé, graphiques et analyse par catégories. Idéal pour présentation ou sauvegarde.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-x-3">
                            <FileSpreadsheet size={16} className="mt-1 text-primary" />
                            <div>
                                <p className="font-medium text-text-primary">Format CSV</p>
                                <p>Données brutes au format tableur. Compatible avec Excel, Google Sheets et autres outils d'analyse.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-x-3">
                            <Calendar size={16} className="mt-1 text-primary" />
                            <div>
                                <p className="font-medium text-text-primary">Périodes disponibles</p>
                                <p>Exportez toutes vos données ou filtrez par période pour des analyses ciblées.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ExportPage;
