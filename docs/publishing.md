# Publishing: private instance, public template

HuntPilot has two lives, and they're published differently.

| | Your instance | This template |
| --- | --- | --- |
| What it is | The agent with your resume, facts and tools | This repository: templates, CLI, docs, tests |
| Who sees it | Only you | Anyone |
| Where | Teams / Microsoft 365 Copilot with sign-in, your Claude Project, or a GPT set to "Only me" | GitHub |
| Personal data | Yes | None. The example profile is fictional |

## Why your instance stays private

Your instance can read your resume and, depending on the platform, write to your tracker and draft emails. In Copilot Studio, an agent set to **No authentication** can be used by anyone who has the link and can't run tools that need user sign-in ([Microsoft Learn](https://learn.microsoft.com/microsoft-copilot-studio/publication-fundamentals-publish-channels)). The demo website is for testers only, and Microsoft says not to share its URL with customers ([Microsoft Learn](https://learn.microsoft.com/microsoft-copilot-studio/publication-connect-bot-to-web-channels)).

## Rollout order

1. **Build:** fill in your profile, render, check.
2. **Private test:** run the test checklist with your own documents ([testing.md](testing.md)).
3. **Pilot:** use it for your own applications for a week. Ask one friend to set it up from this README alone.
4. **Publish the template:** make the repository public, pin it, and link it from your profile.

## Before making the repository public

- [ ] `git grep` for your name, email, employers and metrics, and confirm none of them appear
- [ ] `profile.yaml`, `private/` and `knowledge/` are git-ignored and were never committed
- [ ] CI is green
- [ ] A friend completed setup from the README in under 30 minutes
- [ ] The README's safety rules match the templates
