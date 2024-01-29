const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const users = require('../models/users');

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

module.exports = router;