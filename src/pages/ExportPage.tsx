import React, { useState, useEffect, createContext, useContext } from 'react';
import { Download, FileText, Calendar, Filter, FileSpreadsheet } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Import du layout
import AppLayout from '../layouts/AppLayout';

// Définition des types pour une meilleure clarté
type ExportFormat = 'pdf' | 'csv';
type ExportPeriod = 'all' | 'current_month' | 'last_month' | 'current_year' | 'custom';
type TransactionType = 'all' | 'revenu' | 'depense';

// Type pour la configuration de l'exportation
interface ExportConfig {
    format: ExportFormat;
    period: ExportPeriod;
    startDate: string;
    endDate: string;
    transactionType: TransactionType;
    includeCategories: boolean;
    includeCharts: boolean;
}

// Type pour l'utilisateur
interface User {
    id: string;
    name: string;
    email: string;
}

// Définition de type pour le contexte d'authentification
interface AuthContextType {
    user: User | null; // Utilisation d'un type plus précis
    logout: () => void;
}

// Placeholder pour le contexte d'authentification
const AuthContext = createContext<AuthContextType>({ user: null, logout: () => {} });
const useAuth = () => useContext(AuthContext);

// Service pour l'exportation des données avec le typage correct
const exportService = {
    exportTransactions: async (config: ExportConfig): Promise<Response> => {
        let url = `/api/export/transactions/${config.format}`;
        const params = new URLSearchParams();

        if (config.startDate) {
            params.append('startDate', config.startDate);
        }
        if (config.endDate) {
            params.append('endDate', config.endDate);
        }
        if (config.transactionType !== 'all') {
            params.append('type', config.transactionType);
        }

        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response;
    }
};

// --- Composant principal de la page d'export ---

const ExportPage: React.FC = () => {
    // La variable 'user' n'est pas utilisée, on ne la déstructure pas pour éviter l'erreur.
    const {} = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [exportConfig, setExportConfig] = useState<ExportConfig>({
        format: 'pdf',
        period: 'all',
        startDate: '',
        endDate: '',
        transactionType: 'all',
        includeCategories: true,
        includeCharts: true
    });

    // Mettre à jour les dates automatiquement en fonction de la période
    useEffect(() => {
        const getDateRange = (period: ExportPeriod): { startDate: string; endDate: string } => {
            const now = new Date();
            let startDate: string;
            let endDate: string;
    
            switch (period) {
                case 'current_month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
                    break;
                case 'last_month':
                    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
                    startDate = lastMonthStart.toISOString().split('T')[0];
                    endDate = lastMonthEnd.toISOString().split('T')[0];
                    break;
                case 'current_year':
                    startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
                    endDate = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];
                    break;
                case 'all':
                    startDate = '2020-01-01'; // Une date arbitrairement lointaine
                    endDate = now.toISOString().split('T')[0];
                    break;
                case 'custom':
                default:
                    startDate = exportConfig.startDate;
                    endDate = exportConfig.endDate;
                    break;
            }
            return { startDate, endDate };
        };

        const { startDate, endDate } = getDateRange(exportConfig.period);
        setExportConfig(prevConfig => ({
            ...prevConfig,
            startDate,
            endDate
        }));
    }, [exportConfig.period, exportConfig.startDate, exportConfig.endDate]);

    const handleExport = async () => {
        setLoading(true);
        try {
            const response = await exportService.exportTransactions(exportConfig);
            const blob = await response.blob();
            
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

    const isDateRangeValid = (): boolean => {
        if (exportConfig.period === 'custom') {
            return (
                !!exportConfig.startDate && 
                !!exportConfig.endDate && 
                new Date(exportConfig.startDate) <= new Date(exportConfig.endDate)
            );
        }
        return true;
    };

    return (
        <AppLayout title="Export des Données">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-text-primary">Export de vos Données</h2>
                    <p className="text-text-secondary mt-2">
                        Téléchargez vos transactions dans différents formats pour analyse ou sauvegarde.
                    </p>
                </div>

                <div className="bg-background-surface p-6 rounded-lg border border-border">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-x-2">
                        <Filter size={20} />
                        Configuration de l'export
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
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
                        
                        <div>
                            <label className="font-medium text-text-primary mb-2 block">Type de transaction</label>
                            <select
                                value={exportConfig.transactionType}
                                onChange={(e) => setExportConfig({ ...exportConfig, transactionType: e.target.value as TransactionType })}
                                className="w-full px-3 py-2 text-text-primary bg-transparent outline-none border focus:border-primary shadow-sm rounded-lg"
                            >
                                <option value="all">Tous les types</option>
                                <option value="revenu">Revenus</option>
                                <option value="depense">Dépenses</option>
                            </select>
                        </div>
                    </div>

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
                            Veuillez sélectionner une période valide.
                        </p>
                    )}
                </div>

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