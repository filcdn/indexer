import { DatabaseSync } from 'node:sqlite'
import { migrations, onProofSetCreated, onRootsAdded } from '../index.js'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const database = new DatabaseSync(':memory:')

test('indexer', async t => {
  await database.exec(migrations)
  const query = (sql, params) => {
    database.prepare(sql).run(...params)
  }
  await onProofSetCreated(query, 0n, '0xOwnerAddress')
  await onProofSetCreated(query, 0n, '0xOwnerAddress2') // NOOP
  await onRootsAdded(query, 0n, [0n, 1n, 2n])
  await onRootsAdded(query, 0n, [3n, 4n, 5n])
  const proofSets = database.prepare('SELECT * FROM proof_sets').all()
  assert.strictEqual(proofSets.length, 1)
  assert.strictEqual(proofSets[0].set_id, 0)
  assert.strictEqual(proofSets[0].owner, '0xOwnerAddress')
  const roots = database
    .prepare('SELECT * FROM roots ORDER BY root_id ASC')
    .all()
  assert.strictEqual(roots.length, 6)
  assert.strictEqual(roots[0].root_id, 0)
  assert.strictEqual(roots[0].set_id, 0)
  assert.strictEqual(roots[1].root_id, 1)
  assert.strictEqual(roots[1].set_id, 0)
})
