// /src/utils/PrivateRoute.js (CORRECTED ACCESS LOGIC)

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { STATIC_USER } from '../data';

const PrivateRoute = ({ requiredRole }) => {
    const user = STATIC_USER; 

    // 1. Check if user is logged in
    if (user.role === 'none' || !user.role) {
        return <Navigate to="/login" replace />;
    }
    
    // Define super-user role for clarity
    const isAdmin = user.role === 'admin';
    const isStaff = user.role === 'staff';

    // 2. Check for required access:
    
    if (requiredRole === 'admin' && !isAdmin) {
        // If route requires Admin but user is Staff/Citizen
        return <Navigate to="/submit-complaint" replace />; 
    }
    
    if (requiredRole === 'staff' && !isStaff && !isAdmin) {
        // If route requires Staff/Admin but user is only Citizen
        return <Navigate to="/submit-complaint" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;