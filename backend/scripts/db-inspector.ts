import { getDb, initializeDb } from '../src/database/db';

async function inspectDb() {
  console.log('Initializing DB connection...');
  const db = await initializeDb();
  
  console.log('\n--- SQLite Tables ---');
  const tables = await db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`);
  
  for (const table of tables) {
    const tableName = table.name;
    console.log(`\nTable: ${tableName}`);
    const info = await db.all(`PRAGMA table_info(${tableName})`);
    console.table(info.map(c => ({ Name: c.name, Type: c.type, PK: c.pk })));
    
    const count = await db.get(`SELECT COUNT(*) as c FROM ${tableName}`);
    console.log(`Row count: ${count.c}`);
    
    // Sample a few rows
    if (count.c > 0) {
      const rows = await db.all(`SELECT * FROM ${tableName} ORDER BY id DESC LIMIT 3`);
      console.log('Latest rows:');
      console.log(JSON.stringify(rows, null, 2));
    }
  }
}

inspectDb().catch(console.error);
