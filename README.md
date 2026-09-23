# The Stay frontend

Next.js App Router frontend for the TT Rental booking API. Public SEO routes are server rendered; small client islands handle search state, filters and booking interactions.

## Local development

Copy `.env.example` to `.env.local`. Keep NestJS on port 3000 and run this frontend on port 3001:

```bash
npm run dev -- --port 3001
```

## Backend integration

Catalog pages fetch the NestJS API server-side. Pricing and hold requests go through same-origin Next.js route handlers to the backend. Public flows send `publicCode`; NestJS resolves its internal UUID, so database identifiers are never exposed to the browser. Pricing totals and deposits are always calculated by the backend.

Search, booking, account and admin URLs are excluded from sitemap/indexing. Admin is available at `/admin/login`, with server-enforced permissions, bookings, customers, apartments, properties, payments, calendar and audit history.

For local development, set `API_URL=http://localhost:3000/api/v1` in `.env.local` and use the existing frontend on port 3001. On Railway, set `API_URL` to the deployed backend. No separate admin server or database is required.

The ABC Apartment brand migration is `202609220001_abc_apartment_brand`. Run `npm run prisma:migrate` in the backend deployment to update existing display content as well as the frontend.

# fe-tt
