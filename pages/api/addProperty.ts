import { requireSession, RequireSessionProp } from "@clerk/clerk-sdk-node";
import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from "./client";

async function handler(
  req: RequireSessionProp<NextApiRequest>,
  res: NextApiResponse
) {
  const query = "insert into properties(user_id, address, city, state, zip, application_fee, reservation_fee, admin_fee, trash_fee, custom_text, logo_url) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
  await client.query(query, [
    req.session.userId,
    req.body.address,
    req.body.city,
    req.body.state,
    req.body.zip,
    req.body.application_fee,
    req.body.reservation_fee,
    req.body.admin_fee,
    req.body.trash_fee,
    req.body.custom_text,
    req.body.logo_url
  ]);
  res.status(200).end();
}

export default requireSession(handler);
