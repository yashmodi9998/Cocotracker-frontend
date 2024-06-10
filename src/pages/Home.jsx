import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState('');
// use effecr for fetching sales data
  useEffect(() => {
    const fetchSales = async () => {
      try {
        // var that stores token value from local storage
        const token = localStorage.getItem('token'); 
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
    <div>
      <h1>Sales Data</h1>
      {/* if there is any error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
      
        {sales.map((sale) => (
          <li key={sale._id}>
            <p>Quantity Sold: {sale.quantitySold}</p>
            <p>Date: {new Date(sale.date).toLocaleDateString()}</p>
            <p>Store Name: {sale.storeName}</p>
            <p>Kiosk Owner: {sale.kioskOwner}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
