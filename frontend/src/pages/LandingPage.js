// /src/pages/LandingPage.js

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

// --- Animations ---
const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0px); }
`;

// --- Styled Components ---
const HeroSection = styled.div`
    padding: 80px 40px;
    max-width: 1400px;
    margin: 0 auto;
    text-align: center;
    background-color: #f8f9fa; /* Very light, professional background */
    min-height: 85vh;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h1`
    font-size: 4em;
    color: #007bff; /* Primary Blue */
    margin-bottom: 10px;
    font-weight: 900;
    letter-spacing: -1.5px;
    span {
        color: #28a745; /* Secondary Green */
    }
`;

const Subtitle = styled.p`
    font-size: 1.6em;
    color: #495057;
    margin-bottom: 60px;
    font-weight: 300;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
`;

const FeatureGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 30px;
    margin: 50px 0 80px;
`;

const FeatureCard = styled.div`
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08); /* Defined, clean shadow */
    text-align: left;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid #e9ecef;

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
    }

    h3 {
        color: #333;
        font-size: 1.5em;
        margin-top: 15px;
        border-bottom: 2px solid ${props => props.color};
        padding-bottom: 8px;
    }

    .icon {
        font-size: 2.2em;
        color: ${props => props.color};
    }
    
    p {
        color: #6c757d;
        font-size: 1em;
        margin-top: 15px;
    }
`;

const ActionContainer = styled.div`
    margin-top: 40px;
`;

const ActionHeader = styled.h2`
    font-size: 1.8em;
    color: #343a40;
    margin-bottom: 25px;
`;

const RoleActionGroup = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 25px;
    flex-wrap: wrap;
`;

const ActionLink = styled(Link)`
    display: inline-block;
    padding: 14px 30px;
    text-decoration: none;
    border-radius: 50px; /* Pill shape for modern look */
    font-size: 1.1em;
    font-weight: bold;
    letter-spacing: 0.5px;
    transition: background-color 0.3s, transform 0.2s;
    animation: ${float} 4s ease-in-out infinite;

    &.login {
        background-color: #007bff;
        color: white;
        box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
        &:hover {
            background-color: #0056b3;
            transform: scale(1.03);
            animation: none;
        }
    }

    &.signup {
        background-color: #28a745;
        color: white;
        box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
        &:hover {
            background-color: #218838;
            transform: scale(1.03);
            animation: none;
        }
    }
`;


const LandingPage = () => {
    return (
        <HeroSection>
            <Title>
                Smart Drainage Management System
            </Title>
            <Subtitle>
                The centralized digital platform for quick issue reporting, transparent tracking, and efficient municipal operations.
            </Subtitle>

            <ActionContainer>
                <ActionHeader>Ready to start? Select your entry point:</ActionHeader>
                <RoleActionGroup>
                    <ActionLink to="/login" className="login">
                        Sign In (Citizen / Staff)
                    </ActionLink>
                    <ActionLink to="/register" className="signup">
                        New Citizen Registration
                    </ActionLink>
                </RoleActionGroup>
            </ActionContainer>


            <FeatureGrid>
                <FeatureCard color="#17a2b8">
                    <span className="icon">🗺️</span>
                    <h3>Precision Geo-Reporting</h3>
                    <p>Users pinpoint the exact location of the issue on a map, providing **accurate coordinates** for rapid dispatch and eliminating guesswork.</p>
                </FeatureCard>
                <FeatureCard color="#ffc107">
                    <span className="icon">📈</span>
                    <h3>Real-Time Analytics</h3>
                    <p>Administrative dashboards display **live complaint trends, heatmaps, and priority areas** for data-driven municipal planning.</p>
                </FeatureCard>
                <FeatureCard color="#dc3545">
                    <span className="icon">⏱️</span>
                    <h3>Swift Issue Resolution</h3>
                    <p>Staff dashboards convert complaints into **prioritized, geo-routed work orders**, drastically reducing response times and improving service delivery.</p>
                </FeatureCard>
            </FeatureGrid>
        </HeroSection>
    );
};

export default LandingPage;