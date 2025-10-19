# 🚀 DEMET'AIR - Quick Start

> Démarrez votre application de visualisation végétalisée en 5 minutes !

---

## ⚡ Setup Rapide

### 1️⃣ Installation (une fois)

```bash
# Frontend
cd /mnt/d/projects/01-PERSONAL/demo-demet-air
pnpm install

# Backend
cd backend
npm install
```

### 2️⃣ Configuration Minimale

**Éditer `backend/.env`:**

```bash
# ⚠️ OBLIGATOIRE - Remplacer ces valeurs
NANO_BANANA_API_KEY=votre-cle-api-nano-banana
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app-gmail
```

### 3️⃣ Démarrer

Ouvrir **3 terminaux**:

**Terminal 1 - MongoDB:**
```bash
mongod --dbpath /tmp/mongodb-demet-air --port 27018
```

**Terminal 2 - Backend:**
```bash
cd /mnt/d/projects/01-PERSONAL/demo-demet-air/backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd /mnt/d/projects/01-PERSONAL/demo-demet-air
pnpm run dev
```

### 4️⃣ Tester

Ouvrir **http://localhost:5201** dans votre navigateur.

---

## 🧪 Test du Flow Complet

1. **Page Upload** (http://localhost:5201)
   - Glisser une photo de façade/toiture
   - (Optionnel) Ajouter une description
   - Cliquer "GÉNÉRER MON PROJET VÉGÉTALISÉ"

2. **Génération** (~20 secondes)
   - Analyse de l'image
   - Sélection des végétaux
   - Génération du rendu
   - Calcul de l'estimation

3. **Page Résultat** (http://localhost:5201/result/:id)
   - Modal email apparaît (image floutée en arrière-plan)
   - Entrer un email
   - Cliquer "VOIR MON PROJET VÉGÉTALISÉ"

4. **Déblocage**
   - Image défloutée
   - Slider avant/après actif
   - Estimation personnalisée affichée
   - Email de confirmation reçu

---

## 🔧 Configuration Avancée

### Obtenir une clé API Nano Banana

1. Créer un compte sur **https://nanobanana.ai**
2. Obtenir votre API key dans le dashboard
3. Copier dans `backend/.env` → `NANO_BANANA_API_KEY`

### Configurer Gmail App Password

1. Aller sur **https://myaccount.google.com/security**
2. Activer **Vérification en 2 étapes**
3. Aller dans **App passwords**
4. Créer un mot de passe pour **Mail**
5. Copier dans `backend/.env` → `SMTP_PASS`

### Configurer Calendly (Optionnel)

1. Créer un compte **Calendly**
2. Créer un lien de rendez-vous
3. Copier l'URL dans `backend/.env` → `CALENDLY_URL`

---

## 📁 Structure du Projet

```
demo-demet-air/
├── backend/              # API Backend (Fastify + MongoDB)
│   ├── src/
│   │   ├── domain/       # Logique métier
│   │   ├── application/  # Services
│   │   ├── infrastructure/ # IA, Email, Storage
│   │   ├── api/          # Routes
│   │   └── server.ts
│   ├── .env              # ⚠️ Configuration
│   └── package.json
│
├── src/                  # Frontend (React)
│   ├── pages/
│   │   ├── Upload.tsx    # Page 1
│   │   └── Result.tsx    # Page 2
│   ├── components/
│   │   ├── modals/
│   │   └── ui/
│   └── services/
│
├── IMPLEMENTATION-GUIDE.md  # Guide complet
└── QUICK-START.md          # Ce fichier
```

---

## 🐛 Problèmes Fréquents

### MongoDB ne démarre pas
```bash
# Créer le dossier
mkdir -p /tmp/mongodb-demet-air

# Vérifier l'installation
mongod --version
```

### Backend ne démarre pas
```bash
# Vérifier que toutes les dépendances sont installées
cd backend
npm install

# Vérifier le .env
cat .env
```

### Email ne s'envoie pas
- Vérifier `SMTP_USER` et `SMTP_PASS` dans `.env`
- Créer un **App Password** Gmail (pas le mot de passe normal)
- Tester la connexion SMTP

### API Nano Banana timeout
- Vérifier que `NANO_BANANA_API_KEY` est correcte
- Essayer avec une image plus petite (< 5MB)
- Vérifier la connexion internet

---

## 📊 Commandes Utiles

```bash
# Vérifier que le backend répond
curl http://localhost:4001/api/health

# Voir les projets dans MongoDB
mongosh mongodb://localhost:27018/demo-demet-air
> db.projects.find().pretty()

# Voir les leads
> db.leads.find().pretty()

# Build pour production
cd backend
npm run build

cd ..
pnpm run build
```

---

## 🎯 Prochaines Étapes

1. **Tester** le flow complet avec une vraie image
2. **Configurer** Nano Banana API (obligatoire)
3. **Configurer** Gmail SMTP (obligatoire)
4. **Personnaliser** les couleurs et textes
5. **Déployer** sur Vercel (frontend) + Heroku/DO (backend)

---

## 📚 Ressources

- **Guide complet**: `IMPLEMENTATION-GUIDE.md`
- **PRD**: Voir le document du product
- **Stack Doc**:
  - Fastify: https://fastify.dev
  - React Router: https://reactrouter.com
  - MongoDB: https://mongodb.com

---

## ✅ Checklist Avant Production

- [ ] Nano Banana API configurée et testée
- [ ] Gmail SMTP configuré et testé
- [ ] Flow complet testé (upload → génération → email)
- [ ] MongoDB en production (Atlas ou autre)
- [ ] Variables d'environnement en production
- [ ] Storage S3 configuré (si production)
- [ ] Calendly URL personnalisée
- [ ] Domaine personnalisé configuré

---

**Besoin d'aide ?** Consulter `IMPLEMENTATION-GUIDE.md` pour plus de détails ! 🌿
