const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Generate OTP function
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 999999);
};

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: false,
    auth: {
        user: 'ak6155@srmist.edu.in', // Your Gmail email
        pass: 'Aangan#1'         // Your Gmail password
    }
});

app.post('/send-otp', (req, res) => {
    const email = req.body.email;
    const otp = generateOTP();

    const mailOptions = {
        from: 'ak6155@srmist.edu.in',
        to: email,
        subject: 'OTP Verification',
        text: `Hi there, this is a system generated mail and a part of my project that I am building. Your OTP is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error sending OTP');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('OTP sent successfully');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

