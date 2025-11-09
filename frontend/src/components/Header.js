// /src/components/Header.js

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // <-- IMPORT useNavigate
import styled from 'styled-components';
import { STATIC_USER } from '../data'; // Use static user data

const Nav = styled.nav`
    background: #007bff;
    color: white;
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavLink = styled(Link)`
    color: white;
    text-decoration: none;
    margin-left: 20px;
    font-weight: 500;
    transition: color 0.2s;

    &:hover {
        color: #e9ecef;
    }
`;

const UserInfo = styled.div`
    font-size: 0.9em;
    span {
        font-weight: bold;
    }
`;

const AuthLinks = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
`;

const Header = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const user = STATIC_USER;
    const location = useLocation();
    const { role, name } = user;

    const isPublicPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';
    const isLoggedIn = role !== 'none' && role !== null;

    // --- LOGOUT FUNCTION ---
    const handleLogout = () => {
        // 1. Reset the static user state
        STATIC_USER.role = 'none';
        STATIC_USER.name = 'Guest';
        STATIC_USER.email = '';
        
        // 2. Clear stored user info (for future backend integration)
        localStorage.removeItem('userInfo');
        
        // 3. Redirect to the login page using navigate
        navigate('/login'); 
    };
    // -----------------------


    // --- Conditional Content ---
    let rightSideContent;

    if (isLoggedIn) {
        // Logged-in state (shows user info and logout)
        rightSideContent = (
            <UserInfo>
                Logged in as <span>{name}</span> ({role.toUpperCase()})
                <button 
                    onClick={handleLogout} // <-- Call the working logout function
                    style={{ marginLeft: '15px', padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Logout
                </button>
            </UserInfo>
        );
    } else if (isPublicPage) {
        // Public state on Landing/Login/Register pages (shows only Login/Signup links)
        rightSideContent = (
            <AuthLinks>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register" style={{ backgroundColor: '#28a745', padding: '5px 10px', borderRadius: '4px' }}>
                    Sign Up
                </NavLink>
            </AuthLinks>
        );
    } else {
        // Fallback for pages that should be protected but user is logged out (redirect handled by PrivateRoute)
        rightSideContent = null;
    }

    return (
        <Nav>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                    💧 Drainage Tracker
                </Link>
            </div>
            
            <div>
                {/* Navigation links visible when logged in */}
                {isLoggedIn && (
                    <>
                        <NavLink to="/submit-complaint">Report Issue</NavLink>
                        <NavLink to="/my-complaints">My Reports</NavLink>
                        {role === 'staff' && <NavLink to="/staff/dashboard">Staff Dashboard</NavLink>}
                        {role === 'admin' && <NavLink to="/admin/dashboard">Admin Dashboard</NavLink>}
                    </>
                )}
            </div>

            {rightSideContent}
        </Nav>
    );
};

export default Header;