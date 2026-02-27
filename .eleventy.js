const { DateTime } = require("luxon");
const pluginRSS = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {

  // --- Ignore reference files ---
  eleventyConfig.ignores.add("pistolas-style-direction.html");
  eleventyConfig.ignores.add("pistolas-build-prompt.md");

  // --- Plugins ---
  eleventyConfig.addPlugin(pluginRSS);

  // --- Passthrough copies ---
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy({ "pages/robots.txt": "robots.txt" });

  // --- Filters ---

  // Format date as "27 Feb 2026"
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("d LLL yyyy");
  });

  // ISO date for <time> datetime attribute
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toISO();
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
