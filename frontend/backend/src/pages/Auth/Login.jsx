import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, this would make an API call
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('user', JSON.stringify({
            firstName: 'Demo',
            lastName: 'User',
            isTopLevelAdmin: true,
            permissions: ['*']
        }));
        
        // Redirect to the page they were trying to access, or dashboard as default
        const from = location.state?.from?.pathname || '/backend/dashboard';
        navigate(from, { replace: true });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-goodierun-primary to-goodierun-secondary flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-center text-4xl font-extrabold text-white mb-2">
                    GoodieRun
                </h1>
                <h2 className="text-center text-xl font-semibold text-white/80">
                    Backend Dashboard
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-goodierun-gray">
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    autoComplete="username"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-goodierun-primary focus:border-goodierun-primary"
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-goodierun-gray">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-goodierun-primary focus:border-goodierun-primary"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-goodierun-primary focus:ring-goodierun-primary border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-goodierun-gray">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <button 
                                    type="button"
                                    className="font-medium text-goodierun-primary hover:text-goodierun-secondary"
                                    onClick={() => alert('Password reset functionality coming soon!')}
                                >
                                    Forgot your password?
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-goodierun-primary hover:bg-goodierun-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-goodierun-primary transition-colors duration-200"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
