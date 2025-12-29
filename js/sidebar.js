// sidebar.js - Sidebar specific functionality
(function() {
  document.addEventListener("DOMContentLoaded", function() {
    // Initialize sidebar
    initSidebar();

    // Set active navigation link
    setActiveNavLink();
  });

  window.initSidebar = function() {
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
    document.addEventListener("click", function(event) {
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

  window.toggleSidebar = function() {
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

  window.closeSidebarMenu = function() {
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

  window.setActiveNavLink = function() {
    // Get current page filename
    const currentPage = window.location.pathname.split("/").pop();
    
    // Remove any query parameters or hash
    const cleanCurrentPage = currentPage.split('?')[0].split('#')[0];
    
    // List of pages to check
    const pageMappings = {
      'dashboard.html': 'dashboard.html',
      'index.html': 'index.html', 
      'payment.html': 'payment.html',
      'taxdetails.html': 'taxdetails.html',
      'commission.html': 'commission.html'
    };
    
    // Get all navigation links
    const navLinks = document.querySelectorAll(".sidebar-link");
    
    navLinks.forEach((link) => {
      // Get href and clean it
      const href = link.getAttribute("href");
      if (!href) return;
      
      const cleanHref = href.split('/').pop().split('?')[0].split('#')[0];
      
      // Check if this link matches current page
      if (cleanHref === cleanCurrentPage) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }

      // Add click handler to close sidebar on mobile
      link.addEventListener("click", function() {
        if (window.innerWidth < 768) {
          closeSidebarMenu();
        }
      });
    });
    
    // Also check for exact matches
    if (cleanCurrentPage in pageMappings) {
      const navLinks = document.querySelectorAll(".sidebar-link");
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href && href.includes(cleanCurrentPage)) {
          link.classList.add("active");
        }
      });
    }
  };
})();