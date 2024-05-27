const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Correct and absolute path to the database
// Assuming the database file is named 'dairy.db' and resides within the 'my_dairy_database' directory
const dbPath = path.join('E:', 'new_dairy_database','my_dairy_database.db');

console.log(`Database path: ${dbPath}`);  // This will help confirm the path is correct

// Connect to the database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("Error when connecting to the database:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

module.exports = db;
