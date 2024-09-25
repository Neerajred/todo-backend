const bcrypt = require('bcryptjs');
const db = require('../db');

// Create User Table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
`);

// Register a new user
exports.createUser = (name, email, password, callback) => {
    const hashedPassword = bcrypt.hashSync(password, 8);
    db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        function (err) {
            callback(err, this.lastID);
        }
    );
};

// Find a user by email
exports.findUserByEmail = (email, callback) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        callback(err, user);
    });
};

// Find a user by ID
exports.findUserById = (id, callback) => {
    db.get('SELECT id, name, email FROM users WHERE id = ?', [id], (err, user) => {
        callback(err, user);
    });
};

// Update user profile
exports.updateUserProfile = (id, name, email, callback) => {
    db.run(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id],
        function (err) {
            callback(err);
        }
    );
};

// Update user password
exports.updateUserPassword = (id, newPassword, callback) => {
    const hashedPassword = bcrypt.hashSync(newPassword, 8);
    db.run(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, id],
        function (err) {
            callback(err);
        }
    );
};

// Delete user
exports.deleteUser = (id, callback) => {
    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
        callback(err);
    });
};
