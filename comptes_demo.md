# 🇸🇳 Comptes de Démo & Accès - Sunu Hajj 2026

Ce document récapitule l'ensemble des accès et identifiants de test pré-configurés pour les différents portails de la plateforme (Officiel DGP, Agences Agréées, Espace Pèlerin).

---

## 👑 1. Portail Officiel DGP (Administrateur)
* **URL** : [https://sunu-hajj-admin.vercel.app](https://sunu-hajj-admin.vercel.app) (Onglet **Officiel DGP**)
* **Description** : Permet de superviser toute la campagne, valider les dossiers, attribuer les vols/hôtels, et synchroniser avec le système saoudien Nusuk.

| Identifiant | Mot de passe | Rôle | Nom complet | Affectation |
| :--- | :--- | :--- | :--- | :--- |
| **`dgpadmin`** | `hajj2026!` | Super Administrateur | Direction Générale DGP | Direction Générale |

*💡 Note : Une fois connecté avec ce compte, vous pouvez créer d'autres agents DGP (ex: médecins, logisticiens) avec des accès personnalisés.*

---

## 🕋 2. Portail des Agences de Voyage Agréées
* **URL** : [https://sunu-hajj-admin.vercel.app](https://sunu-hajj-admin.vercel.app) (Onglet **Agence Agréée**)
* **Description** : Permet aux agences de suivre uniquement leurs pèlerins, d'analyser leurs statistiques de quota et d'enregistrer directement de nouveaux dossiers.

| Identifiant (Login) | Mot de passe | Agence correspondante | Tarif package | Type de package |
| :--- | :--- | :--- | :--- | :--- |
| **`teranga`** | `agency123!` | Voyages Teranga Hajj & Omra | 3 600 000 F CFA | Économique |
| **`dakarair`** | `agency123!` | Dakar Air Services Hajj | 4 900 000 F CFA | Standard |
| **`sahelomra`** | `agency123!` | Sahel Omra & Hajj Confort | 8 500 000 F CFA | VIP / Luxe |

---

## ✈️ 3. Espace Web & Mobile Pèlerin
* **URL Web** : [https://sunu-hajj-admin.vercel.app/?portal=pelerin](https://sunu-hajj-admin.vercel.app/?portal=pelerin)
* **Application Mobile** : Se connecter via l'écran d'accueil Flutter.
* **Description** : Les pèlerins n'ont pas besoin de mot de passe complexe, ils s'identifient à l'aide de leur **numéro de passeport unique**.

| Numéro de Passeport | Nom complet | Agence choisie | Statut Dossier DGP | Statut Visa Hajj | Statut Logistique (Vol / Hôtel) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`SN9876543`** | Moustapha Diop | Voyages Teranga | 🟢 **Validé** | 🟢 **Émis (Nusuk Synced)** | Assigné (Vol TX-201, Hôtel Abraj) |
| **`SN1234567`** | Khadidiatou Diallo | Dakar Air Services | 🟠 **En cours** | ⌛ **En cours** | Non assigné |
| **`SN4567890`** | Ousmane Ndiaye | Voyages Teranga | 🟠 **En cours (Apte Médical)** | 🟢 **Émis** | Assigné (Vol TX-201, Hôtel Abraj) |
| **`SN3344556`** | Aïssatou Sow | Sahel Omra | 🔴 **Rejeté (Inapte Médical)** | ❌ **Bloqué** | Non assigné |

---

## 🔒 Règles de Sécurité de Démo
* Les sessions sont enregistrées localement dans le navigateur.
* Si le serveur local (Node.js) est actif sur votre machine, les données sont persistées dans la base de données double-écriture SQLite (`db_primary.sqlite`).
* Si le serveur est éteint (utilisation directe sur le lien Vercel), le système bascule automatiquement en mode simulation et utilise le stockage local de votre navigateur (`localStorage`).
