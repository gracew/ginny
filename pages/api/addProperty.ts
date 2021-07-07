// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { requireSession } from "@clerk/clerk-sdk-node";
import { Storage } from "@google-cloud/storage";
import type { NextApiRequest, NextApiResponse } from 'next';
const { Client } = require('pg');
const client = new Client();

const storage = new Storage();

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = `insert into properties(user_id, address, city, state, zip, application_fee, reservation_fee, admin_fee, parking_fee, pet_fee, custom_text) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
  await client.connect();
  await client.query(query, [
    // @ts-ignore
    req.session.userId,
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
  ]);
  res.status(200).end();
}

export default requireSession(handler);
