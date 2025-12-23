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
</head>
<body>
    <div class="header">
        <div class="logo">
            <div class="logo-icon">🎮</div>
            <h1>Letterix</h1>
        </div>
        <p class="subtitle">Panel Administration</p>
        <div class="admin-info">
            Connecté en tant que: <strong><?= htmlspecialchars($_SESSION['pseudo']) ?></strong>
            <a href="php/logout.php" class="logout-btn">Déconnexion</a>
        </div>
    </div>

    <div class="container">
        <div class="admin-nav">
            <button class="nav-btn active" onclick="showSection('dashboard')">📊 Tableau de bord</button>
            <button class="nav-btn" onclick="showSection('users')">👥 Gestion Utilisateurs</button>
            <button class="nav-btn" onclick="showSection('scores')">🏆 Scores</button>
        </div>

        <!-- Dashboard Section -->
        <div id="dashboard" class="content-section active">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-value">0</div>
                    <div class="stat-label">Utilisateurs Total</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🎮</div>
                    <div class="stat-value">0</div>
                    <div class="stat-label">Parties Jouées</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-value">0</div>
                    <div class="stat-label">Points Total</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📈</div>
                    <div class="stat-value">+0%</div>
                    <div class="stat-label">Croissance ce mois</div>
                </div>
            </div>
        </div>

        <!-- Users Section -->
        <div id="users" class="content-section">
            <div class="table-container">
                <div class="table-header">
                    <h2>👥 Gestion des Utilisateurs</h2>
                    <input type="text" class="search-box" placeholder="🔍 Rechercher un utilisateur..." oninput="filterTable('usersTable', this.value)">
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
                    <h2>🏆 Classement des Joueurs</h2>
                    <input type="text" class="search-box" placeholder="🔍 Rechercher un joueur..." oninput="filterTable('scoresTable', this.value)">
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
            <h2 class="modal-header">⚠️ Confirmer la suppression</h2>
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
            <h2 class="modal-header">🔄 Changer le rôle</h2>
            <p class="modal-text">Voulez-vous changer le rôle de <strong id="roleUserName"></strong> en <strong id="newRoleName"></strong> ?</p>
            <div class="modal-actions">
                <button class="btn-cancel" onclick="closeRoleModal()">Annuler</button>
                <button class="btn-confirm btn-role-confirm" onclick="confirmRoleChange()">Confirmer</button>
            </div>
        </div>
    </div>

    <script src="assets/js/panel-admin.js"></script>
</body>
</html>