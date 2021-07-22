import moment from "moment";
import { docxName } from "../pages/api/generate";

it("generated doc name", () => {
  const currentMoment = moment();
  const currentMomentFormatted = currentMoment.format("YYYY-MM-DD-X");
  expect(docxName("100 Market St", "A1", currentMoment)).toEqual("100-Market-St-A1-" + currentMomentFormatted);
  expect(docxName("100MarketSt", "A1", currentMoment)).toEqual("100MarketSt-A1-" + currentMomentFormatted);
});