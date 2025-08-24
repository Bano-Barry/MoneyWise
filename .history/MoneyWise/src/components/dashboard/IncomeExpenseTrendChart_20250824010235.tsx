import { useEffect, useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';

// Données factices pour différentes périodes
const dailyData = [
  { period: 'Lun', revenus: 120000, depenses: 80000 },
  { period: 'Mar', revenus: 90000, depenses: 75000 },
  { period: 'Mer', revenus: 150000, depenses: 95000 },
  { period: 'Jeu', revenus: 110000, depenses: 85000 },
  { period: 'Ven', revenus: 130000, depenses: 90000 },
  { period: 'Sam', revenus: 80000, depenses: 65000 },
  { period: 'Dim', revenus: 70000, depenses: 60000 },
];

const weeklyData = [
  { period: 'Sem 1', revenus: 750000, depenses: 520000 },
  { period: 'Sem 2', revenus: 820000, depenses: 580000 },
  { period: 'Sem 3', revenus: 780000, depenses: 550000 },
  { period: 'Sem 4', revenus: 850000, depenses: 600000 },
];

const monthlyData = [
  { period: 'Jan', revenus: 3200000, depenses: 2100000 },
  { period: 'Fév', revenus: 3500000, depenses: 2300000 },
  { period: 'Mar', revenus: 3100000, depenses: 2000000 },
  { period: 'Avr', revenus: 3800000, depenses: 2500000 },
  { period: 'Mai', revenus: 3600000, depenses: 2400000 },
  { period: 'Juin', revenus: 3900000, depenses: 2600000 },
  { period: 'Juil', revenus: 4200000, depenses: 2800000 },
];

const IncomeExpenseTrendChart = () => {
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="bg-background-surface p-6 rounded-lg border border-border h-[400px]"></div>; // Placeholder
  }

  // Sélectionner les données en fonction de la période
  const getData = () => {
    switch (period) {
      case 'daily': return dailyData;
      case 'weekly': return weeklyData;
      case 'monthly': return monthlyData;
      default: return monthlyData;
    }
  };

  const data = getData();

  return (
    <div className="bg-background-surface p-6 rounded-lg border border-border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-text-primary">
          Évolution des Revenus et Dépenses
        </h3>
        
        <div className="flex flex-wrap gap-3">
          {/* Sélecteur de période */}
          <div className="flex bg-background-surface border border-border rounded-lg p-1">
            <button 
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                period === 'daily' 
                  ? 'bg-primary text-white' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setPeriod('daily')}
            >
              Jour
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                period === 'weekly' 
                  ? 'bg-primary text-white' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setPeriod('weekly')}
            >
              Semaine
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                period === 'monthly' 
                  ? 'bg-primary text-white' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setPeriod('monthly')}
            >
              Mois
            </button>
          </div>
          
          {/* Sélecteur de type de graphique */}
          <div className="flex bg-background-surface border border-border rounded-lg p-1">
            <button 
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                chartType === 'line' 
                  ? 'bg-primary text-white' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setChartType('line')}
            >
              Lignes
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                chartType === 'bar' 
                  ? 'bg-primary text-white' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              onClick={() => setChartType('bar')}
            >
              Barres
            </button>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          {chartType === 'line' ? (
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--color-border))" />
              <XAxis dataKey="period" stroke="rgba(var(--color-text-secondary))" />
              <YAxis stroke="rgba(var(--color-text-secondary))" />
              <Tooltip
                cursor={{ fill: 'rgba(var(--color-border), 0.5)' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(var(--color-background-surface))', 
                  border: '1px solid rgba(var(--color-border))' 
                }}
                formatter={(value) => [`${Number(value).toLocaleString()} FCFA`, '']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenus" 
                name="Revenus" 
                stroke="rgba(var(--color-positive))" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="depenses" 
                name="Dépenses" 
                stroke="rgba(var(--color-negative))" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <BarChart
              data={data}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--color-border))" />
              <XAxis dataKey="period" stroke="rgba(var(--color-text-secondary))" />
              <YAxis stroke="rgba(var(--color-text-secondary))" />
              <Tooltip
                cursor={{ fill: 'rgba(var(--color-border), 0.5)' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(var(--color-background-surface))', 
                  border: '1px solid rgba(var(--color-border))' 
                }}
                formatter={(value) => [`${Number(value).toLocaleString()} FCFA`, '']}
              />
              <Legend />
              <Bar 
                dataKey="revenus" 
                name="Revenus" 
                fill="rgba(var(--color-positive))" 
              />
              <Bar 
                dataKey="depenses" 
                name="Dépenses" 
                fill="rgba(var(--color-negative))" 
              />
            </BarChart>
          )}
