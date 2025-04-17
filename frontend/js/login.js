// Test credentials
const TEST_CREDENTIALS = {
    email: 'admin@goodierun.com',
    password: 'Admin123!'
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = document.getElementById('submitButton');
    const buttonText = document.getElementById('buttonText');
    const buttonSpinner = document.getElementById('buttonSpinner');

    function clearInput(input) {
        input.value = '';
        hideError(input.id);
    }

    function showError(field, message) {
        const errorIcon = document.getElementById(`${field}Error`);
        const errorText = document.getElementById(`${field}ErrorText`);
        errorIcon.classList.remove('hidden');
        errorText.classList.remove('hidden');
        errorText.textContent = message;
        errorText.style.color = '#dc2626'; // red-600
    }

    function hideError(field) {
        const errorIcon = document.getElementById(`${field}Error`);
        const errorText = document.getElementById(`${field}ErrorText`);
        errorIcon.classList.add('hidden');
        errorText.classList.add('hidden');
    }

    function setLoading(isLoading) {
        submitButton.disabled = isLoading;
        buttonSpinner.classList.toggle('hidden', !isLoading);
        buttonText.textContent = isLoading ? 'Signing in...' : 'Sign in';
        emailInput.disabled = isLoading;
        passwordInput.disabled = isLoading;
    }

    // Clear inputs when clicking on them
    emailInput.addEventListener('focus', () => clearInput(emailInput));
    passwordInput.addEventListener('focus', () => clearInput(passwordInput));

    function showToast(message, type = 'error') {
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
        
        toast.className = `${bgColor} text-white px-6 py-4 rounded-lg shadow-lg mb-4 flex items-center transform transition-all duration-300`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>
            <span>${message}</span>
        `;

        const container = document.getElementById('toastContainer');
        container.appendChild(toast);

        // Animate and remove
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    emailInput.addEventListener('input', () => {
        const email = emailInput.value.trim();
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('email', 'Please enter a valid email address');
        } else {
            hideError('email');
        }
    });

    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        if (!email) {
            showError('email', 'Email is required');
        }
    });

    passwordInput.addEventListener('input', () => {
        hideError('password');
    });

    passwordInput.addEventListener('blur', () => {
        if (!passwordInput.value) {
            showError('password', 'Password is required');
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        let hasError = false;

        // Validate email
        if (!email) {
            showError('email', 'Email is required');
            hasError = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('email', 'Please enter a valid email address');
            hasError = true;
        }

        // Validate password
        if (!password) {
            showError('password', 'Password is required');
            hasError = true;
        }

        if (hasError) return;

        setLoading(true);

        try {
            // Check test credentials
            if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
                // Store test user data
                localStorage.setItem('token', 'test-token');
                localStorage.setItem('user', JSON.stringify({
                    firstName: 'Admin',
                    lastName: 'User',
                    email: TEST_CREDENTIALS.email,
                    roles: ['ADMIN'],
                    permissions: ['*'], // Wildcard permission for top-level admin
                    departments: ['*'], // Access to all departments
                    isTopLevelAdmin: true // Flag for top-level admin
                }));

                showToast('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    // Redirect to the React-based backend dashboard
                    window.location.href = 'http://localhost:8000';
                }, 1000);
            } else {
                showToast('Invalid credentials');
            }
        } catch (error) {
            showToast(error.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    });
});
