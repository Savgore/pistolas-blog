const { DateTime } = require("luxon");
const pluginRSS = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {

  // --- Ignore reference files ---
  eleventyConfig.ignores.add("pistolas-style-direction.html");
  eleventyConfig.ignores.add("pistolas-build-prompt.md");
  eleventyConfig.ignores.add("HANDOFF.md");
  eleventyConfig.ignores.add("og-generator.html");
  // --- Plugins ---
  eleventyConfig.addPlugin(pluginRSS);

  // --- Passthrough copies ---
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy({ "pages/robots.txt": "robots.txt" });

  // --- Filters ---

  // Format date as "27 Feb 2026" — returns "undated" if date is missing or invalid
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    if (!dateObj) return "undated";
    const dt = DateTime.fromJSDate(dateObj, { zone: "utc" });
    return dt.isValid ? dt.toFormat("d LLL yyyy") : "undated";
  });

  // ISO date for <time> datetime attribute — returns empty string if date is missing or invalid
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    if (!dateObj) return "";
    const dt = DateTime.fromJSDate(dateObj, { zone: "utc" });
    return dt.isValid ? dt.toISO() : "";
  });

  // Estimate reading time from content string
  eleventyConfig.addFilter("readingTime", (content) => {
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200);
  });

  // Filter a post collection by a single tag string
  eleventyConfig.addFilter("byTag", (posts, tag) => {
    return posts.filter(p => (p.data.tags || []).includes(tag));
  });

  // Limit array length
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  // Return display tags — all tags minus system tags
  eleventyConfig.addFilter("displayTags", (tags) => {
    return (tags || []).filter(t => !["post", "posts"].includes(t));
  });

  // Drop the current page from a post collection
  eleventyConfig.addFilter("without", (posts, url) => {
    return posts.filter(p => p.url !== url);
  });

  // Sort tags by how many posts carry them, heaviest first, then alphabetically
  eleventyConfig.addFilter("byCount", (tags, posts) => {
    const count = (t) => posts.filter(p => (p.data.tags || []).includes(t)).length;
    return [...tags].sort((a, b) => count(b) - count(a) || a.localeCompare(b));
  });

  // --- Section headings ---
  // markdown-it does not emit ids, so derive them here rather than adding a
  // plugin. `addHeadingIds` stamps them onto the rendered HTML and `headings`
  // reads the same list out for the contents column. Both use one slug rule.
  const slugify = (s) => s
    .replace(/<[^>]+>/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  eleventyConfig.addFilter("addHeadingIds", (html) => {
    return (html || "").replace(/<h2>([\s\S]*?)<\/h2>/g,
      (m, inner) => `<h2 id="${slugify(inner)}">${inner}</h2>`);
  });

  eleventyConfig.addFilter("headings", (html) => {
    const out = [];
    const re = /<h2>([\s\S]*?)<\/h2>/g;
    let m;
    while ((m = re.exec(html || ""))) {
      out.push({ id: slugify(m[1]), text: m[1].replace(/<[^>]+>/g, "") });
    }
    return out;
  });

  // --- Transforms ---

  // Defer images a reader may never scroll to. `loading="lazy"` never delays
  // an image already in the viewport, so this is safe everywhere except the
  // header painting, which is above the fold on every page and stays eager.
  eleventyConfig.addTransform("lazyImages", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    return content.replace(
      /<img (?![^>]*\bloading=)(?![^>]*id="painting")/g,
      '<img loading="lazy" decoding="async" '
    );
  });

  // --- Collections ---

  // All posts, newest first
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // All unique content tags across all posts, sorted alphabetically.
  // Excludes system tags. This is the single source of truth for tag
  // pages, tag bar, and RSS feeds. No topic names are hardcoded here.
  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tagSet = new Set();
    collectionApi.getFilteredByGlob("posts/*.md").forEach(item => {
      (item.data.tags || []).forEach(tag => {
        if (!["post", "posts"].includes(tag)) tagSet.add(tag);
      });
    });
    return [...tagSet].sort();
  });

  // --- Markdown config ---
  const markdownIt = require("markdown-it");
  const md = markdownIt({
    html: true,
    breaks: false,
    linkify: true,
    typographer: true,
  });
  eleventyConfig.setLibrary("md", md);

  // --- Layout aliases ---
  eleventyConfig.addLayoutAlias("base", "layouts/base.njk");
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");
  eleventyConfig.addLayoutAlias("tag", "layouts/tag.njk");

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "public",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
