const { v4: uuidv4 } = require('uuid');
const db = require('../db');

// Get tasks for authenticated user
exports.getTasks = (req, res) => {
    db.all('SELECT * FROM todos WHERE userId = ?', [req.userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to retrieve tasks', err });
        }
        res.status(200).json(rows);
    });
};

exports.getOneTask = (req, res) => {
    const { id } = req.params;
    db.all('SELECT * FROM todos WHERE userId = ? AND id = ?', [req.userId, id], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to retrieve tasks', err });
        }
        res.status(200).json(rows);
    });
};

// Add a new task
exports.addTask = (req, res) => {
    const { task,status } = req.body;
    const id = uuidv4();
    db.run('INSERT INTO todos (id, userId, task, status) VALUES (?, ?, ?, ?)', [id, req.userId, task, status], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to add task', err });
        }
        res.status(201).json({ message: 'Task added successfully' });
    });
};

// Update task status
exports.updateTask = (req, res) => {
    const { status } = req.body;
    const {id} = req.params;

    db.run('UPDATE todos SET status = ? WHERE id = ?', [status, id], function (err) {
        if (err) {
           
            return res.status(500).json({ message: 'Failed to update task', err });
        }

        if (this.changes === 0) {
            // No rows were updated, so the task ID might not exist
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully' });
    });
};

// Delete a task
exports.deleteTask = (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM todos WHERE id = ? AND userId = ?', [id, req.userId], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to delete task', err });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    });
};
