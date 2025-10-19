# 🌿 DEMET'AIR - Guide d'Implémentation

> **Visualiseur de façades végétalisées** - Plateforme de génération AI pour projets de végétalisation DEMET'AIR

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Stack Technique](#stack-technique)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Démarrage](#démarrage)
6. [Architecture](#architecture)
7. [API Endpoints](#api-endpoints)
8. [Dépendances Externes](#dépendances-externes)
9. [Déploiement](#déploiement)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Vue d'Ensemble

Cette application permet aux propriétaires de:
1. **Upload** une photo de leur bâtiment
2. **Générer** une visualisation végétalisée via IA (Nano Banana)
3. **Débloquer** le résultat en fournissant leur email
4. **Recevoir** une estimation de prix personnalisée

### Flow Utilisateur

```
Upload Photo → Analyse IA → Génération Image → Modal Email → Résultat Déblocké
   (Page 1)      (20s)        (Backend)      (Page 2)     (Slider Avant/Après)
```

---

## 🛠️ Stack Technique

### Backend
- **Framework**: Fastify 5.6
- **Base de données**: MongoDB 6.8 + Mongoose 8.5
- **Architecture**: DDD (Domain-Driven Design)
- **IA**: Nano Banana API
- **Storage**: Local ou AWS S3
- **Email**: Nodemailer (SMTP)

### Frontend
- **Framework**: React 18.3
- **Routing**: React Router 7.9
- **UI**: Shoelace 2.20
- **Build**: Vite 6.0
- **TypeScript**: 5.7

### Desktop (Optionnel)
- **Tauri**: 2.8

---

## 📦 Installation

### Prérequis

- Node.js 18+
- pnpm 9.0+
- MongoDB 6+
- Compte Nano Banana (API Key)
- Compte SMTP (Gmail recommandé)

### Étape 1: Cloner et installer

```bash
# Frontend
cd /mnt/d/projects/01-PERSONAL/demo-demet-air
pnpm install

# Backend
cd backend
npm install
```

---

## ⚙️ Configuration

### 1. Backend - Variables d'environnement

Le fichier `backend/.env` est déjà créé. **Vous devez configurer ces valeurs critiques:**

```bash
# ⚠️ OBLIGATOIRE - API Nano Banana
NANO_BANANA_API_KEY=your-actual-api-key-here
NANO_BANANA_BASE_URL=https://api.nanobanana.ai
NANO_BANANA_MODEL=stable-diffusion-xl

# ⚠️ OBLIGATOIRE - Configuration Email
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password  # Créer un "App Password" dans Gmail
EMAIL_FROM=noreply@demetair.fr

# ⚠️ OPTIONNEL - Calendly URL
CALENDLY_URL=https://calendly.com/votre-lien/rdv-gratuit
```

#### Comment créer un App Password Gmail:

1. Aller sur https://myaccount.google.com/security
2. Activer la vérification en 2 étapes
3. Aller dans "App passwords"
4. Générer un mot de passe pour "Mail"
5. Copier ce mot de passe dans `SMTP_PASS`

### 2. Nano Banana API

**Obtenir une clé API:**
1. Créer un compte sur https://nanobanana.ai
2. Obtenir votre API key
3. La copier dans `NANO_BANANA_API_KEY`

**Note**: L'API Nano Banana est utilisée pour:
- **Analyse** de l'image (surface, type, orientation, matériaux)
- **Génération** de la version végétalisée

### 3. MongoDB

```bash
# Démarrer MongoDB sur le port 27018
mongod --dbpath /tmp/mongodb-demet-air --port 27018
```

---

## 🚀 Démarrage

### Mode Développement

**Terminal 1 - MongoDB:**
```bash
mongod --dbpath /tmp/mongodb-demet-air --port 27018
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

Le backend démarre sur **http://localhost:4001**

**Terminal 3 - Frontend:**
```bash
pnpm run dev
```

Le frontend démarre sur **http://localhost:5201**

### Vérifier que tout fonctionne

```bash
# Health check backend
curl http://localhost:4001/api/health

# Devrait retourner:
# {"status":"ok","service":"demo-demet-air"}
```

---

## 🏗️ Architecture

### Backend (DDD)

```
backend/src/
├── domain/                    # Logique métier
│   ├── entities/              # Project, Lead
│   ├── repositories/          # Interfaces
│   └── value-objects/         # Email
├── application/               # Cas d'usage
│   └── services/              # ProjectService, EstimationService
├── infrastructure/            # Implémentations
│   ├── ai/                    # NanoBananaService
│   ├── email/                 # EmailService
│   ├── storage/               # StorageService (S3/local)
│   ├── mongodb/               # Models, Schemas
│   └── repositories/          # Implémentations
├── api/                       # HTTP
│   └── routes/                # projectRoutes
├── config/                    # Configuration
└── server.ts                  # Point d'entrée
```

### Frontend (React)

```
src/
├── pages/                     # Pages principales
│   ├── Upload.tsx             # Page 1
│   └── Result.tsx             # Page 2
├── components/
│   ├── modals/                # EmailModal
│   └── ui/                    # BeforeAfterSlider
├── services/                  # API calls
│   └── projectService.ts
├── api/                       # Axios client
└── styles/                    # CSS
```

---

## 🌐 API Endpoints

### POST /api/projects
Upload une image et créer un projet

**Request:**
```
Content-Type: multipart/form-data
file: File (JPEG/PNG, max 10MB)
description: string (optionnel, max 200 chars)
```

**Response:**
```json
{
  "id": "uuid",
  "status": "uploaded",
  "originalImageUrl": "url"
}
```

### POST /api/projects/:id/generate
Générer la visualisation végétalisée

**Request:**
```json
{
  "location": "Toulouse"
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "generated",
  "analysisData": {...},
  "estimation": {...},
  "generatedImageUrl": "url"
}
```

### GET /api/projects/:id
Récupérer un projet

**Response (unlocked):**
```json
{
  "id": "uuid",
  "status": "unlocked",
  "originalImageUrl": "url",
  "generatedImageUrl": "url",
  "analysisData": {...},
  "estimation": {...},
  "isUnlocked": true,
  "leadEmail": "user@email.com"
}
```

### POST /api/projects/:id/unlock
Débloquer avec email

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "project": {...}
}
```

### POST /api/projects/:id/track
Tracker une action (calendly, pdf)

**Request:**
```json
{
  "action": "calendly"
}
```

---

## 🔌 Dépendances Externes

### 1. Nano Banana API

**Endpoint**: Configuré dans `.env` (`NANO_BANANA_BASE_URL`)

**Endpoints utilisés:**
- `POST /analyze` - Analyse de l'image
- `POST /generate` - Génération image végétalisée

**Timeouts:**
- Analyse: 60s max
- Génération: 60s max

### 2. SMTP (Email)

**Gmail recommandé** (gratuit jusqu'à 500 emails/jour)

**Alternative**: SendGrid, Postmark, AWS SES

### 3. Storage

**Mode Development**: Local (`./uploads`)

**Mode Production**: AWS S3 (configuré dans `.env`)

---

## 🚢 Déploiement

### Backend

**Option 1: Heroku**
```bash
git push heroku main
```

**Option 2: Digital Ocean**
Utiliser le MCP Digital Ocean pour déployer

**Option 3: VPS**
```bash
npm run build
npm start
```

### Frontend

**Option 1: Vercel**
```bash
vercel deploy
```

**Option 2: Netlify**
Connecter le repo GitHub

### Variables d'environnement Production

**Backend:**
- Tous les `.env` doivent être configurés
- `MONGODB_URI`: URI MongoDB Atlas ou autre
- `STORAGE_TYPE=s3`
- `CORS_ORIGIN`: URL du frontend

**Frontend:**
- `VITE_API_URL`: URL du backend

---

## 🐛 Troubleshooting

### Problème: MongoDB ne démarre pas

```bash
# Vérifier si MongoDB est installé
mongod --version

# Créer le dossier de données
mkdir -p /tmp/mongodb-demet-air

# Démarrer avec verbose
mongod --dbpath /tmp/mongodb-demet-air --port 27018 --verbose
```

### Problème: Email ne s'envoie pas

```bash
# Vérifier la configuration SMTP
cd backend
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});
transporter.verify().then(console.log).catch(console.error);
"
```

### Problème: Nano Banana API timeout

- Vérifier que la clé API est valide
- Augmenter `AI_GENERATION_TIMEOUT` dans `.env`
- Essayer avec une image plus petite

### Problème: Upload échoue

- Vérifier la taille du fichier (max 10MB)
- Vérifier le format (JPG/PNG uniquement)
- Vérifier les permissions du dossier `./uploads`

---

## 📊 Monitoring & Analytics

### Logs Backend

```bash
# Voir les logs en temps réel
cd backend
npm run dev

# Logs sont dans la console avec Pino Pretty
```

### Tracking Leads

Les leads sont sauvegardés dans MongoDB:

```bash
mongosh mongodb://localhost:27018/demo-demet-air
> db.leads.find().pretty()
```

---

## 🎨 Personnalisation

### Couleurs (variables CSS)

Modifier `src/styles/global.css`:
```css
:root {
  --primary: #2d5016;
  --secondary: #4a7c25;
  --accent: #e8f5e9;
}
```

### Estimation Prix

Modifier `backend/src/application/services/EstimationService.ts`:
```typescript
private readonly BASE_PRICES = {
  facade_simple: { min: 90, max: 110 },
  // ...
};
```

---

## 📝 TODO / Améliorations

- [ ] Implémenter génération PDF
- [ ] Ajouter compression d'images avant upload
- [ ] Implémenter retry logic pour l'API Nano Banana
- [ ] Ajouter tests unitaires
- [ ] Implémenter dashboard admin
- [ ] Ajouter analytics (Posthog, Mixpanel)
- [ ] Implémenter système de cache pour les générations
- [ ] Ajouter support pour vidéos

---

## 📞 Support

Pour toute question ou problème:
- Créer une issue sur GitHub
- Contact: support@demetair.fr

---

**Bon développement ! 🌿**
