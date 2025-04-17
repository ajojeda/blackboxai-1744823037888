import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine, faWarehouse, faShoppingCart,
    faUsers, faCog, faChevronLeft, faChevronRight,
    faPlus, faList, faBars, faSearch, faChevronDown
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(() => {
        const stored = localStorage.getItem('sidebarExpanded');
        return stored ? JSON.parse(stored) : true;
    });
    
    const [activeSection, setActiveSection] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
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

    const filteredItems = navigationItems.filter(item => {
        const matchesSearch = item.label.toLowerCase().includes(searchTerm.toLowerCase());
        const hasSubItemMatch = item.subItems?.some(subItem => 
            subItem.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return matchesSearch || hasSubItemMatch;
    });

    const toggleSection = (sectionId) => {
        setActiveSection(activeSection === sectionId ? null : sectionId);
    };

    return (
        <div 
            className={`sidebar fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out
                ${isExpanded ? 'w-64' : 'w-16'}`}
        >
            {/* Hamburger Toggle */}
            <button 
                className="absolute right-0 top-4 transform translate-x-1/2 bg-goodierun-primary text-white rounded-full p-2 z-10"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
                <FontAwesomeIcon icon={isExpanded ? faChevronLeft : faChevronRight} />
            </button>

            {/* Search Bar - Only visible when expanded */}
            {isExpanded && (
                <div className="px-4 py-3 border-b border-gray-200">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search menu..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-goodierun-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FontAwesomeIcon 
                            icon={faSearch} 
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                    </div>
                </div>
            )}

            <div className="overflow-y-auto h-full pt-16">
                {filteredItems.map(item => {
                    if (!hasPermission(item.permission)) return null;

                    return (
                        <div key={item.id} className="nav-item-container">
                            <div
                                className={`nav-item flex items-center px-4 py-3 cursor-pointer
                                    ${location.pathname.startsWith(item.path) ? 'bg-goodierun-primary bg-opacity-10 text-goodierun-primary' : 'text-goodierun-gray hover:bg-gray-100'}
                                    ${!isExpanded ? 'justify-center' : ''}`}
                                onClick={() => item.subItems ? toggleSection(item.id) : null}
                            >
                                <FontAwesomeIcon icon={item.icon} className={`${isExpanded ? 'mr-3' : ''}`} />
                                {isExpanded && (
                                    <span className="flex-grow">{item.label}</span>
                                )}
                                {isExpanded && item.subItems && (
                                    <FontAwesomeIcon 
                                        icon={activeSection === item.id ? faChevronDown : faChevronRight}
                                        className="ml-2"
                                    />
                                )}
                            </div>

                            {item.subItems && activeSection === item.id && isExpanded && (
                                <div className="submenu bg-gray-50">
                                    {item.subItems.map(subItem => {
                                        if (!hasPermission(subItem.permission)) return null;

                                        return (
                                            <div key={subItem.id} className="pl-12 pr-4 py-2">
                                                <Link
                                                    to={subItem.path}
                                                    className={`block text-sm ${location.pathname === subItem.path ? 'text-goodierun-primary font-medium' : 'text-goodierun-gray hover:text-goodierun-primary'}`}
                                                >
                                                    {subItem.label}
                                                </Link>
                                                {subItem.actions && (
                                                    <div className="mt-2 space-y-1">
                                                        {subItem.actions.map(action => (
                                                            <Link
                                                                key={action.path}
                                                                to={action.path}
                                                                className="flex items-center text-xs text-goodierun-gray hover:text-goodierun-primary py-1"
                                                            >
                                                                <FontAwesomeIcon icon={action.icon} className="mr-2" />
                                                                {action.label}
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
