import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("homepage links to both Transformer articles", () => {
  assert.match(
    html,
    /href="articles\/transformer-llms-for-beginners\/"/,
  );
  assert.doesNotMatch(
    html,
    /href="https:\/\/xiemeimeiaaa\.github\.io\/transformer-llms-for-beginners\/"/,
  );
  assert.match(html, /articles\/transformer-inference-kv-cache\//);
  assert.equal((html.match(/class="post-entry"/g) ?? []).length, 2);
  assert.doesNotMatch(html, /class="article-card"/);
});

test("post list exposes localized copy and accessible labels", () => {
  for (const key of [
    "article2Title",
    "article2Summary",
    "article2Aria",
    "article2ReadingTime",
    "article2Date",
  ]) {
    assert.match(html, new RegExp(`data-i18n(?:-aria)?="${key}"`));
  }
});
