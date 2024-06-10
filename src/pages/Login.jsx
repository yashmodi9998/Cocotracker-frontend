import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
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
      const response = await axios.post('http://localhost:8888/login', formData);
    //   store token as a response and store it in localstorage as token
      const { token } = response.data;
      localStorage.setItem('token', token);
    //   redirects to home route after login
      window.location.href = '/';
    //   console.log(token);
    //   alert('Login successful!');
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input type="email" name="email" onChange={handleChange} value={formData.email} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" onChange={handleChange} value={formData.password} required />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
