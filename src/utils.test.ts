import { isTS, Route } from "./utils";

describe("isTS", () => {
  it("detects based on file extension", () => {
    expect(isTS([{ filepath: "foo.ts" } as Route])).toEqual(true);
    expect(isTS([{ filepath: "foo.js" } as Route])).toEqual(false);
  });
});
