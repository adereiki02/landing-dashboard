import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = true }) => {
  const userInfoString = localStorage.getItem('userInfo');
  
  if (!userInfoString) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has admin or superadmin role
  if (adminOnly) {
    try {
      const userInfo = JSON.parse(userInfoString);
      if (!userInfo.role || (userInfo.role !== 'admin' && userInfo.role !== 'superadmin')) {
        // User is not an admin or superadmin, redirect to home
        return <Navigate to="/" replace />;
      }
    } catch (error) {
      // If there's an error parsing the userInfo, redirect to login
      localStorage.removeItem('userInfo'); // Clear invalid data
      return <Navigate to="/login" replace />;
    }
  }
  
  // User is authenticated and has proper permissions, render the protected component
  return children;
};

export default ProtectedRoute;