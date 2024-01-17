const express = require('express')
const bodyParser = require('body-parser')

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');

});

app.post('/submit', (req,res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const dob = req.body.dob;

    res.send('Submitted Information:<br>First Name: ${firstName}<br>Last Name: ${lastName}<br>Date of Birth: ${dob}');
});

//Start the server
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}');
});