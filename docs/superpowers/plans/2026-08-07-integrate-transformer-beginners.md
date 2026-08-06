# Integrate Transformer Beginners Article Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the complete Transformer beginners article into the main GitHub Pages repository, publish it at `/articles/transformer-llms-for-beginners/`, and retire the separate repository after deployment verification.

**Architecture:** Keep the article self-contained under the main site's existing `articles/` convention. Preserve the source HTML, CSS, and seven image assets, while changing only site integration metadata and internal navigation. Protect the migration with Node tests that exercise the generated static files and links.

**Tech Stack:** Static HTML/CSS, local PNG assets, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- Preserve all article prose, formulas, diagrams, and styling.
- Publish the canonical article at `https://xiemeimeiaaa.github.io/articles/transformer-llms-for-beginners/`.
- Do not delete the source repository until the new public page and its assets are verified.
- Do not retain a duplicate published copy or redirect after deletion.

---

### Task 1: Add migration contract tests

**Files:**
- Create: `tests/transformer-beginners.test.mjs`
- Modify: `tests/homepage-content.test.mjs`
- Modify: `tests/article-content.test.mjs`

**Interfaces:**
- Consumes: the main homepage and both article HTML documents.
- Produces: regression coverage for the internal route, canonical URL, seven local assets, semantic landmarks, and cross-article prerequisite link.

- [ ] **Step 1: Write failing tests**

Add assertions that the homepage card uses `articles/transformer-llms-for-beginners/`, the inference article points to that same route, and the migrated article contains its canonical metadata, main/article landmarks, homepage navigation, and seven existing image references whose files resolve.

- [ ] **Step 2: Verify the tests fail for missing migration behavior**

Run: `node --test tests/*.test.mjs`

Expected: failures report the current external homepage/prerequisite URLs and missing `articles/transformer-llms-for-beginners/index.html`.

### Task 2: Migrate and integrate the article

**Files:**
- Create: `articles/transformer-llms-for-beginners/index.html`
- Create: `articles/transformer-llms-for-beginners/styles.css`
- Create: `articles/transformer-llms-for-beginners/assets/*.png`
- Modify: `index.html`
- Modify: `articles/transformer-inference-kv-cache/index.html`
- Modify: `README.md`

**Interfaces:**
- Consumes: the complete source repository snapshot at commit `f211f0ba185e7b1ba3c24b6e1344b2d4da919f91`.
- Produces: a self-contained internal article route and main-site navigation to it.

- [ ] **Step 1: Copy the complete article snapshot**

Copy `index.html`, `styles.css`, and all seven `assets/*.png` files into `articles/transformer-llms-for-beginners/` without changing article content.

- [ ] **Step 2: Apply the minimal integration changes**

Set the canonical and Open Graph URL to the new route, keep the homepage navigation aimed at `/`, replace the homepage card and inference prerequisite URLs with the new internal route, and describe both articles as main-repository content in `README.md`.

- [ ] **Step 3: Verify the full test suite passes**

Run: `node --test tests/*.test.mjs`

Expected: all tests pass with zero failures.

### Task 3: Publish, verify, and retire the old repository

**Files:**
- No additional source files.

**Interfaces:**
- Consumes: the verified main-repository commit.
- Produces: a live GitHub Pages route with working assets and removal of the obsolete source repository.

- [ ] **Step 1: Review and commit only migration files**

Run `git status --short`, `git diff --check`, review `git diff --stat` and the textual diff, then commit the scoped changes.

- [ ] **Step 2: Push the main branch**

Push the verified commit to `origin/main` so GitHub Pages can deploy it.

- [ ] **Step 3: Verify the published site**

Confirm the homepage card opens the new article, the canonical URL is correct, and all seven article images return successfully.

- [ ] **Step 4: Delete the source repository**

Delete `xiemeimeiaaa/transformer-llms-for-beginners` only after Step 3 succeeds, then confirm GitHub no longer returns repository metadata for it.
