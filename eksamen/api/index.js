// Vercel Serverless Function - Express API
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import routes
const users = require("../backend/createUser");
const admin = require("../backend/admin");
const registerBoat = require("../backend/registerBoat");
const record = require("../backend/getRecord");
const meeting = require("../backend/meetingEdit");
const getChats = require("../backend/getChats");

const app = express();

// MongoDB connection string
const db = process.env.MONGODB_URI || 
  "mongodb+srv://tobias:3EZkUJgct3QLHau@cluster0.v5e8lmx.mongodb.net/fakeEksamen";
const dbName = process.env.DB_NAME || "fakeEksamen";

// MongoDB connection with caching for serverless
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: dbName,
    });
    cachedDb = mongoose.connection;
    console.log("✅ Connected to mongoDB");
    return cachedDb;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
}

// Middleware
app.use(express.json());

// CORS configuration - allow Vercel domains and localhost
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Allow localhost for development
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
        return callback(null, true);
      }
      
      // Allow all Vercel deployments (you can restrict this later for production)
      if (origin.includes("vercel.app") || origin.includes("vercel.com")) {
        return callback(null, true);
      }
      
      // For development, allow all origins
      if (process.env.NODE_ENV === "development") {
        return callback(null, true);
      }
      
      // Default: allow all (for easier deployment, restrict in production)
      callback(null, true);
    },
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
  })
);

// Connect to database before handling requests (MUST be before routes)
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(503).json({
      error: "Database connection failed",
      message: process.env.NODE_ENV === "development" ? err.message : "Service temporarily unavailable",
    });
  }
});

// Routes
app.use("/user", users);
app.use("/admin", admin);
app.use("/registerBoat", registerBoat);
app.use("/record", record);
app.use("/meeting", meeting);
app.use("/get", getChats);

// Health check endpoint (before database connection check)
app.get("/health", async (req, res) => {
  try {
    await connectToDatabase();
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
  } catch (err) {
    res.status(503).json({ 
      status: "error", 
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: err.message 
    });
  }
});

// Export as Vercel serverless function
module.exports = app;

