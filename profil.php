<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mon Profil - Letterix</title>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
    <link rel="stylesheet" href="assets/css/profil.css" />
  </head>
  <body>
    <?php
    require_once 'php/auth.php';
    require_once 'php/db.php';

    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    requireLogin();

    $userId = $_SESSION['user_id'];
    $stmt = $pdo->prepare("SELECT pseudo, email, date_creation FROM utilisateurs WHERE id_user = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    $pseudo = $user['pseudo'] ?? '';
    $email = $user['email'] ?? '';
    $memberSince = isset($user['date_creation']) ? date('F Y', strtotime($user['date_creation'])) : '';

    $csrf = generateCSRFToken();
    ?>

    <?php include __DIR__ . '/header.php'; ?>
    <!-- HEADER -->
    <div class="user-header">
      <div class="header-content">
        <div class="user-avatare"><i class="fa-solid fa-user"></i></div>
        <div class="header-info">
          <h1><?php echo htmlspecialchars($pseudo, ENT_QUOTES, 'UTF-8'); ?></h1>
          <p>Membre depuis <?php echo htmlspecialchars($memberSince ?: 'inconnu', ENT_QUOTES, 'UTF-8'); ?></p>
        </div>
        <div class="header-stats">
          <div class="header-stat">
            <span class="header-stat-value">999</span>
            <span class="header-stat-label">Niveau </span>
          </div>
          <div class="header-stat"></div>
        </div>
      </div>
    </div>

    <!-- TABS -->
    <div class="tabs">
      <div class="tabs-container">
        <button class="tab active" onclick="switchTab('dashboard')">
          <i class="fas fa-chart-line"></i> Dashboard
        </button>

        <button class="tab" onclick="switchTab('settings')">
          <i class="fas fa-cog"></i> Paramètres
        </button>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="content">
      <!-- DASHBOARD TAB -->
      <div id="dashboard" class="tab-content active">
        <!-- STATS CARDS -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon blue">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <div class="stat-info">
              <h3>Niveaux complétées</h3>
              <div class="stat-value">999</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon yellow"><i class="fa-solid fa-star"></i></div>
            <div class="stat-info">
              <h3>Étoiles totales</h3>
              <div class="stat-value">67</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon purple">
              <i class="fa-solid fa-clock"></i>
            </div>
            <div class="stat-info">
              <h3>Temps de jeu</h3>
              <div class="stat-value">2h 34m</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon green">
              <i class="fa-solid fa-trophy"></i>
            </div>
            <div class="stat-info">
              <h3>Meilleur temps</h3>
              <div class="stat-value">4:23</div>
            </div>
          </div>
        </div>

        <!-- DIFFICULTY BREAKDOWN -->
        <div class="difficulty-grid">
          <div class="difficulty-card">
            <div class="difficulty-header">
              <span class="difficulty-icon"
                ><i class="fa-solid fa-star" style="color: #22c55e"></i
              ></span>
              <h3 class="difficulty-name green">Facile</h3>
            </div>
            <div class="difficulty-stats">
              <div class="difficulty-stat">
                <div class="difficulty-stat-label">Parties</div>
                <div class="difficulty-stat-value">12</div>
              </div>
              <div class="difficulty-stat">
                <div class="difficulty-stat-label">Étoiles</div>
                <div class="difficulty-stat-value">34</div>
              </div>
            </div>
          </div>

          <div class="difficulty-card">
            <div class="difficulty-header">
              <span class="difficulty-icon"
                ><i class="fa-solid fa-bolt" style="color: #eab308"></i
              ></span>
              <h3 class="difficulty-name yellow">Moyen</h3>
            </div>
            <div class="difficulty-stats">
              <div class="difficulty-stat">
                <div class="difficulty-stat-label">Parties</div>
                <div class="difficulty-stat-value">8</div>
              </div>
              <div class="difficulty-stat">
                <div class="difficulty-stat-label">Étoiles</div>
                <div class="difficulty-stat-value">22</div>
              </div>
            </div>
          </div>

          <div class="difficulty-card">
            <div class="difficulty-header">
              <span class="difficulty-icon"
                ><i class="fa-solid fa-trophy" style="color: #ef4444"></i
              ></span>
              <h3 class="difficulty-name red">Difficile</h3>
            </div>
            <div class="difficulty-stats">
              <div class="difficulty-stat">
                <div class="difficulty-stat-label">Parties</div>
                <div class="difficulty-stat-value">4</div>
              </div>
              <div class="difficulty-stat">
                <div class="difficulty-stat-label">Étoiles</div>
                <div class="difficulty-stat-value">11</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SETTINGS TAB -->
      <div id="settings" class="tab-content">
        <!-- ACCOUNT INFORMATION -->
        <div class="settings-section">
          <h2><i class="fas fa-user"></i> Informations du compte</h2>
          <p class="settings-subtitle">
            Modifiez vos informations personnelles
          </p>

          <form method="POST" action="php/update_profile.php">
            <input type="hidden" name="csrf_token" value="<?php echo $csrf; ?>" />
            <div class="form-group">
              <label>Pseudo</label>
              <input type="text" name="pseudo" value="<?php echo htmlspecialchars($pseudo, ENT_QUOTES, 'UTF-8'); ?>" required />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input type="email" name="email" value="<?php echo htmlspecialchars($email, ENT_QUOTES, 'UTF-8'); ?>" required />
            </div>

            <button class="save-btn" type="submit">
              <i class="fas fa-save"></i> Sauvegarder les modifications
            </button>
          </form>
        </div>

        <!-- CHANGE PASSWORD -->
        <div class="settings-section">
          <h2><i class="fas fa-lock"></i> Changer de mot de passe</h2>
          <p class="settings-subtitle">
            Assurez-vous d'utiliser un mot de passe fort
          </p>

          <form method="POST" action="php/change_password.php">
            <input type="hidden" name="csrf_token" value="<?php echo $csrf; ?>" />
            <div class="form-group">
              <label>Mot de passe actuel</label>
              <input type="password" name="current_password" placeholder="••••••••" required />
            </div>

            <div class="form-group">
              <label>Nouveau mot de passe</label>
              <input type="password" name="new_password" placeholder="••••••••" required />
            </div>

            <div class="form-group">
              <label>Confirmer le nouveau mot de passe</label>
              <input type="password" name="confirm_password" placeholder="••••••••" required />
            </div>

            <button class="save-btn" type="submit">
              <i class="fas fa-key"></i> Modifier le mot de passe
            </button>
          </form>
        </div>
        
        <!-- LOGOUT SECTION -->
        <div class="settings-section">
          <h2><i class="fas fa-sign-out-alt"></i> Déconnexion</h2>
          <p class="settings-subtitle">
            Vous serez redirigé vers la page de connexion
          </p>

          <form method="POST" action="php/logout.php">
            <input type="hidden" name="csrf_token" value="<?php echo $csrf; ?>" />
            <button class="save-btn" type="submit" style="background: linear-gradient(135deg, #64748b 0%, #475569 100%);">
              <i class="fas fa-sign-out-alt"></i> Se déconnecter
            </button>
          </form>
        </div>

        <!-- DANGER ZONE -->
        <div class="danger-zone">
          <h2><i class="fas fa-exclamation-triangle"></i> Zone dangereuse</h2>
          <p>
            Cette action est irréversible. Toutes vos données seront
            définitivement supprimées.
          </p>
          <form method="POST" action="php/delete_account.php">
            <input type="hidden" name="csrf_token" value="<?php echo $csrf; ?>" />
            <button class="delete-btn" type="submit">
              <i class="fas fa-trash-alt"></i> Supprimer mon compte
            </button>
          </form>
        </div>
      </div>
    </div>
    <script src="assets/js/profil.js"></script>
  </body>
  <div id="footer-placeholder"></div>
</html>
