const express = require("express");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000;
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const path = require("path");

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PATCH,DELETE,PUT,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error Connecting to MongoDB");
  });

app.listen(port, () => {
  console.log("server is running on port 3000");
});

// CONFIGURATIONS
const sendEmail = async (email, subject, message, name) => {
  //create a nodemailer transporter

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //compose the email message
  const mailOptions = {
    from: email,
    to: "kisibojonathan150@gmail.com",
    subject: subject,
    text: `My name is ${name},\n ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error sending email", error);
  }
};

// POST route to handle contact form data
app.post("/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  // You can now use this data (e.g., save to DB, send email, etc.)
  console.log("Received contact form data:");
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Subject:", subject);
  console.log("Message:", message);

  try {
    sendEmail(name, email, subject, message);
  } catch (err) {
    console.log(err);
  }
  res.status(200).json({ message: "Contact form submitted successfully!" });
});
