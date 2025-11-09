// /server/server.js - FINAL MONOLITHIC CODEBASE WITH ALL FEATURES (Corrected Admin Filter)

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// --- 1. CONFIGURATION AND INITIALIZATION ---

dotenv.config();
const PORT = process.env.PORT || 5000;

// Database Connection Function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

const app = express();

// --- 2. MONGOOSE MODELS (SCHEMAS) ---

// User Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['citizen', 'staff', 'admin'],
    default: 'citizen',
  },
}, { timestamps: true });
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model('User', UserSchema);

// Complaint Model
const ComplaintSchema = new mongoose.Schema({
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
  },
  contactNumber: { type: String, required: true },
  landmark: { type: String },
  category: { type: String, enum: ['Waterlogging', 'Overflowing Drain', 'Foul Odor', 'Blockage', 'Other'], required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  description: { type: String, required: true },
  status: { type: String, enum: ['Reported', 'Assigned', 'In Progress', 'Resolved', 'Closed'], default: 'Reported' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  imageUrl: { type: String },
}, { timestamps: true });
const Complaint = mongoose.model('Complaint', ComplaintSchema);


// --- 3. MIDDLEWARE SETUP ---

// CORS (Allows session cookies from React frontend)
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json()); // Body parser

// Express Session Setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: false, // Set to true in HTTPS production
        httpOnly: true,
    },
}));

// Session Protection Middleware 
const sessionProtect = asyncHandler(async (req, res, next) => {
    if (req.session && req.session.userId) {
        const user = await User.findById(req.session.userId).select('-password');
        if (!user) {
            req.session.destroy();
            res.status(401);
            throw new Error('Not authorized, user not found');
        }
        req.user = user; // Attach user object
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized, no active session');
    }
});

// Role-Based Access Control (RBAC) Middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

const staffOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'staff' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as staff' });
    }
};


// --- 4. CONTROLLERS (LOGIC) ---

// Auth Controllers
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password, role: 'citizen' });

  if (user) {
    req.session.userId = user._id; // Establish Session
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    req.session.userId = user._id; // Establish Session
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const logoutUser = asyncHandler(async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Could not log out successfully." });
        }
        res.clearCookie('connect.sid'); 
        res.status(200).json({ message: "Logout successful" });
    });
});

// Complaint Controllers
const createComplaint = asyncHandler(async (req, res) => {
  const { location, category, severity, description, contactNumber, landmark, imageUrl } = req.body;

  if (!location.address || !category || !description || !contactNumber) {
    res.status(400);
    throw new Error('Please include all required fields');
  }

  const complaint = await Complaint.create({
    submittedBy: req.user._id, 
    location, category, severity, description, contactNumber, landmark, imageUrl,
    status: 'Reported',
  });

  res.status(201).json(complaint);
});

const getDashboardComplaints = asyncHandler(async (req, res) => {
    let filter = {}; 
    const userRole = req.user.role;
    const userId = req.user._id;

    if (userRole === 'citizen') {
        filter = { submittedBy: userId };
    } else if (userRole === 'staff') { // CORRECTED: Staff filter is applied only to Staff
        filter = { 
            $or: [
                { assignedTo: userId },
                { status: 'Reported' } 
            ]
        };
    } 
    // If userRole is 'admin', filter remains empty ({}) -> fetches all complaints for metrics

    const complaints = await Complaint.find(filter)
        .populate('submittedBy', 'name email')
        .populate('assignedTo', 'name')
        .sort({ status: 1, severity: -1 });

    res.status(200).json(complaints);
});


// --- 5. ROUTING ---

app.get('/', (req, res) => {
  res.send('Drainage Complaint Management API is Running (Sessions Active).');
});

// AUTH Routes
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.post('/api/auth/logout', logoutUser);

// COMPLAINT Routes 
app.post('/api/complaints', sessionProtect, createComplaint);
app.get('/api/complaints', sessionProtect, getDashboardComplaints);


// --- 6. SERVER START ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});