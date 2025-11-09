// /src/data.js (FINAL VERSION with Localized Data)

// This object holds the last successfully registered user's credentials 
export let TEST_ACCOUNT = {
    email: 'test@municipality.com',
    password: '123',
};

// This object tracks the current session user (role determines access/links)
export const STATIC_USER = {
    role: 'none', 
    name: 'Guest',
    email: '',
};

// --- STATIC COMPLAINTS (Set to Bhimavaram/Chinna Amiram Coordinates) ---
export const STATIC_COMPLAINTS = [
    {
        id: 'C001', submittedBy: 'CITIZEN User', category: 'Waterlogging', severity: 'High',
        description: 'Severe water buildup near the main railway gate, traffic halt.',
        status: 'Assigned', assignedTo: 'Rajesh Kumar', date: '2025-11-08',
        location: { 
            address: 'Railway Station Road, Bhimavaram', 
            lat: 16.5365, // Near Bhimavaram Town Railway Station
            lon: 81.5220, 
        },
        history: [
            { timestamp: '2025-11-08 09:00', actor: 'CITIZEN User', action: 'Report Submitted.' },
            { timestamp: '2025-11-08 10:30', actor: 'Admin User', action: 'Complaint assigned to Rajesh Kumar.' },
            { timestamp: '2025-11-08 15:45', actor: 'Rajesh Kumar', action: 'Status changed to In Progress.' },
        ]
    },
    {
        id: 'C002', submittedBy: 'Priya Sharma', category: 'Foul Odor', severity: 'Medium',
        description: 'Strong sewage smell coming from the open drain near the village entrance.',
        status: 'Reported', assignedTo: null, date: '2025-11-09',
        location: { 
            address: 'Main Road, Chinna Amiram Village', 
            lat: 16.5450, // Chinna Amiram Area
            lon: 81.5450, 
        },
        history: [
            { timestamp: '2025-11-09 11:00', actor: 'Priya Sharma', action: 'Report Submitted.' },
        ]
    },
    {
        id: 'C003', submittedBy: 'Rajesh Kumar', category: 'Blockage', severity: 'Low',
        description: 'Minor debris blockage near the main market complex.',
        status: 'Resolved', assignedTo: 'Rajesh Kumar', date: '2025-11-07',
        location: { 
            address: 'Old Market Area, Bhimavaram Center', 
            lat: 16.5400, // Central Bhimavaram
            lon: 81.5200, 
        },
        history: [
            { timestamp: '2025-11-07 14:00', actor: 'Admin User', action: 'Complaint assigned to Rajesh Kumar.' },
            { timestamp: '2025-11-07 17:30', actor: 'Rajesh Kumar', action: 'Status changed to Resolved.' },
        ]
    },
];

export const STAFF_USERS = [
    { id: 'S1', name: 'Rajesh Kumar' },
    { id: 'S2', name: 'Alia Bhatt' },
];