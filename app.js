const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit"); // Add this line to require rate-limit

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Apply brute-force protection using express-rate-limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests from this IP, please try again after 15 minutes.",
});

// Apply rate limiter to all requests
app.use(limiter);

app.get("/", (req, res) => {
  res.send("Welcome to the Node js API!");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/auth/fingerprint", require("./routes/updateFingerprint"));
app.use("/api", require("./routes/emailVerificationRoutes"));
// app.use('/api/auth-phone', require('./routes/authPhone'));

// Special Authentication Routes (face and finger auth)
app.use("/api/specialauth", require("./routes/routes")); // Add this line

// Start the server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
