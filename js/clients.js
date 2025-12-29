// clients.js - Clients Management Page
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
        
        // Initialize clients page
        initClientsPage();
        
        // Load clients data
        loadClients();
    });
    
    // Sample clients data
    const sampleClients = [
        {
            id: 1,
            name: 'منة',
            phone: '55555987412',
            email: 'mona@example.com',
            address: 'القاهرة - مصر',
            idNumber: '29901011234567',
            policiesCount: 3,
            totalPremium: 45000,
            status: 'active',
            type: 'premium',
            joinDate: '2023-05-15'
        },
        {
            id: 2,
            name: 'أحمد محمد',
            phone: '55551234567',
            email: 'ahmed@example.com',
            address: 'الإسكندرية - مصر',
            idNumber: '29902021234567',
            policiesCount: 5,
            totalPremium: 125000,
            status: 'active',
            type: 'vip',
            joinDate: '2022-11-20'
        },
        {
            id: 3,
            name: 'سارة أحمد',
            phone: '55552345678',
            email: 'sara@example.com',
            address: 'الجيزة - مصر',
            idNumber: '29903031234567',
            policiesCount: 2,
            totalPremium: 28000,
            status: 'active',
            type: 'premium',
            joinDate: '2024-01-10'
        },
        {
            id: 4,
            name: 'محمد علي',
            phone: '55553456789',
            email: 'mohamed@example.com',
            address: 'المنصورة - مصر',
            idNumber: '29904041234567',
            policiesCount: 1,
            totalPremium: 15000,
            status: 'inactive',
            type: 'standard',
            joinDate: '2023-08-05'
        },
        {
            id: 5,
            name: 'خالد سعيد',
            phone: '55554567890',
            email: 'khaled@example.com',
            address: 'أسوان - مصر',
            idNumber: '29905051234567',
            policiesCount: 4,
            totalPremium: 85000,
            status: 'active',
            type: 'vip',
            joinDate: '2022-03-12'
        },
        {
            id: 6,
            name: 'فاطمة عمر',
            phone: '55555678901',
            email: 'fatima@example.com',
            address: 'الأقصر - مصر',
            idNumber: '29906061234567',
            policiesCount: 2,
            totalPremium: 32000,
            status: 'new',
            type: 'premium',
            joinDate: '2024-02-28'
        },
        {
            id: 7,
            name: 'علي حسن',
            phone: '55556789012',
            email: 'ali@example.com',
            address: 'بورسعيد - مصر',
            idNumber: '29907071234567',
            policiesCount: 6,
            totalPremium: 195000,
            status: 'active',
            type: 'vip',
            joinDate: '2021-09-30'
        },
        {
            id: 8,
            name: 'نورا كمال',
            phone: '55557890123',
            email: 'nora@example.com',
            address: 'المنيا - مصر',
            idNumber: '29908081234567',
            policiesCount: 1,
            totalPremium: 12000,
            status: 'inactive',
            type: 'standard',
            joinDate: '2023-12-15'
        },
        {
            id: 9,
            name: 'ياسر ربيع',
            phone: '55558901234',
            email: 'yasser@example.com',
            address: 'سوهاج - مصر',
            idNumber: '29909091234567',
            policiesCount: 3,
            totalPremium: 55000,
            status: 'active',
            type: 'premium',
            joinDate: '2023-07-22'
        },
        {
            id: 10,
            name: 'هناء وليد',
            phone: '55559012345',
            email: 'hala@example.com',
            address: 'قنا - مصر',
            idNumber: '29910101234567',
            policiesCount: 2,
            totalPremium: 42000,
            status: 'new',
            type: 'standard',
            joinDate: '2024-03-05'
        }
    ];
    
    // Current state
    let clients = [...sampleClients];
    let filteredClients = [...sampleClients];
    let currentPage = 1;
    const itemsPerPage = 10;
    
    function initClientsPage() {
        // Initialize search
        const searchInput = document.getElementById('client-search');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, 300));
        }
        
        // Initialize filter dropdown
        const filterToggle = document.getElementById('filter-toggle');
        const filterDropdown = document.getElementById('filter-dropdown');
        
        if (filterToggle && filterDropdown) {
            filterToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                filterDropdown.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!filterToggle.contains(e.target) && !filterDropdown.contains(e.target)) {
                    filterDropdown.classList.remove('show');
                }
            });
        }
        
        // Initialize client form
        const clientForm = document.getElementById('clientForm');
        if (clientForm) {
            clientForm.addEventListener('submit', handleClientForm);
        }
        
        // Initialize modal
        initModal();
    }
    
    function initModal() {
        const modal = document.getElementById('addClientModal');
        if (modal) {
            // Add click handler for modal overlay
            modal.querySelector('.modal-overlay')?.addEventListener('click', closeAddClientModal);
            
            // Close modal with ESC key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                    closeAddClientModal();
                }
            });
        }
    }
    
    // Modal functions
    function openAddClientModal() {
        const modal = document.getElementById('addClientModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Add modal enter animation
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.classList.add('modal-enter');
            }
        }
    }
    
    function closeAddClientModal() {
        const modal = document.getElementById('addClientModal');
        if (modal) {
            // Add exit animation
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.classList.remove('modal-enter');
                modalContent.classList.add('modal-exit');
                
                // Wait for animation to complete
                setTimeout(() => {
                    modal.classList.add('hidden');
                    modalContent.classList.remove('modal-exit');
                    document.body.style.overflow = 'auto';
                    
                    // Reset form
                    const form = document.getElementById('clientForm');
                    if (form) form.reset();
                }, 200);
            } else {
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        }
    }
    
    // Make modal functions available globally
    window.openAddClientModal = openAddClientModal;
    window.closeAddClientModal = closeAddClientModal;
    
    // Load clients data
    function loadClients() {
        const loadingState = document.getElementById('loading-state');
        const tableBody = document.getElementById('clients-table-body');
        const emptyState = document.getElementById('empty-state');
        
        if (loadingState) loadingState.classList.remove('hidden');
        if (tableBody) tableBody.innerHTML = '';
        
        // Simulate API call
        setTimeout(() => {
            if (loadingState) loadingState.classList.add('hidden');
            
            if (filteredClients.length === 0) {
                if (emptyState) emptyState.classList.remove('hidden');
                return;
            }
            
            if (emptyState) emptyState.classList.add('hidden');
            
            // Calculate pagination
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedClients = filteredClients.slice(startIndex, endIndex);
            
            // Update pagination info
            updatePaginationInfo(startIndex, endIndex);
            
            // Render clients
            renderClients(paginatedClients);
            
            // Update statistics
            updateStatistics();
        }, 800);
    }
    
    // Render clients to table
    function renderClients(clientsList) {
        const tableBody = document.getElementById('clients-table-body');
        if (!tableBody) return;
        
        tableBody.innerHTML = clientsList.map(client => `
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                <td class="py-4 px-4">
                    <div class="flex items-center gap-4">
                        <div class="client-avatar bg-gradient-to-r ${getClientColor(client.type)}">
                            ${client.name.charAt(0)}
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-800">${client.name}</h4>
                            <p class="text-gray-600 text-sm">رقم الهوية: ${client.idNumber}</p>
                            <p class="text-gray-500 text-xs mt-1">
                                <i class="fas fa-calendar-alt ml-1"></i>
                                انضم في ${formatDate(client.joinDate)}
                            </p>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-4">
                    <div class="space-y-2">
                        <p class="flex items-center text-gray-700">
                            <i class="fas fa-phone ml-2 text-blue-500"></i>
                            ${client.phone}
                        </p>
                        <p class="flex items-center text-gray-700">
                            <i class="fas fa-envelope ml-2 text-green-500"></i>
                            ${client.email}
                        </p>
                        <p class="flex items-center text-gray-700 text-sm">
                            <i class="fas fa-map-marker-alt ml-2 text-amber-500"></i>
                            ${client.address}
                        </p>
                    </div>
                </td>
                <td class="py-4 px-4">
                    <div class="space-y-2">
                        <div class="flex items-center gap-2">
                            <span class="policy-count">${client.policiesCount} وثائق</span>
                            <span class="client-badge ${getBadgeClass(client.type)}">${getTypeLabel(client.type)}</span>
                        </div>
                        <p class="text-gray-700 text-sm">
                            <i class="fas fa-money-bill-wave ml-1"></i>
                            إجمالي الأقساط: ${formatCurrency(client.totalPremium)}
                        </p>
                    </div>
                </td>
                <td class="py-4 px-4">
                    <span class="client-status ${getStatusClass(client.status)}">
                        ${getStatusLabel(client.status)}
                    </span>
                </td>
                <td class="py-4 px-4">
                    <div class="flex items-center gap-2">
                        <button onclick="viewClientDetails(${client.id})" 
                                class="action-btn text-blue-500 hover:text-blue-600"
                                title="عرض التفاصيل">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="editClient(${client.id})" 
                                class="action-btn text-green-500 hover:text-green-600"
                                title="تعديل">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteClient(${client.id})" 
                                class="action-btn text-red-500 hover:text-red-600"
                                title="حذف">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    // Update pagination information
    function updatePaginationInfo(startIndex, endIndex) {
        const startElement = document.getElementById('start-index');
        const endElement = document.getElementById('end-index');
        const totalElement = document.getElementById('total-items');
        
        if (startElement) startElement.textContent = startIndex + 1;
        if (endElement) endElement.textContent = Math.min(endIndex, filteredClients.length);
        if (totalElement) totalElement.textContent = filteredClients.length;
        
        // Update pagination buttons
        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');
        
        if (prevButton) {
            prevButton.disabled = currentPage === 1;
        }
        
        if (nextButton) {
            const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
            nextButton.disabled = currentPage === totalPages;
        }
    }
    
    // Update statistics
    function updateStatistics() {
        const totalClients = clients.length;
        const activeClients = clients.filter(c => c.status === 'active').length;
        const activePolicies = clients.reduce((sum, c) => sum + c.policiesCount, 0);
        const totalPremiums = clients.reduce((sum, c) => sum + c.totalPremium, 0);
        
        // Update DOM elements
        const totalElement = document.getElementById('total-clients');
        const activeElement = document.getElementById('active-clients');
        const policiesElement = document.getElementById('active-policies');
        const premiumsElement = document.getElementById('total-premiums');
        
        if (totalElement) totalElement.textContent = totalClients;
        if (activeElement) activeElement.textContent = activeClients;
        if (policiesElement) policiesElement.textContent = activePolicies;
        if (premiumsElement) premiumsElement.textContent = formatCurrency(totalPremiums / 1000000) + 'M';
    }
    
    // Handle search
    function handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            filteredClients = [...clients];
        } else {
            filteredClients = clients.filter(client => 
                client.name.toLowerCase().includes(searchTerm) ||
                client.phone.includes(searchTerm) ||
                client.email.toLowerCase().includes(searchTerm) ||
                client.idNumber.includes(searchTerm) ||
                client.address.toLowerCase().includes(searchTerm)
            );
        }
        
        currentPage = 1;
        loadClients();
    }
    
    // Apply filters
    function applyFilters() {
        const statusCheckboxes = document.querySelectorAll('input[value="active"], input[value="inactive"], input[value="new"]');
        const typeCheckboxes = document.querySelectorAll('input[value="premium"], input[value="standard"], input[value="vip"]');
        
        const selectedStatuses = Array.from(statusCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        const selectedTypes = Array.from(typeCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        filteredClients = clients.filter(client => 
            selectedStatuses.includes(client.status) && 
            selectedTypes.includes(client.type)
        );
        
        currentPage = 1;
        loadClients();
        
        // Close filter dropdown
        const filterDropdown = document.getElementById('filter-dropdown');
        if (filterDropdown) {
            filterDropdown.classList.remove('show');
        }
    }
    
    // Make applyFilters available globally
    window.applyFilters = applyFilters;
    
    // Change page
    function changePage(pageNumber) {
        const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
        
        if (pageNumber === -1) {
            // Previous page
            if (currentPage > 1) {
                currentPage--;
            }
        } else if (pageNumber === 1) {
            // Next page
            if (currentPage < totalPages) {
                currentPage++;
            }
        } else {
            // Specific page
            currentPage = pageNumber;
        }
        
        loadClients();
    }
    
    // Make changePage available globally
    window.changePage = changePage;
    
    // Handle client form submission
    function handleClientForm(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(e.target);
        const formObject = Object.fromEntries(formData.entries());
        
        // Create new client object
        const newClient = {
            id: clients.length + 1,
            name: formObject.name || '',
            phone: formObject.phone || '',
            email: formObject.email || '',
            address: formObject.address || '',
            idNumber: formObject.idNumber || '',
            policiesCount: 0,
            totalPremium: 0,
            status: formObject.clientStatus || 'active',
            type: formObject.type || 'standard',
            joinDate: new Date().toISOString().split('T')[0]
        };
        
        // Add to clients array
        clients.unshift(newClient);
        filteredClients.unshift(newClient);
        
        // Show success message
        if (typeof showSuccessMessage === 'function') {
            showSuccessMessage('تم إضافة العميل بنجاح!');
        }
        
        // Close modal
        closeAddClientModal();
        
        // Reload clients
        currentPage = 1;
        loadClients();
    }
    
    // Client actions
    function viewClientDetails(clientId) {
        const client = clients.find(c => c.id === clientId);
        if (client) {
            alert(`عرض تفاصيل العميل: ${client.name}\nالهاتف: ${client.phone}\nالبريد: ${client.email}\nالعنوان: ${client.address}\nالوثائق: ${client.policiesCount}\nالحالة: ${getStatusLabel(client.status)}`);
        }
    }
    
    function editClient(clientId) {
        const client = clients.find(c => c.id === clientId);
        if (client) {
            alert(`تعديل بيانات العميل: ${client.name}\n(في التطبيق الحقيقي، سيتم فتح نموذج التعديل)`);
        }
    }
    
    function deleteClient(clientId) {
        if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
            clients = clients.filter(c => c.id !== clientId);
            filteredClients = filteredClients.filter(c => c.id !== clientId);
            
            if (typeof showSuccessMessage === 'function') {
                showSuccessMessage('تم حذف العميل بنجاح!');
            }
            
            loadClients();
        }
    }
    
    // Make client actions available globally
    window.viewClientDetails = viewClientDetails;
    window.editClient = editClient;
    window.deleteClient = deleteClient;
    
    // Helper functions
    function getClientColor(type) {
        switch(type) {
            case 'vip': return 'from-purple-500 to-purple-600';
            case 'premium': return 'from-amber-500 to-amber-600';
            default: return 'from-blue-500 to-blue-600';
        }
    }
    
    function getBadgeClass(type) {
        switch(type) {
            case 'vip': return 'badge-vip';
            case 'premium': return 'badge-premium';
            default: return 'badge-standard';
        }
    }
    
    function getTypeLabel(type) {
        switch(type) {
            case 'vip': return 'VIP';
            case 'premium': return 'مميز';
            default: return 'عادي';
        }
    }
    
    function getStatusClass(status) {
        switch(status) {
            case 'active': return 'status-active';
            case 'inactive': return 'status-inactive';
            case 'new': return 'status-new';
            default: return 'status-active';
        }
    }
    
    function getStatusLabel(status) {
        switch(status) {
            case 'active': return 'نشط';
            case 'inactive': return 'غير نشط';
            case 'new': return 'جديد';
            default: return 'نشط';
        }
    }
    
    function formatCurrency(amount) {
        return amount.toLocaleString('ar-SA');
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-SA');
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
})();