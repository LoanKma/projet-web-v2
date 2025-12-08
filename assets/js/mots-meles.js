// assets/js/mots-meles.js

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

// Configuration des niveaux pour Mots Mêlés
// Note: Dans un mot mêlé, on définit souvent une taille de grille et un thème
const MOTS_MELES_LEVELS = {
  // FACILE (Grilles 8x8)
  1: {
    theme: "Animaux de la ferme",
    difficulty: "easy",
    gridSize: "8x8",
    wordsCount: 6,
    desc: "Trouvez les animaux classiques",
  },
  2: {
    theme: "Fruits d'été",
    difficulty: "easy",
    gridSize: "8x8",
    wordsCount: 6,
    desc: "Des fruits juteux et sucrés",
  },
  3: {
    theme: "Couleurs",
    difficulty: "easy",
    gridSize: "8x8",
    wordsCount: 7,
    desc: "Toutes les couleurs de l'arc-en-ciel",
  },
  4: {
    theme: "Vêtements",
    difficulty: "easy",
    gridSize: "8x8",
    wordsCount: 6,
    desc: "Ce qu'on porte tous les jours",
  },
  5: {
    theme: "École",
    difficulty: "easy",
    gridSize: "8x8",
    wordsCount: 7,
    desc: "Fournitures scolaires",
  },
  6: {
    theme: "Météo",
    difficulty: "easy",
    gridSize: "8x8",
    wordsCount: 6,
    desc: "Soleil, pluie et nuages",
  },

  // MOYEN (Grilles 10x10)
  7: {
    theme: "Métiers",
    difficulty: "medium",
    gridSize: "10x10",
    wordsCount: 9,
    desc: "Diverses professions",
  },
  8: {
    theme: "Sports Olympiques",
    difficulty: "medium",
    gridSize: "10x10",
    wordsCount: 9,
    desc: "Disciplines sportives",
  },
  9: {
    theme: "Cuisine",
    difficulty: "medium",
    gridSize: "10x10",
    wordsCount: 10,
    desc: "Ustensiles et ingrédients",
  },
  10: {
    theme: "Transports",
    difficulty: "medium",
    gridSize: "10x10",
    wordsCount: 9,
    desc: "Moyens de locomotion",
  },
  11: {
    theme: "Corps Humain",
    difficulty: "medium",
    gridSize: "10x10",
    wordsCount: 10,
    desc: "Anatomie et organes",
  },
  12: {
    theme: "Meubles",
    difficulty: "medium",
    gridSize: "10x10",
    wordsCount: 9,
    desc: "Mobilier de la maison",
  },

  // DIFFICILE (Grilles 12x12 ou +)
  13: {
    theme: "Astronomie",
    difficulty: "hard",
    gridSize: "12x12",
    wordsCount: 12,
    desc: "Planètes et constellations",
  },
  14: {
    theme: "Pays du Monde",
    difficulty: "hard",
    gridSize: "12x12",
    wordsCount: 12,
    desc: "Voyage autour du globe",
  },
  15: {
    theme: "Sciences",
    difficulty: "hard",
    gridSize: "12x12",
    wordsCount: 13,
    desc: "Physique, chimie et biologie",
  },
  16: {
    theme: "Sentiments",
    difficulty: "hard",
    gridSize: "12x12",
    wordsCount: 12,
    desc: "Émotions et états d'esprit",
  },
  17: {
    theme: "Informatique",
    difficulty: "hard",
    gridSize: "12x12",
    wordsCount: 14,
    desc: "Hardware et software",
  },
  18: {
    theme: "Arbres et Forêts",
    difficulty: "hard",
    gridSize: "12x12",
    wordsCount: 13,
    desc: "Nature et botanique",
  },
};

let currentFilter = "easy";

// Charger tous les niveaux au démarrage
document.addEventListener("DOMContentLoaded", () => {
  generateAllLevels();
  updateProgressStats();
});

// Générer tous les niveaux
function generateAllLevels() {
  const grid = document.getElementById("levelsGrid");
  // Changement de la clé localStorage pour ne pas mélanger avec le Motus
  const progress = JSON.parse(
    localStorage.getItem("motsMelesProgress") || "{}"
  );

  grid.innerHTML = "";

  Object.keys(MOTS_MELES_LEVELS).forEach((levelId) => {
    const level = MOTS_MELES_LEVELS[levelId];
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

  // Adaptation de l'affichage pour Mots Mêlés
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
                <div class="level-description">Grille ${level.gridSize} - ${
    level.wordsCount
  } mots</div>
                <div class="level-description" style="margin-top:-10px; font-size:12px; opacity:0.8">${
                  level.desc
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
    "currentMotsMelesLevel", // Clé spécifique mots mêlés
    JSON.stringify({ levelId: levelId })
  );
  // Redirection vers la page de jeu des mots mêlés
  window.location.href = "jeu-mots-meles.html";
}

// Mettre à jour les statistiques de progression
function updateProgressStats() {
  const progress = JSON.parse(
    localStorage.getItem("motsMelesProgress") || "{}"
  );

  let easyCount = 0,
    mediumCount = 0,
    hardCount = 0;

  Object.keys(progress).forEach((levelId) => {
    if (progress[levelId].completed) {
      const level = MOTS_MELES_LEVELS[levelId];
      if (level.difficulty === "easy") easyCount++;
      else if (level.difficulty === "medium") mediumCount++;
      else if (level.difficulty === "hard") hardCount++;
    }
  });

  document.getElementById("easyProgress").textContent = `${easyCount}/6`;
  document.getElementById("mediumProgress").textContent = `${mediumCount}/6`;
  document.getElementById("hardProgress").textContent = `${hardCount}/6`;
}

// Script pour afficher les scores sur les cartes de niveaux

// Fonction pour récupérer le meilleur score d'un niveau
function getLevelBestScore(gameType, difficulty, levelId) {
  const allScores = JSON.parse(localStorage.getItem("gameScores") || "{}");

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

  const allScores = JSON.parse(localStorage.getItem("gameScores") || "{}");
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
  // Seuils adaptés pour les mots mêlés (souvent on marque plus de points)
  const thresholds = {
    easy: { three: 600, two: 400, one: 200 },
    medium: { three: 900, two: 600, one: 300 },
    hard: { three: 1200, two: 800, one: 400 },
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

// Initialisation après le chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  // Charger les scores après un court délai pour s'assurer que tout est chargé
  setTimeout(() => {
    // Note: on utilise "mots-meles" comme clé pour gameScores
    updateAllLevelScores("mots-meles");

    // Mettre à jour les étoiles
    document.querySelectorAll(".level-card").forEach((card) => {
      const levelId = parseInt(card.getAttribute("data-level-id"));
      const difficulty = card.getAttribute("data-difficulty");

      if (levelId && difficulty) {
        updateLevelStars(card, "mots-meles", difficulty, levelId);
      }
    });

    // Afficher les stats globales pour mots-meles
    displayGlobalStats("mots-meles");
  }, 100);
});
