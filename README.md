# Faisal AI — personal career intelligence

A secure, approval-first MVP for job discovery, matching, CV versions, portfolio links, networking CRM, Gmail analysis and daily reports. Anthropic is called only from the server. The application does **not** scrape LinkedIn, search members, or send LinkedIn messages/applications automatically.

## Run locally

1. Copy `.env.example` to `.env`; add a long random `TOKEN_ENCRYPTION_KEY` and optionally `ANTHROPIC_API_KEY`.
2. Run `npm start`, then open `http://localhost:3000`.
3. The seeded profile is deliberately editable; replace it with your own background, targets and links.

No Anthropic key is required to demonstrate the app: matching uses a safe fallback. Data is saved at `data/faisal-ai.json`; OAuth tokens are AES-256-GCM encrypted at rest. For production, move to Postgres with row-level security and a managed KMS/vault.

## Gmail OAuth (optional)

Create a Google OAuth **Web application**, enable Gmail API and register `http://localhost:3000/auth/google/callback`. Add credentials to `.env`. The application asks only for `gmail.readonly`; it stores the encrypted refresh token and reads selected career-email metadata/snippets. Deploying publicly requires HTTPS, secure cookies/session auth, consent/privacy pages and any required Google verification.

## Boundaries and design

```
Dashboard → authenticated API → database/audit log
                         ├→ encrypted Google OAuth vault → Gmail read-only
                         ├→ approved job-board/ATS connectors → job matcher
                         ├→ Claude Messages API → career-analysis agents
                         └→ approval queue → user sends/submits externally
```

Every outreach/application draft starts `pending`; it must be explicitly approved or rejected. There is intentionally no send/apply endpoint. LinkedIn integration is limited to approved official OAuth/profile or posting capabilities; this product uses a manual CRM and destination links, not web automation or scraping.

## Production roadmap

1. Add Auth0/Clerk/Supabase Auth with MFA, server sessions, CSRF protection and per-user tenancy.
2. Migrate JSON to Postgres migrations/RLS; add backups, encryption keys, retention, export/deletion and incident response.
3. Add only approved APIs (e.g. company ATS/job feeds); retain source, consent and rate-limit metadata.
4. Add a queue and daily scheduler, logging/metrics, Claude spend caps and evaluation fixtures.
5. Deploy API/container to Cloud Run/Fly/Render/AWS with HTTPS, managed Postgres, a secret vault and least-privilege identities.

## Always-on cloud deployment (Render)

`render.yaml` and `Dockerfile` are ready for Render's Blueprint deployment. Push this folder to a private GitHub repository, then in Render select **New → Blueprint** and choose the repository. Render provisions the web service and its persistent disk. Add the Anthropic and Google OAuth secrets in Render's Environment page; never put them in Git.

Before activating Google OAuth, set `GOOGLE_REDIRECT_URI` to `https://YOUR-RENDER-SERVICE.onrender.com/auth/google/callback` and register that exact HTTPS address in Google Cloud. The health endpoint is `/health`. For a real multi-user public service, complete the authentication/Postgres/RLS roadmap before inviting other people.

## Research references

- [Anthropic API documentation](https://docs.anthropic.com/en/api/getting-started)
- [Google server-side OAuth](https://developers.google.com/identity/protocols/oauth2/web-server) and [Gmail authorization](https://developers.google.com/workspace/gmail/api/auth/web-server)
- [LinkedIn API access](https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access) and [LinkedIn API terms](https://developer.linkedin.com/legal)

