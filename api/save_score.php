<?php
session_start();
header('Content-Type: application/json');

// 1. Connexion à la base de données
// Assurez-vous que le chemin vers db.php est correct
require_once '../config/db.php'; 

// 2. Vérifier si le joueur est connecté
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Utilisateur non connecté']);
    exit;
}

// 3. Récupérer les données envoyées par le JS
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Données invalides']);
    exit;
}

$id_user = $_SESSION['user_id'];
$nom_jeu = $data['jeu'];           // "motus" ou "mots_meles"
$score = (int)$data['score'];
$temps = (int)$data['temps'];
$niveau_num = (int)$data['niveau'];
$difficulte_str = $data['difficulte']; // "easy", "medium", "hard"

try {
    // A. Trouver l'ID du jeu
    // On cherche "motus" ou "mots" (pour mots mêlés)
    $stmt = $pdo->prepare("SELECT id_jeu FROM jeu WHERE nom_jeu LIKE ? LIMIT 1");
    $search = ($nom_jeu === 'motus') ? '%motus%' : '%mots%';
    $stmt->execute([$search]);
    $jeu = $stmt->fetch();
    $id_jeu = $jeu ? $jeu['id_jeu'] : 1; // Fallback à 1 si non trouvé

    // B. Trouver l'ID de la difficulté
    // Mapping : JS ("easy") -> BDD ("Facile" ou autre)
    $stmt = $pdo->prepare("SELECT id_difficulte FROM difficultes WHERE id_jeu = ? AND (nom_difficulte LIKE ? OR description LIKE ?) LIMIT 1");
    // On cherche si "easy" est dans le nom ou si on trouve "Facile"
    $term_fr = ($difficulte_str == 'easy') ? 'Facile' : (($difficulte_str == 'medium') ? 'Moyen' : 'Difficile');
    $stmt->execute([$id_jeu, "%$term_fr%", "%$difficulte_str%"]);
    $diff = $stmt->fetch();
    $id_difficulte = $diff ? $diff['id_difficulte'] : 1;

    // C. Insérer la partie dans l'historique
    $sql_insert = "INSERT INTO parties (id_user, id_jeu, id_niveau, numero_niveau, score_obtenu, temps_passe, date_partie) 
                   VALUES (:uid, :jid, :did, :num, :score, :temps, NOW())";
    $stmt = $pdo->prepare($sql_insert);
    $stmt->execute([
        ':uid' => $id_user,
        ':jid' => $id_jeu,
        ':did' => $id_difficulte,
        ':num' => $niveau_num,
        ':score' => $score,
        ':temps' => $temps
    ]);

    // D. Mettre à jour le score TOTAL du joueur (pour le classement)
    $sql_update = "UPDATE utilisateurs SET score_total = score_total + :points WHERE id_user = :uid";
    $stmt = $pdo->prepare($sql_update);
    $stmt->execute([':points' => $score, ':uid' => $id_user]);

    echo json_encode(['success' => true, 'message' => 'Score enregistré et classement mis à jour']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur SQL : ' . $e->getMessage()]);
}
?>