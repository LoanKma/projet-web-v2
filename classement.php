<?php
session_start();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/classement.css" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />
    <title>Classement - Jeux de Lettres</title>
</head>
<body>
    <!-- Header placeholder -->
    <div id="header-placeholder"></div>

    <!-- Particles background -->
    <div class="particles" id="particles"></div>

    <div class="page-content">
        <div class="ranking-header">
            <div class="ranking-badge">
                <i class="fa-solid fa-trophy"></i>  Classement Global
            </div>
            <h1>Classement</h1>
            <p class="ranking-subtitle">Comparez vos performances avec les autres joueurs</p>
        </div>

        <!-- Podium pour le TOP 3 -->
        <div class="podium-section" id="podium-section" style="display: none;">
            <div class="podium-container" id="podium-container">
                <!-- Le podium sera inséré ici par JavaScript -->
            </div>
        </div>

        <!-- Carte position utilisateur -->
        <div id="user-position"></div>

        <!-- Liste du classement (à partir de la 4ème place ou tout si pas de podium) -->
        <div class="ranking-list" id="leaderboard-content">
            <div class="loading">⏳ Chargement du classement...</div>
        </div>

        <div class="back-button-container">
            <a href="index.php" class="back-button">
                ← Retour à l'accueil
            </a>
        </div>
    </div>

    <!-- Footer placeholder -->
    <div id="footer-placeholder"></div>

    <script>
        // Load header and footer
        fetch('header.php')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header-placeholder').innerHTML = data;
            });
        
        fetch('footer.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('footer-placeholder').innerHTML = data;
            });

        // Créer les particules de fond
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 20 + 's';
                particle.style.animationDuration = (15 + Math.random() * 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        async function loadClassement() {
            try {
                const response = await fetch('php/get_classement.php', {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();

                if (!data.success) {
                    showError(data.message || 'Erreur lors du chargement');
                    return;
                }

                displayUserPosition(data.user_position);
                displayPodiumAndLeaderboard(data.top20, data.user_position.id_user);

            } catch (error) {
                showError('Erreur de connexion au serveur');
                console.error(error);
            }
        }

        function displayUserPosition(user) {
            const userDiv = document.getElementById('user-position');
            
            const medal = user.rang <= 3 ? 
                (user.rang === 1 ? '🥇' : user.rang === 2 ? '🥈' : '🥉') : '';
            
            userDiv.innerHTML = `
                <div class="user-card">
                    <h2>${medal} Votre Position</h2>
                    <div class="user-stats">
                        <div class="stat-item">
                            <div class="stat-value">#${user.rang}</div>
                            <div class="stat-label">Classement</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${user.score_total.toLocaleString()}</div>
                            <div class="stat-label">Score Total</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${user.nb_parties}</div>
                            <div class="stat-label">Parties Jouées</div>
                        </div>
                    </div>
                </div>
            `;
        }

        function displayPodiumAndLeaderboard(players, currentUserId) {
            if (players.length === 0) {
                document.getElementById('leaderboard-content').innerHTML = 
                    '<div class="loading">Aucun joueur dans le classement</div>';
                return;
            }

            // Afficher le podium pour le TOP 3
            if (players.length >= 3) {
                displayPodium(players.slice(0, 3));
            }

            // Afficher le reste de la liste (à partir de la 4ème place)
            displayLeaderboard(players, currentUserId);
        }

        function displayPodium(top3) {
            const podiumSection = document.getElementById('podium-section');
            const podiumContainer = document.getElementById('podium-container');
            
            podiumSection.style.display = 'block';

            // Réorganiser pour mettre 1er au centre : [2ème, 1er, 3ème]
            const orderedPlayers = [top3[1], top3[0], top3[2]].filter(p => p);
            
            let html = '';
            orderedPlayers.forEach((player, index) => {
                const position = player.rang;
                const positionClass = position === 1 ? 'first' : position === 2 ? 'second' : 'third';
                const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : '🥉';
                const rankText = position === 1 ? '1ER' : position === 2 ? '2ÈME' : '3ÈME';
                
                // Initiale du pseudo pour l'avatar
                const initial = player.pseudo.charAt(0).toUpperCase();

                html += `
                    <div class="podium-place ${positionClass}">
                        <div class="podium-avatar-container">
                            ${position === 1 ? '<div class="podium-crown">👑</div>' : ''}
                            <div class="rays"></div>
                            <div class="podium-avatar">
                                ${initial}
                            </div>
                            ${position === 1 ? '<div class="medal-icon">🏆</div>' : ''}
                        </div>
                        <div class="podium-rank">${rankText}</div>
                        <div class="podium-name">${escapeHtml(player.pseudo)}</div>
                        <div class="podium-points">
                            ${player.score_total.toLocaleString()} pts
                        </div>
                        <div class="podium-base">${position}</div>
                    </div>
                `;
            });

            podiumContainer.innerHTML = html;
        }

        function displayLeaderboard(players, currentUserId) {
            const content = document.getElementById('leaderboard-content');
            
            // Filtrer pour n'afficher que les joueurs à partir de la 4ème place
            const listPlayers = players.filter(p => p.rang > 3);

            if (listPlayers.length === 0) {
                content.innerHTML = '';
                return;
            }

            let html = '';
            listPlayers.forEach((player, index) => {
                const isCurrentUser = player.id_user == currentUserId;
                
                let cardClass = '';
                if (isCurrentUser) cardClass = 'current-user';

                html += `
                    <div class="rank-card ${cardClass}" style="animation-delay: ${index * 0.05}s">
                        <div class="rank-left">
                            <span class="rank-pos">#${player.rang}</span>
                            <div class="rank-avatar">${player.pseudo.charAt(0).toUpperCase()}</div>
                            <span class="rank-name">
                                ${escapeHtml(player.pseudo)}
                                ${isCurrentUser ? '<span class="you-tag">(Vous)</span>' : ''}
                            </span>
                        </div>
                        <div class="rank-right">
                            <span class="rank-points">${player.score_total.toLocaleString()} pts</span>
                            <span class="rank-games">${player.nb_parties} partie${player.nb_parties > 1 ? 's' : ''}</span>
                        </div>
                    </div>
                `;
            });

            content.innerHTML = html;
        }

        function showError(message) {
            const content = document.getElementById('leaderboard-content');
            content.innerHTML = `<div class="error">❌ ${escapeHtml(message)}</div>`;
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Initialisation
        createParticles();
        loadClassement();

        // Rafraîchir toutes les 30 secondes
        setInterval(loadClassement, 30000);
    </script>
</body>
</html>