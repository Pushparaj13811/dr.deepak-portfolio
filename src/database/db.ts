import { Database } from "bun:sqlite";
import { createTablesSQL } from "./schema";

const dbPath = process.env.NODE_ENV === "production"
  ? "./data/portfolio.db"
  : "./portfolio.db";

export const db = new Database(dbPath, { create: true });

// Enable foreign keys and WAL mode for better performance
db.run("PRAGMA foreign_keys = ON");
db.run("PRAGMA journal_mode = WAL");

// Initialize tables
export function initDatabase() {
  db.run(createTablesSQL);
  console.log("✅ Database initialized");
}

// Helper functions for common operations
export function runQuery(sql: string, params: any[] = []) {
  return db.prepare(sql).run(...params);
}

export function getOne<T>(sql: string, params: any[] = []): T | null {
  return db.prepare(sql).get(...params) as T | null;
}

export function getAll<T>(sql: string, params: any[] = []): T[] {
  return db.prepare(sql).all(...params) as T[];
}

// Transaction helper
export function transaction<T>(callback: () => T): T {
  return db.transaction(callback)();
}

export default db;
