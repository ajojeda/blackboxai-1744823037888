import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/Auth/PrivateRoute';

// Lazy load components for better performance
const Login = React.lazy(() => import('./pages/Auth/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const WarehouseManagement = React.lazy(() => import('./pages/ERP/WarehouseManagement'));
const ContractManagement = React.lazy(() => import('./pages/ERP/ContractManagement'));
const UserManagement = React.lazy(() => import('./pages/Users/UserManagement'));
const RoleManagement = React.lazy(() => import('./pages/Users/RoleManagement'));
const Settings = React.lazy(() => import('./pages/Settings/Settings'));

// Loading component for lazy-loaded routes
const LoadingFallback = () => (
    <div className="loading-fallback">
        <div className="spinner"></div>
        <p>Loading...</p>
    </div>
);

const App = () => {
    return (
        <Router>
            <React.Suspense fallback={<LoadingFallback />}>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    
                    {/* Redirect root to login if not authenticated */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    
                    {/* Protected backend routes */}
                    <Route
                        path="/backend"
                        element={
                            <PrivateRoute>
                                <Layout />
                            </PrivateRoute>
                        }
                    >
                        <Route path="dashboard" element={<Dashboard />} />
                        
                        {/* ERP Routes */}
                        <Route path="erp">
                            <Route path="warehouse" element={<WarehouseManagement />} />
                            <Route path="warehouse/create" element={<WarehouseManagement mode="create" />} />
                            <Route path="warehouse/list" element={<WarehouseManagement mode="list" />} />
                            
                            <Route path="contracts" element={<ContractManagement />} />
                            <Route path="contracts/create" element={<ContractManagement mode="create" />} />
                            <Route path="contracts/list" element={<ContractManagement mode="list" />} />
                        </Route>
                        
                        {/* User Management Routes */}
                        <Route path="users">
                            <Route index element={<UserManagement />} />
                            <Route path="create" element={<UserManagement mode="create" />} />
                            <Route path="list" element={<UserManagement mode="list" />} />
                        </Route>
                        
                        {/* Role Management Routes */}
                        <Route path="roles">
                            <Route index element={<RoleManagement />} />
                            <Route path="create" element={<RoleManagement mode="create" />} />
                            <Route path="list" element={<RoleManagement mode="list" />} />
                        </Route>
                        
                        {/* Settings Route */}
                        <Route path="settings" element={<Settings />} />
                        
                        {/* Catch all route - redirect to dashboard */}
                        <Route path="*" element={<Navigate to="/backend/dashboard" replace />} />
                    </Route>
                </Routes>
            </React.Suspense>
        </Router>
    );
};

export default App;
