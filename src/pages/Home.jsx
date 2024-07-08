import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  // to store sales data
  const [sales, setSales] = useState([]);
  // to set error
  const [error, setError] = useState('');
  // modal for record sales
  const [showModal, setShowModal] = useState(false);
  // to set new sales data
  const [newSale, setNewSale] = useState({
    date: '',
    storeName: '',
    kioskOwner: localStorage.getItem('name'), // Default to current user
    quantitySold: '',
  });
  // to store stores data
  const [stores, setStores] = useState([]);
  
    
  useEffect(() => {
    // store token from local storage
    const token = localStorage.getItem('token');
    // check for logged in user
    if (!token) {
      window.location.href = '/login';
      return;
    }
    // method that store sales data
    const fetchSales = async () => {
      try {
        const response = await axios.get(`${url}/sales`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSales(response.data);
      } catch (error) {
        setError('Failed to fetch sales data');
      }
    };
    // method that store stores data
    const fetchStores = async () => {
      try {
        const response = await axios.get(`${url}/stores`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStores(response.data);
       
      } catch (error) {
        setError('Failed to fetch store data');
      }
    };
    fetchSales();
    fetchStores();
  }, []);

  const userRole = localStorage.getItem('role'); 
  // Function to filter sales data based on user role
  const filterSalesData = (salesData) => {
    if (userRole === 'admin') {
      return salesData; // Return all sales data for admin
    } else {
      const kioskOwner = localStorage.getItem('name'); // Assuming username or kiosk owner info is stored in localStorage
      return salesData.filter(sale => sale.kioskOwner === kioskOwner);
    }
  };

  const filteredSales = filterSalesData(sales);


  // method for handling input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSale((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // method for handling form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${url}/sales`, newSale, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSales([...sales, response.data]);
      setShowModal(false);
      setNewSale({
        date: '',
        storeName: '',
        kioskOwner: localStorage.getItem('name'),
        quantitySold: '',
      });
    } catch (error) {
      setError('Failed to add new sale');
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
      {error ? (
        <p className="text-red-500">{error}</p>
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
              <div>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
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
