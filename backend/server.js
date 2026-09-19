const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const compression = require("compression");
const helmet = require("helmet");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://pitshield.vercel.app",
  "https://pitshield-admin.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without an Origin header
    // (Postman, server-to-server, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Explicitly handle browser preflight requests
app.options(/.*/, cors(corsOptions));

app.use(helmet());
app.use(compression());

app.use(express.json({ limit: "10kb" }));

// Connect MongoDB
connectDB();

// Request timeout
app.use((req, res, next) => {
  res.setTimeout(15000, () => {
    if (!res.headersSent) {
      res.status(408).json({
        success: false,
        message: "Request timed out",
      });
    }
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

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/potholes", require("./routes/potholeRoutes"));
app.use("/api/teams", require("./routes/teamRoutes"));

module.exports = app;

// Local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`PitShield Backend running on http://localhost:${PORT}`);
  });
}