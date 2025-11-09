// /src/pages/StaffDashboard.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios'; // <-- For API Calls
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; 
import { STATIC_USER } from '../data'; 

// --- Configure axios for sessions ---
axios.defaults.withCredentials = true;

// --- Custom Marker Icons ---
const customIcon = (status) => {
    let color = '#007bff';
    if (status === 'Reported') color = '#ffc107'; 
    if (status === 'Resolved') color = '#28a745'; 
    if (status === 'In Progress') color = '#17a2b8';

    return new L.DivIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white;"></div>`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41]
    });
};

// --- Styled Components (Minimal styles for brevity) ---
const Container = styled.div`
    padding: 30px; max-width: 1100px; margin: 30px auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;
const Title = styled.h1`
    color: #343a40; margin-bottom: 20px; border-bottom: 3px solid #17a2b8; padding-bottom: 10px;
`;
const ComplaintCard = styled.div`
    border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 25px; background: #fff; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); border-left: 6px solid ${props => props.statusColor}; 
    h3 { color: #17a2b8; margin-top: 0; font-size: 1.4em; }
`;
const StatusPill = styled.span`
    display: inline-block; padding: 5px 12px; border-radius: 15px; font-size: 0.9em; font-weight: 700; color: white; background-color: ${props => props.color};
`;
const ActionButton = styled.button`
    padding: 10px 20px; margin-right: 10px; background-color: ${props => props.primary ? '#28a745' : '#007bff'}; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600; transition: background-color 0.2s; 
    &:hover { opacity: 0.9; }
`;
const MapVisualizationWrapper = styled.div`
    width: 100%; height: 350px; margin-bottom: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;
    & > .leaflet-container { width: 100%; height: 100%; border-radius: 8px; }
`;

const getStatusColor = (status) => {
    switch (status) {
        case 'Reported': return '#ffc107'; case 'Assigned': return '#007bff'; 
        case 'In Progress': return '#17a2b8'; case 'Resolved': return '#28a745'; 
        default: return '#6c757d'; 
    }
};
// --- End Styled Components ---


const StaffDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                // Fetch data from the endpoint that filters by role (Staff/Admin/Citizen)
                const response = await axios.get('http://localhost:5000/api/complaints');
                setComplaints(response.data);
            } catch (err) {
                setError("Failed to fetch tasks. Ensure you are logged in as Staff/Admin.");
                console.error("Staff Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);

    const mapCenter = [16.5380, 81.5285]; 

    if (loading) return <Container><h2>Loading Staff Tasks...</h2></Container>;
    if (error) return <Container><h2 style={{color: 'red'}}>{error}</h2></Container>;


    return (
        <Container>
            <Title>🚧 Staff Dashboard: Assigned Tasks & New Reports</Title>
            <p style={{ fontSize: '1.1em', color: '#333', marginBottom: '30px' }}>
                Welcome, **{STATIC_USER.name}**! You have **{complaints.length}** tasks requiring attention.
            </p>

            <h2>Issue Map (Staff View)</h2>
            <MapVisualizationWrapper>
                <MapContainer 
                    center={mapCenter} 
                    zoom={12} 
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {complaints.map(c => (
                        <Marker 
                            key={c._id} 
                            position={[c.location.lat, c.location.lon]} 
                            icon={customIcon(c.status)}
                        >
                            <Popup>
                                <strong>{c.category} - {c.status}</strong><br />
                                Location: {c.location.address}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </MapVisualizationWrapper>
            
            <h2>Actionable Tasks</h2>
            {complaints.length === 0 ? (
                <p style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9f7ef', border: '1px solid #d4edda', borderRadius: '5px' }}>
                    ✅ Great work! No active or new tasks right now.
                </p>
            ) : (
                complaints.map(c => (
                    <ComplaintCard key={c._id} statusColor={getStatusColor(c.status)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <h3>{c.category} - Complaint #{c._id ? c._id.substring(0, 6) : 'N/A'}</h3>
                            <StatusPill color={getStatusColor(c.status)}>{c.status}</StatusPill>
                        </div>
                        
                        <p><strong>Submitted By:</strong> {c.submittedBy?.name || 'N/A'}</p>
                        <p><strong>Location:</strong> {c.location.address}</p>
                        
                        <div style={{ marginTop: '20px' }}>
                            {c.status === 'Reported' && (
                                <ActionButton primary onClick={() => alert(`API Integration required: Take Assignment for ${c._id}`)}>
                                    Take Assignment
                                </ActionButton>
                            )}
                            {c.status !== 'Resolved' && (
                                <ActionButton onClick={() => alert(`API Integration required: Update status for ${c._id}`)}>
                                    Update Status / Resolve
                                </ActionButton>
                            )}
                        </div>
                    </ComplaintCard>
                ))
            )}
        </Container>
    );
};

export default StaffDashboard;