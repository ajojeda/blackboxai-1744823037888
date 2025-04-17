import React from 'react';

const PointOfSale = () => {
    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Point of Sale
                </h1>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    New Transaction
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
                    <div className="space-y-4">
                        <p className="text-gray-600">No recent transactions</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 border rounded-lg hover:bg-gray-50">
                            View Sales Report
                        </button>
                        <button className="p-4 border rounded-lg hover:bg-gray-50">
                            Manage Inventory
                        </button>
                        <button className="p-4 border rounded-lg hover:bg-gray-50">
                            Customer History
                        </button>
                        <button className="p-4 border rounded-lg hover:bg-gray-50">
                            Print Receipt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PointOfSale;
