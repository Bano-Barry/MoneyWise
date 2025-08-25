import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const transactions = [
    { type: 'Revenu', amount: '+ 1,200.00 €', description: 'Mission Freelance', date: '15 Juil 2024' },
    { type: 'Dépense', amount: '- 45.50 €', description: 'Courses alimentaires', date: '14 Juil 2024' },
    { type: 'Dépense', amount: '- 12.00 €', description: 'Ticket de cinéma', date: '13 Juil 2024' },
    { type: 'Dépense', amount: '- 80.00 €', description: 'Facture d\'électricité', date: '12 Juil 2024' },
    { type: 'Revenu', amount: '+ 50.00 €', description: 'Vente en ligne', date: '11 Juil 2024' },
];

const RecentTransactions = () => {
    return (
        <div className="bg-background-surface p-6 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Transactions Récentes</h3>
                <Link to="/transactions" className="text-sm font-medium text-primary hover:text-primary-hover">
                    Voir tout
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-xs text-text-secondary uppercase border-b border-border">
                            <th className="py-3 pr-3">Description</th>
                            <th className="py-3 px-3">Date</th>
                            <th className="py-3 pl-3 text-right">Montant</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((item, index) => (
                            <tr key={index} className="border-b border-border last:border-none">
                                <td className="py-4 pr-3 flex items-center gap-x-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'Revenu' ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'}`}>
                                        {item.type === 'Revenu' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                    </div>
                                    <span className="text-sm font-medium text-text-primary">{item.description}</span>
                                </td>
                                <td className="py-4 px-3 text-sm text-text-secondary">{item.date}</td>
                                <td className={`py-4 pl-3 text-sm font-semibold text-right ${item.type === 'Revenu' ? 'text-positive' : 'text-negative'}`}>
                                    {item.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentTransactions;