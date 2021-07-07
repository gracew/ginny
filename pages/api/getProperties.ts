// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { requireSession, RequireSessionProp } from "@clerk/clerk-sdk-node";
import type { NextApiRequest, NextApiResponse } from 'next';
const { Client } = require('pg');
const client = new Client();

async function handler(
  req: RequireSessionProp<NextApiRequest>,
  res: NextApiResponse
) {
  const query = `select * from properties where user_id = $1`;
  await client.connect();
  const pgRes = await client.query(query, [req.session.userId]);
  res.status(200).json(pgRes.rows);
}

export default requireSession(handler);
