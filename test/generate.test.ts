import { docxName } from "../pages/api/generate";

it("generated doc name", () => {
  expect(docxName("100 Market St", "A1", "2021-07-20")).toEqual("100-Market-St-A1-2021-07-20");
});