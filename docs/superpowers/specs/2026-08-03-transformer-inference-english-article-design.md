# Transformer Inference English Article Design

## Goal

Publish an English technical edition of `How Transformer LLMs Work - 推理与 KV Cache.md` on Mei's GitHub Pages site. The article should preserve the source article's structure and reasoning while using polished English technical prose influenced by the clarity of Anthropic and OpenAI engineering posts.

The finished article will live at:

```text
https://xiemeimeiaaa.github.io/articles/transformer-inference-kv-cache/
```

## Audience

The primary reader has read the preceding Transformer training article or already understands Transformer blocks, self-attention, and the roles of queries, keys, and values. The new article may briefly refresh those concepts where needed, but it will not repeat the full introductory explanation.

## Editorial Approach

This is a faithful technical adaptation rather than a literal translation or a structural rewrite.

- Preserve the source article's progression, examples, equations, tables, and placement of illustrations.
- Rewrite sentences into natural, precise English instead of mirroring Chinese syntax.
- Keep the author's explanatory voice and learning path.
- Standardize terminology, notation, punctuation, heading hierarchy, and mathematical formatting.
- Make only minimal structural edits required for readability or technical correctness.
- Correct clearly misleading technical statements without changing the article's central argument.
- Verify time-sensitive OpenAI prompt-caching and pricing claims against current official documentation.
- Label vendor-specific and time-sensitive information clearly so that it is not mistaken for a universal property of KV caching.

## Title and Introduction

Working title:

> How Transformer LLMs Generate Text: Prefill, Decode, and the KV Cache

The page will open with a short summary of the question the article answers and a prerequisite link to the existing Transformer training article. The source article's main body will then begin without an added long-form narrative introduction.

## Article Structure

The English page will retain the source order:

1. What happens after a prompt is submitted: Prefill and Decode
2. Prefill: processing the known prompt in parallel
3. Decode: how previously computed keys and values are reused
4. How much computation the KV cache saves
5. The memory cost of caching
6. MHA, GQA, and MQA as different K/V-head trade-offs
7. Provider pricing for cached tokens
8. Prompt caching across requests and conversation turns
9. OpenAI prompt-caching requirements
10. Improving the cached-token hit rate
11. Common ways to break a reusable prompt prefix
12. The Claude Code prompt-layout example and closing caveats

The small matrix-multiplication example, KV-cache memory formula, numerical cache-size example, MHA/GQA/MQA comparison table, prompt-prefix examples, and cache-breaking table will all remain.

## Illustrations

The three illustrations will remain in their corresponding source locations.

1. **Q/K/V relationship diagram**
   - Use the existing English asset `Transformer QKV Relationship Matching Diagram - EN.png`.
   - Give it a descriptive web-safe filename and accurate alt text.
2. **MHA/GQA/MQA comparison**
   - Produce an English edition of the current comparison graphic.
   - Preserve the 32:32, 32:8, and 32:1 mappings, the cache-size percentages, the `d_kv` relationship, and the distinction between matching against K and retrieving from V.
3. **System prompt layout**
   - Reuse the existing English image.
   - Rename and optimize it for the article without changing its information hierarchy.

All images will be stored under the article's own `assets/` directory and rendered responsively. Visual review must confirm that text is legible on desktop and mobile layouts.

## Page and Site Integration

Create a self-contained article page under `articles/transformer-inference-kv-cache/` while reusing the visual language of the existing published article:

- readable long-form typography;
- consistent header and route back to the knowledge-library homepage;
- table of contents or article navigation following the established responsive pattern;
- responsive equations, tables, code blocks, and images;
- title, description, canonical URL, and social-sharing metadata;
- accessible headings, link labels, image alt text, and focus behavior.

The homepage will gain a second article card pointing to the new internal route. English and Chinese homepage translations will both receive matching text keys, and the displayed article count and latest-article wording will be updated consistently.

The first article will remain in its current separate repository and at its current URL. Migrating it into the main site is outside this change.

## Source Verification

Stable conceptual claims may be checked against primary technical documentation. Time-sensitive claims about OpenAI models, cache breakpoints, token accounting, traffic guidance, or prices must be verified immediately before publication using official OpenAI sources.

If a source claim can no longer be verified, the English article will either:

- replace it with the currently documented behavior and identify the date checked; or
- generalize the passage and link readers to the current provider documentation.

The article will distinguish clearly between:

- an in-request KV cache used across decode steps;
- a provider-managed prompt cache reused across requests; and
- product-specific billing or credit systems.

## Validation

Before publication:

- check all internal and external links;
- confirm every local asset resolves;
- run the homepage language tests and add coverage for the second card where appropriate;
- validate heading order, document landmarks, metadata, and image alt text;
- inspect the article at desktop and mobile widths;
- inspect all three images at rendered size;
- confirm formulas and tables remain readable without breaking the page width;
- run any repository tests added for article navigation and structure;
- review the final Git diff so only the article, its assets, homepage integration, tests, and supporting documentation are included.

## Publication

Commit the completed work to the `xiemeimeiaaa.github.io` repository and push it to the GitHub Pages publishing branch. After deployment, verify the public article URL and the new homepage card.

## Acceptance Criteria

- The new URL loads as an English technical article from the main GitHub Pages repository.
- The body follows the source article's original organization and retains its substantive examples.
- English prose is idiomatic, concise, and technically rigorous.
- The three illustrations contain English text and are legible in the published layout.
- Provider-specific facts are accurate as of publication and clearly scoped.
- The homepage exposes the article in both interface languages.
- Existing homepage behavior and the first article link continue to work.
- Automated checks pass, and the deployed page is verified after pushing.
