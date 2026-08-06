import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const articleUrl = new URL(
  "../articles/transformer-inference-kv-cache/index.html",
  import.meta.url,
);

test("article exposes metadata and semantic landmarks", async () => {
  const html = await readFile(articleUrl, "utf8");
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<title>How Transformer LLMs Generate Text:/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/xiemeimeiaaa\.github\.io\/articles\/transformer-inference-kv-cache\/"/,
  );
  assert.match(html, /<main[^>]*>/);
  assert.match(html, /<article class="article-page" lang="en">/);
  assert.match(html, /<h1 class="article-title">/);
  assert.doesNotMatch(html, /class="contents-panel"/);
});

test("article links to the internal Transformer beginners prerequisite", async () => {
  const html = await readFile(articleUrl, "utf8");
  assert.match(
    html,
    /href="\/articles\/transformer-llms-for-beginners\/"/,
  );
  assert.doesNotMatch(
    html,
    /href="https:\/\/xiemeimeiaaa\.github\.io\/transformer-llms-for-beginners\/"/,
  );
});

test("article preserves the source section order", async () => {
  const html = await readFile(articleUrl, "utf8");
  const ids = [
    "prefill-and-decode",
    "prefill",
    "decode",
    "compute-savings",
    "memory-cost",
    "mha-gqa-mqa",
    "cached-token-pricing",
    "prompt-caching",
    "openai-prompt-caching",
    "improving-cache-hit-rate",
    "cache-breaking-patterns",
  ];
  const positions = ids.map((id) => html.indexOf(`id="${id}"`));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});

test("article references three English illustrations with alt text", async () => {
  const html = await readFile(articleUrl, "utf8");
  for (const name of [
    "qkv-relationship.png",
    "mha-gqa-mqa.png",
    "system-prompt-layout.png",
  ]) {
    assert.match(html, new RegExp(`assets/${name}`));
  }
  const imageTags = html.match(/<img\b[^>]*>/g) ?? [];
  assert.equal(imageTags.length, 3);
  assert.ok(imageTags.every((tag) => /\balt="[^"]+"/.test(tag)));
});

test("all referenced article illustrations exist", async () => {
  for (const name of [
    "qkv-relationship.png",
    "mha-gqa-mqa.png",
    "system-prompt-layout.png",
  ]) {
    await access(
      new URL(
        `../articles/transformer-inference-kv-cache/assets/${name}`,
        import.meta.url,
      ),
    );
  }
});

test("article retains the source derivations and worked examples", async () => {
  const html = await readFile(articleUrl, "utf8");
  const normalized = html.replace(/\s+/g, " ");
  for (const requiredText of [
    "12 MACs",
    "128 KiB per token",
    "512 MiB",
    "2 GiB",
    "3.125%",
    "cached input tokens",
    "total input tokens",
  ]) {
    assert.match(normalized, new RegExp(requiredText.replace("%", "\\%"), "i"));
  }
});

test("provider-specific claims link to primary documentation", async () => {
  const html = await readFile(articleUrl, "utf8");
  assert.match(
    html,
    /https:\/\/developers\.openai\.com\/api\/docs\/guides\/prompt-caching/,
  );
  assert.match(
    html,
    /https:\/\/developers\.openai\.com\/api\/docs\/models\/gpt-5\.6-sol/,
  );
  assert.match(
    html,
    /https:\/\/learn\.chatgpt\.com\/docs\/pricing/,
  );
  assert.match(
    html,
    /https:\/\/claude\.com\/blog\/lessons-from-building-claude-code-prompt-caching-is-everything/,
  );
});
