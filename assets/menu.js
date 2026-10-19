document.addEventListener("DOMContentLoaded", function() {
  const dropdownIcons = document.querySelectorAll(".navbar-nav-canvas .bi-chevron-down");

  dropdownIcons.forEach(icon => {
    icon.addEventListener("click", function(event) {
      event.preventDefault();

      const dropdownMenu = icon.closest("li").querySelector("ul");

      if (!dropdownMenu) return;

      const isMenuOpen = dropdownMenu.classList.contains("show");

      if (isMenuOpen) {
        dropdownMenu.style.height = "0";
        dropdownMenu.classList.remove("show");
      } else {
        dropdownMenu.style.height = dropdownMenu.scrollHeight + "px";
        dropdownMenu.classList.add("show");
      }
    });
  });

  document.querySelectorAll(".site-nav--has-dropdown ul").forEach(menu => {
    menu.addEventListener("transitionend", () => {
      if (menu.classList.contains("show")) {
        menu.style.height = "auto";
      }
    });
  });


});
