async function loadMateMasieShell(activePage = "") {
  const sidebarTarget = document.getElementById("mateMasieSidebar");
  const topbarTarget = document.getElementById("mateMasieTopbar");

  if (sidebarTarget) {
    const sidebar = await fetch("includes/sidebar.html");
    sidebarTarget.innerHTML = await sidebar.text();
  }

  if (topbarTarget) {
    const topbar = await fetch("includes/topbar.html");
    topbarTarget.innerHTML = await topbar.text();
  }

  document.querySelectorAll("[data-page]").forEach(link => {
    if (link.dataset.page === activePage) {
      link.classList.add("active");
    }
  });

  const signOutButton = document.getElementById("signOutButton");
  if (signOutButton) {
    signOutButton.addEventListener("click", signOutAdmin);
  }
}

function setTopbarUser(user, profile) {
  const greeting = document.getElementById("topbarGreeting");
  const email = document.getElementById("topbarEmail");

  const displayName = profile?.full_name || user?.email || "Steward";

  if (greeting) {
    greeting.textContent = `Welcome back, ${displayName}.`;
  }

  if (email) {
    email.textContent = user?.email || "";
  }
}