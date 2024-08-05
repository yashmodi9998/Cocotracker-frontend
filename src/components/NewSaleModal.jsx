import React from 'react';

const NewSaleModal = ({ newSale, onChange, onSubmit, onClose, stores, allocations }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50"></div>
      <div className="bg-white rounded-lg shadow-lg p-8 z-10">
        <h2 className="text-xl font-bold mb-4">Add New Sale</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={newSale.date}
              onChange={onChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">Store Name</label>
            <select
              id="storeName"
              name="storeName"
              value={newSale.storeName}
              onChange={onChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            >
              <option value="">Select Store</option>
              {stores.map((store) => (
                <option key={store._id} value={store.storeName}>{store.storeName}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="quantitySold" className="block text-sm font-medium text-gray-700">Quantity Sold</label>
            <input
              type="number"
              id="quantitySold"
              name="quantitySold"
              value={newSale.quantitySold}
              onChange={onChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="stockAllocationId" className="block text-sm font-medium text-gray-700">Stock Allocation</label>
            <select
              id="stockAllocationId"
              name="stockAllocationId"
              value={newSale.stockAllocationId}
              onChange={onChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              required
            >
              <option value="">Select Stock Allocation</option>
              {allocations.map((allocation) => (
                <option key={allocation._id} value={allocation._id}>
                  {allocation.allocatedStock} 
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 font-medium text-xs text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-medium text-xs text-white bg-blue-600 rounded-md hover:bg-blue-500"
            >
              Add Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSaleModal;
