import { docxName } from "../pages/api/generate";

it("generated doc name", () => {
  const av1 = ["2021-04-17T18:00:00-07:00", "2021-04-17T19:00:00-07:00"];
  const av2 = ["2021-04-17T20:00:00-07:00", "2021-04-18T20:00:00-07:00"];
  expect(docxName("100 Market St", "A1", "2021-07-20")).toEqual("100-Market-St-A1-2021-07-20");
});