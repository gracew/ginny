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

  const d = new Date(2021,7,27);

  const data = {
    property: property,
    aptNo: "A1", 
    leaseTermMonths: 12, 
    moveInDate: d, 
    numApplicants: 1,
    monthlyRent: 200, 
    parking: 20, 
    storage: 15,
    securityDeposit: 100, 
    petRent: 10, 
    petFee: 25, 
    concessions: ""
  }
  const totals = computeTotals(data)
  expect(totals.amounts.APPLICATION_AMOUNT_DUE).toEqual(200)
  expect(totals.amounts.PRORATED_RENT.toFixed(2)).toEqual("32.26")
  expect(totals.amounts.PRORATED_PARKING.toFixed(2)).toEqual("3.23")
  expect(totals.amounts.PRORATED_PET_RENT.toFixed(2)).toEqual("1.61")
  expect(totals.amounts.PRORATED_TRASH.toFixed(2)).toEqual("1.61")
  expect(totals.amounts.PRORATED_STORAGE.toFixed(2)).toEqual("2.42")
  expect(totals.amounts.MOVEIN_AMOUNT_DUE.toFixed(2)).toEqual("266.13")
});


it("Calculate total when extra fees are zero",() =>{
  const property = {
    address: "Address",
    application_fee: 100,
    reservation_fee: 100,
    admin_fee: 50,
    trash_fee: 0,
    custom_text: "Hello"
  }

  const d = new Date(2021,7,27);

  const data = {
    property: property,
    aptNo: "A1", 
    leaseTermMonths: 12, 
    moveInDate: d, 
    numApplicants: 1,
    monthlyRent: 200, 
    parking: 0, 
    securityDeposit: 0,
    storage: 0, 
    petRent: 0, 
    petFee: 0, 
    concessions: ""
  }
  const totals = computeTotals(data)
  expect(totals.amounts.APPLICATION_AMOUNT_DUE).toEqual(200)
  expect(totals.amounts.PRORATED_RENT.toFixed(2)).toEqual("32.26")
  expect(totals.amounts.MOVEIN_AMOUNT_DUE.toFixed(2)).toEqual("82.26")
});

it("Calculating multiple applicants",() =>{
  const property = {
    address: "Address",
    application_fee: 150,
    reservation_fee: 0,
    admin_fee: 100,
    trash_fee: 10,
    custom_text: "Hello"
  }

  const d = new Date(2021,7,27);

  const data = {
    property: property,
    aptNo: "A1", 
    leaseTermMonths: 12, 
    moveInDate: d,
    numApplicants: 2, 
    monthlyRent: 200, 
    parking: 20, 
    storage: 15, 
    petRent: 10, 
    petFee: 25, 
    concessions: ""
  }
  const totals = computeTotals(data)
  expect(totals.amounts.APPLICATION_AMOUNT_DUE).toEqual(300)

});