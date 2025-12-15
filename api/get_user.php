<?php
// api/get_user.php
session_start();
header('Content-Type: application/json');

// Si connecté, on renvoie l'ID. Sinon "guest".
$userId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 'guest';

echo json_encode(['userId' => $userId]);
exit;
?>