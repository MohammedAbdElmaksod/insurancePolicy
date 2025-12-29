// commission.js - Sales Commission Management
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize shared components
        if (typeof initForms === 'function') {
            initForms();
        }
        
        // Initialize sidebar
        if (typeof initSidebar === 'function') {
            initSidebar();
        }
        
        if (typeof setActiveNavLink === 'function') {
            setActiveNavLink();
        }
        
        // Initialize commission page
        initCommissionPage();
    });
    
    // Sales agents data structure - matching the ones from index.html
    const salesAgents = [
        { id: 'shrouq', name: 'شروق', color: 'from-pink-500 to-rose-600' },
        { id: 'mohamed', name: 'محمد', color: 'from-blue-500 to-blue-600' },
        { id: 'ahmed', name: 'أحمد', color: 'from-green-500 to-green-600' },
        { id: 'sara', name: 'سارة', color: 'from-purple-500 to-purple-600' },
        { id: 'ali', name: 'علي', color: 'from-amber-500 to-amber-600' },
        { id: 'fatima', name: 'فاطمة', color: 'from-indigo-500 to-indigo-600' }
    ];
    
    // Policy data for demo
    const policyData = {
        '2458': {
            client: 'منة',
            type: 'سيارات',
            startDate: '2024-01-01',
            endDate: '2025-01-01',
            insuranceAmount: 350000,
            totalPremium: 35000,
            salesAgents: ['shrouq', 'mohamed', 'sara']
        },
        '2456': {
            client: 'أحمد محمد',
            type: 'صحية',
            startDate: '2024-01-15',
            endDate: '2025-01-15',
            insuranceAmount: 150000,
            totalPremium: 15000,
            salesAgents: ['ahmed', 'fatima']
        },
        '2459': {
            client: 'خالد سعيد',
            type: 'منازل',
            startDate: '2024-02-01',
            endDate: '2025-02-01',
            insuranceAmount: 500000,
            totalPremium: 50000,
            salesAgents: ['ali', 'fatima', 'shrouq']
        }
    };
    
    // Current policy and commissions
    let currentPolicy = null;
    let currentCommissions = [];
    
    function initCommissionPage() {
        // Initialize search functionality
        const searchInput = document.getElementById('policy-search');
        const searchButton = document.querySelector('button[onclick="searchPolicy()"]');
        
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchPolicy();
                }
            });
        }
        
        if (searchButton) {
            searchButton.addEventListener('click', searchPolicy);
        }
    }
    
    // Search for policy
    function searchPolicy() {
        const policyNumber = document.getElementById('policy-search').value.trim();
        if (!policyNumber) {
            alert('يرجى إدخال رقم الوثيقة للبحث');
            return;
        }
        
        // Show loading state
        const loadingState = document.getElementById('loading-state');
        const policyDetails = document.getElementById('policy-details');
        
        loadingState.classList.remove('hidden');
        policyDetails.classList.add('hidden');
        
        // Clear previous data
        currentPolicy = null;
        currentCommissions = [];
        
        // Clear sales agents container
        const salesContainer = document.getElementById('sales-agents-container');
        if (salesContainer) {
            salesContainer.innerHTML = '';
        }
        
        // Reset commission summary
        const totalCommissionElement = document.getElementById('total-commission');
        if (totalCommissionElement) {
            totalCommissionElement.textContent = '0 ج.م';
        }
        
        const progressBar = document.getElementById('total-commission-progress');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
        
        // Mock API call with timeout
        setTimeout(() => {
            loadingState.classList.add('hidden');
            
            if (policyData[policyNumber]) {
                currentPolicy = { ...policyData[policyNumber], number: policyNumber };
                loadPolicyData();
                
                if (typeof showSuccessMessage === 'function') {
                    showSuccessMessage('تم العثور على الوثيقة بنجاح!');
                }
            } else {
                alert('لم يتم العثور على الوثيقة. يرجى التأكد من رقم الوثيقة.');
            }
        }, 1000);
    }
    
    // Make searchPolicy available globally for HTML onclick
    window.searchPolicy = searchPolicy;
    
    // Load policy data into the form
    function loadPolicyData() {
        if (!currentPolicy) return;
        
        // Update policy details
        const policyTitle = document.getElementById('policy-title');
        const policyClient = document.getElementById('policy-client');
        const policyType = document.getElementById('policy-type');
        const policyDate = document.getElementById('policy-date');
        const insuranceAmount = document.getElementById('insurance-amount');
        const totalPremium = document.getElementById('total-premium');
        
        if (policyTitle) policyTitle.textContent = `وثيقة تأمين #${currentPolicy.number}`;
        if (policyClient) policyClient.textContent = currentPolicy.client;
        if (policyType) policyType.textContent = currentPolicy.type;
        if (policyDate) policyDate.textContent = currentPolicy.startDate;
        if (insuranceAmount) insuranceAmount.textContent = formatCurrency(currentPolicy.insuranceAmount);
        if (totalPremium) totalPremium.textContent = formatCurrency(currentPolicy.totalPremium);
        
        // Create sales agents cards
        const salesContainer = document.getElementById('sales-agents-container');
        if (salesContainer) {
            salesContainer.innerHTML = '';
            
            // Add sales agents from policy data
            currentPolicy.salesAgents.forEach(salesId => {
                const agent = salesAgents.find(a => a.id === salesId);
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
        
        // Show policy details
        const policyDetails = document.getElementById('policy-details');
        if (policyDetails) {
            policyDetails.classList.remove('hidden');
        }
    }
    
    // Add sales agent card to the UI
    function addSalesAgentCard(agent) {
        const salesContainer = document.getElementById('sales-agents-container');
        if (!salesContainer) return;
        
        const commissionId = Date.now(); // Unique ID for this commission
        
        // Add to current commissions
        currentCommissions.push({
            id: commissionId,
            agentId: agent.id,
            agentName: agent.name,
            amount: 0,
            status: 'pending'
        });
        
        const agentCard = document.createElement('div');
        agentCard.className = 'sales-agent-card p-6';
        agentCard.dataset.agentId = agent.id;
        agentCard.dataset.commissionId = commissionId;
        
        agentCard.innerHTML = `
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                    <div class="sales-avatar bg-gradient-to-r ${agent.color}">
                        ${agent.name.charAt(0)}
                    </div>
                    <div>
                        <h4 class="font-bold text-gray-800 text-lg">${agent.name}</h4>
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
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition commission-amount" 
                                   min="0" 
                                   step="0.01" 
                                   value="0"
                                   oninput="updateAgentCommission('${commissionId}', this.value)"
                                   placeholder="أدخل مبلغ العمولة" />
                            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">ج.م</span>
                        </div>
                        <p class="text-gray-500 text-sm mt-1" id="commission-percentage-${commissionId}">0% من القسط</p>
                    </div>
                </div>
                
                <div class="text-right">
                    <div class="mb-2">
                        <span class="commission-badge pending">معلق</span>
                    </div>
                    <p class="text-gray-500 text-sm">المبلغ المخصص</p>
                    <p class="amount-display agent-total" id="agent-total-${commissionId}">0 ج.م</p>
                </div>
            </div>
        `;
        
        salesContainer.appendChild(agentCard);
        
        // Add event listener
        const amountInput = agentCard.querySelector('.commission-amount');
        if (amountInput) {
            amountInput.addEventListener('input', function() {
                updateAgentCommission(commissionId, this.value);
            });
        }
        
        // Calculate initial commission
        calculateCommissions();
    }
    
    // Update agent commission
    function updateAgentCommission(commissionId, value) {
        const commission = currentCommissions.find(c => c.id === commissionId);
        if (!commission) return;
        
        const numericValue = parseFloat(value) || 0;
        commission.amount = numericValue;
        
        // Update agent inputs
        updateAgentInputs(commissionId, commission.amount);
        
        // Calculate commissions
        calculateCommissions();
    }
    
    // Make updateAgentCommission available globally for HTML oninput
    window.updateAgentCommission = updateAgentCommission;
    
    // Update agent inputs
    function updateAgentInputs(commissionId, amount) {
        const agentCard = document.querySelector(`[data-commission-id="${commissionId}"]`);
        if (agentCard) {
            const amountInput = agentCard.querySelector('.commission-amount');
            const totalDisplay = agentCard.querySelector('.agent-total');
            const percentageDisplay = document.getElementById(`commission-percentage-${commissionId}`);
            
            if (amountInput) amountInput.value = amount;
            if (totalDisplay) totalDisplay.textContent = formatCurrency(amount);
            
            // Calculate and show percentage
            if (percentageDisplay && currentPolicy && currentPolicy.totalPremium) {
                const percentage = (amount / currentPolicy.totalPremium) * 100;
                percentageDisplay.textContent = `${percentage.toFixed(2)}% من القسط`;
            }
        }
    }
    
    // Calculate commissions and update summary
    function calculateCommissions() {
        if (!currentPolicy) return;
        
        const totalCommission = currentCommissions.reduce((sum, c) => sum + c.amount, 0);
        const totalPremium = currentPolicy.totalPremium;
        
        // Update total commission display
        const totalCommissionElement = document.getElementById('total-commission');
        if (totalCommissionElement) {
            totalCommissionElement.textContent = formatCurrency(totalCommission);
        }
        
        // Update progress bar
        const progressBar = document.getElementById('total-commission-progress');
        if (progressBar) {
            const progressPercentage = Math.min((totalCommission / totalPremium) * 100, 100);
            progressBar.style.width = `${progressPercentage}%`;
        }
        
        // Check if commission exceeds premium
        if (totalCommission > totalPremium) {
            if (typeof showSuccessMessage === 'function') {
                showSuccessMessage('تحذير: إجمالي العمولات يتجاوز القسط الإجمالي!', 'warning');
            }
        }
    }
    
    // Update sales count
    function updateSalesCount() {
        const salesCountElement = document.getElementById('sales-count');
        if (salesCountElement) {
            const count = currentCommissions.length;
            salesCountElement.textContent = `${count} موظف مبيعات`;
        }
    }
    
    // Helper function to format currency
    function formatCurrency(amount) {
        return amount.toLocaleString('ar-SA') + ' ج.م';
    }
    
    // Add warning message function
    if (!window.showSuccessMessage) {
        window.showSuccessMessage = function(message, type = 'success') {
            const messageDiv = document.createElement('div');
            messageDiv.className = `fixed top-4 left-4 px-6 py-3 rounded-lg shadow-lg z-50 success-message ${
                type === 'warning' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
            }`;
            messageDiv.style.right = '1rem';
            messageDiv.style.left = 'auto';
            messageDiv.innerHTML = `
                <div class="flex items-center">
                    <i class="fas ${type === 'warning' ? 'fa-exclamation-triangle' : 'fa-check-circle'} ml-2"></i>
                    <span class="mr-2">${message}</span>
                </div>
            `;
    
            document.body.appendChild(messageDiv);
    
            setTimeout(() => {
                messageDiv.classList.add('opacity-0', 'transition-opacity', 'duration-300');
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        document.body.removeChild(messageDiv);
                    }
                }, 300);
            }, 3000);
        };
    }
    
    // Auto-search on page load for demo
    setTimeout(() => {
        if (!currentPolicy) {
            const searchInput = document.getElementById('policy-search');
            if (searchInput) {
                searchInput.value = '2458';
                searchPolicy();
            }
        }
    }, 500);
})();