// backend/server.js

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.ContactUs_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected to: Contact Us");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// Email sender function
const sendEmail = async ({ name, email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Or another email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: "kisibojonathan150@gmail.com",
    subject,
    text: `From: ${name} <${email}>\n\n${message}`,
  };

  await transporter.sendMail(mailOptions);
};

// Contact form endpoint
app.post("/contact", async (req, res) => {
  const { formData } = req.body;

  if (
    !formData.name ||
    !formData.email ||
    !formData.service ||
    !formData.message
  ) {
    return res
      .status(400)
      .json({ message: "Some feilds are missing, please try again!" });
  }

  try {
    await sendEmail({
      name: formData.name,
      email: formData.email,
      subject: formData.service,
      message: formData.message,
    });
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
