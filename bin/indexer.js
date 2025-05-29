import { ethers } from 'ethers'
import { createQueryFn } from '../lib/query.js'
import {
  migrations,
  pdpVerifierAbi,
  onProofSetCreated,
  onRootsAdded,
} from '../index.js'

const {
  GLIF_TOKEN,
  RPC_URL = 'https://api.calibration.node.glif.io/',
  PDP_VERIFIER_ADDRESS = '0x5A23b7df87f59A291C26A2A1d684AD03Ce9B68DC',
  CF_ACCOUNT_ID,
  CF_DATABASE_ID,
  CF_API_KEY,
} = process.env

const fetchRequest = new ethers.FetchRequest(RPC_URL)
if (GLIF_TOKEN) {
  fetchRequest.setHeader('Authorization', `Bearer ${GLIF_TOKEN}`)
}
const provider = new ethers.JsonRpcProvider(fetchRequest, null, {
  polling: true,
})

const pdpVerifier = new ethers.Contract(
  PDP_VERIFIER_ADDRESS,
  pdpVerifierAbi,
  provider,
)

const query = createQueryFn({
  accountId: CF_ACCOUNT_ID,
  databaseId: CF_DATABASE_ID,
  apiKey: CF_API_KEY,
})

await query(migrations)

pdpVerifier.on('ProofSetCreated', (setId, owner) => {
  const event = `ProofSetCreated (Set ID="${setId}", Owner="${owner}")`
  console.log(`${event} ⏳`)
  onProofSetCreated(query, setId, owner)
    .then(() => console.log(`${event} ✅`))
    .catch((err) => console.error(`${event} ❌`, err))
})

pdpVerifier.on('RootsAdded', (setId, rootIds) => {
  const event = `RootsAdded (Set ID="${setId}", Root IDs=[${rootIds.map((id) => `"${id}"`).join(', ')})]`
  console.log(`${event} ⏳`)
  onRootsAdded(query, setId, rootIds)
    .then(() => console.log(`${event} ✅`))
    .catch((err) => console.error(`${event} ❌`, err))
})
