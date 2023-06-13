const router = require("express").Router();
const Username = require("./user");

router.get("/seeUsers", async (req, res) => {
  try {
    const users = await Username.find(
      {},
      { username: 1, _id: 1, mailadress: 1, isAdmin: 1 }
    );
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assuming you have a user model/schema defined

// Update user isAdmin status
router.put("/updateUser/:userId", async (req, res) => {
  try {
    const id = req.params.userId; // Corrected the parameter name
    const user = await Username.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isAdmin = !user.isAdmin; // Toggle the isAdmin property

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user" });
  }
});

module.exports = router;
