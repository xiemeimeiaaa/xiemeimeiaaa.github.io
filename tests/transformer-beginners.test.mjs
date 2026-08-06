import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const articleUrl = new URL(
  "../articles/transformer-llms-for-beginners/index.html",
  import.meta.url,
);

const assetNames = [
  "01-qkv-matching.png",
  "02-scaled-dot-product-attention.png",
  "03-multi-head-attention.png",
  "04-residual-connections-and-mlp.png",
  "05-final-norm-and-lm-head.png",
  "06-next-token-loss.png",
  "07-backpropagation-and-parameter-update.png",
];

test("migrated article exposes its canonical route and semantic landmarks", async () => {
  const html = await readFile(articleUrl, "utf8");
  assert.match(html, /<html\b[^>]*\blang="en"/);
  assert.match(html, /<title>Transformer LLMs for Beginners<\/title>/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/xiemeimeiaaa\.github\.io\/articles\/transformer-llms-for-beginners\/"/,
  );
  assert.match(
    html,
    /property="og:url" content="https:\/\/xiemeimeiaaa\.github\.io\/articles\/transformer-llms-for-beginners\/"/,
  );
  assert.match(html, /<main\b[^>]*>/);
  assert.match(html, /<article\b[^>]*>/);
});

test("migrated article returns readers to the main library", async () => {
  const html = await readFile(articleUrl, "utf8");
  assert.match(
    html,
    /<a\b[^>]*class="home-link"[^>]*href="\/"[^>]*>返回主页 \/ Back to Library<\/a>/,
  );
});

test("migrated article references all seven local diagrams with alt text", async () => {
  const html = await readFile(articleUrl, "utf8");
  for (const name of assetNames) {
    assert.match(html, new RegExp(`assets/${name}`));
  }

  const imageTags = html.match(/<img\b[^>]*>/g) ?? [];
  assert.equal(imageTags.length, 7);
  assert.ok(imageTags.every((tag) => /\balt="[^"]+"/.test(tag)));
});

test("all seven migrated article diagrams exist", async () => {
  for (const name of assetNames) {
    await access(
      new URL(
        `../articles/transformer-llms-for-beginners/assets/${name}`,
        import.meta.url,
      ),
    );
  }
});
