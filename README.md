# e-Rose (demo)

Site statique de démonstration pour la campagne Octobre Rose.

Fonctionnalités:
- Pages: `index.html` (login), `inscription.html` (inscription), `evaluation.html` (questionnaire), `dashboard.html` (espace utilisateur).
- Authentification simple côté client (localStorage) pour demo.
- Évaluation de risque avec sauvegarde locale et affichage sur le dashboard.

Installation et test local (Windows PowerShell):

1. Ouvrir PowerShell et positionner dans le dossier du projet:

```powershell
cd 'C:\Users\ahmad\Desktop\Hackathon'
```

2. Lancer un serveur HTTP simple (Python 3 requis):

```powershell
py -3 -m http.server 8000
# ou si python est accessible via 'python'
# python -m http.server 8000
```

3. Ouvrir votre navigateur à `http://localhost:8000/inscription.html`.

Remarques importantes:
- Placez l'image fournie en `assets/bg_octobre.jpg` si vous voulez voir le fond personnalisé.
- Tous les utilisateurs et évaluations sont stockés dans `localStorage` (démo seulement). Ne pas utiliser en production.

Si tu veux, je peux aussi automatiser le commit & push vers GitHub (je peux le faire maintenant).
