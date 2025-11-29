// motus.js
// header load
fetch("header.html")
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
document.addEventListener("DOMContentLoaded", () => {
  generateAllLevels();
  updateProgressStats();
});

// Générer tous les niveaux
function generateAllLevels() {
  const grid = document.getElementById("levelsGrid");
  const progress = JSON.parse(localStorage.getItem("motusProgress") || "{}");

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
  if (isCompleted) {
    starsHTML = `
                    <div class="stars">
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                    </div>
                `;
  }

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
  const progress = JSON.parse(localStorage.getItem("motusProgress") || "{}");

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
