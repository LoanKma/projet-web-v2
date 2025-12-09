<?php
require_once 'php/db.php';
require_once 'php/auth.php';

requireLogin();
?>



<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jeux de Lettres</title>
    <link rel="stylesheet" href="assets/css/accueil.css" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />
  </head>
  <body>
<!--HEADER-->
    <div id="header-placeholder"></div>
<!-- HERO SECTION -->
    <section class="hero">
      <div class="badge">
        <i class="fa-solid fa-gamepad"></i> Jeux de mots quotidiens
      </div>
      <h1>Jeux de Lettres</h1>
      <p class="subtitle">
        Entraînez votre esprit avec nos jeux de mots quotidiens. Relevez de
        nouveaux défis chaque jour et grimpez dans le classement !
      </p>
      <p class="date" id="currentDate"></p>
      <button id="toggle-dark"><i class="fa-solid fa-sun big-icon"></i></button>
    </section>
<!--GAME CONTAINER -->
    <div class="games-container">
      <div class="game-card">
        <div class="game-icon">T</div>
        <h2 class="game-title">Motus</h2>
        <p class="game-description">
          Devinez le mot mystère en 6 tentatives maximum
        </p>
        <ul class="game-features">
          <li>La première lettre est dévoilée</li>
          <li>Les lettres bien placées apparaissent en rouge</li>
          <li>Les lettres mal placées apparaissent en jaune</li>
        </ul>
       <button class="play-button" onclick="playMotus()">
          <span>T</span>
          <span>Jouer à Motus</a></span>
        </button>
      </div>
      <div class="game-card">
        <div class="game-icon">⊞</div>
        <h2 class="game-title">Mots Mêlés</h2>
        <p class="game-description">
          Retrouvez tous les mots cachés dans la grille
        </p>
        <ul class="game-features">
          <li>Grille quotidienne au format 10 × 10</li>
          <li>Liste des mots à chercher fournie ci-dessous</li>
          <li>Aide disponible en cas de difficulté</li>
        </ul>
        <button class="play-button" onclick="playMotsFleches()">
          <span>⊞</span>
          <span>Jouer aux Mots Mêlés</span>
        </button>
      </div>
    </div>
<!--STAT SECTION-->
    <div class="stats-container">
      <h1><i class="fa-solid fa-chart-simple"></i>Vos statistiques</h1>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number" id="gamesPlayed">127</div>
          <div class="stat-label">Parties jouées</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="winRate">89%</div>
          <div class="stat-label">Taux de réussite</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="currentStreak">15</div>
          <div class="stat-label">Série actuelle</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="bestStreak">42</div>
          <div class="stat-label">Meilleure série</div>
        </div>
      </div>
    </div>
    <section class="contact-section">
        <h1>Contactez-nous</h1>
        <div class="contact-container">
            <!-- PARTIE GAUCHE - INFORMATIONS -->
            <div class="contact-info">
                <h2>Améliorez le jeu avec nous !</h2>
                <p>
                    Une idée de niveau ? Une mécanique à ajouter ? Un bug à signaler ?
                    Partagez vos retours : c'est grâce à vous que le jeu devient
                    meilleur ! Notre équipe est là pour vous écouter
                </p>
                <p>
                    Remplissez le formulaire ci-contre et nous vous répondrons dans les
                    plus brefs délais.
                </p>

                <div class="contact-details">
                    <div class="detail-item">
                        <div class="detail-icon">
                            <i class="fa-solid fa-envelope"></i>
                        </div>
                        <div class="detail-text">contact@Letterix.fr</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon"><i class="fa-solid fa-phone"></i></div>
                        <div class="detail-text">+33 1 23 45 67 89</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon">
                            <i class="fa-solid fa-location-dot"></i>
                        </div>
                        <div class="detail-text">Paris, France</div>
                    </div>
                </div>
            </div>
            <!-- PARTIE DROITE - FORMULAIRE -->
            <form 
                class="contact-form"
                action="https://formspree.io/f/xldkonjg"
                method="POST"
            >
                <div class="form-group">
                    <label for="name">Votre nom</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        placeholder="Jean Dupont"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="email">Votre email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="jean.dupont@example.com"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="subject">Sujet</label>
                    <input 
                        type="text" 
                        id="subject" 
                        name="subject" 
                        placeholder="Suggestion de niveau"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="message">Votre message</label>
                    <textarea 
                        id="message" 
                        name="message" 
                        placeholder="Décrivez votre idée, votre problème ou votre suggestion..."
                        required
                    ></textarea>
                </div>

                <button type="submit" class="contact-btn">
                    <i class="fa-solid fa-paper-plane"></i> Envoyer le message
                </button>
            </form>
       


         <!-- POPUP DE CONFIRMATION -->
    <div class="popup-overlay" id="popupOverlay">
        <div class="popup">
            <div class="popup-icon">✓</div>
            <h2>Message envoyé !</h2>
            <p>Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais en attendant profiter du jeu .</p>
            <button class="popup-btn" onclick="closePopup()">Fermer</button>
        </div>
    </div>
    </section>

    <script>
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
      // Afficher la date actuelle
      function updateDate() {
        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        const date = new Date().toLocaleDateString("fr-FR", options);
        document.getElementById("currentDate").textContent = date;
      }

      // Animer les statistiques au chargement
      function animateStats() {
        const stats = [
          { id: "gamesPlayed", target: 127 },
          { id: "winRate", target: 89, suffix: "%" },
          { id: "currentStreak", target: 15 },
          { id: "bestStreak", target: 42 },
        ];

        stats.forEach((stat) => {
          const element = document.getElementById(stat.id);
          let current = 0;
          const increment = stat.target / 50;
          const timer = setInterval(() => {
            current += increment;
            if (current >= stat.target) {
              current = stat.target;
              clearInterval(timer);
            }
            element.textContent = Math.floor(current) + (stat.suffix || "");
          }, 20);
        });
      }

      // Fonctions de navigation
      function playMotus() {
        window.location.href = 'motus.html';
      }

      function playMotsFleches() {
        window.location.href = "mots-meles.html";
      }

      // Initialisation
      document.addEventListener("DOMContentLoaded", () => {
        updateDate();
        animateStats();
      });
      // confirmation contact
       const form = document.querySelector('.contact-form');
        const popup = document.getElementById('popupOverlay');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Empêcher le rechargement de page
            
            // Envoyer les données à Formspree
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
              if (response.ok) {
                // Afficher le popup
                popup.classList.add('show');
                    
                // Réinitialiser le formulaire
                form.reset();
              } else {
                const msg = 'Une erreur est survenue. Veuillez réessayer.';
                if (typeof showPopup === 'function') showPopup(msg, 'Erreur');
                else alert(msg);
              }
            })
            .catch(error => {
              const msg = 'Une erreur est survenue. Veuillez réessayer.';
              if (typeof showPopup === 'function') showPopup(msg, 'Erreur');
              else alert(msg);
            });
        });

        function closePopup() {
            popup.classList.remove('show');
        }

        // Fermer le popup en cliquant sur l'overlay
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                closePopup();
            }
        });
      

    
    </script>
  </body>
  <div id="footer-placeholder"></div>
</html>
