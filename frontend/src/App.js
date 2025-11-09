// /src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import Header from './components/Header';
import './App.css';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// User/Citizen Pages
import ComplaintSubmission from './pages/ComplaintSubmission';
import MyComplaintsPage from './pages/MyComplaintsPage';

// Staff/Admin Pages
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';


function App() {
    return (
        <Router>
            {/* Header is outside Routes to be visible on all pages */}
            <Header /> 
            <main>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* CITIZEN/ALL LOGGED-IN Protected Routes */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/submit-complaint" element={<ComplaintSubmission />} />
                        <Route path="/my-complaints" element={<MyComplaintsPage />} />
                    </Route>

                    {/* STAFF Protected Routes (Staff or Admin) */}
                    <Route element={<PrivateRoute requiredRole="staff" />}>
                        <Route path="/staff/dashboard" element={<StaffDashboard />} />
                    </Route>
                    
                    {/* ADMIN Protected Routes (Admin only) */}
                    <Route element={<PrivateRoute requiredRole="admin" />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/users" element={<h1>Admin User Management Page</h1>} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;