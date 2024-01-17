const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database (creates a new file if it doesn't exist)
const db = new sqlite3.Database('example.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');

    // Close the database connection
    db.close((closeErr) => {
      if (closeErr) {
        console.error('Error closing database:', closeErr.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  }
});
