import React from 'react';

const UserManagement = ({ mode = 'view' }) => {
    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">
                    {mode === 'create' ? 'Create User' : 
                     mode === 'list' ? 'User List' : 
                     'User Management'}
                </h1>
                {mode === 'list' && (
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                        Add New User
                    </button>
                )}
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
                {mode === 'create' && (
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input 
                                type="text" 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input 
                                type="email" 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                                <option>Select Role</option>
                                <option>Administrator</option>
                                <option>Manager</option>
                                <option>User</option>
                            </select>
                        </div>
                        <button 
                            type="submit"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                            Create User
                        </button>
                    </form>
                )}
                
                {mode === 'list' && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">No users found</div>
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
                    <p className="text-gray-600">Select an action from the sidebar to manage users</p>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
