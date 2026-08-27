# pistolas.co.uk, Handoff Guide

## 1. Publishing a Post

1. Create a new file in `posts/` named `YYYY-MM-DD-slug.md`
2. Add the frontmatter (see reference below)
3. Write your post body in Markdown below the frontmatter
4. Commit and push to `main`
5. GitHub Actions builds and deploys automatically, live in ~30 seconds

That's it. No CMS, no build step to run locally.

---

## 2. Frontmatter Reference

```yaml
---
title: "Exact post title"           # required
date: 2026-02-27                    # required, YYYY-MM-DD
description: "One or two sentences, max 160 chars. Used in post subtitle, OG/Twitter meta, post list." # required
tags:
  - post                            # required system tag, keep this
  - security                        # one or more topic tags (see §3)
permalink: /blog/your-slug/         # required, must match original URL if migrating
og_image: /assets/og-default.png   # optional, use /assets/posts/[slug]/og.png for custom image
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
- **No config changes needed** when adding a new tag, just use it in frontmatter
- Suggested starting tags: `security`, `systems`, `ai`, `alignment`, `privacy`, `futurism`, `making`, `now`
- `now` is for short notes, TILs, and observations

---

## 4. Image Workflow

**In-post images:**
- Store in `/assets/posts/[your-slug]/image.png`
- Reference in Markdown: `![alt text](/assets/posts/your-slug/image.png)`
- The CSS applies a border automatically, don't bake borders into the image
- Use descriptive `alt` text always

**OG/social thumbnails:**
- Default: `/assets/og-default.png` (1200×630px)
- Custom per-post: save to `/assets/posts/[slug]/og.png` and set `og_image: /assets/posts/[slug]/og.png` in frontmatter
- OG spec: 1200×630px, black on white, 1px black rule, Charter title, Charter italic byline. `og-generator.html` in the repo root still draws the retired green palette and needs updating before its next use.

---

## 5. Swapping the Paintings

Two paintings carry the design: the header band and the not-found page. Both are set in `_data/paintings.js`, and the attribution line in the footer is built from the `credit` fields, so a swap is one file.

```js
module.exports = {
  header: { src: "/assets/paintings/ninth-wave.jpg", credit: "Ivan Aivazovsky, The Ninth Wave, 1850" },
  lost:   { src: "/assets/paintings/temeraire.jpg",  credit: "J. M. W. Turner, The Fighting Temeraire..." },
};
```

Drop the new file in `/assets/paintings/` and change the two lines.

**Header images have two constraints:**
- Crop to roughly **6.2:1**. The band is a fixed slot; anything squarer will look wrong.
- Serve it from this domain. The header effect reads the image's pixels back off a canvas, and a cross-origin image throws a security error. The script catches this and leaves the painting alone, so the page still works, you just lose the effect.

The not-found painting has neither constraint. It is a plain `<img>` at whatever shape it comes in.

Use public domain work and keep the credit accurate. Wikimedia Commons is the usual source; download at 1600–2400px wide and compress to under ~150KB.

---

## 6. Public Repository

The repository is intentionally public. **Do not commit:**
- API keys or tokens of any kind
- Personal or client email addresses not already on the public site
- Unpublished drafts you're not ready to share

The GitHub Actions workflow uses `GITHUB_TOKEN` which is automatically provided by GitHub, no manual secrets configuration needed.

---

## 7. Removed Pages

`/blog/` no longer exists as a listing. The home page carries every post in two columns, so a separate archive had nothing to do. `pages/blog.njk` is now a redirect stub that sends `/blog/` to `/`, keep it, or delete it and accept a 404 for anyone holding an old link.

`/tags/` stays. The by-topic view on the home page duplicates its columns, but `/tags/` is the only place carrying the per-topic RSS URLs and the OPML bundle.

---

## 8. Adding a New Tag

1. Add the tag to any post's frontmatter: `tags: [post, my-new-tag]`
2. Push to `main`
3. On the next build, automatically created:
   - Archive page: `/tag/my-new-tag/`
   - RSS feed: `/feeds/tags/my-new-tag/feed.xml`
   - Entry in the tag bar on all listing pages
   - Entry in the `/tags/` index grid

Zero config changes. Zero template changes.

---

## 9. Dependency Maintenance

```bash
npm update
```

Review the [Eleventy changelog](https://www.11ty.dev/docs/) before major version bumps, v3 to v4 may require config changes. All other dependencies (luxon, markdown-it, eleventy-plugin-rss) are stable and rarely break.

---

## 10. Search Console

After going live on the main domain:
1. Verify the property at [search.google.com/search-console](https://search.google.com/search-console)
2. Submit `https://pistolas.co.uk/sitemap.xml`
3. The sitemap includes all posts, tag pages, and fixed pages automatically
4. If `/blog/` was previously indexed, request removal, it is now a redirect

---

## 11. Local Development

Because the project lives on OneDrive, run the dev server from a copy in /tmp or another local path:

```bash
rsync -av --exclude=node_modules --exclude=public /path/to/pistolas-blog/ /tmp/pistolas-build/
cd /tmp/pistolas-build
npm install --cache /tmp/npm-cache
node node_modules/@11ty/eleventy/cmd.cjs --serve
```

Or better: clone the GitHub repo to a non-OneDrive location and work from there. Push changes to GitHub and pull them back into OneDrive if needed. Once the repo is on GitHub, you don't need to develop from the OneDrive copy.

The dev server runs at `http://localhost:8080` with live reload.
