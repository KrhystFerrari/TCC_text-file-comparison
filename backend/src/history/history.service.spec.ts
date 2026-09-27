// better-sqlite3 uses `export =`; this import form preserves its constructor without esModuleInterop.
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Database = require('better-sqlite3');
import { createDatabaseConnection } from './database.provider';
import { HistoryService } from './history.service';

function buildResult(
  overrides: Partial<Parameters<HistoryService['record']>[0]> = {},
) {
  return {
    labelA: 'a.txt',
    labelB: 'b.txt',
    correlationIndex: 0.5,
    metrics: { jaccard: 0.4, dice: 0.6, cosine: 0.5, semantic: 0.55 },
    stats: { wordCountA: 3, wordCountB: 3, uniqueWordsA: 3, uniqueWordsB: 3 },
    diff: null,
    ...overrides,
  };
}

describe('HistoryService', () => {
  let db: Database.Database;
  let service: HistoryService;

  beforeEach(() => {
    db = createDatabaseConnection(':memory:');
    service = new HistoryService(db);
  });

  afterEach(() => {
    db.close();
  });

  it('records a comparison and returns it with an id and timestamp', () => {
    const entry = service.record(buildResult());

    expect(entry.id).toBeGreaterThan(0);
    expect(entry.labelA).toBe('a.txt');
    expect(entry.metrics).toEqual({
      jaccard: 0.4,
      dice: 0.6,
      cosine: 0.5,
      semantic: 0.55,
    });
    expect(typeof entry.createdAt).toBe('string');
  });

  it('lists recorded comparisons ordered from most recent to oldest', () => {
    service.record(buildResult({ labelA: 'first.txt' }));
    service.record(buildResult({ labelA: 'second.txt' }));

    const entries = service.findAll();

    expect(entries).toHaveLength(2);
    expect(entries[0].labelA).toBe('second.txt');
    expect(entries[1].labelA).toBe('first.txt');
  });

  it('respects the limit parameter', () => {
    service.record(buildResult());
    service.record(buildResult());
    service.record(buildResult());

    expect(service.findAll(2)).toHaveLength(2);
  });

  it('finds a single entry by id', () => {
    const created = service.record(buildResult());

    expect(service.findOne(created.id)?.labelA).toBe('a.txt');
  });

  it('returns null when the entry does not exist', () => {
    expect(service.findOne(9999)).toBeNull();
  });

  it('removes an entry and reports success', () => {
    const created = service.record(buildResult());

    expect(service.remove(created.id)).toBe(true);
    expect(service.findOne(created.id)).toBeNull();
  });

  it('returns false when removing a non-existent entry', () => {
    expect(service.remove(9999)).toBe(false);
  });
});
