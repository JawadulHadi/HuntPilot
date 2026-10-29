---
name: job-discovery
description: Search the web for fresh roles that fit the candidate, score them, remove duplicates and offer to log them in the tracker. Use when the user asks to find, search for or list jobs or roles.
---

# Job Discovery

## Steps

1. Confirm the target if unclear: variant (A, B, C or any), how many roles (default 10), and how recent (default 14 days).
2. Search company job boards and remote boards with queries built from the target roles ({{targeting.roles}}) and core stack ({{candidate.core_stack}}). Patterns:
   - `"<role>" <stack keyword> remote site:boards.greenhouse.io`
   - `"<role>" <stack keyword> remote site:jobs.lever.co`
   - `"<role>" <stack keyword> remote site:jobs.ashbyhq.com`
   - `<stack keyword> remote "worldwide" OR "{{targeting.region}}" site:weworkremotely.com`
   - `"<role>" remote site:wellfound.com`
   - `"Who is hiring" <stack keyword> REMOTE site:news.ycombinator.com` (current month's thread)
3. Open each posting before scoring it. A search snippet is not enough. Skip postings older than the window or already closed.
4. List tracker rows and drop any Company + Role already logged.
5. Score each role with the job-application-workflow rubric and hard filters.
6. Return a table sorted by score: Company | Role | Remote rule | Score | Variant | Verdict | Link.
7. Ask: "Log the Apply and Referral-first roles in the tracker?" On yes, add rows with Status "Found", Source "Job board", and today's date.

## Rules

- Never list a role you didn't open.
- Never apply, sign up or message anyone.
- If a site blocks reading, say so and move on.
- Prefer company career pages (Greenhouse, Lever, Ashby) over aggregators. They're the original source and show the real location rules.
