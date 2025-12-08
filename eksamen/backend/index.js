// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const cors = require("cors");
const users = require("./createUser");
const admin = require("./admin");
const registerBoat = require("./registerBoat");
const record = require("./getRecord");
const meeting = require("./meetingEdit");
const getChats = require("./getChats");

const app = express();
// Use environment variable or fallback to hardcoded connection string
const db =
  process.env.MONGODB_URI ||
  "mongodb+srv://tobias:3EZkUJgct3QLHau@cluster0.v5e8lmx.mongodb.net/fakeEksamen";
const port = process.env.PORT || 5000;

mongoose.set("strictQuery", false);

// Extract database name from connection string or use default
const dbName = process.env.DB_NAME || "fakeEksamen";

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: dbName,
  })
  .then(() => {
    console.log("✅ Connected to mongoDB");
    console.log(`📊 Database: ${dbName}`);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log(
      "⚠️  Server will continue running, but database features may not work."
    );
    console.log(
      "💡 Tip: Check your MONGODB_URI in .env file or see DATABASE_SETUP.md for help"
    );
  });

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/user", users);
app.use("/admin", admin);
app.use("/registerBoat", registerBoat);
app.use("/record", record);
app.use("/meeting", meeting);
app.use("/get", getChats);

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
