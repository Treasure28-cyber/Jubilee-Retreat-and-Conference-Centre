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

The centered home-page hero is followed by a three-tab enquiry card (`src/HomeHero.jsx`): Plan an Event, Book a Room, Reserve a Table. It crosses the hero seam on desktop and sits in normal flow, overlapping the hero by 48px, at widths up to 900px. Events are selected by default. Tabs support arrow keys, Home and End, and keep entered details when switching. Dates are validated; empty optional fields are omitted from the prepared WhatsApp message. A continuation link is provided if the browser blocks the new tab. Visitors send messages themselves in WhatsApp.

The sticky navbar uses a Cormorant Garamond wordmark and a gold cross-and-arch line mark (`src/Logo.jsx`, `assets/logo.svg` and `assets/favicon.svg`). Headings use Cormorant Garamond; body text uses Source Sans 3. The final visual direction, responsive enquiry card and numbered section labels are styled in `src/jubilee.css`. The preceding `src/booking.css` and `src/mobile-fixes.css` retain shared navbar and iOS dialog/overscroll safeguards. The floating WhatsApp link (`src/FloatingContact.jsx`) hides when the card or footer is visible.

`src/content.js` stores the verified phone, Google listing link, supplied Google rating (4.1 from 989 reviews), and an empty array ready for genuine guest reviews. The homepage shows the rating summary until real reviews are supplied. The same rating is included in the homepage description, Open Graph description and structured data. Per the owner's direction, no email address or second phone number is published. Optional verified contact fields can be added to the configuration later.

`docs/design-directions.md` records separate proposed directions for Jubilee, Carlaw, Tozak and Victory View. Only Jubilee is implemented in this repository.

The shared header and mobile navigation live in `src/Header.jsx`, styled in `src/navigation.css`. The drawer separates experience and information links, highlights the current route, and keeps booking actions visible while the navigation scrolls independently. Native modal-dialog behavior provides focus containment and Escape dismissal; closing restores focus to the menu button.

## Confirm before public launch

- Telephone, street address, ownership statement and precise map pin.
- Current room rates, group eligibility, cancellation/deposit terms and checkout policy.
- Official hall names, capacities, layouts, inclusions and catering arrangements.
- Current menu, dish names, prices, dining hours and public access.
- Pool hours, admission rates, safety arrangements and day-visitor access.
- Room-specific amenities, photos and the preferred spelling of “Royal Suit”.
- Rights to use supplied photos and the published Instagram handle.

The site omits invented testimonials, missing email addresses and invented amenities. The Google rating and count match the supplied brief and the identified Google hotel listing, and should be periodically checked. Supplied photos cover one room, two halls, food, exterior and pool; additional room-specific, lobby and dining-room photography is still needed. No generated images are presented as actual rooms.
