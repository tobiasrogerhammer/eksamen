const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const cors = require("cors");
const users = require("./createUser");
const admin = require("./admin");
const registerBoat = require("./registerBoat");
const record = require("./getRecord");

const app = express();
const db =
  "mongodb+srv://tobias:3EZkUJgct3QLHau@cluster0.v5e8lmx.mongodb.net/fakeEksamen";
const port = 5000;

mongoose.set("strictQuery", false);
mongoose.connect(db, {});
mongoose
  .connect(
    "mongodb+srv://tobias:3EZkUJgct3QLHau@cluster0.v5e8lmx.mongodb.net/fakeEksamen",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "fakeEksamen",
    }
  )
  .then(console.log("Connected to mongoDB"))
  .catch((err) => console.log(err));

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

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
