// shared.js - Shared functions across all pages
(function () {
  // Success message display
  window.showSuccessMessage = function (message) {
    const messageDiv = document.createElement("div");
    messageDiv.className =
      "fixed top-4 left-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 success-message";
    messageDiv.style.right = "1rem";
    messageDiv.style.left = "auto";
    messageDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle ml-2"></i>
                <span class="mr-2">${message}</span>
            </div>
        `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.classList.add(
        "opacity-0",
        "transition-opacity",
        "duration-300"
      );
      setTimeout(() => {
        if (messageDiv.parentNode) {
          document.body.removeChild(messageDiv);
        }
      }, 300);
    }, 3000);
  };

  // Form submission handler
  window.handleFormSubmission = function (
    form,
    successMessage = "تم حفظ البيانات بنجاح!"
  ) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const submitBtn = this.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin ml-2"></i>جاري الحفظ...';
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          showSuccessMessage(successMessage);
        }, 1500);
      }
    });
  };

  // Initialize all forms on page
  window.initForms = function () {
    document.querySelectorAll("form").forEach((form) => {
      handleFormSubmission(form);
    });
  };

  // Get current date in Arabic format
  window.getArabicDate = function () {
    const currentDate = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Riyadh",
    };
    return currentDate.toLocaleDateString("ar-SA", options);
  };
})();
