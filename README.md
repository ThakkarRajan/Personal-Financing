# Budget Planner (web)

Private Next.js app for **Rajan Thakkar** that mirrors the Google Sheet **New Dashboard**: bold colourful KPIs, month switching, data entry, and bills/savings — with Google sign-in and live read/write against the existing Budget Planner spreadsheet (the sheet stays the source of truth).

- **Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Recharts, Auth.js / next-auth (Google), Google Sheets API, Vitest
- **Hosting target:** Vercel (HTTPS public URL; access gated by Google OAuth + email allowlist)
- **Spreadsheet ID:** set via `SPREADSHEET_ID` (see `.env.example`)

## Features

| Page | What it does |
|------|----------------|
| **Dashboard** | KPIs (Balance, Income, Expenses, Bills Left), Cash Flow chart, Highest Expenses, month picker (writes `New Dashboard!C3`) |
| **Data Entry** | Append transactions to the sheet; list recent rows; category list from Chart Data |
| **Bills & Savings** | Read-only bills table + Bills Left (edits stay in the sheet for v1) |

Only the email in `ALLOWED_EMAIL` can sign in.

## Local setup

### 1. Install

```bash
cd budget-planner-web
npm install
```

### 2. Google Cloud OAuth + Sheets API

1. Open [Google Cloud Console](https://console.cloud.google.com/) and create or select a project.
2. **APIs & Services → Library** → enable **Google Sheets API**.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**.
4. Application type: **Web application**.
5. Add **Authorized redirect URIs** (both if you use local + Vercel):

   | Environment | Redirect URI |
   |-------------|--------------|
   | Local | `http://localhost:3000/api/auth/callback/google` |
   | Vercel | `https://<your-project>.vercel.app/api/auth/callback/google` |

   Replace `<your-project>` with your real Vercel hostname (and add any custom domain the same way: `https://your.domain/api/auth/callback/google`).
6. Copy the **Client ID** and **Client Secret**.
7. Under **OAuth consent screen**, add your Google account as a test user if the app is in Testing mode.

### 3. Environment variables

Copy the example file and fill in values (**never commit real secrets**):

```bash
cp .env.example .env.local
```

| Variable | Purpose |
|----------|---------|
| `GOOGLE_CLIENT_ID` | OAuth Web client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth Web client secret |
| `NEXTAUTH_SECRET` | Random secret for session encryption (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | App origin, e.g. `http://localhost:3000` or `https://<project>.vercel.app` |
| `ALLOWED_EMAIL` | Your Google account email (only this user can sign in) |
| `SPREADSHEET_ID` | Budget Planner spreadsheet ID (default is already in `.env.example`) |

OAuth scopes requested: OpenID profile/email + `https://www.googleapis.com/auth/spreadsheets`.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → Sign in with Google → Dashboard.

### 5. Tests & production build

```bash
npm test
npm run build
```

## Deploy on Vercel

Do **not** put secrets in the repo. Configure them in the Vercel project.

1. Push this repo to GitHub (or connect the folder in the Vercel dashboard / CLI).
2. Create a Vercel project linked to the repo (root directory: `budget-planner-web` if the app lives in a monorepo).
3. In **Settings → Environment Variables**, set the same keys as `.env.example`:
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET` (new random value is fine)
   - `NEXTAUTH_URL` = `https://<your-project>.vercel.app` (or your custom domain)
   - `ALLOWED_EMAIL`, `SPREADSHEET_ID`
4. Add the Vercel callback URI in Google Cloud (see table above).
5. Deploy (`vercel` / Git push). Open the HTTPS URL and sign in.
6. Walk through the checklist in [`DEPLOY.md`](./DEPLOY.md).

You must supply your own Google OAuth credentials; this repo does not include them and agents should not run `vercel deploy` with secrets on your behalf unless you provide them securely.

## Project layout (high level)

```
src/app/           # App Router pages + API routes
src/components/    # UI (nav, KPIs, charts, forms, tables)
src/lib/           # allowlist, month helpers, Sheets client, types
tests/             # Vitest unit tests
```

## Troubleshooting

- **“Could not load sheet — try signing in again”** — access token expired or Sheets scope missing. Sign out and sign in again (consent should include Sheets).
- **Redirect URI mismatch** — exact match required in Google Cloud (localhost vs Vercel, `http` vs `https`, trailing path `/api/auth/callback/google`).
- **Not authorized after Google login** — email must match `ALLOWED_EMAIL` (case-insensitive).
- **Empty KPIs / wrong month** — confirm `SPREADSHEET_ID` and that the signed-in Google account can open the sheet.

## License / privacy

Personal private app. Data lives in your Google Sheet; the web app only uses your OAuth token server-side.
