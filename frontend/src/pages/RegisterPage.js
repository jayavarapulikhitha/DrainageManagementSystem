// /src/pages/RegisterPage.js

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { STATIC_USER, TEST_ACCOUNT } from '../data';

// --- Styled Components (Minimal styles for brevity) ---
const PageWrapper = styled.div`
    background-color: #f0ff5; min-height: 90vh; display: flex; justify-content: center; align-items: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;
const FormContainer = styled.div`
    max-width: 420px; width: 100%; padding: 40px; background: #ffffff; border-radius: 10px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); text-align: center; border-top: 5px solid #28a745; 
`;
const Title = styled.h2`
    color: #28a745; margin-bottom: 5px; font-size: 2em; font-weight: 700;
`;
const Subtitle = styled.p`
    color: #6c757d; margin-bottom: 30px; font-size: 0.95em;
`;
const FormGroup = styled.div`
    text-align: left; margin-bottom: 15px; label { display: block; margin-bottom: 5px; font-weight: 600; color: #495057; font-size: 0.9em; }
`;
const Input = styled.input`
    width: 100%; padding: 12px; border: 1px solid #ced4da; border-radius: 6px; font-size: 1em; transition: border-color 0.3s, box-shadow 0.3s; &:focus { border-color: #28a745; box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25); outline: none; }
`;
const RegisterButton = styled.button`
    width: 100%; padding: 14px; background-color: #28a745; color: white; border: none; border-radius: 6px; font-size: 1.1em; font-weight: 700; cursor: pointer; transition: background-color 0.3s; margin-top: 10px; &:hover { background-color: #1e7e34; }
`;
const SwitchLink = styled(Link)`
    display: block; margin-top: 25px; color: #007bff; text-decoration: none; font-size: 0.95em; &:hover { text-decoration: underline; }
`;
const slideDown = keyframes`
    from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); }
`;
const SuccessAlert = styled.div`
    background-color: #d4edda; color: #155724; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-weight: 600; border: 1px solid #c3e6cb; animation: ${slideDown} 0.3s ease-out;
`;
// --- End Styled Components ---

const RegisterPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Ensure axios sends cookies/session information
    axios.defaults.withCredentials = true; 

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // 1. API Call to register new user (Sends required name, email, password)
            const { data } = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                email,
                password,
            });

            // 2. Registration Success: Update local state for session simulation
            STATIC_USER.role = data.role; 
            STATIC_USER.name = data.name; 
            TEST_ACCOUNT.email = email;
            TEST_ACCOUNT.password = password; 
            
            // 3. Display success and redirect after short delay
            setIsRegistered(true);
            setTimeout(() => {
                navigate('/submit-complaint'); 
            }, 1500); 

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Check server status.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <FormContainer>
                <Title>Citizen Registration</Title>
                <Subtitle>Create an account to quickly report local issues.</Subtitle>
                
                {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
                {isRegistered && ( <SuccessAlert>✅ Registration successful! Redirecting to your dashboard...</SuccessAlert> )}

                <form onSubmit={handleRegister}>
                    {/* --- START CORRECT FORM INPUTS --- */}
                    <FormGroup>
                        <label htmlFor="name">Full Name</label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isRegistered || loading}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="email">Email Address</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isRegistered || loading}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="password">Password</label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Password (min 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isRegistered || loading}
                        />
                    </FormGroup>
                    {/* --- END CORRECT FORM INPUTS --- */}
                    
                    <RegisterButton type="submit" disabled={isRegistered || loading}>
                        {loading ? 'Registering...' : (isRegistered ? 'Registered!' : 'Register Account')}
                    </RegisterButton>
                </form>
                <SwitchLink to="/login">Already have an account? Sign In</SwitchLink>
            </FormContainer>
        </PageWrapper>
    );
};

export default RegisterPage;