import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState('');
// use effecr for fetching sales data
  useEffect(() => {
       // var that stores token value from local storage
        const token = localStorage.getItem('token'); 
      // If token is not present, redirect to login page
      if (!token) {
        window.location.href = '/login';;
        return; // Stop further execution
      }
    const fetchSales = async () => {
      try {
        // use axios for getting sales api with passing header
        const response = await axios.get('http://localhost:8888/sales', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // set response of api to variable
        setSales(response.data);
      } catch (error) {
        setError('Failed to fetch sales data');
      }
    };
 // Call the fetchSales function
    fetchSales();
  }, []);

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Sales Data</h1>
      {/* if there's any error while fetching data */}
      {error ? (<p className="text-red-500">{error}</p>)
      :
      (
        // otherwise it will display sales data
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Sold</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kiosk Owner</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* display sales data in table format */}
            {sales.map((sale) => (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">{sale.quantitySold}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(sale.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.storeName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.kioskOwner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>)}
    </div>

  );
};

export default Home;
