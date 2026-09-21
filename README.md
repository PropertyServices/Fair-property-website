# Fair Property Service: website

A single-page, responsive static site. No build step, no dependencies beyond Google Fonts.

```
index.html    Page content and structure
styles.css    Design tokens, layout and components
script.js     Mobile menu, price estimator, contact form
favicon.svg   Site icon
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
- **Any web host:** upload the four files to the public web folder

## Replace the placeholders

Search the files for these and swap in your real details:

| What | Where |
| --- | --- |
| Phone, email, address, opening hours | `index.html` (Contact section and the JSON-LD block in `<head>`) |
| Prices and "from" amounts | `index.html` (Services section) and `SERVICES` in `script.js` |
| Contact email used by the form | `CONFIG.contactEmail` in `script.js` |
| Brand colours | The `:root` variables at the top of `styles.css` |
| Promises (30-day fix, no call-out fees, 24-hour quotes, insurance) | `index.html`. Only keep the ones you can honour. |
| Service radius (30 km) | FAQ in `index.html` |

The example invoice in the hero is illustrative. Edit the lines in `index.html` to reflect a typical job of yours.

## Contact form

The form works on any static host without a server:

- **Default:** it opens the visitor's email app with the message prepared.
- **Direct sending:** create a form endpoint with a service such as Formspree or Basin, then paste its URL into `CONFIG.formEndpoint` in `script.js`. Messages will then be posted as JSON and land in your inbox.

A hidden honeypot field is included to reduce spam.

## Before launch

- Add a privacy policy and legal notice page if your region requires them (for example Impressum and Datenschutz in Germany), and link them in the footer.
- Add a social preview image with an `og:image` meta tag if you'd like richer link previews.
