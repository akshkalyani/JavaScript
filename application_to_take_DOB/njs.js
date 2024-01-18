const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/user', (req, res) => {
    try {
        const { name, surname, dob } = req.body;
        const encryptedData = encryptData({ name, surname, dob});
        saveToDatabase(encryptedData);
        res.status(200).json({ message: 'User info encrypted and stored successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

//Function to encrypt the Data using AES encryption method
function encryptData(data) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
    let encrypted = cipher.update(JSON.stringify(data), 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    return { data: encrypted, key: key.toString('hex'), iv: iv.toString('hex')};

}

function saveToDatabase(encryptedData) {
    const databaseFilePath = 'database.txt';
    fs.appendFileSync(databaseFilePath, JSON.stringify(encryptedData) + '\n');
}

//starting the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});