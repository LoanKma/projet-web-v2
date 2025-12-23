<?php
/**
 * API pour supprimer un utilisateur (admin uniquement)
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

// Validation
if (!$userId) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'ID utilisateur manquant'
    ]);
    exit;
}

// Empêcher l'admin de se supprimer lui-même
if ($userId == $_SESSION['user_id']) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Vous ne pouvez pas supprimer votre propre compte'
    ]);
    exit;
}

try {
    // Récupérer le pseudo avant suppression
    $stmt = $pdo->prepare("SELECT pseudo FROM utilisateurs WHERE id_user = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    
    if (!$user) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Utilisateur non trouvé'
        ]);
        exit;
    }
    
    // Supprimer d'abord les parties de l'utilisateur (contrainte de clé étrangère)
    $stmt = $pdo->prepare("DELETE FROM parties WHERE id_user = ?");
    $stmt->execute([$userId]);
    
    // Supprimer l'utilisateur
    $stmt = $pdo->prepare("DELETE FROM utilisateurs WHERE id_user = ?");
    $stmt->execute([$userId]);
    
    echo json_encode([
        'success' => true,
        'message' => "Le compte de {$user['pseudo']} a été supprimé avec succès"
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur lors de la suppression de l\'utilisateur'
    ]);
}
?>