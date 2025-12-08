<?php
session_start();
require_once 'db.php';

header('Content-Type: application/json');

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['id_user'])) {
    echo json_encode(['success' => false, 'message' => 'Non connecté']);
    exit;
}

$id_user = $_SESSION['id_user'];

try {
    // 1️⃣ Récupérer le TOP 20
    $sqlTop20 = "
        SELECT 
            u.id_user,
            u.pseudo,
            u.score_total,
            COUNT(p.id_partie) AS nb_parties
        FROM utilisateurs u
        LEFT JOIN parties p ON u.id_user = p.id_user
        GROUP BY u.id_user, u.pseudo, u.score_total
        ORDER BY u.score_total DESC
        LIMIT 20
    ";
    $stmt = $pdo->query($sqlTop20);
    $top20 = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Ajouter le rang dans le top 20 (gestion égalité)
    $rang = 1;
    $previous_score = null;
    foreach ($top20 as $index => $player) {
        if ($previous_score !== null && $player['score_total'] < $previous_score) {
            $rang = $index + 1;
        }
        $top20[$index]['rang'] = $rang;
        $previous_score = $player['score_total'];
    }

    // 2️⃣ Récupérer les infos de l'utilisateur
    $sqlUser = "SELECT id_user, pseudo, score_total FROM utilisateurs WHERE id_user = :id_user";
    $stmtUser = $pdo->prepare($sqlUser);
    $stmtUser->execute(['id_user' => $id_user]);
    $user = $stmtUser->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Utilisateur introuvable']);
        exit;
    }

    // 3️⃣ Calculer la position de l'utilisateur dans le classement
    $sqlPosition = "
        SELECT COUNT(*) + 1 AS rang
        FROM utilisateurs
        WHERE score_total > :score
    ";
    $stmtPos = $pdo->prepare($sqlPosition);
    $stmtPos->execute(['score' => $user['score_total']]);
    $position = $stmtPos->fetch(PDO::FETCH_ASSOC);

    $user['rang'] = $position['rang'];

    // 4️⃣ Vérifier si l'utilisateur est dans le top 20
    $user_in_top20 = array_search($id_user, array_column($top20, 'id_user')) !== false;

    echo json_encode([
        'success' => true,
        'top20' => $top20,
        'user_position' => $user,
        'user_in_top20' => $user_in_top20
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => "Erreur : " . $e->getMessage()
    ]);
}
?>