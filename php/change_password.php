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

$current = $_POST['current_password'] ?? '';
$new = $_POST['new_password'] ?? '';
$confirm = $_POST['confirm_password'] ?? '';

if (empty($current) || empty($new) || empty($confirm)) {
    header('Location: ../profil.php?error=' . urlencode('Tous les champs sont requis.'));
    exit;
}


if ($current === $new) {
    header('Location: ../profil.php?error=' . urlencode('Le nouveau mot de passe doit être différent de l\'actuel.'));
    exit;
}

if (strlen($new) < 6) {
    header('Location: ../profil.php?error=' . urlencode('Le nouveau mot de passe doit contenir au moins 6 caractères.'));
    exit;
}

if ($new !== $confirm) {
    header('Location: ../profil.php?error=' . urlencode('Les mots de passe ne correspondent pas.'));
    exit;
}

// Récupérer le mot de passe actuel
$stmt = $pdo->prepare('SELECT mot_de_passe FROM utilisateurs WHERE id_user = ?');
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();

if (!$user || !password_verify($current, $user['mot_de_passe'])) {
    header('Location: ../profil.php?error=' . urlencode('Mot de passe actuel incorrect.'));
    exit;
}

$hashed = password_hash($new, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('UPDATE utilisateurs SET mot_de_passe = ? WHERE id_user = ?');
try {
    $stmt->execute([$hashed, $_SESSION['user_id']]);
    header('Location: ../profil.php?password_changed=1');
    exit;
} catch (PDOException $e) {
    header('Location: ../profil.php?error=' . urlencode('Erreur lors de la mise à jour du mot de passe.'));
    exit;
}

?>
