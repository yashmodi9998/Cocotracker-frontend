import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, requiredRole }) => {
  const isLoggedIn = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
