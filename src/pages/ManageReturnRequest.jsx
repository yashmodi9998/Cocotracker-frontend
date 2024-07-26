import { useEffect, useState } from 'react';
import axios from 'axios';

const ManageReturnRequest = () => {
  const token = localStorage.getItem('token');
  const url = import.meta.env.VITE_BACKEND_URL;
  const [returnRequests, setReturnRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchReturnRequests = async () => {
      try {
        const response = await axios.get(`${url}/return-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("data", response.data);
        setReturnRequests(response.data);
      } catch (error) {
        setError('Failed to fetch return requests: ');
      }
    };

    fetchReturnRequests();
  }, [url, token]);

  const handleApproval = async (requestId) => {
    try {
      await axios.put(`${url}/approve-return-request/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await axios.get(`${url}/return-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReturnRequests(response.data);
    } catch (error) {
      setError('Failed to approve return request: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRejection = async (requestId) => {
    try {
      await axios.delete(`${url}/return-request/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await axios.get(`${url}/return-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReturnRequests(response.data);
    } catch (error) {
      setError('Failed to reject return request: ' + (error.response?.data?.message || error.message));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const statusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Manage Return Requests</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kiosk Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returning Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {returnRequests.map((request) => (
              <tr key={request._id}>
                <td className="py-4 px-6 border-b border-gray-200">
                  {request.stockAllocationId && request.stockAllocationId.kioskOwnerId ? request.stockAllocationId.kioskOwnerId.name : 'Unknown'}
                </td>
                <td className="py-4 px-6 border-b border-gray-200">{request.returningStock}</td>
                <td className="py-4 px-6 border-b border-gray-200">{request.reason}</td>
                <td className="py-4 px-6 border-b border-gray-200">{formatDate(request.dateRequested)}</td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${statusBadgeClass(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproval(request._id)}
                        className="bg-green-500 text-white py-2 px-4 rounded-md mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejection(request._id)}
                        className="bg-red-500 text-white py-2 px-4 rounded-md"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageReturnRequest;
