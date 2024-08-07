import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader'; 

const ManageStock = () => {
  const url = import.meta.env.VITE_BACKEND_URL; // Backend URL from environment variables
  // fetch data from localStorage
  const token = localStorage.getItem('token'); 

  // State variables
  const [stockAllocations, setStockAllocations] = useState([]); // To store fetched stock allocations
  const [kioskOwners, setKioskOwners] = useState([]); // To store fetched kiosk owners
  const [newAllocation, setNewAllocation] = useState({ kioskOwnerId: '', allocatedStock: '' }); // To manage new stock allocation data
  const [message, setMessage] = useState(''); // To display success or error messages
  const [isModalOpen, setIsModalOpen] = useState(false); // To control the visibility of the modal
  const [loading, setLoading] = useState(true); // To manage loading state



  useEffect(() => {
    if (!token) {
      window.location.href = '/login'; // Redirect to login if token is not available
      return;
    }
    
    const fetchData = async () => {
      try {
        await fetchStockAllocations(); // Fetch stock allocations
        await fetchKioskOwners(); // Fetch kiosk owners
      } catch (error) {
        setMessage('Failed to load data'); // Set message if data loading fails
      } finally {
        setLoading(false); // Set loading to false after data fetching
      }
    };

    // Function to fetch stock allocations
    const fetchStockAllocations = async () => {
      try {
        const response = await axios.get(`${url}/allocate-stock`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setStockAllocations(response.data); // Update state with fetched data
      } catch (error) {
        setMessage('Failed to fetch stock allocations'); // Set message if fetching fails
      }
    };

    // Function to fetch kiosk owners
    const fetchKioskOwners = async () => {
      try {
        const response = await axios.get(`${url}/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to request headers
          },
        });
        setKioskOwners(response.data.filter(user => user.role === 'kiosk owner')); // Filter and update state with kiosk owners
      } catch (error) {
        setMessage('Failed to fetch kiosk owners'); // Set message if fetching fails
      }
    };

    fetchData(); // Call fetchData to initiate data fetching
  }, [token,url]);

  // Handler for form input changes
  const handleAllocationChange = (e) => {
    setNewAllocation({
      ...newAllocation,
      [e.target.name]: e.target.value,
    });
  };

  // Handler for form submission
  const handleAllocate = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const { kioskOwnerId, allocatedStock } = newAllocation; // Destructure data from state

    try {
      const response = await axios.post(`${url}/allocate-stock`, {
        kioskOwnerId,
        allocatedStock,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to request headers
        },
      });

      setStockAllocations([...stockAllocations, response.data]); // Update stock allocations with new data
      setNewAllocation({ kioskOwnerId: '', allocatedStock: '' }); // Reset form data
      setMessage(`Stock successfully allocated to ${response.data.kioskOwnerId?.name || 'unknown'}`); // Success message
      setIsModalOpen(false); // Close modal after successful allocation
    } catch (error) {
      setMessage('Failed to allocate stock'); // Set message if allocation fails
    }
  };

  // Show loader if loading state is true
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Manage Stock Allocations</h1>
      {/* Button to open modal for allocating new stock */}
      <div className="mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Allocate New Stock
        </button>
      </div>

      {/* Table displaying existing allocated stock */}
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
                  {allocation.kioskOwnerId?.name }
                </td>
                <td className="py-4 px-6 border-b border-gray-200">{allocation.allocatedStock} L</td>
                <td className="py-4 px-6 border-b border-gray-200">
                  {new Date(allocation.dateAllocated).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for allocating new stock */}
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
