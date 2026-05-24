# Vercel deployment — Tatsam

Two pieces deploy independently:

1. **Next.js app** → Vercel
2. **ADK agent (`tatsam_ask`)** → Google Cloud Agent Engine (already deployed via
   `agents-cli deploy`; redeploy from Cloud Shell whenever the agent changes)

Vercel only needs the right env vars to call the agent that already lives on
Google Cloud.

---

## Required env vars on Vercel

Open the Vercel project → **Settings → Environment Variables**. Add these for
both **Production** and **Preview** environments:

| Name | Value | Notes |
|------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-supabase-host` | Your prod Supabase, not the sslip.io dev one |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ…` | From Supabase project settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ…` | Server-only — never expose. Used for OTP bypass; for prod, remove the dev bypass code path |
| `GOOGLE_CLOUD_PROJECT` | `tatsam-494417` | |
| `VERTEX_REASONING_ENGINE_ID` | `3171645194168696832` | The deployed agent's numeric ID. From `agents-cli deploy` output or Console → Vertex AI → Agent Engine |
| `VERTEX_REASONING_ENGINE_LOCATION` | `us-central1` | |
| `GOOGLE_CREDENTIALS_JSON` | *(whole tatsam-key.json contents)* | **See below** — paste the JSON as a single value |

⚠️ **Do NOT set `GOOGLE_APPLICATION_CREDENTIALS` on Vercel** — that's a file
path, and there's no file system on Vercel for the key to live on. Use
`GOOGLE_CREDENTIALS_JSON` instead. [app/api/ask/route.ts](app/api/ask/route.ts)
auto-detects which one is present.

### Pasting `GOOGLE_CREDENTIALS_JSON`

1. Open `tatsam_corpus/tatsam-key.json` (the service-account key).
2. Copy the entire file contents (the full JSON object, including outer braces).
3. On Vercel, **paste it as-is** into the value field. Vercel handles multiline
   strings — don't try to escape newlines yourself.
4. Save. Vercel re-deploys automatically.

### Removing the dev OTP bypass for prod

[app/login/actions.ts:37](app/login/actions.ts#L37) accepts OTP `000000` when
`NODE_ENV === "development"`. Vercel sets `NODE_ENV=production`, so the bypass
is automatically inert. But `SUPABASE_SERVICE_ROLE_KEY` is only used for that
bypass — if you want extra safety, omit that env var on Vercel entirely.

---

## Deploy steps

```bash
# From the repo root:
vercel --prod
```

Or push to the branch Vercel watches (usually `main`).

### Verify after deploy

1. Visit `/login`, sign in with a real email (or `admin@tatsam.app` if your
   prod Supabase has that user).
2. Go to `/dashboard/ask`.
3. Send a question. The first request can take 3–5 seconds (cold start on
   Agent Engine), subsequent ones stream within ~500ms.
4. If you see `upstream 404: Agent ... not found` → the
   `VERTEX_REASONING_ENGINE_ID` is wrong or the agent was deleted.
5. If you see `auth failed` → `GOOGLE_CREDENTIALS_JSON` is malformed or the
   service account lacks `roles/aiplatform.user`.

---

## Redeploying the agent (when you change `app/agent.py`)

From Cloud Shell, in `~/tatsam-agent`:

```bash
agents-cli deploy --project tatsam-494417 --region us-central1
```

This either updates the existing engine in place (keeping
`reasoningEngines/3171645194168696832`) or creates a new one. If a new one,
update `VERTEX_REASONING_ENGINE_ID` on Vercel.
