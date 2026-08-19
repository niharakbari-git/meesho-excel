import { createClient, Client } from '@libsql/client';
import path from 'path';

/**
 * TURSO MIGRATION IMPLEMENTED
 * We use a wrapper class so we don't have to rewrite 50+ db.get/run/all calls.
 */
class DBWrapper {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async run(sql: string, params: any[] = []) {
    const result = await this.client.execute({ sql, args: params });
    return {
      lastID: Number(result.lastInsertRowid || 0),
      changes: result.rowsAffected
    };
  }

  async all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const result = await this.client.execute({ sql, args: params });
    return result.rows as unknown as T[];
  }

  async get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    const result = await this.client.execute({ sql, args: params });
    return (result.rows[0] as unknown as T) || undefined;
  }

  async exec(sql: string) {
    await this.client.executeMultiple(sql);
  }
}

let db: DBWrapper | null = null;

export async function initializeDb() {
  const url = process.env.TURSO_DB_URL || `file:${path.join(__dirname, '../../database.sqlite')}`;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  const client = createClient({
    url,
    authToken
  });

  db = new DBWrapper(client);

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
      strategyProfile TEXT,
      generation_profile_id INTEGER
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

    CREATE TABLE IF NOT EXISTS global_field_presets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fieldName TEXT UNIQUE,
      fieldValue TEXT,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS template_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT,
      fileData BLOB,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  console.log('Database connected via Turso/libSQL');
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}
