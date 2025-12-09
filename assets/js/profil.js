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

let currentFormId = "";

const confirmMessages = {
  profile: {
    title: "Modifier le profil",
    message:
      "Êtes-vous sûr de vouloir sauvegarder ces modifications à votre profil ?",
    icon: "fa-user-edit",
    iconClass: "info",
    buttonClass: "",
  },
  password: {
    title: "Changer le mot de passe",
    message: "Êtes-vous sûr de vouloir modifier votre mot de passe ?",
    icon: "fa-key",
    iconClass: "warning",
    buttonClass: "",
  },
  logout: {
    title: "Se déconnecter",
    message:
      "Êtes-vous sûr de vouloir vous déconnecter ? Vous serez redirigé vers la page de connexion.",
    icon: "fa-sign-out-alt",
    iconClass: "info",
    buttonClass: "",
  },
  delete: {
    title: "Supprimer le compte",
    message:
      "⚠️ ATTENTION : Cette action est irréversible ! Toutes vos données seront définitivement supprimées. Êtes-vous absolument certain de vouloir supprimer votre compte ?",
    icon: "fa-exclamation-triangle",
    iconClass: "danger",
    buttonClass: "danger",
  },
};

function showConfirmModal(formType) {
  const config = confirmMessages[formType];
  const modal = document.getElementById("confirmModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalIcon = document.getElementById("modalIcon");
  const confirmButton = document.getElementById("confirmButton");

  // Configuration du modal
  modalTitle.textContent = config.title;
  modalMessage.textContent = config.message;
  modalIcon.className = `fas ${config.icon} ${config.iconClass}`;

  // Configuration du bouton de confirmation
  confirmButton.className = `modal-btn confirm-btn ${config.buttonClass}`;
  confirmButton.onclick = () => confirmAction(formType);

  // Stockage du form ID
  currentFormId = formType + "Form";

  // Affichage du modal
  modal.style.display = "block";
}

function closeConfirmModal() {
  const modal = document.getElementById("confirmModal");
  modal.style.display = "none";
  currentFormId = "";
}

function confirmAction(formType) {
  const form = document.getElementById(currentFormId);
  if (form) {
    form.submit();
  }
  closeConfirmModal();
}

// Fermeture du modal en cliquant à l'extérieur
window.onclick = function (event) {
  const modal = document.getElementById("confirmModal");
  if (event.target === modal) {
    closeConfirmModal();
  }
};

// Fermeture avec la touche Echap
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeConfirmModal();
  }
});
