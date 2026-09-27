import * as fs from 'node:fs';
import * as path from 'node:path';
// better-sqlite3 uses `export =`; this import form preserves its constructor without esModuleInterop.
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Database = require('better-sqlite3');
import { Provider } from '@nestjs/common';
import { DATABASE, HISTORY_TABLE } from './history.constants';

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS ${HISTORY_TABLE} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label_a TEXT NOT NULL,
    label_b TEXT NOT NULL,
    correlation_index REAL NOT NULL,
    metrics TEXT NOT NULL,
    stats TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`;

/** Isolado em função própria para permitir instâncias :memory: independentes em teste. */
export function createDatabaseConnection(
  dbPath: string = process.env.HISTORY_DB_PATH ??
    path.join(process.cwd(), 'data', 'history.sqlite3'),
): Database.Database {
  if (dbPath !== ':memory:') {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }

  const db = new Database(dbPath);
  db.exec(CREATE_TABLE_SQL);
  return db;
}

export const databaseProvider: Provider = {
  provide: DATABASE,
  useFactory: () => createDatabaseConnection(),
};
