import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
    // initial value for form data and setFormData
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
// function to handle formdata
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
//function that handles on form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
        // post request for login with axios
      const response = await axios.post(`${url}/login`, formData);
    //   store token as a response and store it in localstorage as token
      const { token,role,name } = response.data;
      console.log(response.data);
      localStorage.setItem('token', token);
      localStorage.setItem('name', name);
      localStorage.setItem('role', role);
    //   redirects to home route after login
      window.location.href = '/';
    //   console.log(token);
    //   alert('Login successful!');
    } catch (error) {
      console.error(error);
      // alert(error);
    }
  };

  return (
 <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={handleChange}
          value={formData.email}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={handleChange}
          value={formData.password}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">
        Login
      </button>
    </form>
  );
};

export default Login;
