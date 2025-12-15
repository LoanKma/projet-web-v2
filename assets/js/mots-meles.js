// assets/js/mots-meles.js - VERSION FINALE CORRIGÉE

// 1. GLOBALE ET SESSION
window.CURRENT_USER_ID = "guest";
console.log("🚀 SCRIPT MOTS-MELES DÉMARRÉ");

async function initSession() {
    try {
        const response = await fetch('api/get_user.php');
        const data = await response.json();
        window.CURRENT_USER_ID = data.userId;
        console.log("✅ SESSION RÉCUPÉRÉE :", window.CURRENT_USER_ID);
    } catch (e) {
        console.warn("⚠️ Erreur session", e);
        window.CURRENT_USER_ID = "guest";
    }
}

// Chargement Header/Footer
fetch("header.php").then(r => r.text()).then(d => document.getElementById("header-placeholder").innerHTML = d);
fetch("footer.html").then(r => r.text()).then(d => document.getElementById("footer-placeholder").innerHTML = d);

// Configuration Niveaux
const MOTS_MELES_LEVELS = {
  1: { theme: "Animaux de la ferme", difficulty: "easy", gridSize: "8x8", wordsCount: 6, desc: "Trouvez les animaux classiques" },
  2: { theme: "Fruits d'été", difficulty: "easy", gridSize: "8x8", wordsCount: 6, desc: "Des fruits juteux et sucrés" },
  3: { theme: "Couleurs", difficulty: "easy", gridSize: "8x8", wordsCount: 7, desc: "Toutes les couleurs de l'arc-en-ciel" },
  4: { theme: "Vêtements", difficulty: "easy", gridSize: "8x8", wordsCount: 6, desc: "Ce qu'on porte tous les jours" },
  5: { theme: "École", difficulty: "easy", gridSize: "8x8", wordsCount: 7, desc: "Fournitures scolaires" },
  6: { theme: "Météo", difficulty: "easy", gridSize: "8x8", wordsCount: 6, desc: "Soleil, pluie et nuages" },
  7: { theme: "Métiers", difficulty: "medium", gridSize: "10x10", wordsCount: 9, desc: "Diverses professions" },
  8: { theme: "Sports Olympiques", difficulty: "medium", gridSize: "10x10", wordsCount: 9, desc: "Disciplines sportives" },
  9: { theme: "Cuisine", difficulty: "medium", gridSize: "10x10", wordsCount: 10, desc: "Ustensiles et ingrédients" },
  10: { theme: "Transports", difficulty: "medium", gridSize: "10x10", wordsCount: 9, desc: "Moyens de locomotion" },
  11: { theme: "Corps Humain", difficulty: "medium", gridSize: "10x10", wordsCount: 10, desc: "Anatomie et organes" },
  12: { theme: "Meubles", difficulty: "medium", gridSize: "10x10", wordsCount: 9, desc: "Mobilier de la maison" },
  13: { theme: "Astronomie", difficulty: "hard", gridSize: "12x12", wordsCount: 12, desc: "Planètes et constellations" },
  14: { theme: "Pays du Monde", difficulty: "hard", gridSize: "12x12", wordsCount: 12, desc: "Voyage autour du globe" },
  15: { theme: "Sciences", difficulty: "hard", gridSize: "12x12", wordsCount: 13, desc: "Physique, chimie et biologie" },
  16: { theme: "Sentiments", difficulty: "hard", gridSize: "12x12", wordsCount: 12, desc: "Émotions et états d'esprit" },
  17: { theme: "Informatique", difficulty: "hard", gridSize: "12x12", wordsCount: 14, desc: "Hardware et software" },
  18: { theme: "Arbres et Forêts", difficulty: "hard", gridSize: "12x12", wordsCount: 13, desc: "Nature et botanique" },
};

let currentFilter = "easy";

// 2. INITIALISATION (Le coeur du problème était ici)
document.addEventListener("DOMContentLoaded", async () => {
    console.log("⏳ Initialisation du DOM...");
    await initSession();

    // A. Affichage des niveaux
    generateAllLevels();
    updateProgressStats();

    // B. FORÇAGE DE L'AFFICHAGE DES STATS
    // On appelle directement les fonctions sans condition "if typeof"
    console.log("📞 Appel des fonctions de score...");
    updateAllLevelScores("mots-meles"); 
    displayGlobalStats("mots-meles"); // <--- C'est ici que ça se joue

    // C. Etoiles visuelles
    document.querySelectorAll(".level-card").forEach((card) => {
        const levelId = parseInt(card.getAttribute("data-level-id"));
        const difficulty = card.getAttribute("data-difficulty");
        if (levelId && difficulty) {
            updateLevelStars(card, "mots-meles", difficulty, levelId);
        }
    });
});

// 3. FONCTIONS PRINCIPALES
function generateAllLevels() {
  const grid = document.getElementById("levelsGrid");
  const storageKey = `motsMelesProgress_${window.CURRENT_USER_ID}`;
  const progress = JSON.parse(localStorage.getItem(storageKey) || "{}");
  console.log("📖 Lecture Progression (Menu) :", storageKey, progress);

  if(!grid) return;
  grid.innerHTML = "";

  Object.keys(MOTS_MELES_LEVELS).forEach((levelId) => {
    const level = MOTS_MELES_LEVELS[levelId];
    const card = createLevelCard(parseInt(levelId), level, progress);
    grid.appendChild(card);
  });
  filterLevels(currentFilter);
}

function createLevelCard(levelId, level, progress) {
  const card = document.createElement("div");
  card.className = "level-card";
  card.setAttribute("data-difficulty", level.difficulty);
  card.setAttribute("data-level-id", levelId);

  let isUnlocked = false;
  if (levelId === 1) {
      isUnlocked = true;
  } else {
      const prevId = (levelId - 1).toString();
      if ((progress[prevId] && progress[prevId].completed) || 
          (progress[levelId - 1] && progress[levelId - 1].completed)) {
          isUnlocked = true;
      }
  }

  const isCompleted = (progress[levelId] && progress[levelId].completed) || false;
  if (!isUnlocked) card.classList.add("locked");

  const levelNumber = levelId <= 6 ? levelId : levelId <= 12 ? levelId - 6 : levelId - 12;

  let statsHTML = "";
  if (isCompleted && progress[levelId] && progress[levelId].bestTime) {
    const min = Math.floor(progress[levelId].bestTime / 60);
    const sec = progress[levelId].bestTime % 60;
    statsHTML = `<div class="level-stats">Meilleur: ${min}m ${sec}s</div>`;
  }

  let displayIcon = !isUnlocked 
      ? '<i class="fa-solid fa-lock"></i>' 
      : `<i class="fa-solid ${level.difficulty === "easy" ? "fa-star" : level.difficulty === "medium" ? "fa-bolt" : "fa-trophy"}"></i>`;
  
  let lockMsg = !isUnlocked ? `<div class="lock-message"><i class="fa-solid fa-lock"></i> Bloqué</div>` : '';

  card.innerHTML = `
        <div class="level-header">
            <div class="level-icon">${displayIcon}</div>
            <div class="level-info"><h3>${level.theme}</h3><div class="level-number">Niveau ${levelNumber}</div></div>
        </div>
        <div class="level-title">${level.theme}</div>
        <div class="level-description">${level.gridSize} - ${level.wordsCount} mots</div>
        ${statsHTML}
        ${lockMsg}
  `;

  if (isUnlocked) card.onclick = () => playLevel(levelId);
  return card;
}

function filterLevels(difficulty) {
  currentFilter = difficulty;
  document.querySelectorAll(".difficulty-badge").forEach(b => b.classList.remove("active"));
  const btn = document.querySelector(`.difficulty-badge[data-difficulty="${difficulty}"]`);
  if(btn) btn.classList.add("active");
  document.querySelectorAll(".level-card").forEach((card) => {
    card.style.display = card.getAttribute("data-difficulty") === difficulty ? "block" : "none";
  });
}

function playLevel(levelId) {
  localStorage.setItem("currentMotsMelesLevel", JSON.stringify({ levelId: levelId }));
  window.location.href = "jeu-mots-meles.html";
}

function updateProgressStats() {
  const storageKey = `motsMelesProgress_${window.CURRENT_USER_ID}`;
  const progress = JSON.parse(localStorage.getItem(storageKey) || "{}");
  let c = { easy: 0, medium: 0, hard: 0 };
  Object.keys(progress).forEach((levelId) => {
    if (progress[levelId].completed && MOTS_MELES_LEVELS[levelId]) {
      c[MOTS_MELES_LEVELS[levelId].difficulty]++;
    }
  });
  if(document.getElementById("easyProgress")) document.getElementById("easyProgress").textContent = `${c.easy}/6`;
  if(document.getElementById("mediumProgress")) document.getElementById("mediumProgress").textContent = `${c.medium}/6`;
  if(document.getElementById("hardProgress")) document.getElementById("hardProgress").textContent = `${c.hard}/6`;
}

// 4. SYSTÈME DE SCORES (AUTO-RÉPARATION)

function getLevelBestScore(gameType, difficulty, levelId) {
  const storageKey = `gameScores_${window.CURRENT_USER_ID}`;
  const allScores = JSON.parse(localStorage.getItem(storageKey) || "{}");
  if (!allScores[gameType] || !allScores[gameType].bestScores) return null;
  return allScores[gameType].bestScores[`${difficulty}_${levelId}`] || null;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function updateAllLevelScores(gameType) {
  document.querySelectorAll(".level-card").forEach((card) => {
    const levelId = parseInt(card.getAttribute("data-level-id"));
    const difficulty = card.getAttribute("data-difficulty");
    if (levelId && difficulty) {
      const bestScore = getLevelBestScore(gameType, difficulty, levelId);
      if (bestScore) {
          let badge = card.querySelector(".score-badge");
          if (!badge) {
              badge = document.createElement("div");
              badge.className = "score-badge";
              card.appendChild(badge);
          }
          badge.innerHTML = `<div class="score-badge-content"><div class="score-points"><i class="fa-solid fa-star"></i> ${bestScore.score} pts</div><div class="score-time"><i class="fa-solid fa-clock"></i> ${formatTime(bestScore.time)}</div></div>`;
      }
    }
  });
}

function updateLevelStars(card, gameType, difficulty, levelId) {
  const bestScore = getLevelBestScore(gameType, difficulty, levelId);
  if (!bestScore) return;
  
  const thresholds = {
    easy: { three: 600, two: 400, one: 200 },
    medium: { three: 900, two: 600, one: 300 },
    hard: { three: 1200, two: 800, one: 400 },
  };
  const levels = thresholds[difficulty] || thresholds.easy;
  let stars = 0;
  if (bestScore.score >= levels.three) stars = 3;
  else if (bestScore.score >= levels.two) stars = 2;
  else if (bestScore.score >= levels.one) stars = 1;

  let starsContainer = card.querySelector(".stars");
  if (!starsContainer) {
    starsContainer = document.createElement("div");
    starsContainer.className = "stars";
    card.querySelector(".level-header")?.after(starsContainer);
  }
  let html = "";
  for (let i = 0; i < 3; i++) html += `<i class="${i < stars ? 'fa-solid' : 'fa-regular'} fa-star star ${i < stars ? 'filled' : 'empty'}"></i>`;
  starsContainer.innerHTML = html;
}

// C'EST ICI LA FONCTION MAGIQUE DE RECALCUL
function displayGlobalStats(gameType) {
    console.log("--- DÉBUT CALCUL STATS ---");
    const container = document.querySelector(".global-stats");
    if(!container) return;

    const storageKey = `gameScores_${window.CURRENT_USER_ID}`;
    const allScores = JSON.parse(localStorage.getItem(storageKey) || "{}");
    
    // Récupération ou recherche secours
    let gameStats = allScores[gameType];
    if (!gameStats && allScores["mots-meles"]) gameStats = allScores["mots-meles"];
    if (!gameStats && allScores["mots_meles"]) gameStats = allScores["mots_meles"];
    
    // RECALCUL TOTAL FORCE BRUTE
    let calculatedPoints = 0;
    let calculatedWins = 0;

    if (gameStats && gameStats.bestScores) {
        Object.values(gameStats.bestScores).forEach(record => {
            if (record && record.score) {
                calculatedPoints += parseInt(record.score);
                calculatedWins++;
            }
        });
        console.log(`📊 Recalcul terminé: ${calculatedPoints} points, ${calculatedWins} victoires`);
    }

    const winRate = calculatedWins > 0 ? 100 : 0; // Simplifié pour l'exemple

    container.innerHTML = `
        <div class="stat-item"><div class="stat-icon">🏆</div><div class="stat-value">${calculatedPoints}</div><div class="stat-label">Points</div></div>
        <div class="stat-item"><div class="stat-icon">⭐</div><div class="stat-value">${calculatedWins}</div><div class="stat-label">Victoires</div></div>
        <div class="stat-item"><div class="stat-icon">📊</div><div class="stat-value">${winRate}%</div><div class="stat-label">Réussite</div></div>
    `;
}