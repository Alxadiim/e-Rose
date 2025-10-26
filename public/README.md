# e-Rose - Application PWA de Dépistage des Cancers Féminins

Application Progressive Web App (PWA) pour le dépistage et l'information sur les cancers du sein et du col de l'utérus, destinée aux zones rurales avec connectivité limitée.

## 🎯 Fonctionnalités

### ✅ Implémentées
- **Page d'accueil** avec navigation vers les différents types de cancer
- **Cancer du sein** : informations complètes sur les symptômes, auto-examen, dépistage et facteurs de risque
- **Cancer du col de l'utérus** : prévention (vaccination HPV), dépistage (frottis), symptômes et FAQ
- **Évaluation du risque** : questionnaire interactif pour évaluer les facteurs de risque personnels
- **Mode hors ligne** : fonctionne sans connexion internet grâce au Service Worker
- **Synthèse vocale** : lecture audio du contenu pour améliorer l'accessibilité
- **Responsive design** : adapté aux mobiles, tablettes et ordinateurs
- **Installation PWA** : peut être installée comme une application native

## 🚀 Installation et lancement

### Prérequis
- Un serveur web local (http-server, Python, etc.)
- Un navigateur moderne (Chrome, Firefox, Safari, Edge)

### Méthode 1 : Avec Node.js et http-server
```bash
# Installer http-server globalement
npm install -g http-server

# Naviguer vers le dossier public
cd public

# Lancer le serveur
http-server -p 8080

# Ouvrir dans le navigateur
# http://localhost:8080
```

### Méthode 2 : Avec Python
```bash
# Python 3
cd public
python -m http.server 8080

# Python 2
cd public
python -m SimpleHTTPServer 8080

# Ouvrir dans le navigateur
# http://localhost:8080
```

### Méthode 3 : Avec le script PowerShell fourni
```powershell
# À la racine du projet
.\serve.ps1
```

## 📁 Structure du projet

```
public/
├── index.html                  # Page d'accueil
├── cancer-sein.html           # Page cancer du sein
├── cancer-col.html            # Page cancer du col
├── depistage-general.html     # Évaluation du risque
├── offline.html               # Page hors ligne
├── manifest.json              # Manifeste PWA
├── sw.js                      # Service Worker
├── css/
│   └── styles.css            # Styles personnalisés
├── js/
│   └── app.js                # Logique de l'application
├── icons/                     # Icônes PWA (à créer)
├── img/                       # Images
├── audio/                     # Fichiers audio
└── data/                      # Données JSON locales
```

## 🎨 Personnalisation

### Couleurs
Les couleurs principales sont définies dans `/css/styles.css` :
- **Rose (#FF69B4)** : Cancer du sein
- **Violet (#9370DB)** : Cancer du col
- **Orange (#FF8C00)** : Évaluation générale

### Contenu
Le contenu est actuellement en français. Pour ajouter d'autres langues :
1. Créer des fichiers JSON dans `/data/` avec les traductions
2. Modifier `/js/app.js` pour gérer la langue sélectionnée
3. Utiliser les attributs `data-i18n` dans le HTML

## 🔧 Fonctionnalités à développer

### Priorité haute
- [ ] Système de rappels avec notifications push
- [ ] Stockage local des données utilisateur (IndexedDB)
- [ ] Export PDF des résultats d'évaluation
- [ ] Répertoire des centres de dépistage avec géolocalisation
- [ ] Mode agent de santé avec formulaires hors ligne

### Priorité moyenne
- [ ] Intégration SMS/WhatsApp pour partage d'informations
- [ ] Vidéos éducatives compressées
- [ ] Module de télémoignages
- [ ] Tableau de bord personnel avec historique
- [ ] Support multilingue (Arabe, Anglais, langues locales)

### Priorité basse
- [ ] Gamification avec badges et récompenses
- [ ] Forum communautaire
- [ ] Intégration avec API de santé publique
- [ ] Mode sombre complet
- [ ] Analytics (anonymes) pour améliorer le service

## 🧪 Tests

### Test du Service Worker
1. Ouvrir DevTools (F12)
2. Aller dans l'onglet "Application" > "Service Workers"
3. Vérifier que le SW est actif
4. Tester le mode hors ligne en cochant "Offline"

### Test de la PWA
1. Ouvrir l'application dans Chrome
2. Cliquer sur l'icône d'installation dans la barre d'adresse
3. Installer l'application
4. Vérifier qu'elle fonctionne en mode standalone

### Test de performance
```bash
# Avec Lighthouse (Chrome DevTools)
1. Ouvrir DevTools > Lighthouse
2. Sélectionner "Progressive Web App"
3. Cliquer sur "Generate report"
4. Objectif : Score > 90
```

## 📱 Compatibilité

### Navigateurs supportés
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

### Appareils
- ✅ Smartphones (iOS, Android)
- ✅ Tablettes
- ✅ Ordinateurs de bureau

## 🔒 Sécurité et confidentialité

- **Pas de collecte de données personnelles** sans consentement
- **Stockage local** uniquement (pas de serveur centralisé)
- **HTTPS obligatoire** pour la PWA en production
- **Anonymisation** des données si synchronisation future

## 🤝 Contribution

Pour contribuer au projet :
1. Créer une branche pour votre fonctionnalité
2. Tester localement
3. Créer une Pull Request avec description détaillée
4. Respecter les standards de code (ESLint, Prettier)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 👥 Contact

Pour toute question ou suggestion :
- Email : contact@erose.org
- Téléphone : 800 00 000

## 🙏 Remerciements

- Bootstrap 5 pour le framework CSS
- Font Awesome pour les icônes
- Communauté open source pour les outils utilisés

---

**Version actuelle** : 2.0.0  
**Dernière mise à jour** : Janvier 2025  
**Statut** : En développement actif
