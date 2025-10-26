# 🚀 Guide de Démarrage Rapide - e-Rose

## Étape 1 : Vérifier la structure

Votre projet doit avoir cette structure :

```
Hackathon/
├── public/
│   ├── index.html              ✅ Page d'accueil
│   ├── cancer-sein.html        ✅ Page cancer du sein
│   ├── cancer-col.html         ✅ Page cancer du col
│   ├── depistage-general.html  ✅ Évaluation
│   ├── offline.html            ✅ Page hors ligne
│   ├── manifest.json           ✅ Manifeste PWA
│   ├── sw.js                   ✅ Service Worker
│   ├── css/
│   │   └── styles.css          ✅ Styles
│   ├── js/
│   │   └── app.js              ✅ JavaScript
│   ├── icons/                  ⚠️ À créer
│   ├── img/                    ⚠️ À créer
│   ├── audio/                  ⚠️ Optionnel
│   └── data/                   ⚠️ Optionnel
```

## Étape 2 : Créer les icônes manquantes

Les icônes PWA sont requises. Créez un dossier `icons/` dans `public/` et ajoutez des icônes PNG aux tailles suivantes :

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

**Solution rapide** : Utilisez un générateur en ligne comme https://realfavicongenerator.net/

Ou créez un simple logo rose avec un ruban (symbole du cancer du sein).

## Étape 3 : Lancer le serveur

### Option A : Avec Python (Recommandé - Déjà installé sur Windows)

```powershell
# Ouvrir PowerShell dans le dossier Hackathon
cd C:\Users\ahmad\Desktop\Hackathon\public

# Python 3
python -m http.server 8080

# Ou si vous avez Python 2
python -m SimpleHTTPServer 8080
```

### Option B : Avec Node.js (Si installé)

```powershell
# Installer http-server
npm install -g http-server

# Lancer
cd C:\Users\ahmad\Desktop\Hackathon\public
http-server -p 8080
```

### Option C : Avec le script PowerShell existant

```powershell
cd C:\Users\ahmad\Desktop\Hackathon
.\serve.ps1
```

## Étape 4 : Ouvrir dans le navigateur

1. Ouvrez **Chrome** ou **Edge**
2. Allez sur : `http://localhost:8080`
3. Vous devriez voir la page d'accueil avec 2 cartes :
   - Cancer du Sein (rose)
   - Cancer du Col de l'Utérus (violet)

## Étape 5 : Tester les fonctionnalités

### Test 1 : Navigation
- ✅ Cliquez sur "Cancer du Sein" → Page détaillée s'ouvre
- ✅ Cliquez sur "Cancer du Col" → Page détaillée s'ouvre
- ✅ Utilisez le bouton retour (flèche) pour revenir à l'accueil

### Test 2 : Mode hors ligne
1. Ouvrez DevTools (F12)
2. Allez dans "Application" > "Service Workers"
3. Vérifiez que le SW est enregistré
4. Cochez "Offline" dans "Service Workers"
5. Rechargez la page → Devrait toujours fonctionner

### Test 3 : Installation PWA
1. Dans Chrome, cliquez sur l'icône ⊕ dans la barre d'adresse
2. Cliquez sur "Installer"
3. L'application s'ouvre en mode standalone
4. Vérifiez qu'elle apparaît dans le menu Démarrer

### Test 4 : Synthèse vocale
1. Sur une page de contenu, cliquez sur "Écouter"
2. Le contenu devrait être lu à voix haute
3. Fonctionne uniquement si votre navigateur supporte Web Speech API

### Test 5 : Responsive
1. Ouvrez DevTools (F12)
2. Cliquez sur l'icône mobile/tablette
3. Testez différentes tailles d'écran
4. Tout doit rester lisible et fonctionnel

## 🐛 Résolution des problèmes

### Erreur : "Service Worker registration failed"
- **Cause** : Pas de HTTPS (sauf localhost)
- **Solution** : Utilisez localhost ou 127.0.0.1

### Erreur : 404 sur les icônes
- **Cause** : Dossier `icons/` manquant
- **Solution** : Créez le dossier et ajoutez des icônes placeholder

### Page blanche après installation
- **Cause** : Chemins relatifs incorrects
- **Solution** : Vérifiez que tous les chemins commencent par `/`

### Le cache ne se met pas à jour
- **Cause** : Ancienne version du SW en cache
- **Solution** : 
  1. DevTools > Application > Storage > "Clear site data"
  2. Fermez tous les onglets de l'app
  3. Rechargez

## 📊 Checklist de validation

Avant de déployer, vérifiez :

- [ ] Toutes les pages se chargent correctement
- [ ] La navigation fonctionne (liens entre pages)
- [ ] Le Service Worker s'enregistre sans erreur
- [ ] Le mode hors ligne fonctionne
- [ ] L'application peut être installée (PWA)
- [ ] Responsive sur mobile (testez avec DevTools)
- [ ] Pas d'erreurs dans la console
- [ ] Les icônes s'affichent correctement
- [ ] Le manifest.json est valide
- [ ] HTTPS activé (pour la production)

## 🎉 Prochaines étapes

Une fois que tout fonctionne :

1. **Ajoutez du contenu** : Images, vidéos, témoignages
2. **Améliorez les données** : Créez des fichiers JSON pour les centres de santé
3. **Testez avec de vrais utilisateurs** : Collectez des retours
4. **Déployez** : Netlify, Vercel, GitHub Pages
5. **Promouvez** : Partagez avec les communautés cibles

## 📞 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur (F12)
2. Consultez le README.md pour plus de détails
3. Vérifiez que tous les fichiers sont présents

---

**Bon développement ! 🚀**
