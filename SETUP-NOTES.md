# Setup Notes - Demo Demet Air

## Projet Créé ✅

Le squelette du projet **demo-demet-air** a été créé avec succès !

## Architecture Identique à jokariz-dealclub-demo

### Structure Complète

```
demo-demet-air/
├── backend/                    # Backend DDD avec MongoDB
│   ├── src/
│   │   ├── api/               # Routes & middleware
│   │   ├── application/       # Services applicatifs
│   │   ├── config/            # Configuration
│   │   ├── domain/            # Logique métier DDD
│   │   ├── infrastructure/    # Implémentations infra
│   │   └── scripts/           # Scripts DB
│   ├── package.json           # Dépendances backend
│   ├── tsconfig.json
│   └── .env.example
│
├── src/                        # Frontend React
│   ├── api/                   # Client API
│   ├── components/            # Composants React
│   ├── contexts/              # Contextes React
│   ├── hooks/                 # Custom hooks
│   ├── pages/                 # Pages
│   ├── services/              # Services frontend
│   ├── styles/                # Styles globaux
│   ├── types/                 # Types TypeScript
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── src-tauri/                  # Application desktop
│   ├── src/                   # Code Rust
│   ├── icons/                 # Icônes app
│   ├── Cargo.toml
│   └── tauri.conf.json
│
├── public/                     # Assets statiques
├── package.json               # Dépendances frontend
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .gitignore
└── README.md
```

## Technologies & Dépendances

### Frontend (identique à jokariz)
- React 18.3.1
- TypeScript 5.7.3
- Vite 6.0.10
- Shoelace UI 2.20.1
- React Router 7.9.4
- Axios 1.12.2
- RxDB 16.19.1 + RxJS 7.8.2
- Tauri 2.8.0
- jsPDF 3.0.3

### Backend (identique à jokariz)
- Fastify 5.6.1
- MongoDB 6.8.0 + Mongoose 8.5.3
- TypeScript 5.5.4
- JWT (jsonwebtoken 9.0.2)
- bcrypt 6.0.0
- Nodemailer 7.0.9
- AWS SDK S3 3.908.0
- Zod 3.23.8
- WebSocket support
- tsx 4.17.0 (dev)

### Configuration
- **Frontend port**: 5201 (différent de jokariz qui est sur 5200)
- **Backend port**: 4001 (différent de jokariz qui est sur 4000)
- **MongoDB port**: 27018 (même que jokariz)

## Prochaines Étapes

### 1. Installer les dépendances

```bash
# Frontend
cd /mnt/d/projects/01-PERSONAL/demo-demet-air
pnpm install

# Backend
cd backend
npm install
```

### 2. Configurer l'environnement

```bash
# Copier le fichier .env
cd backend
cp .env.example .env
# Éditer .env avec tes paramètres
```

### 3. Initialiser la base de données

```bash
# Démarrer MongoDB
mongod --dbpath /tmp/mongodb-demet-air --port 27018

# Dans un autre terminal, seed la DB
cd backend
npm run seed

# Créer un admin
ADMIN_EMAIL=admin@demo.com ADMIN_PASSWORD=password123 npm run create-admin
```

### 4. Démarrer le développement

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
pnpm run dev

# Optionnel - Terminal 3: Desktop app
pnpm tauri:dev
```

## Fichiers à Implémenter

Le squelette est prêt ! Tu dois maintenant implémenter:

1. **Backend**:
   - `src/server.ts` - Setup Fastify
   - `src/config/*` - Configuration
   - `src/domain/*` - Entités et logique métier
   - `src/infrastructure/*` - Repositories MongoDB
   - `src/api/routes/*` - Routes API
   - `src/scripts/*` - Scripts seed & admin

2. **Frontend**:
   - Composants dans `src/components/*`
   - Pages dans `src/pages/*`
   - Services dans `src/services/*`
   - Hooks personnalisés dans `src/hooks/*`

3. **Tauri**:
   - Commandes Rust si nécessaire dans `src-tauri/src/lib.rs`
   - Icônes dans `src-tauri/icons/`

## Notes Importantes

- L'architecture DDD est identique à jokariz-dealclub-demo
- Les dépendances sont les mêmes versions
- Seuls les noms et ports ont été adaptés
- Le code métier reste à implémenter selon ton concept produit

Prêt à coder ! 🚀
