// Tab Management
function initializeTabs() {
    const tabs = document.querySelectorAll('nav button');
    const sections = document.querySelectorAll('.management-section');

    if (!tabs.length || !sections.length) {
        console.error('Tabs or sections not found');
        return;
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            try {
                // Update tab styles
                tabs.forEach(t => {
                    t.classList.remove('border-indigo-500', 'text-indigo-600');
                    t.classList.add('border-transparent', 'text-gray-500');
                });
                tab.classList.remove('border-transparent', 'text-gray-500');
                tab.classList.add('border-indigo-500', 'text-indigo-600');

                // Show/hide sections
                sections.forEach((section, sectionIndex) => {
                    if (sectionIndex === index) {
                        section.classList.remove('hidden');
                    } else {
                        section.classList.add('hidden');
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
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                const formType = form.getAttribute('data-form-type') || 'Form';
                
                // Here you would typically make an API call
                console.log(`${formType} form submitted:`, data);
                showToast(`${formType} saved successfully!`);
                form.reset();
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
        btn.addEventListener('click', () => {
            try {
                if (confirm('Are you sure you want to delete this item?')) {
                    // Here you would typically make an API call
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
    
    toast.className = `${bgColor} text-white px-6 py-4 rounded-lg shadow-lg mb-4 flex items-center`;
    toast.innerHTML = `
        <i class="fas ${icon} mr-2"></i>
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add Form Toggle
function initializeAddButtons() {
    const addButtons = document.querySelectorAll('button[class*="bg-indigo-600"]');
    addButtons.forEach(button => {
        const section = button.closest('.management-section');
        if (!section) return;

        const form = section.querySelector('form');
        if (!form) return;

        button.addEventListener('click', () => {
            try {
                const isHidden = form.classList.contains('hidden');
                if (isHidden) {
                    form.classList.remove('hidden');
                    button.innerHTML = '<i class="fas fa-times mr-2"></i>Cancel';
                } else {
                    form.classList.add('hidden');
                    button.innerHTML = '<i class="fas fa-plus mr-2"></i>Add';
                }
            } catch (error) {
                console.error('Error toggling form:', error);
            }
        });
    });
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeTabs();
        initializeForms();
        initializeDeleteButtons();
        initializeAddButtons();
    } catch (error) {
        console.error('Error initializing admin dashboard:', error);
    }
});
