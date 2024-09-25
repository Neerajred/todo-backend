const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import Routes
const authRoutes = require('./server/routes/authRoutes');
const todoRoutes = require('./server/routes/todoRoutes');
const profileRoutes = require('./server/routes/profileRoutes');

// Initialize the app
const app = express();
const port = 5500;

app.use(cors());
app.use(bodyParser.json());

// Define the routes
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);
app.use('/profile', profileRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send('Welcome to the Todo App API');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
