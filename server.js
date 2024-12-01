const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('./models/User');

const app = express();
const PORT = 5009;

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files from the 'Public' folder
app.use(express.static(path.join(__dirname, 'Public')));

// Connect to MongoDB
mongoose.connect('mongodb+srv://harmansingh23cse:H6EMTfcFUc7dqUUc@cluster0.szut6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB', err));

// Signup route
app.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    // Validate the input
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({ fullName, email, password: hashedPassword });

        // Save the user to the database
        await newUser.save();

        return res.status(201).json({ message: 'Account created successfully!' });
    } catch (error) {
        return res.status(500).json({ message: 'Error occurred while creating the account', error });
    }
});

// Route to handle specific requests (e.g., home page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'home.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
