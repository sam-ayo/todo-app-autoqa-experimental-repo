import sqlite3 from "sqlite3";
import { open } from "sqlite";

const dbPromise = open({
  filename: "./db.sqlite",
  driver: sqlite3.Database,
});

async function init() {
  const db = await dbPromise;
  await db.exec(
    "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, complete INTEGER)"
  );
}

init();

export default dbPromise;
