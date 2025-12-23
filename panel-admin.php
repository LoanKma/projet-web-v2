<?php
require_once 'php/auth.php';

// Protéger la page - Seuls les admins peuvent accéder
requireAdmin();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Letterix - Panel Admin</title>
    <link rel="stylesheet" href="assets/css/panel-admin.css">
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />
</head>
<body>
    <!--header placeholder-->
    <div id="header-placeholder"></div>

    <div class="header">
        <div class="logo">
            <h1>Administration</h1>
        </div>
    </div>

    <div class="container">
        <div class="admin-nav">
            <button class="nav-btn active" onclick="showSection('dashboard')"><i class="fa-solid fa-chart-simple"></i> Tableau de bord</button>
            <button class="nav-btn" onclick="showSection('users')"><i class="fa-solid fa-users"></i> Gestion Utilisateurs</button>
            <button class="nav-btn" onclick="showSection('scores')"><i class="fa-solid fa-trophy"></i> Scores</button>
        </div>

        <!-- Dashboard Section -->
        <div id="dashboard" class="content-section active">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fa-solid fa-users"></i></div>
                    <div class="stat-value">0</div>
                    <div class="stat-label">Utilisateurs Total</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fa-solid fa-gamepad"></i></div>
                    <div class="stat-value">0</div>
                    <div class="stat-label">Parties Jouées</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fa-solid fa-star"></i></div>
                    <div class="stat-value">0</div>
                    <div class="stat-label">Points Total</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fa-solid fa-chart-line"></i></div>
                    <div class="stat-value">+0%</div>
                    <div class="stat-label">Croissance ce mois</div>
                </div>
            </div>
        </div>

        <!-- Users Section -->
        <div id="users" class="content-section">
            <div class="table-container">
                <div class="table-header">
                    <h2><i class="fa-solid fa-users"></i> Gestion des Utilisateurs</h2>
                    <input type="text" class="search-box" placeholder="Rechercher un utilisateur..." oninput="filterTable('usersTable', this.value)">
                </div>
                <table id="usersTable">
                    <thead>
                        <tr>
                            <th>Utilisateur</th>
                            <th>Email</th>
                            <th>Date d'inscription</th>
                            <th>Rôle</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Les utilisateurs seront chargés dynamiquement par JavaScript -->
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 40px; color: #8b9dc3;">
                                Chargement des utilisateurs...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Scores Section -->
        <div id="scores" class="content-section">
            <div class="table-container">
                <div class="table-header">
                    <h2><i class="fa-solid fa-trophy"></i> Classement des Joueurs</h2>
                    <input type="text" class="search-box" placeholder=" Rechercher un joueur..." oninput="filterTable('scoresTable', this.value)">
                </div>
                <table id="scoresTable">
                    <thead>
                        <tr>
                            <th>Rang</th>
                            <th>Joueur</th>
                            <th>Score Total</th>
                            <th>Parties Jouées</th>
                            <th>Meilleur Score</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Les scores seront chargés dynamiquement par JavaScript -->
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 40px; color: #8b9dc3;">
                                Chargement des scores...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div id="deleteModal" class="modal">
        <div class="modal-content">
            <h2 class="modal-header"><i class="fa-solid fa-triangle-exclamation"></i> Confirmer la suppression</h2>
            <p class="modal-text">Êtes-vous sûr de vouloir supprimer le compte de <strong id="userName"></strong> ? Cette action est irréversible.</p>
            <div class="modal-actions">
                <button class="btn-cancel" onclick="closeModal()">Annuler</button>
                <button class="btn-confirm" onclick="confirmDelete()">Supprimer</button>
            </div>
        </div>
    </div>

    <!-- Role Change Confirmation Modal -->
    <div id="roleModal" class="modal">
        <div class="modal-content">
            <h2 class="modal-header"><i class="fa-solid fa-rotate"></i> Changer le rôle</h2>
            <p class="modal-text">Voulez-vous changer le rôle de <strong id="roleUserName"></strong> en <strong id="newRoleName"></strong> ?</p>
            <div class="modal-actions">
                <button class="btn-cancel" onclick="closeRoleModal()">Annuler</button>
                <button class="btn-confirm btn-role-confirm" onclick="confirmRoleChange()">Confirmer</button>
            </div>
        </div>
    </div>
<!--footer pl=aceholder-->
<div id="footer-placeholder"></div>
    <script src="assets/js/panel-admin.js"></script>
    <script>
           // header load
      fetch("header.php")
        .then((response) => response.text())
        .then((data) => {
          document.getElementById("header-placeholder").innerHTML = data;
        });
      // footer load
      fetch("footer.html")
        .then((response) => response.text())
        .then((data) => {
          document.getElementById("footer-placeholder").innerHTML = data;
        });
    </script>
</body>
</html>