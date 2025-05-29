export const migrations = `
  CREATE TABLE IF NOT EXISTS indexer_proof_sets (
    set_id INTEGER PRIMARY KEY,
    owner TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS indexer_roots (
    root_id INTEGER PRIMARY KEY,
    set_id INTEGER NOT NULL,
    FOREIGN KEY (set_id) REFERENCES indexer_proof_sets(set_id)
  );
`
