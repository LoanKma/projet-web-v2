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
