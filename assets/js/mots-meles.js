// Gestion du filtre de difficulté
function filterLevels(difficulty) {
    // Retirer la classe active de tous les badges
    const badges = document.querySelectorAll('.difficulty-badge');
    badges.forEach(badge => badge.classList.remove('active'));
    
    // Ajouter la classe active au badge cliqué
    const activeBadge = document.querySelector(`.difficulty-badge[data-difficulty="${difficulty}"]`);
    if (activeBadge) {
        activeBadge.classList.add('active');
    }
    
    // Masquer toutes les cartes de niveau
    const levelCards = document.querySelectorAll('.level-card');
    levelCards.forEach(card => {
        card.style.display = 'none';
    });
    
    // Afficher uniquement les cartes correspondant à la difficulté sélectionnée
    const selectedCards = document.querySelectorAll(`.level-card[data-difficulty="${difficulty}"]`);
    selectedCards.forEach(card => {
        card.style.display = 'block';
    });
}

// Fonction pour jouer à un niveau
function playLevel(levelId, difficulty) {
    // Vérifier si le niveau est verrouillé
    const levelCard = document.querySelector(`.level-card[data-level-id="${levelId}"]`);
    if (levelCard && levelCard.classList.contains('locked')) {
        alert('Ce niveau est verrouillé. Complétez les niveaux précédents pour le débloquer.');
        return;
    }
    
    // Stockage du niveau sélectionné
    localStorage.setItem('currentWordSearchLevel', JSON.stringify({
        levelId: levelId,
        difficulty: difficulty
    }));
    
    // Redirection vers la page de jeu
    window.location.href = 'jeu-mots-meles.html';
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Par défaut, afficher les niveaux faciles
    filterLevels('easy');
});