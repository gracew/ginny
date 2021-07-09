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
  if (pgRes.user_id !== req.session.userId) {
    res.status(403).end();
    return;
  }

  const query = "update properties set address = $1, city = $2, state = $3, zip = $4, application_fee = $5, reservation_fee = $6, admin_fee = $7, parking_fee = $8, pet_fee = $9, custom_text = $10 where id = $11";
  await client.query(query, [
    req.body.address,
    req.body.city,
    req.body.state,
    req.body.zip,
    req.body.applicationFee,
    req.body.reservationFee,
    req.body.adminFee,
    req.body.parkingFee,
    req.body.petFee,
    req.body.customText,
    req.body.id,
  ]);
  res.status(200).end();
}

export default requireSession(handler);
