<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mon Profil - Letterix</title>
    <link rel="stylesheet" href="assets/css/fontawesome-subset.css" />
    <link rel="stylesheet" href="assets/css/profil.min.css" />
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
    
    // Récupérer les informations utilisateur
    $stmt = $pdo->prepare("SELECT pseudo, email, date_creation FROM utilisateurs WHERE id_user = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    $pseudo = $user['pseudo'] ?? '';
    $email = $user['email'] ?? '';
    $memberSince = isset($user['date_creation']) ? date('F Y', strtotime($user['date_creation'])) : '';

    // Récupérer le score total de l'utilisateur
    $stmtScore = $pdo->prepare("SELECT score_total FROM utilisateurs WHERE id_user = ?");
    $stmtScore->execute([$userId]);
    $scoreTotal = (int)($stmtScore->fetch(PDO::FETCH_ASSOC)['score_total'] ?? 0);

    // Récupérer les autres statistiques depuis la table parties
    $statsQuery = "
        SELECT 
            COUNT(DISTINCT CONCAT(id_jeu, '_', numero_niveau)) as niveaux_completes,
            COALESCE(SUM(temps_passe), 0) as temps_total,
            COALESCE(MIN(CASE WHEN temps_passe > 0 THEN temps_passe END), 0) as meilleur_temps,
            COUNT(*) as total_parties
        FROM parties
        WHERE id_user = ? AND score_obtenu > 0
    ";
    $stmt = $pdo->prepare($statsQuery);
    $stmt->execute([$userId]);
    $stats = $stmt->fetch();

    $niveauxCompletes = (int)($stats['niveaux_completes'] ?? 0);
    $tempsTotal = (int)($stats['temps_total'] ?? 0);
    $meilleurTemps = (int)($stats['meilleur_temps'] ?? 0);
    $totalParties = (int)($stats['total_parties'] ?? 0);

    // Formater le temps total (en heures et minutes)
    $heures = floor($tempsTotal / 3600);
    $minutes = floor(($tempsTotal % 3600) / 60);
    $tempsFormate = $heures . "h " . $minutes . "m";

    // Formater le meilleur temps (en minutes et secondes)
    if ($meilleurTemps > 0) {
        $minutesMeilleur = floor($meilleurTemps / 60);
        $secondesMeilleur = $meilleurTemps % 60;
        $meilleurTempsFormate = $minutesMeilleur . ":" . str_pad($secondesMeilleur, 2, '0', STR_PAD_LEFT);
    } else {
        $meilleurTempsFormate = '-';
    }

    // Récupérer les stats par difficulté (CORRIGÉ)
    $difficultyQuery = "
        SELECT 
            d.nom_difficulte,
            d.id_difficulte,
            COUNT(DISTINCT 
                CASE 
                    WHEN p.id_partie IS NOT NULL 
                    THEN CONCAT(p.id_niveau, '-', COALESCE(p.numero_niveau, 0))
                    ELSE NULL 
                END
            ) as niveaux_completes,
            COALESCE(SUM(p.score_obtenu), 0) as score_total
        FROM difficultes d
        LEFT JOIN parties p ON d.id_difficulte = p.id_niveau 
            AND p.id_user = ? 
            AND p.score_obtenu > 0
        GROUP BY d.id_difficulte, d.nom_difficulte
        ORDER BY d.id_difficulte ASC
    ";
    $stmt = $pdo->prepare($difficultyQuery);
    $stmt->execute([$userId]);
    $difficultyStats = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Organiser les stats par difficulté
    $statsDifficulte = [
        'facile' => ['niveaux' => 0, 'score' => 0],
        'moyen' => ['niveaux' => 0, 'score' => 0],
        'difficile' => ['niveaux' => 0, 'score' => 0]
    ];

    // Mapper les noms de difficulté de la BDD vers les clés utilisées (CORRIGÉ)
    foreach ($difficultyStats as $stat) {
        $nomDiff = strtolower(trim($stat['nom_difficulte']));
        
        $niveaux = (int)$stat['niveaux_completes'];
        $score = (int)$stat['score_total'];
        
        // Correspondance des noms possibles
        if (in_array($nomDiff, ['facile', 'easy', 'débutant', 'beginner'])) {
            $statsDifficulte['facile']['niveaux'] = $niveaux;
            $statsDifficulte['facile']['score'] = $score;
        } elseif (in_array($nomDiff, ['moyen', 'medium', 'intermédiaire', 'normal', 'intermediate'])) {
            $statsDifficulte['moyen']['niveaux'] = $niveaux;
            $statsDifficulte['moyen']['score'] = $score;
        } elseif (in_array($nomDiff, ['difficile', 'hard', 'expert', 'difficulty'])) {
            $statsDifficulte['difficile']['niveaux'] = $niveaux;
            $statsDifficulte['difficile']['score'] = $score;
        }
    }

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
            <span class="header-stat-value"><?php echo $niveauxCompletes; ?></span>
            <span class="header-stat-label">Niveau<?php echo $niveauxCompletes > 1 ? 's' : ''; ?> </span>
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
              <h3>Niveaux complétés</h3>
              <div class="stat-value"><?php echo $niveauxCompletes; ?></div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon yellow"><i class="fa-solid fa-star"></i></div>
            <div class="stat-info">
              <h3>Score total</h3>
              <div class="stat-value"><?php echo number_format($scoreTotal, 0, ',', ' '); ?></div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon purple">
              <i class="fa-solid fa-clock"></i>
            </div>
            <div class="stat-info">
              <h3>Temps de jeu</h3>
              <div class="stat-value"><?php echo $tempsFormate; ?></div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon green">
              <i class="fa-solid fa-trophy"></i>
            </div>
            <div class="stat-info">
              <h3>Meilleur temps</h3>
              <div class="stat-value"><?php echo $meilleurTempsFormate; ?></div>
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
                <div class="difficulty-stat-label">Niveaux</div>
                <div class="difficulty-stat-value"><?php echo $statsDifficulte['facile']['niveaux']; ?></div>
              </div>
              <div class="difficulty-stat">
                <div class="difficulty-stat-label">Score</div>
                <div class="difficulty-stat-value"><?php echo number_format($statsDifficulte['facile']['score'], 0, ',', ' '); ?></div>
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
                <div class="difficulty-stat-label">Niveaux</div>
                <div class="difficulty-stat-value"><?php echo $statsDifficulte['moyen']['niveaux']; ?></div>
              </div>
              <div class="difficulty-stat">
                <div class="difficulty-stat-label">Score</div>
                <div class="difficulty-stat-value"><?php echo number_format($statsDifficulte['moyen']['score'], 0, ',', ' '); ?></div>
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
                <div class="difficulty-stat-label">Niveaux</div>
                <div class="difficulty-stat-value"><?php echo $statsDifficulte['difficile']['niveaux']; ?></div>
              </div>
              <div class="difficulty-stat">
                <div class="difficulty-stat-label">Score</div>
                <div class="difficulty-stat-value"><?php echo number_format($statsDifficulte['difficile']['score'], 0, ',', ' '); ?></div>
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

    <form method="POST" action="php/update_profile.php" id="profileForm">
      <input type="hidden" name="csrf_token" value="<?php echo $csrf; ?>" />
      <div class="form-group">
        <label>Pseudo</label>
        <input type="text" name="pseudo" value="<?php echo htmlspecialchars($pseudo, ENT_QUOTES, 'UTF-8'); ?>" required />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input type="email" name="email" value="<?php echo htmlspecialchars($email, ENT_QUOTES, 'UTF-8'); ?>" required />
      </div>

      <button class="save-btn" type="button" onclick="showConfirmModal('profile')">
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

    <form method="POST" action="php/change_password.php" id="passwordForm">
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

      <button class="save-btn" type="button" onclick="showConfirmModal('password')">
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

    <form method="POST" action="php/logout.php" id="logoutForm">
      <input type="hidden" name="csrf_token" value="<?php echo $csrf; ?>" />
      <button class="save-btn" type="button" onclick="showConfirmModal('logout')" style="background: linear-gradient(135deg, #64748b 0%, #475569 100%);">
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
    <form method="POST" action="php/delete_account.php" id="deleteForm">
      <input type="hidden" name="csrf_token" value="<?php echo $csrf; ?>" />
      <button class="delete-btn" type="button" onclick="showConfirmModal('delete')">
        <i class="fas fa-trash-alt"></i> Supprimer mon compte
      </button>
    </form>
  </div>
</div>

<!-- MODAL DE CONFIRMATION -->
<div id="confirmModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <i id="modalIcon" class="fas fa-question-circle"></i>
      <h3 id="modalTitle">Confirmation</h3>
    </div>
    <div class="modal-body">
      <p id="modalMessage">Êtes-vous sûr de vouloir effectuer cette action ?</p>
      <!-- Champ mot de passe uniquement pour la suppression -->
      <div id="passwordFieldContainer" style="display: none; margin-top: 20px;">
        <label for="deleteConfirmPassword" style="display: block; margin-bottom: 8px; font-weight: 500;">Entrez votre mot de passe pour confirmer :</label>
        <input type="password" id="deleteConfirmPassword" placeholder="••••••••" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px;" />
        <div id="deleteErrorMessage" style="display: none; margin-top: 12px; padding: 12px; border-radius: 5px; font-size: 14px; background-color: #fee2e2; color: #dc2626; border-left: 4px solid #dc2626;"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="modal-btn cancel-btn" onclick="closeConfirmModal()">
        <i class="fas fa-times"></i> Annuler
      </button>
      <button class="modal-btn confirm-btn" id="confirmButton">
        <i class="fas fa-check"></i> Confirmer
      </button>
    </div>
  </div>
</div>

<style>
/* MODAL STYLES */
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  margin: 15% auto;
  padding: 0;
  border: 1px solid rgba(36, 47, 253, 0.62);
  border-radius: 16px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid rgba(36, 47, 253, 0.62);
}

.modal-header i {
  font-size: 48px;
  margin-bottom: 12px;
  display: block;
}

.modal-header h3 {
  margin: 0;
  font-size: 24px;
  color: #fff;
}

.modal-body {
  padding: 24px;
  text-align: center;
}

.modal-body p {
  margin: 0;
  color: #cbd5e1;
  font-size: 16px;
  line-height: 1.6;
}

.modal-footer {
  padding: 20px 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.modal-btn {
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cancel-btn {
  background: rgba(100, 116, 139, 0.2);
  color: #cbd5e1;
  border: 1px solid rgba(100, 116, 139, 0.3);
}

.cancel-btn:hover {
  background: rgba(100, 116, 139, 0.3);
  transform: translateY(-2px);
}

.confirm-btn {
  background: linear-gradient(135deg,#2563eb 0%,#3b82f6 100%);
  color: white;
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(22, 79, 249, 0.71);
}

.confirm-btn.danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.confirm-btn.danger:hover {
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
}

/* Icon colors */
.modal-header i.info { color: #3b82f6; }
.modal-header i.warning { color: #f59e0b; }
.modal-header i.danger { color: #ef4444; }
.modal-header i.success { color: #10b981; }
</style>

<script>
let currentFormId = '';

const confirmMessages = {
  profile: {
    title: 'Modifier le profil',
    message: 'Êtes-vous sûr de vouloir sauvegarder ces modifications à votre profil ?',
    icon: 'fa-user-edit',
    iconClass: 'info',
    buttonClass: ''
  },
  password: {
    title: 'Changer le mot de passe',
    message: 'Êtes-vous sûr de vouloir modifier votre mot de passe ?',
    icon: 'fa-key',
    iconClass: 'warning',
    buttonClass: ''
  },
  logout: {
    title: 'Se déconnecter',
    message: 'Êtes-vous sûr de vouloir vous déconnecter ? Vous serez redirigé vers la page de connexion.',
    icon: 'fa-sign-out-alt',
    iconClass: 'info',
    buttonClass: ''
  },
  delete: {
    title: 'Supprimer le compte',
    message: '⚠️ ATTENTION : Cette action est irréversible ! Toutes vos données seront définitivement supprimées. Êtes-vous absolument certain de vouloir supprimer votre compte ?',
    icon: 'fa-exclamation-triangle',
    iconClass: 'danger',
    buttonClass: 'danger'
  }
};

function showConfirmModal(formType) {
  const config = confirmMessages[formType];
  const modal = document.getElementById('confirmModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  const modalIcon = document.getElementById('modalIcon');
  const confirmButton = document.getElementById('confirmButton');
  const passwordFieldContainer = document.getElementById('passwordFieldContainer');
  const deleteConfirmPassword = document.getElementById('deleteConfirmPassword');
  
  // Configuration du modal
  modalTitle.textContent = config.title;
  modalMessage.textContent = config.message;
  modalIcon.className = `fas ${config.icon} ${config.iconClass}`;
  
  // Configuration du bouton de confirmation
  confirmButton.className = `modal-btn confirm-btn ${config.buttonClass}`;
  
  // Afficher le champ mot de passe seulement pour la suppression
  if (formType === 'delete') {
    passwordFieldContainer.style.display = 'block';
    deleteConfirmPassword.value = '';
    deleteConfirmPassword.focus();
    confirmButton.onclick = () => deleteAccountWithPassword();
  } else {
    passwordFieldContainer.style.display = 'none';
    confirmButton.onclick = () => confirmAction(formType);
  }
  
  // Stockage du form ID
  currentFormId = formType + 'Form';
  
  // Affichage du modal
  modal.style.display = 'block';
}

function deleteAccountWithPassword() {
  const password = document.getElementById('deleteConfirmPassword').value;
  const errorMessageDiv = document.getElementById('deleteErrorMessage');
  
  // Réinitialiser le message d'erreur
  errorMessageDiv.style.display = 'none';
  errorMessageDiv.textContent = '';
  
  if (!password) {
    errorMessageDiv.textContent = '⚠️ Veuillez entrer votre mot de passe';
    errorMessageDiv.style.display = 'block';
    return;
  }
  
  // Envoyer la requête avec le mot de passe
  const csrfToken = document.querySelector('input[name="csrf_token"]').value;
  
  fetch('php/delete_account_with_password.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'csrf_token=' + encodeURIComponent(csrfToken) + '&password=' + encodeURIComponent(password)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Fermer le modal et afficher le message de succès
      closeConfirmModal();
      alert('Votre compte a été supprimé avec succès. Vous serez redirigé vers la page de connexion.');
      setTimeout(() => {
        window.location.href = 'inscription.php';
      }, 1000);
    } else {
      // Afficher le message d'erreur stylé
      errorMessageDiv.textContent = '❌ ' + (data.message || 'Le mot de passe est incorrect.');
      errorMessageDiv.style.display = 'block';
      document.getElementById('deleteConfirmPassword').value = '';
    }
  })
  .catch(error => {
    console.error('Erreur:', error);
    errorMessageDiv.textContent = '❌ Une erreur est survenue . Actualisez la page pour etre redirigé .';
    errorMessageDiv.style.display = 'block';
  });
}

function closeConfirmModal() {
  const modal = document.getElementById('confirmModal');
  modal.style.display = 'none';
  currentFormId = '';
}

function confirmAction(formType) {
  const form = document.getElementById(currentFormId);
  if (form) {
    form.submit();
  }
  closeConfirmModal();
}

// Fermeture du modal en cliquant à l'extérieur
window.onclick = function(event) {
  const modal = document.getElementById('confirmModal');
  if (event.target === modal) {
    closeConfirmModal();
  }
}

// Fermeture avec la touche Echap
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeConfirmModal();
  }
});
</script>
    <script src="assets/js/profil.min.js" ></script>
   <div id="footer-placeholder"></div>
  </body>
  
</html>
