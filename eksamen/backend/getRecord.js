const router = require("express").Router();
const Record = require("./policeSchema");

router.post("/make", async (req, res) => {
  console.log(req.body);
  try {
    const newRecord = new Record({
      username: req.body.username,
      mailadress: req.body.mailadress,
      date: req.body.date,
      reason: req.body.reason,
    });
    const record = await newRecord.save();
    res.status(200).json(record);
  } catch (err) {
    res.status(500).json("feil");
  }
});

router.get("/find", async (req, res) => {
  try {
    const records = await Record.find();
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
