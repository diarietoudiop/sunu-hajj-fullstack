# Sunu Hajj - Platform Full-Stack

Cette plateforme est conçue pour accompagner les pèlerins sénégalais effectuant le Hajj. Elle intègre :
1. **Un Backend Node.js (API REST Express)** qui gère l'annuaire des agences, les communiqués officiels, les demandes de contact, et calcule les recommandations budgétaires.
2. **Un Frontend Web d'Administration React (Vite)** utilisé par les autorités (DGP) pour accréditer les agences, diffuser les communiqués et suivre l'activité globale en temps réel.
3. **Un Frontend Mobile Flutter (Dart)** contenant l'intégralité du parcours utilisateur en mode hors-ligne et en ligne (Français / Wolof / Arabe) avec checklist locale, simulateur de budget connecté et coffre-fort sécurisé.

---

## 🚀 Comment lancer les applications

### Étape 1 : Installer les prérequis
Assurez-vous d'avoir installé sur votre machine :
1. **Node.js** (recommandé v18+) pour le serveur et le dashboard d'administration.
2. **Flutter SDK** (v3.0+) pour compiler et lancer l'application mobile.

---

### Étape 2 : Lancer le Serveur Node.js (Backend)
Dans votre terminal :
```bash
cd backend-node
npm install
npm start
```
Le serveur démarrera sur [http://localhost:3000](http://localhost:3000).

---

### Étape 3 : Lancer le Tableau de Bord DGP (React Admin)
Ouvrez un nouveau terminal :
```bash
cd frontend-react
npm install
npm run dev
```
Accédez au tableau de bord via l'adresse affichée dans votre terminal (généralement [http://localhost:5173](http://localhost:5173)).

---

### Étape 4 : Lancer l'Application Mobile (Flutter)
Assurez-vous d'avoir un émulateur ouvert ou un téléphone connecté en USB, puis dans un troisième terminal :
```bash
cd frontend-flutter
flutter pub get
flutter run
```
*Note : Sur l'émulateur Android, l'adresse du serveur local Node.js est automatiquement configurée sur `http://10.0.2.2:3000`.*

---

## 🌐 Comment pousser le projet sur GitHub

Si vous souhaitez héberger ce code sur votre compte GitHub, suivez ces étapes simples dans votre terminal à la racine du projet :

1. **Créer un nouveau dépôt public ou privé sur votre compte [GitHub](https://github.com/new)** (sans l'initialiser avec un README ou un .gitignore car ils sont déjà inclus ici).
2. **Récupérer l'URL de votre dépôt** (format : `https://github.com/VOTRE_NOM/NOM_DEPOT.git`).
3. **Lier et pousser les sources** en exécutant ces commandes :
   ```bash
   # Ajouter le dépôt distant (remplacez par votre URL)
   git remote add origin https://github.com/VOTRE_NOM/NOM_DEPOT.git

   # Renommer la branche principale en main
   git branch -M main

   # Pousser le code
   git push -u origin main
   ```
