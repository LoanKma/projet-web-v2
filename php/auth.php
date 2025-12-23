<?php
require_once __DIR__ . '/db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Inscription
 */
function register($pseudo, $email, $password) {
    global $pdo;
    
    $errors = [];
    
    if (strlen($pseudo) < 3) {
        $errors[] = "Le pseudo doit contenir au moins 3 caractères";
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Email invalide";
    }
    
    if (strlen($password) < 6) {
        $errors[] = "Le mot de passe doit contenir au moins 6 caractères";
    }
    
    if (!empty($errors)) {
        return ['success' => false, 'errors' => $errors];
    }
    
    $stmt = $pdo->prepare("SELECT id_user FROM utilisateurs WHERE pseudo = ? OR email = ?");
    $stmt->execute([$pseudo, $email]);
    
    if ($stmt->fetch()) {
        return ['success' => false, 'errors' => ["Ce pseudo ou cet email est déjà utilisé"]];
    }
    
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    try {
        $stmt = $pdo->prepare(
            "INSERT INTO utilisateurs (pseudo, email, mot_de_passe, role, date_creation) VALUES (?, ?, ?, 'joueur', NOW())"
        );
        $stmt->execute([$pseudo, $email, $hashedPassword]);
        
        return ['success' => true, 'message' => "Compte créé avec succès !"];
    } catch (PDOException $e) {
        return ['success' => false, 'errors' => ["Erreur lors de la création du compte"]];
    }
}

/**
 * Connexion
 */
function login($identifier, $password) {
    global $pdo;
    
    $stmt = $pdo->prepare(
        "SELECT * FROM utilisateurs WHERE pseudo = ? OR email = ?"
    );
    $stmt->execute([$identifier, $identifier]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['mot_de_passe'])) {
        $_SESSION['user_id'] = $user['id_user'];
        $_SESSION['pseudo'] = $user['pseudo'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['logged_in'] = true;
        
        session_regenerate_id(true);
        
        return ['success' => true, 'message' => "Connexion réussie !"];
    }
    
    return ['success' => false, 'errors' => ["Identifiants incorrects"]];
}

/**
 * Déconnexion
 */
function logout() {
    session_start();
    session_unset();
    session_destroy();
    
    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time() - 3600, '/');
    }
}

/**
 * Vérifier si connecté
 */
function isLoggedIn() {
    return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
}

/**
 * Vérifier si admin
 */
function isAdmin() {
    return isLoggedIn() && isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

/**
 * Protéger une page
 */
function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: inscription.php');
        exit;
    }
}

/**
 * Protéger une page admin
 */
function requireAdmin() {
    if (!isLoggedIn()) {
        header('Location: inscription.php');
        exit;
    }
    
    if (!isAdmin()) {
        http_response_code(403);
        die("Accès refusé. Vous devez être administrateur pour accéder à cette page.");
    }
}

/**
 * Token CSRF
 */
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Nettoyer les données
 */
function cleanInput($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}
?>