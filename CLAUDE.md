# pistolas.co.uk

Personal site of Savva Pistolas. Eleventy v3 + Nunjucks, no bundler, no framework,
no third-party requests. Deploys from `main` via GitHub Actions to the `gh-pages`
branch, which GitHub Pages serves at pistolas.co.uk.

Read this before changing anything. The rules below were arrived at deliberately
and several of them were arrived at by getting them wrong first.

---

## 1. The direction

Refined Web 1: the **document web** of early academic and technical publishing:
CERN, RFCs, IBM manuals, Tufte handouts. Not the Geocities strand. Nostalgia is
not the point; the point is that this way of making pages was never fashionable,
so it cannot go out of fashion.

The failure mode to avoid at both ends:

- **Over-designed** reads as machine-generated. Editorial serif + sage green +
  uppercase letterspaced labels + hairline-everything is the house style of
  generated design. The site used to look like that.
- **Under-designed** reads as unfinished. Whitespace is not composition.

Structure should be drawn, not implied. Visible rules, real border-weight
hierarchy, one grid honoured absolutely.

---

## 2. Copy, the rule that matters most

**Never write, alter, edit, paraphrase, reword or trim Savva's copy. Not in
posts, not on pages, not in the hero, not anywhere.**

If a page needs words that do not exist yet, **ask for them**. Do not draft
something as a placeholder, do not "improve" a sentence, do not fix what looks
like a typo. This has been broken twice and both times it was the wrong call.

You may write:

- Field labels and controls: Name, Email, Message, Send, Search, Contents.
- Technical strings nobody reads as prose: `Sending`, `Not sent.`
- Code comments and commit messages.

Flag any of these to Savva so he can replace them if he wants.

Bug fixes to *links* inside posts are fine. The URL is not the copy. When a
link's destination no longer exists, say so rather than silently pointing it
somewhere plausible.

---

## 3. Hard bans

These are not preferences. Do not reintroduce them.

| Banned | Why |
|---|---|
| **Grey, in any form** | Hierarchy comes from size, weight, italic and rule. That is how it worked before tinted text existed. A grey is a hedge. |
| **Cream, tan, beige** | Ruined by generated design. The ground is white. |
| **Em dashes** | Anywhere in site chrome, titles, feed names, labels or new copy. Use a middot, a comma, or a full stop. Savva's own prose is his; leave it. |
| **All caps** | No `text-transform: uppercase`. Not for nav, not for labels, not for dates. |
| **Letter-spaced microlabels** | The `.14em` uppercase mono label is the single clearest generated-design tell. |
| **Rounded corners** | `border-radius: 0` is in the reset on `*, *::before, *::after`. No squircles, no pills, no soft cards. |
| **Eyebrows** | No kickers, no "PLATE 01", no numbered section markers, no captions explaining what the next block is. |
| **Monospace for headings** | Considered and rejected. Period-accurate, but it does not cohere with the subject matter. Mono is for `<code>` only. |
| **Third-party requests** | No CDN, no webfont, no analytics, no embedded script. The site currently makes zero. Keep it there. |
| **Webfonts** | Charter comes off the reader's own machine. |

---

## 4. Palette

Five values. That is the whole palette.

```css
--paper:   #FFFFFF   /* ground */
--ink:     #000000   /* text, rules */
--link:    #0000CC   /* the only clickable colour */
--visited: #551A8B   /* restored deliberately; useful on an archive, costs nothing */
--mark:    #CC0000   /* marks only */
```

Dark theme swaps these at token level in three places: bare `:root`,
`@media (prefers-color-scheme: dark)` guarded as `:root:not([data-theme="light"])`,
and `:root[data-theme="dark"]`. Never define a colour only inside a media block.

**Red is not a link and never decorative.** It marks one thing per view: the
hovered row, the blockquote rail, the current nav item, an invalid field, the
`404`. Its scarcity is what makes it read as an instrument marking.

Black fields, the masthead and the footer, hardcode `#000` and `#FFF` because
they are black in both themes.

---

## 5. Type

- **Charter** for headings and body, falling back through Bitstream Charter,
  Sitka Text, Cambria, Georgia, Times New Roman.
- One family throughout. Contrast comes from size, weight and italic.
- Mono (`--code`) for `<code>` and the keys panel only.
- Measure: 62ch for prose, 66ch when there is no margin column, 92ch frame.

**Dates are UK format**, produced by the `readableDate` filter as `d LLL yyyy`,
"8 Mar 2026". Never ISO, never US.

British spelling throughout: colour, organisation, recognise.

---

## 6. Rules and weights

Four weights, each meaning something:

| Weight | Meaning |
|---|---|
| `3px solid ink` | Major break. Under the masthead, above the first paragraph of a post. Two per page maximum. |
| `3px double ink` | Section boundary. End of article, footer edge. |
| `1px solid ink` | Separation. List rows, table rows, field borders. |
| `2px or 3px solid mark` | Attribution. Blockquote rail, current item. Nothing else. |

---

## 7. Motion

Motion is **mechanism, not ambience**. Nothing floats, glows, drifts or
ambiently animates. Everything respects `prefers-reduced-motion`.

What exists, all vanilla, all in `assets/js/site.js`:

- **Header painting effect.** The picture resolves into its own colours as
  characters inside a disc that drags a viscous trail behind the pointer. Cells
  are filled with their own paint held back and the glyph drawn in that paint
  lifted, **no white wash**, because a white overlay reads as a filter laid on
  top rather than the picture resolving into itself. Contrast is adaptive: dark
  paint gets a lifted glyph, light paint a sunk one, so it works on any painting.
  On leaving the band it settles over ~1.5s rather than snapping off.
- **Click spark.** Eight ink strokes, 380ms.
- Nothing else. Title scrambling on hover was tried and removed: it obscured the
  reader's view.

Everything is progressive enhancement. With the script blocked the page keeps
its painting, both index views, the contact form and every link.

---

## 8. Page weight

The home page is **83.7KB uncompressed** and sits in the 512KB Club green tier
(under 100KB) and well inside 1MB Club. **Treat 100KB as a budget, not a record.**

Note the clubs measure *one page and what it loads*, uncompressed, not the
build. The 1.4MB build total is not a number any visitor experiences, and is not
worth degrading full-text RSS to reduce.

Rules for keeping it there:

- **Size every image to its slot.** Prose column is 62ch, about 530 CSS px, so
  1060px covers a 2x display exactly. Images set to `width="300"` in a post need
  600px. Anything larger is bytes nobody sees.
- **WebP, not JPEG.** At matched resolution it is under half the weight with no
  visible difference. Both paintings are WebP q82.
- Post images get `loading="lazy"` and `decoding="async"` automatically via the
  `lazyImages` transform. The header painting is excluded because it is above
  the fold on every page.
- CSS and JS are minified in `eleventy.after`, not by a transform, because `assets/` is
  a passthrough copy and transforms never see it. **Source files stay readable.**
  The JS pass strips block comments and indentation only, then parses the result
  and throws if it broke.

---

## 9. How the pieces work

**Paintings** are set in `_data/paintings.js` as `header` and `lost`, each with
`src` and `credit`. The footer attribution is assembled from whatever
`data-credit` attributes are on the page, so a swap is one file and nothing else
needs editing. Header images must be cropped to roughly **6.2:1** and served from
this domain, because the effect reads their pixels back off a canvas and a
cross-origin image throws. The script catches that and leaves the painting alone,
so the page still works. The not-found painting has neither constraint.

**Navigation** comes from `site.navLinks` in `_data/site.js`. Adding a link there
puts it in the masthead automatically; the footer is a separate list in
`_includes/partials/footer.njk`.

**The index** is two flowed columns (`columns: 2`, not a grid, because a grid aligns
rows and leaves ragged gaps) with a toggle between most recent and by topic. Both
views ship in the markup and JavaScript hides one, so with the script blocked the
page shows both rather than neither.

**`.outset`** lets a figure hang out of the measure into the margin. `--out` is
how far it wants to lean, `--out-max` how much room the layout has: 130px on
`.post--plain`, 24px (the gutter only) on an article with a contents column, zero
below 900px. Add the class to any figure; it leans as far as there is space and
never slides under the contents list.

**`.post--plain`** is applied when an article has no `h2` headings and no tags,
so it does not reserve an empty 22ch margin column.

**Custom filters** in `.eleventy.js`: `readableDate`, `isoDate`, `readingTime`,
`byTag`, `limit`, `displayTags`, `without`, `byCount`, `addHeadingIds`,
`headings`. The last two derive `h2` ids without pulling in markdown-it-anchor.

**Removed pages:** `/blog/` is a redirect stub to `/`; the home page carries
every post. `/tags/` stays, because the by-topic view duplicates its columns, but it is
the only page carrying per-topic RSS URLs and the OPML bundle.

---

## 10. Before you say it is done

- **Run commands from the repo root.** Shell cwd persists between calls. Editing
  `assets/css/style.css` from inside `public/` writes to the build output and
  silently loses the change.
- **Build and look at it in a browser.** Not a diff, not a grep. Render the page
  and check it. Several bugs in this repo's history were invisible in source and
  obvious on screen.
- **Check the whole set**, not just the page you touched: home, a post, `/tags/`,
  a tag archive, `/about/`, `/contact/`, `/404.html`.
- **Check for broken internal links** across the built output.
- Deploying is a push to `main`, which goes live immediately at pistolas.co.uk.
  Confirm before merging unless explicitly told to ship.
- Report what actually happened. If something is untested, say so.
