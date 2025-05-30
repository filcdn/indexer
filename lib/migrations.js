export const migrations = `
  CREATE TABLE IF NOT EXISTS indexer_proof_sets (
    set_id TEXT PRIMARY KEY,
    owner TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS indexer_roots (
    root_id TEXT PRIMARY KEY,
    set_id TEXT NOT NULL,
    FOREIGN KEY (set_id) REFERENCES indexer_proof_sets(set_id)
  );
`
