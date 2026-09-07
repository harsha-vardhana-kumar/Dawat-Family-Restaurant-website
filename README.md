# Dawat Family Restaurant

Premium, static Astro website for Dawat Family Restaurant in Tanuku, Andhra Pradesh.

## Run locally

Requires Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

```sh
npm run check
npm run build
npm run preview
```

The production output is `dist/`. Deploy it to a static host with `404.html` configured as the missing-page response. Set `SITE_URL` to the final public origin before building to generate matching canonicals, Open Graph URLs, robots and sitemap. The default origin, `https://example.com`, is an editable placeholder. Set `SITE_URL` to the confirmed public domain for a production build, for example `SITE_URL=https://your-confirmed-domain.example npm run build`.

## Pages

Home, menu, signature dishes, our story, experience, gallery, order online, contact, offers, FAQ, and a custom 404. Standard trailing-slash routes are supported.

## Content ownership

- `src/data/restaurant.ts`: business facts, contact, hours, ordering link, location and navigation.
- `src/data/menu.ts`: all 91 supplied names/prices, categories, dietary status, signatures and home menu selections.
- `src/data/gallery.ts`: image slots, descriptive alt text, categories and image disclosure.
- `src/assets/`: six local, optimized WebP images. Astro emits responsive image sizes.

All business content comes from the supplied brief. No ratings, reviews, discounts, awards, delivery promises, founder biographies or services have been invented. Breads and snacks have unspecified dietary status because the supplied categories do not confirm vegetarian status. The Veg filter includes only explicitly vegetarian categories. Shadi Ka Mutton Dum Biryani, Chicken Cheese Balls and Authentic Irani Chai have no supplied prices, so their details direct visitors to call. The exact supplied `Sapon Ka Hyderabadi Chicken Dum Biryani` spelling and `Veg Manchow Soup — ₹140.50` price are retained.

## Photography

Current images are AI-generated editorial illustrations, clearly disclosed in the footer and gallery, with an additional notice on ambience features. They do not document Dawat’s actual food presentation or premises. See `docs/image-provenance.json` for the prompts. Replace the six stable image slots with approved genuine Dawat photography before a public brand launch. Update the disclosure and alt text when every illustrative asset has been replaced. Do not hotlink unlicensed images.

## Interactions and accessibility

Vanilla JavaScript handles menu search/filtering, keyboard-operated home tabs, mobile navigation, gallery filters, and the native-dialog lightbox. The gallery supports Escape, left/right arrows, focus trapping and focus return. FAQ content uses native details/summary. All content is statically rendered. Motion respects reduced-motion settings, images reserve layout space, fonts are self-hosted, and conversion links use the supplied telephone and Zomato destination.

## Review before public launch

Confirm the supplied menu prices, unusual spellings, unknown signature prices, dietary details and the map pin with the restaurant. Add approved official social links if available. No social placeholder links are exposed to guests. There are no current confirmed promotions or customer reviews to publish. Maps uses a query-based Google Maps embed with an external directions fallback; a verified place ID can be substituted when supplied. No contact, reservation, payment or order-processing backend is needed: orders are handed to Zomato and enquiries use click-to-call.

A private review deployment is independent of a final restaurant domain and public launch. The repository includes no credentials.
