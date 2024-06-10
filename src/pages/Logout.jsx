import React from 'react';

const Logout = () => {

  const handleLogout = () => {
    // remove token from localstorage
    localStorage.removeItem('token');
    // alert('Logout successful!');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
