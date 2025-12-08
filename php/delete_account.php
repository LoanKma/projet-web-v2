<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../profil.php');
    exit;
}

$token = $_POST['csrf_token'] ?? '';
if (!verifyCSRFToken($token)) {
    header('Location: ../profil.php?error=' . urlencode('Token invalide'));
    exit;
}

$userId = $_SESSION['user_id'];

// Supprimer l'utilisateur
$stmt = $pdo->prepare('DELETE FROM utilisateurs WHERE id_user = ?');
try {
    $stmt->execute([$userId]);
    logout();
    header('Location: ../inscription.php?deleted=1');
    exit;
} catch (PDOException $e) {
    header('Location: ../profil.php?error=' . urlencode('Erreur lors de la suppression du compte.'));
    exit;
}

?>
