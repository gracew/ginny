// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Storage } from "@google-cloud/storage";
import fs from "fs";
import JSZip from 'jszip';
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from 'next';
import os from "os";
import path from "path";
import replace from "string-replace-stream";
import { v4 as uuidv4 } from "uuid";

function round(x: number) {
  return Math.round(x * 100) / 100;
}

type Data = {
  downloadUrl: string
}

const storage = new Storage();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // download template from GCS
  const tempPath = path.join(os.tmpdir(), "falls_green_reservation_agreement.docx");
  await storage.bucket("bmi-templates").file("falls_green_reservation_agreement.docx").download({ destination: tempPath });
  const fileData = fs.readFileSync(tempPath);
  const zip = await JSZip.loadAsync(fileData);
  var xml = zip.file("word/document.xml")
  if (!xml) {
    res.status(500);
    return;
  }

  const moveInDate = moment(req.body.moveInDate);
  const lastDayMonth = moveInDate.clone().endOf("month");
  console.log(moveInDate.format("YYYY-MM-DD"));
  console.log(lastDayMonth.format("YYYY-MM-DD"));
  const prorateAmount = (lastDayMonth.diff(moveInDate, "days") + 1) / lastDayMonth.daysInMonth();
  const proratedRent = round(prorateAmount * req.body.monthlyRent);

  // TODO(gracew): generalize this for more templates...
  let moveInAmountDue = 400 + proratedRent;

  let newStream = xml.nodeStream()
    .pipe(replace("APT_NO", req.body.aptNo))
    .pipe(replace("MONTHLY_RENT", req.body.monthlyRent))
    .pipe(replace("FIRST_MONTH_DATES", `${moveInDate.format("MM/DD/YYYY")} - ${lastDayMonth.format("MM/DD/YYYY")}`))
    .pipe(replace("PRORATED_RENT", proratedRent));

  if (req.body.petRent) {
    const proratedPetRent = round(prorateAmount * req.body.petRent);
    moveInAmountDue += proratedPetRent;
    newStream = newStream.pipe(replace("PRORATED_PET_RENT", proratedPetRent));
  } else {
    newStream = newStream.pipe(replace("PRORATED_PET_RENT", "N/A"));
  }

  if (req.body.parkingFee) {
    const proratedParkingFee = round(prorateAmount * req.body.parkingFee);
    moveInAmountDue += proratedParkingFee;
    newStream = newStream.pipe(replace("PRORATED_PARKING_FEE", proratedParkingFee));
  } else {
    newStream = newStream.pipe(replace("PRORATED_PARKING_FEE", "N/A"));
  }

  // TODO(gracew): generalize this for more templates...
  const total = moveInAmountDue + 400;
  newStream = newStream
    .pipe(replace("AMOUNT_DUE", moveInAmountDue))
    .pipe(replace("TOTAL", total));

  zip.file("word/document.xml", newStream);
  const outFileName = uuidv4() + ".docx";
  const outPath = path.join(os.tmpdir(), outFileName);
  zip.generateNodeStream()
    .pipe(fs.createWriteStream(outPath))
    .on("finish", async function () {
      await storage.bucket("bmi-templates").upload(outPath, { destination: "out/" + outFileName });
      // upload to GCS
      res.status(200).json({ downloadUrl: 'https://storage.googleapis.com/bmi-templates/out/' + outFileName })
    })
}
