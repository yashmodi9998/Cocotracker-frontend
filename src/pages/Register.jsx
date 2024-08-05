import { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
    // constants for register form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'kiosk owner' // default value
  });
// function that handle inputs of form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
// function that handle form submission data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // get response from backend with register endpoint
      const response = await axios.post(`${url}/register`, formData);
    //   get response in token and store it in localStorage
      const { token,name,role,email,id } = response.data;
      localStorage.setItem('token', token); 
      localStorage.setItem('id', id);
      localStorage.setItem('email', email);
      localStorage.setItem('name', name);
      localStorage.setItem('role', role);
    //   redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };

  return (
 <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={handleChange}
          value={formData.name}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
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
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-gray-700 font-bold mb-2">Phone Number:</label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          onChange={handleChange}
          value={formData.phoneNumber}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
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
      <div className="mb-6">
        <label htmlFor="role" className="block text-gray-700 font-bold mb-2">Role:</label>
        <select
          id="role"
          name="role"
          onChange={handleChange}
          value={formData.role}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        >
          <option value="admin">Admin</option>
          <option value="kiosk owner">Kiosk Owner</option>
        </select>
      </div>
      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">
        Register
      </button>
    </form>
  );
};

export default Register;
