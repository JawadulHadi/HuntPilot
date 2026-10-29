# Contributing to HuntPilot

Thanks for helping. Bug reports, new test cases and platform guides are especially welcome.

## Develop

```bash
npm install
npm test            # unit tests
npm run typecheck
npm run render && npm run check
```

## Ground rules

- **No personal data.** Examples use the fictional profile in `examples/`. Never commit a real resume, `profile.yaml` or anything under `private/` or `knowledge/`.
- **Keep the safety rules.** Changes must keep drafts-only, never-overwrite and facts-only behavior.
- **Templates use `{{profile.path}}` tokens.** Add new profile fields to `src/profile.ts` and to the example profile in the same change.
- **Every agent behavior change gets a test case** in `evals/cases.yaml`.
- Keep the instructions under 8,000 characters. `npm run check` enforces this.

## Pull requests

Describe the change, why it's needed, and how you tested it. Include the `npm run check` output when templates change.
