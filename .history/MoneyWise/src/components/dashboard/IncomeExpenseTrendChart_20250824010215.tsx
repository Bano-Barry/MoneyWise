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
