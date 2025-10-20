# 🔧 Guide de Dépannage - Demo Demet Air

## ❌ Erreur 404 lors du retour sur une page de résultat

### Symptômes
- Vous générez un projet et voyez le résultat
- Vous quittez la page (bouton retour, navigation, etc.)
- Vous essayez de revenir à la même URL `/result/:id`
- Vous obtenez une erreur "Projet non trouvé"

### Causes possibles

#### 1. Backend non démarré 🔴
Le serveur backend doit être en cours d'exécution pour que l'application fonctionne.

**Solution :**
```bash
cd backend
npm run dev
```

Vérifiez que vous voyez :
```
🚀 Server running on http://localhost:4001
📊 Environment: development
🗄️  Database: demet-air-demo
```

#### 2. MongoDB non connecté 🔴
Le backend utilise MongoDB pour la persistance des projets.

**Vérification :**
1. Vérifiez que MongoDB est installé et démarré
2. Vérifiez le fichier `.env` du backend :
   ```
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=demet-air-demo
   ```

**Solution si MongoDB n'est pas installé :**
```bash
# Windows (avec Chocolatey)
choco install mongodb

# macOS
brew install mongodb-community

# Linux
sudo apt-get install mongodb
```

**Démarrer MongoDB :**
```bash
# Windows
net start MongoDB

# macOS/Linux
brew services start mongodb-community
# ou
sudo systemctl start mongod
```

#### 3. Base de données vide 🔴
Si vous avez redémarré MongoDB ou supprimé la base de données, les anciens projets ne sont plus accessibles.

**Solution :**
- Les anciens liens ne fonctionneront plus
- Générez un nouveau projet depuis la page d'accueil
- Pour éviter ce problème à l'avenir, ne supprimez pas la base de données

#### 4. ID de projet invalide 🔴
L'URL contient un ID qui n'existe pas dans la base de données.

**Solution :**
- Vérifiez que vous utilisez la bonne URL
- Générez un nouveau projet si nécessaire

### Vérification rapide

Pour vérifier que tout fonctionne :

1. **Tester le backend :**
   ```bash
   curl http://localhost:4001/health
   # Devrait retourner: {"status":"ok","service":"demo-demet-air"}
   ```

2. **Vérifier MongoDB :**
   ```bash
   # Connexion à MongoDB
   mongosh
   
   # Dans le shell MongoDB
   use demet-air-demo
   db.projects.find().count()
   # Devrait retourner le nombre de projets
   ```

3. **Vérifier les logs du backend :**
   - Les logs doivent afficher les requêtes entrantes
   - Cherchez des erreurs MongoDB ou de connexion

### Configuration recommandée

Pour éviter ces problèmes à l'avenir :

1. **Démarrez toujours les deux serveurs :**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

2. **Utilisez un service MongoDB persistant :**
   - Configurez MongoDB comme service système
   - Ou utilisez MongoDB Atlas (cloud) pour une persistance garantie

3. **Configuration .env du backend :**
   ```env
   # Serveur
   PORT=4001
   HOST=0.0.0.0
   NODE_ENV=development
   
   # MongoDB - LOCAL
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=demet-air-demo
   
   # Ou MongoDB Atlas (recommandé pour production)
   # MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net
   
   # CORS
   CORS_ORIGIN=http://localhost:5173
   
   # Stockage
   STORAGE_TYPE=local
   LOCAL_STORAGE_PATH=uploads
   
   # API Keys
   OPENROUTER_API_KEY=your_key_here
   ```

## 🎨 Problème "Prix au m²" dans le header

Le bouton "Prix au m²" que vous voyez dans le coin supérieur droit n'est **pas** dans le code source actuel.

### Causes possibles :
1. **Extension de navigateur** - Désactivez vos extensions et rechargez
2. **Cache du navigateur** - Effacez le cache (Ctrl+Shift+Delete)
3. **Ancien code** - Vérifiez que vous êtes sur la dernière version

### Vérification :
```bash
# Chercher "prix au m" dans tous les fichiers
grep -r "prix au m" src/
grep -r "Prix au m" src/

# Si rien n'est trouvé, le bouton vient d'ailleurs
```

## 📞 Support

Si le problème persiste :
1. Vérifiez les logs du backend et du frontend
2. Ouvrez la console développeur (F12) pour voir les erreurs
3. Consultez le fichier `IMPLEMENTATION-GUIDE.md` pour plus de détails
