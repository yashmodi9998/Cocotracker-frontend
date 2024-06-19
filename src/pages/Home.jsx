import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  // to store sales data
  const [sales, setSales] = useState([]);
  // to set error
  const [error, setError] = useState('');

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

        const response = await axios.get('http://localhost:8888/sales', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSales(response.data);
      } catch (error) {
        setError('Failed to fetch sales data');
      }
    };

    fetchSales();
  }, []);

  // Function to filter sales data based on user role
  const filterSalesData = (salesData) => {
    const userRole = localStorage.getItem('role'); 
    if (userRole === 'admin') {
      return salesData; // Return all sales data for admin
    } else {
      const kioskOwner = localStorage.getItem('name'); // Assuming username or kiosk owner info is stored in localStorage
      return salesData.filter(sale => sale.kioskOwner === kioskOwner);
    }
  };

  const filteredSales = filterSalesData(sales);

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Sales Data</h1>
      {/* if there's error */}
      {error ? (<p className="text-red-500">{error}</p>) : (
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
    </div>
  );
};

export default Home;
