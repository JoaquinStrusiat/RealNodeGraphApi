const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SPA_EMAIL,
    pass: process.env.SPA_EMAIL_PASSWORD,
  }
});

module.exports = transporter;
