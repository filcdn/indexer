import { assertOkResponse } from 'assert-ok-response'

export const createQueryFn =
  ({ accountId, databaseId, apiKey }) =>
  async (sql, params = []) => {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ sql, params }),
      },
    )
    assertOkResponse(res)
  }
