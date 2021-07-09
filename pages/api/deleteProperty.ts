import { requireSession, RequireSessionProp } from "@clerk/clerk-sdk-node";
import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from "./client";

async function handler(
  req: RequireSessionProp<NextApiRequest>,
  res: NextApiResponse
) {
  const pgRes = await client.query("select * from properties where id = $1", [req.body.id]);
  if (pgRes.rows.length === 0) {
    res.status(404).end();
    return;
  }
  if (pgRes.rows[0].user_id !== req.session.userId) {
    res.status(403).end();
    return;
  }

  const query = "delete from properties where id = $1";
  await client.query(query, [ req.body.id ]);
  res.status(200).end();
}

export default requireSession(handler);
