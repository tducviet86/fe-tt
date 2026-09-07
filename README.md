# The Stay frontend

Next.js App Router frontend for the TT Rental booking API. Public SEO routes are server rendered; small client islands handle search state, filters and booking interactions.

## Local development

Copy `.env.example` to `.env.local`. Keep NestJS on port 3000 and run this frontend on port 3001:

```bash
npm run dev -- --port 3001
```

## Backend integration

Catalog pages fetch the NestJS API server-side. Pricing and hold requests go through same-origin Next.js route handlers to the backend. Public flows send `publicCode`; NestJS resolves its internal UUID, so database identifiers are never exposed to the browser. Pricing totals and deposits are always calculated by the backend.

Search, booking, account and admin URLs are excluded from sitemap/indexing. The admin routes are an information architecture shell; mutations remain unavailable until the corresponding protected backend CRUD endpoints exist.
