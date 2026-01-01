<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/php/auth.php';

$pseudo = isset($_SESSION['pseudo']) ? htmlspecialchars($_SESSION['pseudo'], ENT_QUOTES, 'UTF-8') : null;
$isAdmin = isAdmin();
?>
<style>
  .header {
    padding: 30px 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.5);
    border-bottom: 1px solid rgba(14, 165, 233, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 20px;
    font-weight: 500;
  }

  .logo-icon {
    width: 40px;
    height: 40px;
    background: #2563eb;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 20px;
    transition: all 0.3s;
  }
  .logo-icon:hover {
    transform: scale(1.2);
  }
  .logo-span {
    color: white;
    font-weight: 700;
    font-size: 30px;
  }
  .logo-icon a {
    color: white;
    text-decoration: none;
  }

  .nav {
    display: flex;
    gap: 30px;
    align-items: center;
  }
  .nav a {
    text-decoration: none;
    color: #ffffff;
    font-size: 16px;
    transition: opacity 0.4s;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: opacity 0.4s;
  }

  .nav-item:hover {
    opacity: 0.8;
  }
  .user-section {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 20px;
    background: rgba(14, 165, 233, 0.1);
    border-radius: 12px;
    border: 1px solid rgba(14, 165, 233, 0.3);
    cursor: pointer;
    transition: all 0.3s;
  }

  .user-section:hover {
    background: rgba(14, 165, 233, 0.2);
    border-color: rgba(14, 165, 233, 0.5);
  }
  .user-avatar {
    font-size: 30px;
    color: #2563eb;
  }
  /* Responsive */
  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      gap: 20px;
      padding: 20px 30px;
    }
    .nav {
      gap: 20px;
    }
  }
</style>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/classement.css" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />
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