// /src/pages/LoginPage.js (FINAL LIVE API VERSION)

import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { STATIC_USER, TEST_ACCOUNT } from '../data'; 

// --- CRITICAL: Configure axios to send session cookies globally ---
axios.defaults.withCredentials = true;

// --- Styled Components (omitted for brevity) ---
const PageWrapper = styled.div`
    background-color: #f0f2f5; min-height: 90vh; display: flex; justify-content: center; align-items: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;
const FormContainer = styled.div`
    max-width: 420px; width: 100%; padding: 40px; background: #ffffff; border-radius: 10px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); text-align: center; border-top: 5px solid #007bff;
`;
const Title = styled.h2`
    color: #007bff; margin-bottom: 5px; font-size: 2em; font-weight: 700;
`;
const Subtitle = styled.p`
    color: #6c757d; margin-bottom: 30px; font-size: 0.95em;
`;
const FormGroup = styled.div`
    text-align: left; margin-bottom: 15px; label { display: block; margin-bottom: 5px; font-weight: 600; color: #495057; font-size: 0.9em; }
`;
const Input = styled.input`
    width: 100%; padding: 12px; border: 1px solid #ced4da; border-radius: 6px; font-size: 1em; transition: border-color 0.3s, box-shadow 0.3s; &:focus { border-color: #007bff; box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); outline: none; }
`;
const Select = styled.select`
    width: 100%; padding: 12px; border: 1px solid #ced4da; border-radius: 6px; font-size: 1em; background-color: white; appearance: none; cursor: pointer; transition: all 0.3s ease; &:focus { border-color: #007bff; box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); outline: none; }
`;
const LoginButton = styled.button`
    width: 100%; padding: 14px; background-color: #007bff; color: white; border: none; border-radius: 6px; font-size: 1.1em; font-weight: 700; cursor: pointer; transition: background-color 0.3s; margin-top: 10px; &:hover { background-color: #0056b3; }
`;
const SwitchLink = styled(Link)`
    display: block; margin-top: 25px; color: #28a745; text-decoration: none; font-size: 0.95em; &:hover { text-decoration: underline; }
`;
// --- End Styled Components ---

const LoginPage = () => {
    const navigate = useNavigate(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('citizen'); // Local state for selected role
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // 1. API Call to Backend (Authentication)
            // This relies entirely on the Node.js server running and setting the session cookie.
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });
            const data = response.data;


            // 2. SUCCESS: Server returns user data and sets secure session cookie
            const userRole = data.role; // <-- This is the AUTHENTICATED role from MongoDB
            
            // 3. Update STATIC_USER state for Header visibility/routing checks
            STATIC_USER.role = userRole; 
            STATIC_USER.name = data.name; 
            
            // 4. Redirection based on the AUTHENTICATED userRole
            if (userRole === 'admin') {
                navigate('/admin/dashboard');
            } else if (userRole === 'staff') {
                navigate('/staff/dashboard');
            } else {
                // Default to Citizen dashboard
                navigate('/submit-complaint'); 
            }

        } catch (err) {
            // Display the specific error message from the server 
            const errorMessage = err.response?.data?.message || 'Login failed. Check server connection.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <FormContainer>
                <Title>Sign In</Title>
                <Subtitle>Access the Drainage Complaint Management System</Subtitle>
                
                {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
                
                <form onSubmit={handleLogin}>
                    <FormGroup>
                        <label htmlFor="role-select">Log In As</label>
                        <Select id="role-select" value={role} onChange={(e) => setRole(e.target.value)} disabled={loading}>
                            <option value="citizen">Citizen (Report Issues)</option>
                            <option value="staff">Municipal Staff (Manage Tasks)</option>
                            <option value="admin">Administrator (System Oversight)</option>
                        </Select>
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="email">Email Address</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="password">Password</label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your registered password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </FormGroup>
                    <LoginButton type="submit" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Secure Login'}
                    </LoginButton>
                </form>
                <SwitchLink to="/register">New Citizen? Register for Reporting</SwitchLink>
            </FormContainer>
        </PageWrapper>
    );
};

export default LoginPage;