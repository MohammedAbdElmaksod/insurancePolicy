// commission.js - Sales Commission Management with Advanced Search
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

    // Initialize commission page
    initCommissionPage();

    // Set default dates
    setDefaultDates();
  });

  // Sales agents data structure
  const salesAgents = [
    { id: "shrouq", name: "شروق", color: "from-pink-500 to-rose-600" },
    { id: "mohamed", name: "محمد", color: "from-blue-500 to-blue-600" },
    { id: "ahmed", name: "أحمد", color: "from-green-500 to-green-600" },
    { id: "sara", name: "سارة", color: "from-purple-500 to-purple-600" },
    { id: "ali", name: "علي", color: "from-amber-500 to-amber-600" },
    { id: "fatima", name: "فاطمة", color: "from-indigo-500 to-indigo-600" },
  ];

  // Expanded policy data for demo
  const policyData = {
    2458: {
      client: "منة",
      type: "سيارات",
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      insuranceAmount: 350000,
      totalPremium: 35000,
      salesAgents: ["shrouq", "mohamed", "sara"],
      createdDate: "2023-12-15",
    },
    2456: {
      client: "أحمد محمد",
      type: "صحية",
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      insuranceAmount: 150000,
      totalPremium: 15000,
      salesAgents: ["ahmed", "fatima"],
      createdDate: "2023-12-20",
    },
    2459: {
      client: "خالد سعيد",
      type: "منازل",
      startDate: "2024-02-01",
      endDate: "2025-02-01",
      insuranceAmount: 500000,
      totalPremium: 50000,
      salesAgents: ["ali", "fatima", "shrouq"],
      createdDate: "2024-01-10",
    },
    2460: {
      client: "سارة أحمد",
      type: "سيارات",
      startDate: "2024-01-10",
      endDate: "2025-01-10",
      insuranceAmount: 280000,
      totalPremium: 28000,
      salesAgents: ["shrouq", "mohamed"],
      createdDate: "2023-12-28",
    },
    2461: {
      client: "محمد علي",
      type: "صحية",
      startDate: "2024-01-20",
      endDate: "2025-01-20",
      insuranceAmount: 200000,
      totalPremium: 20000,
      salesAgents: ["ahmed", "sara"],
      createdDate: "2024-01-05",
    },
    2462: {
      client: "نورا كمال",
      type: "منازل",
      startDate: "2024-02-15",
      endDate: "2025-02-15",
      insuranceAmount: 450000,
      totalPremium: 45000,
      salesAgents: ["ali", "fatima"],
      createdDate: "2024-01-25",
    },
    2463: {
      client: "ياسر ربيع",
      type: "سيارات",
      startDate: "2024-02-01",
      endDate: "2025-02-01",
      insuranceAmount: 320000,
      totalPremium: 32000,
      salesAgents: ["mohamed", "sara"],
      createdDate: "2024-01-15",
    },
    2464: {
      client: "هناء وليد",
      type: "صحية",
      startDate: "2024-02-10",
      endDate: "2025-02-10",
      insuranceAmount: 180000,
      totalPremium: 18000,
      salesAgents: ["shrouq", "fatima"],
      createdDate: "2024-01-30",
    },
  };

  // Current state
  let currentPolicy = null;
  let currentCommissions = [];
  let searchResults = [];

  function initCommissionPage() {
    // Initialize search functionality
    const policySearchInput = document.getElementById("policy-search");
    const policySearchBtn = document.querySelector(
      'button[onclick="searchByPolicyNumber()"]'
    );

    // Setup event delegation for commission inputs
    setupCommissionInputDelegation();
    if (policySearchInput) {
      policySearchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          searchByPolicyNumber();
        }
      });
    }

    if (policySearchBtn) {
      policySearchBtn.addEventListener("click", searchByPolicyNumber);
    }

    // Initialize sales agent search
    const salesAgentSelect = document.getElementById("sales-agent-search");
    const salesAgentBtn = document.querySelector(
      'button[onclick="searchBySalesAgent()"]'
    );

    if (salesAgentBtn) {
      salesAgentBtn.addEventListener("click", searchBySalesAgent);
    }

    // Initialize date range search
    const dateRangeBtn = document.querySelector(
      'button[onclick="searchByDateRange()"]'
    );
    if (dateRangeBtn) {
      dateRangeBtn.addEventListener("click", searchByDateRange);
    }
  }
  // Event delegation for commission inputs
function setupCommissionInputDelegation() {
    document.addEventListener('input', function(e) {
        if (e.target && e.target.classList.contains('commission-amount')) {
            // Get the card that contains this input
            const agentCard = e.target.closest('.sales-agent-card');
            if (agentCard) {
                const commissionId = agentCard.dataset.commissionId;
                if (commissionId) {
                    updateAgentCommission(commissionId, e.target.value);
                }
            }
        }
    });
}

  // Set default dates (last 30 days)
  function setDefaultDates() {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    document.getElementById("start-date").value = thirtyDaysAgo
      .toISOString()
      .split("T")[0];
    document.getElementById("end-date").value = today
      .toISOString()
      .split("T")[0];
  }

  // Search by policy number
  function searchByPolicyNumber() {
    const policyNumber = document.getElementById("policy-search").value.trim();
    if (!policyNumber) {
      alert("يرجى إدخال رقم الوثيقة للبحث");
      return;
    }

    // Hide commission form and search results
    hideCommissionForm();
    hideSearchResults();

    // Show loading state
    showLoadingState();

    // Mock API call
    setTimeout(() => {
      hideLoadingState();

      if (policyData[policyNumber]) {
        // Load and show the policy
        loadPolicyFromSearch(policyNumber);

        if (typeof showSuccessMessage === "function") {
          showSuccessMessage("تم العثور على الوثيقة بنجاح!");
        }
      } else {
        // No results found
        showNoResults();
      }
    }, 800);
  }

  // Make searchByPolicyNumber available globally
  window.searchByPolicyNumber = searchByPolicyNumber;

  // Search by sales agent
  function searchBySalesAgent() {
    const salesAgentId = document.getElementById("sales-agent-search").value;
    if (!salesAgentId) {
      alert("يرجى اختيار موظف المبيعات");
      return;
    }

    // Hide commission form
    hideCommissionForm();

    // Show loading state
    showLoadingState();

    // Mock API call
    setTimeout(() => {
      hideLoadingState();

      // Find policies with this sales agent
      const results = Object.entries(policyData)
        .filter(([number, policy]) => policy.salesAgents.includes(salesAgentId))
        .map(([number, policy]) => ({ number, ...policy }));

      if (results.length > 0) {
        // Display search results
        displaySearchResults(
          results,
          `موظف المبيعات: ${
            salesAgents.find((a) => a.id === salesAgentId).name
          }`
        );
      } else {
        // No results found
        showNoResults();
      }
    }, 800);
  }

  // Make searchBySalesAgent available globally
  window.searchBySalesAgent = searchBySalesAgent;

  // Search by date range
  function searchByDateRange() {
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    if (!startDate || !endDate) {
      alert("يرجى اختيار تاريخ البداية والنهاية");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("تاريخ البداية يجب أن يكون قبل تاريخ النهاية");
      return;
    }

    // Hide commission form
    hideCommissionForm();

    // Show loading state
    showLoadingState();

    // Mock API call
    setTimeout(() => {
      hideLoadingState();

      // Find policies within date range
      const results = Object.entries(policyData)
        .filter(([number, policy]) => {
          const policyDate = new Date(policy.startDate);
          const start = new Date(startDate);
          const end = new Date(endDate);
          return policyDate >= start && policyDate <= end;
        })
        .map(([number, policy]) => ({ number, ...policy }));

      if (results.length > 0) {
        // Display search results
        displaySearchResults(results, `الفترة: من ${startDate} إلى ${endDate}`);
      } else {
        // No results found
        showNoResults();
      }
    }, 800);
  }

  // Make searchByDateRange available globally
  window.searchByDateRange = searchByDateRange;

  // Display search results
  function displaySearchResults(results, searchCriteria) {
    searchResults = results;

    // Update results count
    const resultsCount = document.getElementById("results-count");
    if (resultsCount) {
      resultsCount.textContent = `${results.length} وثيقة - ${searchCriteria}`;
    }

    // Render results
    renderSearchResults(results);

    // Show search results section
    showSearchResults();
  }

  // Render search results
  function renderSearchResults(results) {
    const resultsList = document.getElementById("search-results-list");
    const noResults = document.getElementById("no-results");

    if (!resultsList) return;

    if (results.length === 0) {
      if (noResults) noResults.classList.remove("hidden");
      resultsList.innerHTML = "";
      return;
    }

    if (noResults) noResults.classList.add("hidden");

    resultsList.innerHTML = results
      .map(
        (policy) => `
            <div class="policy-result-card bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition cursor-pointer"
                 onclick="loadPolicyFromSearch('${policy.number}')">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                            <i class="fas fa-file-contract text-xl text-blue-600"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-800 text-lg">وثيقة #${
                              policy.number
                            }</h4>
                            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-1">
                                <span class="flex items-center">
                                    <i class="fas fa-user ml-1"></i> ${
                                      policy.client
                                    }
                                </span>
                                <span class="flex items-center">
                                    <i class="fas fa-shield-alt ml-1"></i> ${
                                      policy.type
                                    }
                                </span>
                                <span class="flex items-center">
                                    <i class="fas fa-calendar-alt ml-1"></i> ${
                                      policy.startDate
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-left">
                        <div class="mb-2">
                            <span class="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                                ${policy.salesAgents.length} موظف مبيعات
                            </span>
                        </div>
                        <div class="space-y-1">
                            <p class="text-sm text-gray-600">مبلغ التأمين: <span class="font-medium">${formatCurrency(
                              policy.insuranceAmount
                            )}</span></p>
                            <p class="text-sm text-gray-600">القسط: <span class="font-medium">${formatCurrency(
                              policy.totalPremium
                            )}</span></p>
                        </div>
                    </div>
                    
                    <div class="text-center">
                        <button class="px-4 py-2 bg-gradient-to-l from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition flex items-center">
                            <i class="fas fa-eye ml-2"></i> عرض التفاصيل
                        </button>
                        <p class="text-gray-500 text-xs mt-2">انقر لعرض وتوزيع العمولات</p>
                    </div>
                </div>
                
                <!-- Sales Agents List -->
                <div class="mt-4 pt-4 border-t border-gray-100">
                    <p class="text-sm text-gray-600 mb-2">موظفو المبيعات:</p>
                    <div class="flex flex-wrap gap-2">
                        ${policy.salesAgents
                          .map((agentId) => {
                            const agent = salesAgents.find(
                              (a) => a.id === agentId
                            );
                            return agent
                              ? `
                                <span class="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                    <i class="fas fa-user-circle ml-1"></i> ${agent.name}
                                </span>
                            `
                              : "";
                          })
                          .join("")}
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }

  // Load policy from search results
  function loadPolicyFromSearch(policyNumber) {
    const policy = policyData[policyNumber];
    if (!policy) return;

    currentPolicy = { ...policy, number: policyNumber };

    // Hide search results
    hideSearchResults();

    // Load and show policy data
    loadPolicyData();

    if (typeof showSuccessMessage === "function") {
      showSuccessMessage("تم تحميل بيانات الوثيقة بنجاح!");
    }
  }

  // Make loadPolicyFromSearch available globally
  window.loadPolicyFromSearch = loadPolicyFromSearch;

  // Clear search results
  function clearSearch() {
    hideSearchResults();
    hideCommissionForm();

    // Clear search inputs
    document.getElementById("policy-search").value = "";
    document.getElementById("sales-agent-search").value = "";
    setDefaultDates();
  }

  // Make clearSearch available globally
  window.clearSearch = clearSearch;

  // Load policy data into the form and show commission form
  function loadPolicyData() {
    if (!currentPolicy) return;

    // Update policy details
    const policyTitle = document.getElementById("policy-title");
    const selectedPolicyTitle = document.getElementById(
      "selected-policy-title"
    );
    const policyClient = document.getElementById("policy-client");
    const policyType = document.getElementById("policy-type");
    const policyDate = document.getElementById("policy-date");
    const insuranceAmount = document.getElementById("insurance-amount");
    const totalPremium = document.getElementById("total-premium");

    const titleText = `وثيقة تأمين #${currentPolicy.number}`;
    if (policyTitle) policyTitle.textContent = titleText;
    if (selectedPolicyTitle) selectedPolicyTitle.textContent = titleText;
    if (policyClient) policyClient.textContent = currentPolicy.client;
    if (policyType) policyType.textContent = currentPolicy.type;
    if (policyDate) policyDate.textContent = currentPolicy.startDate;
    if (insuranceAmount)
      insuranceAmount.textContent = formatCurrency(
        currentPolicy.insuranceAmount
      );
    if (totalPremium)
      totalPremium.textContent = formatCurrency(currentPolicy.totalPremium);

    // Create sales agents cards - FIXED
    const salesContainer = document.getElementById("sales-agents-container");
    if (salesContainer) {
      salesContainer.innerHTML = "";

      // Clear current commissions
      currentCommissions = [];

      // Add sales agents from policy data
      currentPolicy.salesAgents.forEach((salesId) => {
        const agent = salesAgents.find((a) => a.id === salesId);
        if (agent) {
          addSalesAgentCard(agent);
        }
      });

      // If no sales agents were added from policy, show message
      if (currentPolicy.salesAgents.length === 0) {
        salesContainer.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-users text-3xl mb-4 opacity-50"></i>
                    <p>لا يوجد موظفو مبيعات مرتبطون بهذه الوثيقة</p>
                </div>
            `;
      }
    }

    // Update sales count
    updateSalesCount();

    // Reset commission summary
    const totalCommissionElement = document.getElementById("total-commission");
    const summaryTotalCommission = document.getElementById(
      "summary-total-commission"
    );

    if (totalCommissionElement) totalCommissionElement.textContent = "0 ج.م";
    if (summaryTotalCommission) summaryTotalCommission.textContent = "0 ج.م";

    const progressBar = document.getElementById("total-commission-progress");
    const summaryProgressBar = document.getElementById(
      "summary-commission-progress"
    );

    if (progressBar) progressBar.style.width = "0%";
    if (summaryProgressBar) summaryProgressBar.style.width = "0%";

    // Show commission form section
    showCommissionForm();
  }

  // Add sales agent card to the UI - FIXED VERSION
  function addSalesAgentCard(agent) {
    const salesContainer = document.getElementById("sales-agents-container");
    if (!salesContainer) return;

    // Generate a unique ID for this commission
    const commissionId = `commission_${agent.id}_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Check if this agent already has a commission entry
    const existingCommissionIndex = currentCommissions.findIndex(
      (c) => c.agentId === agent.id
    );

    if (existingCommissionIndex !== -1) {
      // Update existing commission
      currentCommissions[existingCommissionIndex].id = commissionId;
    } else {
      // Add new commission
      currentCommissions.push({
        id: commissionId,
        agentId: agent.id,
        agentName: agent.name,
        amount: 0,
        status: "pending",
      });
    }

    const agentCard = document.createElement("div");
    agentCard.className =
      "sales-agent-card p-6 border border-gray-200 rounded-xl mb-4 bg-white";
    agentCard.dataset.agentId = agent.id;
    agentCard.dataset.commissionId = commissionId;

    agentCard.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="flex items-center gap-4">
                <div class="sales-avatar bg-gradient-to-r ${
                  agent.color
                } w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    ${agent.name.charAt(0)}
                </div>
                <div>
                    <h4 class="font-bold text-gray-800 text-lg">${
                      agent.name
                    }</h4>
                    <p class="text-gray-600 text-sm">موظف مبيعات</p>
                </div>
            </div>
            
            <div class="flex-1 max-w-md">
                <div>
                    <label class="block text-gray-700 text-sm font-medium mb-2">
                        مبلغ العمولة
                    </label>
                    <div class="relative">
                        <input type="number" 
                               id="commission-input-${commissionId}"
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition commission-amount" 
                               min="0" 
                               step="0.01" 
                               value="0"
                               placeholder="أدخل مبلغ العمولة" />
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">ج.م</span>
                    </div>
                    <p class="text-gray-500 text-sm mt-1" id="commission-percentage-${commissionId}">0% من القسط</p>
                </div>
            </div>
            
            <div class="text-right">
                <div class="mb-2">
                    <span class="commission-badge pending px-3 py-1 bg-amber-100 text-amber-600 text-xs font-medium rounded-full">معلق</span>
                </div>
                <p class="text-gray-500 text-sm">المبلغ المخصص</p>
                <p class="amount-display agent-total font-bold text-lg text-blue-600" id="agent-total-${commissionId}">0 ج.م</p>
            </div>
        </div>
    `;

    // Remove any existing card for this agent
    const existingCard = salesContainer.querySelector(
      `[data-agent-id="${agent.id}"]`
    );
    if (existingCard) {
      existingCard.remove();
    }

    salesContainer.appendChild(agentCard);

    // Add event listener with proper closure
    const amountInput = agentCard.querySelector(
      `#commission-input-${commissionId}`
    );
    if (amountInput) {
      // Remove any existing event listeners
      const newInput = amountInput.cloneNode(true);
      amountInput.parentNode.replaceChild(newInput, amountInput);

      // Add fresh event listener
      newInput.addEventListener("input", function () {
        console.log(
          `Input changed for ${agent.name}: ${this.value}, ID: ${commissionId}`
        );
        updateAgentCommission(commissionId, this.value);
      });
    }

    updateSalesCount();
  }

  // Update agent commission - FIXED VERSION
  function updateAgentCommission(commissionId, value) {
    console.log(`Updating commission ${commissionId} with value: ${value}`);

    const commission = currentCommissions.find((c) => c.id === commissionId);
    if (!commission) {
      console.error(`Commission not found: ${commissionId}`);
      return;
    }

    const numericValue = parseFloat(value) || 0;
    commission.amount = numericValue;

    // Update only this specific agent's UI
    updateAgentInputs(commissionId, numericValue);

    // Recalculate totals
    calculateCommissions();
  }

  // Make updateAgentCommission available globally
  window.updateAgentCommission = updateAgentCommission;

  // Update agent inputs - FIXED VERSION
  function updateAgentInputs(commissionId, amount) {
    console.log(`Updating UI for ${commissionId}: ${amount}`);

    // Find the specific input
    const amountInput = document.getElementById(
      `commission-input-${commissionId}`
    );
    const totalDisplay = document.getElementById(`agent-total-${commissionId}`);
    const percentageDisplay = document.getElementById(
      `commission-percentage-${commissionId}`
    );

    if (amountInput && amountInput.value !== amount.toString()) {
      amountInput.value = amount;
    }

    if (totalDisplay) {
      totalDisplay.textContent = formatCurrency(amount);
    }

    if (percentageDisplay && currentPolicy && currentPolicy.totalPremium) {
      const percentage = (amount / currentPolicy.totalPremium) * 100;
      percentageDisplay.textContent = `${percentage.toFixed(2)}% من القسط`;
    }
  }

  // Calculate commissions and update summary
  function calculateCommissions() {
    if (!currentPolicy) return;

    const totalCommission = currentCommissions.reduce(
      (sum, c) => sum + c.amount,
      0
    );
    const totalPremium = currentPolicy.totalPremium;

    const totalCommissionElement = document.getElementById("total-commission");
    const summaryTotalCommission = document.getElementById(
      "summary-total-commission"
    );

    if (totalCommissionElement)
      totalCommissionElement.textContent = formatCurrency(totalCommission);
    if (summaryTotalCommission)
      summaryTotalCommission.textContent = formatCurrency(totalCommission);

    const progressBar = document.getElementById("total-commission-progress");
    const summaryProgressBar = document.getElementById(
      "summary-commission-progress"
    );

    if (progressBar) {
      const progressPercentage = Math.min(
        (totalCommission / totalPremium) * 100,
        100
      );
      progressBar.style.width = `${progressPercentage}%`;
    }

    if (summaryProgressBar) {
      const progressPercentage = Math.min(
        (totalCommission / totalPremium) * 100,
        100
      );
      summaryProgressBar.style.width = `${progressPercentage}%`;
    }

    // Update warning if commissions exceed premium
    const warningMessage = document.getElementById("commission-warning");
    if (totalCommission > totalPremium) {
      if (!warningMessage) {
        const commissionForm = document.getElementById(
          "commission-form-section"
        );
        if (commissionForm) {
          const warningDiv = document.createElement("div");
          warningDiv.id = "commission-warning";
          warningDiv.className =
            "bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg mb-4";
          warningDiv.innerHTML = `
                    <div class="flex items-center">
                        <i class="fas fa-exclamation-triangle ml-2"></i>
                        <span>تحذير: إجمالي العمولات (${formatCurrency(
                          totalCommission
                        )}) يتجاوز القسط الإجمالي (${formatCurrency(
            totalPremium
          )})</span>
                    </div>
                `;
          const salesAgentsSection = document.querySelector(
            "#sales-agents-container"
          );
          if (salesAgentsSection) {
            salesAgentsSection.parentNode.insertBefore(
              warningDiv,
              salesAgentsSection
            );
          }
        }
      }
    } else if (warningMessage) {
      warningMessage.remove();
    }
  }

  // Update sales count
  function updateSalesCount() {
    const salesCountElement = document.getElementById("sales-count");
    if (salesCountElement) {
      const count = currentCommissions.length;
      salesCountElement.textContent = `${count} موظف مبيعات`;
    }
  }

  // Save commissions
  function saveCommissions() {
    if (!currentPolicy) {
      alert("يرجى تحديد وثيقة أولاً");
      return;
    }

    const totalCommission = currentCommissions.reduce(
      (sum, c) => sum + c.amount,
      0
    );

    if (totalCommission === 0) {
      alert("يرجى إدخال مبالغ العمولات للموظفين");
      return;
    }

    const totalPremium = currentPolicy.totalPremium;
    if (totalCommission > totalPremium) {
      if (
        !confirm("إجمالي العمولات يتجاوز القسط الإجمالي! هل تريد المتابعة؟")
      ) {
        return;
      }
    }

    // Show loading
    const saveBtn = document.querySelector(
      'button[onclick="saveCommissions()"]'
    );
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin ml-2"></i>جاري الحفظ...';
    saveBtn.disabled = true;

    // Mock API call
    setTimeout(() => {
      saveBtn.innerHTML = originalText;
      saveBtn.disabled = false;

      if (typeof showSuccessMessage === "function") {
        showSuccessMessage("تم حفظ العمولات بنجاح!");
      }

      // In real implementation, send data to server
      console.log("Saving commissions:", {
        policyNumber: currentPolicy.number,
        commissions: currentCommissions,
        totalCommission: totalCommission,
      });
    }, 1500);
  }

  // Make saveCommissions available globally
  window.saveCommissions = saveCommissions;

  // Show loading state
  function showLoadingState() {
    const loadingState = document.getElementById("loading-state");
    if (loadingState) loadingState.classList.remove("hidden");
  }

  // Hide loading state
  function hideLoadingState() {
    const loadingState = document.getElementById("loading-state");
    if (loadingState) loadingState.classList.add("hidden");
  }

  // Show search results
  function showSearchResults() {
    const searchResults = document.getElementById("search-results");
    if (searchResults) searchResults.classList.remove("hidden");
  }

  // Hide search results
  function hideSearchResults() {
    const searchResults = document.getElementById("search-results");
    if (searchResults) searchResults.classList.add("hidden");
  }

  // Show commission form
  function showCommissionForm() {
    const commissionForm = document.getElementById("commission-form-section");
    if (commissionForm) commissionForm.classList.remove("hidden");
  }

  // Hide commission form
  function hideCommissionForm() {
    const commissionForm = document.getElementById("commission-form-section");
    if (commissionForm) commissionForm.classList.add("hidden");
  }

  // Show no results message
  function showNoResults() {
    // Show empty search results
    const resultsList = document.getElementById("search-results-list");
    const noResults = document.getElementById("no-results");
    const searchResults = document.getElementById("search-results");

    if (resultsList) resultsList.innerHTML = "";
    if (noResults) noResults.classList.remove("hidden");
    if (searchResults) {
      searchResults.classList.remove("hidden");
      document.getElementById("results-count").textContent = "0 وثيقة";
    }
  }

  // Helper function to format currency
  function formatCurrency(amount) {
    return amount.toLocaleString("ar-SA") + " ج.م";
  }

  // Add warning message function if not exists
  if (!window.showSuccessMessage) {
    window.showSuccessMessage = function (message, type = "success") {
      const messageDiv = document.createElement("div");
      messageDiv.className = `fixed top-4 left-4 px-6 py-3 rounded-lg shadow-lg z-50 success-message ${
        type === "warning"
          ? "bg-amber-500 text-white"
          : "bg-green-500 text-white"
      }`;
      messageDiv.style.right = "1rem";
      messageDiv.style.left = "auto";
      messageDiv.innerHTML = `
                <div class="flex items-center">
                    <i class="fas ${
                      type === "warning"
                        ? "fa-exclamation-triangle"
                        : "fa-check-circle"
                    } ml-2"></i>
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
  }
})();
