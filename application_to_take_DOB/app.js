const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", __dirname);

const db = new sqlite3.Database("userdata.db");
db.run(
    "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, surname TEXT, dob DATE)"
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/submit', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const dob = req.body.dob;

    // res.send(`Submitted Information:<br>First Name: ${firstName}<br>Last Name: ${lastName}<br>Date of Birth: ${dob}`);

    db.run("INSERT INTO users(name, surname, dob) VALUES(?,?,?)",
        [firstName, lastName, dob],
        function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`A new data has been added with id ${this.lastID}`);
            console.log(`${firstName} || ${lastName} || ${dob}`);
        }
    );

    db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        } else {
            res.render("admin", { data: rows });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
