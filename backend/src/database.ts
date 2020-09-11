import sqlite3 from 'sqlite3';

const DBSOURCE = 'db.sqlite';

export const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }

  console.log('Connected to the SQLite database.');
  db.run(`CREATE TABLE orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            street text,
            plz text,
            email text UNIQUE,
            CONSTRAINT email_unique UNIQUE (email)
            )`,
         (err) => {
           if (!err) {
             console.log('Successfully created table.');
           }
         });
});
