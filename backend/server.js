const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Added path import
const db = require('./db');

const authRoutes = require('./routes/auth');
const vinylRoutes = require('./routes/vinyls');
const adminRoutes = require('./routes/admin');
const genreRoutes = require('./routes/genres'); // Import genres

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Modified uploads static path

// Routes
// We group routes by feature to keep code clean (Modular Architecture)
app.use('/api/auth', authRoutes); // Handles Login/Register
app.use('/api/vinyls', vinylRoutes); // Handles Vinyl CRUD
app.use('/api/admin', adminRoutes); // Handles Admin Dashboard
app.use('/api/genres', genreRoutes); // Handles Dynamic Genre Management

// Health Check
app.get('/', (req, res) => {
    res.send('Music Online API Running'); // Modified health check message
});

// Database Connection Check
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 as result');
        res.json({ message: 'Database connected successfully', result: rows[0] });
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({ error: 'Database connection failed', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
