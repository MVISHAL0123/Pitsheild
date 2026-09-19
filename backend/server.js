const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const compression = require("compression");
const helmet = require("helmet");

dotenv.config();

const connectDB = require("./config/db");

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// Request timeout (15 seconds)
app.use((req, res, next) => {
  res.setTimeout(15000, () => {
    res.status(408).json({ success: false, message: "Request timed out" });
  });
  next();
});

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PitShield Backend is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "PitShield backend and MongoDB are connected",
  });
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/potholes", require("./routes/potholeRoutes"));
app.use("/api/teams", require("./routes/teamRoutes"));

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`PitShield Backend running on http://localhost:${PORT}`);
});