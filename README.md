# Jubilee Retreat & Conference Centre

An eight-page, responsive, events-first website built with React, Vite and plain CSS. Uses Node.js 24 LTS, also specified in package.json for Vercel. Every page is pre-rendered during the build and hydrated by React in the browser.

## Run locally

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. Vite updates the development preview when source files change. On Windows PowerShell, use `npm.cmd` if the system blocks npm.ps1.

```sh
npm run build
npm run check
npm test
npm run preview
```

## Deploy to Vercel

Import this folder as a Git repository into Vercel. Select Vite as the framework; the included vercel.json sets `npm run build`, output directory `dist`, and clean URLs. Use Node.js 24.x. Vercel installs dependencies using the committed package-lock.json. No backend or API credentials are required. All eight routes have their own generated HTML, so direct visits and refreshes do not need a catch-all SPA rewrite. Unknown URLs use the generated 404 page.

Set `SITE_URL` to your full production origin without a trailing slash (for example, `https://your-domain.com`) to generate canonical URLs, a sitemap and absolute social-sharing image URLs. Vercel's production domain environment variable is also supported. Redeploy after changing the domain. Deployment itself has not been performed by the local build.

## Content and enquiries

Page content and metadata are editable React JSX in `src/pages.jsx`. `src/components.jsx` contains the reusable forms, contact tabs, gallery and header. `src/App.jsx` selects the route and shared layout; `src/main.jsx` hydrates the application; `src/style.css` contains the plain CSS. Named assets are in `assets/images`, and supplied original files are preserved. `scripts/build.mjs` builds with Vite and pre-renders routes; `scripts/check.mjs` validates the deployable output. `npm test` checks production React hydration on all routes and exercises the forms, gallery, tabs and menu in jsdom. These checks do not replace visual testing in a real browser.

Forms validate details and prepare an enquiry for the visitor to send through WhatsApp. No message is sent automatically, no bookings are confirmed, and no personal data is stored by this site. There is no email backend or payment processing. An email service can be added after the centre provides a verified email address and an approved delivery service.

The home-page hero includes a compact enquiry card (`src/HomeHero.jsx`) with a choice of planning an event or booking a stay. Event enquiries collect the occasion, date, guest count and catering/room needs; stays collect check-in, check-out, guests and room preference. Both validate dates and open a pre-filled WhatsApp message; a continuation link is provided if the browser blocks the new tab. Visitors send the message themselves in WhatsApp. The sticky navbar uses the reusable vector logo in `src/Logo.jsx`, with standalone artwork in `assets/logo.svg` and the matching favicon in `assets/favicon.svg`. Hero, logo and sticky header styles are in `src/booking.css`. Mobile layout and dialog/overscroll safeguards are in `src/mobile-fixes.css`. The floating WhatsApp link (`src/FloatingContact.jsx`) hides when the booking card or footer is visible to avoid duplicate actions and covered content.

## Confirm before public launch

- Telephone, street address, ownership statement and precise map pin.
- Current room rates, group eligibility, cancellation/deposit terms and checkout policy.
- Official hall names, capacities, layouts, inclusions and catering arrangements.
- Current menu, dish names, prices, dining hours and public access.
- Pool hours, admission rates, safety arrangements and day-visitor access.
- Room-specific amenities, photos and the preferred spelling of “Royal Suit”.
- Rights to use supplied photos and the published Instagram handle.

The site omits unverified Google ratings and testimonials, missing email addresses and invented amenities. Supplied photos cover one room, two halls, food, exterior and pool; additional room-specific, lobby and dining-room photography is still needed. No generated images are presented as actual rooms.
