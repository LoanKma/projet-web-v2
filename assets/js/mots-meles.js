// Gestion du filtre de difficulté
function filterLevels(difficulty) {
  // Retirer la classe active de tous les badges
  const badges = document.querySelectorAll(".difficulty-badge");
  badges.forEach((badge) => badge.classList.remove("active"));

  // Ajouter la classe active au badge cliqué
  const activeBadge = document.querySelector(
    `.difficulty-badge[data-difficulty="${difficulty}"]`
  );
  if (activeBadge) {
    activeBadge.classList.add("active");
  }

  // Masquer toutes les cartes de niveau
  const levelCards = document.querySelectorAll(".level-card");
  levelCards.forEach((card) => {
    card.style.display = "none";
  });

  // Afficher uniquement les cartes correspondant à la difficulté sélectionnée
  const selectedCards = document.querySelectorAll(
    `.level-card[data-difficulty="${difficulty}"]`
  );
  selectedCards.forEach((card) => {
    card.style.display = "block";
  });
}

// Fonction pour jouer à un niveau
function playLevel(levelId, difficulty) {
  // Vérifier si le niveau est verrouillé
  const levelCard = document.querySelector(
    `.level-card[data-level-id="${levelId}"]`
  );
  if (levelCard && levelCard.classList.contains("locked")) {
    alert(
      "Ce niveau est verrouillé. Complétez les niveaux précédents pour le débloquer."
    );
    return;
  }

  // Stockage du niveau sélectionné
  localStorage.setItem(
    "currentWordSearchLevel",
    JSON.stringify({
      levelId: levelId,
      difficulty: difficulty,
    })
  );

  // Redirection vers la page de jeu
  window.location.href = "jeu-mots-meles.html";
}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  // Par défaut, afficher les niveaux faciles
  filterLevels("easy");
});

// Configuration des niveaux (copier depuis jeu-mots-meles.js)
const LEVELS = {
  1: {
    gridSize: 8,
    words: ["CHAT", "CHIEN", "LION", "OURS"],
    difficulty: "easy",
    theme: "Animaux domestiques",
  },
  2: {
    gridSize: 8,
    words: ["ROSE", "LYS", "IRIS", "TULIPE"],
    difficulty: "easy",
    theme: "Fleurs",
  },
  3: {
    gridSize: 8,
    words: ["ROUGE", "BLEU", "VERT", "JAUNE"],
    difficulty: "easy",
    theme: "Couleurs",
  },
  4: {
    gridSize: 8,
    words: ["PAIN", "LAIT", "CAFE", "THE"],
    difficulty: "easy",
    theme: "Petit déjeuner",
  },
  5: {
    gridSize: 8,
    words: ["SOLEIL", "LUNE", "ETOILE", "NUAGE"],
    difficulty: "easy",
    theme: "Dans le ciel",
  },
  6: {
    gridSize: 8,
    words: ["POMME", "POIRE", "BANANE", "ORANGE"],
    difficulty: "easy",
    theme: "Fruits",
  },
  7: {
    gridSize: 10,
    words: ["TIGRE", "ZEBRE", "GIRAFE", "ELEPHANT", "SINGE"],
    difficulty: "medium",
    theme: "Animaux sauvages",
  },
  8: {
    gridSize: 10,
    words: ["PARIS", "LYON", "MARSEILLE", "TOULOUSE", "NANTES"],
    difficulty: "medium",
    theme: "Villes de France",
  },
  9: {
    gridSize: 10,
    words: ["GUITARE", "PIANO", "VIOLON", "FLUTE", "BATTERIE"],
    difficulty: "medium",
    theme: "Instruments",
  },
  10: {
    gridSize: 10,
    words: ["FOOTBALL", "TENNIS", "BASKET", "RUGBY", "NATATION"],
    difficulty: "medium",
    theme: "Sports",
  },
  11: {
    gridSize: 10,
    words: ["PRINTEMPS", "ETE", "AUTOMNE", "HIVER", "SAISON"],
    difficulty: "medium",
    theme: "Les saisons",
  },
  12: {
    gridSize: 10,
    words: ["ORDINATEUR", "TABLETTE", "TELEPHONE", "SOURIS", "CLAVIER"],
    difficulty: "medium",
    theme: "Informatique",
  },
  13: {
    gridSize: 12,
    words: [
      "RHINOCEROS",
      "HIPPOPOTAME",
      "CROCODILE",
      "KANGOUROU",
      "PANTHERE",
      "CHAMEAU",
    ],
    difficulty: "hard",
    theme: "Animaux exotiques",
  },
  14: {
    gridSize: 12,
    words: [
      "ASTRONOMIE",
      "BIOLOGIE",
      "CHIMIE",
      "PHYSIQUE",
      "GEOGRAPHIE",
      "MATHEMATIQUE",
    ],
    difficulty: "hard",
    theme: "Sciences",
  },
  15: {
    gridSize: 12,
    words: [
      "ARCHITECTURE",
      "SCULPTURE",
      "PEINTURE",
      "PHOTOGRAPHIE",
      "LITTERATURE",
      "MUSIQUE",
    ],
    difficulty: "hard",
    theme: "Arts",
  },
  16: {
    gridSize: 12,
    words: [
      "RENAISSANCE",
      "REVOLUTION",
      "MOYENAGE",
      "ANTIQUITE",
      "PREHISTOIRE",
      "MODERNE",
    ],
    difficulty: "hard",
    theme: "Histoire",
  },
  17: {
    gridSize: 12,
    words: [
      "DEMOCRATIE",
      "REPUBLIQUE",
      "MONARCHIE",
      "PARLEMENT",
      "GOUVERNEMENT",
      "CONSTITUTION",
    ],
    difficulty: "hard",
    theme: "Politique",
  },
  18: {
    gridSize: 12,
    words: [
      "PHILOSOPHIE",
      "PSYCHOLOGIE",
      "AUTORITARISME",
      "ANTHROPOLOGIE",
      "HEGEMONIE",
      "PEDAGOGIE",
    ],
    difficulty: "hard",
    theme: "Sciences humaines",
  },
};

// Charger et afficher tous les niveaux
function loadLevels() {
  const progress = JSON.parse(localStorage.getItem("gameProgress") || "{}");

  // Calculer les stats
  let stats = {
    easy: { completed: 0, total: 6 },
    medium: { completed: 0, total: 6 },
    hard: { completed: 0, total: 6 },
    totalCompleted: 0,
  };

  Object.keys(progress).forEach((levelId) => {
    if (progress[levelId].completed) {
      const level = LEVELS[levelId];
      if (level) {
        stats[level.difficulty].completed++;
        stats.totalCompleted++;
      }
    }
  });

  // Mettre à jour les statistiques globales
  document.getElementById("totalCompleted").textContent = stats.totalCompleted;
  document.getElementById(
    "easyCompleted"
  ).textContent = `${stats.easy.completed}/${stats.easy.total}`;
  document.getElementById(
    "mediumCompleted"
  ).textContent = `${stats.medium.completed}/${stats.medium.total}`;
  document.getElementById(
    "hardCompleted"
  ).textContent = `${stats.hard.completed}/${stats.hard.total}`;

  // Afficher les niveaux pour chaque difficulté
  displayLevelsForDifficulty("easy", 1, 6, "easyLevels", "easyProgress", stats);
  displayLevelsForDifficulty(
    "medium",
    7,
    12,
    "mediumLevels",
    "mediumProgress",
    stats
  );
  displayLevelsForDifficulty(
    "hard",
    13,
    18,
    "hardLevels",
    "hardProgress",
    stats
  );
}

// Afficher les niveaux d'une difficulté
function displayLevelsForDifficulty(
  difficulty,
  startId,
  endId,
  containerId,
  progressId,
  stats
) {
  const container = document.getElementById(containerId);
  const progress = document.getElementById(progressId);
  const savedProgress = JSON.parse(
    localStorage.getItem("gameProgress") || "{}"
  );

  container.innerHTML = "";
  progress.textContent = `${stats[difficulty].completed}/${stats[difficulty].total}`;

  for (let levelId = startId; levelId <= endId; levelId++) {
    const level = LEVELS[levelId];
    const displayNumber = levelId - startId + 1;
    const card = createLevelCard(levelId, displayNumber, level, savedProgress);
    container.appendChild(card);
  }
}

// Créer une carte de niveau
function createLevelCard(levelId, displayNumber, level, progress) {
  const card = document.createElement("div");
  card.className = "level-card";

  const isUnlocked = levelId === 1 || progress[levelId - 1]?.completed || false;
  const isCompleted = progress[levelId]?.completed || false;

  if (!isUnlocked) {
    card.classList.add("locked");
  }

  let badgeHTML = "";
  if (isCompleted) {
    badgeHTML =
      '<div class="completed-badge"><i class="fa-solid fa-check"></i> Terminé</div>';
  } else if (!isUnlocked) {
    badgeHTML =
      '<div class="locked-badge"><i class="fa-solid fa-lock"></i> Verrouillé</div>';
  }

  let bestTimeHTML = "";
  if (isCompleted && progress[levelId].bestTime) {
    const time = progress[levelId].bestTime;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    bestTimeHTML = `
                    <div class="best-time">
                        <i class="fa-solid fa-clock"></i>
                        ${minutes}:${seconds.toString().padStart(2, "0")}
                    </div>
                `;
  }

  card.innerHTML = `
                ${badgeHTML}
                <div class="level-number">Niveau ${displayNumber}</div>
                <div class="level-theme">${level.theme}</div>
                <div class="level-info">
                    <div class="level-words">
                        <i class="fa-solid fa-font"></i>
                        ${level.words.length} mots
                    </div>
                    ${bestTimeHTML}
                </div>
            `;

  if (isUnlocked) {
    card.onclick = () => startLevel(levelId);
  }

  return card;
}

// Démarrer un niveau
function startLevel(levelId) {
  localStorage.setItem(
    "currentWordSearchLevel",
    JSON.stringify({ levelId: levelId })
  );
  window.location.href = "jeu-mots-meles.html";
}

// Réinitialiser la progression
function resetProgress() {
  if (
    confirm("Êtes-vous sûr de vouloir réinitialiser toute votre progression ?")
  ) {
    localStorage.removeItem("gameProgress");
    localStorage.removeItem("currentWordSearchLevel");
    loadLevels();
  }
}

// Charger les niveaux au démarrage
document.addEventListener("DOMContentLoaded", loadLevels);

//header load
fetch("header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header-placeholder").innerHTML = data;
  });

//footer load
fetch("footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer-placeholder").innerHTML = data;
  });
