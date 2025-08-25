import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRecentTransactions, type Transaction } from '../../services/transactionService';
import toast from 'react-hot-toast';

const RecentTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentTransactions = async () => {
            try {
                setLoading(true);
                const data = await getRecentTransactions(5);
                setTransactions(data);
            } catch (error) {
                console.error('Erreur lors du chargement des transactions récentes:', error);
                toast.error('Erreur lors du chargement des transactions récentes');
            } finally {
                setLoading(false);
            }
        };

        fetchRecentTransactions();
    }, []);

    const formatCurrency = (amount: number | null | undefined): string => {
        // Contrôle pour éviter NaN
        const safeAmount = amount && !isNaN(amount) ? amount : 0;
        
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(safeAmount);
    };

    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return 'Date inconnue';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Date invalide';
            
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (error) {
            return 'Date invalide';
        }
    };

    if (loading) {
        return (
            <div className="bg-background-surface p-6 rounded-lg border border-border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">Transactions Récentes</h3>
                    <Link to="/transactions" className="text-sm font-medium text-primary hover:text-primary-hover">
                        Voir tout
                    </Link>
                </div>
                <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    // Filtrer et sécuriser les transactions
    const safeTransactions = transactions
        .filter(transaction => transaction && transaction.id)
        .map(transaction => ({
            ...transaction,
            montant: transaction.montant && !isNaN(transaction.montant) ? transaction.montant : 0,
            description: transaction.description || 'Description manquante',
            type: transaction.type || 'depense'
        }));

    return (
        <div className="bg-background-surface p-6 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Transactions Récentes</h3>
                <Link to="/transactions" className="text-sm font-medium text-primary hover:text-primary-hover">
                    Voir tout
                </Link>
            </div>
            <div className="overflow-x-auto">
                {safeTransactions.length === 0 ? (
                    <div className="text-center py-8 text-text-secondary">
                        Aucune transaction récente
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs text-text-secondary uppercase border-b border-border">
                                <th className="py-3 pr-3">Description</th>
                                <th className="py-3 px-3">Date</th>
                                <th className="py-3 pl-3 text-right">Montant</th>
                            </tr>
                        </thead>
                        <tbody>
                            {safeTransactions.map((transaction) => (
                                <tr key={transaction.id} className="border-b border-border last:border-none">
                                    <td className="py-4 pr-3 flex items-center gap-x-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${transaction.type === 'revenu' ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'}`}>
                                            {transaction.type === 'revenu' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                        </div>
                                        <span className="text-sm font-medium text-text-primary">{transaction.description}</span>
                                    </td>
                                    <td className="py-4 px-3 text-sm text-text-secondary">{formatDate(transaction.date_transaction)}</td>
                                    <td className={`py-4 pl-3 text-sm font-semibold text-right ${transaction.type === 'revenu' ? 'text-positive' : 'text-negative'}`}>
                                        {transaction.type === 'revenu' ? '+' : '-'} {formatCurrency(transaction.montant)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default RecentTransactions;