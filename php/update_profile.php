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

$pseudo = cleanInput($_POST['pseudo'] ?? '');
$email = cleanInput($_POST['email'] ?? '');

$errors = [];
if (strlen($pseudo) < 3) $errors[] = 'Le pseudo doit contenir au moins 3 caractères.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Email invalide.';

if (!empty($errors)) {
    header('Location: ../profil.php?error=' . urlencode(implode(' ', $errors)));
    exit;
}

// Vérifier conflit
$stmt = $pdo->prepare('SELECT id_user FROM utilisateurs WHERE (pseudo = ? OR email = ?) AND id_user != ?');
$stmt->execute([$pseudo, $email, $_SESSION['user_id']]);
if ($stmt->fetch()) {
    header('Location: ../profil.php?error=' . urlencode('Ce pseudo ou cet email est déjà utilisé.'));
    exit;
}

// Mettre à jour
$stmt = $pdo->prepare('UPDATE utilisateurs SET pseudo = ?, email = ? WHERE id_user = ?');
try {
    $stmt->execute([$pseudo, $email, $_SESSION['user_id']]);
    $_SESSION['pseudo'] = $pseudo;
    $_SESSION['email'] = $email;
    header('Location: ../profil.php?updated=1');
    exit;
} catch (PDOException $e) {
    header('Location: ../profil.php?error=' . urlencode('Erreur lors de la mise à jour.'));
    exit;
}

?>
