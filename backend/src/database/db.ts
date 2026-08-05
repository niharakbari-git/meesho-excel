import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

export async function initializeDb() {
  db = await open({
    filename: path.join(__dirname, '../../database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gst TEXT,
      hsn TEXT,
      brand TEXT,
      manufacturer TEXT,
      packer TEXT,
      address TEXT,
      phone TEXT,
      email TEXT,
      defaultKeywords TEXT,
      defaultProfit REAL,
      defaultPriceVariation REAL
    );

    CREATE TABLE IF NOT EXISTS configurations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      configData TEXT
    );
  `);
  
  console.log('Database initialized');
  return db;
}

export function getDb(): Database {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}
