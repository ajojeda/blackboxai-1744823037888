import React from 'react';

const WarehouseManagement = ({ mode = 'view' }) => {
    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">
                    {mode === 'create' ? 'Create Warehouse' : 
                     mode === 'list' ? 'Warehouse List' : 
                     'Warehouse Management'}
                </h1>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">
                    {mode === 'create' ? 'Create a new warehouse record' :
                     mode === 'list' ? 'View all warehouse records' :
                     'Manage warehouse operations'}
                </p>
            </div>
        </div>
    );
};

export default WarehouseManagement;
