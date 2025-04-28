require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const otpRoutes = require('./routes/otpRoutes');
const apBiometricRoutes = require('./routes/apBiometricRoutes');

const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/auth', otpRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth', apBiometricRoutes)

app.get('/', (req, res) => {
    res.send('Hello world!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
