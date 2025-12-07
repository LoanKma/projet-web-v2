<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/classement.css" />
    <title>Classement - Jeux de Lettres</title>
</head>
<body>
    <div class="page-content">
        <div class="ranking-header">
            <div class="ranking-badge">
                🏆 Classement Global
            </div>
            <h1>Classement</h1>
            <p class="ranking-subtitle">Comparez vos performances avec les autres joueurs</p>
        </div>

        <div id="user-position"></div>

        <div class="ranking-list" id="leaderboard-content">
            <div class="loading">⏳ Chargement du classement...</div>
        </div>

        <div class="back-button-container">
            <a href="index.php" class="back-button">
                ← Retour à l'accueil
            </a>
        </div>
    </div>

    <script>
        async function loadClassement() {
            try {
                const response = await fetch('get_classement.php');
                const data = await response.json();

                if (!data.success) {
                    showError(data.message || 'Erreur lors du chargement');
                    return;
                }

                displayUserPosition(data.user_position);
                displayLeaderboard(data.top20, data.user_position.id_user);

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

        function displayLeaderboard(players, currentUserId) {
            const content = document.getElementById('leaderboard-content');
            
            if (players.length === 0) {
                content.innerHTML = '<div class="loading">Aucun joueur dans le classement</div>';
                return;
            }

            let html = '';
            players.forEach((player, index) => {
                const isCurrentUser = player.id_user == currentUserId;
                
                let cardClass = '';
                if (player.rang === 1) cardClass = 'gold';
                else if (player.rang === 2) cardClass = 'silver';
                else if (player.rang === 3) cardClass = 'bronze';
                if (isCurrentUser) cardClass += ' current-user';

                const medal = player.rang === 1 ? '🥇' : 
                             player.rang === 2 ? '🥈' : 
                             player.rang === 3 ? '🥉' : '';

                html += `
                    <div class="rank-card ${cardClass}" style="animation-delay: ${index * 0.05}s">
                        <div class="rank-left">
                            ${medal ? 
                                `<span class="rank-medal">${medal}</span>` : 
                                `<span class="rank-pos">#${player.rang}</span>`
                            }
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

        // Charger le classement au chargement de la page
        loadClassement();

        // Rafraîchir toutes les 30 secondes
        setInterval(loadClassement, 30000);
    </script>
</body>
</html>