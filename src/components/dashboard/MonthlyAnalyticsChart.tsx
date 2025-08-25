import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenus: 4000, depenses: 2400 },
  { name: 'Fév', revenus: 3000, depenses: 1398 },
  { name: 'Mar', revenus: 2000, depenses: 9800 },
  { name: 'Avr', revenus: 2780, depenses: 3908 },
  { name: 'Mai', revenus: 1890, depenses: 4800 },
  { name: 'Juin', revenus: 2390, depenses: 3800 },
  { name: 'Juil', revenus: 3490, depenses: 4300 },
];

const MonthlyAnalyticsChart = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return <div className="bg-background-surface p-6 rounded-lg border border-border h-[400px]"></div>; // Placeholder
    }

    return (
        <div className="bg-background-surface p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
                Évolution Mensuelle
            </h3>
            <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--color-border))" />
                        <XAxis dataKey="name" stroke="rgba(var(--color-text-secondary))" />
                        <YAxis stroke="rgba(var(--color-text-secondary))" />
                        <Tooltip
                            cursor={{ fill: 'rgba(var(--color-border), 0.5)' }}
                            contentStyle={{ backgroundColor: 'rgba(var(--color-background-surface))', border: '1px solid rgba(var(--color-border))' }}
                        />
                        <Legend />
                        <Bar dataKey="revenus" fill="rgba(var(--color-positive))" name="Revenus" />
                        <Bar dataKey="depenses" fill="rgba(var(--color-negative))" name="Dépenses" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MonthlyAnalyticsChart;