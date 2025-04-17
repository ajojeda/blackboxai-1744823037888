// User Permissions and Role Management
let currentUser = null;
const requiredPermissions = {
    'Contract Management': ['CONTRACT_READ', 'CONTRACT_WRITE'],
    'Warehouse Management': ['WAREHOUSE_READ', 'WAREHOUSE_WRITE'],
    'Procurement': ['PROCUREMENT_READ', 'PROCUREMENT_WRITE'],
    'Inventory Control': ['INVENTORY_READ', 'INVENTORY_WRITE']
};

// Authentication Check
function checkAuth() {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!token || !storedUser) {
        window.location.href = '/login.html';
        return;
    }

    try {
        // Use stored user data
        currentUser = JSON.parse(storedUser);
        
        // Update user info in the header
        const userSpan = document.querySelector('.text-gray-500');
        if (userSpan && currentUser.firstName && currentUser.lastName) {
            userSpan.textContent = `Welcome, ${currentUser.firstName} ${currentUser.lastName}`;
        }

        // Initialize UI based on permissions
        initializeUIBasedOnPermissions();
    } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }
}

// Permission Check
function hasPermission(requiredPermissions) {
    if (!currentUser || !currentUser.permissions) return false;
    if (currentUser.roles.includes('ADMIN')) return true;
    return requiredPermissions.some(permission => 
        currentUser.permissions.includes(permission)
    );
}

// Tab Management
function initializeTabs() {
    const tabsMap = {
        'Contract Management': 'contractSection',
        'Warehouse Management': 'warehouseSection',
        'Procurement': 'procurementSection',
        'Inventory Control': 'inventorySection'
    };

    const tabs = document.querySelectorAll('nav button');
    
    if (!tabs.length) {
        console.error('Tabs not found');
        return;
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            try {
                const tabText = tab.textContent.trim();
                const sectionId = tabsMap[tabText];

                if (!sectionId) {
                    console.error('No matching section for tab:', tabText);
                    return;
                }

                // Check permissions before switching tabs
                if (!hasPermission(requiredPermissions[tabText])) {
                    showToast('Access denied: Insufficient permissions', 'error');
                    return;
                }

                // Update tab styles
                tabs.forEach(t => {
                    t.classList.remove('border-indigo-500', 'text-indigo-600');
                    t.classList.add('border-transparent', 'text-gray-500');
                });
                tab.classList.remove('border-transparent', 'text-gray-500');
                tab.classList.add('border-indigo-500', 'text-indigo-600');

                // Show/hide sections
                Object.values(tabsMap).forEach(id => {
                    const section = document.getElementById(id);
                    if (section) {
                        if (id === sectionId) {
                            section.classList.remove('hidden');
                        } else {
                            section.classList.add('hidden');
                        }
                    }
                });
            } catch (error) {
                console.error('Error switching tabs:', error);
                showToast('Error switching tabs', 'error');
            }
        });
    });
}

// Form Management
function initializeForms() {
    const forms = document.querySelectorAll('form[data-form-type]');
    const addButtons = document.querySelectorAll('button[class*="bg-indigo-600"]:not([type="submit"])');
    const cancelButtons = document.querySelectorAll('.cancel-form-btn');

    // Add button click handlers
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.closest('.management-section');
            if (!section) return;

            const form = section.querySelector('form');
            if (!form) return;

            try {
                const formType = form.getAttribute('data-form-type');
                // Check write permissions
                if (!hasPermission([`${formType.toUpperCase()}_WRITE`])) {
                    showToast('Access denied: Insufficient permissions', 'error');
                    return;
                }

                // Toggle form visibility
                form.classList.toggle('hidden');
                
                // Update button text
                const isFormVisible = !form.classList.contains('hidden');
                button.innerHTML = isFormVisible ? 
                    '<i class="fas fa-times mr-2"></i>Cancel' : 
                    `<i class="fas fa-plus mr-2"></i>New ${formType}`;

                if (isFormVisible && formType === 'PurchaseOrder') {
                    initializeItemSelection();
                }
            } catch (error) {
                console.error('Error toggling form:', error);
                showToast('Error toggling form', 'error');
            }
        });
    });

    // Cancel button click handlers
    cancelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const form = button.closest('form');
            if (!form) return;

            try {
                // Reset and hide form
                form.reset();
                form.classList.add('hidden');

                // Reset add button text
                const section = form.closest('.management-section');
                const addButton = section?.querySelector('button[class*="bg-indigo-600"]:not([type="submit"])');
                const formType = form.getAttribute('data-form-type');
                if (addButton) {
                    addButton.innerHTML = `<i class="fas fa-plus mr-2"></i>New ${formType}`;
                }
            } catch (error) {
                console.error('Error canceling form:', error);
                showToast('Error canceling form', 'error');
            }
        });
    });

    // Form submit handlers
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const formType = form.getAttribute('data-form-type');
                // Check write permissions
                if (!hasPermission([`${formType.toUpperCase()}_WRITE`])) {
                    showToast('Access denied: Insufficient permissions', 'error');
                    return;
                }

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Here you would typically make an API call
                console.log(`${formType} form submitted:`, data);
                
                // Show success message and reset form
                showToast(`${formType} saved successfully!`);
                form.reset();
                form.classList.add('hidden');

                // Reset add button text
                const section = form.closest('.management-section');
                const addButton = section?.querySelector('button[class*="bg-indigo-600"]:not([type="submit"])');
                if (addButton) {
                    addButton.innerHTML = `<i class="fas fa-plus mr-2"></i>New ${formType}`;
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                showToast('Error saving data', 'error');
            }
        });
    });
}

// Item Selection Management
function initializeItemSelection() {
    const itemsContainer = document.querySelector('form[data-form-type="PurchaseOrder"] .space-y-2');
    if (!itemsContainer) {
        console.error('Items container not found');
        return;
    }

    function setupItemRow(row) {
        const select = row.querySelector('select');
        const quantityInput = row.querySelector('input[name="quantity"]');
        const priceInput = row.querySelector('input[name="price"]');
        const deleteButton = row.querySelector('.text-red-600');

        if (select) {
            select.addEventListener('change', () => {
                const isSelected = select.value !== '';
                if (quantityInput) quantityInput.disabled = !isSelected;
                if (priceInput) priceInput.disabled = !isSelected;
            });
        }

        // Handle delete button
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                const allRows = itemsContainer.querySelectorAll('.flex.items-center');
                if (allRows.length > 1) {
                    row.remove();
                } else {
                    // Reset the last row instead of removing it
                    if (select) select.value = '';
                    if (quantityInput) {
                        quantityInput.value = '';
                        quantityInput.disabled = true;
                    }
                    if (priceInput) {
                        priceInput.value = '';
                        priceInput.disabled = true;
                    }
                }
            });
        }
    }

    // Set up existing rows
    const existingRows = itemsContainer.querySelectorAll('.flex.items-center');
    existingRows.forEach(setupItemRow);

    // Handle "Add Item" button
    const addItemButton = itemsContainer.parentElement.querySelector('button.text-indigo-600');
    if (addItemButton) {
        addItemButton.addEventListener('click', () => {
            try {
                const firstRow = itemsContainer.querySelector('.flex.items-center');
                if (firstRow) {
                    const newRow = firstRow.cloneNode(true);
                    
                    // Reset values
                    const select = newRow.querySelector('select');
                    const inputs = newRow.querySelectorAll('input');
                    if (select) select.value = '';
                    inputs.forEach(input => {
                        input.value = '';
                        input.disabled = true;
                    });

                    // Add to container and set up event handlers
                    itemsContainer.appendChild(newRow);
                    setupItemRow(newRow);
                }
            } catch (error) {
                console.error('Error adding item row:', error);
                showToast('Error adding item', 'error');
            }
        });
    }
}

// Delete Button Management
function initializeDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                const section = btn.closest('.management-section');
                if (!section) return;

                const formType = section.querySelector('form')?.getAttribute('data-form-type');
                if (!formType || !hasPermission([`${formType.toUpperCase()}_WRITE`])) {
                    showToast('Access denied: Insufficient permissions', 'error');
                    return;
                }

                if (confirm('Are you sure you want to delete this item?')) {
                    // Here you would typically make an API call
                    await new Promise(resolve => setTimeout(resolve, 500));
                    showToast('Item deleted successfully!');
                }
            } catch (error) {
                console.error('Error deleting item:', error);
                showToast('Error deleting item', 'error');
            }
        });
    });
}

// Toast Messages
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        console.error('Toast container not found');
        return;
    }

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.className = `${bgColor} text-white px-6 py-4 rounded-lg shadow-lg mb-4 flex items-center transform transition-all duration-300 translate-y-0`;
    toast.innerHTML = `
        <i class="fas ${icon} mr-2"></i>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Animate toast
    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(-1rem)';
        toast.style.opacity = '1';
    });

    // Remove toast after delay
    setTimeout(() => {
        toast.style.transform = 'translateY(1rem)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Date Field Management
function initializeDateFields() {
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');

    if (startDate && endDate) {
        // Set minimum end date when start date changes
        startDate.addEventListener('change', () => {
            endDate.min = startDate.value;
            if (endDate.value && endDate.value < startDate.value) {
                endDate.value = startDate.value;
            }
        });

        // Set maximum start date when end date changes
        endDate.addEventListener('change', () => {
            startDate.max = endDate.value;
            if (startDate.value && startDate.value > endDate.value) {
                startDate.value = endDate.value;
            }
        });
    }
}

// Initialize UI based on user permissions
function initializeUIBasedOnPermissions() {
    const tabs = document.querySelectorAll('nav button');
    tabs.forEach(tab => {
        const tabText = tab.textContent.trim();
        const permissions = requiredPermissions[tabText];
        if (!hasPermission(permissions)) {
            tab.classList.add('opacity-50', 'cursor-not-allowed');
        }
    });
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        checkAuth();
        initializeTabs();
        initializeForms();
        initializeDeleteButtons();
        initializeDateFields();
    } catch (error) {
        console.error('Error initializing ERP module:', error);
        showToast('Error initializing module', 'error');
    }
});
