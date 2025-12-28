// index.js - Index page specific functionality
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

    // Initialize multi-select
    initMultiSelect();

    // Set current date
    setCurrentDate();
  });

  function initMultiSelect() {
    const salesSelect = document.getElementById("sales-select");
    if (!salesSelect) return;

    // Create container
    const container = document.createElement("div");
    container.className = "multi-select-container";

    // Create input display
    const inputDisplay = document.createElement("div");
    inputDisplay.className = "multi-select-input form-input";

    // Create tags container
    const tagsContainer = document.createElement("div");
    tagsContainer.className = "flex flex-wrap gap-2";

    // Create placeholder
    const placeholder = document.createElement("span");
    placeholder.className = "multi-select-placeholder";
    placeholder.textContent = "اختر البائع...";

    inputDisplay.appendChild(tagsContainer);
    inputDisplay.appendChild(placeholder);

    // Create dropdown
    const dropdown = document.createElement("div");
    dropdown.className = "multi-select-dropdown";

    // Add search
    const searchContainer = document.createElement("div");
    searchContainer.className = "multi-select-search";
    searchContainer.innerHTML = `
            <input type="text" placeholder="ابحث عن بائع..." class="search-input" />
        `;
    dropdown.appendChild(searchContainer);

    // Add options
    const options = Array.from(salesSelect.options);
    options.forEach((option) => {
      if (option.value) {
        const optionDiv = document.createElement("div");
        optionDiv.className = "multi-select-option";
        optionDiv.textContent = option.textContent;
        optionDiv.dataset.value = option.value;

        optionDiv.addEventListener("click", function () {
          this.classList.toggle("selected");
          updateSelectedOptions();
        });

        dropdown.appendChild(optionDiv);
      }
    });

    // Replace original select
    salesSelect.parentNode.insertBefore(container, salesSelect);
    salesSelect.style.display = "none";
    container.appendChild(inputDisplay);
    container.appendChild(dropdown);

    // Toggle dropdown
    inputDisplay.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown.classList.toggle("show");
      if (dropdown.classList.contains("show")) {
        const searchInput = dropdown.querySelector(".search-input");
        if (searchInput) searchInput.focus();
      }
    });

    // Search functionality
    const searchInput = dropdown.querySelector(".search-input");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        const options = dropdown.querySelectorAll(".multi-select-option");

        options.forEach((option) => {
          const text = option.textContent.toLowerCase();
          option.style.display = text.includes(searchTerm) ? "" : "none";
        });
      });
    }

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
      if (!container.contains(event.target)) {
        dropdown.classList.remove("show");
      }
    });

    // Update selected options
    function updateSelectedOptions() {
      const selectedOptions = Array.from(
        dropdown.querySelectorAll(".multi-select-option.selected")
      );

      // Update original select
      Array.from(salesSelect.options).forEach((option) => {
        option.selected = selectedOptions.some(
          (opt) => opt.dataset.value === option.value
        );
      });

      // Update tags
      tagsContainer.innerHTML = "";

      if (selectedOptions.length > 0) {
        placeholder.style.display = "none";
        selectedOptions.forEach((option) => {
          const tag = document.createElement("div");
          tag.className = "multi-select-tag";
          tag.innerHTML = `
                        ${option.textContent}
                        <button type="button" class="multi-select-tag-remove" data-value="${option.dataset.value}">
                            <i class="fas fa-times text-xs"></i>
                        </button>
                    `;
          tagsContainer.appendChild(tag);
        });
      } else {
        placeholder.style.display = "inline";
      }

      // Add event listeners to remove buttons
      tagsContainer
        .querySelectorAll(".multi-select-tag-remove")
        .forEach((btn) => {
          btn.addEventListener("click", function (e) {
            e.stopPropagation();
            const value = this.dataset.value;
            const option = dropdown.querySelector(`[data-value="${value}"]`);
            if (option) {
              option.classList.remove("selected");
              updateSelectedOptions();
            }
          });
        });
    }

    // Initial update
    updateSelectedOptions();
  }

  function setCurrentDate() {
    const dateElement = document.getElementById("current-date");
    if (dateElement && typeof getArabicDate === "function") {
      dateElement.textContent = getArabicDate();
    }
  }
})();
