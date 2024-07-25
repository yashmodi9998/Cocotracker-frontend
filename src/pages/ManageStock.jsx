import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageStock = () => {
  const [stockAllocations, setStockAllocations] = useState([]);
  const [kioskOwners, setKioskOwners] = useState([]);
  const [newAllocation, setNewAllocation] = useState({ kioskOwnerId: '', allocatedStock: '' });
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const url = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    const fetchStockAllocations = async () => {
      try {
        const response = await axios.get(`${url}/allocate-stock`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStockAllocations(response.data);
      } catch (error) {
        console.error('Failed to fetch stock allocations', error);
      }
    };

    const fetchKioskOwners = async () => {
      try {
        const response = await axios.get(`${url}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setKioskOwners(response.data.filter(user => user.role === 'kiosk owner'));
      } catch (error) {
        console.error('Failed to fetch kiosk owners', error);
      }
    };

    fetchStockAllocations();
    fetchKioskOwners();
  }, [url, token]);

  const handleAllocationChange = (e) => {
    setNewAllocation({
      ...newAllocation,
      [e.target.name]: e.target.value,
    });
  };

  const handleAllocate = async (e) => {
    e.preventDefault();
    const { kioskOwnerId, allocatedStock } = newAllocation;

    try {
      const response = await axios.post(`${url}/allocate-stock`, {
        kioskOwnerId,
        allocatedStock,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStockAllocations([...stockAllocations, response.data]);
      setNewAllocation({ kioskOwnerId: '', allocatedStock: '' });
      setMessage(`Stock successfully allocated to ${response.data.kioskOwnerId.name}`);
      setIsModalOpen(false); // Close modal after allocation
    } catch (error) {
      console.error('Failed to allocate stock', error);
      setMessage('Failed to allocate stock');
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Manage Stock Allocations</h1>
      {message && <p className="text-green-500">{message}</p>}

      {/* Allocate New Stock Button */}
      <div className="mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Allocate New Stock
        </button>
      </div>

      {/* Existing Allocated Stock Section */}
      <div className="overflow-x-auto mb-8">
        <h2 className="text-xl font-semibold mb-4">Existing Allocated Stock</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kiosk Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocated Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Allocated</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stockAllocations.map((allocation) => (
              <tr key={allocation._id}>
                <td className="py-4 px-6 border-b border-gray-200">
                  {allocation.kioskOwnerId ? allocation.kioskOwnerId.name : 'Unknown'}
                </td>
                <td className="py-4 px-6 border-b border-gray-200">{allocation.allocatedStock}</td>
                <td className="py-4 px-6 border-b border-gray-200">
                  {new Date(allocation.dateAllocated).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Allocating New Stock */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Allocate New Stock</h2>
            <form onSubmit={handleAllocate}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="kioskOwnerId">
                  Kiosk Owner
                </label>
                <select
                  id="kioskOwnerId"
                  name="kioskOwnerId"
                  value={newAllocation.kioskOwnerId}
                  onChange={handleAllocationChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select Kiosk Owner</option>
                  {kioskOwners.map((owner) => (
                    <option key={owner._id} value={owner._id}>
                      {owner.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="allocatedStock">
                  Allocated Stock
                </label>
                <input
                  type="number"
                  id="allocatedStock"
                  name="allocatedStock"
                  value={newAllocation.allocatedStock}
                  onChange={handleAllocationChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Allocate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStock;
