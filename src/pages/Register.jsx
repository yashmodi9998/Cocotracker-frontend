import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
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
      const response = await axios.post('http://localhost:8888/register', formData);
    //   set response in token and store it in localstorage
      const { token } = response.data;
      localStorage.setItem('token', token);
    //   redirect to home page
      window.location.href = '/';
    //   alert('Registration successful!');
    } catch (error) {
      console.error(error);
    //   alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" name="name" onChange={handleChange} value={formData.name} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" onChange={handleChange} value={formData.email} required />
      </div>
      <div>
        <label>Phone Number:</label>
        <input type="text" name="phoneNumber" onChange={handleChange} value={formData.phoneNumber} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" onChange={handleChange} value={formData.password} required />
      </div>
      <div>
        <label>Role:</label>
        <select name="role" onChange={handleChange} value={formData.role} required>
          <option value="admin">Admin</option>
          <option value="kiosk owner">Kiosk Owner</option>
        </select>
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
