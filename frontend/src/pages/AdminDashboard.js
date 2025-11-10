// /src/pages/AdminDashboard.js (FINAL API/LEAFLET VERSION)

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; 
import { STATIC_USER, STAFF_USERS } from '../data'; 

axios.defaults.withCredentials = true;

// --- Custom Marker Icons (Used for Map Visualization) ---
const customIcon = (status) => {
    let color = '#007bff'; 
    if (status === 'Reported') color = '#ffc107'; 
    if (status === 'Resolved') color = '#28a745'; 
    if (status === 'In Progress') color = '#dc3545';

    return new L.DivIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white;"></div>`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41]
    });
};

// --- Styled Components (using transient prop $textColor) ---
const Container = styled.div`
    padding: 30px; max-width: 1300px; margin: 30px auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;
const HeaderGrid = styled.div`
    display: grid; grid-template-columns: 2fr 1fr; gap: 30px; margin-bottom: 40px;
`;
const Title = styled.h1`
    color: #343a40; margin-bottom: 20px; border-bottom: 3px solid #007bff; padding-bottom: 10px;
`;
const ProfileCard = styled.div`
    background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-left: 5px solid #007bff; text-align: left;
    h3 { margin-top: 0; color: #007bff; } p { margin: 5px 0; font-size: 0.9em; }
`;
const Card = styled.div`
    background: ${props => props.color || '#f8f9fa'}; 
    color: ${props => props.$textColor || '#333'}; 
    padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    h2 { font-size: 2.2em; margin: 0 0 5px; font-weight: 700; } p { font-size: 1em; margin: 0; opacity: 0.9; } &:hover { transform: translateY(-3px); }
`;
const CardGrid = styled.div`
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; margin-bottom: 40px;
`;
const MapVisualizationWrapper = styled.div`
    width: 100%; height: 450px; margin-bottom: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;
    & > .leaflet-container { width: 100%; height: 100%; border-radius: 8px; }
`;
const ComplaintTable = styled.table`
    width: 100%; border-collapse: collapse; margin-top: 20px; background: white; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    th, td { border: 1px solid #e9ecef; padding: 12px; text-align: left; font-size: 0.9em; }
    th { background-color: #343a40; color: white; font-weight: 600; text-transform: uppercase; } tr:nth-child(even) { background-color: #f8f9fa; }
`;
const StatusPill = styled.span`
    display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 0.85em; font-weight: 700; color: white; background-color: ${props => props.color};
`;
const getStatusColor = (status) => {
    switch (status) { case 'Reported': return '#ffc107'; case 'Assigned': return '#17a2b8'; case 'Resolved': return '#28a745'; case 'In Progress': return '#007bff'; default: return '#6c757d'; }
};

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllComplaints = async () => {
            try {
                // Admin role fetches all data (server logic handles returning the full set for Admin)
                const response = await axios.get('http://localhost:5000/api/complaints');
                setComplaints(response.data);
            } catch (err) {
                setError("Failed to fetch data. Please log in as Admin.");
                console.error("Admin Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllComplaints();
    }, []);

    // --- Metrics Calculation (Based on fetched data) ---
    const totalComplaints = complaints.length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const pending = complaints.filter(c => c.status !== 'Resolved').length;
    const newReports = complaints.filter(c => c.status === 'Reported').length;

    const mapCenter = [16.5380, 81.5285];

    if (loading) return <Container><h2>Loading System Data...</h2></Container>;
    if (error) return <Container><h2 style={{color: 'red'}}>{error}</h2></Container>;


    return (
        <Container>
            <HeaderGrid>
                <Title>👑 Administrator Dashboard: System Oversight</Title>
                <ProfileCard>
                    <h3>Admin Profile</h3>
                    <p><strong>Name:</strong> {STATIC_USER.name}</p>
                    <p><strong>Role:</strong> {STATIC_USER.role.toUpperCase()}</p>
                    <p><strong>Staff Count:</strong> {STAFF_USERS.length}</p>
                </ProfileCard>
            </HeaderGrid>
            
            <h2>Work Progress & Metrics</h2>
            <CardGrid>
                <Card color="#007bff" $textColor="white"><h2>{totalComplaints}</h2><p>Total Complaints Logged</p></Card>
                <Card color="#ffc107" $textColor="#333"><h2>{newReports}</h2><p>New (Reported) Issues</p></Card>
                <Card color="#dc3545" $textColor="white"><h2>{pending}</h2><p>Pending / In Progress</p></Card>
                <Card color="#28a745" $textColor="white"><h2>{resolved}</h2><p>Completed (Resolved)</p></Card>
            </CardGrid>

            <h2>Map Visualization of Active Issues</h2>
            <MapVisualizationWrapper>
                <MapContainer 
                    center={mapCenter} 
                    zoom={12} 
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {complaints.map(c => (
                        <Marker key={c._id} position={[c.location.lat, c.location.lon]} icon={customIcon(c.status)} >
                            <Popup>
                                <strong>{c.category}</strong><br />Status: {c.status}<br />Location: {c.location.address}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </MapVisualizationWrapper>

            <h2>Full Complaint Log</h2>
            <ComplaintTable>
                <thead>
                    <tr><th>ID</th><th>Date</th><th>Category</th><th>Severity</th><th>Assigned To</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                    {complaints.map(c => (
                        <tr key={c._id}>
                            <td>{c._id.substring(0, 6)}</td>
                            <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                            <td>{c.category}</td>
                            <td>{c.severity}</td>
                            <td>{c.assignedTo?.name || 'Unassigned'}</td>
                            <td><StatusPill color={getStatusColor(c.status)}>{c.status}</StatusPill></td>
                            <td><button style={{ padding: '5px', background: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Manage</button></td>
                        </tr>
                    ))}
                </tbody>
            </ComplaintTable>
        </Container>
    );
};

export default AdminDashboard;

