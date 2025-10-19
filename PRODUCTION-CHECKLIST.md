# 📋 Production Readiness Checklist - DEMET'AIR

> Checklist complète pour rendre l'application production-ready

---

## 🚨 Phase 1 : CRITIQUES (Bloquants) - 1-2 semaines

### 1. Sécurité

- [ ] **Validation inputs stricte**
  ```typescript
  // Ajouter Zod validation dans les routes API
  import { z } from 'zod';

  const uploadSchema = z.object({
    description: z.string().max(200).optional(),
    // ...
  });
  ```

- [ ] **Sanitization XSS**
  ```bash
  npm install dompurify isomorphic-dompurify
  ```

- [ ] **Rate limiting avancé**
  ```typescript
  // Par IP ET par email
  // Max 5 générations/jour par IP
  // Max 3 projets/email
  ```

- [ ] **Secrets management**
  ```bash
  # Utiliser dotenv-vault ou AWS Secrets Manager
  # NE JAMAIS commiter .env
  echo ".env" >> .gitignore
  ```

- [ ] **CSRF Protection**
  ```bash
  npm install @fastify/csrf-protection
  ```

### 2. Dépendances Externes Configurées

- [ ] **Nano Banana API**
  - [ ] Obtenir clé API production
  - [ ] Tester avec vraies images
  - [ ] Configurer billing/quotas
  - [ ] Ajouter retry logic (3 tentatives)

- [ ] **SMTP Email**
  - [ ] Configurer Gmail App Password OU SendGrid/Postmark
  - [ ] Tester envoi réel
  - [ ] Templates HTML testés (Gmail, Outlook, Apple Mail)
  - [ ] Fallback si envoi échoue

- [ ] **MongoDB Production**
  - [ ] Migrer vers MongoDB Atlas
  - [ ] Configurer backup automatique
  - [ ] Optimiser indexes
  - [ ] Connection pooling

- [ ] **Storage S3**
  - [ ] Créer bucket AWS S3
  - [ ] Configurer IAM credentials
  - [ ] Tester upload/download
  - [ ] Configurer CDN CloudFront

### 3. Génération PDF

- [ ] **Implémenter fonction PDF**
  ```typescript
  // Utiliser jsPDF (déjà dans les dépendances)
  import jsPDF from 'jspdf';

  const generatePDF = (project: Project) => {
    const doc = new jsPDF();
    // Ajouter logo, images, estimation
    doc.save(`demet-air-projet-${project.id}.pdf`);
  };
  ```

- [ ] **Template PDF professionnel**
  - [ ] Logo DEMET'AIR
  - [ ] Images avant/après
  - [ ] Estimation détaillée
  - [ ] Coordonnées contact
  - [ ] Mentions légales

### 4. Monitoring & Error Tracking

- [ ] **Sentry**
  ```bash
  npm install @sentry/node @sentry/react
  # Configurer DSN
  ```

- [ ] **Logs structurés**
  ```typescript
  // Remplacer console.log par pino
  import pino from 'pino';
  const logger = pino();
  logger.info({ projectId, action: 'generate' }, 'Generation started');
  ```

- [ ] **Health checks avancés**
  ```typescript
  // GET /api/health
  // Vérifier : MongoDB, S3, Nano Banana API
  ```

### 5. Tests Basiques

- [ ] **Tests API critiques**
  ```bash
  npm install --save-dev vitest supertest
  ```

  Tests minimum :
  - [ ] POST /api/projects (upload)
  - [ ] POST /api/projects/:id/generate
  - [ ] POST /api/projects/:id/unlock
  - [ ] GET /api/projects/:id

- [ ] **Tests frontend essentiels**
  - [ ] Upload page renders
  - [ ] Result page renders
  - [ ] Email modal validation

---

## ⚠️ Phase 2 : IMPORTANTS (Recommandés) - 2-3 semaines

### 6. Performance

- [ ] **Cache Redis**
  ```bash
  npm install redis
  # Cache résultats IA (24h)
  # Cache estimations (1h)
  ```

- [ ] **Compression images**
  ```bash
  npm install sharp
  # Compresser avant upload si > 5MB
  ```

- [ ] **Retry logic Nano Banana**
  ```typescript
  // 3 tentatives avec exponential backoff
  async function retryGeneration(fn, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (err) {
        if (i === retries - 1) throw err;
        await sleep(2 ** i * 1000);
      }
    }
  }
  ```

- [ ] **CDN pour assets**
  - [ ] CloudFront devant S3
  - [ ] Compression gzip/brotli
  - [ ] Cache headers

### 7. UX/Erreurs

- [ ] **Messages d'erreur user-friendly**
  ```typescript
  // Au lieu de "Failed to analyze image"
  "Nous n'avons pas pu analyser votre photo. Assurez-vous qu'il s'agit d'une photo claire de votre façade/toiture."
  ```

- [ ] **Fallback si IA échoue**
  - [ ] Proposer RDV direct sans visualisation
  - [ ] Email avec estimation basique
  - [ ] Retry manuel

- [ ] **Loading states détaillés**
  - [ ] Skeleton screens
  - [ ] Progress bar précise
  - [ ] Temps restant estimé

### 8. Database Optimisation

- [ ] **Indexes MongoDB**
  ```javascript
  db.projects.createIndex({ createdAt: -1 });
  db.projects.createIndex({ leadEmail: 1 });
  db.projects.createIndex({ status: 1, createdAt: -1 });
  db.leads.createIndex({ email: 1, projectId: 1 }, { unique: true });
  ```

- [ ] **Cleanup job**
  ```typescript
  // Cron job : Supprimer images > 30 jours
  // Cron job : Archiver projets > 6 mois
  ```

### 9. Legal/RGPD

- [ ] **Pages légales**
  - [ ] Mentions légales
  - [ ] CGU/CGV
  - [ ] Politique de confidentialité
  - [ ] Politique cookies

- [ ] **Consentement**
  - [ ] Banner cookies
  - [ ] Opt-in email marketing
  - [ ] Consentement traitement données

- [ ] **Droit à l'oubli**
  ```typescript
  // Route DELETE /api/users/:email/data
  // Supprime projet + lead + images
  ```

### 10. DevOps

- [ ] **CI/CD Pipeline**
  ```yaml
  # .github/workflows/deploy.yml
  # Tests → Build → Deploy
  ```

- [ ] **Environments**
  - [ ] Development (local)
  - [ ] Staging (pré-prod)
  - [ ] Production

- [ ] **Monitoring production**
  - [ ] Uptime monitoring (UptimeRobot)
  - [ ] Performance monitoring (New Relic / Datadog)
  - [ ] Alerting (email/Slack si down)

### 11. Analytics

- [ ] **Dashboard Admin**
  - [ ] Liste projets (filtre par date, status)
  - [ ] Liste leads (export CSV)
  - [ ] Stats (générations/jour, taux conversion)

- [ ] **Analytics utilisateur**
  ```bash
  npm install @vercel/analytics
  # ou Posthog, Mixpanel
  ```

- [ ] **Métriques métier**
  - [ ] Temps moyen génération
  - [ ] Taux de succès IA
  - [ ] Taux conversion email
  - [ ] Taux clic Calendly

---

## 📊 Phase 3 : AMÉLIORATIONS (Nice-to-have) - 3-4 semaines

### 12. Fonctionnalités Avancées

- [ ] **Régénération image**
  - [ ] Permettre 2-3 versions différentes
  - [ ] Historique des générations

- [ ] **Partage social**
  - [ ] Bouton partage (LinkedIn, Facebook)
  - [ ] Open Graph meta tags

- [ ] **Multi-langue**
  - [ ] i18n (Français, Anglais)
  - [ ] Détection langue navigateur

- [ ] **Mobile app** (Tauri déjà configuré)
  - [ ] Build iOS
  - [ ] Build Android
  - [ ] Submit aux stores

### 13. Optimisations Avancées

- [ ] **Image lazy loading**
- [ ] **Service Worker (PWA)**
- [ ] **WebP conversion**
- [ ] **Prefetching/preloading**

### 14. A/B Testing

- [ ] **Tester variations**
  - [ ] Couleur bouton CTA
  - [ ] Texte modal email
  - [ ] Position slider avant/après

---

## 🎯 Résumé par Priorité

### 🔴 BLOQUANTS (Ne PAS déployer sans ça)

1. ✅ Sécurité (validation, sanitization, secrets)
2. ✅ Nano Banana API configurée et testée
3. ✅ Email SMTP testé
4. ✅ MongoDB Atlas configuré
5. ✅ Génération PDF implémentée
6. ✅ Monitoring (Sentry minimum)

**Temps estimé** : 1-2 semaines

### 🟡 RECOMMANDÉS (Déployer avec prudence sans ça)

7. ✅ Tests basiques
8. ✅ Performance (cache, compression)
9. ✅ UX/Erreurs user-friendly
10. ✅ Legal/RGPD (mentions, cookies)
11. ✅ DevOps (CI/CD, staging)

**Temps estimé** : 2-3 semaines

### 🟢 NICE-TO-HAVE (Post-lancement)

12. ✅ Dashboard admin
13. ✅ Analytics avancées
14. ✅ Fonctionnalités avancées
15. ✅ Optimisations

**Temps estimé** : 3-4 semaines+

---

## 📅 Timeline Production

### MVP Minimum Viable (4-6 semaines)
```
Semaine 1-2 : Phase 1 (Bloquants)
Semaine 3-4 : Phase 2 (Importants)
Semaine 5-6 : Tests + Polish + Déploiement staging
```

### Lancement Soft (2 semaines)
```
Semaine 7-8 : Beta privée (10-20 utilisateurs)
            → Feedback
            → Fixes bugs critiques
```

### Lancement Public (1 semaine)
```
Semaine 9 : Go live
          → Monitoring intensif
          → Support client réactif
```

---

## ✅ Definition of Done

L'application est **production ready** quand :

- [x] **Aucune erreur non gérée** (try/catch partout)
- [x] **Sentry configuré** (erreurs trackées)
- [x] **Tests passent** (minimum 70% coverage critiques)
- [x] **Performance OK** (génération < 30s)
- [x] **Sécurité validée** (audit basique fait)
- [x] **RGPD compliant** (mentions légales + cookies)
- [x] **Monitoring en place** (uptime + errors)
- [x] **Backup automatique** (MongoDB + S3)
- [x] **Documentation à jour** (README, API docs)
- [x] **Runbook créé** (que faire si down)

---

**Dernière mise à jour** : Décembre 2024
