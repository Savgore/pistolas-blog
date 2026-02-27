---
title: "How to write and publish on this site"
date: 2026-02-27
description: "A working reference for creating posts, using all available formatting, adding images, and understanding how the site is structured."
tags:
  - post
  - now
permalink: /blog/writing-guide/
og_image: /assets/og-default.png
---

<!-- AUTHOR: This is a formatting reference — keep it, delete it, or publish it as-is. -->

This post is a working reference for writing on this site. It shows every formatting option available, explains how to upload and reference images, and walks through publishing a post from scratch.

## Publishing a post

Every post is a Markdown file in the `posts/` folder. The filename sets nothing — the `permalink` in the frontmatter is what determines the URL.

**Steps:**

1. Create `posts/YYYY-MM-DD-your-slug.md`
2. Add frontmatter (see below)
3. Write the body in Markdown
4. `git add -A && git commit -m "post: title" && git push`
5. GitHub Actions builds and deploys — live in about 30 seconds

## Frontmatter reference

Every post starts with a YAML frontmatter block between `---` markers:

```yaml
---
title: "Your post title"
date: 2026-02-27
description: "One or two sentences. This appears as the article subtitle and in social previews. Keep it under 160 characters."
tags:
  - post
  - security
permalink: /blog/your-slug/
og_image: /assets/og-default.png
---
```

The `post` tag is required — it's how Eleventy identifies blog posts. Everything else after it is a topic tag of your choosing.

The **first topic tag** (the one after `post`) is the one shown as the primary label on post list items. Choose it deliberately.

`permalink` should match your intended URL. For migrated posts, it must match the original BearBlog URL exactly.

`og_image` is optional — falls back to `/assets/og-default.png` if omitted.

## Tags

Tags are the only taxonomy. Some conventions:

- Lowercase only: `security`, `systems`, `ai`, not `Security`
- Hyphens for multi-word: `ai-safety`, not `ai safety`
- Every tag automatically gets an archive page at `/tag/[tag]/` and an RSS feed at `/feeds/tags/[tag]/feed.xml`
- No config changes needed — just use a tag in frontmatter and it exists

## Adding images

Store images in `/assets/posts/your-slug/`:

```
assets/
  posts/
    your-slug/
      diagram.png
      screenshot.png
      og.png          ← social thumbnail (1200×630px)
```

Reference in Markdown:

```markdown
![A description of what the image shows](/assets/posts/your-slug/diagram.png)
```

The CSS applies a border to all in-post images automatically — don't bake borders into the image file itself.

For a figure with a caption:

```html
<figure>
  <img src="/assets/posts/your-slug/diagram.png" alt="Diagram showing system hierarchy">
  <figcaption>Fig. 1 — System hierarchy, simplified.</figcaption>
</figure>
```

**OG/social thumbnail:** save at `assets/posts/your-slug/og.png` (1200×630px) and set `og_image: /assets/posts/your-slug/og.png` in frontmatter. If you skip this, the default fallback image is used.

## Formatting reference

Everything below is a live demonstration of what the site can render.

---

### Headings

Use `##` for main sections within a post, `###` for subsections. Only one `h1` per page (the post title), so start at `##` in the body.

### Paragraph text

Body copy is set in Lora at 1.05rem with a generous line height. It reads comfortably at the 680px content width. Write in full paragraphs — the spacing comes from the CSS, not from extra blank lines.

### Links

Links are styled in olive green with a subtle underline: [an example link](https://pistolas.co.uk). They darken on hover.

### Bold and italic

Use **bold** for genuine emphasis — a key term introduced for the first time, a warning, a name. Use *italic* for titles, technical terms, or soft stress. Avoid using either for decoration.

### Blockquote

> The problem isn't with the controls themselves — patch management, MFA, network boundaries. The problem is in what counts as evidence.

Use blockquotes for quotations, not for pull quotes or general emphasis. The olive left border is the visual signal.

### Inline code

Use `inline code` for command names, file paths, variable names, frontmatter keys, and short snippets. Renders in Source Code Pro with an olive colour and a rule border.

### Code block

A fenced code block with a language identifier:

```javascript
const { DateTime } = require("luxon");

eleventyConfig.addFilter("readableDate", (dateObj) => {
  if (!dateObj) return "undated";
  const dt = DateTime.fromJSDate(dateObj, { zone: "utc" });
  return dt.isValid ? dt.toFormat("d LLL yyyy") : "undated";
});
```

```bash
git add -A && git commit -m "post: my post title" && git push
```

### Unordered list

- First item
- Second item
- Third item with a longer line that wraps — the list formatting handles this correctly

### Ordered list

1. Install dependencies: `npm install`
2. Run the dev server: `npm run start`
3. Open `http://localhost:8080`

### Horizontal rule

Use sparingly — to mark a major tonal or temporal shift within a long post.

---

Above is a horizontal rule (`---` on its own line).

## Local development

Clone the repo to a path **outside OneDrive** (important — OneDrive blocks node_modules execution):

```bash
git clone https://github.com/Savgore/pistolas-blog ~/Sites/pistolas-blog
cd ~/Sites/pistolas-blog
npm install
npm start
```

The dev server runs at `http://localhost:8080` with live reload. Edit any file and the browser refreshes automatically.

To build the static output without serving:

```bash
npm run build
```

Output goes to `public/`. This folder is gitignored and never committed — GitHub Actions builds it fresh on every push to main.
