// Tab switching functionality
document.getElementById("login-tab").addEventListener("click", function () {
  showForm("login-form", "slide-in-right");
  updateActiveTab("login-tab");
});

document.getElementById("form1-tab").addEventListener("click", function () {
  showForm("policy-form", "slide-in-right");
  updateActiveTab("form1-tab");
});

document.getElementById("form2-tab").addEventListener("click", function () {
  showForm("payment-form", "slide-in-left");
  updateActiveTab("form2-tab");
});

// Navigation between forms
document.getElementById("next-to-form2").addEventListener("click", function () {
  showForm("payment-form", "slide-in-left");
  updateActiveTab("form2-tab");
});

document.getElementById("back-to-form1").addEventListener("click", function () {
  showForm("policy-form", "slide-in-right");
  updateActiveTab("form1-tab");
});

// Form display function with animation
function showForm(formId, animationClass) {
  // Hide all forms
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("policy-form").classList.add("hidden");
  document.getElementById("payment-form").classList.add("hidden");

  // Remove animation classes
  const forms = [
    document.getElementById("login-form"),
    document.getElementById("policy-form"),
    document.getElementById("payment-form"),
  ];
  forms.forEach((form) => {
    if (form) {
      form.classList.remove("slide-in-right", "slide-in-left", "fade-in");
    }
  });

  // Show selected form with animation
  const selectedForm = document.getElementById(formId);
  selectedForm.classList.remove("hidden");

  // Add animation class after a small delay to trigger animation
  setTimeout(() => {
    selectedForm.classList.add(animationClass);
  }, 10);

  // Add loading bar animation
  const loadingBar = selectedForm.querySelector(".loading-bar");
  if (loadingBar) {
    loadingBar.style.width = "0%";
    setTimeout(() => {
      loadingBar.style.animation = "loading 1s ease-out forwards";
    }, 50);
  }
}

// Update active tab styling
function updateActiveTab(activeTabId) {
  // Reset all tabs
  document
    .getElementById("login-tab")
    .classList.remove("tab-active", "border-blue-500", "text-blue-600");
  document
    .getElementById("login-tab")
    .classList.add("border-gray-300", "text-gray-700");

  document
    .getElementById("form1-tab")
    .classList.remove("tab-active", "border-blue-500", "text-blue-600");
  document
    .getElementById("form1-tab")
    .classList.add("border-gray-300", "text-gray-700");

  document
    .getElementById("form2-tab")
    .classList.remove("tab-active", "border-blue-500", "text-blue-600");
  document
    .getElementById("form2-tab")
    .classList.add("border-gray-300", "text-gray-700");

  // Set active tab
  const activeTab = document.getElementById(activeTabId);
  activeTab.classList.remove("border-gray-300", "text-gray-700");
  activeTab.classList.add("border-blue-500", "text-blue-600", "tab-active");
}

// Initialize with login form active
updateActiveTab("login-tab");

// Add hover effect to form inputs
document.querySelectorAll(".form-input").forEach((input) => {
  input.addEventListener("focus", function () {
    this.parentElement.classList.add("transform", "transition", "duration-300");
  });
});

// Form submission handlers (prevent actual submission for demo)
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Add submission animation
    const submitBtn = this.querySelector('button[type="submit"]');
    if (submitBtn) {
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin ml-2"></i>جاري الحفظ...';
      submitBtn.disabled = true;

      // Simulate API call
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Show success message with animation
        const successDiv = document.createElement("div");
        successDiv.className =
          "fixed top-4 left-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-50";
        successDiv.textContent = "تم حفظ البيانات بنجاح!";
        successDiv.style.right = "1rem";
        successDiv.style.left = "auto";
        document.body.appendChild(successDiv);

        // Animate in
        setTimeout(() => {
          successDiv.classList.add("translate-y-0");
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
          successDiv.classList.remove("translate-y-0");
          successDiv.classList.add("-translate-y-4", "opacity-0");
          setTimeout(() => {
            document.body.removeChild(successDiv);
          }, 300);
        }, 3000);
      }, 1500);
    }
  });
});

// Add floating animation to some elements
window.addEventListener("load", function () {
  const floatingElements = document.querySelectorAll(".floating-icon");
  floatingElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.5}s`;
  });
});
