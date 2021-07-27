import moment from "moment";
import { computeTotals, docxName } from "../pages/api/generate";
import { createLineBreak } from "../pages/api/generate";

it("generated doc name", () => {
  const currentMoment = moment();
  const currentMomentFormatted = currentMoment.format("YYYY-MM-DD-X");
  expect(docxName("     100 Market St", "A1", currentMoment)).toEqual("100-Market-St-A1-" + currentMomentFormatted);
  expect(docxName("     100 Market St      ", "    A1     ", currentMoment)).toEqual("100-Market-St-A1-" + currentMomentFormatted);
  expect(docxName("  \r   100 Market St\t      ", "    A1\n     ", currentMoment)).toEqual("100-Market-St-A1-" + currentMomentFormatted);
  expect(docxName("100 Market St", "A1", currentMoment)).toEqual("100-Market-St-A1-" + currentMomentFormatted);
  expect(docxName("100MarketSt", "A1", currentMoment)).toEqual("100MarketSt-A1-" + currentMomentFormatted);
});

it("new lines are converted to line breaks", () => {
  expect(createLineBreak("Hello\nworld\n")).toEqual("Hello<w:br/>world<w:br/>")
  expect(createLineBreak("Hello\nworld\nfoo\nbar")).toEqual("Hello<w:br/>world<w:br/>foo<w:br/>bar")
  expect(createLineBreak("")).toEqual("")
  expect(createLineBreak("\t")).toEqual("\t")
});

it("Calculating total amount",() =>{
  const property = {
    address: "Address",
    application_fee: 100,
    reservation_fee: 100,
    admin_fee: 100,
    trash_fee: 10,
    custom_text: "Hello"
  }

  const d = new Date();

  const data = {
    property: property,
    aptNo: "A1", 
    leaseTermMonths: 12, 
    moveInDate: d, 
    monthlyRent: 200, 
    parking: 20, 
    storage: 15, 
    petRent: 10, 
    petFee: 25, 
    concessions: ""
  }
  const totals = computeTotals(data)
  
});