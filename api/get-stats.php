<?php
/**
 * API pour récupérer les statistiques globales (admin uniquement)
 */

require_once __DIR__ . '/../php/db.php';
require_once __DIR__ . '/../php/auth.php';

header('Content-Type: application/json');

// Vérifier que l'utilisateur est admin
if (!isAdmin()) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'Accès refusé. Vous devez être administrateur.'
    ]);
    exit;
}

try {
    // Nombre total d'utilisateurs
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM utilisateurs");
    $totalUsers = $stmt->fetch()['total'];
    
    // Nombre total de parties jouées
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM parties");
    $totalParties = $stmt->fetch()['total'];
    
    // Score total de tous les joueurs
    $stmt = $pdo->query("SELECT COALESCE(SUM(score_total), 0) as total FROM utilisateurs");
    $totalScore = $stmt->fetch()['total'];
    
    // Croissance du mois (nouveaux utilisateurs ce mois-ci vs mois dernier)
    $stmt = $pdo->query("
        SELECT 
            COUNT(*) as ce_mois
        FROM utilisateurs 
        WHERE MONTH(date_creation) = MONTH(CURRENT_DATE())
        AND YEAR(date_creation) = YEAR(CURRENT_DATE())
    ");
    $newUsersCeMois = $stmt->fetch()['ce_mois'];
    
    $stmt = $pdo->query("
        SELECT 
            COUNT(*) as mois_dernier
        FROM utilisateurs 
        WHERE MONTH(date_creation) = MONTH(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))
        AND YEAR(date_creation) = YEAR(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))
    ");
    $newUsersMoisDernier = $stmt->fetch()['mois_dernier'];
    
    // Calculer le pourcentage de croissance
    $croissance = 0;
    if ($newUsersMoisDernier > 0) {
        $croissance = round((($newUsersCeMois - $newUsersMoisDernier) / $newUsersMoisDernier) * 100);
    } elseif ($newUsersCeMois > 0) {
        $croissance = 100;
    }
    
    echo json_encode([
        'success' => true,
        'stats' => [
            'total_users' => $totalUsers,
            'total_parties' => $totalParties,
            'total_score' => $totalScore,
            'croissance' => ($croissance >= 0 ? '+' : '') . $croissance . '%'
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur lors de la récupération des statistiques'
    ]);
}
?>