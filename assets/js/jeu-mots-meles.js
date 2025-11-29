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
  // Créer une grille vide
  grid = Array(GRID_SIZE)
    .fill()
    .map(() => Array(GRID_SIZE).fill(""));

  // Placer les mots
  WORDS.forEach((word) => {
    placeWord(word);
  });

  // Remplir les cases vides avec des lettres aléatoires
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
      // Placer le mot
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

    // Vérifier les limites
    if (
      newRow < 0 ||
      newRow >= GRID_SIZE ||
      newCol < 0 ||
      newCol >= GRID_SIZE
    ) {
      return false;
    }

    // Vérifier si la case est vide ou contient la même lettre
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

  // Calculer les cellules sélectionnées
  selectedCells = getCellsBetween(selectionStart, selectionEnd);
  highlightSelection();
}

// Fin de la sélection
function endSelection() {
  if (!isSelecting) return;

  isSelecting = false;

  // Vérifier si un mot est trouvé
  checkSelectedWord();

  // Retirer la surbrillance
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

  // Vérifier si c'est une ligne droite (horizontal, vertical ou diagonal)
  const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));

  if (steps === 0) {
    return [[start.row, start.col]];
  }

  const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
  const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);

  // Vérifier si c'est bien une ligne droite
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

  // Construire le mot
  let word = "";
  selectedCells.forEach(([row, col]) => {
    word += grid[row][col];
  });

  // Vérifier aussi le mot inversé
  const reversedWord = word.split("").reverse().join("");

  // Vérifier si c'est un des mots à trouver
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

  // Marquer les cellules
  cells.forEach(([row, col]) => {
    const cell = document.querySelector(
      `[data-row="${row}"][data-col="${col}"]`
    );
    if (cell) {
      cell.classList.add("found");
    }
  });

  // Marquer le mot dans la liste
  const wordItem = document.querySelector(`[data-word="${word}"]`);
  if (wordItem) {
    wordItem.classList.add("found");
  }

  updateProgress();

  // Vérifier si tous les mots sont trouvés
  if (foundWords.length === WORDS.length) {
    clearInterval(timerInterval);
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);

    // Sauvegarder la progression
    saveProgress(currentLevelId, elapsedTime);

    setTimeout(() => {
      const nextLevelId = currentLevelId + 1;

      if (LEVELS[nextLevelId]) {
        if (LEVELS[nextLevelId]) {
          showModal(
            "🎉 Félicitations !",
            "Voulez-vous passer au niveau suivant ?",
            () => {
              localStorage.setItem(
                "currentWordSearchLevel",
                JSON.stringify({ levelId: nextLevelId })
              );
              location.reload();
            }
          );
        } else {
          showModal(
            "🏆 Incroyable !",
            "Vous avez terminé tous les niveaux !",
            null
          );
        }

        // Fonction pour afficher une pop-up modale
        function showModal(title, message, onConfirm) {
          // Créer l'overlay
          const overlay = document.createElement("div");
          overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

          // Créer la modale
          const modal = document.createElement("div");
          modal.style.cssText = `
    background: rgba(30, 41, 59, 0.5);
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    text-align: center;
    max-width: 400px;
    animation: slideIn 0.3s ease;
  `;

          // Ajouter le titre
          const titleEl = document.createElement("h2");
          titleEl.textContent = title;
          titleEl.style.cssText = `
    margin: 0 0 15px 0;
    font-size: 24px;
    color: #ffffffff;
  `;

          // Ajouter le message
          const messageEl = document.createElement("p");
          messageEl.textContent = message;
          messageEl.style.cssText = `
    margin: 0 0 25px 0;
    font-size: 16px;
    color: #d5cfcfff;
  `;

          // Créer le conteneur de boutons
          const buttonContainer = document.createElement("div");
          buttonContainer.style.cssText = `
    display: flex;
    gap: 10px;
    justify-content: center;
  `;

          if (onConfirm) {
            // Bouton Oui
            const yesButton = document.createElement("button");
            yesButton.textContent = "Oui";
            yesButton.style.cssText = `
      padding: 10px 30px;
      font-size: 16px;
      border: none;
      border-radius: 8px;
      background: #4CAF50;
      color: white;
      cursor: pointer;
      transition: background 0.3s;
    `;
            yesButton.onmouseover = () =>
              (yesButton.style.background = "#45a049");
            yesButton.onmouseout = () =>
              (yesButton.style.background = "#4CAF50");
            yesButton.onclick = () => {
              document.body.removeChild(overlay);
              onConfirm();
            };

            // Bouton Non
            const noButton = document.createElement("button");
            noButton.textContent = "Non";
            noButton.style.cssText = `
      padding: 10px 30px;
      font-size: 16px;
      border: none;
      border-radius: 8px;
      background: #f44336;
      color: white;
      cursor: pointer;
      transition: background 0.3s;
    `;
            noButton.onmouseover = () =>
              (noButton.style.background = "#da190b");
            noButton.onmouseout = () => (noButton.style.background = "#f44336");
            noButton.onclick = () => document.body.removeChild(overlay);

            buttonContainer.appendChild(yesButton);
            buttonContainer.appendChild(noButton);
          } else {
            // Bouton OK uniquement
            const okButton = document.createElement("button");
            okButton.textContent = "OK";
            okButton.style.cssText = `
      padding: 10px 40px;
      font-size: 16px;
      border: none;
      border-radius: 8px;
      background: #2563eb;
      color: white;
      cursor: pointer;
      transition: background 0.3s;
    `;
            okButton.onmouseover = () =>
              (okButton.style.background = "#2563eb");
            okButton.onmouseout = () => (okButton.style.background = "#2563eb");
            okButton.onclick = () => document.body.removeChild(overlay);

            buttonContainer.appendChild(okButton);
          }

          // Assembler la modale
          modal.appendChild(titleEl);
          modal.appendChild(messageEl);
          modal.appendChild(buttonContainer);
          overlay.appendChild(modal);

          // Ajouter l'animation
          const style = document.createElement("style");
          style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateY(-50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;
          document.head.appendChild(style);

          // Afficher la modale
          document.body.appendChild(overlay);
        }
      }
    }, 500);
  }
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
    alert("Tous les mots ont été trouvés !");
    return;
  }

  const word = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];

  // Trouver la position du mot dans la grille
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

          alert(`Indice : Cherchez le mot "${word}"`);
          return;
        }
      }
    }
  }
});

// Bouton recommencer
document.getElementById("restartBtn").addEventListener("click", () => {
  if (confirm("Voulez-vous vraiment recommencer ce niveau ?")) {
    foundWords = [];
    startTime = Date.now();
    clearInterval(timerInterval);

    initGrid();
    createGridDisplay();
    createWordsList();
    updateProgress();
    startTimer();
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
