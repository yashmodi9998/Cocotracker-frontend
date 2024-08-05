import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader'; // Import the Loader component for displaying loading animation

const ManageReturnRequest = () => {
  
  const url = import.meta.env.VITE_BACKEND_URL; // Backend URL from environment variables
  //fetch data from localStorage
  const token = localStorage.getItem('token'); 
  // state variables
  const [returnRequests, setReturnRequests] = useState([]); // State for storing return requests
  const [error, setError] = useState(''); // State for storing error messages
  const [loading, setLoading] = useState(true); // State for loading

  // Fetch return requests when the component mounts
  useEffect(() => {
    if (!token) {
      window.location.href = '/login'; // Redirect to login if token is not available
      return;
    }

    const fetchReturnRequests = async () => {
      try {
        const response = await axios.get(`${url}/return-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReturnRequests(response.data); // Update state with fetched data
      } catch (error) {
        setError('Failed to fetch return requests: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false); // Set loading to false after data fetching
      }
    };

    fetchReturnRequests();
  }, [token,url]);

  // Handle approval of a return request
  const handleApproval = async (requestId) => {
    try {
      await axios.put(`${url}/approve-return-request/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Fetch updated return requests after approval
      const response = await axios.get(`${url}/return-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReturnRequests(response.data);
    } catch (error) {
      setError('Failed to approve return request: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle rejection of a return request
  const handleRejection = async (requestId) => {
    try {
      await axios.delete(`${url}/return-request/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Fetch updated return requests after rejection
      const response = await axios.get(`${url}/return-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReturnRequests(response.data);
    } catch (error) {
      setError('Failed to reject return request: ' + (error.message));
    }
  };

  // Format date string to a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  // to use CSS class for status badge based on the status value
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

  if (loading) {
    return <Loader />; // Show loader while data is being fetched
  }

    // Filter and combine return requests: pending first
    const pendingRequests = returnRequests.filter(request => request.status === 'pending');
    const otherRequests = returnRequests.filter(request => request.status !== 'pending');
    const sortedReturnRequests = [...pendingRequests, ...otherRequests];
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Manage Return Requests</h1>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message if any */}
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
            {sortedReturnRequests.map((request) => (
              <tr key={request._id}>
                <td className="py-4 px-6 border-b border-gray-200">
                  { request.stockAllocationId.kioskOwnerId.name }
                </td>
                <td className="py-4 px-6 border-b border-gray-200">{request.returningStock} L</td>
                <td className="py-4 px-6 border-b border-gray-200">{request.reason}</td>
                <td className="py-4 px-6 border-b border-gray-200">{formatDate(request.dateRequested)}</td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${statusBadgeClass(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  {/* check if request is still in pending state */}
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
