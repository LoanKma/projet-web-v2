<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

requireLogin();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

$token = $_POST['csrf_token'] ?? '';
if (!verifyCSRFToken($token)) {
    echo json_encode(['success' => false, 'message' => 'Token CSRF invalide']);
    exit;
}

$password = $_POST['password'] ?? '';
if (!$password) {
    echo json_encode(['success' => false, 'message' => 'Mot de passe requis']);
    exit;
}

$userId = $_SESSION['user_id'];

// Récupérer le mot de passe hashé de l'utilisateur
$stmt = $pdo->prepare('SELECT mot_de_passe FROM utilisateurs WHERE id_user = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['mot_de_passe'])) {
    echo json_encode(['success' => false, 'message' => 'Mot de passe incorrect']);
    exit;
}

// Supprimer l'utilisateur
$stmt = $pdo->prepare('DELETE FROM utilisateurs WHERE id_user = ?');
try {
    $stmt->execute([$userId]);
    logout();
    echo json_encode(['success' => true, 'message' => 'Compte supprimé avec succès']);
    exit;
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la suppression']);
    exit;
}
?>
