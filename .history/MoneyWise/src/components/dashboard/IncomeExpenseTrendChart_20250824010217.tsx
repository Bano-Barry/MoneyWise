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
