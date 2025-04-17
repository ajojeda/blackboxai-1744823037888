// User Management
let currentUser = null;
const requiredPermissions = {
    'User Management': ['USER_READ', 'USER_WRITE'],
    'Role Management': ['ROLE_READ', 'ROLE_WRITE'],
    'Permissions': ['PERMISSION_READ', 'PERMISSION_WRITE'],
    'System Settings': ['SETTINGS_READ', 'SETTINGS_WRITE']
};

// Authentication Check
async function checkAuth() {
    try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (!token || !storedUser) {
            redirectToLogin();
            return;
        }

        // Use stored user data
        currentUser = JSON.parse(storedUser);

        // Check if user is admin
        if (!currentUser.roles.includes('ADMIN')) {
            redirectToLogin();
            return;
        }
        
        // Update user info in the header
        const userSpan = document.querySelector('.text-gray-500');
        if (userSpan && currentUser.firstName && currentUser.lastName) {
            userSpan.textContent = `Welcome, ${currentUser.firstName} ${currentUser.lastName}`;
        }

        // Initialize UI based on permissions
        initializeUIBasedOnPermissions();
        initializeLogout();
    } catch (error) {
        console.error('Auth check failed:', error);
        redirectToLogin();
    }
}

function redirectToLogin() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

// Initialize Logout
function initializeLogout() {
    const logoutButton = document.querySelector('button[onclick*="localStorage.clear()"]');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent the inline onclick from firing
            try {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                showToast('Logging out...', 'success');
                setTimeout(() => {
                    window.location.href = '/login.html';
                }, 1000);
            } catch (error) {
                console.error('Error during logout:', error);
                showToast('Error during logout', 'error');
            }
        });
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
        'User Management': 'userManagementSection',
        'Role Management': 'roleManagementSection',
        'Permissions': 'permissionsSection',
        'System Settings': 'systemSettingsSection'
    };

    const tabs = document.querySelectorAll('nav[aria-label="Tabs"] button');
    
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

// Delete Button Management
function initializeDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.text-red-600');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                const section = btn.closest('.management-section');
                if (!section) return;

                const sectionId = section.id;
                const permission = sectionId === 'userManagementSection' ? 'USER_WRITE' :
                                 sectionId === 'roleManagementSection' ? 'ROLE_WRITE' :
                                 'PERMISSION_WRITE';

                if (!hasPermission([permission])) {
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

// Edit Button Management
function initializeEditButtons() {
    const editButtons = document.querySelectorAll('.text-indigo-600');
    editButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            try {
                const section = btn.closest('.management-section');
                if (!section) return;

                const sectionId = section.id;
                const permission = sectionId === 'userManagementSection' ? 'USER_WRITE' :
                                 sectionId === 'roleManagementSection' ? 'ROLE_WRITE' :
                                 'PERMISSION_WRITE';

                if (!hasPermission([permission])) {
                    showToast('Access denied: Insufficient permissions', 'error');
                    return;
                }

                // Here you would typically show an edit form or modal
                showToast('Edit functionality coming soon!');
            } catch (error) {
                console.error('Error initializing edit:', error);
                showToast('Error initializing edit', 'error');
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

// Initialize UI based on user permissions
function initializeUIBasedOnPermissions() {
    const tabs = document.querySelectorAll('nav[aria-label="Tabs"] button');
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
        initializeDeleteButtons();
        initializeEditButtons();
    } catch (error) {
        console.error('Error initializing admin module:', error);
        showToast('Error initializing module', 'error');
    }
});
