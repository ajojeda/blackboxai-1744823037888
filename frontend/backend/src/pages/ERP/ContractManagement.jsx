import React from 'react';

const ContractManagement = ({ mode = 'view' }) => {
    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">
                    {mode === 'create' ? 'Create Contract' : 
                     mode === 'list' ? 'Contract List' : 
                     'Contract Management'}
                </h1>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600">
                    {mode === 'create' ? 'Create a new contract' :
                     mode === 'list' ? 'View all contracts' :
                     'Manage contracts and agreements'}
                </p>
            </div>
        </div>
    );
};

export default ContractManagement;
