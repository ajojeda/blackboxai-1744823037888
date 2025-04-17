import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine, faWarehouse, faFileContract, faShoppingCart,
    faUsers, faUserShield, faCog, faChevronLeft, faChevronRight,
    faPlus, faList
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(() => {
        const stored = localStorage.getItem('sidebarExpanded');
        return stored ? JSON.parse(stored) : true;
    });
    
    const [activeSection, setActiveSection] = useState(null);
    const [userPermissions, setUserPermissions] = useState([]);
    const location = useLocation();

    useEffect(() => {
        // Load user permissions from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserPermissions(user.permissions || []);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('sidebarExpanded', JSON.stringify(isExpanded));
    }, [isExpanded]);

    const hasPermission = (requiredPermission) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.isTopLevelAdmin || userPermissions.includes('*')) {
            return true;
        }
        return userPermissions.includes(requiredPermission);
    };

    const navigationItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: faChartLine,
            permission: 'DASHBOARD_VIEW',
            path: '/backend/dashboard'
        },
        {
            id: 'erp',
            label: 'ERP',
            icon: faWarehouse,
            permission: 'ERP_ACCESS',
            subItems: [
                {
                    id: 'warehouse',
                    label: 'Warehouse Management',
                    permission: 'WAREHOUSE_ACCESS',
                    path: '/backend/erp/warehouse',
                    actions: [
                        { label: 'Create Record', icon: faPlus, path: '/backend/erp/warehouse/create' },
                        { label: 'View All', icon: faList, path: '/backend/erp/warehouse/list' }
                    ]
                },
                {
                    id: 'contracts',
                    label: 'Contract Management',
                    permission: 'CONTRACT_ACCESS',
                    path: '/backend/erp/contracts',
                    actions: [
                        { label: 'Create Contract', icon: faPlus, path: '/backend/erp/contracts/create' },
                        { label: 'View All', icon: faList, path: '/backend/erp/contracts/list' }
                    ]
                }
            ]
        },
        {
            id: 'pos',
            label: 'Point of Sale',
            icon: faShoppingCart,
            permission: 'POS_ACCESS',
            path: '/backend/pos'
        },
        {
            id: 'users',
            label: 'User Management',
            icon: faUsers,
            permission: 'USER_MANAGEMENT',
            subItems: [
                {
                    id: 'users-list',
                    label: 'Users',
                    permission: 'USER_VIEW',
                    path: '/backend/users',
                    actions: [
                        { label: 'Create User', icon: faPlus, path: '/backend/users/create' },
                        { label: 'View All', icon: faList, path: '/backend/users/list' }
                    ]
                },
                {
                    id: 'roles',
                    label: 'Roles & Permissions',
                    permission: 'ROLE_VIEW',
                    path: '/backend/roles',
                    actions: [
                        { label: 'Create Role', icon: faPlus, path: '/backend/roles/create' },
                        { label: 'View All', icon: faList, path: '/backend/roles/list' }
                    ]
                }
            ]
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: faCog,
            permission: 'SETTINGS_ACCESS',
            path: '/backend/settings'
        }
    ];

    const handleMouseEnter = (sectionId) => {
        setActiveSection(sectionId);
    };

    const handleMouseLeave = () => {
        setActiveSection(null);
    };

    return (
        <div 
            className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
            onMouseLeave={handleMouseLeave}
        >
            <button 
                className="toggle-button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
                <FontAwesomeIcon icon={isExpanded ? faChevronLeft : faChevronRight} />
            </button>

            <div className="sidebar-content">
                {navigationItems.map(item => {
                    if (!hasPermission(item.permission)) return null;

                    return (
                        <div 
                            key={item.id}
                            className="nav-item-container"
                            onMouseEnter={() => handleMouseEnter(item.id)}
                        >
                            <Link
                                to={item.path || '#'}
                                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <FontAwesomeIcon icon={item.icon} className="nav-icon" />
                                {isExpanded && <span className="nav-label">{item.label}</span>}
                            </Link>

                            {item.subItems && (activeSection === item.id || isExpanded) && (
                                <div className={`submenu ${isExpanded ? 'expanded' : ''}`}>
                                    {item.subItems.map(subItem => {
                                        if (!hasPermission(subItem.permission)) return null;

                                        return (
                                            <div key={subItem.id} className="submenu-item">
                                                <Link
                                                    to={subItem.path}
                                                    className={`submenu-link ${location.pathname === subItem.path ? 'active' : ''}`}
                                                >
                                                    <span>{subItem.label}</span>
                                                </Link>
                                                {subItem.actions && (
                                                    <div className="submenu-actions">
                                                        {subItem.actions.map(action => (
                                                            <Link
                                                                key={action.path}
                                                                to={action.path}
                                                                className="action-link"
                                                                title={action.label}
                                                            >
                                                                <FontAwesomeIcon icon={action.icon} />
                                                                <span>{action.label}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;
