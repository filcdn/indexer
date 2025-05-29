export { migrations } from './lib/migrations.js'

export const pdpVerifierAbi = [
  'event ProofSetCreated (uint256 indexed setId, address indexed owner)',
  'event RootsAdded (uint256 indexed setId, uint256[] rootIds)',
]

export const onProofSetCreated = async (query, setId, owner) =>
  query(
    'INSERT INTO indexer_proof_sets (set_id, owner) VALUES (?, ?) ON CONFLICT DO NOTHING',
    [setId, owner],
  )

export const onRootsAdded = async (query, setId, rootIds) =>
  query(
    `
    INSERT INTO indexer_roots (root_id, set_id)
    VALUES ${new Array(rootIds.length)
      .fill()
      .map(() => '(?, ?)')
      .join(', ')}
    ON CONFLICT DO NOTHING
  `,
    rootIds.flatMap((rootId) => [rootId, setId]),
  )
