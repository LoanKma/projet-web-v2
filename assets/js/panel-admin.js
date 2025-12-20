// admin.js

let userToDelete = '';
let pendingRoleChange = {
    userName: '',
    newRole: '',
    selectElement: null
};

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

function deleteUser(userName) {
    userToDelete = userName;
    document.getElementById('userName').textContent = userName;
    document.getElementById('deleteModal').classList.add('active');
}

function closeModal() {
    document.getElementById('deleteModal').classList.remove('active');
    userToDelete = '';
}

function confirmDelete() {
    // Ici vous ajouterez la logique backend pour supprimer l'utilisateur
    console.log('Suppression de l\'utilisateur:', userToDelete);

    // Fermer le modal
    closeModal();
    
    // Animation de suppression (à remplacer par un vrai appel API)
    alert(`Le compte de ${userToDelete} a été supprimé avec succès.`);
    
    // Rafraîchir la table (à remplacer par un vrai rechargement des données)
    location.reload();
}

function changeRole(userName, newRole) {
    // Stocker les informations pour la confirmation
    pendingRoleChange.userName = userName;
    pendingRoleChange.newRole = newRole;
    pendingRoleChange.selectElement = event.target;
    
    // Afficher le nom du rôle dans le modal
    const roleDisplayName = newRole === 'admin' ? '👑 Administrateur' : '👤 Joueur';
    document.getElementById('roleUserName').textContent = userName;
    document.getElementById('newRoleName').textContent = roleDisplayName;
    
    // Ouvrir le modal de confirmation
    document.getElementById('roleModal').classList.add('active');
}

function closeRoleModal() {
    // Réinitialiser le select à sa valeur précédente
    if (pendingRoleChange.selectElement) {
        const currentValue = pendingRoleChange.selectElement.value;
        const previousValue = currentValue === 'admin' ? 'joueur' : 'admin';
        pendingRoleChange.selectElement.value = previousValue;
    }
    
    // Fermer le modal
    document.getElementById('roleModal').classList.remove('active');
    
    // Réinitialiser les données
    pendingRoleChange = {
        userName: '',
        newRole: '',
        selectElement: null
    };
}

function confirmRoleChange() {
    console.log(`Changement de rôle pour ${pendingRoleChange.userName} vers ${pendingRoleChange.newRole}`);
    

    // Message de confirmation (à remplacer par un vrai appel API)
    const roleDisplayName = pendingRoleChange.newRole === 'admin' ? 'Administrateur' : 'Joueur';
    alert(`Le rôle de ${pendingRoleChange.userName} a été changé en ${roleDisplayName} avec succès !`);
    
    // Fermer le modal
    document.getElementById('roleModal').classList.remove('active');
    
    // Réinitialiser les données
    pendingRoleChange = {
        userName: '',
        newRole: '',
        selectElement: null
    };
}

// Fermer les modals en cliquant en dehors
document.addEventListener('DOMContentLoaded', function() {
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

// Fonction pour charger les utilisateurs depuis l'API (à implémenter)
function loadUsers() {

}

// Fonction pour charger les scores depuis l'API (à implémenter)
function loadScores() {
}