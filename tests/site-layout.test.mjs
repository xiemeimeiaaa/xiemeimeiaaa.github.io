import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const sharedStyles = await readFile(new URL("../styles.css", import.meta.url), "utf8");

const pages = await Promise.all(
  [
    "../index.html",
    "../articles/transformer-inference-kv-cache/index.html",
    "../articles/transformer-llms-for-beginners/index.html",
  ].map(async (path) => ({
    path,
    html: await readFile(new URL(path, import.meta.url), "utf8"),
  })),
);

test("every page uses the shared site chrome and assets", () => {
  for (const { path, html } of pages) {
    assert.match(html, /<link rel="stylesheet" href="\/styles\.css">/, path);
    assert.match(html, /<script type="module" src="\/script\.js"><\/script>/, path);
    assert.match(
      html,
      /class="site-name"[^>]*data-i18n="siteName"[^>]*>XIE MEI \/ 谢媚<\/a>/,
      path,
    );
    assert.match(html, /class="site-nav"/, path);
    assert.match(html, /data-i18n-aria="primaryNavAria"/, path);
    assert.match(html, /data-language-switch/, path);
  }
});

test("both articles use the same shared article template", () => {
  for (const { path, html } of pages.slice(1)) {
    assert.match(html, /<main id="article-content" class="site-shell article-main">/, path);
    assert.match(html, /<article class="article-page" lang="en">/, path);
    assert.match(html, /<header class="article-header">/, path);
    assert.match(html, /<h1 class="article-title"/, path);
    assert.match(html, /<div class="article-meta">/, path);
  }
});

test("the shared header stacks at narrow phone widths", () => {
  assert.match(sharedStyles, /@media \(max-width: 360px\)[\s\S]*?\.header-inner\s*{[\s\S]*?flex-direction:\s*column/);
});

test("profile uses a circular focal crop and responsive stacking", () => {
  assert.match(sharedStyles, /\.profile-intro\s*{[\s\S]*?display:\s*grid/);
  assert.match(sharedStyles, /\.profile-portrait\s*{[\s\S]*?border-radius:\s*50%/);
  assert.match(sharedStyles, /\.profile-portrait\s*{[\s\S]*?object-fit:\s*cover/);
  assert.match(sharedStyles, /\.profile-portrait\s*{[\s\S]*?object-position:/);
  assert.match(
    sharedStyles,
    /@media \(max-width: 640px\)[\s\S]*?\.profile-intro\s*{[\s\S]*?grid-template-columns:\s*1fr/,
  );
});
