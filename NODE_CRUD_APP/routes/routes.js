const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const users = require('../models/users');
const fs = require('fs');
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");  // Added to use dotenv for environment variables

dotenv.config();  // Load environment variables from a .env file



// image uploading
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./uploads");
    },
    filename: function(req, file, cb) {
        req.file = file;
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single("image");

// Insert an user into database route
router.post("/add", upload, async(req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,
        })
        const data = await user.save();
        let msg = {
            type: "success",
            message: "User addded successfully!"
        }
        req.session.message = msg;
        // res.status(200).send(msg)
        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)             
    }
        

});

router.get('/', async   (req, res) => {
    // res.render('index', { title: 'Home Page'})
        try {
            // User.find().exec((users) => {
            // res.render('index', {
            //     title: "Home Page",
            //     users: users
            // });
            // })
            const users = await User.find().exec();
            res.render('index', {
            title: "Home Page",
            users: users
            }   );

        } catch(error) {
            console.log(error);
            res.status(500).send(error.message);
        }
});

router.get('/add', (req,res) => {
        res.render('add_users', { title:'Add Users' })
});
// router.post('/abc',(req,res)=>{
//     res.send('hello')
// })

// Edit user rooute
router.get('/edit/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const user = await User.findById(id).exec();
    
        if (user == null) {
            res.redirect('/');
        } else {
            res.render('edit_users', {
                title: "Edit user",
                user: user,
            });
        }
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }    
});

// Update user route
router.post('/update/:id', upload, async (req, res) => {
    let id = req.params.id;
    let new_image = '';
// MAKING CHNANGES FROM HEREEEEEE
    
    try{
        if(req.file) {
            new_image = req.file.filename;
            try{
                fs.unlinkSync('./uploads'+req.body.old_image);
            } catch(err) {
                console.log(err);
            }
        } else  {
            new_image = req.body.old_image;
        }
    

        const result = await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
        });

        req.session.message = {
            type: 'success',
            message: 'user updated successfully!',
        };
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.json({ message: err.message, type: 'danger'});
    }
});
    
// MAKING CHNANGES FROM HEREEEEEE

// Deleting Users
router.get("/delete/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const result = await User.findByIdAndDelete(id).exec();

        if (result.image !== '') {
            try {
                fs.unlinkSync('./uploads/' + result.image);
            } catch (err) {
                console.log(err);
            }
        }

        req.session.message = {
            type: "info",
            message: "User deleted successfully"
        };
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.json({ message: err.message });
    }
});

// Send OTP via email
router.post('/send-otp', async (req, res) => {
    const userId = req.body.userId;
    // Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 999999);
};

// Nodemailer Config
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: false,
    auth: {
        user: 'ak6155@srmist.edu.in', 
        pass: 'Aangan#1' 
    }
});

    try {
        // Use await to wait for the result of the query
        const user = await User.findById(userId).exec();

        if (!user) {
            return res.status(404).send('User not found');
        }

        const userEmail = user.email;
        const userName = user.name;
        const otp = generateOTP();

        const mailOptions = {
            from: 'ak6155@srmist.edu.in',
            to: userEmail,
            subject: 'OTP Verification',
            text: `Hi ${userName}, this is a system generated mail. Do not reply. Your OTP is: ${otp}`
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
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching user information');
    }
});

module.exports = router;