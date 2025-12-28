// dashboard.js - Dashboard page specific functionality

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

    // Initialize dashboard
    initDashboard();

    // Initialize modals
    initModals();
  });

  function initDashboard() {
    // Set current date and time
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute

    // Add form submission handlers for modals
    document
      .getElementById("salesForm")
      ?.addEventListener("submit", handleSalesForm);
    document
      .getElementById("companyForm")
      ?.addEventListener("submit", handleCompanyForm);
    document
      .getElementById("bankForm")
      ?.addEventListener("submit", handleBankForm);
  }

  function updateDateTime() {
    const dateElement = document.getElementById("current-date");
    const timeElement = document.getElementById("current-time");

    if (dateElement && timeElement) {
      const now = new Date();

      // Format date in Arabic
      const dateOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Riyadh",
      };
      dateElement.textContent = now.toLocaleDateString("ar-SA", dateOptions);

      // Format time in Arabic
      const timeOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Riyadh",
      };
      timeElement.textContent = now.toLocaleTimeString("ar-SA", timeOptions);
    }
  }

  function initModals() {
    // Add click handlers for modal overlays
    document.querySelectorAll(".modal-overlay").forEach((overlay) => {
      overlay.addEventListener("click", function () {
        const modalId = this.closest('[id$="Modal"]')?.id;
        if (modalId) {
          closeModal(modalId);
        }
      });
    });

    // Close modals with ESC key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        const openModals = document.querySelectorAll(
          '[id$="Modal"]:not(.hidden)'
        );
        openModals.forEach((modal) => {
          closeModal(modal.id);
        });
      }
    });
  }

  // Modal functions
  window.openSalesModal = function () {
    openModal("salesModal");
  };

  window.closeSalesModal = function () {
    closeModal("salesModal");
  };

  window.openCompanyModal = function () {
    openModal("companyModal");
  };

  window.closeCompanyModal = function () {
    closeModal("companyModal");
  };

  window.openBankModal = function () {
    openModal("bankModal");
  };

  window.closeBankModal = function () {
    closeModal("bankModal");
  };

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";

      // Add modal enter animation
      const modalContent = modal.querySelector(".modal-content");
      if (modalContent) {
        modalContent.classList.add("modal-enter");
      }
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      // Add exit animation
      const modalContent = modal.querySelector(".modal-content");
      if (modalContent) {
        modalContent.classList.remove("modal-enter");
        modalContent.classList.add("modal-exit");

        // Wait for animation to complete
        setTimeout(() => {
          modal.classList.add("hidden");
          modalContent.classList.remove("modal-exit");
          document.body.style.overflow = "auto";
        }, 200);
      } else {
        modal.classList.add("hidden");
        document.body.style.overflow = "auto";
      }
    }
  }

  // Form submission handlers (design only - no logic implementation)
  function handleSalesForm(e) {
    e.preventDefault();
    console.log("Sales form submitted (design only)");
    closeSalesModal();

    // Show success message
    if (typeof showSuccessMessage === "function") {
      showSuccessMessage("تم إضافة البائع بنجاح!");
    }

    // In a real implementation, you would:
    // 1. Get form data
    // 2. Send to server
    // 3. Update UI
    // 4. Refresh sales dropdowns in other pages
  }

  function handleCompanyForm(e) {
    e.preventDefault();
    console.log("Company form submitted (design only)");
    closeCompanyModal();

    if (typeof showSuccessMessage === "function") {
      showSuccessMessage("تم إضافة شركة التأمين بنجاح!");
    }
  }

  function handleBankForm(e) {
    e.preventDefault();
    console.log("Bank form submitted (design only)");
    closeBankModal();

    if (typeof showSuccessMessage === "function") {
      showSuccessMessage("تم إضافة البنك بنجاح!");
    }
  }
})();
