import AppLayout from '../layouts/AppLayout';
import { Plus, ArrowUpRight, ArrowDownLeft, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

// Données factices étendues
const allTransactions = [
    { type: 'Revenu', amount: '+ 1,200.00 €', description: 'Mission Freelance', category: 'Travail', date: '15 Juil 2024' },
    { type: 'Dépense', amount: '- 45.50 €', description: 'Courses alimentaires', category: 'Alimentation', date: '14 Juil 2024' },
    { type: 'Dépense', amount: '- 12.00 €', description: 'Ticket de cinéma', category: 'Loisirs', date: '13 Juil 2024' },
    { type: 'Dépense', amount: '- 80.00 €', description: 'Facture d\'électricité', category: 'Factures', date: '12 Juil 2024' },
    { type: 'Revenu', amount: '+ 50.00 €', description: 'Vente en ligne', category: 'Autre', date: '11 Juil 2024' },
    { type: 'Dépense', amount: '- 25.00 €', description: 'Restaurant', category: 'Alimentation', date: '10 Juil 2024' },
    { type: 'Dépense', amount: '- 5.50 €', description: 'Café', category: 'Loisirs', date: '09 Juil 2024' },
];

const TransactionsPage = () => {
    return (
        <AppLayout title="Transactions">
            <div className="space-y-6">
                {/* Header de la page */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold text-text-primary">Toutes les Transactions</h2>
                        <p className="mt-1 text-text-secondary">Consultez et gérez l'historique de vos mouvements financiers.</p>
                    </div>
                    <Link to="/add-transaction" className="flex items-center gap-x-2 bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-primary-hover">
                        <Plus size={20} />
                        Ajouter
                    </Link>
                </div>

                {/* Filtres */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Filtres à implémenter ici */}
                </div>

                {/* Tableau des transactions */}
                <div className="bg-background-surface rounded-lg border border-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs text-text-secondary uppercase border-b border-border">
                                <tr>
                                    <th className="py-3 px-6">Description</th>
                                    <th className="py-3 px-6">Catégorie</th>
                                    <th className="py-3 px-6">Date</th>
                                    <th className="py-3 px-6 text-right">Montant</th>
                                    <th className="py-3 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {allTransactions.map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-4 px-6 flex items-center gap-x-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'Revenu' ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'}`}>
                                                {item.type === 'Revenu' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                                            </div>
                                            <span className="font-medium text-text-primary">{item.description}</span>
                                        </td>
                                        <td className="py-4 px-6 text-text-secondary">{item.category}</td>
                                        <td className="py-4 px-6 text-text-secondary">{item.date}</td>
                                        <td className={`py-4 px-6 font-semibold text-right ${item.type === 'Revenu' ? 'text-positive' : 'text-negative'}`}>
                                            {item.amount}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button className="text-text-secondary hover:text-primary">
                                                <MoreVertical size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default TransactionsPage;