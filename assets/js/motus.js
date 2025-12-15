// Variable globale
let CURRENT_USER_ID = "guest";

// Fonction pour récupérer l'identité
async function initSession() {
    try {
        const response = await fetch('api/get_user.php');
        const data = await response.json();
        CURRENT_USER_ID = data.userId;
        console.log("Menu Motus chargé pour :", CURRENT_USER_ID);
    } catch (e) {
        CURRENT_USER_ID = "guest";
    }
}
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
// Configuration des niveaux (identique à jeu-motus.js)
const MOTUS_LEVELS = {
  1: {
    word: "CHATS",
    difficulty: "easy",
    theme: "Animaux",
    hint: "Petit félin domestique (pluriel)",
  },
  2: {
    word: "FLEUR",
    difficulty: "easy",
    theme: "Nature",
    hint: "Partie colorée d'une plante",
  },
  3: {
    word: "ROUGE",
    difficulty: "easy",
    theme: "Couleurs",
    hint: "La couleur du sang",
  },
  4: {
    word: "SPORT",
    difficulty: "easy",
    theme: "Activités",
    hint: "Activité physique",
  },
  5: { word: "TROIS", difficulty: "easy", theme: "Nombres", hint: "1, 2, ..." },
  6: {
    word: "VILLE",
    difficulty: "easy",
    theme: "Géographie",
    hint: "Lieu d'habitation urbain",
  },
  7: {
    word: "TIGRES",
    difficulty: "medium",
    theme: "Animaux",
    hint: "Grands félins rayés",
  },
  8: {
    word: "JARDIN",
    difficulty: "medium",
    theme: "Nature",
    hint: "Espace vert avec des fleurs",
  },
  9: {
    word: "CLAVIER",
    difficulty: "medium",
    theme: "Technologie",
    hint: "Périphérique pour taper",
  },
  10: {
    word: "CINEMA",
    difficulty: "medium",
    theme: "Culture",
    hint: "Lieu pour voir des films",
  },
  11: {
    word: "BASKET",
    difficulty: "medium",
    theme: "Sports",
    hint: "Sport avec un ballon orange",
  },
  12: {
    word: "MUSIQUE",
    difficulty: "medium",
    theme: "Arts",
    hint: "Art des sons",
  },
  13: {
    word: "KANGOUROU",
    difficulty: "hard",
    theme: "Animaux",
    hint: "Animal sauteur d'Australie",
  },
  14: {
    word: "PHILOSOPHIE",
    difficulty: "hard",
    theme: "Sciences",
    hint: "Réflexion sur l'existence",
  },
  15: {
    word: "ARCHITECTURE",
    difficulty: "hard",
    theme: "Arts",
    hint: "Art de concevoir des bâtiments",
  },
  16: {
    word: "REVOLUTION",
    difficulty: "hard",
    theme: "Histoire",
    hint: "Changement radical",
  },
  17: {
    word: "DEMOCRATIE",
    difficulty: "hard",
    theme: "Politique",
    hint: "Pouvoir du peuple",
  },
  18: {
    word: "ASTROPHYSIQUE",
    difficulty: "hard",
    theme: "Sciences",
    hint: "Étude des astres",
  },
};

let currentFilter = "easy";

// Charger tous les niveaux au démarrage
document.addEventListener("DOMContentLoaded", async () => {
  // 1. On attend la session
  await initSession(); 
  
  // 2. On génère les niveaux et la progression
  generateAllLevels();
  updateProgressStats();

  // 3. AJOUTS : On met à jour les scores et les étoiles MAINTENANT
  updateAllLevelScores("motus");
  displayGlobalStats("motus");
  
  // On lance manuellement la mise à jour des étoiles
  document.querySelectorAll(".level-card").forEach((card) => {
      const levelId = parseInt(card.getAttribute("data-level-id"));
      const difficulty = card.getAttribute("data-difficulty");
      if (levelId && difficulty) {
        updateLevelStars(card, "motus", difficulty, levelId);
      }
  });
});


// Générer tous les niveaux
function generateAllLevels() {
  const grid = document.getElementById("levelsGrid");
  
  //ajoute l'ID à la clé
  const storageKey = `motusProgress_${CURRENT_USER_ID}`;
  const progress = JSON.parse(localStorage.getItem(storageKey) || "{}");

  grid.innerHTML = "";

  Object.keys(MOTUS_LEVELS).forEach((levelId) => {
    const level = MOTUS_LEVELS[levelId];
    const card = createLevelCard(parseInt(levelId), level, progress);
    grid.appendChild(card);
  });

  filterLevels(currentFilter);
}

// Créer une carte de niveau
function createLevelCard(levelId, level, progress) {
  const card = document.createElement("div");
  card.className = "level-card";
  card.setAttribute("data-difficulty", level.difficulty);
  card.setAttribute("data-level-id", levelId);

  const isUnlocked = levelId === 1 || progress[levelId - 1]?.completed || false;
  const isCompleted = progress[levelId]?.completed || false;

  if (!isUnlocked) {
    card.classList.add("locked");
  }

  const levelNumber =
    levelId <= 6 ? levelId : levelId <= 12 ? levelId - 6 : levelId - 12;

  let starsHTML = "";

  let statsHTML = "";
  if (isCompleted && progress[levelId].bestTime) {
    const time = progress[levelId].bestTime;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    statsHTML = `<div class="level-stats">Meilleur temps: ${minutes}m ${seconds}s</div>`;
  }

  let lockMessage = "";
  if (!isUnlocked) {
    lockMessage = `
                    <div class="lock-message">
                        <i class="fa-solid fa-lock"></i>
                        Complétez le niveau précédent
                    </div>
                `;
  }

  const iconClass =
    level.difficulty === "easy"
      ? "fa-star"
      : level.difficulty === "medium"
      ? "fa-bolt"
      : "fa-trophy";

  card.innerHTML = `
                <div class="level-header">
                    <div class="level-icon">
                        <i class="fa-solid ${
                          !isUnlocked ? "fa-lock" : iconClass
                        }"></i>
                    </div>
                    <div class="level-info">
                        <h3>${level.theme}</h3>
                        <div class="level-number">Niveau ${levelNumber}</div>
                    </div>
                </div>
                ${starsHTML}
                <div class="level-title">${level.theme}</div>
                <div class="level-description">${level.word.length} lettres - ${
    level.hint
  }</div>
                ${statsHTML}
                ${lockMessage}
            `;

  if (isUnlocked) {
    card.onclick = () => playLevel(levelId);
  }

  return card;
}

// Filtrer les niveaux par difficulté
function filterLevels(difficulty) {
  currentFilter = difficulty;

  // Mettre à jour les badges de difficulté
  document.querySelectorAll(".difficulty-badge").forEach((badge) => {
    badge.classList.remove("active");
  });
  document
    .querySelector(`.difficulty-badge[data-difficulty="${difficulty}"]`)
    .classList.add("active");

  // Filtrer les cartes
  document.querySelectorAll(".level-card").forEach((card) => {
    if (card.getAttribute("data-difficulty") === difficulty) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Lancer un niveau
function playLevel(levelId) {
  localStorage.setItem(
    "currentMotusLevel",
    JSON.stringify({ levelId: levelId })
  );
  window.location.href = "jeu-motus.html";
}

// Mettre à jour les statistiques de progression
function updateProgressStats() {
  const storageKey = `motusProgress_${CURRENT_USER_ID}`;
  const progress = JSON.parse(localStorage.getItem(storageKey) || "{}");

  let easyCount = 0,
    mediumCount = 0,
    hardCount = 0;

  Object.keys(progress).forEach((levelId) => {
    if (progress[levelId].completed) {
      const level = MOTUS_LEVELS[levelId];
      if (level.difficulty === "easy") easyCount++;
      else if (level.difficulty === "medium") mediumCount++;
      else if (level.difficulty === "hard") hardCount++;
    }
  });

  document.getElementById("easyProgress").textContent = `${easyCount}/6`;
  document.getElementById("mediumProgress").textContent = `${mediumCount}/6`;
  document.getElementById("hardProgress").textContent = `${hardCount}/6`;
}

// Fonction pour récupérer le meilleur score d'un niveau
function getLevelBestScore(gameType, difficulty, levelId) {
  // MODIFICATION ICI : On utilise l'ID de l'utilisateur
  const storageKey = `gameScores_${CURRENT_USER_ID}`;
  const allScores = JSON.parse(localStorage.getItem(storageKey) || "{}");

  if (!allScores[gameType] || !allScores[gameType].bestScores) {
    return null;
  }

  const levelKey = `${difficulty}_${levelId}`;
  return allScores[gameType].bestScores[levelKey] || null;
}

// Fonction pour formater le temps
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

// Fonction pour ajouter le badge de score sur une carte
function addScoreBadge(card, gameType, difficulty, levelId) {
  const bestScore = getLevelBestScore(gameType, difficulty, levelId);

  if (!bestScore) return;

  // Vérifier si le badge existe déjà
  let scoreBadge = card.querySelector(".score-badge");

  if (!scoreBadge) {
    // Créer le badge de score
    scoreBadge = document.createElement("div");
    scoreBadge.className = "score-badge";
    card.appendChild(scoreBadge);
  }

  // Afficher le score et le temps
  scoreBadge.innerHTML = `
        <div class="score-badge-content">
            <div class="score-points">
                <i class="fa-solid fa-star"></i>
                ${bestScore.score} pts
            </div>
            <div class="score-time">
                <i class="fa-solid fa-clock"></i>
                ${formatTime(bestScore.time)}
            </div>
        </div>
    `;
}

// Fonction pour mettre à jour tous les scores sur la page
function updateAllLevelScores(gameType) {
  // Pour chaque carte de niveau
  document.querySelectorAll(".level-card").forEach((card) => {
    const levelId = parseInt(card.getAttribute("data-level-id"));
    const difficulty = card.getAttribute("data-difficulty");

    if (levelId && difficulty) {
      addScoreBadge(card, gameType, difficulty, levelId);
    }
  });
}

// Fonction pour afficher les statistiques globales en haut de page
function displayGlobalStats(gameType) {
  const statsContainer = document.querySelector(".global-stats");

  if (!statsContainer) return;

  // MODIFICATION ICI : On utilise l'ID de l'utilisateur
  const storageKey = `gameScores_${CURRENT_USER_ID}`;
  const allScores = JSON.parse(localStorage.getItem(storageKey) || "{}");
  
  const gameStats = allScores[gameType] || {
    totalPoints: 0,
    gamesPlayed: 0,
    gamesWon: 0,
  };

  const winRate =
    gameStats.gamesPlayed > 0
      ? Math.round((gameStats.gamesWon / gameStats.gamesPlayed) * 100)
      : 0;

  statsContainer.innerHTML = `
        <div class="stat-item">
            <div class="stat-icon">🏆</div>
            <div class="stat-value">${gameStats.totalPoints}</div>
            <div class="stat-label">Points</div>
        </div>
        <div class="stat-item">
            <div class="stat-icon">⭐</div>
            <div class="stat-value">${gameStats.gamesWon}</div>
            <div class="stat-label">Victoires</div>
        </div>
        <div class="stat-item">
            <div class="stat-icon">📊</div>
            <div class="stat-value">${winRate}%</div>
            <div class="stat-label">Réussite</div>
        </div>
    `;
}

// Fonction pour obtenir le nombre d'étoiles selon le score
function getStarsFromScore(score, difficulty) {
  const thresholds = {
    easy: { three: 250, two: 180, one: 100 },
    medium: { three: 350, two: 280, one: 200 },
    hard: { three: 450, two: 380, one: 300 },
  };

  const levels = thresholds[difficulty] || thresholds.easy;

  if (score >= levels.three) return 3;
  if (score >= levels.two) return 2;
  if (score >= levels.one) return 1;
  return 0;
}

// Fonction pour afficher les étoiles sur la carte
function updateLevelStars(card, gameType, difficulty, levelId) {
  const bestScore = getLevelBestScore(gameType, difficulty, levelId);

  if (!bestScore) return;

  const stars = getStarsFromScore(bestScore.score, difficulty);

  // Chercher ou créer le conteneur d'étoiles
  let starsContainer = card.querySelector(".stars");

  if (!starsContainer) {
    starsContainer = document.createElement("div");
    starsContainer.className = "stars";

    // Insérer après le level-header
    const levelHeader = card.querySelector(".level-header");
    if (levelHeader) {
      levelHeader.after(starsContainer);
    }
  }

  // Générer les étoiles
  let starsHTML = "";
  for (let i = 0; i < 3; i++) {
    if (i < stars) {
      starsHTML += '<i class="fa-solid fa-star star filled"></i>';
    } else {
      starsHTML += '<i class="fa-regular fa-star star empty"></i>';
    }
  }

  starsContainer.innerHTML = starsHTML;
}