import api from "./api";
import type { ExportConfig } from "../types";

// Export des transactions
export const exportTransactions = async (config: ExportConfig): Promise<any> => {
  const { format, period, startDate, endDate } = config;
  
  // Construire les paramètres de requête
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const url = format === 'csv' 
    ? `/export/transactions/csv?${params.toString()}`
    : `/export/transactions/pdf?${params.toString()}`;
    
  const response = await api.get(url, {
    responseType: 'blob'
  });
  return response;
};

// Export des rapports
export const exportReports = async (config: ExportConfig): Promise<any> => {
  const { format, period, startDate, endDate } = config;
  
  // Construire les paramètres de requête
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const url = format === 'csv' 
    ? `/export/reports/csv?${params.toString()}`
    : `/export/reports/pdf?${params.toString()}`;
    
  const response = await api.get(url, {
    responseType: 'blob'
  });
  return response;
};
