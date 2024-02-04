const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (replace 'your-mongodb-uri' with your actual MongoDB URI)
mongoose.connect('mongodb://127.0.0.12017/mailapp');
const db = mongoose.connection;

db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => console.log('Connected to MongoDB'));

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));


// Define the Message model
const messageSchema = new mongoose.Schema({
    to: String,
    from: String,
    subject: String,
    body: String,
});

const Message = mongoose.model('Message', messageSchema);

// Define routes
app.get('/', (req, res) => {
    // Display a form to send a message
    res.render('index');
});

app.post('/send', async (req, res) => {
    // Handle sending and storing the message
    const { to, subject, body } = req.body;

    try {
        // Store the message in the database
        const newMessage = new Message({ to, from: 'Sender Name', subject, body });
        const savedMessage = await newMessage.save();

        // Render a success page (you can customize this)
        res.render('success', { message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error sending message');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
