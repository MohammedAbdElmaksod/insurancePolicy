// payment.js - Payment page specific functionality
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    // Initialize shared components
    if (typeof initForms === "function") {
      initForms();
    }

    // Initialize sidebar
    if (typeof initSidebar === "function") {
      initSidebar();
    }

    if (typeof setActiveNavLink === "function") {
      setActiveNavLink();
    }
  });
})();
