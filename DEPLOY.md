# Deploy checklist (Budget Planner web)

Use this after local setup and before calling the app “live”.  
Mirror of the design-spec success criteria — leave items unchecked until you verify them yourself.

## Before deploy

- [ ] Google Cloud: Sheets API enabled
- [ ] OAuth Web client created
- [ ] Authorized redirect URI for localhost: `http://localhost:3000/api/auth/callback/google`
- [ ] Authorized redirect URI for Vercel: `https://<your-project>.vercel.app/api/auth/callback/google`
- [ ] `.env.local` filled from `.env.example` (no secrets committed)
- [ ] Vercel env vars set: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ALLOWED_EMAIL`, `SPREADSHEET_ID`
- [ ] `NEXTAUTH_URL` matches the live HTTPS origin
- [ ] App deployed on Vercel (you run deploy; supply OAuth credentials yourself)

## Spec success criteria

- [ ] Only allowlisted Google account can use the app
- [ ] Dashboard matches New Dashboard numbers for the selected month
- [ ] Month change updates the sheet and the UI
- [ ] New expense from the site appears in Transactions and flows into totals
- [ ] Bills page shows current Bills Left and line items
- [ ] Public URL works over HTTPS on Vercel
- [ ] Visual style recognizably matches bold colourful New Dashboard

## Smoke tips

1. Sign in with the allowlisted account; confirm a non-allowlisted account is rejected.
2. On Dashboard, compare Balance / Income / Expenses / Bills Left to the sheet for the current month.
3. Change month in the picker; confirm `New Dashboard!C3` and KPIs update.
4. On Data Entry, add a small test row with comment `web-app-test`; confirm it appears in Transactions.
5. Open Bills & Savings; confirm line items and Bills Left.
6. Sign out, wait or force token expiry if possible, reload — expect the friendly “sign in again” message when the sheet call fails.
