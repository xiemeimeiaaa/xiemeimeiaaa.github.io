# Transformer Inference English Article Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a faithful, polished English edition of the Transformer inference and KV-cache article at `/articles/transformer-inference-kv-cache/`, expose it from the bilingual homepage, and verify the deployed GitHub Pages result.

**Architecture:** The main GitHub Pages repository remains a dependency-free static site. The new article is a self-contained route with its own HTML, stylesheet, small navigation script, and local assets; homepage copy stays in the existing `translations` object. Node's built-in test runner validates content structure and language-key parity, while browser-based visual checks cover responsive layout and image legibility.

**Tech Stack:** Semantic HTML5, CSS, vanilla JavaScript ES modules, MathJax 4 from jsDelivr, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- Publish at `https://xiemeimeiaaa.github.io/articles/transformer-inference-kv-cache/`.
- Preserve the source article's order, equations, numerical examples, tables, and illustration placement.
- Write idiomatic English technical prose without mirroring Chinese sentence structure.
- Make only minimal structural edits required for readability or technical correctness.
- Verify time-sensitive OpenAI claims against official OpenAI sources immediately before publication.
- Distinguish in-request KV cache, cross-request prompt caching, and product-specific billing.
- Keep the first article at its existing URL; migrating it is outside scope.
- Store all new article images in `articles/transformer-inference-kv-cache/assets/`.
- Keep the repository dependency-free; do not add npm packages.

---

## File Structure

- Create `articles/transformer-inference-kv-cache/index.html`: semantic article content, metadata, equations, tables, references, and navigation landmarks.
- Create `articles/transformer-inference-kv-cache/styles.css`: article-only typography, table of contents, responsive tables/equations/images, and mobile navigation.
- Create `articles/transformer-inference-kv-cache/script.js`: current-section tracking for article navigation with safe no-JavaScript fallback.
- Create `articles/transformer-inference-kv-cache/assets/qkv-relationship.png`: existing English Q/K/V illustration copied under a web-safe name.
- Create `articles/transformer-inference-kv-cache/assets/mha-gqa-mqa.png`: English MHA/GQA/MQA comparison illustration.
- Create `articles/transformer-inference-kv-cache/assets/system-prompt-layout.png`: existing English prompt-layout illustration copied under a web-safe name.
- Create `tests/article-content.test.mjs`: dependency-free assertions for article structure, assets, metadata, source links, and navigation targets.
- Modify `index.html`: add the new article card and update the section label/count.
- Modify `script.js`: add paired English/Chinese translation keys for both cards and the new count.
- Modify `tests/language.test.mjs`: assert translation parity and the new article copy.
- Modify `README.md`: document the internal article route and local validation commands.

---

### Task 1: Add a Tested Second Article Card to the Homepage

**Files:**
- Modify: `index.html:44-74`
- Modify: `script.js:1-39`
- Modify: `tests/language.test.mjs:24-70`
- Create: `tests/homepage-content.test.mjs`

**Interfaces:**
- Consumes: `applyLanguage(root, language)` and `translations` from `script.js`.
- Produces: the internal URL `/articles/transformer-inference-kv-cache/` and translation keys `article2Title`, `article2Summary`, `article2Aria`, `article2ReadingTime`, and `article2Date`.

- [ ] **Step 1: Write failing homepage structure and translation tests**

Create `tests/homepage-content.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("homepage links to both Transformer articles", () => {
  assert.match(html, /transformer-llms-for-beginners\//);
  assert.match(html, /articles\/transformer-inference-kv-cache\//);
  assert.equal((html.match(/class="article-card"/g) ?? []).length, 2);
});

test("new article card exposes localized copy and an accessible label", () => {
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
```

In `tests/language.test.mjs`, extend `expectedKeys` with the five keys above, change both locale counts to `2 articles` / `2 篇文章`, and add:

```js
test("both locales describe the inference article", () => {
  assert.equal(
    translations.en.article2Title,
    "How Transformer LLMs Generate Text",
  );
  assert.equal(translations.zh.article2Title, "Transformer LLM 如何生成文本");
  assert.match(translations.en.article2Summary, /Prefill.*Decode.*KV cache/i);
  assert.match(translations.zh.article2Summary, /Prefill.*Decode.*KV Cache/i);
});
```

- [ ] **Step 2: Run the tests and confirm the intended failures**

Run:

```bash
node --test tests/language.test.mjs tests/homepage-content.test.mjs
```

Expected: failures for the missing second card, missing `article2*` keys, and old article counts.

- [ ] **Step 3: Add bilingual copy and the second card**

Update `script.js` so both locale objects have matching keys. Use this English copy:

```js
count: "2 articles",
article2Date: "AUG 2026",
article2ReadingTime: "18 MIN READ",
article2Title: "How Transformer LLMs Generate Text",
article2Summary: "Prefill, Decode, the KV cache, and prompt caching—from compute savings to memory trade-offs.",
article2Aria: "Read “How Transformer LLMs Generate Text”",
```

Use this Chinese copy:

```js
count: "2 篇文章",
article2Date: "2026年8月",
article2ReadingTime: "阅读约 18 分钟",
article2Title: "Transformer LLM 如何生成文本",
article2Summary: "从 Prefill、Decode 与 KV Cache，到计算节省、显存代价和 Prompt Cache。",
article2Aria: "阅读《Transformer LLM 如何生成文本》",
```

Change the section heading from singular `Latest article` / `最新文章` to `Articles` / `文章`. Insert the new card before the existing training article so the newest publication appears first. Its link must be relative:

```html
href="articles/transformer-inference-kv-cache/"
```

- [ ] **Step 4: Run homepage tests**

Run:

```bash
node --test tests/language.test.mjs tests/homepage-content.test.mjs
```

Expected: all tests pass.

- [ ] **Step 5: Commit the homepage card**

```bash
git add index.html script.js tests/language.test.mjs tests/homepage-content.test.mjs
git commit -m "Add Transformer inference article card"
```

---

### Task 2: Create the Article Contract and Navigation Tests

**Files:**
- Create: `tests/article-content.test.mjs`
- Create: `articles/transformer-inference-kv-cache/index.html`
- Create: `articles/transformer-inference-kv-cache/styles.css`
- Create: `articles/transformer-inference-kv-cache/script.js`

**Interfaces:**
- Consumes: homepage route `/articles/transformer-inference-kv-cache/` from Task 1.
- Produces: stable section IDs `prefill-and-decode`, `prefill`, `decode`, `compute-savings`, `memory-cost`, `mha-gqa-mqa`, `cached-token-pricing`, `prompt-caching`, `openai-prompt-caching`, `improving-cache-hit-rate`, and `cache-breaking-patterns`; asset URLs consumed by Task 4.

- [ ] **Step 1: Write a failing article contract test**

Create `tests/article-content.test.mjs` using `node:fs/promises`. It must assert:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const articleUrl = new URL(
  "../articles/transformer-inference-kv-cache/index.html",
  import.meta.url,
);

test("article exposes metadata and semantic landmarks", async () => {
  const html = await readFile(articleUrl, "utf8");
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<title>How Transformer LLMs Generate Text:/);
  assert.match(html, /rel="canonical" href="https:\/\/xiemeimeiaaa\.github\.io\/articles\/transformer-inference-kv-cache\/"/);
  assert.match(html, /<main[^>]*>/);
  assert.match(html, /<article[^>]*>/);
  assert.match(html, /<nav[^>]*aria-label="Article contents"/);
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
  assert.equal((html.match(/<img /g) ?? []).length, 3);
  assert.doesNotMatch(html, /<img(?![^>]*alt=)/);
});
```

Also assert that the article links to the training article, the OpenAI prompt-caching documentation, the OpenAI pricing page used for the dated provider note, and Anthropic's Claude Code prompt-caching article.

- [ ] **Step 2: Run the contract test and confirm it fails**

Run:

```bash
node --test tests/article-content.test.mjs
```

Expected: failure because the new article files and assets do not exist.

- [ ] **Step 3: Add the semantic page shell and navigation behavior**

Create `index.html` with:

- `lang="en"`, UTF-8, responsive viewport, description, canonical URL, Open Graph title/description/type/url, and theme color;
- a skip link to `#article-content`;
- a site header linking to `/` with `Back to Library`;
- a title block containing the final title, an `LLM Inference` eyebrow, `August 2026`, and the short abstract from the design;
- a desktop table of contents using the exact IDs in the interface above;
- `<main id="article-content"><article>…</article></main>`;
- MathJax 4 loaded with `defer` from `https://cdn.jsdelivr.net/npm/mathjax@4/tex-chtml.js`;
- local `styles.css` and deferred module `script.js`.

Implement `script.js` with `IntersectionObserver` so the visible heading's table-of-contents link receives `aria-current="location"`. Guard the observer setup so the article remains fully navigable if the API is unavailable.

- [ ] **Step 4: Add focused responsive article styling**

Create CSS tokens and layouts matching the homepage's cool blue-gray palette. Required behavior:

- body text width no more than `760px`;
- desktop two-column layout with a sticky table of contents at widths above `1100px`;
- single-column layout below `1100px`;
- `.table-wrap` and `.math-block` use horizontal scrolling instead of widening the viewport;
- images use `max-width: 100%; height: auto;`;
- focus-visible outlines are present;
- animations/transitions are disabled under `prefers-reduced-motion: reduce`;
- print styles hide navigation and expand content to page width.

- [ ] **Step 5: Run the article shell contract test**

Run:

```bash
node --test tests/article-content.test.mjs
```

Expected: all article shell and content-contract checks pass. Asset existence is added as a separate failing test in Task 4.

- [ ] **Step 6: Commit the tested article shell**

```bash
git add articles/transformer-inference-kv-cache/index.html articles/transformer-inference-kv-cache/styles.css articles/transformer-inference-kv-cache/script.js tests/article-content.test.mjs
git commit -m "Build Transformer inference article shell"
```

---

### Task 3: Verify Sources and Write the Faithful English Article

**Files:**
- Modify: `articles/transformer-inference-kv-cache/index.html`
- Reference only: `../../Careers/How Transformer LLMs Work - 推理与 KV Cache.md` from the workspace root

**Interfaces:**
- Consumes: section IDs and semantic shell from Task 2.
- Produces: final prose, equations, tables, figure captions, and dated source links used by content tests and visual QA.

- [ ] **Step 1: Verify time-sensitive provider claims using primary sources**

Consult current official OpenAI documentation only for OpenAI product behavior. Record the publication-check date as `August 3, 2026` in the provider-specific note. Verify, rather than assume:

- minimum cacheable prefix length by current model family;
- implicit and explicit cache-breakpoint behavior;
- `prompt_cache_key` routing guidance and any documented traffic guidance;
- token-usage field names for cache writes and reads;
- current API cached-input and cache-write pricing;
- whether Codex credits use a separate rate card and whether cache writes consume credits.

Use the official Anthropic engineering post `Lessons from building Claude Code: Prompt caching is everything` for the closing engineering example. Do not use third-party summaries for vendor-specific behavior.

- [ ] **Step 2: Translate the Prefill and Decode sections**

Write the opening, prerequisite link, `prefill-and-decode`, `prefill`, and `decode` sections in the original order. Preserve:

- the prompt example, translated as `I  like  eating  apples`;
- the layer-by-layer prefill flow;
- the explanation that parallel processing does not bypass the causal mask;
- the two outputs of prefill: first-token logits and per-layer K/V entries;
- the Q/K/V refresher and the claim that historical K/V tensors are reused at every decode step;
- equations `K_i^(l)=H_i^(l-1)W_K^(l)` and `V_i^(l)=H_i^(l-1)W_V^(l)`.

Use “KV cache” in prose and “K/V” when referring to the tensors or heads. Avoid claiming that cached decoding eliminates attention over historical tokens: the current query must still attend to cached keys and read cached values.

- [ ] **Step 3: Translate the compute and memory derivations**

Write `compute-savings` and `memory-cost` without dropping any source derivation. Preserve:

- shapes `H ∈ R^(T × d_model)` and `W_K, W_V ∈ R^(d_model × d_kv)`;
- `d_kv = n_kv_heads × d_head` and the distinction between MHA and GQA/MQA;
- the `T=2`, `d_model=3`, `d_kv=2` example and its `12 MACs` result for K;
- `2 × L × T × d_model × d_kv` avoided historical K/V-projection MACs per decode step;
- the full cache-size formula including batch, layers, tokens, KV heads, head dimension, and bytes per element;
- the `128 KiB/token`, `512 MiB` at 4,096 tokens, and `2 GiB` at batch size four example.

State narrowly that the MAC expression quantifies avoided historical K/V projections; the broader speedup also comes from not rerunning historical tokens through preceding attention and MLP computations.

- [ ] **Step 4: Translate the MHA/GQA/MQA section and table**

Keep the 32 Q-head example and table values exactly:

| Method | Q heads | K/V heads | `d_kv` | Relative KV-cache size | Relative K/V-projection compute |
|---|---:|---:|---:|---:|---:|
| MHA | 32 | 32 | 4096 | 100% | 100% |
| GQA | 32 | 8 | 1024 | 25% | 25% |
| MQA | 32 | 1 | 128 | 3.125% | 3.125% |

Explicitly say that reducing K/V heads does not reduce the number of query heads, that each matched Q and K/V head retains `d_head = 128`, and that the percentages apply only to the KV cache and K/V projections—not total model compute.

- [ ] **Step 5: Translate provider pricing and Prompt Caching sections**

Preserve the source transition from in-request reuse to cross-request prefix reuse. Keep the request A/B example and three-turn conversation example. Explain exact-prefix reuse and that the new suffix, attention from current queries to historical K/V, and output generation still require computation.

For `cached-token-pricing` and `openai-prompt-caching`, replace source values only where the official sources checked in Step 1 differ. Present API billing and Codex credits as separate product systems. Add a visible note: `Provider behavior and pricing checked August 3, 2026.`

- [ ] **Step 6: Translate hit-rate guidance and cache-breaking patterns**

Preserve:

- request hit rate versus token hit rate;
- `cached input tokens / total input tokens`;
- stable-to-dynamic prompt ordering;
- the explanation that a change early in an exact-matched prefix invalidates reuse after that point;
- the table covering model changes, timestamps/request IDs, unstable tool definitions, rewritten system prompts, divergent summarization/fork prompts, and TTL expiry;
- the Claude Code layout example and the caveat that a better hit rate does not automatically reduce total cost or end-to-end latency proportionally.

Fill the currently blank TTL consequence with: `The cached prefix has been evicted and must be created again.`

- [ ] **Step 7: Perform an editorial and technical consistency pass**

Check every heading against the Chinese source in sequence. Confirm that no equation, numerical example, table row, illustration callout, or substantive caveat was lost. Search for inconsistent forms and standardize them:

```bash
rg -n 'prefill|Prefill|decode|Decode|KV cache|KV Cache|prompt cache|Prompt Cache|token hit rate' articles/transformer-inference-kv-cache/index.html
```

Use `Prefill` and `Decode` when naming stages, `prefill` and `decode` as ordinary modifiers/verbs, `KV cache` in prose, and `Prompt Caching` only as a named provider feature or heading.

- [ ] **Step 8: Run article tests**

```bash
node --test tests/article-content.test.mjs
```

Expected: all article assertions pass.

- [ ] **Step 9: Commit the English article**

```bash
git add articles/transformer-inference-kv-cache/index.html tests/article-content.test.mjs
git commit -m "Write Transformer inference guide"
```

---

### Task 4: Produce and Integrate the Three English Illustrations

**Files:**
- Create: `articles/transformer-inference-kv-cache/assets/qkv-relationship.png`
- Create: `articles/transformer-inference-kv-cache/assets/mha-gqa-mqa.png`
- Create: `articles/transformer-inference-kv-cache/assets/system-prompt-layout.png`
- Modify if captions or dimensions require correction: `articles/transformer-inference-kv-cache/index.html`

**Interfaces:**
- Consumes: exact asset names and `<figure>` locations from Tasks 2–3.
- Produces: three valid PNG images referenced by the article contract.

- [ ] **Step 1: Read and follow the image-generation skill**

Read `/Users/xiemei/.codex/skills/.system/imagegen/SKILL.md` completely before editing or generating an image. Use the image-generation tool for the MHA/GQA/MQA English edit as required by that skill.

- [ ] **Step 2: Add a failing asset-existence test**

Extend `tests/article-content.test.mjs`:

```js
import { access, readFile } from "node:fs/promises";

test("all referenced English illustrations exist", async () => {
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
```

Run `node --test tests/article-content.test.mjs` and confirm it fails with `ENOENT` for the absent assets.

- [ ] **Step 3: Copy the already-English source assets**

Copy these exact workspace files without recompression:

```text
/Users/xiemei/Documents/Mei's ob/Transformer QKV Relationship Matching Diagram - EN.png
  → articles/transformer-inference-kv-cache/assets/qkv-relationship.png

/Users/xiemei/Documents/Mei's ob/Pasted image 20260803205759.png
  → articles/transformer-inference-kv-cache/assets/system-prompt-layout.png
```

Use a normal filesystem copy because these are unchanged binary assets, then validate them with `file`.

- [ ] **Step 4: Generate the English MHA/GQA/MQA diagram**

Edit `/Users/xiemei/Documents/Mei's ob/Pasted image 20260803200710.png` into a new English PNG. Preserve the warm-white three-panel layout and use this exact information:

- title: `MHA, GQA, and MQA: How Q Heads Share K/V Heads`;
- MHA: `32 Q heads / 32 K/V heads`, mappings `Q1`, `Q2`, `…`, `Q32` to `K/V head 1`, `K/V head 2`, `…`, `K/V head 32`, `KV cache: 100%`;
- GQA: `32 Q heads / 8 K/V heads`, mappings `Q1–Q4`, `Q5–Q8`, `…`, `Q29–Q32` to heads 1, 2, …, 8, `KV cache: 25%`;
- MQA: `32 Q heads / 1 K/V head`, `Q1–Q32` to `K/V head 1`, `All Q heads share one K/V head`, `KV cache: 3.125%`;
- formula: `d_kv = n_kv_heads × d_head`;
- note: `Fewer K/V heads reduce both KV-cache size and K/V-projection compute proportionally.`;
- footer: `Each Q head scores against K in its assigned K/V head, then uses the resulting attention weights to read V from that same head.`

Save the accepted result as `assets/mha-gqa-mqa.png`.

- [ ] **Step 5: Inspect every asset at original resolution**

Use image inspection for all three files. Reject and regenerate the comparison graphic if any text is misspelled, clipped, duplicated, or mathematically malformed. Confirm that the source images contain no remaining Chinese text and that `Q1–Q4`, `Q29–Q32`, `3.125%`, and the `d_kv` formula are legible.

- [ ] **Step 6: Run asset and article contract checks**

```bash
file articles/transformer-inference-kv-cache/assets/*.png
node --test tests/article-content.test.mjs
```

Expected: three valid PNG files and all article tests pass.

- [ ] **Step 7: Commit the English illustrations**

```bash
git add articles/transformer-inference-kv-cache/assets articles/transformer-inference-kv-cache/index.html tests/article-content.test.mjs
git commit -m "Add English Transformer inference diagrams"
```

---

### Task 5: Document, Validate, and Publish the Site

**Files:**
- Modify: `README.md`
- Modify only for issues found by validation: `index.html`, `styles.css`, `script.js`, `articles/transformer-inference-kv-cache/index.html`, `articles/transformer-inference-kv-cache/styles.css`, `articles/transformer-inference-kv-cache/script.js`, tests

**Interfaces:**
- Consumes: the homepage, article route, assets, and tests from Tasks 1–4.
- Produces: a verified GitHub Pages deployment at the canonical URL.

- [ ] **Step 1: Update repository documentation**

Change `README.md` to describe two published articles, identify the internal inference route, retain the external training-article link, and document:

```bash
python3 -m http.server 8000
node --test tests/*.test.mjs
```

- [ ] **Step 2: Run all automated checks**

```bash
node --test tests/*.test.mjs
git diff --check
```

Expected: all tests pass and `git diff --check` produces no output.

- [ ] **Step 3: Start a local preview and inspect both viewports**

Run `python3 -m http.server 8000` from the repository root. Inspect:

```text
http://localhost:8000/
http://localhost:8000/articles/transformer-inference-kv-cache/
```

At approximately 1440 × 1000 and 390 × 844, confirm:

- homepage cards are ordered newest first and both language modes update all card text;
- the article has no horizontal page overflow;
- navigation links land on the intended headings;
- equations and tables scroll within their containers when needed;
- all images are legible and retain aspect ratio;
- keyboard focus is visible;
- the home and prerequisite links resolve.

- [ ] **Step 4: Fix only validation findings and rerun checks**

For each observed issue, add or tighten a regression assertion where practical, apply the smallest CSS/HTML/JS fix, then rerun:

```bash
node --test tests/*.test.mjs
git diff --check
```

Expected: all checks pass.

- [ ] **Step 5: Commit documentation and validation fixes**

```bash
git add README.md index.html styles.css script.js tests articles/transformer-inference-kv-cache
git commit -m "Finalize Transformer inference publication"
```

If no validation fix changed tracked files beyond `README.md`, stage and commit only `README.md`.

- [ ] **Step 6: Perform the pre-publication GitHub checks**

```bash
gh --version
gh auth status
git status -sb
git log --oneline origin/main..HEAD
git diff --stat origin/main...HEAD
git remote -v
```

Expected: authenticated GitHub CLI, intended commits only, no unstaged files, and origin `https://github.com/xiemeimeiaaa/xiemeimeiaaa.github.io.git`.

- [ ] **Step 7: Push the GitHub Pages publishing branch**

The repository publishes from `main`, so push the reviewed commits directly as requested:

```bash
git push origin main
```

Expected: remote `main` advances successfully.

- [ ] **Step 8: Verify the public deployment**

After GitHub Pages finishes deploying, open:

```text
https://xiemeimeiaaa.github.io/
https://xiemeimeiaaa.github.io/articles/transformer-inference-kv-cache/
```

Confirm an HTTP-successful page load, the second homepage card, the final article title, all three images, MathJax rendering, and working internal navigation. If deployment is still in progress, wait in bounded intervals and recheck without making additional commits.

- [ ] **Step 9: Record the final publication result**

Report the pushed commit hash, passing test command, canonical article URL, homepage URL, and the official-source check date. Mention any provider-specific values that were changed from the Chinese source during verification.
