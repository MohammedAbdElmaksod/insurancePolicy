// sidebar.js - Sidebar specific functionality
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    // Initialize sidebar
    initSidebar();

    // Set active navigation link
    setActiveNavLink();
  });

  window.initSidebar = function () {
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const closeSidebar = document.getElementById("closeSidebar");

    // Initialize sidebar toggle
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener("click", toggleSidebar);
    }

    if (closeSidebar) {
      closeSidebar.addEventListener("click", closeSidebarMenu);
    }

    if (overlay) {
      overlay.addEventListener("click", closeSidebarMenu);
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", function (event) {
      if (
        window.innerWidth < 768 &&
        sidebar &&
        sidebar.classList.contains("open")
      ) {
        if (
          !sidebar.contains(event.target) &&
          !sidebarToggle.contains(event.target)
        ) {
          closeSidebarMenu();
        }
      }
    });
  };

  window.toggleSidebar = function () {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");
    const overlay = document.getElementById("overlay");

    sidebar.classList.toggle("open");
    mainContent.classList.toggle("sidebar-open");

    if (overlay) {
      overlay.classList.toggle("show");
      document.body.style.overflow = sidebar.classList.contains("open")
        ? "hidden"
        : "auto";
    }
  };

  window.closeSidebarMenu = function () {
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");
    const overlay = document.getElementById("overlay");

    sidebar.classList.remove("open");
    mainContent.classList.remove("sidebar-open");

    if (overlay) {
      overlay.classList.remove("show");
    }
    document.body.style.overflow = "auto";
  };

  window.setActiveNavLink = function () {
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".sidebar-link");

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === currentPage) {
        link.classList.add("active");
      }

      link.addEventListener("click", function () {
        if (window.innerWidth < 768) {
          closeSidebarMenu();
        }
      });
    });
  };
})();
