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

    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      originalFilename TEXT,
      originalPath TEXT,
      generatedFilename TEXT,
      generatedPath TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      templateName TEXT,
      generatedRows INTEGER,
      status TEXT,
      strategyProfile TEXT
    );
    CREATE TABLE IF NOT EXISTS generation_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mode TEXT,
      identityStrategy TEXT,
      adjectivePool TEXT,
      fieldsConfig TEXT,
      globalSettings TEXT,
      rowCount INTEGER,
      sheetName TEXT,
      headerRowIndex INTEGER,
      dataRowStart INTEGER,
      originalFilePath TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Safe column add for existing DBs
  try {
    await db.exec(`ALTER TABLE files ADD COLUMN strategyProfile TEXT`);
  } catch (e) {
    // Column likely already exists
  }

  try {
    await db.exec(`ALTER TABLE files ADD COLUMN generation_profile_id INTEGER REFERENCES generation_profiles(id)`);
  } catch (e) {
    // Column likely already exists
  }

  await db.exec(`
    CREATE TABLE IF NOT EXISTS global_field_presets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fieldName TEXT UNIQUE,
      fieldValue TEXT,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
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
