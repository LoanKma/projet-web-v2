<?php
session_start();
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
    $stmt = $pdo->prepare("SELECT date_partie FROM parties WHERE id_user = ? AND date_partie IS NOT NULL ORDER BY date_partie DESC");
    $stmt->execute([$userId]);
    $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Conversion en timestamps Unix (ordre décroissant)
    $timestamps = array_map(function ($d) {
        return strtotime($d);
    }, $rows);

    // Construire des "buckets" : un bucket représente une période séparée du précédent par > 24h
    $buckets = [];
    foreach ($timestamps as $ts) {
        if (empty($buckets)) {
            $buckets[] = $ts;
            continue;
        }
        $last = $buckets[count($buckets) - 1];
        if (($last - $ts) > 86400) {
            // plus de 24 heures depuis le dernier bucket -> nouveau bucket
            $buckets[] = $ts;
        }
        // sinon ignorer (même fenêtre de 24h que le dernier bucket)
    }

    // Série actuelle (fenêtre glissante 24h) : commence seulement si le dernier bucket est dans les dernières 24h
    $now = time();
    $current = 0;
    if (count($buckets) > 0 && ($now - $buckets[0]) <= 86400) {
        $current = 1;
        for ($i = 1; $i < count($buckets); $i++) {
            if (($buckets[$i - 1] - $buckets[$i]) <= 86400) {
                $current++;
            } else {
                break;
            }
        }
    }

    // Meilleure série : trouver la plus longue suite de buckets consécutifs séparés par <=24h
    $best = 0;
    if (count($buckets) > 0) {
        $temp = 1;
        for ($i = 1; $i < count($buckets); $i++) {
            if (($buckets[$i - 1] - $buckets[$i]) <= 86400) {
                $temp++;
            } else {
                if ($temp > $best) $best = $temp;
                $temp = 1;
            }
        }
        if ($temp > $best) $best = $temp;
    }

    // Dates d'activité pour marquer le calendrier (format unique YYYY-MM-DD)
    $activity_dates = [];
    foreach ($rows as $d) {
        $dt = new DateTime($d);
        $activity_dates[] = $dt->format('Y-m-d');
    }
    $activity_dates = array_values(array_unique($activity_dates));

    header('Content-Type: application/json');
    echo json_encode([
        'current' => $current,
        'best' => $best,
        'activity_dates' => $activity_dates,
        'buckets_count' => count($buckets),
    ]);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur']);
    exit;
}
