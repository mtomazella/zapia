// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

interface Response {
  connection: true
}

export default function handler(
  _: NextApiRequest,
  response: NextApiResponse<Response>,
) {
  return response.status(200).json({ connection: true })
}
