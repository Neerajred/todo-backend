const db = require('../db');

// Create Todo Table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      task TEXT,
      status TEXT CHECK( status IN ('pending', 'in progress', 'completed') ) DEFAULT 'pending',
      userId TEXT NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id)
    )
`);

// Get all tasks for a user
exports.getAllTodosByUser = (userId, callback) => {
    db.all('SELECT * FROM todos WHERE userId = ?', [userId], (err, tasks) => {
        callback(err, tasks);
    });
};

// Add a new task
exports.addTodo = (task, userId, callback) => {
    db.run(
        'INSERT INTO todos ( task, userId) VALUES (?, ?, ?)',
        [ task, userId],
        function (err) {
            callback(err, this.lastID);
        }
    );
};

// Update task status
exports.updateTodoStatus = (id, status, userId, callback) => {
    db.run(
        'UPDATE todos SET status = ? WHERE id = ? AND userId = ?',
        [status, id, userId],
        function (err) {
            callback(err);
        }
    );
};

// Delete a task
exports.deleteTodo = (id, userId, callback) => {
    db.run('DELETE FROM todos WHERE id = ? AND userId = ?', [id, userId], function (err) {
        callback(err);
    });
};
