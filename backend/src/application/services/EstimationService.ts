// Service - Estimation de prix

import { AnalysisData, BuildingType, EstimationData } from '../../domain/entities/Project.js';

export class EstimationService {
  // Prix de base au m² selon le type de bâtiment
  private readonly BASE_PRICES = {
    facade_simple: { min: 90, max: 110 },
    facade_complexe: { min: 110, max: 130 },
    toiture: { min: 100, max: 120 },
    mixte: { min: 105, max: 125 },
  };

  calculate(analysisData: AnalysisData, location: string = 'France'): EstimationData {
    const surface = analysisData.surface_estimee_m2;
    const type = analysisData.type_batiment;

    // Déterminer si façade simple ou complexe (basé sur obstacles)
    const isComplexFacade =
      type === 'facade' &&
      (analysisData.obstacles.length > 2 || analysisData.materiaux_visibles.length > 3);

    // Prix de base
    let priceRange = this.BASE_PRICES[type];
    if (type === 'facade') {
      priceRange = isComplexFacade
        ? this.BASE_PRICES.facade_complexe
        : this.BASE_PRICES.facade_simple;
    }

    let prixM2Min = priceRange.min;
    let prixM2Max = priceRange.max;

    // Multiplicateurs de surface
    if (surface < 50) {
      prixM2Min *= 1.15; // +15% pour petites surfaces
      prixM2Max *= 1.15;
    } else if (surface > 200) {
      prixM2Min *= 0.9; // -10% économies d'échelle
      prixM2Max *= 0.9;
    }

    // Multiplicateur localisation (IDF + cher)
    if (location.toLowerCase().includes('paris') || location.toLowerCase().includes('île-de-france')) {
      prixM2Min *= 1.1;
      prixM2Max *= 1.1;
    }

    // Calcul prix total
    const prixTotalMin = Math.round(surface * prixM2Min);
    const prixTotalMax = Math.round(surface * prixM2Max);

    // Aides financières (crédit d'impôt 30%)
    const creditImpotMin = Math.round(prixTotalMin * 0.3);
    const creditImpotMax = Math.round(prixTotalMax * 0.3);
    const coutNetMin = prixTotalMin - creditImpotMin;
    const coutNetMax = prixTotalMax - creditImpotMax;

    return {
      surface_m2: surface,
      type_batiment: type,
      prix_base_min: prixTotalMin,
      prix_base_max: prixTotalMax,
      prix_total_min: prixTotalMin,
      prix_total_max: prixTotalMax,
      prix_m2_min: Math.round(prixM2Min),
      prix_m2_max: Math.round(prixM2Max),
      localisation: location,
      aides_financieres: {
        credit_impot_30_min: creditImpotMin,
        credit_impot_30_max: creditImpotMax,
        cout_net_min: coutNetMin,
        cout_net_max: coutNetMax,
      },
    };
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  formatPriceRange(min: number, max: number): string {
    return `${this.formatPrice(min)} - ${this.formatPrice(max)}`;
  }
}
