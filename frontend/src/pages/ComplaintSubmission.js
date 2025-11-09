// /src/pages/ComplaintSubmission.js (FINAL WORKING VERSION)

import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet'; 
import { STATIC_COMPLAINTS } from '../data'; 

// --- CRITICAL: Configure axios to send session cookies ---
axios.defaults.withCredentials = true; 

// --- Styled Components (Minimal styles for brevity) ---
const Container = styled.div`
    max-width: 900px; margin: 30px auto; padding: 25px; background: #fff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); font-size: 0.95em;
`;
const MapWrapper = styled.div`
    height: 350px; width: 100%; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 6px; 
    & > .leaflet-container { width: 100%; height: 100%; border-radius: 6px; }
`;
const Form = styled.form`
    display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;
`;
const FormGroup = styled.div`
    display: flex; flex-direction: column; 
    label { margin-bottom: 5px; font-weight: 600; color: #495057; font-size: 0.95em; } 
    select, textarea, input[type="text"], input[type="tel"], input[type="file"] { padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 0.9em; }
    label::after { content: '*'; color: red; margin-left: 4px; } 
    input[type="file"]::after { content: ''; }
`;
const Button = styled.button`
    grid-column: 1 / 3; padding: 10px 0; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1em; transition: background-color 0.2s;
    &:hover { background-color: #218838; }
`;

// --- Custom Marker Icons (Required by Leaflet) ---
const customIcon = (status) => {
    let color = status === 'Resolved' ? '#28a745' : '#ffc107'; 
    return new L.DivIcon({ className: 'custom-div-icon', html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white;"></div>`, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [0, -41] });
};
const NewPinIcon = new L.DivIcon({
    className: 'new-pin-icon', html: `<div style="color: red; font-size: 25px;">📍</div>`, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [0, -41]
});


// --- Leaflet Map Interaction Component ---
const MapEventsHandler = ({ onLocationSelect, markerPosition }) => {
    useMapEvents({ 
        click(e) {
            const lat = e.latlng.lat;
            const lon = e.latlng.lng;
            const address = `Simulated Address: Lat ${lat.toFixed(4)}, Lon ${lon.toFixed(4)}`;
            onLocationSelect({ lat, lon, address });
        },
    });
    return markerPosition.lat !== 0 ? (
        <Marker position={[markerPosition.lat, markerPosition.lon]} icon={NewPinIcon} />
    ) : null;
};


// --- Main Complaint Submission Form ---
const ComplaintSubmission = () => {
    const [formData, setFormData] = useState({
        category: '', severity: 'Medium', description: '', landmark: '', contactNumber: '', location: { lat: 0, lon: 0, address: '' }, imageFile: null,
    });
    
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault(); // <-- Prevents browser reload (CRITICAL)
        
        if (formData.location.lat === 0) {
            alert("Please pin the location on the map first!");
            return;
        }
        setLoading(true);

        try {
            const payload = {
                location: formData.location, category: formData.category, severity: formData.severity, 
                description: formData.description, contactNumber: formData.contactNumber, 
                landmark: formData.landmark, imageUrl: 'placeholder_url',
            };

            await axios.post('http://localhost:5000/api/complaints', payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            alert(`Complaint Submitted Successfully!`);
            setFormData({ category: '', severity: 'Medium', description: '', landmark: '', contactNumber: '', location: { lat: 0, lon: 0, address: '' }, imageFile: null });

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Submission failed. Are you logged in?';
            alert(`Error: ${errorMessage}`);
            console.error("Submission Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const mapCenter = [16.5380, 81.5285]; 

    return (
        <Container>
            <h1>Report New Drainage Issue 🚨</h1>
            
            <p>1. **Pin Location:** Click on the map to mark the exact spot of the issue.</p>
            
            <MapWrapper>
                <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapEventsHandler onLocationSelect={(loc) => setFormData(prev => ({ ...prev, location: loc }))} markerPosition={formData.location} />
                    
                    {STATIC_COMPLAINTS.map(c => (
                        <Marker key={c.id} position={[c.location.lat, c.location.lon]} icon={customIcon(c.status)}>
                            <Popup><strong>{c.category}</strong><br />Status: {c.status}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </MapWrapper>

            <p style={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px', fontSize: '0.9em' }}>
                📍 Reported Address: {formData.location.address || 'Waiting for location pin...'}
            </p>

            <form onSubmit={handleSubmit}> {/* <-- CRITICAL: onSubmit is here */}
                {/* --- START ALL FORM INPUTS (Now present) --- */}
                <FormGroup><label htmlFor="landmark">Landmark / Near Intersection (Optional)</label><input type="text" id="landmark" name="landmark" value={formData.landmark} onChange={handleChange}/></FormGroup>
                <FormGroup><label htmlFor="contactNumber">Contact Number</label><input type="tel" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required/></FormGroup>
                
                <FormGroup><label htmlFor="category">Issue Category</label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                        <option value="">-- Select Issue Type --</option><option value="Waterlogging">Waterlogging</option><option value="Overflowing Drain">Overflowing Drain</option>
                        <option value="Foul Odor">Foul Odor / Sewage Leak</option><option value="Blockage">Blockage</option><option value="Other">Other</option>
                    </select>
                </FormGroup>

                <FormGroup><label htmlFor="severity">Severity</label>
                    <select id="severity" name="severity" value={formData.severity} onChange={handleChange}>
                        <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option><option value="Critical">Critical</option>
                    </select>
                </FormGroup>

                <FormGroup style={{ gridColumn: '1 / 3' }}><label htmlFor="description">Detailed Description</label><textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows="4"/></FormGroup>
                
                <FormGroup style={{ gridColumn: '1 / 3' }}><label htmlFor="imageFile">Upload Image Proof (Optional)</label><input type="file" id="imageFile" name="imageFile" onChange={(e) => setFormData({...formData, imageFile: e.target.files[0]})}/></FormGroup>
                {/* --- END ALL FORM INPUTS --- */}
                
                <Button type="submit" disabled={!formData.location.address || loading}>
                    {loading ? 'Submitting...' : 'Submit Complaint'}
                </Button>
            </form>
        </Container>
    );
};

export default ComplaintSubmission;