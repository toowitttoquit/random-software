import { describe, expect, it } from "vitest";
import { sortByOrder } from "../project-order";

describe("sortByOrder", () => {
  it("puts lower order numbers first", () => {
    const sorted = sortByOrder([{ data: { order: 2 } }, { data: { order: 1 } }]);
    expect(sorted.map((entry) => entry.data.order)).toEqual([1, 2]);
  });

  it("does not change the original list", () => {
    const original = [{ data: { order: 2 } }, { data: { order: 1 } }];
    sortByOrder(original);
    expect(original[0].data.order).toBe(2);
  });

  it("returns an empty list when there are no projects", () => {
    expect(sortByOrder([])).toEqual([]);
  });
});
