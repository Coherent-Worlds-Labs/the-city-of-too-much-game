CREATE TABLE IF NOT EXISTS games (
  game_id TEXT PRIMARY KEY,
  world_id TEXT NOT NULL,
  seed TEXT,
  status TEXT NOT NULL,
  current_turn INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS turns (
  game_id TEXT NOT NULL,
  turn_index INTEGER NOT NULL,
  card_id TEXT NOT NULL,
  card_group TEXT NOT NULL,
  card_text TEXT NOT NULL,
  judge_json TEXT NOT NULL,
  image_prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (game_id, turn_index),
  FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_turns_game_created
  ON turns(game_id, created_at);
