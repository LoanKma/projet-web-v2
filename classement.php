<?php
if (substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip'))
    ob_start("ob_gzhandler");
else
    ob_start();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/classement.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <title>Classement - Jeux de Lettres</title>
</head>
<body>
    <!-- Header placeholder -->
    <div id="header-placeholder"></div>

    <div class="page-content">

        <!-- TITRE -->
        <div class="ranking-header">
            <div class="ranking-badge">
                <i class="fa-solid fa-trophy"></i> Classement
            </div>

            <h1>Classement Général</h1>
            <p class="ranking-subtitle">Comparez vos performances avec les meilleurs joueurs</p>
        </div>

        <!-- PODIUM 3D -->
        <div class="podium-section" id="podium-content">
            <div class="loading">Chargement du podium...</div>
        </div>

        <!-- LISTE DES AUTRES JOUEURS -->
        <div class="ranking-list" id="leaderboard-content">
            <!-- Liste générée par JS -->
        </div>

    </div>

    <!-- Footer placeholder -->
    <div id="footer-placeholder"></div>

<script>
    // Charger Header et Footer
    fetch('header.php')
        .then(r => r.text())
        .then(html => document.getElementById('header-placeholder').innerHTML = html);

    fetch('footer.html')
        .then(r => r.text())
        .then(html => document.getElementById('footer-placeholder').innerHTML = html);

    async function loadClassement() {
        try {
            const res = await fetch('php/get_classement.php');
            const data = await res.json();

            if (!data.success) {
                showError(data.message || "Erreur lors du chargement");
                return;
            }

            displayPodium(data.classement);
            displayClassement(data.classement);

        } catch (err) {
            showError("Impossible de contacter le serveur");
        }
    }

    function displayPodium(players) {
        const container = document.getElementById('podium-content');
        if (!players.length) return container.innerHTML = "";

        const top3 = players.slice(0,3);
        const first = top3[0] || null;
        const second = top3[1] || null;
        const third = top3[2] || null;

        let html = `<div class="podium-container">`;

        if(second){
            html += `
            <div class="podium-place second">
                <div class="podium-avatar">${second.pseudo.charAt(0).toUpperCase()}</div>
                <div class="podium-name">${escapeHtml(second.pseudo)}</div>
                <div class="podium-points">${second.score_total} pts</div>
                <div class="podium-base"></div>
            </div>`;
        }

        if(first){
            html += `
            <div class="podium-place first">
                <div class="rays"></div>
                <div class="podium-avatar">${first.pseudo.charAt(0).toUpperCase()}</div>
                <div class="podium-crown">👑</div>
                <div class="podium-name">${escapeHtml(first.pseudo)}</div>
                <div class="podium-points">${first.score_total} pts</div>
                <div class="podium-base"></div>
            </div>`;
        }

        if(third){
            html += `
            <div class="podium-place third">
                <div class="podium-avatar">${third.pseudo.charAt(0).toUpperCase()}</div>
                <div class="podium-name">${escapeHtml(third.pseudo)}</div>
                <div class="podium-points">${third.score_total} pts</div>
                <div class="podium-base"></div>
            </div>`;
        }

        html += `</div>`;
        container.innerHTML = html;
    }

    function displayClassement(players) {
        const content = document.getElementById('leaderboard-content');
        const remaining = players.slice(3);
        if (!remaining.length) return content.innerHTML = "";

        let html = "";
        remaining.forEach((player,index) => {
    html += `
    <div class="rank-card" style="animation-delay:${(index+3)*0.05}s">
        <div class="rank-left">
            <div class="rank-avatar rank-number">
                ${player.rang}
            </div>
            
            <span class="rank-name">${escapeHtml(player.pseudo)}</span>
        </div>
        <div class="rank-right">
            <span class="rank-points">${player.score_total} pts</span>
            <span class="rank-trend">${player.nb_parties} partie${player.nb_parties>1?"s":""}</span>
        </div>
    </div>`;
});

        content.innerHTML = html;
    }

    function showError(msg){
        document.getElementById('podium-content').innerHTML = `<div class="error">${escapeHtml(msg)}</div>`;
        document.getElementById('leaderboard-content').innerHTML = "";
    }

    function escapeHtml(txt){
        const div = document.createElement('div');
        div.textContent = txt;
        return div.innerHTML;
    }

    loadClassement();
    setInterval(loadClassement, 30000);
</script>

</body>
</html>