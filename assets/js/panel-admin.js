// admin.js

let userToDelete = '';

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

// Fermer le modal en cliquant en dehors
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('deleteModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
});

// Fonction pour charger les utilisateurs depuis l'API (à implémenter)
function loadUsers() {

}

// Fonction pour charger les scores depuis l'API (à implémenter)
function loadScores() {

}

// Fonction pour charger les statistiques depuis l'API (à implémenter)
function loadStats() {

}