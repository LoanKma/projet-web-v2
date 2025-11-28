// Configuration du jeu
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const TARGET_WORD = "CHATS"; // Mot à deviner (viendra de la BDD plus tard)

// État du jeu
let currentRow = 0;
let currentCol = 0;
let gameOver = false;
let startTime = Date.now();
let timerInterval;

// Tableau pour stocker les tentatives
let attempts = [];

// Initialisation de la grille
function initGrid() {
    const grid = document.getElementById('motusGrid');
    grid.innerHTML = '';

    for (let row = 0; row < MAX_ATTEMPTS; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'grid-row';

        // Cellules de lettres
        for (let col = 0; col < WORD_LENGTH; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.id = `cell-${row}-${col}`;
            
            // Première lettre révélée
            if (col === 0 && row === currentRow) {
                cell.textContent = TARGET_WORD[0];
                cell.classList.add('first-letter');
            } else if (row > currentRow) {
                cell.classList.add('disabled');
            }
            
            rowDiv.appendChild(cell);
        }

        grid.appendChild(rowDiv);
        attempts[row] = new Array(WORD_LENGTH).fill('');
    }

    // Première lettre déjà remplie
    attempts[0][0] = TARGET_WORD[0];
    currentCol = 1;
}

// Gestion du clavier physique
document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    if (e.key === 'Enter') {
        validateWord();
    } else if (e.key === 'Backspace') {
        deleteLetter();
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        addLetter(e.key.toUpperCase());
    }
});

// Gestion du clavier virtuel
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', () => {
        if (gameOver) return;

        const letter = key.getAttribute('data-key');
        if (letter) {
            addLetter(letter);
        }
    });
});

document.getElementById('validateBtn').addEventListener('click', validateWord);
document.getElementById('deleteBtn').addEventListener('click', deleteLetter);

// Ajouter une lettre
function addLetter(letter) {
    if (currentCol < WORD_LENGTH) {
        const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
        cell.textContent = letter;
        cell.classList.add('active');
        attempts[currentRow][currentCol] = letter;
        currentCol++;
        
        // Trouver la prochaine case vide
        while (currentCol < WORD_LENGTH && attempts[currentRow][currentCol]) {
            currentCol++;
        }
    }
}

// Supprimer une lettre
function deleteLetter() {
    if (currentCol > 1) { // Ne pas supprimer la première lettre
        // Reculer pour trouver une case non vide
        currentCol--;
        while (currentCol > 1 && !attempts[currentRow][currentCol]) {
            currentCol--;
        }
        
        // Supprimer seulement si ce n'est pas une lettre d'indice qui n'a pas été modifiée
        const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
        cell.textContent = '';
        cell.classList.remove('active');
        attempts[currentRow][currentCol] = '';
    }
}

// Valider le mot
function validateWord() {
    if (currentCol !== WORD_LENGTH) {
        alert('Complétez le mot avant de valider !');
        return;
    }

    const guess = attempts[currentRow].join('');
    
    // Colorer les cellules
    for (let i = 0; i < WORD_LENGTH; i++) {
        const cell = document.getElementById(`cell-${currentRow}-${i}`);
        const letter = guess[i];
        const key = document.querySelector(`[data-key="${letter}"]`);
        
        cell.classList.remove('active');
        
        if (letter === TARGET_WORD[i]) {
            // Lettre bien placée (rouge)
            cell.classList.add('correct');
            if (key) key.classList.add('correct');
        } else if (TARGET_WORD.includes(letter)) {
            // Lettre présente mais mal placée (jaune)
            cell.classList.add('present');
            if (key && !key.classList.contains('correct')) {
                key.classList.add('present');
            }
        } else {
            // Lettre absente (gris)
            cell.classList.add('absent');
            if (key) key.classList.add('absent');
        }
    }

    // Vérifier si le mot est trouvé
    if (guess === TARGET_WORD) {
        gameOver = true;
        clearInterval(timerInterval);
        setTimeout(() => {
            alert('🎉 Bravo ! Vous avez trouvé le mot !');
        }, 500);
        return;
    }

    // Passer à la ligne suivante
    currentRow++;
    currentCol = 1; // Commence à 1 car la première lettre est déjà affichée

    if (currentRow < MAX_ATTEMPTS) {
        // Révéler la première lettre de la nouvelle ligne
        const firstCell = document.getElementById(`cell-${currentRow}-0`);
        firstCell.textContent = TARGET_WORD[0];
        firstCell.classList.add('first-letter');
        firstCell.classList.remove('disabled');
        attempts[currentRow][0] = TARGET_WORD[0];

        // Activer les cellules de la nouvelle ligne
        for (let i = 1; i < WORD_LENGTH; i++) {
            const cell = document.getElementById(`cell-${currentRow}-${i}`);
            cell.classList.remove('disabled');
        }
    } else {
        // Partie perdue
        gameOver = true;
        clearInterval(timerInterval);
        setTimeout(() => {
            alert(`😢 Perdu ! Le mot était : ${TARGET_WORD}`);
        }, 500);
    }

    updateAttempts();
}

// Mettre à jour le compteur de tentatives
function updateAttempts() {
    document.getElementById('attempts').textContent = `${currentRow}/6`;
    document.getElementById('usedAttempts').textContent = `${currentRow}/6`;
}

// Timer
function startTimer() {
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        document.getElementById('timer').textContent = `${minutes}:${seconds}`;
        document.getElementById('elapsedTime').textContent = `${minutes}:${seconds}`;
    }, 1000);
}

// Bouton indice
document.getElementById('hintBtn').addEventListener('click', () => {
    if (gameOver) {
        alert('La partie est terminée !');
        return;
    }

    // Révéler une lettre aléatoire parmi les cases vides
    const emptyPositions = [];
    for (let i = 1; i < WORD_LENGTH; i++) { // Commence à 1 car la première lettre est déjà révélée
        if (!attempts[currentRow][i]) {
            emptyPositions.push(i);
        }
    }

    if (emptyPositions.length > 0) {
        const randomPos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
        const cell = document.getElementById(`cell-${currentRow}-${randomPos}`);
        const letter = TARGET_WORD[randomPos];
        
        cell.textContent = letter;
        cell.classList.add('active');
        attempts[currentRow][randomPos] = letter;
        
        // Repositionner currentCol sur la première case vide
        currentCol = 1;
        while (currentCol < WORD_LENGTH && attempts[currentRow][currentCol]) {
            currentCol++;
        }

        alert(`Indice : La lettre "${letter}" a été révélée en position ${randomPos + 1} !`);
    } else {
        alert('Toutes les lettres sont déjà remplies !');
    }
});

// Bouton recommencer
document.getElementById('restartBtn').addEventListener('click', () => {
    if (confirm('Voulez-vous vraiment recommencer la partie ?')) {
        currentRow = 0;
        currentCol = 1;
        gameOver = false;
        startTime = Date.now();
        attempts = [];
        
        // Réinitialiser le clavier
        document.querySelectorAll('.key').forEach(key => {
            key.classList.remove('correct', 'present', 'absent');
        });
        
        initGrid();
        updateAttempts();
    }
});

// Récupérer les infos du niveau depuis localStorage
function loadLevelInfo() {
    const levelData = localStorage.getItem('currentLevel');
    if (levelData) {
        const level = JSON.parse(levelData);
        document.getElementById('levelTitle').textContent = `Niveau ${level.levelId} - ${
            level.difficulty === 'easy' ? 'Facile' : 
            level.difficulty === 'medium' ? 'Moyen' : 
            'Difficile'
        }`;
        
        // Adapter le badge selon la difficulté
        const badge = document.querySelector('.level-badge');
        badge.classList.remove('easy', 'medium', 'hard');
        badge.classList.add(level.difficulty);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initGrid();
    startTimer();
    loadLevelInfo();
});