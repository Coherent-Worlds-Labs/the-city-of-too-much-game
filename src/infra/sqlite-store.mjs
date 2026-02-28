import { mkdirSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const nowIso = () => new Date().toISOString();

const toJson = (value) => JSON.stringify(value);
const fromJson = (value) => JSON.parse(value);

const listMigrationFiles = (dir) =>
  readdirSync(dir)
    .filter((file) => extname(file) === ".sql")
    .sort((a, b) => a.localeCompare(b));

export const createSqliteStore = ({
  dbPath = "data/the-city-of-too-much.db",
  migrationsDir = "db/migrations"
} = {}) => {
  const absoluteDbPath = resolve(dbPath);
  mkdirSync(dirname(absoluteDbPath), { recursive: true });

  const db = new DatabaseSync(absoluteDbPath);
  db.exec("PRAGMA foreign_keys = ON;");

  const migrationFiles = listMigrationFiles(resolve(migrationsDir));
  for (const file of migrationFiles) {
    const sql = readFileSync(join(resolve(migrationsDir), file), "utf8");
    db.exec(sql);
  }

  const insertGameStmt = db.prepare(`
    INSERT INTO games (game_id, world_id, seed, status, current_turn, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertTurnStmt = db.prepare(`
    INSERT INTO turns (game_id, turn_index, card_id, card_group, card_text, judge_json, image_prompt, image_url, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const updateGameProgressStmt = db.prepare(`
    UPDATE games
      SET current_turn = ?, status = ?, updated_at = ?
      WHERE game_id = ?
  `);

  const selectGameStmt = db.prepare(`
    SELECT game_id, world_id, seed, status, current_turn, created_at, updated_at
      FROM games
      WHERE game_id = ?
  `);

  const selectTurnsStmt = db.prepare(`
    SELECT game_id, turn_index, card_id, card_group, card_text, judge_json, image_prompt, image_url, created_at
      FROM turns
      WHERE game_id = ?
      ORDER BY turn_index ASC
  `);

  const createGame = ({ gameId, worldId, seed = null, status = "active" }) => {
    const createdAt = nowIso();
    insertGameStmt.run(gameId, worldId, seed, status, 0, createdAt, createdAt);
    return getGame(gameId);
  };

  const getGame = (gameId) => {
    const row = selectGameStmt.get(gameId);
    return row ?? null;
  };

  const getTurns = (gameId) => {
    const rows = selectTurnsStmt.all(gameId);
    return rows.map((row) => ({
      ...row,
      judge_json: fromJson(row.judge_json)
    }));
  };

  const appendTurn = (payload) => {
    const createdAt = nowIso();
    try {
      db.exec("BEGIN");
      insertTurnStmt.run(
        payload.gameId,
        payload.turnIndex,
        payload.card.id,
        payload.card.group ?? "unknown",
        payload.card.text,
        toJson(payload.judgeResult),
        payload.imagePrompt,
        payload.imageUrl,
        createdAt
      );
      updateGameProgressStmt.run(
        payload.turnIndex,
        payload.nextStatus,
        createdAt,
        payload.gameId
      );
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }

    return {
      game: getGame(payload.gameId),
      turn: getTurns(payload.gameId).at(-1)
    };
  };

  const close = () => db.close();

  return {
    createGame,
    getGame,
    getTurns,
    appendTurn,
    close
  };
};
