import  React,{ useEffect, useState } from 'react';
import axios from 'axios';

const Stocks = () => {
  const userId = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  const url = import.meta.env.VITE_BACKEND_URL;

  const [allocations, setAllocations] = useState([]);
  const [error, setError] = useState('');
  const [returnRequests, setReturnRequests] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchAllocations = async () => {
      try {
        const response = await axios.get(`${url}/allocate-stock/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllocations(response.data);
      } catch (error) {
        console.error('Error fetching allocated stock:', error);
        setError('Failed to fetch allocated stock');
      }
    };

    const fetchReturnRequests = async () => {
      try {
        const response = await axios.get(`${url}/return-requests/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const requests = {};
        response.data.forEach((request) => {
          requests[request.stockAllocationId._id] = request;
        });
       
        setReturnRequests(requests);
      } catch (error) {
        console.error('Error fetching return requests:', error);
        setError('Failed to fetch return requests');
      }
    };

    fetchAllocations();
    fetchReturnRequests();
  }, [userId, url, token]);

  const handleReturnRequest = async (stockAllocationId, returningStock, reason) => {
    try {
      await axios.post(
        `${url}/return-request`,
        {
          stockAllocationId,
          returningStock,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Fetch return requests again to update the UI
      await updateReturnRequests();
      setIsModalOpen(false); // Close modal after submission
    } catch (error) {
      console.error('Error submitting return request:', error);
      setError('Failed to submit return request'+error);
    }
  };

  const updateReturnRequests = async () => {
    try {
      const response = await axios.get(`${url}/return-requests/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const requests = {};
      response.data.forEach((request) => {
        requests[request.stockAllocationId] = request;
      });
      setReturnRequests(requests);
    } catch (error) {
      console.error('Error updating return requests:', error);
      setError('Failed to fetch return requests');
    }
  };

  const openModal = (allocation) => {
    setSelectedAllocation(allocation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    
    setIsModalOpen(false);
    setSelectedAllocation(null);
  };

  const handleRowClick = (allocationId) => {
    setExpandedRow(expandedRow === allocationId ? null : allocationId);
  };

  const statusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Allocated Stock</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kiosk Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocated Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Allocated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allocations.map((allocation) => (
              <React.Fragment key={allocation._id}>
                <tr
                  className={returnRequests[allocation._id] ? 'cursor-pointer' : ''}
                  onClick={() => handleRowClick(allocation._id)}
                >
                  <td className="py-4 px-6 border-b border-gray-200">
                    {allocation.kioskOwnerId ? allocation.kioskOwnerId.name : 'Unknown'}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">{allocation.allocatedStock}</td>
                  <td className="py-4 px-6 border-b border-gray-200">{new Date(allocation.dateAllocated).toLocaleDateString()}</td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    {returnRequests[allocation._id] && returnRequests[allocation._id].status ? (
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${statusBadgeClass(returnRequests[allocation._id].status)}`}>
                        {returnRequests[allocation._id].status}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    {returnRequests[allocation._id] ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(allocation._id);
                        }}
                        className="text-blue-500"
                      >
                        View Details
                      </button>
                    ) : (
                      <button
                        onClick={() => openModal(allocation)}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md"
                      >
                        Request Return
                      </button>
                    )}
                  </td>
                </tr>
                {expandedRow === allocation._id && returnRequests[allocation._id] && (
                  <tr>
                    <td colSpan="5" className="py-4 px-6 border-b border-gray-200">
                      <div>
                        <p><strong>Number of Returned Stock:</strong> {returnRequests[allocation._id].returningStock}</p>
                        <p><strong>Reason:</strong> {returnRequests[allocation._id].reason}</p>
                        <p><strong>Status:</strong> <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${statusBadgeClass(returnRequests[allocation._id].status)}`}>
                          {returnRequests[allocation._id].status}
                        </span></p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Integration */}
      {isModalOpen && selectedAllocation && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Submit Return Request</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const returningStock = e.target.returningStock.value;
                const reason = e.target.reason.value;
                handleReturnRequest(selectedAllocation._id, returningStock, reason);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Number of Returning Stock
                </label>
                <input
                  type="number"
                  name="returningStock"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Reason for Return
                </label>
                <textarea
                  name="reason"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stocks;
