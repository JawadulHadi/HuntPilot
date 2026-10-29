import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import { buildTracker, TRACKER_COLUMNS } from "../src/tracker.js";

describe("buildTracker", () => {
  it("creates the Applications table with an ID key column", async () => {
    const file = join(mkdtempSync(join(tmpdir(), "huntpilot-")), "JobTracker.xlsx");
    await buildTracker(file, "2026-01-01");
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(file);
    const ws = wb.getWorksheet("Applications")!;
    expect(ws.getRow(1).values).toEqual([undefined, ...TRACKER_COLUMNS]);
    expect(ws.getCell("A2").value).toBe("JS-0001");
    expect(ws.getCell("B2").value).toBe("2026-01-01");
    expect(Object.keys(ws.tables)).toContain("Applications");
  });
});
