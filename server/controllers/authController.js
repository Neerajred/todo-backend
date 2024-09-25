const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db.js');

// User Signup
exports.signup = (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 8);
    const id = uuidv4();


    db.run('INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)', [id, name, email, hashedPassword], (err) => {
        if (err) {
            return res.status(500).json({ message: 'User registration failed', err });
        }
        res.status(201).json({ message: 'User registered successfully' });
    });
};

// User Login
exports.login = (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ id: user.id }, 'secretKey', { expiresIn: '1h' });
        res.status(200).json({ token, user });
    });
};

// Middleware to protect routes
exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization']  && req.headers['authorization'].split(' ')[1];  ;
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, 'secretKey', (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
        req.userId = decoded.id;
        next();
    });
};
