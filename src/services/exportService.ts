import axios from 'axios';

// Configuration de l'API - utiliser l'URL Render par défaut
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://moneywise-backend-187q.onrender.com/api';

// Interface pour les paramètres d'export
interface ExportParams {
  startDate: string;
  endDate: string;
  type?: 'revenu' | 'depense';
}

// Interface pour les paramètres de rapport
interface ReportParams {
  year: number;
  month?: number;
  format?: 'pdf' | 'json' | 'csv';
}

class ExportService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Méthode générique pour télécharger un fichier depuis le backend
  private async downloadFile(url: string, filename: string): Promise<void> {
    try {
      console.log('🔗 Tentative de téléchargement depuis:', url);
      
      const headers = this.getAuthHeaders();
      console.log('🔑 Headers d\'authentification:', { Authorization: headers.Authorization ? 'Bearer [TOKEN]' : 'Manquant' });
      
      const response = await axios.get(url, {
        headers,
        responseType: 'blob',
        timeout: 60000, // Augmenter le timeout à 60 secondes
        validateStatus: (status) => {
          // Accepter les statuts 200-299
          return status >= 200 && status < 300;
        }
      });

      console.log('✅ Réponse reçue:', response.status, 'Content-Type:', response.headers['content-type']);

      if (!response.data || response.data.size === 0) {
        throw new Error('Le serveur a retourné un fichier vide');
      }

      // Créer le blob avec le type MIME approprié
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/octet-stream'
      });
      
      console.log('📄 Blob créé:', { size: blob.size, type: blob.type });
      
      // Télécharger le fichier
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Nettoyer l'URL
      setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);
      
      console.log('🎉 Fichier téléchargé avec succès:', filename, 'Taille:', blob.size);
    } catch (error: any) {
      console.error('❌ Erreur téléchargement:', error);
      
      // Gestion spécifique des erreurs
      if (error.response) {
        const { status, data } = error.response;
        console.error('📊 Détails de l\'erreur:', { status, data });
        
        if (status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        } else if (status === 403) {
          throw new Error('Accès refusé. Vérifiez vos permissions.');
        } else if (status === 404) {
          throw new Error('Service d\'export non disponible.');
        } else if (status === 500) {
          throw new Error('Erreur serveur interne. Veuillez réessayer plus tard.');
        } else {
          throw new Error(`Erreur serveur (${status}): ${data?.message || 'Erreur inconnue'}`);
        }
      } else if (error.request) {
        throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
      } else {
        throw new Error(`Erreur: ${error.message}`);
      }
    }
  }

  // Export des transactions - tous formats
  async exportTransactions(params: ExportParams, format: 'pdf' | 'csv' | 'json'): Promise<void> {
    const { startDate, endDate, type } = params;
    
    // Validation des paramètres
    if (!startDate || !endDate) {
      throw new Error('Les dates de début et de fin sont requises');
    }

    // Construire les paramètres de requête
    const queryParams = new URLSearchParams({
      startDate,
      endDate,
      ...(type && { type })
    });

    const url = `${API_BASE_URL}/export/transactions/${format}?${queryParams}`;
    const filename = `transactions_${startDate}_${endDate}.${format}`;

    console.log(`📊 Export ${format.toUpperCase()} - URL:`, url);
    console.log(`📋 Paramètres:`, { startDate, endDate, type });
    
    await this.downloadFile(url, filename);
  }

  // Générer un rapport mensuel
  async generateMonthlyReport(params: ReportParams): Promise<void> {
    const { year, month, format = 'pdf' } = params;
    
    if (!month) {
      throw new Error('Le mois est requis pour le rapport mensuel');
    }

    let url: string;
    let filename: string;

    if (format === 'pdf') {
      url = `${API_BASE_URL}/export/report/monthly/${year}/${month}/pdf`;
      filename = `rapport_mensuel_${year}_${month.toString().padStart(2, '0')}.pdf`;
    } else {
      url = `${API_BASE_URL}/export/report/monthly/${year}/${month}?format=${format}`;
      filename = `rapport_mensuel_${year}_${month.toString().padStart(2, '0')}.${format}`;
    }

    console.log(`📊 Rapport mensuel ${format.toUpperCase()} - URL:`, url);
    console.log(`📋 Paramètres:`, { year, month, format });
    
    await this.downloadFile(url, filename);
  }

  // Générer un rapport annuel
  async generateYearlyReport(params: ReportParams): Promise<void> {
    const { year, format = 'json' } = params;

    const url = `${API_BASE_URL}/export/report/yearly/${year}?format=${format}`;
    const filename = `rapport_annuel_${year}.${format}`;

    console.log(`📊 Rapport annuel ${format.toUpperCase()} - URL:`, url);
    console.log(`📋 Paramètres:`, { year, format });
    
    await this.downloadFile(url, filename);
  }

  // Méthodes utilitaires pour la compatibilité
  generateFilename(type: string, startDate: string, endDate: string, format: string): string {
    return `${type}_${startDate}_${endDate}.${format}`;
  }

  generateReportFilename(type: 'monthly' | 'yearly', year: number, format: string, month?: number): string {
    if (type === 'monthly' && month) {
      return `rapport_mensuel_${year}_${month.toString().padStart(2, '0')}.${format}`;
    }
    return `rapport_annuel_${year}.${format}`;
  }

  // Méthode pour tester la connexion à l'API
  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, {
        timeout: 5000
      });
      console.log('✅ Connexion API OK:', response.status);
      return true;
    } catch (error) {
      console.error('❌ Connexion API échouée:', error);
      return false;
    }
  }
}

export default new ExportService();
