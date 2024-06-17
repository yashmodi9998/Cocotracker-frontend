import React, { useEffect, useState } from 'react';
import axios from 'axios';

const User = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
// use effecr for fetching user data
  useEffect(() => {
       // var that stores token value from local storage
        const token = localStorage.getItem('token'); 
      // If token is not present, redirect to login page
      if (!token) {
        window.location.href = '/login';;
        return; // Stop further execution
      }
      
    const fetchUser = async () => {
      try {
        // use axios for getting user api with passing header
        const response = await axios.get('http://localhost:8888/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // set response of api to variable
        setUsers(response.data);
      } catch (error) {
        setError('Failed to fetch User data');
      }
    };
 // Call the fetchUser function
    fetchUser();
  }, []);

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {/* if there's any error while fetching data */}
      {error ? (<p className="text-red-500">{error}</p>)
      :
      (
        // otherwise it will display users data
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr class="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* display user data in table format */}
            {users.map((user) => (
              <tr>
                <td className="py-4 px-6 border-b border-gray-200">{user.name}</td>
                <td className="py-4 px-6 border-b border-gray-200 ">{user.email}</td>
                <td className="py-4 px-6 border-b border-gray-200">{user.phoneNumber}</td>
                <td className="py-4 px-6 border-b border-gray-200">{user.role}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                   <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <button class="px-4 py-2 font-medium text-xs text-white bg-blue-600 rounded-md hover:bg-blue-500 " >Edit</button>
                    <button class="ml-2 px-4 py-2 font-medium text-xs text-white bg-red-600 rounded-md ">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>)}
    </div>


  );
};

export default User;
