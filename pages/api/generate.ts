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
import { client } from "./client";

function formatAmount(x: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(x);
}

type Data = {
  downloadUrl: string
}

const gcs = new Storage();
const templateFilename = "reservation_agreement_template_2021-08-02.docx";

export function docxName(propertyName: string, unitNumber: string, currentMoment: moment.Moment): string {
  const name = propertyName.trim() + "-" + unitNumber.trim() + "-" + currentMoment.format("YYYY-MM-DD-X")
  return name.replace(/ /g, "-")
}

export function createLineBreak(customText: string) {
  return customText.replace(/\n/g, "<w:br/>")
}

export function createInternalRelation(rId:string, image_name:string):string{
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="${rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${image_name}"/></Relationships>”/>`
}

export function getImageMarkUp(rId:string){
  return `<w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0" wp14:anchorId="2D210949" wp14:editId="6501C070"><wp:extent cx="466725" cy="476250"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:docPr id="884817327" name="Picture 884817327"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="0" name=""/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${rId}"><a:extLst><a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}"><a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0"/></a:ext></a:extLst></a:blip><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="466725" cy="476250"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing>`
}

interface Amounts {
  APPLICATION_AMOUNT_DUE: number;
  MOVEIN_AMOUNT_DUE: number;
  PRORATED_RENT: number;
  PRORATED_PARKING: number;
  PRORATED_STORAGE: number;
  PRORATED_TRASH: number;
  PRORATED_PET_RENT: number;
}
interface Totals {
  FIRST_MONTH_DATES: string;
  amounts: Amounts;
}

export function computeTotals(data: any): Totals {
  const { property, ...otherInputs } = data;
  const {
    aptNo, leaseTermMonths, moveInDate, numApplicants, monthlyRent, parking, storage, petRent, petFee, concessions
  } = otherInputs;
  const moveInDateMoment = moment(moveInDate);
  const lastDayMonth = moveInDateMoment.clone().endOf("month");
  const prorateAmount = (lastDayMonth.diff(moveInDateMoment, "days") + 1) / lastDayMonth.daysInMonth();
  const proratedRent = prorateAmount * monthlyRent;

  const applicationAmountDue = property.application_fee || property.reservation_fee
    ? (numApplicants*property.application_fee || 0) + (property.reservation_fee || 0)
    : undefined;

  const proratedParking = prorateAmount * parking
  const proratedTrash = prorateAmount * property.trash_fee
  const proratedStorage = prorateAmount * storage
  const proratedPetRent = prorateAmount * petRent
  let moveInAmountDue = proratedRent
  moveInAmountDue += (petFee || 0) + (property.admin_fee || 0) + proratedTrash + proratedParking + proratedStorage + proratedPetRent;
  const firstMonthDates = `${moveInDateMoment.format("MM/DD/YYYY")} - ${lastDayMonth.format("MM/DD/YYYY")}`;

  return {
    FIRST_MONTH_DATES: firstMonthDates,
    amounts: {
    APPLICATION_AMOUNT_DUE: applicationAmountDue,
    MOVEIN_AMOUNT_DUE: moveInAmountDue,
    PRORATED_RENT: proratedRent,
    PRORATED_PARKING: proratedParking,
    PRORATED_STORAGE: proratedStorage,
    PRORATED_TRASH: proratedTrash,
    PRORATED_PET_RENT: proratedPetRent,
    }
  }
}

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
  const totals = computeTotals(req.body);

  const fullAddress = `${property.address}, ${property.city}, ${property.state}  ${property.zip}`;

  let newStream = xml.nodeStream()
    .pipe(replace("PROPERTY_ADDRESS", fullAddress))
    .pipe(replace("APT_NO", aptNo))
    .pipe(replace("MONTHLY_RENT", formatAmount(monthlyRent)))
    .pipe(replace("LEASE_TERM", `${leaseTermMonths} months`))
    .pipe(replace("APPLICATION_FEE", property.application_fee ? formatAmount(property.application_fee) : "N/A"))
    .pipe(replace("RESERVATION_FEE", property.reservation_fee ? formatAmount(property.reservation_fee) : "N/A"))
    .pipe(replace("PET_FEE", petFee ? formatAmount(petFee) : "N/A"))
    .pipe(replace("ADMIN_FEE", property.admin_fee ? formatAmount(property.admin_fee) : "N/A"))
    .pipe(replace("CUSTOM_TEXT", createLineBreak(property.custom_text) || ""))
    .pipe(replace("CONCESSIONS", concessions || ""))
    .pipe(replace("FIRST_MONTH_DATES", totals.FIRST_MONTH_DATES));

  Object.entries(totals.amounts).forEach(([key, monthlyRent]) => {
    if (monthlyRent) {
      newStream = newStream.pipe(replace(key, formatAmount(monthlyRent)));
    } else {
      newStream = newStream.pipe(replace(key, "N/A"));
    }
  });

  //TODO: Write a check for if the user did not pass an image
  const logo_url = "d4fbd7c860fa82499cd0e58a55d92fa8.png" //req.body.property.logo_url;
  const imagePath = path.join(os.tmpdir(), logo_url)
  await gcs.bucket("bmi-templates").file(logo_url).download({ destination: imagePath})
  const rId = "rAC5927DL" // this rID can be anything as long as the first character is 'r'
  const internalRelation = createInternalRelation(rId, logo_url);
  const imageMarkup = getImageMarkUp(rId);

  zip.file("word/document.xml", newStream);
  const outFileName = docxName(property.address, aptNo, moment()) + ".docx";
  const outPath = path.join(os.tmpdir(), outFileName);
  
  const media = zip.folder("word/media");
  media?.file(logo_url, fs.readFileSync(imagePath),{binary:true});

  var headerXml = zip.file('word/header1.xml')
  let newStream2 = headerXml?.nodeStream()
    .pipe(replace('<w:bookmarkStart w:id="0" w:name="LogoGoesHere"/><w:bookmarkEnd w:id="0"/>',imageMarkup))
  zip.file("word/header1.xml", newStream2)

  var relationXml = zip.file("_rels/.rels")
  let newStream3 = relationXml?.nodeStream()
    .pipe(replace("</Relationships>",`<Relationship Id="${rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${logo_url}"/></Relationships>”/>`))
    zip.file("_rels/.rels", newStream3)

  var internalRelationXml = zip.file("word/_rels/header1.xml.rels", internalRelation)

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
