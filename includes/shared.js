(function initializeSharedNavigation() {
  function closeAllMenus(exceptMenu = null) {
    document
      .querySelectorAll(
        ".nav-dropdown[open], .mobile-more-menu[open]"
      )
      .forEach(menu => {
        if (menu !== exceptMenu) {
          menu.removeAttribute("open");
        }
      });
  }

  document.addEventListener("click", event => {
    const clickedSummary = event.target.closest(
      ".nav-dropdown > summary, .mobile-more-menu > summary"
    );

    if (clickedSummary) {
      const clickedMenu = clickedSummary.parentElement;

      closeAllMenus(clickedMenu);
      return;
    }

    const clickedMenuLink = event.target.closest(
      ".dropdown-menu a, .mobile-more-links a"
    );

    if (clickedMenuLink) {
      closeAllMenus();
      return;
    }

    const clickedInsideMenu = event.target.closest(
      ".nav-dropdown, .mobile-more-menu"
    );

    if (!clickedInsideMenu) {
      closeAllMenus();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeAllMenus();
    }
  });
})();
