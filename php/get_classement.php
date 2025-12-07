<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Non connecté']);
    exit;
}

$id_user = $_SESSION['user_id'];

try {
    // 1. Récupération du TOP 20
    $sql_top = "SELECT 
                    u.id_user,
                    u.pseudo,
                    u.score_total,
                    COUNT(DISTINCT p.id_partie) as nb_parties,
                    RANK() OVER (ORDER BY u.score_total DESC) as rang
                FROM utilisateurs u
                LEFT JOIN parties p ON u.id_user = p.id_user
                GROUP BY u.id_user, u.pseudo, u.score_total
                ORDER BY u.score_total DESC
                LIMIT 20";
    
    $stmt_top = $pdo->query($sql_top);
    $top20 = $stmt_top->fetchAll(PDO::FETCH_ASSOC);
    
    // 2. Récupération de la position de l'utilisateur connecté
    $sql_user = "SELECT 
                    u.id_user,
                    u.pseudo,
                    u.score_total,
                    COUNT(DISTINCT p.id_partie) as nb_parties,
                    (SELECT COUNT(*) + 1 
                     FROM utilisateurs u2 
                     WHERE u2.score_total > u.score_total) as rang
                FROM utilisateurs u
                LEFT JOIN parties p ON u.id_user = p.id_user
                WHERE u.id_user = :uid
                GROUP BY u.id_user, u.pseudo, u.score_total";
    
    $stmt_user = $pdo->prepare($sql_user);
    $stmt_user->execute([':uid' => $id_user]);
    $user_position = $stmt_user->fetch(PDO::FETCH_ASSOC);
    
    // 3. Vérifier si l'utilisateur est dans le top 20
    $user_in_top20 = false;
    foreach ($top20 as $player) {
        if ($player['id_user'] == $id_user) {
            $user_in_top20 = true;
            break;
        }
    }
    
    echo json_encode([
        'success' => true,
        'top20' => $top20,
        'user_position' => $user_position,
        'user_in_top20' => $user_in_top20
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur lors de la récupération du classement'
    ]);
}
?>