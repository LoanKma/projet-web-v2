// Charger `main.js` si nécessaire (fournit `showPopup`/`showConfirmPopup`)
if (typeof showPopup !== "function") {
  (function () {
    const s = document.createElement("script");
    s.src = "assets/js/main.js";
    s.async = true;
    document.head.appendChild(s);
  })();
}

// Configuration des niveaux
const LEVELS = {
  // Facile (1-6)
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

  // Moyen (7-12)
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

  // Difficile (13-18)
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

// Charger le niveau depuis localStorage ou niveau 1 par défaut
const savedLevel = localStorage.getItem("currentWordSearchLevel");
const currentLevelId = savedLevel ? JSON.parse(savedLevel).levelId : 1;
const levelConfig = LEVELS[currentLevelId];

const GRID_SIZE = levelConfig.gridSize;
const WORDS = levelConfig.words;
const DIFFICULTY = levelConfig.difficulty;
const THEME = levelConfig.theme;

let grid = [];
let foundWords = [];
let isSelecting = false;
let selectionStart = null;
let selectionEnd = null;
let selectedCells = [];
let startTime = Date.now();
let timerInterval;

// Directions possibles (8 directions)
const DIRECTIONS = [
  [0, 1], // Horizontal droite
  [1, 0], // Vertical bas
  [1, 1], // Diagonale bas-droite
  [-1, 1], // Diagonale haut-droite
  [0, -1], // Horizontal gauche
  [-1, 0], // Vertical haut
  [-1, -1], // Diagonale haut-gauche
  [1, -1], // Diagonale bas-gauche
];

// Initialiser la grille
function initGrid() {
  grid = Array(GRID_SIZE)
    .fill()
    .map(() => Array(GRID_SIZE).fill(""));

  WORDS.forEach((word) => {
    placeWord(word);
  });

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (!grid[i][j]) {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }
}

// Placer un mot dans la grille
function placeWord(word) {
  let placed = false;
  let attempts = 0;
  const maxAttempts = 100;

  while (!placed && attempts < maxAttempts) {
    const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);

    if (canPlaceWord(word, row, col, direction)) {
      for (let i = 0; i < word.length; i++) {
        const newRow = row + direction[0] * i;
        const newCol = col + direction[1] * i;
        grid[newRow][newCol] = word[i];
      }
      placed = true;
    }

    attempts++;
  }
}

// Vérifier si on peut placer un mot
function canPlaceWord(word, row, col, direction) {
  for (let i = 0; i < word.length; i++) {
    const newRow = row + direction[0] * i;
    const newCol = col + direction[1] * i;

    if (
      newRow < 0 ||
      newRow >= GRID_SIZE ||
      newCol < 0 ||
      newCol >= GRID_SIZE
    ) {
      return false;
    }

    if (grid[newRow][newCol] && grid[newRow][newCol] !== word[i]) {
      return false;
    }
  }

  return true;
}

// Créer l'affichage de la grille
function createGridDisplay() {
  const gridContainer = document.getElementById("wordsearchGrid");
  gridContainer.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 45px)`;
  gridContainer.innerHTML = "";

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.textContent = grid[i][j];
      cell.dataset.row = i;
      cell.dataset.col = j;

      cell.addEventListener("mousedown", () => startSelection(i, j));
      cell.addEventListener("mouseenter", () => updateSelection(i, j));
      cell.addEventListener("mouseup", () => endSelection());

      gridContainer.appendChild(cell);
    }
  }
}

// Créer la liste des mots
function createWordsList() {
  const wordsList = document.getElementById("wordsList");
  wordsList.innerHTML = "";

  WORDS.forEach((word) => {
    const wordItem = document.createElement("div");
    wordItem.className = "word-item";
    wordItem.textContent = word;
    wordItem.dataset.word = word;
    wordsList.appendChild(wordItem);
  });
}

// Démarrer la sélection
function startSelection(row, col) {
  isSelecting = true;
  selectionStart = { row, col };
  selectionEnd = { row, col };
  selectedCells = [[row, col]];

  highlightSelection();
}

// Mettre à jour la sélection
function updateSelection(row, col) {
  if (!isSelecting) return;

  selectionEnd = { row, col };
  selectedCells = getCellsBetween(selectionStart, selectionEnd);
  highlightSelection();
}

// Fin de la sélection
function endSelection() {
  if (!isSelecting) return;

  isSelecting = false;
  checkSelectedWord();

  document.querySelectorAll(".grid-cell").forEach((cell) => {
    cell.classList.remove("selecting");
  });

  selectedCells = [];
}

// Obtenir les cellules entre deux points
function getCellsBetween(start, end) {
  const cells = [];
  const rowDiff = end.row - start.row;
  const colDiff = end.col - start.col;

  const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));

  if (steps === 0) {
    return [[start.row, start.col]];
  }

  const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
  const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);

  if (
    Math.abs(rowDiff) !== 0 &&
    Math.abs(colDiff) !== 0 &&
    Math.abs(rowDiff) !== Math.abs(colDiff)
  ) {
    return [[start.row, start.col]];
  }

  for (let i = 0; i <= steps; i++) {
    cells.push([start.row + rowStep * i, start.col + colStep * i]);
  }

  return cells;
}

// Surligner la sélection
function highlightSelection() {
  document.querySelectorAll(".grid-cell").forEach((cell) => {
    cell.classList.remove("selecting");
  });

  selectedCells.forEach(([row, col]) => {
    const cell = document.querySelector(
      `[data-row="${row}"][data-col="${col}"]`
    );
    if (cell && !cell.classList.contains("found")) {
      cell.classList.add("selecting");
    }
  });
}

// Vérifier le mot sélectionné
function checkSelectedWord() {
  if (selectedCells.length < 2) return;

  let word = "";
  selectedCells.forEach(([row, col]) => {
    word += grid[row][col];
  });

  const reversedWord = word.split("").reverse().join("");

  if (WORDS.includes(word) && !foundWords.includes(word)) {
    markWordAsFound(word, selectedCells);
  } else if (
    WORDS.includes(reversedWord) &&
    !foundWords.includes(reversedWord)
  ) {
    markWordAsFound(reversedWord, selectedCells);
  }
}

// Marquer un mot comme trouvé
function markWordAsFound(word, cells) {
  foundWords.push(word);

  cells.forEach(([row, col]) => {
    const cell = document.querySelector(
      `[data-row="${row}"][data-col="${col}"]`
    );
    if (cell) {
      cell.classList.add("found");
    }
  });

  const wordItem = document.querySelector(`[data-word="${word}"]`);
  if (wordItem) {
    wordItem.classList.add("found");
  }

  updateProgress();

  // Vérifier si tous les mots sont trouvés
  if (foundWords.length === WORDS.length) {
    clearInterval(timerInterval);
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);

    saveProgress(currentLevelId, elapsedTime);

    setTimeout(() => {
      const nextLevelId = currentLevelId + 1;

      if (LEVELS[nextLevelId]) {
        showSuccessPopup(elapsedTime, nextLevelId);
      } else {
        showCompletionPopup();
      }
    }, 500);
  }
}

function showSuccessPopup(elapsedTime, nextLevelId) {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;

    // 1. Calculer et Envoyer le score
    const difficulty = LEVELS[currentLevelId].difficulty;
    const score = calculateScoreMotsMeles(difficulty, elapsedTime);
    
    // Sauvegarde BDD
    envoyerScoreBDD("mots_meles", currentLevelId, difficulty, score, elapsedTime);

    const popup = document.createElement("div");
    popup.className = "popup-overlay";
    popup.innerHTML = `
        <div class="popup-content success">
            <div class="popup-icon">🎉</div>
            <h2>Félicitations !</h2>
            <p>Vous avez trouvé tous les mots !</p>
            
            <div style="background: #e0f2fe; padding: 10px; border-radius: 8px; margin: 10px 0;">
                <h3 style="margin:0; color:#0284c7;">+${score} Points !</h3>
            </div>

            <div class="popup-stats">
                <div class="stat">
                    <i class="fa-solid fa-clock"></i>
                    <span>${minutes}m ${seconds}s</span>
                </div>
                <div class="stat">
                    <i class="fa-solid fa-font"></i>
                    <span>${WORDS.length} mots trouvés</span>
                </div>
            </div>
            <div class="popup-buttons">
                <button class="popup-btn primary" onclick="goToNextLevelWordSearch(${nextLevelId})">
                    <i class="fa-solid fa-arrow-right"></i> Niveau suivant
                </button>
                <button class="popup-btn secondary" onclick="closePopupWordSearch()">
                    <i class="fa-solid fa-home"></i> Menu
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add("show"), 10);
}

// Créer le popup de completion totale
function showCompletionPopup() {
  const popup = document.createElement("div");
  popup.className = "popup-overlay";
  popup.innerHTML = `
        <div class="popup-content completion">
            <div class="popup-icon">🏆</div>
            <h2>Incroyable !</h2>
            <p>Vous avez terminé tous les niveaux de Mots Mêlés !</p>
            <div class="popup-buttons">
                <button class="popup-btn primary" onclick="closePopupWordSearch()">
                    <i class="fa-solid fa-home"></i>
                    Retour aux niveaux
                </button>
            </div>
        </div>
    `;

  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add("show"), 10);
}

// Fonction pour fermer le popup
function closePopupWordSearch() {
  const popup = document.querySelector(".popup-overlay");
  if (popup) {
    popup.classList.remove("show");
    setTimeout(() => {
      popup.remove();
      window.location.href = "mots-meles.html";
    }, 300);
  }
}

// Fonction pour aller au niveau suivant
function goToNextLevelWordSearch(nextLevelId) {
  localStorage.setItem(
    "currentWordSearchLevel",
    JSON.stringify({ levelId: nextLevelId })
  );
  location.reload();
}

// Sauvegarder la progression
function saveProgress(levelId, time) {
  const progress = JSON.parse(localStorage.getItem("gameProgress") || "{}");

  if (!progress[levelId] || time < progress[levelId].bestTime) {
    progress[levelId] = {
      completed: true,
      bestTime: time,
      completedAt: Date.now(),
    };
  }

  localStorage.setItem("gameProgress", JSON.stringify(progress));
}

// Mettre à jour la progression
function updateProgress() {
  const totalWords = WORDS.length;
  document.getElementById(
    "progress"
  ).textContent = `${foundWords.length}/${totalWords} mots`;
  document.getElementById("foundCount").textContent = foundWords.length;

  const progressIndicator = document.querySelector(".progress-indicator");
  if (progressIndicator) {
    progressIndicator.innerHTML = `<span id="foundCount">${foundWords.length}</span>/${totalWords} trouvés`;
  }
}

// Timer
function startTimer() {
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById("timer").textContent = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, 1000);
}

// Bouton indice
document.getElementById("hintBtn").addEventListener("click", () => {
  const unfoundWords = WORDS.filter((word) => !foundWords.includes(word));

  if (unfoundWords.length === 0) {
    if (typeof showPopup === "function") {
      showPopup("Tous les mots ont été trouvés !", "Félicitations");
    } else {
      alert("Tous les mots ont été trouvés !");
    }
    return;
  }

  const word = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      for (const direction of DIRECTIONS) {
        const cells = [];
        let match = true;

        for (let k = 0; k < word.length; k++) {
          const row = i + direction[0] * k;
          const col = j + direction[1] * k;

          if (
            row < 0 ||
            row >= GRID_SIZE ||
            col < 0 ||
            col >= GRID_SIZE ||
            grid[row][col] !== word[k]
          ) {
            match = false;
            break;
          }

          cells.push([row, col]);
        }

        if (match) {
          cells.forEach(([row, col]) => {
            const cell = document.querySelector(
              `[data-row="${row}"][data-col="${col}"]`
            );
            if (cell) {
              cell.style.background = "rgba(251, 191, 36, 0.5)";
              setTimeout(() => {
                cell.style.background = "";
              }, 2000);
            }
          });

          const hintMsg = `Indice : Cherchez le mot "${word}"`;
          if (typeof showPopup === "function") {
            showPopup(hintMsg, "Indice");
          } else {
            alert(hintMsg);
          }
          return;
        }
      }
    }
  }
});

// Bouton recommencer
document.getElementById("restartBtn").addEventListener("click", () => {
  const doRestart = () => {
    foundWords = [];
    startTime = Date.now();
    clearInterval(timerInterval);

    initGrid();
    createGridDisplay();
    createWordsList();
    updateProgress();
    startTimer();
  };

  const msg = "Voulez-vous vraiment recommencer ce niveau ?";
  if (typeof showConfirmPopup === "function") {
    showConfirmPopup(msg, doRestart, "Confirmer");
  } else if (confirm(msg)) {
    doRestart();
  }
});

// Empêcher la sélection de texte
document.addEventListener("selectstart", (e) => {
  if (e.target.classList.contains("grid-cell")) {
    e.preventDefault();
  }
});

// Charger les infos du niveau
function loadLevelInfo() {
  const difficultyText =
    DIFFICULTY === "easy"
      ? "Facile"
      : DIFFICULTY === "medium"
      ? "Moyen"
      : "Difficile";

  const levelNumber =
    currentLevelId <= 6
      ? currentLevelId
      : currentLevelId <= 12
      ? currentLevelId - 6
      : currentLevelId - 12;

  document.getElementById(
    "levelTitle"
  ).textContent = `${difficultyText} - Niveau ${levelNumber} : ${THEME}`;

  const badge = document.querySelector(".level-badge");
  if (badge) {
    badge.style.background =
      DIFFICULTY === "easy"
        ? "rgba(34, 197, 94, 0.2)"
        : DIFFICULTY === "medium"
        ? "rgba(251, 191, 36, 0.2)"
        : "rgba(239, 68, 68, 0.2)";
    badge.style.borderColor =
      DIFFICULTY === "easy"
        ? "#22c55e"
        : DIFFICULTY === "medium"
        ? "#fbbf24"
        : "#ef4444";
    badge.style.color =
      DIFFICULTY === "easy"
        ? "#22c55e"
        : DIFFICULTY === "medium"
        ? "#fbbf24"
        : "#ef4444";
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  console.log("Niveau chargé:", currentLevelId, "Mots:", WORDS);

  initGrid();
  createGridDisplay();
  createWordsList();
  startTimer();
  loadLevelInfo();
  updateProgress();
});

// --- FONCTIONS AJOUTÉES POUR LE SCORE ---

// Calculer les points (100/200/300 pts + bonus temps)
function calculateScoreMotsMeles(difficulty, time) {
    const points = { 'easy': 100, 'medium': 200, 'hard': 300 };
    let score = points[difficulty] || 100;
    // Bonus: +1 pt toutes les 2 secondes économisées sur 5 minutes
    let bonus = Math.max(0, Math.floor((300 - time) / 2));
    return score + bonus;
}

// Envoyer à la BDD
async function envoyerScoreBDD(jeu, niveau, difficulte, score, temps) {
    try {
        await fetch('api/save_score.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jeu, niveau, difficulte, score, temps })
        });
    } catch (e) { console.error(e); }
}