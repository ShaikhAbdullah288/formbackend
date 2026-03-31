const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const app = express();

app.use(cors({
  origin: "https://jobform-henna.vercel.app",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

const upload = multer({ storage: multer.memoryStorage() });

const Job = mongoose.model("Job", {
  name: String,
  email: String,
  phone: String,
  role: String,
  coverLetter: String,
  resume: String
});

app.post("/api/jobs", upload.single("resume"), async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      resume: req.file ? req.file.buffer.toString("base64") : null
      console.log(reg.file)
    });

    await job.save();

    res.json({ message: "Application submitted!" });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "Error", error: err.message });
  }
});

module.exports = app;
