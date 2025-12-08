const router = require("express").Router();
const Username = require("./user");
const bcrypt = require("bcryptjs");
const {
  validateEmail,
  validatePassword,
  validateUsername,
  checkDatabaseConnection,
} = require("./utils/validators");

router.post("/create", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (!checkDatabaseConnection()) {
      return res.status(503).json({
        error: "Database connection not available. Please try again later.",
      });
    }

    // Validate input
    const usernameValidation = validateUsername(req.body.username);
    if (!usernameValidation.valid) {
      return res.status(400).json({ error: usernameValidation.error });
    }

    const emailValidation = validateEmail(req.body.mailadress);
    if (!emailValidation.valid) {
      return res.status(400).json({ error: emailValidation.error });
    }

    const passwordValidation = validatePassword(req.body.password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUsername = new Username({
      username: req.body.username.trim(),
      mailadress: req.body.mailadress.trim().toLowerCase(),
      password: hashedPassword,
    });

    const username = await newUsername.save();
    res.status(201).json({
      message: "User created successfully",
      username: username.username,
      exists: false,
    });
  } catch (err) {
    console.error("Create user error:", err);

    // Handle duplicate key error (username or email already exists)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({
        error: `${field === "username" ? "Username" : "Email"} already exists`,
        exists: true,
      });
    }

    // Handle validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: Object.values(err.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }

    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (!checkDatabaseConnection()) {
      return res.status(503).json({
        error: "Database connection not available. Please try again later.",
      });
    }

    // Validate input
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await Username.findOne({ username: req.body.username.trim() });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Always verify password, even for admin users
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      isAdmin: user.isAdmin || false,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

router.post("/multiple", async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (!checkDatabaseConnection()) {
      return res.status(503).json({
        error: "Database connection not available. Please try again later.",
      });
    }

    if (!req.body.users || !Array.isArray(req.body.users)) {
      return res.status(400).json({ error: "Users array is required" });
    }

    const results = [];
    const errors = [];

    // Process each user
    for (let i = 0; i < req.body.users.length; i++) {
      const userData = req.body.users[i];
      
      try {
        // Validate input
        const usernameValidation = validateUsername(userData.username);
        if (!usernameValidation.valid) {
          errors.push({
            index: i,
            username: userData.username,
            error: usernameValidation.error,
          });
          continue;
        }

        const emailValidation = validateEmail(userData.mailadress);
        if (!emailValidation.valid) {
          errors.push({
            index: i,
            username: userData.username,
            error: emailValidation.error,
          });
          continue;
        }

        const passwordValidation = validatePassword(userData.password);
        if (!passwordValidation.valid) {
          errors.push({
            index: i,
            username: userData.username,
            error: passwordValidation.error,
          });
          continue;
        }

        // Check if user already exists
        const existingUser = await Username.findOne({
          $or: [
            { username: userData.username.trim() },
            { mailadress: userData.mailadress.trim().toLowerCase() },
          ],
        });

        if (existingUser) {
          errors.push({
            index: i,
            username: userData.username,
            error: existingUser.username === userData.username.trim()
              ? "Username already exists"
              : "Email already exists",
          });
          continue;
        }

        // Create user
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const newUsername = new Username({
          username: userData.username.trim(),
          mailadress: userData.mailadress.trim().toLowerCase(),
          password: hashedPassword,
        });

        const savedUser = await newUsername.save();
        results.push({
          index: i,
          username: savedUser.username,
          mailadress: savedUser.mailadress,
          success: true,
        });
      } catch (err) {
        console.error(`Error creating user ${i}:`, err);
        
        if (err.code === 11000) {
          const field = Object.keys(err.keyPattern)[0];
          errors.push({
            index: i,
            username: userData.username,
            error: `${field === "username" ? "Username" : "Email"} already exists`,
          });
        } else {
          errors.push({
            index: i,
            username: userData.username,
            error: err.message || "Failed to create user",
          });
        }
      }
    }

    res.status(200).json({
      success: results.length,
      failed: errors.length,
      results: results,
      errors: errors,
    });
  } catch (err) {
    console.error("Multiple users creation error:", err);
    res.status(500).json({
      error: "Internal server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

router.get("/huddly", async (req, res) => {
  try {
    // Check database connection
    if (!checkDatabaseConnection()) {
      return res.status(503).json({
        error: "Database connection not available. Please try again later.",
      });
    }

    const users = await Username.find({}, { username: 1, _id: 0 });
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      error: "Failed to fetch users",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

module.exports = router;
