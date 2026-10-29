# Set up HuntPilot as a Claude Project

This takes about 10 minutes on any Claude plan that supports Projects.

## 1. Render your files

```bash
cp examples/profile.example.yaml profile.yaml   # then edit it
npm run render -- --platform claude-project
npm run check
```

## 2. Create the project

1. In Claude, select **Projects → New project** and name it **HuntPilot**.
2. Paste `out/claude-project/instructions.md` into the project instructions.
3. Add these to project knowledge:
   - `out/claude-project/skills-playbook.md`
   - your resume, base cover letter and `facts.md`

## 3. Tools

- Turn on **web search** for job discovery.
- The tracker: connect a spreadsheet connector if you have one, or keep `JobTracker.xlsx` yourself and ask HuntPilot for the row to paste in.
- Email: if you connect an email connector, keep the drafts-only rule. HuntPilot's instructions never send.

## 4. Test

Run `npm run evals` and work through `out/test-run.md` in a new chat in the project. See [testing.md](testing.md).
