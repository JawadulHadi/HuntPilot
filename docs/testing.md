# Testing HuntPilot with your own documents

Test privately before you rely on HuntPilot for real applications. The unit tests (`npm test`) cover the CLI. This guide covers the agent itself.

## What you need

- Your real resume, cover letter and `facts.md`, uploaded to the agent
- Five real job descriptions:
  - 2 strong fits for Variant A or C
  - 2 strong fits for Variant B
  - 1 role with a hard-filter blocker, such as a work-authorization line you don't meet

## Run it

```bash
npm run evals   # writes out/test-run.md with your profile filled in
```

Work through `out/test-run.md` in the deployed agent, in a fresh conversation for each area. Tick each case that meets its pass rule.

## Pass rule

- **Every critical case passes.** These cover invented facts, hard filters, the tracker, file safety and never sending email.
- **At most 2 other cases miss.** Fix the profile or a template, render again, and re-run those cases.

## What to look for beyond the checklist

- Any number, date or employer you can't find in your own files. That's an invented fact, and it fails J6 even if J6 passed.
- The headline metric worded differently anywhere.
- Job discovery listing a role whose page it didn't open.

## After launch

For the first two weeks, review 10 conversations a week. Turn every miss into a new case in `evals/cases.yaml`.
