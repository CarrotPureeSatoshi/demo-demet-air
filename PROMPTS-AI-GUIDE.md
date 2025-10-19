# 🤖 Guide des Prompts IA DEMET'AIR

Ce document explique comment fonctionnent les prompts professionnels pour Nano Banana AI et comment les personnaliser.

---

## 📋 Architecture des Prompts

Le système utilise **2 prompts distincts** en séquence :

### 1️⃣ Prompt d'Analyse (Étape 1)
**Fichier** : `backend/src/infrastructure/ai/NanoBananaService.ts` → `buildAnalysisPromptDemetAir()`

**Objectif** : Analyser l'image et retourner un JSON structuré

**Output** :
```json
{
  "surface_estimee_m2": 95,
  "type_batiment": "facade",
  "orientation": "sud",
  "materiaux_visibles": ["Béton", "Crépi"],
  "obstacles": ["fenêtres", "portes", "gouttières"],
  "vegetation_actuelle": false,
  "densite_recommandee": "dense",
  "especes_suggerees": ["Sedum acre", "Chlorophytum", "..."]
}
```

### 2️⃣ Prompt de Génération (Étape 2)
**Fichier** : `backend/src/infrastructure/ai/NanoBananaService.ts` → `buildGenerationPromptDemetAir()`

**Objectif** : Générer l'image végétalisée ultra-réaliste

**Input** : Les données JSON de l'étape 1 + photo originale

**Output** : URL de l'image générée

---

## 🎨 Spécifications Techniques DEMET'AIR

### Panneau Mur Végétal

**Dimensions** :
- Hauteur standard : **2 mètres**
- Largeur : Variable (modulaire)
- Profondeur végétale : **10-15cm**

**Densité** :
- Couverture : **90-95%** (structure noire masquée)
- Aspect : Tapis végétal luxuriant et continu

**Composition Végétale** :

| Strate | Hauteur | Plantes Principales | Proportion |
|--------|---------|---------------------|------------|
| **HAUTE** | 30% sup | Sedums verts, Chlorophytum, Fougères | 40% / 30% / 20% |
| **CENTRALE** | 40% milieu | Calathea, Chlorophytum, Sedums gris | 25% / 25% / 20% |
| **BASSE** | 30% inf | Sedums couvre-sol, Sedums rosés | 35% / 25% / 25% |

**Palette de Couleurs** :
- 60% Verts variés (vif, olive, foncé, clair)
- 25% Gris-argenté, bleuté
- 15% Touches panachées et rosées

---

## ⚙️ Personnalisation des Prompts

### Modifier les Espèces Végétales

**Fichier** : `NanoBananaService.ts` ligne 136-139

```typescript
// Pour FAÇADE/MUR :
- Pour FAÇADE/MUR : Privilégier Sedums (40%), Chlorophytum (30%), Fougères (15%), Succulentes (15%)

// Pour TOITURE :
- Pour TOITURE : Privilégier Sedums variés (50%), Graminées (25%), Thym (15%), Vivaces (10%)
```

**Exemple de modification** :
```typescript
// Ajouter plus de plantes fleuries
- Pour FAÇADE/MUR : Privilégier Sedums (30%), Chlorophytum (25%), Fougères (15%), Succulentes (10%), Géraniums (10%), Lobelia (10%)
```

### Modifier la Densité de Couverture

**Fichier** : `NanoBananaService.ts` ligne 190 et 216

```typescript
// Densité actuelle : 90-95%
- Densité végétale : 90-95% de couverture DENSE

// Pour une densité plus légère (80-85%)
- Densité végétale : 80-85% de couverture MOYENNE
```

### Modifier les Contraintes d'Exclusion

**Fichier** : `NanoBananaService.ts` ligne 127-134

```typescript
// Obstacles actuels
- Fenêtres et encadrements (marge 15cm)
- Portes et encadrements (marge 15cm)
- Velux, lucarnes, cheminées
- ...

// Ajouter de nouvelles exclusions
- Climatiseurs extérieurs
- Antennes paraboliques
- Panneaux solaires
```

---

## 🔧 Ajustements Avancés

### Changer le Style de Végétalisation

**Fichier** : `NanoBananaService.ts` → méthode `getMurVegetalComposition()`

**Style actuel** : Naturel dense avec dominance verte

**Pour un style plus fleuri** :
```typescript
PARTIE HAUTE (30% supérieur) :
- 30% Sedums verts rampants
- 20% Chlorophytum panachés
- 20% Fougères compactes
- 30% Plantes fleuries (Lobelia, Géraniums retombants) // AJOUT
```

**Pour un style plus graphique** :
```typescript
PARTIE CENTRALE (40% milieu) :
- 40% Plantes à feuillage zébré (Calathea, Fittonia) // AUGMENTÉ
- 20% Chlorophytum striés
- 20% Sedums gris-argentés
- 20% Succulentes grises/bleutées
```

### Ajuster les Paramètres de Génération

**Fichier** : `NanoBananaService.ts` ligne 64-69

```typescript
// Paramètres actuels
steps: 50,              // Qualité (30-80)
guidance_scale: 8,      // Fidélité au prompt (7-12)
resolution: '1024x1024' // Résolution
```

**Pour plus de détails** :
```typescript
steps: 70,              // Plus de détails (mais plus lent)
guidance_scale: 10,     // Plus fidèle au prompt
resolution: '1536x1536' // Haute résolution (si supporté)
```

**Pour plus de vitesse** :
```typescript
steps: 30,              // Plus rapide
guidance_scale: 7,      // Plus de liberté créative
resolution: '768x768'   // Résolution standard
```

---

## 📊 Exemples de Scénarios

### Scénario 1 : Client veut plus de fleurs

**Modification** : `getMurVegetalComposition()`

```typescript
PARTIE HAUTE (30% supérieur) :
- 30% Sedums verts rampants
- 20% Chlorophytum panachés
- 20% Fougères compactes
- 30% Géraniums retombants + Lobelia bleue // AJOUT FLEURS

PARTIE CENTRALE (40% milieu) :
- 20% Plantes à feuillage zébré
- 20% Chlorophytum striés
- 15% Sedums gris-argentés
- 15% Succulentes grises/bleutées
- 30% Pétunias + Surfinias (floraison continue) // AJOUT FLEURS
```

### Scénario 2 : Budget réduit (densité moindre)

**Modification** : Ligne 190

```typescript
- Densité végétale : 75-80% de couverture MOYENNE
- Profondeur végétale apparente : 8-12cm
```

**Et** ligne 216 :
```typescript
✓ Couverture dense : 75-80% (quelques zones de structure visible)
```

### Scénario 3 : Style minimaliste (monochrome)

**Modification** : Palette de couleurs

```typescript
**PALETTE DE COULEURS :**
- 80% Verts variés (tons unifiés) // AUGMENTÉ
- 20% Gris-argenté exclusivement // RÉDUIT
- 0% Touches panachées ou rosées // SUPPRIMÉ
```

### Scénario 4 : Projet toiture uniquement

Déjà implémenté ! Utiliser `typeStructure: 'toiture'`

```typescript
// Dans ProjectService.ts
await nanoBananaService.generateVegetalizedImage(
  imageUrl,
  analysisData,
  { typeStructure: 'toiture' } // TOITURE au lieu de FACADE
);
```

---

## 🚨 Contraintes Critiques (Ne PAS Modifier)

Ces contraintes assurent le réalisme et la faisabilité du projet :

### ❌ Interdictions Absolues

```typescript
❌ Végétaliser fenêtres, portes, velux, ouvertures
❌ Structure noire/métallique visible
❌ Couverture insuffisante (<90% pour dense)
❌ Symétrie géométrique parfaite
❌ Plantes disproportionnées
❌ Couleurs artificielles saturées
❌ Plantes défiant la gravité
❌ Démarcations nettes entre panneaux
```

**Pourquoi ?**
- **Fenêtres/Portes** : Légal + fonctionnel (lumière, accès)
- **Structure visible** : Aspect non professionnel (panneau Demet'air masqué)
- **Couverture faible** : Ne correspond pas au produit Demet'air
- **Symétrie parfaite** : Aspect artificiel, peu naturel
- **Gravité** : Réalisme physique (plantes tombent vers le bas)

---

## 🎯 Checklist Avant Modification

Avant de modifier les prompts, vérifier :

- [ ] La modification respecte les contraintes Demet'air (densité 90-95%)
- [ ] Les espèces végétales sont adaptées au climat français
- [ ] La palette de couleurs reste naturelle (pas de violet fluo)
- [ ] Les proportions restent réalistes (panneaux de 2m)
- [ ] Les exclusions de sécurité sont maintenues (fenêtres, portes)
- [ ] La composition reste réalisable professionnellement
- [ ] Le style correspond à l'image de marque Demet'air

---

## 🧪 Tester les Modifications

### 1. Modifier le prompt

Éditer `backend/src/infrastructure/ai/NanoBananaService.ts`

### 2. Redémarrer le backend

```bash
cd backend
npm run dev
```

### 3. Tester avec une vraie image

```bash
# Upload une photo de test
# Observer le résultat généré
# Ajuster si nécessaire
```

### 4. Itérer

Les prompts IA nécessitent souvent 3-5 itérations pour obtenir le résultat optimal.

---

## 📚 Ressources

- **Nano Banana Docs** : https://docs.nanobanana.ai
- **Stable Diffusion Prompting Guide** : https://stable-diffusion-art.com/prompt-guide/
- **Fichier source** : `backend/src/infrastructure/ai/NanoBananaService.ts`

---

## 🆘 Problèmes Fréquents

### Problème : L'IA ne respecte pas les exclusions

**Solution** : Renforcer les contraintes dans le prompt de génération

```typescript
// Ligne 242-243
❌ Végétaliser fenêtres, portes, velux, ouvertures
⚠️ CRITIQUE : Marge de 15cm STRICTE autour de TOUTES les ouvertures
```

### Problème : Végétation pas assez dense

**Solution** : Augmenter le `guidance_scale` et renforcer la densité

```typescript
guidance_scale: 10, // Plus fidèle au prompt
```

Et dans le prompt :
```typescript
- Densité végétale : 95% de couverture TRÈS DENSE
✓ AUCUNE structure métallique visible (masquage total obligatoire)
```

### Problème : Couleurs trop artificielles

**Solution** : Renforcer les contraintes de palette

```typescript
**PALETTE DE COULEURS (RÉALISME OBLIGATOIRE) :**
- Verts NATURELS uniquement (pas de vert fluo)
- Gris-argenté DOUX (pas de gris métallique)
- Touches rosées SUBTILES (pas de rose vif)
❌ INTERDIRE : Couleurs saturées, néons, teintes artificielles
```

---

**Dernière mise à jour** : Décembre 2024
**Version** : 1.0 - Prompts professionnels DEMET'AIR
