// admin.js - Version connectée au backend PHP

let userToDelete = null;
let pendingRoleChange = {
    userId: null,
    newRole: '',
    selectElement: null
};

// Charger les données au démarrage
document.addEventListener('DOMContentLoaded', function() {
    loadStats();
    loadUsers();
    
    // Modal de suppression
    document.getElementById('deleteModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Modal de changement de rôle
    document.getElementById('roleModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeRoleModal();
        }
    });
});

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Recharger les données si nécessaire
    if (sectionId === 'users') {
        loadUsers();
    } else if (sectionId === 'scores') {
        loadScores();
    }
}

function filterTable(tableId, searchValue) {
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const filter = searchValue.toLowerCase();

    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
    }
}

// === CHARGEMENT DES STATISTIQUES ===
function loadStats() {
    fetch('api/get-stats.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const stats = data.stats;
                document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = 
                    formatNumber(stats.total_users);
                document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = 
                    formatNumber(stats.total_parties);
                document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = 
                    formatNumber(stats.total_score);
                document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = 
                    stats.croissance;
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement des stats:', error);
        });
}

// === CHARGEMENT DES UTILISATEURS ===
function loadUsers() {
    fetch('api/get-all-users.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateUsersTable(data.users);
                updateScoresTable(data.users);
            } else {
                alert(data.error || 'Erreur lors du chargement des utilisateurs');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur de connexion au serveur');
        });
}

// === METTRE À JOUR LE TABLEAU DES UTILISATEURS ===
function updateUsersTable(users) {
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const initiales = user.pseudo.substring(0, 2).toUpperCase();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="user-info">
                    <div class="user-avatar">${initiales}</div>
                    <span>${user.pseudo}</span>
                </div>
            </td>
            <td>${user.email}</td>
            <td>${user.date_creation}</td>
            <td>
                <select class="role-select" onchange="changeRole(${user.id}, this.value, this)" data-current="${user.role}">
                    <option value="joueur" ${user.role === 'joueur' ? 'selected' : ''}>👤 Joueur</option>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>👑 Admin</option>
                </select>
            </td>
            <td><span class="status-badge">${user.statut}</span></td>
            <td><button class="action-btn delete-btn" onclick="deleteUser(${user.id}, '${user.pseudo}')">Supprimer</button></td>
        `;
        tbody.appendChild(row);
    });
}

// === METTRE À JOUR LE TABLEAU DES SCORES ===
function updateScoresTable(users) {
    const tbody = document.querySelector('#scoresTable tbody');
    tbody.innerHTML = '';
    
    // Trier par score total
    const sortedUsers = [...users].sort((a, b) => b.score_total - a.score_total);
    
    sortedUsers.forEach((user, index) => {
        const initiales = user.pseudo.substring(0, 2).toUpperCase();
        let rangIcon = '';
        
        if (index === 0) rangIcon = '🥇';
        else if (index === 1) rangIcon = '🥈';
        else if (index === 2) rangIcon = '🥉';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${rangIcon} ${index + 1}</strong></td>
            <td>
                <div class="user-info">
                    <div class="user-avatar">${initiales}</div>
                    <span>${user.pseudo}</span>
                </div>
            </td>
            <td><span class="score-badge">${formatNumber(user.score_total)}</span></td>
            <td>${user.parties_jouees}</td>
            <td>${user.meilleur_score}</td>
            <td><button class="action-btn delete-btn" onclick="deleteUser(${user.id}, '${user.pseudo}')">Supprimer</button></td>
        `;
        tbody.appendChild(row);
    });
}

function loadScores() {
    loadUsers(); // Utilise la même fonction car les scores sont inclus
}

// === CHANGER LE RÔLE ===
function changeRole(userId, newRole, selectElement) {
    const currentRole = selectElement.dataset.current;
    
    // Si le rôle n'a pas changé, ne rien faire
    if (newRole === currentRole) {
        return;
    }
    
    // Stocker les informations pour la confirmation
    pendingRoleChange.userId = userId;
    pendingRoleChange.newRole = newRole;
    pendingRoleChange.selectElement = selectElement;
    
    // Afficher le nom du rôle dans le modal
    const roleDisplayName = newRole === 'admin' ? '👑 Administrateur' : '👤 Joueur';
    const pseudo = selectElement.closest('tr').querySelector('.user-info span').textContent;
    
    document.getElementById('roleUserName').textContent = pseudo;
    document.getElementById('newRoleName').textContent = roleDisplayName;
    
    // Ouvrir le modal de confirmation
    document.getElementById('roleModal').classList.add('active');
}

function closeRoleModal() {
    // Réinitialiser le select à sa valeur précédente
    if (pendingRoleChange.selectElement) {
        const currentRole = pendingRoleChange.selectElement.dataset.current;
        pendingRoleChange.selectElement.value = currentRole;
    }
    
    // Fermer le modal
    document.getElementById('roleModal').classList.remove('active');
    
    // Réinitialiser les données
    pendingRoleChange = {
        userId: null,
        newRole: '',
        selectElement: null
    };
}

function confirmRoleChange() {
    fetch('api/change-role.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            userId: pendingRoleChange.userId,
            newRole: pendingRoleChange.newRole
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            // Mettre à jour le dataset
            if (pendingRoleChange.selectElement) {
                pendingRoleChange.selectElement.dataset.current = pendingRoleChange.newRole;
            }
            loadUsers(); // Recharger les utilisateurs
        } else {
            alert(data.error || 'Erreur lors du changement de rôle');
            // Réinitialiser le select en cas d'erreur
            if (pendingRoleChange.selectElement) {
                const currentRole = pendingRoleChange.selectElement.dataset.current;
                pendingRoleChange.selectElement.value = currentRole;
            }
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur');
    })
    .finally(() => {
        closeRoleModal();
    });
}

// === SUPPRIMER UN UTILISATEUR ===
function deleteUser(userId, pseudo) {
    userToDelete = { id: userId, pseudo: pseudo };
    document.getElementById('userName').textContent = pseudo;
    document.getElementById('deleteModal').classList.add('active');
}

function closeModal() {
    document.getElementById('deleteModal').classList.remove('active');
    userToDelete = null;
}

function confirmDelete() {
    if (!userToDelete) return;
    
    fetch('api/delete-user.php', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userToDelete.id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            loadUsers(); // Recharger les utilisateurs
            loadStats(); // Recharger les stats
        } else {
            alert(data.error || 'Erreur lors de la suppression');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur');
    })
    .finally(() => {
        closeModal();
    });
}

// === UTILITAIRES ===
function formatNumber(num) {
    return new Intl.NumberFormat('fr-FR').format(num);
}