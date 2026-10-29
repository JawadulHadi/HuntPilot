# Set up HuntPilot in Microsoft Copilot Studio

This takes about 20 minutes. You need a Copilot Studio license that can publish agents, plus OneDrive for Business and Outlook in the same Microsoft 365 tenant.

## 1. Render your files

```bash
cp examples/profile.example.yaml profile.yaml   # then edit it
npm run render -- --platform copilot-studio
npm run check
npm run tracker
```

You get `out/copilot-studio/` and `out/JobTracker.xlsx`.

## 2. Create the agent

1. In [Copilot Studio](https://copilotstudio.microsoft.com), select **Create → New agent**, then skip the conversational setup.
2. Name it **HuntPilot** and add a one-line description.
3. Paste `out/copilot-studio/instructions.md` into **Instructions**. `npm run check` fails if it's over the 8,000-character limit.

## 3. Add knowledge

Upload your own files under **Knowledge**:

- Resume (.docx or .pdf)
- A base cover letter
- `facts.md`: employers and dates, metrics, certifications, work authorization, comp floor, relocation. The agent uses only these facts.
- Optional: your portfolio or case-study URL as a public website source.

Don't add LinkedIn as a website source. LinkedIn blocks crawlers, so it returns nothing.

## 4. Add the skills

In the agent's skills section, add one skill for each `skill-*.md` file and paste in the whole file, front matter included. The `name` and `description` lines decide when each skill runs.

## 5. Connect the tracker

1. Upload `JobTracker.xlsx` to OneDrive at the path in your profile (default `/JobSearch/JobTracker.xlsx`).
2. Under **Tools**, add these Excel Online (Business) actions: **List rows present in a table**, **Add a row into a table**, **Get a row**, **Update a row**.
3. On each one, set **File** to the tracker and **Table** to `Applications`. On Get and Update, set **Key column** to `ID`. Fixed values stop the agent from guessing a file.
4. Add **Office 365 Outlook → Draft an email message**. Don't add any "Send" action.
5. Optional: add **OneDrive → Create file** for saving drafts. Don't add "Update file". The instructions forbid overwriting, and leaving the tool out makes that a hard rule.

## 6. Turn on search and prompts

- **Web search: On.** It's under the agent's knowledge or generative AI settings, depending on your Copilot Studio version. The job-discovery skill needs it.
- **Overview → Suggested prompts:** paste the rows from `suggested-prompts.md`.

## 7. Test, then publish to yourself

1. Use the **Test** panel for a first pass.
2. Select **Publish**, then **Channels → Teams and Microsoft 365 Copilot → Open the agent in Teams**. Keep **Authenticate with Microsoft** on.
3. Run `out/test-run.md` (from `npm run evals`) in Teams. See [testing.md](testing.md).

Don't switch to **No authentication**. Anyone with the link could then use your agent, and tools that need your sign-in stop working ([Microsoft Learn](https://learn.microsoft.com/microsoft-copilot-studio/publication-fundamentals-publish-channels)).
