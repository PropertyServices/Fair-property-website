# Fair Property Services Ltd: website

A single-page, responsive static site. No build step, no dependencies beyond Google Fonts.

```
index.html    Homepage content and structure
privacy.html  Privacy & data protection notice (UK GDPR / DPA 2018)
styles.css    Design tokens, layout and components
script.js     Mobile menu, price estimator, contact form
favicon.svg   Site icon
logo.svg      Your logo (add this file — see "Add your logo" below)
```

## Preview locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Deploy

Upload the folder's contents to any static host. The site lives at the root, so no configuration is needed.

- **Netlify:** drag the folder onto app.netlify.com/drop
- **Cloudflare Pages / Vercel:** create a project, set the build command to none and the output directory to `.`
- **GitHub Pages:** push to a repository, then enable Pages under Settings, using the main branch and the root folder
- **Any web host:** upload all the files in this folder to the public web folder

## Replace the placeholders

Search the files for these and swap in your real details:

| What | Where |
| --- | --- |
| Phone, email, address, opening hours | `index.html` (Contact section and the JSON-LD block in `<head>`) and `privacy.html` |
| Prices and "from" amounts (now in GBP) | `index.html` (Services section) and `SERVICES` in `script.js` |
| Contact email used by the form | `CONFIG.contactEmail` in `script.js` |
| Brand colours | The `:root` variables at the top of `styles.css` |
| Promises (30-day fix, no call-out fees, 24-hour quotes, insurance) | `index.html`. Only keep the ones you can honour. |
| Service radius (30 km) | FAQ in `index.html` |
| Gas Safe registration number | `index.html` (Gas safety check service) &mdash; search for `[ADD YOUR GAS SAFE REGISTRATION NUMBER]` |
| Registered office address and company number | `privacy.html` &mdash; search for `[Add your company's registered office address...]` |
| ICO data protection registration number | `privacy.html` &mdash; search for `[Most UK businesses that process personal data...]` |

The example invoice in the hero is illustrative. Edit the lines in `index.html` to reflect a typical job of yours.

## Add your logo

The header currently uses a small inline monogram (a teal square with a roof and two lines) instead of a logo file. To use your own logo:

1. Save your logo as `logo.svg` (or `logo.png`) in this same folder.
2. In `index.html` and `privacy.html`, find the `<a class="brand" ...>` block near the top of `<body>`, and replace the inline `<svg class="brand__mark">...</svg>` with:
   ```html
   <img class="brand__mark" src="logo.svg" width="34" height="34" alt="">
   ```
3. If your logo isn't square, adjust the `width`/`height` and add `.brand__mark { width: auto; }` in `styles.css` if needed so it doesn't stretch.

## Gas, heating and boiler work &mdash; a legal requirement

In Great Britain, only individuals or businesses registered with **Gas Safe Register** may legally work on gas appliances, carry out gas safety checks, or install and repair boilers. Before you publish the Gas safety check and Boiler installation & repair services on this site:

- Add your real Gas Safe registration number in `index.html` (search for `[ADD YOUR GAS SAFE REGISTRATION NUMBER]`).
- Make sure every engineer who does this work is actually Gas Safe registered for that type of work.
- Do not advertise or offer these services if you are not registered &mdash; doing so can carry criminal penalties in the UK.

## Contact form

The form works on any static host without a server:

- **Default:** it opens the visitor's email app with the message prepared.
- **Direct sending:** create a form endpoint with a service such as Formspree or Basin, then paste its URL into `CONFIG.formEndpoint` in `script.js`. Messages will then be posted as JSON and land in your inbox.

A hidden honeypot field is included to reduce spam.

## Privacy & data protection

`privacy.html` is a UK GDPR / Data Protection Act 2018 style privacy notice, linked from the footer of every page. It is a template, not legal advice — before you publish:

- Have it checked by a solicitor.
- Fill in the placeholders (registered office address, company number, Gas Safe number, ICO registration number).
- Update the "How we share your data" and "How the contact form works" sections if you later connect the form to a third-party service (such as Formspree) or add analytics/cookies — these introduce new data-sharing that the notice needs to describe.
- Check whether your business needs to register with the ICO and pay the data protection fee, at ico.org.uk.

## Before launch

- Confirm the placeholders above are all filled in with real details.
- Add a social preview image with an `og:image` meta tag if you'd like richer link previews.
