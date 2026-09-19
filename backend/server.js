const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const compression = require("compression");
const helmet = require("helmet");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://pitshield.vercel.app",
      "https://pitshield-admin.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));

// Request timeout
app.use((req, res, next) => {
  res.setTimeout(15000, () => {
    res.status(408).json({
      success: false,
      message: "Request timed out",
    });
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

// Health check
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

// Export app for Vercel
module.exports = app;

// Local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `PitShield Backend running on http://localhost:${PORT}`
    );
  });
}