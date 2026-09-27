import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { createDatabaseConnection } from './database.provider';

describe('createDatabaseConnection', () => {
  it('creates the parent directory and an usable database file', () => {
    const dbPath = path.join(
      fs.mkdtempSync(path.join(os.tmpdir(), 'history-test-')),
      'nested',
      'history.sqlite3',
    );

    const db = createDatabaseConnection(dbPath);
    try {
      expect(fs.existsSync(dbPath)).toBe(true);
      expect(
        db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all(),
      ).toEqual(expect.arrayContaining([{ name: 'comparison_history' }]));
    } finally {
      db.close();
    }
  });

  it('creates an in-memory database when given ":memory:"', () => {
    const db = createDatabaseConnection(':memory:');
    try {
      expect(db.memory).toBe(true);
    } finally {
      db.close();
    }
  });
});
