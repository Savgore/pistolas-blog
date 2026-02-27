# pistolas.co.uk — Handoff Guide

## 1. Publishing a Post

1. Create a new file in `posts/` named `YYYY-MM-DD-slug.md`
2. Add the frontmatter (see reference below)
3. Write your post body in Markdown below the frontmatter
4. Commit and push to `main`
5. GitHub Actions builds and deploys automatically — live in ~30 seconds

That's it. No CMS, no build step to run locally.

---

## 2. Frontmatter Reference

```yaml
---
title: "Exact post title"           # required
date: 2026-02-27                    # required — YYYY-MM-DD
description: "One or two sentences, max 160 chars. Used in post subtitle, OG/Twitter meta, post list." # required
tags:
  - post                            # required system tag — keep this
  - security                        # one or more topic tags (see §3)
permalink: /blog/your-slug/         # required — must match original URL if migrating
og_image: /assets/og-default.png   # optional — use /assets/posts/[slug]/og.png for custom image
---
```

**Required fields:** `title`, `date`, `description`, `tags` (must include `post`), `permalink`

**Optional fields:** `og_image` (falls back to `/assets/og-default.png` if omitted)

No `stream:` field. Tags are the only taxonomy.

---

## 3. Tag Conventions

- Tags are lowercase. Use single words or hyphens: `security`, `systems`, `ai-safety`
- The **first tag** in the list (after `post`) is the **primary display label** on post list items
- Every tag automatically gets:
  - An archive page at `/tag/[tag]/`
  - An RSS feed at `/feeds/tags/[tag]/feed.xml`
- **No config changes needed** when adding a new tag — just use it in frontmatter
- Suggested starting tags: `security`, `systems`, `ai`, `alignment`, `privacy`, `futurism`, `making`, `now`
- `now` is for short notes, TILs, and observations

---

## 4. Image Workflow

**In-post images:**
- Store in `/assets/posts/[your-slug]/image.png`
- Reference in Markdown: `![alt text](/assets/posts/your-slug/image.png)`
- The CSS applies a border automatically — don't bake borders into the image
- Use descriptive `alt` text always

**OG/social thumbnails:**
- Default: `/assets/og-default.png` (1200×630px, olive palette)
- Custom per-post: save to `/assets/posts/[slug]/og.png` and set `og_image: /assets/posts/[slug]/og.png` in frontmatter
- OG spec: 1200×630px, `#ECEADF` background, 4px `#5C6228` top rule, Playfair Display title, Source Code Pro byline

---

## 5. Cutting Over to Main Domain

To go live at `pistolas.co.uk` (currently staging at `new.pistolas.co.uk`):

1. In `.github/workflows/deploy.yml`, change:
   ```yaml
   cname: new.pistolas.co.uk
   ```
   to:
   ```yaml
   cname: pistolas.co.uk
   ```
2. Set DNS at your registrar:
   - Four A records pointing `@` to:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - One CNAME record pointing `www` to `[your-github-username].github.io`
3. Push the change to `main` — GitHub Actions will deploy and set the CNAME file automatically
4. DNS propagation typically takes a few minutes to a few hours

---

## 6. Public Repository

The repository is intentionally public. **Do not commit:**
- API keys or tokens of any kind
- Personal or client email addresses not already on the public site
- Unpublished drafts you're not ready to share

The GitHub Actions workflow uses `GITHUB_TOKEN` which is automatically provided by GitHub — no manual secrets configuration needed.

---

## 7. Adding a New Tag

1. Add the tag to any post's frontmatter: `tags: [post, my-new-tag]`
2. Push to `main`
3. On the next build, automatically created:
   - Archive page: `/tag/my-new-tag/`
   - RSS feed: `/feeds/tags/my-new-tag/feed.xml`
   - Entry in the tag bar on all listing pages
   - Entry in the `/tags/` index grid

Zero config changes. Zero template changes.

---

## 8. Dependency Maintenance

```bash
npm update
```

Review the [Eleventy changelog](https://www.11ty.dev/docs/) before major version bumps — v3 to v4 may require config changes. All other dependencies (luxon, markdown-it, eleventy-plugin-rss) are stable and rarely break.

---

## 9. Search Console

After going live on the main domain:
1. Verify the property at [search.google.com/search-console](https://search.google.com/search-console)
2. Submit `https://pistolas.co.uk/sitemap.xml`
3. The sitemap includes all posts, tag pages, and fixed pages automatically

---

## 10. Local Development

Because the project lives on OneDrive, run the dev server from a copy in /tmp or another local path:

```bash
rsync -av --exclude=node_modules --exclude=public /path/to/pistolas-blog/ /tmp/pistolas-build/
cd /tmp/pistolas-build
npm install --cache /tmp/npm-cache
node node_modules/@11ty/eleventy/cmd.cjs --serve
```

Or better: clone the GitHub repo to a non-OneDrive location and work from there. Push changes to GitHub and pull them back into OneDrive if needed. Once the repo is on GitHub, you don't need to develop from the OneDrive copy.

The dev server runs at `http://localhost:8080` with live reload.
