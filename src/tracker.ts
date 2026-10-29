import ExcelJS from "exceljs";

export const TRACKER_COLUMNS = [
  "ID",
  "Date Found",
  "Company",
  "Role",
  "Link",
  "Source",
  "Location / Remote",
  "Work Auth Rule",
  "Fit Score",
  "Verdict",
  "Variant",
  "Referral Contact",
  "Referral Asked On",
  "Status",
  "Applied On",
  "Follow-up Date",
  "Last Update",
  "Notes",
] as const;

export const STATUSES = [
  "Found",
  "Referral asked",
  "Applied",
  "Screen",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
  "Ghosted",
];

const LISTS: Record<string, string[]> = {
  Source: ["Manual", "Job board", "Referral", "Recruiter", "HN Who is hiring", "Company site"],
  Verdict: ["Apply", "Referral first", "Skip"],
  Variant: ["A", "B", "C"],
  Status: STATUSES,
};

const README = [
  "HuntPilot tracker",
  "Keep this file where your agent's Excel tools point (default /JobSearch/JobTracker.xlsx). Table name: Applications. Key column: ID.",
  "IDs: JS-0001, JS-0002 ... The agent lists rows, reads the highest ID and adds 1.",
  "Verdict: Apply (score at or above your apply threshold), Referral first (between thresholds, or a target company), Skip (below, or a hard filter).",
  "Status: Found > Referral asked > Applied > Screen > Interview > Offer, or Rejected / Withdrawn / Ghosted.",
  "Follow-up Date: Referral asked +5 days; Applied +7 days; Interview +2 days (thank-you note).",
  "Dates are text in YYYY-MM-DD so every connector reads them the same way.",
  "Delete the sample row once your 'log this job' test passes.",
];

export async function buildTracker(file: string, today = new Date().toISOString().slice(0, 10)): Promise<void> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Applications");
  const sample = [
    "JS-0001", today, "Example Co (delete me)", "Senior Backend Engineer", "https://example.com/job",
    "Manual", "Remote - Americas", "Contractor OK", 82, "Referral first", "C", "", "", "Found", "", "", today,
    "Sample row to test the tracker",
  ];
  ws.addTable({
    name: "Applications",
    ref: "A1",
    headerRow: true,
    style: { theme: "TableStyleMedium2", showRowStripes: true },
    columns: TRACKER_COLUMNS.map((name) => ({ name, filterButton: true })),
    rows: [sample],
  });
  TRACKER_COLUMNS.forEach((name, i) => {
    ws.getColumn(i + 1).width = Math.max(10, name.length + 4);
    const list = LISTS[name];
    if (!list) return;
    for (let row = 2; row <= 1000; row++) {
      ws.getCell(row, i + 1).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`"${list.join(",")}"`],
      };
    }
  });
  const readme = wb.addWorksheet("Readme");
  README.forEach((line) => readme.addRow([line]));
  readme.getColumn(1).width = 120;
  await wb.xlsx.writeFile(file);
}
