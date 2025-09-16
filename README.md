# Cnidaria · One-QR Donate (Next.js)

A tiny, non-custodial "one QR for many chains" donation page.

## Quickstart

```bash
git clone <your-repo-url>
cd cnidaria-oneqr
npm install
npm run dev
# open http://localhost:3000 and http://localhost:3000/p/mike
```

## Where to put your addresses

Edit `src/lib/db.ts` and replace the placeholder addresses with your real receiving addresses.
Set your preferred default chain there too.

## Deploy

1) Push to GitHub
2) Import to Vercel → Deploy (free plan is fine)