import moment from "moment";
import { docxName } from "../pages/api/generate";
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