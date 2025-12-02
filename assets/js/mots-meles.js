// Charger le header et footer
fetch("header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header-placeholder").innerHTML = data;
  });

fetch("footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer-placeholder").innerHTML = data;
  });

// --- CONFIGURATION DES NIVEAUX ---
const LEVELS = {
  // Facile (1-6)
  1: { gridSize: 8, words: ["CHAT", "CHIEN", "LION", "OURS"], difficulty: "easy", theme: "Animaux domestiques" },
  2: { gridSize: 8, words: ["ROSE", "LYS", "IRIS", "TULIPE"], difficulty: "easy", theme: "Fleurs" },
  3: { gridSize: 8, words: ["ROUGE", "BLEU", "VERT", "JAUNE"], difficulty: "easy", theme: "Couleurs" },
  4: { gridSize: 8, words: ["PAIN", "LAIT", "CAFE", "THE"], difficulty: "easy", theme: "Petit déjeuner" },
  5: { gridSize: 8, words: ["SOLEIL", "LUNE", "ETOILE", "NUAGE"], difficulty: "easy", theme: "Dans le ciel" },
  6: { gridSize: 8, words: ["POMME", "POIRE", "BANANE", "ORANGE"], difficulty: "easy", theme: "Fruits" },

  // Moyen (7-12)
  7: { gridSize: 10, words: ["TIGRE", "ZEBRE", "GIRAFE", "ELEPHANT", "SINGE"], difficulty: "medium", theme: "Animaux sauvages" },
  8: { gridSize: 10, words: ["PARIS", "LYON", "MARSEILLE", "TOULOUSE", "NANTES"], difficulty: "medium", theme: "Villes de France" },
  9: { gridSize: 10, words: ["GUITARE", "PIANO", "VIOLON", "FLUTE", "BATTERIE"], difficulty: "medium", theme: "Instruments" },
  10: { gridSize: 10, words: ["FOOTBALL", "TENNIS", "BASKET", "RUGBY", "NATATION"], difficulty: "medium", theme: "Sports" },
  11: { gridSize: 10, words: ["PRINTEMPS", "ETE", "AUTOMNE", "HIVER", "SAISON"], difficulty: "medium", theme: "Les saisons" },
  12: { gridSize: 10, words: ["ORDINATEUR", "TABLETTE", "TELEPHONE", "SOURIS", "CLAVIER"], difficulty: "medium", theme: "Informatique" },

  // Difficile (13-18)
  13: { gridSize: 12, words: ["RHINOCEROS", "HIPPOPOTAME", "CROCODILE", "KANGOUROU", "PANTHERE", "CHAMEAU"], difficulty: "hard", theme: "Animaux exotiques" },
  14: { gridSize: 12, words: ["ASTRONOMIE", "BIOLOGIE", "CHIMIE", "PHYSIQUE", "GEOGRAPHIE", "MATHEMATIQUE"], difficulty: "hard", theme: "Sciences" },
  15: { gridSize: 12, words: ["ARCHITECTURE", "SCULPTURE", "PEINTURE", "PHOTOGRAPHIE", "LITTERATURE", "MUSIQUE"], difficulty: "hard", theme: "Arts" },
  16: { gridSize: 12, words: ["RENAISSANCE", "REVOLUTION", "MOYENAGE", "ANTIQUITE", "PREHISTOIRE", "MODERNE"], difficulty: "hard", theme: "Histoire" },
  17: { gridSize: 12, words: ["DEMOCRATIE", "REPUBLIQUE", "MONARCHIE", "PARLEMENT", "GOUVERNEMENT", "CONSTITUTION"], difficulty: "hard", theme: "Politique" },
  18: { gridSize: 12, words: ["PHILOSOPHIE", "PSYCHOLOGIE", "AUTORITARISME", "ANTHROPOLOGIE", "HEGEMONIE", "PEDAGOGIE"], difficulty: "hard", theme: "Sciences humaines" },
};

let currentFilter = "easy";

// --- INITIALISATION ---
document.addEventListener("DOMContentLoaded", () => {
  generateAllLevels();
  updateGlobalStats();
  
  // Par défaut, afficher les niveaux faciles
  filterLevels('easy');
});

// --- GÉNÉRATION DE L'INTERFACE ---

// 1. Générer toutes les cartes de niveaux
function generateAllLevels() {
  const grid = document.getElementById("levelsGrid");
  // Attention : Motus utilise "motusProgress", Mots Mêlés utilise "gameProgress"
  const progress = JSON.parse(localStorage.getItem("gameProgress") || "{}");
  
  grid.innerHTML = ""; // Vider la grille

  Object.keys(LEVELS).forEach((key) => {
    const levelId = parseInt(key);
    const level = LEVELS[levelId];
    const card = createLevelCard(levelId, level, progress);
    grid.appendChild(card);
  });
}

// 2. Créer une carte individuelle
function createLevelCard(levelId, level, progress) {
  const card = document.createElement("div");
  card.className = "level-card";
  // Important pour le filtrage :
  card.setAttribute("data-difficulty", level.difficulty);
  card.setAttribute("data-level-id", levelId);

  // Logique de verrouillage : Niveau 1 débloqué, ou si le précédent est fini
  const isUnlocked = levelId === 1 || progress[levelId - 1]?.completed || false;
  const isCompleted = progress[levelId]?.completed || false;

  if (!isUnlocked) {
    card.classList.add("locked");
  }

  // Calcul du numéro relatif (1, 2, 3... au lieu de 13, 14, 15)
  const displayNum = levelId <= 6 ? levelId : levelId <= 12 ? levelId - 6 : levelId - 12;

  // Icônes selon difficulté
  let iconClass = "fa-smile";
  if (level.difficulty === "medium") iconClass = "fa-star";
  if (level.difficulty === "hard") iconClass = "fa-fire";

  // Score et Temps
  let scoreHTML = "";
  if (isCompleted && progress[levelId].bestTime) {
      const t = progress[levelId].bestTime;
      const min = Math.floor(t / 60);
      const sec = t % 60;
      // On peut ajouter un badge ici si vous avez stocké le score
      scoreHTML = `
        <div class="score-badge">
            <div class="score-time"><i class="fa-solid fa-clock"></i> ${min}:${sec.toString().padStart(2, '0')}</div>
        </div>
      `;
  }

  // Message de verrouillage
  let lockMsg = "";
  if (!isUnlocked) {
    lockMsg = `<div class="lock-message"><i class="fa-solid fa-lock"></i> Terminez le niveau précédent</div>`;
  }

  card.innerHTML = `
    ${scoreHTML}
    <div class="level-header">
        <div class="level-icon">
            <i class="fa-solid ${!isUnlocked ? 'fa-lock' : iconClass}"></i>
        </div>
        <div class="level-info">
            <h3>${level.theme}</h3>
            <div class="level-number">Niveau ${displayNum}</div>
        </div>
    </div>
    
    <div class="level-description">
        ${level.words.length} mots à trouver • Grille ${level.gridSize}x${level.gridSize}
    </div>
    ${lockMsg}
  `;

  // Clic sur la carte
  if (isUnlocked) {
    card.onclick = () => playLevel(levelId, level.difficulty);
  }

  return card;
}

// --- LOGIQUE DE JEU ---

// Filtrer les niveaux (Facile / Moyen / Difficile)
function filterLevels(difficulty) {
  currentFilter = difficulty;

  // 1. Gérer les badges actifs (UI)
  document.querySelectorAll(".difficulty-badge").forEach((badge) => {
    badge.classList.remove("active");
  });
  const activeBadge = document.querySelector(`.difficulty-badge[data-difficulty="${difficulty}"]`);
  if (activeBadge) activeBadge.classList.add("active");

  // 2. Afficher/Masquer les cartes (Logique)
  const cards = document.querySelectorAll(".level-card");
  cards.forEach((card) => {
    if (card.getAttribute("data-difficulty") === difficulty) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Lancer le niveau
function playLevel(levelId, difficulty) {
  // Sauvegarde de la config pour la page de jeu
  localStorage.setItem("currentWordSearchLevel", JSON.stringify({
    levelId: levelId,
    difficulty: difficulty
  }));
  
  // Redirection
  window.location.href = "jeu-mots-meles.html";
}

// Mettre à jour les statistiques globales (Haut de page et Bas de page)
function updateGlobalStats() {
  const progress = JSON.parse(localStorage.getItem("gameProgress") || "{}");
  
  // Compteurs
  let counts = { easy: 0, medium: 0, hard: 0, total: 0 };
  let points = 0; // Si vous stockez les points, récupérez-les ici

  Object.keys(progress).forEach(id => {
      if (progress[id].completed) {
          counts.total++;
          const lvl = LEVELS[id];
          if (lvl) counts[lvl.difficulty]++;
          // Estimation points si non stockés (100/200/300)
          points += (lvl.difficulty === 'easy' ? 100 : lvl.difficulty === 'medium' ? 200 : 300);
      }
  });

  // Mise à jour DOM (Haut de page)
  const totalEl = document.getElementById("totalCompleted");
  if(totalEl) totalEl.textContent = counts.total;
  
  const pointsEl = document.getElementById("totalPointsDisplay");
  if(pointsEl) pointsEl.textContent = points;

  const rateEl = document.getElementById("completionRate");
  if(rateEl) rateEl.textContent = Math.round((counts.total / 18) * 100) + "%";

  // Mise à jour DOM (Bas de page - Barres de progression)
  const easyEl = document.getElementById("easyProgress");
  if(easyEl) easyEl.textContent = `${counts.easy}/6`;

  const medEl = document.getElementById("mediumProgress");
  if(medEl) medEl.textContent = `${counts.medium}/6`;

  const hardEl = document.getElementById("hardProgress");
  if(hardEl) hardEl.textContent = `${counts.hard}/6`;
}