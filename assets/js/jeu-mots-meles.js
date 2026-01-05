// Variable globale pour l'utilisateur
let CURRENT_USER_ID = "guest";

// Fonction pour identifier le joueur
async function initSession() {
  try {
    const response = await fetch("api/get_user.php");
    const data = await response.json();
    CURRENT_USER_ID = data.userId;
  } catch (e) {
    CURRENT_USER_ID = "guest";
  }
}

// Charger `main.js` si nécessaire
if (typeof showPopup !== "function") {
  (function () {
    const s = document.createElement("script");
    s.src = "assets/js/main.js";
    s.async = true;
    document.head.appendChild(s);
  })();
}

// Configuration des niveaux Mots Mêlés
// Note: les mots doivent être en MAJUSCULES et sans accents pour la génération
const MOTS_MELES_LEVELS = {
  // Facile (Grilles 8x8)
  1: {
    theme: "Animaux de la ferme",
    difficulty: "easy",
    gridSize: 8,
    words: ["VACHE", "COCHON", "POULE", "ANE", "CHEVAL", "MOUTON"],
  },
  2: {
    theme: "Fruits d'été",
    difficulty: "easy",
    gridSize: 8,
    words: ["MELON", "FRAISE", "PECHE", "CASSIS", "MURE", "POIRE"],
  },
  3: {
    theme: "Couleurs",
    difficulty: "easy",
    gridSize: 8,
    words: ["ROUGE", "BLEU", "VERT", "JAUNE", "NOIR", "BLANC", "ROSE"],
  },
  4: {
    theme: "Vêtements",
    difficulty: "easy",
    gridSize: 8,
    words: ["ROBE", "JUPE", "PULL", "VESTE", "JEAN", "SHORT"],
  },
  5: {
    theme: "École",
    difficulty: "easy",
    gridSize: 8,
    words: ["STYLO", "GOMME", "LIVRE", "CAHIER", "COLLE", "CRAIE", "SAC"],
  },
  6: {
    theme: "Météo",
    difficulty: "easy",
    gridSize: 8,
    words: ["PLUIE", "VENT", "NEIGE", "SOLEIL", "ORAGE", "GIVRE"],
  },

  // Moyen (Grilles 10x10)
  7: {
    theme: "Métiers",
    difficulty: "medium",
    gridSize: 10,
    words: [
      "DOCTEUR",
      "AVOCAT",
      "GUIDE",
      "JUGE",
      "PILOTE",
      "POLICE",
      "CHEF",
      "VENDEUR",
      "ACTEUR",
    ],
  },
  8: {
    theme: "Sports",
    difficulty: "medium",
    gridSize: 10,
    words: [
      "TENNIS",
      "FOOT",
      "RUGBY",
      "JUDO",
      "BOXE",
      "GOLF",
      "SKI",
      "SURF",
      "VELO",
    ],
  },
  9: {
    theme: "Cuisine",
    difficulty: "medium",
    gridSize: 10,
    words: [
      "FOUR",
      "POELE",
      "MIXEUR",
      "COUPE",
      "BOL",
      "TASSE",
      "VERRE",
      "PLAT",
      "FOUET",
      "WOK",
    ],
  },
  10: {
    theme: "Transports",
    difficulty: "medium",
    gridSize: 10,
    words: [
      "TRAIN",
      "AVION",
      "METRO",
      "BUS",
      "TAXI",
      "BATEAU",
      "VELO",
      "MOTO",
      "AUTO",
    ],
  },
  11: {
    theme: "Corps Humain",
    difficulty: "medium",
    gridSize: 10,
    words: [
      "COEUR",
      "BRAS",
      "JAMBE",
      "TETE",
      "MAIN",
      "PIED",
      "NEZ",
      "YEUX",
      "DOS",
      "COU",
    ],
  },
  12: {
    theme: "Meubles",
    difficulty: "medium",
    gridSize: 10,
    words: [
      "TABLE",
      "CHAISE",
      "LIT",
      "SOFA",
      "BUREAU",
      "LAMPE",
      "TAPIS",
      "ARMOIRE",
      "BANC",
    ],
  },

  // Difficile (Grilles 12x12)
  13: {
    theme: "Astronomie",
    difficulty: "hard",
    gridSize: 12,
    words: [
      "PLANETE",
      "ETOILE",
      "LUNE",
      "MARS",
      "VENUS",
      "TERRE",
      "SOLEIL",
      "COMETE",
      "GALAXIE",
      "ORBITE",
      "FUSEE",
      "ESPACE",
    ],
  },
  14: {
    theme: "Pays",
    difficulty: "hard",
    gridSize: 12,
    words: [
      "FRANCE",
      "CHINE",
      "JAPON",
      "BRESIL",
      "ITALIE",
      "ESPAGNE",
      "CANADA",
      "INDE",
      "MAROC",
      "EGYPTE",
      "GRECE",
      "PEROU",
    ],
  },
  15: {
    theme: "Sciences",
    difficulty: "hard",
    gridSize: 12,
    words: [
      "ATOME",
      "CHIMIE",
      "CELLULE",
      "VIRUS",
      "ROBOT",
      "LASER",
      "ENERGIE",
      "CLIMAT",
      "FOSSILE",
      "METAL",
      "ACIDE",
      "GAZ",
    ],
  },
  16: {
    theme: "Sentiments",
    difficulty: "hard",
    gridSize: 12,
    words: [
      "AMOUR",
      "JOIE",
      "PEUR",
      "COLERE",
      "HONTE",
      "ESPOIR",
      "FIERTE",
      "HAINE",
      "ENNUI",
      "CALME",
      "JALOUX",
      "TRISTE",
    ],
  },
  17: {
    theme: "Informatique",
    difficulty: "hard",
    gridSize: 12,
    words: [
      "CLAVIER",
      "SOURIS",
      "ECRAN",
      "WIFI",
      "CODE",
      "DATA",
      "BUG",
      "WEB",
      "LIEN",
      "PIXEL",
      "SERVER",
      "CLOUD",
      "APP",
      "JAVA",
    ],
  },
  18: {
    theme: "Arbres",
    difficulty: "hard",
    gridSize: 12,
    words: [
      "CHENE",
      "SAPIN",
      "ERABLE",
      "PIN",
      "BOULEAU",
      "POMMIER",
      "OLIVIER",
      "PALMIER",
      "SAULE",
      "FRENE",
      "HETRE",
      "CEDRE",
      "IF",
    ],
  },
};

// État du jeu
let currentLevelId = 1;
let gridSize = 8;
let wordsToFind = [];
let foundWords = [];
let gridData = []; // Matrice 2D des lettres

// Variables d'interaction (Drag)
let isDragging = false;
let startCell = null;
let currentSelection = []; // Array of {row, col}
let startTime = Date.now();
let timerInterval;

// Charger le niveau actuel
function loadLevel() {
  const savedLevel = localStorage.getItem("currentMotsMelesLevel");

  if (savedLevel) {
    try {
      const { levelId } = JSON.parse(savedLevel);
      const levelData = MOTS_MELES_LEVELS[levelId];

      if (levelData) {
        currentLevelId = levelId;
        gridSize = levelData.gridSize;
        wordsToFind = [...levelData.words]; // Copie
        return;
      }
    } catch (e) {
      console.error("Erreur chargement niveau:", e);
    }
  }

  // Niveau par défaut
  currentLevelId = 1;
  const defaultLevel = MOTS_MELES_LEVELS[1];
  gridSize = defaultLevel.gridSize;
  wordsToFind = [...defaultLevel.words];
  localStorage.setItem("currentMotsMelesLevel", JSON.stringify({ levelId: 1 }));
}

// Algorithme de génération de la grille
function generateGrid() {
  // 1. Initialiser grille vide
  const grid = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(""));

  // Directions possibles : [row, col]
  const directions = [
    [0, 1], // Horizontal
    [1, 0], // Vertical
    [1, 1], // Diagonal Bas-Droite
    [-1, 1], // Diagonal Haut-Droite
  ];

  // 2. Placer les mots
  const placedWords = [];

  // Trier les mots du plus long au plus court pour faciliter le placement
  const wordsToPlace = [...wordsToFind].sort((a, b) => b.length - a.length);

  for (const word of wordsToPlace) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100; // Sécurité

    while (!placed && attempts < maxAttempts) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * gridSize);
      const startCol = Math.floor(Math.random() * gridSize);

      if (canPlaceWord(grid, word, startRow, startCol, dir)) {
        placeWord(grid, word, startRow, startCol, dir);
        placed = placedWords.push(word);
      }
    }

    if (!placed) {
      return generateGrid(); // Récursivement réessayer si échec (rare)
    }
  }

  // 3. Remplir les vides
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  gridData = grid;
}

// Vérifier si un mot peut être placé
function canPlaceWord(grid, word, r, c, dir) {
  let [dr, dc] = dir;

  // Vérifier les limites
  if (
    r + dr * (word.length - 1) < 0 ||
    r + dr * (word.length - 1) >= gridSize ||
    c + dc * (word.length - 1) < 0 ||
    c + dc * (word.length - 1) >= gridSize
  ) {
    return false;
  }

  // Vérifier les collisions
  for (let i = 0; i < word.length; i++) {
    const charAtGrid = grid[r + dr * i][c + dc * i];
    if (charAtGrid !== "" && charAtGrid !== word[i]) {
      return false;
    }
  }
  return true;
}

// Placer le mot dans la matrice
function placeWord(grid, word, r, c, dir) {
  let [dr, dc] = dir;
  for (let i = 0; i < word.length; i++) {
    grid[r + dr * i][c + dc * i] = word[i];
  }
}

// Rendu HTML de la grille et de la liste
function initGameInterface() {
  const gridElement = document.getElementById("motsMelesGrid");
  const wordsListElement = document.getElementById("wordsList");

  gridElement.innerHTML = "";
  wordsListElement.innerHTML = "";
  foundWords = [];

  // Configuration CSS Grid dynamique
  gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

  // Création des cellules HTML
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.textContent = gridData[r][c];

      // Events Mouse
      cell.addEventListener("mousedown", handleStart);
      cell.addEventListener("mouseenter", handleMove);
      cell.addEventListener("mouseup", handleEnd);

      // Events Touch
      cell.addEventListener("touchstart", handleStart, { passive: false });
      cell.addEventListener("touchmove", handleTouchMove, { passive: false });
      cell.addEventListener("touchend", handleEnd);

      gridElement.appendChild(cell);
    }
  }

  // Création de la liste des mots
  wordsToFind.forEach((word) => {
    const badge = document.createElement("div");
    badge.className = "word-item";
    badge.textContent = word;
    badge.dataset.word = word;
    wordsListElement.appendChild(badge);
  });

  // Events globaux pour arrêter le drag si on sort de la grille
  document.addEventListener("mouseup", () => {
    if (isDragging) handleEnd();
  });

  updateStats();
}

// --- GESTION DES INTERACTIONS (DRAG) ---

function handleStart(e) {
  if (e.type === "touchstart") e.preventDefault(); // Empêcher le scroll
  isDragging = true;
  const target = e.target.closest(".grid-cell");
  if (!target) return;

  startCell = {
    row: parseInt(target.dataset.row),
    col: parseInt(target.dataset.col),
  };
  selectCell(target);
  currentSelection = [startCell];
}

function handleMove(e) {
  if (!isDragging) return;
  const target = e.target.closest(".grid-cell");
  if (!target) return;

  updateSelection(parseInt(target.dataset.row), parseInt(target.dataset.col));
}

function handleTouchMove(e) {
  if (!isDragging) return;
  e.preventDefault();

  const touch = e.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);

  if (target && target.classList.contains("grid-cell")) {
    updateSelection(parseInt(target.dataset.row), parseInt(target.dataset.col));
  }
}

function updateSelection(endRow, endCol) {
  // Calculer la direction
  const dr = endRow - startCell.row;
  const dc = endCol - startCell.col;

  // Vérifier si c'est une ligne valide (H, V, ou Diagonale parfaite)
  if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
    // Nettoyer la sélection précédente visuelle
    clearVisualSelection();

    currentSelection = [];
    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
    const stepC = dc === 0 ? 0 : dc / Math.abs(dc);

    for (let i = 0; i <= steps; i++) {
      const r = startCell.row + i * stepR;
      const c = startCell.col + i * stepC;
      currentSelection.push({ row: r, col: c });

      const cell = document.querySelector(
        `.grid-cell[data-row="${r}"][data-col="${c}"]`
      );
      if (cell) cell.classList.add("selected");
    }
  }
}

function handleEnd() {
  if (!isDragging) return;
  isDragging = false;

  validateSelection();
  clearVisualSelection();
}

function clearVisualSelection() {
  document
    .querySelectorAll(".grid-cell.selected")
    .forEach((el) => el.classList.remove("selected"));
}

function selectCell(el) {
  el.classList.add("selected");
}

// --- VALIDATION ET LOGIQUE DE JEU ---

function validateSelection() {
  // Construire le mot à partir de la sélection
  let word = "";
  currentSelection.forEach((pos) => {
    word += gridData[pos.row][pos.col];
  });

  // Vérifier à l'endroit et à l'envers
  const reversedWord = word.split("").reverse().join("");

  let validWord = null;
  if (wordsToFind.includes(word) && !foundWords.includes(word)) {
    validWord = word;
  } else if (
    wordsToFind.includes(reversedWord) &&
    !foundWords.includes(reversedWord)
  ) {
    validWord = reversedWord;
  }

  if (validWord) {
    // Mot trouvé !
    foundWords.push(validWord);

    // Marquer les cases comme trouvées
    currentSelection.forEach((pos) => {
      const cell = document.querySelector(
        `.grid-cell[data-row="${pos.row}"][data-col="${pos.col}"]`
      );
      cell.classList.add("found");
      // Animation reset
      cell.style.animation = "none";
      cell.offsetHeight; /* trigger reflow */
      cell.style.animation = null;
    });

    // Marquer le mot dans la liste
    const badge = document.querySelector(
      `.word-item[data-word="${validWord}"]`
    );
    if (badge) badge.classList.add("found");

    updateStats();
    checkWin();
  }
}

function checkWin() {
  if (foundWords.length === wordsToFind.length) {
    clearInterval(timerInterval);
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);

    saveProgress(currentLevelId, elapsedTime);

    setTimeout(() => {
      const nextLevelId = currentLevelId + 1;
      if (MOTS_MELES_LEVELS[nextLevelId]) {
        showSuccessPopupWordSearch(elapsedTime, nextLevelId);
      } else {
        showCompletionPopup();
      }
    }, 500);
  }
}

function saveProgress(levelId, time) {
  // On utilise une clé unique pour ce joueur pour les Mots Mêlés
  const storageKey = `motsMelesProgress_${CURRENT_USER_ID}`;

  // On lit la progression de CE joueur
  const progress = JSON.parse(localStorage.getItem(storageKey) || "{}");

  if (!progress[levelId] || time < progress[levelId].bestTime) {
    progress[levelId] = {
      completed: true,
      bestTime: time,
    };
  }

  localStorage.setItem(storageKey, JSON.stringify(progress));
}

// Mettre à jour les stats affichées
function updateStats() {
  document.getElementById(
    "wordsFoundCount"
  ).textContent = `${foundWords.length}/${wordsToFind.length}`;
  if (document.getElementById("remainingWords")) {
    document.getElementById("remainingWords").textContent =
      wordsToFind.length - foundWords.length;
  }
}

// Timer
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (elapsed % 60).toString().padStart(2, "0");

    const timerEl = document.getElementById("timer");
    if (timerEl) timerEl.textContent = `${minutes}:${seconds}`;

    const elapsedEl = document.getElementById("elapsedTime");
    if (elapsedEl) elapsedEl.textContent = `${minutes}:${seconds}`;
  }, 1000);
}

// Bouton indice
document.getElementById("hintBtn").addEventListener("click", () => {
  // Trouver un mot pas encore trouvé
  const remainingWords = wordsToFind.filter((w) => !foundWords.includes(w));
  if (remainingWords.length === 0) return;

  const randomWord = remainingWords[0]; // Simplification: prend le premier
  // Trouver sa position dans la grille (c'est compliqué car gridData ne stocke pas où est le mot)
  // Astuce : On regénère les coordonnées du mot ou on triche en scannant la grille
  // Pour cet exemple simple : on révèle la première lettre du premier mot restant

  // On va chercher la première lettre du mot dans la grille qui permettrait de former le mot
  // Note: C'est une implémentation simplifiée d'indice
  showPopup(`Cherchez le mot : ${randomWord}`, "Indice");
});

// Bouton recommencer
document.getElementById("restartBtn").addEventListener("click", () => {
  const restartAction = () => {
    startTime = Date.now();
    generateGrid(); // Régénère une nouvelle grille pour la rejouabilité !
    initGameInterface();
    startTimer();
  };

  const msg = "Voulez-vous vraiment recommencer ce niveau ?";
  if (typeof showConfirmPopup === "function") {
    showConfirmPopup(msg, restartAction);
  } else if (confirm(msg)) {
    restartAction();
  }
});

// Charger les infos du niveau
function loadLevelInfo() {
  const levelData = MOTS_MELES_LEVELS[currentLevelId];

  if (levelData) {
    const difficultyText =
      levelData.difficulty === "easy"
        ? "Facile"
        : levelData.difficulty === "medium"
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
    ).textContent = `${difficultyText} - Niveau ${levelNumber} : ${levelData.theme}`;

    const badge = document.querySelector(".level-badge");
    if (badge) {
      badge.classList.remove("easy", "medium", "hard");
      badge.classList.add(levelData.difficulty);

      // Couleurs identiques au Motus
      const colors = {
        easy: { bg: "rgba(34, 197, 94, 0.2)", border: "#22c55e" },
        medium: { bg: "rgba(251, 191, 36, 0.2)", border: "#fbbf24" },
        hard: { bg: "rgba(239, 68, 68, 0.2)", border: "#ef4444" },
      };

      const style = colors[levelData.difficulty];
      badge.style.background = style.bg;
      badge.style.borderColor = style.border;
      badge.style.color = style.border;
    }
  }
}

// Initialisation du jeu
document.addEventListener("DOMContentLoaded", async () => {
  // 1. On attend de savoir qui joue
  await initSession();

  // 2. On charge les infos du niveau (quel mot chercher ?)
  loadLevel();

  // 3. On génère la grille de lettres (Logique)
  // C'était ça qu'il manquait !
  generateGrid();

  // 4. On dessine la grille à l'écran (Visuel)
  // C'était ça aussi !
  initGameInterface();

  // 5. On lance le reste
  startTimer();
  loadLevelInfo();
});

// --- SYSTÈME DE SCORE ---

function calculateScore(difficulty, timeSeconds) {
  // Points de base plus élevés car le jeu est plus long
  const basePoints = {
    easy: 500,
    medium: 800,
    hard: 1200,
  };

  let score = basePoints[difficulty] || 500;

  // Bonus de temps
  // On enlève des points pour chaque seconde passée, avec un plancher
  const timePenalty = timeSeconds * 2;
  score = Math.max(100, score - timePenalty);

  return Math.round(score);
}

// Fonction pour sauvegarder le score (API PHP incluse)
function saveScore(gameType, levelId, difficulty, score, timeSeconds) {
  const storageKey = `gameScores_${CURRENT_USER_ID}`;
  const allScores = JSON.parse(localStorage.getItem(storageKey) || "{}");

  if (!allScores[gameType]) {
    allScores[gameType] = {
      totalPoints: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      bestScores: {},
    };
  }

  const gameScores = allScores[gameType];

  gameScores.totalPoints += score;
  gameScores.gamesPlayed++;
  gameScores.gamesWon++;

  const levelKey = `${difficulty}_${levelId}`;
  if (
    !gameScores.bestScores[levelKey] ||
    score > gameScores.bestScores[levelKey].score
  ) {
    gameScores.bestScores[levelKey] = {
      score: score,
      time: timeSeconds,
      date: new Date().toISOString(),
    };
  }

  localStorage.setItem(storageKey, JSON.stringify(allScores));

  // Envoi BDD
  if (typeof envoyerScoreBDD === "function") {
    envoyerScoreBDD(gameType, levelId, difficulty, score, timeSeconds);
  }

  return {
    currentScore: score,
    totalPoints: gameScores.totalPoints,
    gamesWon: gameScores.gamesWon,
    isNewRecord:
      !gameScores.bestScores[levelKey] ||
      score === gameScores.bestScores[levelKey].score,
  };
}

// Fonction utilitaire API
async function envoyerScoreBDD(jeu, niveau, difficulte, score, temps) {
  try {
    await fetch("api/save_score.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jeu, niveau, difficulte, score, temps }),
    });
  } catch (e) {
    console.error("Erreur API:", e);
  }
}

// Fonction affichage HTML Score
function showScoreInPopup(score, totalPoints, isNewRecord) {
  return `
          <div class="score-display">
              <div class="score-title">Score de la partie</div>
              <div class="score-main">${score} points</div>
              ${
                isNewRecord
                  ? '<div class="new-record">🏆 Nouveau record !</div>'
                  : ""
              }
              <div class="score-total">Total : ${totalPoints} points</div>
          </div>
      `;
}

// Popup Succès Spécifique Mots Mêlés
function showSuccessPopupWordSearch(elapsedTime, nextLevelId) {
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  const levelData = MOTS_MELES_LEVELS[currentLevelId];
  const score = calculateScore(levelData.difficulty, elapsedTime);

  const scoreData = saveScore(
    "mots-meles", // Clé spécifique
    currentLevelId,
    levelData.difficulty,
    score,
    elapsedTime
  );

  const popup = document.createElement("div");
  popup.className = "popup-overlay";
  popup.innerHTML = `
          <div class="popup-content success">
              <div class="popup-icon">🎉</div>
              <h2>Félicitations !</h2>
              <p>Vous avez trouvé tous les mots !</p>
              
              ${showScoreInPopup(
                scoreData.currentScore,
                scoreData.totalPoints,
                scoreData.isNewRecord
              )}
              
              <div class="popup-stats">
                  <div class="stat">
                      <i class="fa-solid fa-clock"></i>
                      <span>${minutes}m ${seconds}s</span>
                  </div>
                  <div class="stat">
                      <i class="fa-solid fa-font"></i>
                      <span>${wordsToFind.length} mots</span>
                  </div>
              </div>
              <div class="popup-buttons">
                  <button class="popup-btn primary" onclick="goToNextLevel(${nextLevelId})">
                      <i class="fa-solid fa-arrow-right"></i>
                      Niveau suivant
                  </button>
                  <button class="popup-btn secondary" onclick="closePopup()">
                      <i class="fa-solid fa-home"></i>
                      Retour aux niveaux
                  </button>
              </div>
          </div>
      `;

  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add("show"), 10);
}

// Popup Completion Totale
function showCompletionPopup() {
  const popup = document.createElement("div");
  popup.className = "popup-overlay";
  popup.innerHTML = `
          <div class="popup-content completion">
              <div class="popup-icon">🏆</div>
              <h2>Incroyable !</h2>
              <p>Vous avez terminé tous les niveaux Mots Mêlés !</p>
              <div class="popup-buttons">
                  <button class="popup-btn primary" onclick="closePopup()">
                      <i class="fa-solid fa-home"></i>
                      Retour aux niveaux
                  </button>
              </div>
          </div>
      `;

  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add("show"), 10);
}

function closePopup() {
  const popup = document.querySelector(".popup-overlay");
  if (popup) {
    popup.classList.remove("show");
    setTimeout(() => {
      popup.remove();
      window.location.href = "mots-meles.html";
    }, 300);
  }
}

function goToNextLevel(nextLevelId) {
  localStorage.setItem(
    "currentMotsMelesLevel",
    JSON.stringify({ levelId: nextLevelId })
  );
  location.reload();
}
