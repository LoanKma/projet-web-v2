<?php
/**
 * API pour changer le rôle d'un utilisateur (admin uniquement)
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

// Récupérer les données JSON
$input = json_decode(file_get_contents('php://input'), true);

$userId = $input['userId'] ?? null;
$newRole = $input['newRole'] ?? null;

// Validation
if (!$userId || !$newRole) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Données manquantes'
    ]);
    exit;
}

// Vérifier que le rôle est valide
if (!in_array($newRole, ['joueur', 'admin'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Rôle invalide'
    ]);
    exit;
}

// Empêcher l'admin de se retirer ses propres droits
if ($userId == $_SESSION['user_id'] && $newRole !== 'admin') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Vous ne pouvez pas retirer vos propres droits d\'administrateur'
    ]);
    exit;
}

try {
    // Mettre à jour le rôle
    $stmt = $pdo->prepare("UPDATE utilisateurs SET role = ? WHERE id_user = ?");
    $stmt->execute([$newRole, $userId]);
    
    if ($stmt->rowCount() > 0) {
        // Récupérer le pseudo de l'utilisateur
        $stmt = $pdo->prepare("SELECT pseudo FROM utilisateurs WHERE id_user = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        echo json_encode([
            'success' => true,
            'message' => "Le rôle de {$user['pseudo']} a été changé en {$newRole} avec succès"
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Utilisateur non trouvé'
        ]);
    }
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur lors du changement de rôle'
    ]);
}
?>