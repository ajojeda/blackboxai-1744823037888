import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main Content */}
            <main className="flex-1 ml-16 lg:ml-64 min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-semibold text-goodierun-primary">
                                GoodieRun Backend
                            </h1>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-goodierun-gray">
                                    Welcome, {JSON.parse(localStorage.getItem('user'))?.firstName || 'User'}
                                </span>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        localStorage.removeItem('user');
                                        window.location.href = '/login';
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-goodierun-primary rounded-md hover:bg-goodierun-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-goodierun-primary"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="px-4 sm:px-6 lg:px-8 py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
