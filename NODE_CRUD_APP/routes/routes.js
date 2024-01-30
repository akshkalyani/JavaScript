const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const users = require('../models/users');
const fs = require('fs');


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


// Delete Users
/*
router.get("/delete/:id", (req, res) => {
    let id = req.params.id;
    User.findByIdAndDelete(id, (err, result) =>
    {
        if(result.image != ''){
            try {
                fs.unlinkSync('./uploads/'+result.image)
            } catch(err) {
                console.log(err);
            }
        }
    });

        if(err){
            res.json( { message: err.message });
        } else{
            res.session.message = {
                type: "info",
                message: "User deleted successfully"
            };
            res.redirect('/'); 
            }
        
});
*/
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

module.exports = router;