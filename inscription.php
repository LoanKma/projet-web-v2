<?php
require_once 'php/db.php';
require_once 'php/auth.php';

if (isLoggedIn()) {
    header('Location: index.php');
    exit;
}

$errors = [];
$success = '';
$activeTab = 'connexion';

// CONNEXION
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login') {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $errors[] = "Token de sécurité invalide";
    } else {
        $identifier = cleanInput($_POST['identifier'] ?? '');
        $password = $_POST['password'] ?? '';
        
        $result = login($identifier, $password);
        
        if ($result['success']) {
            header('Location: index.php');
            exit;
        } else {
            $errors = $result['errors'];
            $activeTab = 'connexion';
        }
    }
}

// INSCRIPTION
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'register') {
    $activeTab = 'inscription';
    
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $errors[] = "Token de sécurité invalide";
    } else {
        $pseudo = cleanInput($_POST['pseudo'] ?? '');
        $email = cleanInput($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';
        
        if ($password !== $confirmPassword) {
            $errors[] = "Les mots de passe ne correspondent pas";
        } else {
            $result = register($pseudo, $email, $password);
            
            if ($result['success']) {
                $success = $result['message'];
                login($email, $password);
                header('Location: index.php');
                exit;
            } else {
                $errors = $result['errors'];
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="assets/css/inscription.min.css" />
    <link rel="stylesheet" href="assets/css/fontawesome-subset.css" />
    <title>Jeux de Lettres - Authentification</title>
  </head>
  <body>
    <div class="container">
      <div class="left-section">
        <div class="app-header">
          <div class="app-icon"><i class="fa-solid fa-gamepad"></i></div>
          <div class="app-title">
            <h1>Jeux de Lettres</h1>
            <p>Défiez votre vocabulaire</p>
          </div>
        </div>

        <div class="features">
          <div class="feature">
            <div class="feature-icon"><i class="fa-solid fa-gamepad"></i></div>
            <div class="feature-content">
              <h3>Deux jeux passionnants</h3>
              <p>Motus et Mots Mêlés avec plusieurs niveaux de difficulté</p>
            </div>
          </div>

          <div class="feature">
            <div class="feature-icon"><i class="fa-solid fa-user"></i></div>
            <div class="feature-content">
              <h3>Suivez votre progression</h3>
              <p>Statistiques détaillées et système de niveaux pour s'améliorer</p>
            </div>
          </div>

          <div class="feature">
            <div class="feature-icon"><i class="fa-solid fa-ranking-star"></i></div>
            <div class="feature-content">
              <h3>Classements compétitifs</h3>
              <p>Comparez vos scores avec d'autres joueurs</p>
            </div>
          </div>
        </div>
      </div>

      <div class="auth-section">
        <div class="auth-header">
          <h2>Commencer à jouer</h2>
          <p>Créez un compte ou connectez-vous pour sauvegarder votre progression</p>
        </div>

        <?php if (!empty($errors)): ?>
          <div class="alert alert-error">
            <strong><i class="fa-solid fa-circle-exclamation"></i> Erreur</strong>
            <ul>
              <?php foreach ($errors as $error): ?>
                <li><?= htmlspecialchars($error) ?></li>
              <?php endforeach; ?>
            </ul>
          </div>
        <?php endif; ?>

        <?php if ($success): ?>
          <div class="alert alert-success">
            <strong><i class="fa-solid fa-circle-check"></i> Succès</strong>
            <p><?= htmlspecialchars($success) ?></p>
          </div>
        <?php endif; ?>

        <div class="tab-buttons">
          <button class="tab-btn <?= $activeTab === 'connexion' ? 'active' : '' ?>" id="connexionTab" onclick="showConnexion()">
            <i class="fa-solid fa-arrow-right-to-bracket"></i> Connexion
          </button>
          <button class="tab-btn <?= $activeTab === 'inscription' ? 'active' : '' ?>" id="inscriptionTab" onclick="showInscription()">
            <i class="fa-solid fa-user-plus"></i> Inscription
          </button>
        </div>

        <!-- CONNEXION -->
        <form id="connexionForm" method="POST" class="<?= $activeTab === 'inscription' ? 'hidden' : '' ?>">
          <input type="hidden" name="action" value="login">
          <input type="hidden" name="csrf_token" value="<?= generateCSRFToken() ?>">
          
          <div class="form-group">
            <label><strong>Email ou Pseudo</strong></label>
            <input type="text" name="identifier" placeholder="votre@email.com ou pseudo" required />
          </div>

          <div class="form-group">
            <label><strong>Mot de passe</strong></label>
            <input type="password" name="password" placeholder="••••••••" required />
          </div>

          <button type="submit" class="submit-btn">Se connecter</button>
        </form>

        <!-- INSCRIPTION -->
        <form id="inscriptionForm" method="POST" class="<?= $activeTab === 'connexion' ? 'hidden' : '' ?>">
          <input type="hidden" name="action" value="register">
          <input type="hidden" name="csrf_token" value="<?= generateCSRFToken() ?>">
          
          <div class="form-group">
            <label><strong>Nom d'utilisateur</strong></label>
            <input type="text" name="pseudo" placeholder="JoueurPro" minlength="3" required />
            <div class="password-hint">Au moins 3 caractères</div>
          </div>

          <div class="form-group">
            <label><strong>Email</strong></label>
            <input type="email" name="email" placeholder="votre@email.com" required />
          </div>

          <div class="form-group">
            <label><strong>Mot de passe</strong></label>
            <input type="password" name="password" placeholder="••••••••" minlength="6" required />
            <div class="password-hint">Au moins 6 caractères</div>
          </div>

          <div class="form-group">
            <label><strong>Confirmer le mot de passe</strong></label>
            <input type="password" name="confirm_password" placeholder="••••••••" minlength="6" required />
          </div>

          <button type="submit" class="submit-btn">Créer un compte</button>
        </form>

        <div class="footer-text">
          En créant un compte, vos données seront stockées de manière sécurisée
        </div>
      </div>
    </div>

    <script>
      function showConnexion() {
        document.getElementById("connexionTab").classList.add("active");
        document.getElementById("inscriptionTab").classList.remove("active");
        document.getElementById("connexionForm").classList.remove("hidden");
        document.getElementById("inscriptionForm").classList.add("hidden");
      }

      function showInscription() {
        document.getElementById("inscriptionTab").classList.add("active");
        document.getElementById("connexionTab").classList.remove("active");
        document.getElementById("inscriptionForm").classList.remove("hidden");
        document.getElementById("connexionForm").classList.add("hidden");
      }
    </script>
  </body>
</html>