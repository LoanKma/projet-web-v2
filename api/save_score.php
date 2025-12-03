<?php
session_start();
header('Content-Type: application/json');

// Connexion BDD (Avec le bon chemin qu'on a trouvé !)
require_once '../php/db.php'; 

// Vérification connexion
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Non connecté']);
    exit;
}

// Récupération des données
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$id_user = $_SESSION['user_id'];
$nom_jeu = $data['jeu'] ?? 'inconnu';
$score = (int)($data['score'] ?? 0);
$temps = (int)($data['temps'] ?? 0);
$niveau = (int)($data['niveau'] ?? 1);
$diff = $data['difficulte'] ?? 'easy';

try {
    // 1. Récupération ID JEU
    $id_jeu = ($nom_jeu === 'motus') ? 1 : 2;
    
    // 2. Mapping difficulté
    if ($id_jeu === 1) { // Motus
        $id_diff = ($diff == 'medium') ? 2 : (($diff == 'hard') ? 3 : 1);
    } else { // Mots Mêlés
        $id_diff = ($diff == 'medium') ? 5 : (($diff == 'hard') ? 6 : 4);
    }

    // 3. Insertion Historique
    $sql = "INSERT INTO parties (id_user, id_jeu, id_niveau, numero_niveau, score_obtenu, temps_passe, date_partie) 
            VALUES (:uid, :jid, :did, :num, :score, :temps, NOW())";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':uid' => $id_user,
        ':jid' => $id_jeu,
        ':did' => $id_diff,
        ':num' => $niveau,
        ':score' => $score,
        ':temps' => $temps
    ]);

    // 4. Mise à jour Score Total
    $sql_update = "UPDATE utilisateurs SET score_total = score_total + :score WHERE id_user = :uid";
    $pdo->prepare($sql_update)->execute([':score' => $score, ':uid' => $id_user]);

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    // En production, on évite d'afficher les erreurs SQL précises aux utilisateurs
    echo json_encode(['success' => false, 'message' => "Erreur sauvegarde"]);
}
?>