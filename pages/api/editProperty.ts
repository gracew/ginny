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

  const query = "update properties set address = $1, city = $2, state = $3, zip = $4, application_fee = $5, reservation_fee = $6, admin_fee = $7, trash_fee = $8, custom_text = $9, logo_url = $11 where id = $10";
  await client.query(query, [
    req.body.address,
    req.body.city,
    req.body.state,
    req.body.zip,
    req.body.application_fee,
    req.body.reservation_fee,
    req.body.admin_fee,
    req.body.trash_fee,
    req.body.custom_text,
    req.body.id,
    req.body.logo_url
  ]);
  res.status(200).end();
}

export default requireSession(handler);
