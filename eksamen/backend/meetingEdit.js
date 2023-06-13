const router = require("express").Router();
const Meeting = require("./meetingSchema");

router.post("/create", async (req, res) => {
  try {
    const newMeeting = new Meeting({
      title: req.body.title,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      location: req.body.location,
      agenda: req.body.agenda,
      isCompleted: req.body.isCompleted,
    });
    const username = await newMeeting.save();
    res.status(200).json(username);
  } catch (err) {
    res.status(500).json("feil1");
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Meeting.deleteOne({ _id: id });
    res.send(`Meeting ${id} deleted.`);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { isCompleted } = req.body;
    const meeting = await Meeting.findByIdAndUpdate(
      id,
      { isCompleted },
      { new: true }
    );

    res.json(meeting);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating meeting" });
  }
});

router.get("/fetch", async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.status(200).json(meetings);
    console.log(meetings);
  } catch (err) {
    res.status(500).json("feil2");
  }
});

module.exports = router;
