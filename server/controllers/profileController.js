const bcrypt = require('bcryptjs');
const db = require('../db');

// Get user profile
exports.getProfile = (req, res) => {
    db.get('SELECT id, name, email FROM users WHERE id = ?', [req.userId], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    });
};

// Update user profile (name and email)
exports.updateProfile = (req, res) => {
    const { name, email } = req.body;

    db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.userId], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Failed to update profile', err });
        }
        res.status(200).json({ message: 'Profile updated successfully' });
    });
};

// Update user password
exports.updatePassword = (req, res) => {
    const { oldPassword, newPassword } = req.body;
    db.get('SELECT password FROM users WHERE id = ?', [req.userId], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        const hashedNewPassword = bcrypt.hashSync(newPassword, 8);

        db.run('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, req.userId], function (err) {
            if (err) {
                return res.status(500).json({ message: 'Failed to update password', err });
            }
            res.status(200).json({ message: 'Password updated successfully' });
        });
    });
};

// Delete user profile
exports.deleteProfile = (req, res) => {
    db.run('DELETE FROM users WHERE id = ?', [req.userId], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Failed to delete profile', err });
        }
        res.status(200).json({ message: 'Profile deleted successfully' });
    });
};
