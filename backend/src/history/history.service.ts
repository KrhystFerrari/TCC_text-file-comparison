import { Inject, Injectable } from '@nestjs/common';
// better-sqlite3 uses `export =`; this import form preserves its constructor without esModuleInterop.
// eslint-disable-next-line @typescript-eslint/no-require-imports
import Database = require('better-sqlite3');
import { CompareTextsResultDto } from '../text-comparison/dto/compare-texts-result.dto';
import { DATABASE, HISTORY_TABLE } from './history.constants';
import { HistoryEntryDto } from './dto/history-entry.dto';

interface HistoryRow {
  id: number;
  label_a: string;
  label_b: string;
  correlation_index: number;
  metrics: string;
  stats: string;
  created_at: string;
}

const DEFAULT_LIMIT = 20;

@Injectable()
export class HistoryService {
  constructor(@Inject(DATABASE) private readonly db: Database.Database) {}

  record(result: CompareTextsResultDto): HistoryEntryDto {
    const createdAt = new Date().toISOString();

    const info = this.db
      .prepare(
        `INSERT INTO ${HISTORY_TABLE} (label_a, label_b, correlation_index, metrics, stats, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(
        result.labelA,
        result.labelB,
        result.correlationIndex,
        JSON.stringify(result.metrics),
        JSON.stringify(result.stats),
        createdAt,
      );

    return {
      id: Number(info.lastInsertRowid),
      labelA: result.labelA,
      labelB: result.labelB,
      correlationIndex: result.correlationIndex,
      metrics: result.metrics,
      stats: result.stats,
      createdAt,
    };
  }

  findAll(limit: number = DEFAULT_LIMIT): HistoryEntryDto[] {
    const rows = this.db
      .prepare(`SELECT * FROM ${HISTORY_TABLE} ORDER BY id DESC LIMIT ?`)
      .all(limit) as HistoryRow[];

    return rows.map(mapRowToEntry);
  }

  findOne(id: number): HistoryEntryDto | null {
    const row = this.db
      .prepare(`SELECT * FROM ${HISTORY_TABLE} WHERE id = ?`)
      .get(id) as HistoryRow | undefined;

    return row ? mapRowToEntry(row) : null;
  }

  remove(id: number): boolean {
    const info = this.db
      .prepare(`DELETE FROM ${HISTORY_TABLE} WHERE id = ?`)
      .run(id);

    return info.changes > 0;
  }
}

function mapRowToEntry(row: HistoryRow): HistoryEntryDto {
  return {
    id: row.id,
    labelA: row.label_a,
    labelB: row.label_b,
    correlationIndex: row.correlation_index,
    metrics: JSON.parse(row.metrics),
    stats: JSON.parse(row.stats),
    createdAt: row.created_at,
  };
}
