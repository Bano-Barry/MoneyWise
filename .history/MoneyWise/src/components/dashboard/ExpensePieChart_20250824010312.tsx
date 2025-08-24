import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const DATA = [
  { name: 'Alimentation', value: 400, color: '#22c55e' },      // vert
  { name: 'Loyer',        value: 300, color: '#eab308' },      // jaune
  { name: 'Transport',    value: 300, color: '#06b6d4' },      // cyan
  { name: 'Loisirs',      value: 200, color: '#8b5cf6' },      // violet
]

const Label = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null
  const RAD = Math.PI / 180
  const r   = innerRadius + (outerRadius - innerRadius) * 0.7
  const x   = cx + r * Math.cos(-midAngle * RAD)
  const y   = cy + r * Math.sin(-midAngle * RAD)
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
          className="text-[11px] font-bold fill-white pointer-events-none">
      {(percent * 100).toFixed(0)}%
    </text>
  )
}

export default function ExpensePieChart () {
  /*  ⬇  empêchera tout rendu côté SSR / double rendu strict-mode */
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  // Trouver la catégorie la plus dépensée
  const maxExpenseCategory = DATA.reduce((max, category) =>
    category.value > max.value ? category : max, DATA[0]
  );

  // Calculer le pourcentage total des dépenses
  const totalExpenses = DATA.reduce((sum, category) => sum + category.value, 0);

  // Calculer le pourcentage de la catégorie la plus dépensée
  const maxCategoryPercentage = (maxExpenseCategory.value / totalExpenses) * 100;

  return (
    <div className="bg-background-surface p-6 rounded-lg border border-border">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Répartition des dépenses
      </h3>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={DATA}
                 dataKey="value"
                 cx="50%" cy="50%"
                 outerRadius={140}
                 labelLine={false}
                 label={Label}>
              {DATA.map((e, i) => <Cell key={i} fill={e.color}/>)}
            </Pie>
            <Tooltip formatter={(v: number, n: string) => [`${v} €`, n]} />
            {/* <Legend />   */}
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Affichage de la catégorie la plus dépensée */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary">Catégorie la plus dépensée</p>
            <p className="font-semibold text-text-primary">{maxExpenseCategory.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-secondary">Pourcentage des dépenses</p>
            <p className="font-semibold text-text-primary">{maxCategoryPercentage.toFixed(1)}%</p>
          </div>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full"
            style={{ width: `${maxCategoryPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}