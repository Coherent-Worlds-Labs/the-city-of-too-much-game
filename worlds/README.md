# World Packs

World packs hold all world-specific content for the game.  
To swap to another world, replace the active pack path with a different JSON file that follows the same schema.

## Contract

- `schemaVersion`: versioned contract marker.
- `worldId`: stable identifier.
- `locale`: language code of world text.
- `metadata`: title, summary, start state, and win/loss framing.
- `ui`: world-facing labels and status phrases.
- `prompt`: visual prompt anchors and constraints for image generation.
- `motifs`: motif catalog used by semantic evaluation and rendering hints.
- `cards`: full playable card deck text.

## Active Pack

- Default pack: `worlds/the-city-of-too-much.en.json`
- Loader module: `src/infra/world-pack-loader.mjs`
