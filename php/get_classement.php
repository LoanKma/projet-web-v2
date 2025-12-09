<?php
require_once 'db.php';

header('Content-Type: application/json');

try {
    // Récupérer TOUS les utilisateurs triés par score décroissant
    $sql = "
        SELECT 
            u.id_user,
            u.pseudo,
            u.score_total,
            COUNT(p.id_partie) AS nb_parties
        FROM utilisateurs u
        LEFT JOIN parties p ON u.id_user = p.id_user
        GROUP BY u.id_user, u.pseudo, u.score_total
        ORDER BY u.score_total DESC
    ";
    $stmt = $pdo->query($sql);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Ajouter le rang (gestion égalités)
    $rang = 1;
    $previous_score = null;

    foreach ($users as $index => $player) {
        if ($previous_score !== null && $player['score_total'] < $previous_score) {
            $rang = $index + 1;
        }
        $users[$index]['rang'] = $rang;
        $previous_score = $player['score_total'];
    }

    echo json_encode([
        'success' => true,
        'classement' => $users
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => "Erreur : " . $e->getMessage()
    ]);
}
?>