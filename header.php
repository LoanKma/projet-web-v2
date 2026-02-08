<?php
if (substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip'))
    ob_start("ob_gzhandler");
else
    ob_start();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/php/auth.php';

$pseudo = isset($_SESSION['pseudo']) ? htmlspecialchars($_SESSION['pseudo'], ENT_QUOTES, 'UTF-8') : null;
$isAdmin = isAdmin();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/header.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <title> Jeux de Lettres</title>
</head>
<body>

<header class="header">
  <div class="logo">
    <div class="logo-icon"><a href="index.php">L</a></div>
    <span>Letterix</span>
  </div>
  <nav class="nav">
    <div class="nav-item">
      <span><i class="fa-solid fa-ranking-star"></i></span>
      <span><a href="classement.php">Classements</a></span>
    </div>
    <div class="nav-item">
      <span><i class="fa-solid fa-calendar-days"></i></span>
      <span><a href="calendrier.php">Calendrier</a></span>
    </div>
    <?php if ($isAdmin): ?>
    <div class="nav-item">
      <span><i class="fa-solid fa-user-shield"></i></span>
      <span><a href="panel-admin.php">Panel Admin</a></span>
    </div>
    <?php endif; ?>
    <div class="user-section">
      <div class="user-avatar"><i class="fa-solid fa-circle-user"></i></div>
      <?php if ($pseudo): ?>
        <span><a href="profil.php"><?php echo $pseudo; ?></a></span>
      <?php else: ?>
        <span><a href="inscription.php">Se connecter</a></span>
      <?php endif; ?>
    </div>
  </nav>
</header>
</body>
</html>