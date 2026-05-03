const nodemailer = require('nodemailer');

// This is a setup for Nodemailer. 
// Note: This script should ideally run on the backend (Node.js environment).
// In this project, you can integrate this into backend/server.js.

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'skilllbridgeofficial@gmail.com', // Replace with your email
    pass: '9b9mqteb'    // Replace with your app password
  }
});

const sendAvailabilityEmail = (studentEmail, mentorName) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: studentEmail,
    subject: 'Mentor Available!',
    text: `Hi, Mentor ${mentorName} is now available. You can proceed with the payment on the checkout page.`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = { sendAvailabilityEmail };
