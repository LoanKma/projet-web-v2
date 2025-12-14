# Projet Web V2 - Jeu de lettres

Petit projet web (PHP + MySQL + JS) proposant des mini-jeux de lettres, un suivi des utilisateurs, un classement et un système de "séries" (streaks).

**But**: fournir une plateforme simple pour jouer à des jeux de mots, suivre sa progression (niveaux, score, temps) et afficher des séries journalières.

**Technos**: PHP (PDO), MySQL, vanilla JavaScript, HTML/CSS.

**Arborescence importante**
- **index.php** : page d'accueil avec stats utilisateur.
- **profil.php** : tableau de bord utilisateur et détails des statistiques.
- **calendrier.html** : calendrier affichant les jours joués et la série (streaks).
- **php/** : endpoints et utilitaires (auth.php, db.php, get_streaks.php, get_user_stats.php, etc.).
- **assets/** : CSS et JS (styles et scripts front).

**Fonctionnalités clés**
- Authentification sessionnelle (inscription / connexion / déconnexion).
- Modification de profil et changement de mot de passe (endpoints sécurisés avec CSRF).
- Statistiques utilisateurs : niveaux complétés, score total, temps de jeu, meilleur temps.
- Système de séries (streaks) en fenêtre glissante 24h (endpoint `php/get_streaks.php`).
- Calendrier interactif qui marque les jours joués et affiche la série courante.

**Endpoints utiles**
- `php/get_streaks.php` : retourne JSON { current, best, activity_dates } (nécessite session).
- `php/get_user_stats.php` : retourne JSON des statistiques utilisateur (completed_levels, score_total, time_total_formatted, best_time_formatted, difficulty).
- `php/update_profile.php`, `php/change_password.php`, `php/delete_account_with_password.php` : gestion du profil.

Installation rapide (WAMP / localhost)
1. Placer le dossier dans le répertoire web (ex: `c:\wamp64\www\projet-web-v2`).
2. Créer la base MySQL `bdd_projet_web` et importer vos tables (`utilisateurs`, `parties`, `difficultes`, ...).
3. Adapter les constantes de connexion dans `php/db.php` si nécessaire.
4. Lancer WAMP/Apache + MySQL et ouvrir `http://localhost/projet-web-v2/`.

Tests et vérifications
- Se connecter avec un compte existant puis ouvrir `calendrier.html` pour vérifier la récupération des séries et des stats.
- Vérifier que `php/get_streaks.php` retourne bien `activity_dates` et que le calendrier marque les jours.
- Jouer plusieurs parties (ou insérer quelques lignes dans `parties`) pour tester la fenêtre de 24h et la meilleure série.

Considérations
- Les timestamps sont lus depuis `parties.date_partie` (stockés en UTC de préférence). Le calcul des séries utilise une fenêtre glissante de 24h.
- `get_user_stats.php` s'appuie sur les mêmes requêtes que `profil.php` pour assurer la cohérence des valeurs.
- Pas de modification du design prévue ici — les scripts front mettent à jour les éléments existants.

Prochaines améliorations possibles
- Table `user_achievements` et endpoint pour avoir un vrai ratio succès (`achievements`).
- Notifications / reminders pour garder la série.
- Page d'administration pour gérer les niveaux et les récompenses.

Si tu veux, je peux ajouter un petit script `php/seed_test_activity.php` pour injecter des activités de test en base afin de valider la logique de séries.

#Projet-web-v2#
ok
