// Configuration des niveaux Motus
const MOTUS_LEVELS = {
  // Facile (1-6) - Mots de 5 lettres
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

  // Moyen (7-12) - Mots de 6 lettres
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

  // Difficile (13-18) - Mots de 7 lettres
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

// Configuration du jeu
const MAX_ATTEMPTS = 6;
let WORD_LENGTH = 5;
let TARGET_WORD = "";
let currentLevelId = 1;

// État du jeu
let currentRow = 0;
let currentCol = 0;
let gameOver = false;
let startTime = Date.now();
let timerInterval;
let attempts = [];

// Charger le niveau actuel
function loadLevel() {
  const savedLevel = localStorage.getItem("currentMotusLevel");

  if (savedLevel) {
    try {
      const { levelId } = JSON.parse(savedLevel);
      const levelData = MOTUS_LEVELS[levelId];

      if (levelData) {
        TARGET_WORD = levelData.word;
        WORD_LENGTH = TARGET_WORD.length;
        currentLevelId = levelId;
        console.log("Niveau Motus chargé:", levelId, TARGET_WORD);
        return;
      }
    } catch (e) {
      console.error("Erreur chargement niveau:", e);
    }
  }

  // Niveau par défaut
  const defaultLevel = MOTUS_LEVELS[1];
  TARGET_WORD = defaultLevel.word;
  WORD_LENGTH = TARGET_WORD.length;
  currentLevelId = 1;
  localStorage.setItem("currentMotusLevel", JSON.stringify({ levelId: 1 }));
  console.log("Niveau par défaut Motus chargé:", TARGET_WORD);
}

// Initialisation de la grille
function initGrid() {
  const grid = document.getElementById("motusGrid");
  grid.innerHTML = "";
  attempts = [];

  for (let row = 0; row < MAX_ATTEMPTS; row++) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "grid-row";

    for (let col = 0; col < WORD_LENGTH; col++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.id = `cell-${row}-${col}`;

      if (col === 0 && row === currentRow) {
        cell.textContent = TARGET_WORD[0];
        cell.classList.add("first-letter");
      } else if (row > currentRow) {
        cell.classList.add("disabled");
      }

      rowDiv.appendChild(cell);
    }

    grid.appendChild(rowDiv);
    attempts[row] = new Array(WORD_LENGTH).fill("");
  }

  attempts[0][0] = TARGET_WORD[0];
  currentCol = 1;
}

// Gestion du clavier physique
document.addEventListener("keydown", (e) => {
  if (gameOver) return;

  if (e.key === "Enter") {
    validateWord();
  } else if (e.key === "Backspace") {
    deleteLetter();
  } else if (/^[a-zA-Z]$/.test(e.key)) {
    addLetter(e.key.toUpperCase());
  }
});

// Gestion du clavier virtuel
document.querySelectorAll(".key").forEach((key) => {
  key.addEventListener("click", () => {
    if (gameOver) return;

    const letter = key.getAttribute("data-key");
    if (letter) {
      addLetter(letter);
    }
  });
});

document.getElementById("validateBtn").addEventListener("click", validateWord);
document.getElementById("deleteBtn").addEventListener("click", deleteLetter);

// Ajouter une lettre
function addLetter(letter) {
  if (currentCol < WORD_LENGTH) {
    const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
    cell.textContent = letter;
    cell.classList.add("active");
    attempts[currentRow][currentCol] = letter;
    currentCol++;

    while (currentCol < WORD_LENGTH && attempts[currentRow][currentCol]) {
      currentCol++;
    }
  }
}

// Supprimer une lettre
function deleteLetter() {
  if (currentCol > 1) {
    currentCol--;
    while (currentCol > 1 && !attempts[currentRow][currentCol]) {
      currentCol--;
    }

    const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
    cell.textContent = "";
    cell.classList.remove("active");
    attempts[currentRow][currentCol] = "";
  }
}

// Valider le mot
function validateWord() {
  if (currentCol !== WORD_LENGTH) {
    alert("Complétez le mot avant de valider !");
    return;
  }

  const guess = attempts[currentRow].join("");

  // Colorer les cellules
  for (let i = 0; i < WORD_LENGTH; i++) {
    const cell = document.getElementById(`cell-${currentRow}-${i}`);
    const letter = guess[i];
    const key = document.querySelector(`[data-key="${letter}"]`);

    cell.classList.remove("active");

    if (letter === TARGET_WORD[i]) {
      cell.classList.add("correct");
      if (key) key.classList.add("correct");
    } else if (TARGET_WORD.includes(letter)) {
      cell.classList.add("present");
      if (key && !key.classList.contains("correct")) {
        key.classList.add("present");
      }
    } else {
      cell.classList.add("absent");
      if (key) key.classList.add("absent");
    }
  }

  // Vérifier si le mot est trouvé
  if (guess === TARGET_WORD) {
    gameOver = true;
    clearInterval(timerInterval);
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);

    // Sauvegarder la progression
    saveProgress(currentLevelId, elapsedTime);

    setTimeout(() => {
      const nextLevelId = currentLevelId + 1;

      if (MOTUS_LEVELS[nextLevelId]) {
        showSuccessPopup(elapsedTime, nextLevelId);
      } else {
        showCompletionPopup();
      }
    }, 500);
    return;
  }

  // Passer à la ligne suivante
  currentRow++;
  currentCol = 1;

  if (currentRow < MAX_ATTEMPTS) {
    const firstCell = document.getElementById(`cell-${currentRow}-0`);
    firstCell.textContent = TARGET_WORD[0];
    firstCell.classList.add("first-letter");
    firstCell.classList.remove("disabled");
    attempts[currentRow][0] = TARGET_WORD[0];

    for (let i = 1; i < WORD_LENGTH; i++) {
      const cell = document.getElementById(`cell-${currentRow}-${i}`);
      cell.classList.remove("disabled");
    }
  } else {
    gameOver = true;
    clearInterval(timerInterval);
    setTimeout(() => {
      showFailurePopup();
    }, 500);
  }

  updateAttempts();
}

// Sauvegarder la progression
function saveProgress(levelId, time) {
  const progress = JSON.parse(localStorage.getItem("motusProgress") || "{}");

  if (!progress[levelId] || time < progress[levelId].bestTime) {
    progress[levelId] = {
      completed: true,
      bestTime: time,
      attempts: currentRow + 1,
      completedAt: Date.now(),
    };
  }

  localStorage.setItem("motusProgress", JSON.stringify(progress));
}

// Mettre à jour le compteur de tentatives
function updateAttempts() {
  document.getElementById("attempts").textContent = `${currentRow}/6`;
  if (document.getElementById("usedAttempts")) {
    document.getElementById("usedAttempts").textContent = `${currentRow}/6`;
  }
}

// Timer
function startTimer() {
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (elapsed % 60).toString().padStart(2, "0");
    document.getElementById("timer").textContent = `${minutes}:${seconds}`;
    if (document.getElementById("elapsedTime")) {
      document.getElementById(
        "elapsedTime"
      ).textContent = `${minutes}:${seconds}`;
    }
  }, 1000);
}

// Bouton indice
document.getElementById("hintBtn").addEventListener("click", () => {
  if (gameOver) {
    alert("La partie est terminée !");
    return;
  }

  const emptyPositions = [];
  for (let i = 1; i < WORD_LENGTH; i++) {
    if (!attempts[currentRow][i]) {
      emptyPositions.push(i);
    }
  }

  if (emptyPositions.length > 0) {
    const randomPos =
      emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
    const cell = document.getElementById(`cell-${currentRow}-${randomPos}`);
    const letter = TARGET_WORD[randomPos];

    cell.textContent = letter;
    cell.classList.add("active");
    cell.classList.add("hint-letter");
    attempts[currentRow][randomPos] = letter;

    currentCol = 1;
    while (currentCol < WORD_LENGTH && attempts[currentRow][currentCol]) {
      currentCol++;
    }

    const levelData = MOTUS_LEVELS[currentLevelId];
    alert(
      `Indice : ${
        levelData.hint
      }\nLa lettre "${letter}" a été révélée en position ${randomPos + 1} !`
    );
  } else {
    alert("Toutes les lettres sont déjà remplies !");
  }
});

// Bouton recommencer
document.getElementById("restartBtn").addEventListener("click", () => {
  if (confirm("Voulez-vous vraiment recommencer ce niveau ?")) {
    currentRow = 0;
    currentCol = 1;
    gameOver = false;
    startTime = Date.now();
    attempts = [];
    clearInterval(timerInterval);

    document.querySelectorAll(".key").forEach((key) => {
      key.classList.remove("correct", "present", "absent");
    });

    initGrid();
    updateAttempts();
    startTimer();
  }
});

// Charger les infos du niveau
function loadLevelInfo() {
  const levelData = MOTUS_LEVELS[currentLevelId];

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

      badge.style.background =
        levelData.difficulty === "easy"
          ? "rgba(34, 197, 94, 0.2)"
          : levelData.difficulty === "medium"
          ? "rgba(251, 191, 36, 0.2)"
          : "rgba(239, 68, 68, 0.2)";
      badge.style.borderColor =
        levelData.difficulty === "easy"
          ? "#22c55e"
          : levelData.difficulty === "medium"
          ? "#fbbf24"
          : "#ef4444";
      badge.style.color =
        levelData.difficulty === "easy"
          ? "#22c55e"
          : levelData.difficulty === "medium"
          ? "#fbbf24"
          : "#ef4444";
    }
  }
}

// Créer le popup de succès
function showSuccessPopup(elapsedTime, nextLevelId) {
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  const popup = document.createElement("div");
  popup.className = "popup-overlay";
  popup.innerHTML = `
        <div class="popup-content success">
            <div class="popup-icon">🎉</div>
            <h2>Bravo !</h2>
            <p>Vous avez trouvé le mot <strong>${TARGET_WORD}</strong></p>
            <div class="popup-stats">
                <div class="stat">
                    <i class="fa-solid fa-clock"></i>
                    <span>${minutes}m ${seconds}s</span>
                </div>
                <div class="stat">
                    <i class="fa-solid fa-list-check"></i>
                    <span>${currentRow + 1}/6 tentatives</span>
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

// Créer le popup d'échec
function showFailurePopup() {
  const popup = document.createElement("div");
  popup.className = "popup-overlay";
  popup.innerHTML = `
        <div class="popup-content failure">
            <div class="popup-icon">😢</div>
            <h2>Perdu !</h2>
            <p>Le mot était : <strong>${TARGET_WORD}</strong></p>
            <div class="popup-buttons">
                <button class="popup-btn primary" onclick="restartLevel()">
                    <i class="fa-solid fa-rotate-right"></i>
                    Recommencer
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

// Créer le popup de completion totale
function showCompletionPopup() {
  const popup = document.createElement("div");
  popup.className = "popup-overlay";
  popup.innerHTML = `
        <div class="popup-content completion">
            <div class="popup-icon">🏆</div>
            <h2>Incroyable !</h2>
            <p>Vous avez terminé tous les niveaux Motus !</p>
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

// Fonction pour fermer le popup
function closePopup() {
  const popup = document.querySelector(".popup-overlay");
  if (popup) {
    popup.classList.remove("show");
    setTimeout(() => {
      popup.remove();
      window.location.href = "motus.html";
    }, 300);
  }
}

// Fonction pour aller au niveau suivant
function goToNextLevel(nextLevelId) {
  localStorage.setItem(
    "currentMotusLevel",
    JSON.stringify({ levelId: nextLevelId })
  );
  location.reload();
}

// Fonction pour recommencer le niveau
function restartLevel() {
  const popup = document.querySelector(".popup-overlay");
  if (popup) {
    popup.classList.remove("show");
    setTimeout(() => {
      popup.remove();
      currentRow = 0;
      currentCol = 1;
      gameOver = false;
      startTime = Date.now();
      attempts = [];
      clearInterval(timerInterval);

      document.querySelectorAll(".key").forEach((key) => {
        key.classList.remove("correct", "present", "absent");
      });

      initGrid();
      updateAttempts();
      startTimer();
    }, 300);
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  console.log("Début initialisation Motus...");

  loadLevel();
  console.log("Mot cible:", TARGET_WORD, "Longueur:", WORD_LENGTH);

  initGrid();
  startTimer();
  loadLevelInfo();
  updateAttempts();

  console.log("Initialisation Motus terminée");
});

// Système de score

// Fonction pour calculer le score
function calculateScore(difficulty, timeSeconds, attempts, completed) {
  if (!completed) return 0;

  // Points de base selon difficulté
  const basePoints = {
    easy: 100,
    medium: 200,
    hard: 300,
  };

  let score = basePoints[difficulty] || 100;

  // Bonus de temps (max 100 points si < 30 secondes)
  const timeBonus = Math.max(0, 100 - Math.floor(timeSeconds / 3));
  score += timeBonus;

  // Bonus tentatives (pour Motus)
  if (attempts > 0) {
    const attemptsBonus = Math.max(0, (7 - attempts) * 20);
    score += attemptsBonus;
  }

  return Math.round(score);
}

// Fonction pour sauvegarder le score
function saveScore(gameType, levelId, difficulty, score, timeSeconds) {
  // Récupérer les scores existants
  const allScores = JSON.parse(localStorage.getItem("gameScores") || "{}");

  // Initialiser le jeu s'il n'existe pas
  if (!allScores[gameType]) {
    allScores[gameType] = {
      totalPoints: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      bestScores: {},
    };
  }

  const gameScores = allScores[gameType];

  // Mettre à jour les statistiques
  gameScores.totalPoints += score;
  gameScores.gamesPlayed++;
  gameScores.gamesWon++;

  // Sauvegarder le meilleur score pour ce niveau
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

  // Sauvegarder dans localStorage
  localStorage.setItem("gameScores", JSON.stringify(allScores));

  return {
    currentScore: score,
    totalPoints: gameScores.totalPoints,
    gamesWon: gameScores.gamesWon,
    isNewRecord:
      !gameScores.bestScores[levelKey] ||
      score === gameScores.bestScores[levelKey].score,
  };
}

// Fonction pour afficher le score dans le popup
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

// MODIFICATION DES POPUPS EXISTANTS

// Pour Motus - Modifier showSuccessPopup
function showSuccessPopup(elapsedTime, nextLevelId) {
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  // Calculer le score
  const difficulty = MOTUS_LEVELS[currentLevelId].difficulty;
  const score = calculateScore(difficulty, elapsedTime, currentRow + 1, true);

  // Sauvegarder le score
  const scoreData = saveScore(
    "motus",
    currentLevelId,
    difficulty,
    score,
    elapsedTime
  );

  const popup = document.createElement("div");
  popup.className = "popup-overlay";
  popup.innerHTML = `
        <div class="popup-content success">
            <div class="popup-icon">🎉</div>
            <h2>Bravo !</h2>
            <p>Vous avez trouvé le mot <strong>${TARGET_WORD}</strong></p>
            
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
                    <i class="fa-solid fa-list-check"></i>
                    <span>${currentRow + 1}/6 tentatives</span>
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

// Pour Mots Mêlés - Modifier showSuccessPopup
function showSuccessPopupWordSearch(elapsedTime, nextLevelId) {
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  // Calculer le score
  const difficulty = LEVELS[currentLevelId].difficulty;
  const score = calculateScore(difficulty, elapsedTime, 0, true);

  // Sauvegarder le score
  const scoreData = saveScore(
    "mots_meles",
    currentLevelId,
    difficulty,
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
                    <span>${WORDS.length} mots trouvés</span>
                </div>
            </div>
            <div class="popup-buttons">
                <button class="popup-btn primary" onclick="goToNextLevelWordSearch(${nextLevelId})">
                    <i class="fa-solid fa-arrow-right"></i>
                    Niveau suivant
                </button>
                <button class="popup-btn secondary" onclick="closePopupWordSearch()">
                    <i class="fa-solid fa-home"></i>
                    Retour aux niveaux
                </button>
            </div>
        </div>
    `;

  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add("show"), 10);
}

// Fonction pour récupérer les statistiques
function getGameStats(gameType) {
  const allScores = JSON.parse(localStorage.getItem("gameScores") || "{}");
  return (
    allScores[gameType] || {
      totalPoints: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      bestScores: {},
    }
  );
}
