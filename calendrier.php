<?php
require_once 'php/db.php';
require_once 'php/auth.php';

requireLogin();

// Récupérer les stats de l'utilisateur connecté
$userId = $_SESSION['user_id'];
try {
    // Nombre de parties jouées
    $stmtParties = $pdo->prepare("SELECT COUNT(*) as total FROM parties WHERE id_user = ?");
    $stmtParties->execute([$userId]);
    $totalParties = $stmtParties->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Niveaux complétés
    $stmtLevels = $pdo->prepare("SELECT COUNT(DISTINCT CONCAT(id_jeu, '_', numero_niveau)) as total FROM parties WHERE id_user = ? AND score_obtenu > 0");
    $stmtLevels->execute([$userId]);
    $completedLevels = $stmtLevels->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Score total
    $stmtScore = $pdo->prepare("SELECT score_total FROM utilisateurs WHERE id_user = ?");
    $stmtScore->execute([$userId]);
    $totalScore = $stmtScore->fetch(PDO::FETCH_ASSOC)['score_total'] ?? 0;
    
    // Meilleur temps
    $stmtBest = $pdo->prepare("SELECT MIN(temps_passe) as best FROM parties WHERE id_user = ? AND score_obtenu > 0");
    $stmtBest->execute([$userId]);
    $bestTime = $stmtBest->fetch(PDO::FETCH_ASSOC)['best'] ?? 0;
    $bestTimeFormatted = $bestTime > 0 ? sprintf("%d:%02d", floor($bestTime/60), $bestTime%60) : "0:00";
    
} catch (Exception $e) {
    $totalParties = 0;
    $completedLevels = 0;
    $totalScore = 0;
    $bestTimeFormatted = "0:00";
}
?>


<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Calendrier - Jeu de Lettres</title>
    <link rel="stylesheet" href="assets/css/calendrier.css" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />
  </head>
  <body>
   <div id="header-placeholder"></div>

    <div class="container">
      <h1 class="title">Ton Calendrier</h1>
      <p class="subtitle">Continue ta série pour débloquer des récompenses !</p>

      <div class="streak-banner">
        <div class="streak-content">
          <div class="streak-flame">🔥</div>
          <div class="streak-number" id="streakNumber">0</div>
          <div class="streak-label">jours de série !</div>

          <div class="streak-info">
            <div class="streak-stat">
              <div class="streak-stat-value" id="totalDays">0</div>
              <div class="streak-stat-label">Jours totaux</div>
            </div>
            <div class="streak-stat">
              <div class="streak-stat-value" id="longestStreak">0</div>
              <div class="streak-stat-label">Meilleure série</div>
            </div>
            <div class="streak-stat">
              <div class="streak-stat-value" id="thisMonth">0</div>
              <div class="streak-stat-label">Ce mois-ci</div>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-bullseye"></i></div>
          <div class="stat-value" id="completedLevels"><?php echo $completedLevels; ?></div>
          <div class="stat-label">Niveaux complétés</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-star"></i></div>
          <div class="stat-value" id="totalStars"><?php echo $totalScore ?></div>
          <div class="stat-label">Score Total </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-stopwatch"></i></div>
          <div class="stat-value" id="totalTime"><?php echo $bestTimeFormatted ?></div>
          <div class="stat-label">Meilleur Temps</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="fa-solid fa-medal"></i></div>
          <div class="stat-value" id="achievements"><?php echo $totalParties ?></div>
          <div class="stat-label">Parties jouées</div>
        </div>
      </div>

      <div class="calendar-header">
        <div class="calendar-nav">
          <button onclick="previousMonth()">‹</button>
          <div class="calendar-month" id="currentMonth">Novembre 2025</div>
          <button onclick="nextMonth()">›</button>
        </div>
        <div style="color: #aaa">
          <span style="color: #4caf50; font-weight: bold">●</span> Jour complété
        </div>
      </div>

      <div class="calendar-grid">
        <div class="calendar-weekdays">
          <div class="weekday">Lun</div>
          <div class="weekday">Mar</div>
          <div class="weekday">Mer</div>
          <div class="weekday">Jeu</div>
          <div class="weekday">Ven</div>
          <div class="weekday">Sam</div>
          <div class="weekday">Dim</div>
        </div>
        <div class="calendar-days" id="calendarDays"></div>
      </div>

      
    <script>
 // header load
 fetch('header.php')
      .then(response => response.text())
      .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
      });

      // Variables globales
      let currentDate = new Date();

      // completedDays will be rempli depuis le backend (fenêtre 24h)
      let completedDays = [];

      // Charge les données de séries depuis le backend
      async function loadStreaks() {
        try {
          const res = await fetch('php/get_streaks.php', { credentials: 'include' });
          if (!res.ok) {
            console.error('Erreur lors du chargement des séries');
            return;
          }
          const data = await res.json();
          
          // data.activity_dates : array of 'YYYY-MM-DD'
          completedDays = data.activity_dates || [];

          // Mettre à jour les compteurs
          document.getElementById('streakNumber').textContent = data.current || 0;
          document.getElementById('totalDays').textContent = completedDays.length;
          document.getElementById('longestStreak').textContent = data.best || 0;

          // Calculer "Ce mois-ci" en fonction du mois actuellement affiché
          updateThisMonthCount();

          // Mettre à jour la vue du calendrier
          renderCalendar();
        } catch (err) {
          console.error('Erreur loadStreaks', err);
        }
      }

      // Fonction pour calculer le nombre de jours du mois affiché
      function updateThisMonthCount() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const thisMonthCount = completedDays.filter(d => {
          const parts = d.split('-');
          const dateYear = parseInt(parts[0], 10);
          const dateMonth = parseInt(parts[1], 10) - 1; // Les mois en JS commencent à 0
          return dateYear === year && dateMonth === month;
        }).length;
        
        document.getElementById('thisMonth').textContent = thisMonthCount;
      }

      function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Mise à jour du titre du mois
        const monthNames = [
          "Janvier",
          "Février",
          "Mars",
          "Avril",
          "Mai",
          "Juin",
          "Juillet",
          "Août",
          "Septembre",
          "Octobre",
          "Novembre",
          "Décembre",
        ];
        document.getElementById(
          "currentMonth"
        ).textContent = `${monthNames[month]} ${year}`;

        // Mettre à jour le compteur "Ce mois-ci"
        updateThisMonthCount();

        // Premier jour du mois et nombre de jours
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Lundi = 0

        // Jours du mois précédent
        const prevMonthLastDay = new Date(year, month, 0).getDate();

        const calendarDays = document.getElementById("calendarDays");
        calendarDays.innerHTML = "";

        // Ajouter les jours du mois précédent
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
          const day = prevMonthLastDay - i;
          const dayElement = createDayElement(day, true, year, month - 1);
          calendarDays.appendChild(dayElement);
        }

        // Ajouter les jours du mois actuel
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          const isCompleted = completedDays.includes(dateStr);

          const dayElement = createDayElement(
            day,
            false,
            year,
            month,
            isToday,
            isCompleted
          );
          calendarDays.appendChild(dayElement);
        }

        // Compléter avec les jours du mois suivant
        const remainingDays = 42 - (startingDayOfWeek + daysInMonth);
        for (let day = 1; day <= remainingDays; day++) {
          const dayElement = createDayElement(day, true, year, month + 1);
          calendarDays.appendChild(dayElement);
        }
      }

      function createDayElement(
        day,
        isOtherMonth,
        year,
        month,
        isToday = false,
        isCompleted = false
      ) {
        const dayElement = document.createElement("div");
        dayElement.className = "calendar-day";

        if (isOtherMonth) {
          dayElement.classList.add("other-month");
        }
        if (isToday) {
          dayElement.classList.add("today");
        }
        if (isCompleted) {
          dayElement.classList.add("completed");
        }

        dayElement.innerHTML = `
                <span class="day-number">${day}</span>
                <span class="day-flame">🔥</span>
            `;

        dayElement.onclick = () => {
          if (!isOtherMonth) {
            showDayDetails(day, month, year, isCompleted);
          }
        };

        return dayElement;
      }

      function showDayDetails(day, month, year, isCompleted) {
        const monthNames = [
          "Janvier",
          "Février",
          "Mars",
          "Avril",
          "Mai",
          "Juin",
          "Juillet",
          "Août",
          "Septembre",
          "Octobre",
          "Novembre",
          "Décembre",
        ];

        const dateStr = `${day} ${monthNames[month]} ${year}`;
        const message = isCompleted 
          ? `✅ Tu as joué le ${dateStr} !` 
          : `❌ Aucune partie le ${dateStr}`;
        
        alert(message);
      }

      function previousMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
      }

      function nextMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
      }

      function goBack() {
        window.location.href = 'index.php';
      }

      // Calcul du streak actuel (non utilisé mais gardé pour référence)
      function calculateStreak() {
        const today = new Date();
        const sortedDays = completedDays
          .map((d) => new Date(d))
          .sort((a, b) => b - a);

        let streak = 0;
        let checkDate = new Date(today);
        checkDate.setHours(0, 0, 0, 0);

        for (let day of sortedDays) {
          day.setHours(0, 0, 0, 0);
          const diff = Math.floor((checkDate - day) / (1000 * 60 * 60 * 24));

          if (diff === streak) {
            streak++;
          } else if (diff > streak) {
            break;
          }
        }

        return streak;
      }
      
      // footer load
      fetch('footer.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('footer-placeholder').innerHTML = data;
            });

      // Initialisation
      loadStreaks();
    </script>
    <!-- FOOTER LOAD -->
    <div id="footer-placeholder"></div>
  </body>
</html>