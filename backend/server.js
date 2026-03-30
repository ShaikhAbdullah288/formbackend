const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors({
  origin: "https://jobform-henna.vercel.app"
}));

mongoose.connect("mongodb://127.0.0.1:27017/jobDB")
  .then(() => console.log("DB Connected"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

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
   resume: req.file ? req.file.filename : null
    });

    await job.save();
    res.json({ message: "Application submitted!" });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "Error" , error: err.message});
  }
});

app.listen(5000, () => console.log("Server running"));
