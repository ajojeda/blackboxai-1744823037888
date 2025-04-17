import React from 'react';

const RoleManagement = ({ mode = 'view' }) => {
    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">
                    {mode === 'create' ? 'Create Role' : 
                     mode === 'list' ? 'Role List' : 
                     'Role Management'}
                </h1>
                {mode === 'list' && (
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                        Add New Role
                    </button>
                )}
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
                {mode === 'create' && (
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role Name</label>
                            <input 
                                type="text" 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Enter role name"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                    <label className="ml-2 text-sm text-gray-700">User Management</label>
                                </div>
                                <div className="flex items-center">
                                    <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                    <label className="ml-2 text-sm text-gray-700">Role Management</label>
                                </div>
                                <div className="flex items-center">
                                    <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                    <label className="ml-2 text-sm text-gray-700">ERP Access</label>
                                </div>
                                <div className="flex items-center">
                                    <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                    <label className="ml-2 text-sm text-gray-700">POS Access</label>
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            type="submit"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                            Create Role
                        </button>
                    </form>
                )}
                
                {mode === 'list' && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Permissions
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Users
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">No roles found</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">-</td>
                                    <td className="px-6 py-4 whitespace-nowrap">-</td>
                                    <td className="px-6 py-4 whitespace-nowrap">-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
                
                {mode === 'view' && (
                    <p className="text-gray-600">Select an action from the sidebar to manage roles</p>
                )}
            </div>
        </div>
    );
};

export default RoleManagement;
