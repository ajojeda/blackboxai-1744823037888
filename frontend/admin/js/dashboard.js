// Tab Management
function initializeTabs() {
    const tabsMap = {
        'User Management': 'userSection',
        'Role Management': 'roleSection',
        'Site Management': 'siteSection'
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
                // Toggle form visibility
                form.classList.toggle('hidden');
                
                // Update button text
                const isFormVisible = !form.classList.contains('hidden');
                button.innerHTML = isFormVisible ? 
                    '<i class="fas fa-times mr-2"></i>Cancel' : 
                    `<i class="fas fa-plus mr-2"></i>Add ${form.getAttribute('data-form-type')}`;
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
                if (addButton) {
                    addButton.innerHTML = `<i class="fas fa-plus mr-2"></i>Add ${form.getAttribute('data-form-type')}`;
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
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Handle multiple checkbox values
                if (formData.getAll('permissions[]').length > 0) {
                    data.permissions = formData.getAll('permissions[]');
                }

                const formType = form.getAttribute('data-form-type');
                
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
                    addButton.innerHTML = `<i class="fas fa-plus mr-2"></i>Add ${formType}`;
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                showToast('Error saving data', 'error');
            }
        });
    });
}

// Delete Button Management
function initializeDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                if (confirm('Are you sure you want to delete this item?')) {
                    // Here you would typically make an API call
                    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
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

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeTabs();
        initializeForms();
        initializeDeleteButtons();
    } catch (error) {
        console.error('Error initializing admin dashboard:', error);
        showToast('Error initializing dashboard', 'error');
    }
});
