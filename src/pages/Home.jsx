import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

const Home = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const [sales, setSales] = useState([]); // State to store sales data
  const [error, setError] = useState(''); // State to store error messages
  const [loading, setLoading] = useState(true); // State to manage loading indicator
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [newSale, setNewSale] = useState({
    date: '',
    storeName: '',
    kioskOwner: localStorage.getItem('name'), // Default to current user
    quantitySold: '',
    stockAllocationId: '', // ID of selected stock allocation
  });
  const [stores, setStores] = useState([]); // State to store store data
  const [allocations, setAllocations] = useState([]); // State to store stock allocations

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if token is not present
      window.location.href = '/login';
      return;
    }

    // Function to fetch sales data
    const fetchSales = async () => {
      try {
        const response = await axios.get(`${url}/sales`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSales(response.data); // Set sales data
      } catch (error) {
        setError('Failed to fetch sales data'); // Set error message
      } finally {
        setLoading(false); // Turn off loading indicator
      }
    };

    // Function to fetch store data
    const fetchStores = async () => {
      try {
        const response = await axios.get(`${url}/stores`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStores(response.data); // Set store data
      } catch (error) {
        setError('Failed to fetch store data'); // Set error message
      }
    };

    // Function to fetch stock allocations
    const fetchAllocations = async () => {
      try {
        const response = await axios.get(`${url}/allocate-stock`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllocations(response.data); // Set allocations
      } catch (error) {
        setError('Failed to fetch stock allocations'); // Set error message
      }
    };

    fetchSales();
    fetchStores();
    fetchAllocations();
  }, [url]);

  const userRole = localStorage.getItem('role');

  // Function to filter sales data based on user role
  const filterSalesData = (salesData) => {
    if (userRole === 'admin') {
      return salesData; // Return all sales data for admin
    } else {
      const kioskOwner = localStorage.getItem('name'); // Get current user name
      return salesData.filter(sale => sale.kioskOwner === kioskOwner); // Filter sales data for kiosk owner
    }
  };

  const filteredSales = filterSalesData(sales);

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSale((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${url}/sales`, newSale, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSales([...sales, response.data]); // Add new sale to sales list
      setShowModal(false); // Hide modal
      setNewSale({
        date: '',
        storeName: '',
        kioskOwner: localStorage.getItem('name'),
        quantitySold: '',
        stockAllocationId: '',
      }); // Reset form fields
    } catch (error) {
      setError('Failed to add new sale: ' + error.message); // Set error message
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Sales Data</h1>
      {userRole === 'kiosk owner' && (
        <button
          className="px-4 py-2 font-medium text-xs text-white bg-blue-600 rounded-md hover:bg-blue-500 mb-4"
          onClick={() => setShowModal(true)}
        >
          Add New Record
        </button>
      )}
      {loading ? (
        <Loader /> // Render the loader while loading
      ) : error ? (
        <p className="text-red-500">{error}</p> // Display error message if any
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kiosk Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocated Stock</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(sale.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sale.storeName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sale.kioskOwner}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sale.quantitySold} L</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sale.quantitySold * 60} rupees</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Display allocated stock based on allocation ID */}
                    {allocations.find(allocation => allocation._id === sale.stockAllocationId)?.allocatedStock || 'N/A'} L
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50"></div>
          <div className="bg-white rounded-lg shadow-lg p-8 z-10">
            <h2 className="text-xl font-bold mb-4">Add New Sale</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newSale.date}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">Store Name</label>
                <select
                  id="storeName"
                  name="storeName"
                  value={newSale.storeName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="" disabled>Select a store</option>
                  {stores.map((store) => (
                    <option key={store._id} value={store.storeName}>{store.storeName}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="quantitySold" className="block text-sm font-medium text-gray-700">Quantity Sold (L)</label>
                <input
                  type="number"
                  id="quantitySold"
                  name="quantitySold"
                  value={newSale.quantitySold}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="stockAllocationId" className="block text-sm font-medium text-gray-700">Stock Allocation</label>
                <select
                  id="stockAllocationId"
                  name="stockAllocationId"
                  value={newSale.stockAllocationId}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select an allocation</option>
                  {allocations.map(allocation => (
                    <option key={allocation._id} value={allocation._id}>
                      {`${allocation.allocatedStock} L`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-medium text-xs text-white bg-red-600 rounded-md hover:bg-red-500 mr-2"
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
      )}
    </div>
  );
};

export default Home;
