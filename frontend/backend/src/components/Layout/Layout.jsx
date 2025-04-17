import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

const Layout = () => {
    // Check if user is authenticated and has necessary permissions
    const user = JSON.parse(localStorage.getItem('user'));
    const isAuthenticated = !!localStorage.getItem('token');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="layout">
            <Sidebar />
            <main className="main-content">
                <header className="header">
                    <div className="header-content">
                        <div className="user-info">
                            <span className="user-name">
                                {user?.firstName} {user?.lastName}
                            </span>
                            <span className="user-role">
                                {user?.isTopLevelAdmin ? 'Administrator' : user?.roles?.[0]}
                            </span>
                        </div>
                        <div className="header-actions">
                            <button 
                                className="logout-button"
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.href = '/login';
                                }}
                            >
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </header>
                <div className="content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
