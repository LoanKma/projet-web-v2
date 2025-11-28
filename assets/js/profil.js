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

function confirmDelete() {
  if (
    confirm(
      "⚠️ ATTENTION !\n\nÊtes-vous absolument certain de vouloir supprimer votre compte ?\n\nToutes vos données (progression, succès, statistiques) seront définitivement perdues.\n\nCette action est IRRÉVERSIBLE."
    )
  ) {
    if (confirm("Dernière confirmation : Voulez-vous vraiment continuer ?")) {
      alert(
        "✅ Votre compte a été supprimé.\n\nVous allez être redirigé vers la page d'accueil."
      );
      // Redirection ici
      window.location.href = "accueil.html";
    }
  }
}
// fonction de déconnexion avec confirmation
function confirmLogout() {
  if (confirm("👋 Êtes-vous sûr de vouloir vous déconnecter ?")) {
    alert("✅ Déconnexion réussie !\n\nÀ bientôt !");
    // Redirection ici
    window.location.href = "inscription.html";
  }
}
// header load
fetch("header.html")
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
