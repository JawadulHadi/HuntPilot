# Set up HuntPilot as a custom GPT

This takes about 10 minutes and needs a ChatGPT plan that can create GPTs.

## 1. Render your files

```bash
cp examples/profile.example.yaml profile.yaml   # then edit it
npm run render -- --platform custom-gpt
npm run check
```

## 2. Create the GPT

1. Select **Explore GPTs → Create → Configure**.
2. Name it **HuntPilot** and paste `out/custom-gpt/instructions.md` into **Instructions**. `npm run check` keeps it under the 8,000-character limit.
3. Under **Knowledge**, upload `skills-playbook.md`, your resume, base cover letter and `facts.md`.
4. Under **Capabilities**, turn on **Web search**.
5. Add the rows from `suggested-prompts.md` as conversation starters.

## 3. Sharing

Set the GPT to **Only me**. It contains your resume and facts. To share HuntPilot, share this repository instead.

## 4. Test

Run `npm run evals` and work through `out/test-run.md`. See [testing.md](testing.md).
