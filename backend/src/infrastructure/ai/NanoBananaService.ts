// Service - Intégration Nano Banana AI avec prompts DEMET'AIR

import axios, { AxiosInstance } from 'axios';
import { config } from '../../config/index.js';
import { AnalysisData } from '../../domain/entities/Project.js';

export interface GenerationOptions {
  userDescription?: string;
  typeStructure?: 'facade' | 'mur' | 'toiture';
}

export class NanoBananaService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.NANO_BANANA_BASE_URL,
      headers: {
        'Authorization': `Bearer ${config.NANO_BANANA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: config.AI_GENERATION_TIMEOUT,
    });
  }

  /**
   * Étape 1 : Analyse détaillée de l'image avec prompt professionnel DEMET'AIR
   */
  async analyzeImage(imageUrl: string, userDescription?: string, typeStructure: string = 'facade'): Promise<AnalysisData> {
    const prompt = this.buildAnalysisPromptDemetAir(typeStructure, userDescription);

    try {
      const response = await this.client.post('/analyze', {
        image_url: imageUrl,
        prompt,
        model: config.NANO_BANANA_MODEL,
      });

      // Parse la réponse JSON retournée par l'IA
      const analysisData = this.parseAnalysisResponse(response.data);
      return analysisData;
    } catch (error) {
      console.error('Nano Banana analysis error:', error);
      throw new Error('Échec de l\'analyse de l\'image');
    }
  }

  /**
   * Étape 2 : Génération image végétalisée avec prompt détaillé DEMET'AIR
   */
  async generateVegetalizedImage(
    originalImageUrl: string,
    analysisData: AnalysisData,
    options: GenerationOptions = {}
  ): Promise<string> {
    const prompt = this.buildGenerationPromptDemetAir(
      analysisData,
      options.typeStructure || 'facade',
      options.userDescription
    );

    try {
      const response = await this.client.post('/generate', {
        image_url: originalImageUrl,
        prompt,
        model: config.NANO_BANANA_MODEL,
        steps: 50, // Augmenté pour meilleure qualité
        guidance_scale: 8,
        resolution: '1024x1024',
      });

      // L'API retourne l'URL de l'image générée
      return response.data.generated_image_url;
    } catch (error) {
      console.error('Nano Banana generation error:', error);
      throw new Error('Échec de la génération de l\'image végétalisée');
    }
  }

  /**
   * Construit le prompt d'analyse détaillé DEMET'AIR (Étape 1)
   */
  private buildAnalysisPromptDemetAir(typeStructure: string, userDescription?: string): string {
    const TYPE_STRUCTURE = typeStructure === 'toiture' ? 'toiture' : 'façade maison';

    let prompt = `RÔLE : Tu es un architecte paysagiste professionnel spécialisé en végétalisation de façades et murs végétaux. Tu dois analyser cette image pour préparer une végétalisation réaliste.

CONTEXTE : L'utilisateur fournit une photo de ${TYPE_STRUCTURE}.

OBJECTIF : Analyser l'image et retourner les données structurées pour végétalisation.

⚠️ ATTENTION CRITIQUE : Si la photo contient PLUSIEURS façades ou murs visibles, identifier PRÉCISÉMENT celle/celui à végétaliser.

═══════════════════════════════════════════════════════════
ANALYSE REQUISE (Format JSON obligatoire)
═══════════════════════════════════════════════════════════

Retourne UNIQUEMENT un JSON avec cette structure exacte :

{
  "surface_estimee_m2": <nombre estimé>,
  "type_batiment": "${typeStructure === 'toiture' ? 'toiture' : 'facade'}",
  "orientation": "<nord|sud|est|ouest>",
  "materiaux_visibles": ["<matériau1>", "<matériau2>"],
  "obstacles": ["<obstacle1>", "<obstacle2>"],
  "vegetation_actuelle": <true|false>,
  "densite_recommandee": "<faible|moyenne|dense>",
  "especes_suggerees": ["Sedum acre", "Chlorophytum", "Nephrolepis", "..."],
  "description_photo": "<description détaillée de ce qui est visible>",
  "facade_a_vegetaliser": "<identification précise de LA façade à végétaliser>",
  "facades_a_exclure": ["<façade1 à ne pas végétaliser>", "<façade2>"],
  "zone_vegetaliser": "<description précise de la surface à couvrir>",
  "zone_exclure": ["fenêtres", "portes", "gouttières", "..."]
}

ANALYSE DÉTAILLÉE :

1. **Identification des zones :**
   - Décrire toutes les façades/murs visibles
   - Identifier PRÉCISÉMENT celle à végétaliser (position, exposition)
   - Lister explicitement les autres à EXCLURE

2. **Calcul surface :**
   - Estimer hauteur × largeur de la zone à végétaliser
   - Exclure ouvertures (fenêtres, portes) avec marge 15cm

3. **Obstacles à exclure :**
   - Fenêtres et encadrements (marge 15cm)
   - Portes et encadrements (marge 15cm)
   - Velux, lucarnes, cheminées
   - Gouttières, descentes d'eau
   - Luminaires, boîtes aux lettres
   - Plaques, numéros de maison
   - Angles du bâtiment (marge 10cm)

4. **Recommandations végétales :**
   - Pour FAÇADE/MUR : Privilégier Sedums (40%), Chlorophytum (30%), Fougères (15%), Succulentes (15%)
   - Pour TOITURE : Privilégier Sedums variés (50%), Graminées (25%), Thym (15%), Vivaces (10%)
   - Densité recommandée : "dense" pour panneau Demet'air (90-95% couverture)`;

    if (userDescription) {
      prompt += `\n\n**CONTRAINTE UTILISATEUR :**\n"${userDescription}"`;
    }

    prompt += `\n\nRetourne UNIQUEMENT le JSON, sans texte supplémentaire.`;

    return prompt;
  }

  /**
   * Construit le prompt de génération détaillé DEMET'AIR (Étape 2)
   */
  private buildGenerationPromptDemetAir(
    analysisData: AnalysisData,
    typeStructure: string,
    userDescription?: string
  ): string {
    const isToiture = typeStructure === 'toiture';

    let prompt = `Tu es un architecte paysagiste professionnel spécialisé en végétalisation de façades et murs végétaux. Ta mission est de créer une image ULTRA-RÉALISTE montrant la structure végétalisée selon les spécifications DEMET'AIR.

TYPE DE PROJET : ${isToiture ? 'Toiture végétalisée' : 'Façade/Mur végétalisé avec Panneau DEMET\'AIR'}

═══════════════════════════════════════════════════════════
SPÉCIFICATIONS DE VÉGÉTALISATION
═══════════════════════════════════════════════════════════

**ZONE À VÉGÉTALISER :**
- Surface : ${analysisData.surface_estimee_m2} m²
- Type : ${analysisData.type_batiment}
- Orientation : ${analysisData.orientation}
- Densité : ${analysisData.densite_recommandee} (${analysisData.densite_recommandee === 'dense' ? '90-95%' : '80-85%'} de couverture)

**OBSTACLES À EXCLURE ABSOLUMENT :**
${analysisData.obstacles.map(obs => `- ${obs}`).join('\n')}
⚠️ Marge de sécurité : 15cm autour des fenêtres/portes

**SYSTÈME DE VÉGÉTALISATION :**

${isToiture ? `
TOITURE VÉGÉTALISÉE :
- Substrate : Couche de terre/compost visible (5-10cm)
- Installation : Aspect horizontal naturel
- Couverture : 85-95%
` : `
PANNEAU MUR VÉGÉTAL DEMET'AIR :
- Dimensions : Panneaux modulaires de 2 mètres de hauteur
- Installation : Panneaux empilés verticalement et/ou juxtaposés horizontalement
- Densité végétale : 90-95% de couverture DENSE
- ⚠️ CRITIQUE : La structure métallique noire NE DOIT PAS être visible (totalement masquée par végétation)
- Profondeur végétale apparente : 10-15cm
- Aspect final : Tapis végétal luxuriant et continu
`}

**COMPOSITION VÉGÉTALE DÉTAILLÉE :**

${isToiture ? this.getToitureComposition() : this.getMurVegetalComposition(analysisData)}

**PALETTE DE COULEURS :**
- 60% Verts variés (vif, olive, foncé, clair)
- 25% Gris-argenté, bleuté
- 15% Touches panachées (blanc-vert) et rosées/pourpres

═══════════════════════════════════════════════════════════
CONTRAINTES TECHNIQUES OBLIGATOIRES
═══════════════════════════════════════════════════════════

**PRÉSERVATION STRICTE :**
✓ Végétaliser UNIQUEMENT la façade/zone spécifiée
✓ Fenêtres et portes : 100% dégagées et visibles (marge 15cm)
✓ Aucune végétation sur : velux, cheminées, gouttières, luminaires, numéros de maison
✓ Perspective et proportions architecturales conservées
✓ Matériaux du mur partiellement visibles sous végétation (réalisme)

**RÉALISME VÉGÉTAL :**
✓ Couverture dense : ${analysisData.densite_recommandee === 'dense' ? '90-95%' : '80-90%'} (structure ${isToiture ? '' : 'noire '}totalement masquée)
✓ Profondeur apparente : ${isToiture ? '5-30cm' : '10-15cm'}
✓ Plantes retombantes vers le BAS uniquement (gravité respectée)
✓ Répartition irrégulière et naturelle (PAS de symétrie parfaite)
✓ Variations de textures : lisse/rugueuse, brillante/mate
✓ Nuances de verts réalistes (pas de couleurs saturées artificielles)
✓ Transitions douces entre espèces végétales
✓ Léger débordement : certaines plantes dépassent de 5-10cm

${!isToiture ? `
**MODULARITÉ PANNEAUX :**
✓ Panneaux de 2m de hauteur correctement proportionnés
✓ Continuité végétale entre panneaux (pas de lignes de démarcation nettes)
✓ Végétation qui se chevauche légèrement aux jonctions
✓ Aspect homogène de l'ensemble
` : ''}

**ÉCLAIRAGE ET OMBRES :**
✓ Cohérent avec l'éclairage de la photo originale
✓ Ombres portées des plantes sur le mur
✓ Profondeur créée par les différentes strates végétales

═══════════════════════════════════════════════════════════
INTERDICTIONS ABSOLUES
═══════════════════════════════════════════════════════════

❌ Végétaliser fenêtres, portes, velux, ouvertures
${!isToiture ? '❌ Structure noire/métallique visible' : ''}
❌ Couverture insuffisante (<${analysisData.densite_recommandee === 'dense' ? '90' : '80'}%)
❌ Symétrie géométrique parfaite
❌ Plantes disproportionnées ou géantes
❌ Couleurs artificielles saturées
❌ Plantes défiant la gravité
${!isToiture ? '❌ Démarcations nettes entre panneaux' : ''}
❌ Occultation d'éléments architecturaux essentiels

═══════════════════════════════════════════════════════════
GÉNÉRATION DE L'IMAGE
═══════════════════════════════════════════════════════════

Génère maintenant l'image en appliquant TOUTES ces spécifications avec un rendu professionnel, réaliste et exploitable par un paysagiste.

L'image finale doit montrer :
- Un ${isToiture ? 'toit' : 'mur/façade'} végétalisé luxuriant et dense
- Une végétation naturelle et variée (${analysisData.especes_suggerees.slice(0, 4).join(', ')})
- Un aspect professionnel et réalisable
- Le respect absolu de toutes les zones à exclure
- Une intégration harmonieuse avec l'architecture existante
- Photo-réalisme : on doit pouvoir croire que c'est une vraie photo de projet réalisé`;

    if (userDescription) {
      prompt += `\n\n**CONTRAINTE CLIENT SPÉCIFIQUE :**\n"${userDescription}"`;
    }

    return prompt;
  }

  /**
   * Composition détaillée pour mur végétal
   */
  private getMurVegetalComposition(analysisData: AnalysisData): string {
    return `
PARTIE HAUTE (30% supérieur) :
- 40% Sedums verts rampants (Sedum acre, album) - feuillage vert vif compact
- 30% Chlorophytum panachés - feuilles longues retombantes rayées blanc-vert
- 20% Fougères compactes (Nephrolepis) - frondes vertes vaporeuses
- 10% Petites vivaces vertes de remplissage

PARTIE CENTRALE (40% milieu) :
- 25% Plantes à feuillage zébré (Calathea, Fittonia) - motifs graphiques
- 25% Chlorophytum striés - effet retombant bien réparti
- 20% Sedums gris-argentés (Sedum reflexum 'Angelina') - texture fine contrastante
- 15% Succulentes grises/bleutées - feuillage charnu
- 15% Petites plantes vertes compactes - remplissage dense

PARTIE BASSE (30% inférieur) :
- 35% Sedums rampants couvre-sol - dominance verte très dense
- 25% Sedums rosés/pourpres (Sedum spurium) - touches colorées
- 25% Succulentes grises/argentées - effet tapissant
- 15% Végétation verte dense de base

**RÈGLES DE COMPOSITION :**
- Répartition IRRÉGULIÈRE (aspect naturel, pas géométrique)
- Alternance textures : rampant / retombant / dressé / compact
- Aucune symétrie parfaite
- Transitions douces entre strates
- Effet de "débordement" léger : certaines plantes dépassent de 5-10cm
`;
  }

  /**
   * Composition détaillée pour toiture
   */
  private getToitureComposition(): string {
    return `
COMPOSITION TOITURE EXTENSIVE (ensoleillement) :
- 50% Sedums variés (acre, album, reflexum, spurium) - tapis coloré vert/jaune/rose
- 25% Graminées basses (Festuca glauca, Carex) - texture verticale, mouvement
- 15% Thym rampant - floraison violette, aspect ras
- 10% Petites vivaces fleuries (Euphorbia myrsinites) - accents verts

**ASPECT VISUEL TOITURE :**
- Couverture dense (85-95%)
- Substrate visible par endroits (5-15%)
- Aspect horizontal naturel
- Hauteur végétation : 5-15cm principalement
- Touches de hauteur : 20-30cm (graminées, sedums dressés)
- Effet de "tapis naturel" irrégulier
`;
  }

  /**
   * Parse la réponse JSON de l'analyse
   */
  private parseAnalysisResponse(data: any): AnalysisData {
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;

      return {
        surface_estimee_m2: parsed.surface_estimee_m2 || 100,
        type_batiment: parsed.type_batiment || 'facade',
        orientation: parsed.orientation || 'sud',
        materiaux_visibles: parsed.materiaux_visibles || ['Béton'],
        obstacles: parsed.obstacles || ['fenêtres', 'portes', 'gouttières'],
        vegetation_actuelle: parsed.vegetation_actuelle || false,
        densite_recommandee: parsed.densite_recommandee || 'dense',
        especes_suggerees: parsed.especes_suggerees || [
          'Sedum acre',
          'Chlorophytum',
          'Nephrolepis',
          'Fittonia',
          'Sedum reflexum',
          'Succulentes grises'
        ],
      };
    } catch (error) {
      // Fallback en cas d'erreur de parsing
      console.warn('Failed to parse analysis response, using defaults', error);
      return {
        surface_estimee_m2: 100,
        type_batiment: 'facade',
        orientation: 'sud',
        materiaux_visibles: ['Béton', 'Crépi'],
        obstacles: ['fenêtres', 'portes', 'gouttières'],
        vegetation_actuelle: false,
        densite_recommandee: 'dense',
        especes_suggerees: [
          'Sedum acre',
          'Chlorophytum panaché',
          'Nephrolepis (fougère)',
          'Calathea',
          'Sedum reflexum Angelina',
          'Succulentes grises'
        ],
      };
    }
  }
}
