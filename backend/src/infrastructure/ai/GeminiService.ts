// Service - Intégration OpenRouter AI avec prompts DEMET'AIR

import OpenAI from 'openai';
import { config } from '../../config/index.js';
import { AnalysisData } from '../../domain/entities/Project.js';

export interface GenerationOptions {
  userDescription?: string;
  typeStructure?: 'facade' | 'mur' | 'toiture';
}

export class GeminiService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: config.OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': 'https://demetair.com',
        'X-Title': 'DEMET\'AIR - Visualisation Végétalisation',
      },
    });
  }

  /**
   * Étape 1 : Analyse détaillée de l'image avec prompt professionnel DEMET'AIR
   */
  async analyzeImage(imageUrl: string, userDescription?: string, typeStructure: string = 'facade'): Promise<AnalysisData> {
    const prompt = this.buildAnalysisPromptDemetAir(typeStructure, userDescription);

    try {
      // OpenRouter with Gemini Vision
      const completion = await this.client.chat.completions.create({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
      });

      const generatedText = completion.choices[0]?.message?.content || '';
      const analysisData = this.parseAnalysisResponse(generatedText);
      return analysisData;
    } catch (error) {
      console.error('OpenRouter analysis error:', error);
      throw new Error('Échec de l\'analyse de l\'image');
    }
  }

  /**
   * Étape 2 : Génération image végétalisée via OpenRouter Gemini Image Generation
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
      // Utiliser Gemini 2.5 Flash Image (Nano Banana) pour génération d'images
      const completion = await this.client.chat.completions.create({
        model: 'google/gemini-2.5-flash-image',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: originalImageUrl,
                },
              },
            ],
          },
        ],
        // CRUCIAL : activer la génération d'images
        modalities: ['image', 'text'],
        // Configuration aspect ratio (optionnel)
        image_config: {
          aspect_ratio: '4:3', // Adapter selon la surface (façade vs toiture)
        },
      } as any); // Type assertion car modalities n'est pas encore dans les types OpenAI

      // Extraire l'image générée (retournée en base64 data URL)
      const message = completion.choices[0]?.message as any;

      if (message?.images && message.images.length > 0) {
        const imageDataUrl = message.images[0].image_url.url;
        // Retourner le data URL pour traitement par ProjectService
        return imageDataUrl;
      }

      throw new Error('Aucune image générée par le modèle');
    } catch (error) {
      console.error('OpenRouter image generation error:', error);
      throw new Error('Échec de la génération de l\'image végétalisée');
    }
  }


  /**
   * Construit le prompt d'analyse détaillé DEMET'AIR (identique à Nano Banana)
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
  "especes_suggerees": ["Sedum acre", "Chlorophytum", "Nephrolepis", "..."]
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
   * Construit le prompt de génération détaillé DEMET'AIR (identique)
   */
  private buildGenerationPromptDemetAir(
    analysisData: AnalysisData,
    typeStructure: string,
    userDescription?: string
  ): string {
    // Même logique que NanoBananaService
    const isToiture = typeStructure === 'toiture';

    let prompt = `Tu es un architecte paysagiste professionnel spécialisé en végétalisation de façades et murs végétaux. Ta mission est de créer une image ULTRA-RÉALISTE montrant la structure végétalisée selon les spécifications DEMET'AIR.

TYPE DE PROJET : ${isToiture ? 'Toiture végétalisée' : 'Façade/Mur végétalisé avec Panneau DEMET\'AIR'}

**ZONE À VÉGÉTALISER :**
- Surface : ${analysisData.surface_estimee_m2} m²
- Type : ${analysisData.type_batiment}
- Orientation : ${analysisData.orientation}
- Densité : ${analysisData.densite_recommandee} (${analysisData.densite_recommandee === 'dense' ? '90-95%' : '80-85%'} de couverture)

**OBSTACLES À EXCLURE :**
${analysisData.obstacles.map(obs => `- ${obs}`).join('\n')}

**COMPOSITION VÉGÉTALE :**
- Sedums verts rampants (40%)
- Chlorophytum panachés (30%)
- Fougères compactes (15%)
- Succulentes grises (15%)

[... reste du prompt identique à NanoBananaService ...]`;

    if (userDescription) {
      prompt += `\n\n**CONTRAINTE CLIENT :**\n"${userDescription}"`;
    }

    return prompt;
  }

  /**
   * Parse la réponse JSON de l'analyse
   */
  private parseAnalysisResponse(text: string): AnalysisData {
    try {
      // Extraire le JSON du texte (Gemini peut ajouter du texte avant/après)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

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
