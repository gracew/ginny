// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { requireSession, RequireSessionProp } from "@clerk/clerk-sdk-node";
import { Storage } from "@google-cloud/storage";
import fs from "fs";
import JSZip from 'jszip';
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from 'next';
import os from "os";
import path from "path";
import replace from "string-replace-stream";
import { v4 as uuidv4 } from "uuid";
import { client } from "./client";

function formatAmount(x: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(x);
}

type Data = {
  downloadUrl: string
}

const gcs = new Storage();
const templateFilename = "reservation_agreement_template_2021-07-14.docx";

async function handler(
  req: RequireSessionProp<NextApiRequest>,
  res: NextApiResponse<Data>
) {
  // download template from GCS
  const tempPath = path.join(os.tmpdir(), templateFilename);
  await gcs.bucket("bmi-templates").file(templateFilename).download({ destination: tempPath });
  const fileData = fs.readFileSync(tempPath);
  const zip = await JSZip.loadAsync(fileData);
  var xml = zip.file("word/document.xml")
  if (!xml) {
    res.status(500);
    return;
  }

  const { property, ...otherInputs } = req.body;
  const {
    aptNo, leaseTermMonths, moveInDate, monthlyRent, parking, storage, petRent, petFee, concessions
  } = otherInputs;

  const moveInDateMoment = moment(moveInDate);
  const lastDayMonth = moveInDateMoment.clone().endOf("month");
  const prorateAmount = (lastDayMonth.diff(moveInDateMoment, "days") + 1) / lastDayMonth.daysInMonth();
  const proratedRent = prorateAmount * monthlyRent;

  const applicationAmountDue = property.application_fee || property.reservation_fee
    ? (property.application_fee || 0) + (property.reservation_fee || 0)
    : undefined;
  const fullAddress = `${property.address}, ${property.city}, ${property.state}  ${property.zip}`;

  let newStream = xml.nodeStream()
    .pipe(replace("PROPERTY_ADDRESS", fullAddress))
    .pipe(replace("APT_NO", aptNo))
    .pipe(replace("MONTHLY_RENT", formatAmount(monthlyRent)))
    .pipe(replace("LEASE_TERM", `${leaseTermMonths} months`))
    .pipe(replace("APPLICATION_FEE", property.application_fee ? formatAmount(property.application_fee) : "N/A"))
    .pipe(replace("RESERVATION_FEE", property.reservation_fee ? formatAmount(property.reservation_fee) : "N/A"))
    .pipe(replace("APPLICATION_AMOUNT_DUE", applicationAmountDue ? formatAmount(applicationAmountDue) : "N/A"))
    .pipe(replace("FIRST_MONTH_DATES", `${moveInDateMoment.format("MM/DD/YYYY")} - ${lastDayMonth.format("MM/DD/YYYY")}`))
    .pipe(replace("PRORATED_RENT", formatAmount(proratedRent)));

  const optionalRents = {
    PRORATED_PARKING: parking,
    PRORATED_STORAGE: storage,
    PRORATED_TRASH: property.trash_fee,
    PRORATED_PET_RENT: petRent,
  }

  let moveInAmountDue: number = proratedRent;
  Object.entries(optionalRents).forEach(([key, monthlyRent]) => {
    if (monthlyRent) {
      const proratedRent = prorateAmount * monthlyRent;
      moveInAmountDue += proratedRent;
      newStream = newStream.pipe(replace(key, formatAmount(proratedRent)));
    } else {
      newStream = newStream.pipe(replace(key, "N/A"));
    }
  });

  moveInAmountDue += petFee || 0;
  newStream = newStream.pipe(replace("PET_FEE", petFee ? formatAmount(petFee) : "N/A"));

  moveInAmountDue += property.admin_fee || 0;
  newStream = newStream.pipe(replace("ADMIN_FEE", property.admin_fee ? formatAmount(property.admin_fee) : "N/A"));

  newStream = newStream
    .pipe(replace("MOVEIN_AMOUNT_DUE", formatAmount(moveInAmountDue)))
    .pipe(replace("CUSTOM_TEXT", property.custom_text || ""))
    .pipe(replace("CONCESSIONS", concessions || ""));

  zip.file("word/document.xml", newStream);
  const outFileName = uuidv4() + ".docx";
  const outPath = path.join(os.tmpdir(), outFileName);
  zip.generateNodeStream()
    .pipe(fs.createWriteStream(outPath))
    .on("finish", async function () {
      // upload to GCS
      await gcs.bucket("bmi-templates").upload(outPath, { destination: "out/" + outFileName });
      // save event to postgres
      const query = "insert into generate_events(property_id, user_id, filename, data) values ($1, $2, $3, $4)";
      await client.query(query, [
        property.id,
        req.session.userId,
        outFileName,
        otherInputs,
      ]);
      res.status(200).json({ downloadUrl: 'https://storage.googleapis.com/bmi-templates/out/' + outFileName })
    })
}

export default requireSession(handler);
