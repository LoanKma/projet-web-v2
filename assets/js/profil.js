function switchTab(tabName) {
  // Cacher tous les contenus
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  // Désactiver tous les tabs
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Activer le tab cliqué
  document.getElementById(tabName).classList.add("active");
  event.target.closest(".tab").classList.add("active");
}

// Les actions de confirmation (suppression, déconnexion) sont gérées
// plus bas via des popups réutilisables (`showPopup` / `showConfirmPopup`).
// header load
fetch("header.php")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header-placeholder").innerHTML = data;
  });
// footer load
fetch("footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer-placeholder").innerHTML = data;
  });
// Popup functions

function showPopup(title, message, confirmAction) {
  document.getElementById("popupTitle").innerText = title;
  document.getElementById("popupMessage").innerText = message;

  const confirmBtn = document.getElementById("popupConfirmBtn");
  confirmBtn.onclick = confirmAction;

  document.getElementById("popupConfirm").style.display = "flex";
}

function closePopup() {
  document.getElementById("popupConfirm").style.display = "none";
}

function saveAccountInfo() {
  showPopup(
    "Sauvegarder les modifications",
    "Voulez-vous sauvegarder les modifications apportées à votre compte ?",
    () => {
      closePopup();
    }
  );
}

function confirmChange() {
  showPopup(
    "Modifier le mot de passe",
    "Voulez-vous vraiment modifier votre mot de passe ?",
    () => {
      closePopup();
    }
  );
}

function confirmLogout() {
  showPopup("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", () => {
    window.location.href = "inscription.html";
  });
}

function confirmDelete() {
  showPopup(
    "Supprimer le compte",
    "⚠️ Cette action est définitive. Êtes-vous sûr ?",
    () => {
      window.location.href = "accueil.html";
    }
  );
}
