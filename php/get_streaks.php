<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

// Lecture requise : utilisateur connecté
requireLogin();
$userId = $_SESSION['user_id'] ?? null;
if (!$userId) {
    http_response_code(401);
    echo json_encode(['error' => 'Non connecté']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT DATE(date_partie) as jour FROM parties WHERE id_user = ? AND date_partie IS NOT NULL GROUP BY DATE(date_partie) ORDER BY DATE(date_partie) DESC");
    $stmt->execute([$userId]);
    $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Dates d'activité pour marquer le calendrier (format unique YYYY-MM-DD)
    $activity_dates = array_values(array_unique($rows));

    // Calculer le streak actuel (jours civils consécutifs)
    $current = 0;
    if (count($activity_dates) > 0) {
        $today = new DateTime();
        $today->setTime(0, 0, 0);
        
        $yesterday = clone $today;
        $yesterday->modify('-1 day');
        
        // Vérifier si on a joué aujourd'hui ou hier pour commencer le streak
        $lastPlayedDate = new DateTime($activity_dates[0]);
        $lastPlayedDate->setTime(0, 0, 0);
        
        if ($lastPlayedDate == $today || $lastPlayedDate == $yesterday) {
            $current = 1;
            $checkDate = clone $lastPlayedDate;
            
            // Compter les jours consécutifs
            for ($i = 1; $i < count($activity_dates); $i++) {
                $prevDate = new DateTime($activity_dates[$i]);
                $prevDate->setTime(0, 0, 0);
                
                $expectedDate = clone $checkDate;
                $expectedDate->modify('-1 day');
                
                if ($prevDate == $expectedDate) {
                    $current++;
                    $checkDate = $prevDate;
                } else {
                    break;
                }
            }
        }
    }

    // Meilleure série : trouver la plus longue suite de jours consécutifs
    $best = 0;
    if (count($activity_dates) > 0) {
        $temp = 1;
        $prevDate = new DateTime($activity_dates[0]);
        
        for ($i = 1; $i < count($activity_dates); $i++) {
            $currDate = new DateTime($activity_dates[$i]);
            $expectedDate = clone $prevDate;
            $expectedDate->modify('-1 day');
            
            if ($currDate == $expectedDate) {
                $temp++;
            } else {
                if ($temp > $best) $best = $temp;
                $temp = 1;
            }
            $prevDate = $currDate;
        }
        if ($temp > $best) $best = $temp;
    }

    header('Content-Type: application/json');
    echo json_encode([
        'current' => $current,
        'best' => $best,
        'activity_dates' => $activity_dates,
    ]);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur']);
    exit;
}
