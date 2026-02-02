# 🎮 Letterix – Plateforme de jeux de lettres

[![PHP](https://img.shields.io/badge/PHP-7.4+-777BB4?style=flat&logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Projet réalisé dans le cadre du **Projet Web** de notre formation.  
**Letterix** est une plateforme web de jeux de lettres en ligne avec un système utilisateur complet, inspirée de sites comme *Le Parisien Jeux*.

---

## 📌 Présentation du projet

**Letterix** offre une expérience de jeu complète avec :
- 🎯 Deux jeux de lettres interactifs (Motus et Mots Mêlés)
- 👥 Système de gestion d'utilisateurs sécurisé
- 📊 Statistiques détaillées et suivi de progression
- 🏆 Classement compétitif entre joueurs
- 🔥 Système de streaks pour encourager la régularité

### Jeux disponibles :

#### 🔵 **Motus** - Devinez le mot en 6 tentatives
- 3 niveaux de difficulté (Facile, Moyen, Difficile)
- 9 niveaux par difficulté (27 niveaux au total)
- Système de score basé sur le temps et les tentatives
- Indices de couleur pour guider le joueur
- Chronomètre et compteur de tentatives en temps réel
  
#### 🟡 **Mots Mêlés** - Trouvez tous les mots cachés
- 3 niveaux de difficulté (Facile, Moyen, Difficile)
- 9 niveaux par difficulté (27 niveaux au total)
- Grilles dynamiques générées aléatoirement
- Sélection interactive des mots
- Validation visuelle des mots trouvés

---

## 🛠️ Technologies utilisées

### Front-end
- **HTML5** 
- **CSS3** 
- **JavaScript** 

### Back-end
- **PHP 7.4+** 
- **MySQL 8.0+** 
 
<img width="323" height="120" alt="image" src="https://github.com/user-attachments/assets/08ef40ad-9927-43db-ab24-4ef7818fd21c" />

### Outils de développement
- **WAMP** - Environnement local (Windows/Apache/MySQL/PHP)
- **GitHub** - Versionnement et collaboration
- **Trello** - Gestion de projet Agile
- **Visual Studio Code** - Éditeur de code
- **phpMyAdmin** - Administration BDD

---

## ✨ Fonctionnalités principales

### 🔐 Authentification et Sécurité
- **Inscription/Connexion sécurisée**
  - Hachage des mots de passe (password_hash/verify)
  - Protection CSRF avec tokens

### 👤 Profil Utilisateur
- **Page profil personnalisée**
  - Statistiques globales (niveaux complétés, score total, temps de jeu)
  - Statistiques par difficulté et par jeu
  - Graphiques de progression
  - Modification des informations (pseudo, email)
  - Changement de mot de passe sécurisé
  - Suppression de compte avec confirmation

### 🎮 Système de Jeu
- **Jeux interactifs**
  - Interface intuitive et responsive
  - Sauvegarde automatique de la progression
  - Système de niveaux progressifs
  - Chronomètre précis
  - Compteur de tentatives
  - Bouton d'indice disponible
  - Animations et feedback visuel immédiat
  - Popups de victoire/défaite avec statistiques

### 🧮 Scoring et Classement
- **Système de score avancé**
  - Calcul basé sur difficulté, temps et performance
  - Bonus pour rapidité et peu de tentatives
  - Sauvegarde en BDD et LocalStorage
  - Synchronisation automatique
  - Historique des meilleurs scores
  
- **🏆 Classement des joueurs**
  - Top 3 sur podium visuel 3D
  - Classement général avec pagination
  - Mise à jour en temps réel
  - Affichage du rang personnel
  - Nombre de parties jouées

### ⚙️ Administration
- **Panel administrateur** (rôle admin requis)
  - Tableau de bord avec métriques
  - Gestion des utilisateurs (liste, recherche)
  - Modification des rôles (user/admin)
  - Suppression d'utilisateurs
  - Statistiques globales de la plateforme
  - Nombre total d'utilisateurs
  - Nombre total de parties jouées

### 💾 Stockage des Données
- **Double système de sauvegarde**
  - LocalStorage : progression locale, cache des scores
  - MySQL : authentification, scores officiels, statistiques
  - Synchronisation automatique entre les deux
  - Récupération en cas de déconnexion

---

## 📁 Structure du projet

```
projet-web-v2/
├── api/                          # API REST
│   ├── change-role.php           # Modifier le rôle utilisateur
│   ├── delete-user.php           # Supprimer un utilisateur
│   ├── get-all-users.php         # Liste tous les utilisateurs
│   ├── get-stats.php             # Statistiques globales
│   ├── get_user.php              # Info utilisateur connecté
│   └── save_score.php            # Sauvegarder un score
├── assets/                       # Ressources statiques
│   ├── css/                      # Feuilles de style
│   │   ├── accueil.css
│   │   ├── calendrier.css
│   │   ├── classement.css
│   │   ├── global.css            # Styles globaux
│   │   ├── inscription.css
│   │   ├── jeu-mots-meles.css
│   │   ├── jeu-motus.css
│   │   ├── mots-meles.css        # Menu des niveaux
│   │   ├── motus.css             # Menu des niveaux
│   │   ├── panel-admin.css
│   │   └── profil.css
│   └── js/                       # Scripts JavaScript
│       ├── dictionnaire.js       # Base de mots français
│       ├── jeu-mots-meles.js     # Logique Mots Mêlés
│       ├── jeu-motus.js          # Logique Motus
│       ├── main.js               # Script global
│       ├── mots-meles.js         # Menu niveaux Mots Mêlés
│       ├── motus.js              # Menu niveaux Motus
│       ├── panel-admin.js        # Panel admin
│       └── profil.js             # Page profil
├── php/                          # Scripts PHP backend
│   ├── auth.php                  # Authentification & sécurité
│   ├── change_password.php       # Changement de mot de passe
│   ├── db.php                    # Connexion base de données
│   ├── delete_account_with_password.php
│   ├── get_classement.php        # Données classement
│   ├── get_streaks.php           # Calcul des streaks
│   ├── logout.php                # Déconnexion
│   └── update_profile.php        # Mise à jour profil
├── sql/                          # Scripts SQL
│   └── bdd_projet_web.sql        # Export de la base de données
├── apropos.html                  # Page À propos
├── calendrier.php                # Page calendrier/streaks
├── classement.php                # Page classement
├── footer.html                   # Footer réutilisable
├── header.php                    # Header avec session
├── index.php                     # Page d'accueil (dashboard)
├── inscription.php               # Inscription/Connexion
├── jeu-mots-meles.html          # Jeu Mots Mêlés
├── jeu-motus.html               # Jeu Motus
├── mots-meles.html              # Menu niveaux Mots Mêlés
├── motus.html                   # Menu niveaux Motus
├── panel-admin.php              # Interface admin
├── politique.html               # Politique de confidentialité
├── profil.php                   # Page profil utilisateur
└── README.md                    # Ce fichier
```

---

## 🗄️ Base de données

### Tables principales :

#### `utilisateurs`
Gestion des comptes utilisateurs
```sql
- id_user (INT, PK, AUTO_INCREMENT)
- pseudo (VARCHAR)
- email (VARCHAR, UNIQUE)
- mot_de_passe (VARCHAR, hashed)
- score_total (INT, default 0)
- role (ENUM: 'user', 'admin')
- date_creation (DATETIME)
```

#### `parties`
Enregistrement des parties jouées
```sql
- id_partie (INT, PK, AUTO_INCREMENT)
- id_user (INT, FK -> utilisateurs)
- id_jeu (INT, FK -> jeux)
- id_niveau (INT, FK -> difficultes)
- numero_niveau (INT)
- score_obtenu (INT)
- temps_passe (INT, en secondes)
- date_partie (DATETIME)
```

#### `jeux`
Liste des jeux disponibles
```sql
- id_jeu (INT, PK, AUTO_INCREMENT)
- nom_jeu (VARCHAR: 'Motus', 'Mots Mêlés')
```

#### `difficultes`
Niveaux de difficulté
```sql
- id_difficulte (INT, PK, AUTO_INCREMENT)
- nom_difficulte (VARCHAR: 'Facile', 'Moyen', 'Difficile')
- id_jeu (INT, FK -> jeux)
```

### Fonctionnalités de la BDD :
- Gestion des comptes utilisateurs sécurisée
- Enregistrement de toutes les parties
- Calcul automatique des scores totaux
- Historique complet des performances
- Statistiques par joueur, jeu et difficulté
- Relations optimisées avec clés étrangères

---

## 🚀 Installation du projet

### Prérequis
- WAMP Server 3.2+ (ou XAMPP/MAMP)
- PHP 7.4 ou supérieur
- MySQL 8.0 ou supérieur
- Navigateur web moderne (Chrome, Firefox, Edge)

### Étapes d'installation

#### 1. Cloner le projet

- copier le lien ci-dessuos puis aller sur votre navigateur
  [letterix](https://letterix.rf.gd/projet-web-v2/)

#### 6. Créer un compte
- Cliquer sur "S'inscrire"
- Remplir le formulaire d'inscription
- Se connecter avec les identifiants créés

#### 7. Compte administrateur (optionnel)
Pour tester le panel admin :
1. Créer un compte normal
2. Via phpMyAdmin, modifier le champ `role` de 'user' à 'admin'
3. Se reconnecter pour accéder au panel admin

---

## 📖 Utilisation

### Navigation principale
- **Accueil** : Dashboard avec statistiques personnelles
- **Motus** : Menu des niveaux Motus
- **Mots Mêlés** : Menu des niveaux Mots Mêlés
- **Calendrier** : Suivi des streaks et progression
- **Classement** : Top joueurs de la plateforme
- **Profil** : Gestion du compte et statistiques détaillées
- **Admin** : Panel d'administration (admin uniquement)

### Jouer à Motus
1. Sélectionner une difficulté (Facile/Moyen/Difficile)
2. Choisir un niveau (1-9)
3. La première lettre du mot est affichée
4. Taper un mot de la même longueur
5. Les couleurs indiquent :
   - 🟢 Vert : Lettre correcte et bien placée
   - 🟡 Jaune : Lettre correcte mais mal placée
   - ⚫ Gris : Lettre absente du mot
6. Maximum 6 tentatives

### Jouer aux Mots Mêlés
1. Sélectionner une difficulté
2. Choisir un niveau
3. Cliquer et glisser pour sélectionner les mots
4. Les mots trouvés se barrent dans la liste
5. Trouver tous les mots pour terminer le niveau

### Système de scoring
Le score dépend de :
- **Difficulté** : Facile (x1), Moyen (x1.5), Difficile (x2)
- **Temps** : Bonus pour la rapidité
- **Performance** : Tentatives pour Motus, vitesse pour Mots Mêlés

---

## 📊 Organisation du projet

### Méthodologie
- **Versionnement** : Git/GitHub avec branches de développement
- **Gestion de projet** : Trello (méthodologie Agile)
- **Collaboration** : Réunions quotidiennes (daily standup)
- **Code Review** : Validation par les pairs avant merge


### Tâches principales
1. ✅ Conception de la base de données
2. ✅ Système d'authentification
3. ✅ Développement du jeu Motus
4. ✅ Développement du jeu Mots Mêlés
5. ✅ Système de scoring
6. ✅ Calendrier et streaks
7. ✅ Classement des joueurs
8. ✅ Panel administrateur
9. ✅ Design responsive
10. ✅ Tests et débogage

---

## 🚀 Équipe de développement

Projet réalisé par une équipe de 4 développeurs :

- **[Moussa Keita](https://github.com/moussa197)**
- **[Maxime Luneau](https://github.com/max13003)** 
- **[Kenny Ian Bukuru](https://github.com/bukuru2006)**
- **[Loan Roinel](https://github.com/LoanKma)** 

---

## 📝 Fonctionnalités futures

- [ ] Mode multijoueur en temps réel
- [ ] Système de badges et réalisations
- [ ] Thème clair/sombre sélectionnable
- [ ] Nouveaux jeux de lettres
- [ ] Système de défis quotidiens
- [ ] Partage de scores sur réseaux sociaux
- [ ] système de streak comme sur duolingo 


---



