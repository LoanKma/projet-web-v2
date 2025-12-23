<?php
/**
 * API pour récupérer tous les utilisateurs (admin uniquement)
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
    // Récupérer tous les utilisateurs avec leurs statistiques
    $stmt = $pdo->prepare("
        SELECT 
            u.id_user,
            u.pseudo,
            u.email,
            u.role,
            u.date_creation,
            u.score_total,
            COALESCE(COUNT(p.id_partie), 0) as parties_jouees,
            COALESCE(MAX(p.score_obtenu), 0) as meilleur_score
        FROM utilisateurs u
        LEFT JOIN parties p ON u.id_user = p.id_user
        GROUP BY u.id_user
        ORDER BY u.date_creation DESC
    ");
    
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Formater les données
    $formattedUsers = [];
    foreach ($users as $user) {
        $formattedUsers[] = [
            'id' => $user['id_user'],
            'pseudo' => $user['pseudo'],
            'email' => $user['email'],
            'role' => $user['role'],
            'date_creation' => date('d M Y', strtotime($user['date_creation'])),
            'score_total' => $user['score_total'] ?? 0,
            'parties_jouees' => $user['parties_jouees'],
            'meilleur_score' => $user['meilleur_score'],
            'statut' => 'Actif' // Vous pouvez ajouter une colonne statut dans votre BDD si besoin
        ];
    }
    
    echo json_encode([
        'success' => true,
        'users' => $formattedUsers
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur lors de la récupération des utilisateurs'
    ]);
}
?>