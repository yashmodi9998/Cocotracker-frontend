import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import SalesChart from '../components/SalesChart';
import NewSaleModal from '../components/NewSaleModal';

const Home = () => {
  // Backend URL from environment variable
  const url = import.meta.env.VITE_BACKEND_URL;
  // Fetching data from localStorage
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('id');   
  const userRole = localStorage.getItem('role');
  const userName = localStorage.getItem('name');
  // State variables
  const [sales, setSales] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSale, setNewSale] = useState({
    date: '',
    storeName: '',
    kioskOwner: userName, 
    quantitySold: '',
    stockAllocationId: '',
  });
  const [stores, setStores] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [chartData, setChartData] = useState(null);

  // useEffect to fetch data on component 
  useEffect(() => {
    console.log('Fetching data...'); 
    const fetchData = async () => {

      if (!token) {
        window.location.href = '/login'; // Redirect to login if token is missing
        console.log('Fetching data...login'); 
        return;
      }

      try {
        // Fetch sales data
        const salesResponse = await axios.get(`${url}/sales`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSales(salesResponse.data);

        // Fetch stores data
        const storesResponse = await axios.get(`${url}/stores`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStores(storesResponse.data);

        // Fetch allocations data
        const allocationsResponse = await axios.get(`${url}/allocate-stock`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const allocationsData = allocationsResponse.data;
        setAllocations(allocationsData);
        
      } catch (error) {
        setError('Failed to fetch data: ' + error.message); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false after data fetching
      }
    };

    fetchData(); // Call fetchData function
    const labels = filteredSales.map(sale => new Date(sale.date).toLocaleDateString());
    const quantitySoldData = filteredSales.map(sale => sale.quantitySold);
    const allocatedStockData = filteredSales.map(sale => {
      const allocation = allocations.find(allocation => allocation._id === sale.stockAllocationId);
      return allocation ? allocation.allocatedStock : 0;
    });

    // Set chart data state
    setChartData({
      labels,
      datasets: [
        {
          label: 'Quantity Sold',
          data: quantitySoldData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Allocated Stock',
          data: allocatedStockData,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
      ],
    });
  }, [url,token,allocations]);

  // Function to filter sales data based on user role
  const filterSalesData = (salesData) => {
    if (userRole === 'admin') {
      return salesData;
    } else {
      
      return salesData.filter(sale => sale.kioskOwner === userName);
    }
  };

  // Filtered sales data based on user role
  const filteredSales = filterSalesData(sales);

  // useEffect to set chart data when sales or allocations data changes
  useEffect(() => {
    const labels = filteredSales.map(sale => new Date(sale.date).toLocaleDateString());
    const quantitySoldData = filteredSales.map(sale => sale.quantitySold);
    const allocatedStockData = filteredSales.map(sale => {
      const allocation = allocations.find(allocation => allocation._id === sale.stockAllocationId);
      return allocation ? allocation.allocatedStock : 0;
    });

    // Set chart data state
    setChartData({
      labels,
      datasets: [
        {
          label: 'Quantity Sold',
          data: quantitySoldData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Allocated Stock',
          data: allocatedStockData,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
      ],
    });
  }, [filteredSales, allocations]);

  // Filter allocations for dropdown based on logged-in user(sales form)
  const filteredAllocations = allocations.filter(
    allocation => allocation.kioskOwnerId._id === userId
  );

  // Handler for form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSale((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/sales`, newSale, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSales([...sales, response.data]); // Add new sale to sales state
      setShowModal(false); // Close modal
      setNewSale({
        date: '',
        storeName: '',
        kioskOwner: userName, 
        quantitySold: '',
        stockAllocationId: '',
      });
    } catch (error) {
      setError('Failed to add new sale: ' + error.message); // Set error message if adding sale fails
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
        <Loader /> // Show loader if data is loading
      ) : error ? (
        <p className="text-red-500">{error}</p> // Show error message if there is an error
      ) : (
        <>
          <SalesChart data={chartData} /> 
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{new Date(sale.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.storeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.kioskOwner}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.quantitySold} L</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.quantitySold * 60} rs</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {allocations.find(allocation => allocation._id === sale.stockAllocationId)?.allocatedStock || 0} L
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showModal && (
            <NewSaleModal
              onClose={() => setShowModal(false)}
              onSubmit={handleSubmit}
              newSale={newSale}
              onChange={handleChange}
              stores={stores}
              allocations={filteredAllocations} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default Home;
