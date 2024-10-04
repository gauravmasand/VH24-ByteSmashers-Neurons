const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Node js API!');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/emailVerificationRoutes'));
// app.use('/api/auth-phone', require('./routes/authPhone'));


// Special Authentication Routes (face and finger auth)
app.use('/api/specialauth', require('./routes/routes')); // Add this line


// Start the server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
