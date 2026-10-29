# Security

HuntPilot handles personal career data. If you find a way it could leak a user's data, send email or messages without approval, or overwrite files, report it privately through [GitHub security advisories](https://github.com/JawadulHadi/job_hunt/security/advisories/new) rather than in a public issue.

## Design rules

- Configured instances stay private and behind sign-in. See [docs/publishing.md](docs/publishing.md).
- The agent drafts only. It never sends or submits.
- The agent never overwrites files it didn't create.
- Profiles and knowledge files are git-ignored by default.
