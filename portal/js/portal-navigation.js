async function loadAuthorPortalShell(activePage = "") {
  const sidebar = document.getElementById("mateMasieSidebar");
  const topbar = document.getElementById("mateMasieTopbar");

  sidebar.innerHTML = `
    <aside class="mm-sidebar">
      <div class="mm-brand">
        <div>
          <strong>Author Portal</strong>
          <span>The BLK Shelf</span>
        </div>
      </div>

      <nav class="mm-nav">
  <a class="${activePage === "dashboard" ? "active" : ""}" href="index.html">Dashboard</a>
  <a class="${activePage === "profiles" ? "active" : ""}" href="profiles.html">My Profiles</a>
  <a class="${activePage === "books" ? "active" : ""}" href="my-books.html">My Books</a>
  <a class="${activePage === "submit-book" ? "active" : ""}" href="submit-book.html">Submit Book</a>
  <a class="${activePage === "account" ? "active" : ""}" href="account.html">Account</a>
</nav>
    </aside>
  `;

  topbar.innerHTML = `
    <header class="mm-topbar">
      <div>
        <span class="mm-muted">Author self-service</span>
      </div>

      <button class="mm-btn mm-btn-secondary" id="portalLogoutButton" type="button">
        Log Out
      </button>
    </header>
  `;

  document.getElementById("portalLogoutButton").addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "../login.html";
  });
}

function setPortalTopbarUser(user, account) {
  const topbar = document.getElementById("mateMasieTopbar");
  if (!topbar) return;

  topbar.querySelector(".mm-muted").textContent =
    account?.email || user?.email || "Author Portal";
}