import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db;

export async function initDatabase() {
  // Ensure uploads directory exists
  const uploadsDir = join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Open database
  db = await open({
    filename: join(__dirname, 'echolock.db'),
    driver: sqlite3.Database
  });

  // Create tables
  await createTables();
  
  return db;
}

async function createTables() {
  // Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT 1,
      last_login DATETIME
    )
  `);

  // Voice profiles table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS voice_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      profile_name TEXT NOT NULL,
      voice_data TEXT NOT NULL,
      liveness_threshold REAL DEFAULT 0.85,
      confidence_threshold REAL DEFAULT 0.90,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Authentication logs table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS auth_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      profile_id TEXT,
      auth_type TEXT NOT NULL,
      status TEXT NOT NULL,
      confidence_score REAL,
      liveness_score REAL,
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
      FOREIGN KEY (profile_id) REFERENCES voice_profiles (id) ON DELETE SET NULL
    )
  `);

  // API keys table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      key_name TEXT NOT NULL,
      key_hash TEXT NOT NULL,
      permissions TEXT NOT NULL,
      last_used DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
    CREATE INDEX IF NOT EXISTS idx_voice_profiles_user_id ON voice_profiles (user_id);
    CREATE INDEX IF NOT EXISTS idx_auth_logs_user_id ON auth_logs (user_id);
    CREATE INDEX IF NOT EXISTS idx_auth_logs_created_at ON auth_logs (created_at);
    CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys (user_id);
  `);

  console.log('✅ Database tables created successfully');
}

export async function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export async function closeDatabase() {
  if (db) {
    await db.close();
  }
} 