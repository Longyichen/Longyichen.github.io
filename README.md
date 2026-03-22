# Yilong Chen Academic Homepage

Personal academic homepage for Yilong Chen, built as a static site and deployed with GitHub Pages.

Site: `https://research.yichen.ink`

## Overview

This repository contains a bilingual academic homepage focused on:

- Foundation models
- Adaptive architectures
- Efficient training and inference
- Large-scale pretraining research

The site is designed as a lightweight single-page website with:

- English as the default language
- A full-page Chinese toggle
- Research overview, publications, working papers, education, service, and awards
- SEO metadata for search engines and social sharing

## Structure

- `index.html`: main page content and metadata
- `assets/style.css`: site styling
- `assets/style.js`: typography, language switching, and navigation behavior
- `images/`: profile image, icons, and static image assets
- `cites/`: BibTeX files for selected papers
- `robots.txt`: crawler rules
- `sitemap.xml`: sitemap for search engines
- `CNAME`: custom domain for GitHub Pages

## Local Editing

Because this is a plain static site, no build step is required.

You can preview it locally with any simple static server, for example:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deployment

The site is intended to be deployed with GitHub Pages.

Key settings:

- Custom domain: `research.yichen.ink`
- Entry page: `index.html`
- No framework-specific build pipeline required

## SEO and Metadata

The homepage includes:

- Canonical URL
- Open Graph metadata
- Twitter card metadata
- JSON-LD structured data
- `robots.txt`
- `sitemap.xml`
- Web app manifest and favicon assets

If the domain or preview image changes, update:

- `index.html`
- `sitemap.xml`
- `robots.txt`
- `images/nicons/site.webmanifest`

## Notes

- Paper titles remain in English across both language modes.
- The Chinese version is intended to mirror the homepage structure, not to serve as a PDF CV replacement.
