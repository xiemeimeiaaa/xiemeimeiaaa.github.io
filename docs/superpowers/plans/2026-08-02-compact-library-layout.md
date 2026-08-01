# Compact Library Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the personal homepage materially denser and more elegant, and move the Transformer article's bilingual return link into an unobtrusive bottom-right floating control.

**Architecture:** Keep both sites framework-free and preserve their existing repository boundary. The homepage change is CSS-only and replaces fixed-height spacing with content-driven layout; the article change updates one semantic anchor and its CSS, with ordinary HTML navigation as the complete interaction model.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript ES modules, Node.js built-in test runner, headless Chrome/CDP, Git, GitHub CLI, GitHub Pages.

## Global Constraints

- Modify only `xiemeimeiaaa.github.io` and `transformer-llms-for-beginners`; preserve both live URLs.
- Keep library heading `font-size: clamp(1.25rem, 6vw, 4.4rem)` and article-card title `font-size: clamp(1rem, 4vw, 2.65rem)` unchanged.
- Keep all homepage English/Chinese copy, language detection, persistence, article metadata, and link destinations unchanged.
- Use visible return copy `返回主页 / Back to Library` with destination `https://xiemeimeiaaa.github.io/`.
- Keep plain HTML/CSS/JavaScript with no new dependency, framework, package manager, image, animation, or runtime service.
- Preserve keyboard focus, reduced motion, English no-JavaScript fallback, a 44px minimum target, and no horizontal overflow at 390px.

---

### Task 1: Compact the Homepage Composition

**Files:**
- Modify: `github-pages/xiemeimeiaaa.github.io/styles.css`
- Verify: `github-pages/xiemeimeiaaa.github.io/index.html`
- Test: `github-pages/xiemeimeiaaa.github.io/tests/language.test.mjs`

**Interfaces:**
- Consumes: existing `.intro`, `.eyebrow`, `h1`, `.articles`, `.section-heading`, `.article-link`, `.article-meta`, `.article-body`, `.article-arrow`, and footer DOM hooks.
- Produces: the same semantic DOM and full-card link behavior with content-driven card height and exact responsive spacing.

- [ ] **Step 1: Record a failing browser measurement before changing CSS**

Start the homepage locally with `python3 -m http.server 8765 --bind 127.0.0.1`, load it in headless Chrome, and evaluate this object at `1440 × 1000` and `390 × 844`:

```javascript
({
  introPadding: getComputedStyle(document.querySelector(".intro")).padding,
  cardHeight: document.querySelector(".article-card").getBoundingClientRect().height,
  articleMinHeight: getComputedStyle(document.querySelector(".article-link")).minHeight,
  overflow:
    document.documentElement.scrollWidth >
    document.documentElement.clientWidth,
})
```

Assert the intended behavior:

```javascript
if (desktop.introPadding !== "64px 0px 48px") throw new Error("desktop intro is not compact");
if (desktop.cardHeight < 190 || desktop.cardHeight > 220) throw new Error("desktop card is not compact");
if (desktop.articleMinHeight !== "0px") throw new Error("desktop card still has a minimum height");
if (mobile.introPadding !== "44px 0px 36px") throw new Error("mobile intro is not compact");
if (mobile.articleMinHeight !== "0px") throw new Error("mobile card still has a minimum height");
if (desktop.overflow || mobile.overflow) throw new Error("horizontal overflow detected");
```

Expected before implementation: FAIL because desktop intro padding is `108px 0px 84px`, desktop card height is at least `300px`, and mobile card height is at least `390px`.

- [ ] **Step 2: Apply the exact compact homepage CSS**

Update the existing selectors in `styles.css` to the following values while retaining their unrelated color, type, hover, and focus declarations:

```css
.intro {
  max-width: 760px;
  padding: 64px 0 48px;
}

.eyebrow {
  margin: 0 0 12px;
}

h1 {
  margin-bottom: 16px;
  font-size: clamp(1.25rem, 6vw, 4.4rem);
}

.articles {
  padding-bottom: 72px;
}

.section-heading {
  margin-bottom: 16px;
}

.article-link {
  min-height: 0;
  padding: 30px 32px 32px;
  display: block;
}

.article-meta {
  margin-bottom: 22px;
}

.article-body {
  grid-template-columns: minmax(0, 1fr) 44px;
  gap: 24px;
}

.article-arrow {
  width: 44px;
  height: 44px;
}

.footer-inner {
  min-height: 88px;
}
```

In the existing `@media (max-width: 640px)` block use:

```css
.intro {
  padding: 44px 0 36px;
}

.articles {
  padding-bottom: 52px;
}

.article-link {
  min-height: 0;
  padding: 22px 22px 24px;
}

.article-body {
  grid-template-columns: minmax(0, 1fr) 44px;
  gap: 16px;
}

.article-arrow {
  width: 44px;
  height: 44px;
}

.footer-inner {
  padding: 18px 0;
}
```

Remove the old `.article-link { min-height: 390px; }`, one-column mobile `.article-body`, and `48px` mobile arrow overrides so they cannot reintroduce empty space.

- [ ] **Step 3: Run the homepage tests and repeat browser measurements**

Run:

```bash
node --test tests/language.test.mjs
```

Expected: 5 tests PASS. Repeat Step 1's Chrome checks. Expected: both intro padding assertions pass, desktop card height is within `190–220px`, both computed `min-height` values are `0px`, and neither viewport overflows horizontally. Also assert the unchanged typography:

```javascript
getComputedStyle(document.querySelector("h1")).fontSize === "70.4px";
getComputedStyle(document.querySelector(".article-body h3")).fontSize === "42.4px";
```

at `1440px`, and `23.4px` / `16px` at `390px`.

- [ ] **Step 4: Commit the compact homepage**

```bash
git add styles.css
git commit -m "Compact homepage article layout"
```

### Task 2: Move and Refine the Article Return Control

**Files:**
- Modify: `github-pages/transformer-llms-for-beginners/index.html:36-39`
- Modify: `github-pages/transformer-llms-for-beginners/styles.css:4-47`
- Modify: `github-pages/transformer-llms-for-beginners/tests/navigation.test.mjs:69-79`

**Interfaces:**
- Consumes: the existing `.site-navigation` wrapper and `.home-link` anchor.
- Produces: an ordinary anchor labeled `返回主页 / Back to Library` that floats outside the reading column on wide screens, rests at the article end on narrower screens, and navigates to the personal homepage without JavaScript.

- [ ] **Step 1: Change the browser-DOM test first**

In `tests/navigation.test.mjs`, keep the exact destination assertion and replace the visible-copy expectation:

```javascript
assert.match(
  homepageLink[1].replace(/<[^>]+>/g, " "),
  /返回主页 \/ Back to Library/,
);
```

- [ ] **Step 2: Run the article test and verify the expected failure**

Run:

```bash
node --test tests/navigation.test.mjs
```

Expected: FAIL because the rendered link still says `← Back to Knowledge Library`.

- [ ] **Step 3: Update the semantic link copy**

In `index.html`, retain the navigation label and exact destination while changing only the anchor text:

```html
<nav class="site-navigation" aria-label="Site navigation">
  <a class="home-link" href="https://xiemeimeiaaa.github.io/">返回主页 / Back to Library</a>
</nav>
```

- [ ] **Step 4: Move the navigation out of document flow and preserve article typography**

Replace the current navigation and link rules with:

```css
body {
  padding: 48px 24px calc(112px + env(safe-area-inset-bottom));
}

.site-navigation {
  position: fixed;
  z-index: 10;
  right: clamp(12px, 3vw, 28px);
  bottom: calc(16px + env(safe-area-inset-bottom));
  margin: 0;
}

.home-link {
  min-height: 44px;
  padding: 8px 14px;
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(148, 163, 184, 0.72);
  border-radius: 999px;
  color: #475569;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.08);
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: inherit;
  line-height: 1.3;
  text-decoration: none;
  backdrop-filter: blur(8px);
}

.home-link:hover,
.home-link:focus-visible {
  border-color: #2457d6;
  color: #173f9e;
  background: #ffffff;
}

@media (max-width: 1200px) {
  .site-navigation {
    position: absolute;
  }
}
```

Retain the existing explicit `:focus-visible` outline. In the mobile media query, set:

```css
body {
  padding: 28px 18px calc(104px + env(safe-area-inset-bottom));
}
```

- [ ] **Step 5: Run the test and verify the control in Chrome**

Run:

```bash
node --test tests/navigation.test.mjs
```

Expected: 1 test PASS. At `1440px`, use Chrome to assert:

```javascript
const navigation = document.querySelector(".site-navigation");
const link = document.querySelector(".home-link");
const rect = link.getBoundingClientRect();

getComputedStyle(navigation).position === "fixed";
rect.height >= 44;
rect.right <= innerWidth;
rect.bottom <= innerHeight;
link.textContent.trim() === "返回主页 / Back to Library";
link.href === "https://xiemeimeiaaa.github.io/";
document.documentElement.scrollWidth <= document.documentElement.clientWidth;
```

At `390 × 844`, assert `getComputedStyle(navigation).position === "absolute"`,
that the control is below the viewport while reading the article, and that it
is fully visible below the final paragraph after scrolling to the end. Confirm
the `h1` starts at the body's top content edge and neither viewport overflows.

- [ ] **Step 6: Commit the article navigation refinement**

```bash
git add index.html styles.css tests/navigation.test.mjs
git commit -m "Refine article home navigation"
```

### Task 3: Visual QA and GitHub Pages Publication

**Files:**
- Verify: `github-pages/xiemeimeiaaa.github.io/index.html`
- Verify: `github-pages/xiemeimeiaaa.github.io/styles.css`
- Verify: `github-pages/transformer-llms-for-beginners/index.html`
- Verify: `github-pages/transformer-llms-for-beginners/styles.css`

**Interfaces:**
- Consumes: the two locally committed `main` branches.
- Produces: synchronized public Pages builds at the existing homepage and article URLs.

- [ ] **Step 1: Capture and inspect four local screenshots**

Capture the homepage and article at `1440 × 1000` and `390 × 844`. Confirm:

- the homepage article card contains no artificial blank lower half;
- the intro, article section, and footer form a compact rhythm without collisions;
- the article arrow remains lower-right inside the card at both widths;
- the floating return control does not shift the article heading or overflow;
- metadata, summary, control text, formulas, and diagrams remain readable.

If any check fails, change only the spacing or alignment declaration responsible, then repeat Task 1 and Task 2 tests and recapture the affected screenshot.

- [ ] **Step 2: Run a fresh complete local verification**

Run from the shared workspace root:

```bash
node --test github-pages/xiemeimeiaaa.github.io/tests/language.test.mjs
node --test github-pages/transformer-llms-for-beginners/tests/navigation.test.mjs
git -C github-pages/xiemeimeiaaa.github.io status -sb
git -C github-pages/transformer-llms-for-beginners status -sb
```

Expected: 5 homepage tests and 1 article test PASS; both working trees are clean after their task commits. Confirm the local homepage, CSS, JavaScript, article page, seven image assets, and MathJax script load without missing required resources.

- [ ] **Step 3: Push both Pages branches**

The user explicitly requested updates to the already-published sites, so push each Pages source branch directly:

```bash
git -C github-pages/xiemeimeiaaa.github.io push origin main
git -C github-pages/transformer-llms-for-beginners push origin main
```

- [ ] **Step 4: Wait for the exact commits to build**

For each repository, query:

```bash
gh api "repos/xiemeimeiaaa/REPOSITORY/pages/builds/latest" --jq '{status,commit}'
```

Expected: `xiemeimeiaaa.github.io` reports the new homepage commit with `status: built`, and `transformer-llms-for-beginners` reports the new article commit with `status: built`. Stop and report if either status becomes `errored`.

- [ ] **Step 5: Verify the live behavior with cache-busting URLs**

Load both live pages with `?revision=<short-commit>` and repeat the browser-computed measurements from Tasks 1 and 2. Click `返回主页 / Back to Library` on the live article and assert:

```javascript
location.href === "https://xiemeimeiaaa.github.io/";
```

Confirm both canonical URLs, homepage CSS/JavaScript, article CSS, and all seven article images return HTTP 200.

- [ ] **Step 6: Report publication evidence**

Return the two live URLs, both commit hashes, passing test counts, Pages build statuses, and desktop/mobile verification results.

## Execution Note

Both repositories are normal repositories already on their Pages source branch `main`; no worktree or integration branch is needed. Direct pushes are part of the approved publication workflow. Execution remains inline because sub-agent delegation was not authorized.
