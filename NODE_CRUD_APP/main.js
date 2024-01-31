//imports
require("dotenv").config();
const express = require("express")
const mongoose = require("mongoose");
const session = require("express-session");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 4000;

//database connection
const mongoDBUrl = 'mongodb://127.0.0.1:27017/node_crud';
const db = mongoose.connection;
db.on('error', (error) => console.log(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log("connected to the database!");
});
mongoose.connect(mongoDBUrl);

// middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(
    session({
        secret: 'My secret key',
        saveuninitialized: true,
        resave: false
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// set uploads(folder) as static as the images weren't being displayed in the form otherwise
app.use(express.static("uploads"));

// set template engine
app.set("view engine", "ejs");

// route prefix
app.use("", require("./routes/routes"));

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});