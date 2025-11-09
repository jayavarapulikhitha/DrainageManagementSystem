// /src/pages/MyComplaintsPage.js (FINAL API INTEGRATION)

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { STATIC_USER } from '../data'; 

// --- CRITICAL: Configure axios to send session cookies ---
axios.defaults.withCredentials = true; 

// --- Styled Components ---

const Container = styled.div`
    padding: 30px;
    max-width: 900px;
    margin: 40px auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const ReportCard = styled.div`
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    /* Dynamic color line based on status */
    border-left: 5px solid ${props => props.statusColor}; 
    
    h3 {
        color: #007bff;
        margin-top: 0;
    }
`;

const StatusPill = styled.span`
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.9em;
    font-weight: bold;
    color: white;
    background-color: ${props => props.color};
`;

// --- Utility Function ---
const getStatusColor = (status) => {
    switch (status) {
        case 'Reported': return '#ffc107'; // Yellow
        case 'Assigned': return '#17a2b8'; // Light Blue
        case 'In Progress': return '#007bff'; // Blue
        case 'Resolved': return '#28a745'; // Green
        default: return '#6c757d'; // Gray
    }
};


const MyComplaintsPage = () => {
    // NEW STATE: To hold complaints fetched from the API
    const [userReports, setUserReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserComplaints = async () => {
            try {
                // API Call: Server automatically filters data for the Citizen's submitted reports
                const response = await axios.get('http://localhost:5000/api/complaints');
                setUserReports(response.data);
                
            } catch (err) {
                setError("Failed to load your reports. Please ensure you are logged in.");
                console.error("Complaint Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserComplaints();
    }, []);


    if (loading) return <Container><h2>Loading Your Reports...</h2></Container>;
    if (error) return <Container><h2 style={{color: 'red'}}>{error}</h2></Container>;


    return (
        <Container>
            <h1>My Submitted Drainage Reports 📋</h1>
            <p>Welcome, **{STATIC_USER.name}**! Here is the status of the issues you've reported.</p>

            {userReports.length === 0 ? (
                <p style={{ color: '#dc3545', fontWeight: 'bold' }}>
                    You haven't submitted any complaints yet. Use the "Report Issue" link to submit one.
                </p>
            ) : (
                userReports.map(c => (
                    <ReportCard key={c._id} statusColor={getStatusColor(c.status)}> {/* Use MongoDB _id */}
                        <h3>Complaint ID: {c._id ? c._id.substring(0, 6) : 'N/A'} - {c.category}</h3>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <p style={{ margin: 0 }}><strong>Location:</strong> {c.location.address}</p>
                            <StatusPill color={getStatusColor(c.status)}>
                                {c.status}
                            </StatusPill>
                        </div>
                        
                        <p style={{ margin: '5px 0' }}><strong>Severity:</strong> {c.severity}</p>
                        <p style={{ margin: '5px 0' }}><strong>Description:</strong> {c.description}</p>
                        <p style={{ margin: '5px 0' }}><strong>Assigned To:</strong> {c.assignedTo?.name || 'N/A'}</p> {/* Use optional chaining for name */}
                        <p style={{ fontSize: '0.9em', color: '#6c757d', margin: '10px 0 0' }}>
                            Reported on: {new Date(c.createdAt).toLocaleDateString()}
                        </p>
                    </ReportCard>
                ))
            )}
        </Container>
    );
};

export default MyComplaintsPage;