import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const articleUrl = new URL(
  "../articles/claude-text-watermark/index.html",
  import.meta.url,
);

test("Claude watermark article exposes metadata and semantic landmarks", async () => {
  const html = await readFile(articleUrl, "utf8");
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<title>How Claude’s Text Watermark Works/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/xiemeimeiaaa\.github\.io\/articles\/claude-text-watermark\/"/,
  );
  assert.match(html, /<main[^>]*>/);
  assert.match(html, /<article class="article-page" lang="en">/);
  assert.match(html, /<h1 class="article-title">/);
  assert.match(html, /<link rel="stylesheet" href="\/styles\.css">/);
  assert.match(html, /<script type="module" src="\/script\.js"><\/script>/);
  assert.match(html, /href="https:\/\/github\.com\/xiemeimeiaaa"/);
});

test("Claude watermark article preserves the approved six-part structure", async () => {
  const html = await readFile(articleUrl, "utf8");
  const ids = [
    "quick-overview",
    "how-watermarking-works",
    "detecting-claude-text",
    "limitations",
    "other-output-formats",
    "why-watermark",
  ];
  const positions = ids.map((id) => html.indexOf(`id="${id}"`));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});

test("Claude watermark article preserves the source announcement framing", async () => {
  const html = await readFile(articleUrl, "utf8");
  const normalized = html.replace(/\s+/g, " ");
  assert.match(
    normalized,
    /In August 2026, Anthropic announced that future Claude models would add a watermark to the text they generate\./,
  );
  assert.match(
    normalized,
    /a statistical pattern distributed across many token choices/i,
  );
});

test("Claude watermark article uses the localized shared navigation and footer", async () => {
  const html = await readFile(articleUrl, "utf8");
  assert.match(
    html,
    /<a class="back-link" href="\/#articles" data-i18n="articlesNav">Articles<\/a>/,
  );
  assert.match(html, /<p data-i18n="footer">More writing will appear here over time\.<\/p>/);
  assert.match(html, /<a href="\/#articles" data-i18n="articlesNav">Articles<\/a>/);
});

test("Claude watermark article keeps source examples and primary references", async () => {
  const html = await readFile(articleUrl, "utf8");
  for (const requiredText of [
    "The weather today was cold and…",
    "Isaac Newton’s most famous work was called Principia…",
    "What is the likelihood this was partly written by Claude?",
    "2 + 2 =",
  ]) {
    assert.match(html, new RegExp(requiredText.replaceAll("+", "\\+")));
  }
  assert.match(html, /https:\/\/www\.anthropic\.com\/news\/claude-text-watermark/);
  assert.match(html, /https:\/\/www\.nature\.com\/articles\/s41586-024-08025-4/);
  assert.match(html, /https:\/\/magazine\.sebastianraschka\.com\/p\/claude-watermarking/);
});
