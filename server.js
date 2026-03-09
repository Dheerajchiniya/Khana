const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Nodemailer transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your email service
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-app-password' // Replace with your app password
  }
});

// API endpoint
app.post('/send-enquiry', async (req, res) => {
  const { name, email, phone, eventtype, eventdate, message } = req.body;

  // Validation
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'All required fields must be filled.' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  // Phone validation (basic)
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number.' });
  }

  // Prepare email content
  const mailOptions = {
    from: 'your-email@gmail.com', // Replace with your email
    to: 'chiniyadheeraj@gmail.com',
    subject: 'New Event Enquiry from NorthZaika Events',
    html: `
      <h2>New Enquiry Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Event Type:</strong> ${eventtype || 'Not specified'}</p>
      <p><strong>Event Date:</strong> ${eventdate || 'Not specified'}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Enquiry sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send enquiry. Please try again.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});