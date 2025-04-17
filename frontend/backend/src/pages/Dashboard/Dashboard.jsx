import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalContracts: 0,
        pendingApprovals: 0
    });

    useEffect(() => {
        // In a real application, this would fetch data from an API
        // For now, using mock data
        setStats({
            totalUsers: 256,
            activeUsers: 245,
            totalContracts: 124,
            pendingApprovals: 5
        });
    }, []);

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard</h1>
                <div className="dashboard-actions">
                    <button className="refresh-button">
                        <i className="fas fa-sync-alt"></i>
                        Refresh
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon users">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Total Users</h3>
                        <p className="stat-number">{stats.totalUsers}</p>
                        <span className="stat-label">Registered users</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon active">
                        <i className="fas fa-user-check"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Active Users</h3>
                        <p className="stat-number">{stats.activeUsers}</p>
                        <span className="stat-label">Currently active</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon contracts">
                        <i className="fas fa-file-contract"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Total Contracts</h3>
                        <p className="stat-number">{stats.totalContracts}</p>
                        <span className="stat-label">Active contracts</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon pending">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Pending Approvals</h3>
                        <p className="stat-number">{stats.pendingApprovals}</p>
                        <span className="stat-label">Awaiting review</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card recent-activity">
                    <h2>Recent Activity</h2>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-user-plus"></i>
                            </div>
                            <div className="activity-content">
                                <p>New user registered</p>
                                <span className="activity-time">2 minutes ago</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-file-signature"></i>
                            </div>
                            <div className="activity-content">
                                <p>Contract #123 signed</p>
                                <span className="activity-time">1 hour ago</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-tasks"></i>
                            </div>
                            <div className="activity-content">
                                <p>Warehouse inventory updated</p>
                                <span className="activity-time">3 hours ago</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="action-buttons">
                        <button className="action-button">
                            <i className="fas fa-user-plus"></i>
                            Add User
                        </button>
                        <button className="action-button">
                            <i className="fas fa-file-contract"></i>
                            New Contract
                        </button>
                        <button className="action-button">
                            <i className="fas fa-warehouse"></i>
                            Update Inventory
                        </button>
                        <button className="action-button">
                            <i className="fas fa-cog"></i>
                            Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
