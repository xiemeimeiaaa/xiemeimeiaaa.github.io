# Social Icons and Zhihu Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Match the profile's GitHub and LinkedIn icons to the steipete.me outline style, add a matching Zhihu link, and reproduce the reference hover rotation accessibly.

**Architecture:** Keep all three brand icons as inline SVG inside the existing static profile-link row. Extend the existing translation dictionaries for Zhihu labels, then update shared CSS for Tabler stroke styling, responsive scaling, hover rotation, and reduced-motion suppression.

**Tech Stack:** HTML5, CSS, vanilla JavaScript ES modules, inline Tabler SVG paths, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- Keep each link target at 44×44 px.
- Use 24×24 inline SVGs with `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`, round line caps, and round line joins.
- Scale SVGs to `1.25` on desktop and `1.1` at the existing mobile breakpoint.
- Display links in the exact order GitHub, LinkedIn, Zhihu.
- Use the exact Zhihu URL `https://www.zhihu.com/people/wasabimiao-miao-miao`.
- Rotate links clockwise by 6 degrees on hover and suppress motion when `prefers-reduced-motion: reduce` is active.
- Add no external package, CDN, forced new tab, or additional social network.
- Preserve the header GitHub link, portrait, introduction, articles, and publishing architecture.

---

## File Structure

- `index.html`: outline SVG markup and the third Zhihu profile link.
- `script.js`: bilingual Zhihu visible and accessible labels.
- `styles.css`: SVG stroke presentation, responsive scale, hover rotation, and reduced-motion override.
- `tests/homepage-content.test.mjs`: profile-link order, exact destinations, and inline SVG contract.
- `tests/language.test.mjs`: complete bilingual translation interface and exact Zhihu strings.
- `tests/site-layout.test.mjs`: interaction and reduced-motion CSS contracts.

### Task 1: Outline icons and Zhihu content

**Files:**
- Modify: `index.html`
- Modify: `script.js`
- Modify: `tests/homepage-content.test.mjs`
- Modify: `tests/language.test.mjs`

**Interfaces:**
- Consumes: existing `.profile-link`, `.visually-hidden`, `data-i18n`, and `data-i18n-aria` conventions.
- Produces: three ordered profile links plus translation keys `zhihuLabel` and `zhihuAria`.

- [ ] **Step 1: Add failing profile-link tests**

Extend `tests/homepage-content.test.mjs` with:

```js
test("profile links expose three ordered outline brand icons", () => {
  const githubIndex = html.indexOf('href="https://github.com/xiemeimeiaaa"', html.indexOf('class="profile-links"'));
  const linkedinIndex = html.indexOf('href="https://www.linkedin.com/in/mei-xie-7ab332301/"', githubIndex);
  const zhihuIndex = html.indexOf('href="https://www.zhihu.com/people/wasabimiao-miao-miao"', linkedinIndex);

  assert.ok(githubIndex > -1);
  assert.ok(linkedinIndex > githubIndex);
  assert.ok(zhihuIndex > linkedinIndex);
  assert.equal((html.match(/class="profile-link"/g) ?? []).length, 3);
  assert.equal((html.match(/stroke="currentColor"/g) ?? []).length, 3);
  assert.equal((html.match(/stroke-width="2"/g) ?? []).length, 3);
  assert.equal((html.match(/stroke-linecap="round"/g) ?? []).length, 3);
  assert.equal((html.match(/stroke-linejoin="round"/g) ?? []).length, 3);
});
```

Extend the existing `expectedKeys` in `tests/language.test.mjs` with
`zhihuLabel` and `zhihuAria`, then add:

```js
test("both locales expose exact Zhihu labels", () => {
  assert.equal(translations.en.zhihuLabel, "Zhihu");
  assert.equal(translations.en.zhihuAria, "Visit Mei's Zhihu profile");
  assert.equal(translations.zh.zhihuLabel, "知乎");
  assert.equal(translations.zh.zhihuAria, "访问 Mei 的知乎主页");
});
```

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `node --test tests/homepage-content.test.mjs tests/language.test.mjs`

Expected: FAIL because the two current SVGs are filled icons and the Zhihu
link and translation keys do not exist.

- [ ] **Step 3: Replace GitHub and LinkedIn with reference outline SVGs**

Give each existing profile SVG the shared attributes from Global Constraints.
Use the reference GitHub outline path:

```html
<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
<path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path>
```

Use the reference LinkedIn outline paths:

```html
<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
<path d="M8 11v5"></path>
<path d="M8 8v.01"></path>
<path d="M12 16v-5"></path>
<path d="M16 16v-3a2 2 0 1 0 -4 0"></path>
<path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z"></path>
```

- [ ] **Step 4: Add the Zhihu link and matching outline SVG**

Append a `.profile-link` with the exact Zhihu URL, localized aria label, hidden
text, and these Tabler `brand-zhihu` paths:

```html
<path d="M14 6h6v12h-2l-2 2l-1 -2h-1l0 -12"></path>
<path d="M4 12h6.5"></path>
<path d="M10.5 6h-5"></path>
<path d="M6 4c-.5 2.5 -1.5 3.5 -2.5 4.5"></path>
<path d="M8 6v7c0 4.5 -2 5.5 -4 7"></path>
<path d="M11 18l-3 -5"></path>
```

- [ ] **Step 5: Add exact bilingual Zhihu strings**

Add to `translations.en`:

```js
zhihuLabel: "Zhihu",
zhihuAria: "Visit Mei's Zhihu profile",
```

Add to `translations.zh`:

```js
zhihuLabel: "知乎",
zhihuAria: "访问 Mei 的知乎主页",
```

- [ ] **Step 6: Run focused tests and verify green**

Run: `node --test tests/homepage-content.test.mjs tests/language.test.mjs`

Expected: all focused tests PASS.

- [ ] **Step 7: Commit content and icon markup**

```bash
git add index.html script.js tests/homepage-content.test.mjs tests/language.test.mjs
git commit -m "Add outline social icons and Zhihu link"
```

### Task 2: Hover rotation and responsive scaling

**Files:**
- Modify: `styles.css`
- Modify: `tests/site-layout.test.mjs`

**Interfaces:**
- Consumes: the three `.profile-link > svg` elements from Task 1.
- Produces: identical responsive icon sizing, 6-degree hover rotation, and motion-safe behavior.

- [ ] **Step 1: Add failing interaction style tests**

Add to `tests/site-layout.test.mjs`:

```js
test("social icons match the reference interaction with reduced-motion support", () => {
  assert.match(sharedStyles, /\.profile-link\s*{[\s\S]*?transition:\s*[^;]*transform/);
  assert.match(sharedStyles, /\.profile-link:hover\s*{[\s\S]*?transform:\s*rotate\(6deg\)/);
  assert.match(sharedStyles, /\.profile-link svg\s*{[\s\S]*?width:\s*24px/);
  assert.match(sharedStyles, /\.profile-link svg\s*{[\s\S]*?transform:\s*scale\(1\.25\)/);
  assert.match(
    sharedStyles,
    /@media \(max-width: 640px\)[\s\S]*?\.profile-link svg\s*{[\s\S]*?transform:\s*scale\(1\.1\)/,
  );
  assert.match(
    sharedStyles,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.profile-link:hover\s*{[\s\S]*?transform:\s*none/,
  );
});
```

- [ ] **Step 2: Run the style test and verify failure**

Run: `node --test tests/site-layout.test.mjs`

Expected: FAIL because the existing icons are filled, 27 px, and do not rotate.

- [ ] **Step 3: Implement reference sizing and hover rotation**

Update `.profile-link` to transition color and transform, and update the SVG:

```css
.profile-link {
  transition: color 150ms ease, transform 150ms ease;
}

.profile-link:hover {
  color: var(--accent);
  transform: rotate(6deg);
}

.profile-link svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  transform: scale(1.25);
}
```

Inside `@media (max-width: 640px)`, set `.profile-link svg` to
`transform: scale(1.1)`. Inside `@media (prefers-reduced-motion: reduce)`, set
`.profile-link` to `transition: none` and `.profile-link:hover` to
`transform: none`.

- [ ] **Step 4: Run the complete test suite**

Run: `node --test tests/*.test.mjs`

Expected: all tests PASS.

- [ ] **Step 5: Inspect desktop and 390 px mobile layouts**

Serve locally with `python3 -m http.server 8000`. At desktop and 390 px, verify
the three icons align, retain 44×44 px targets, fit without horizontal
overflow, and show the correct destinations and bilingual labels. Hover each
icon and confirm its link rotates 6 degrees and changes color. Emulate reduced
motion and confirm the rotation is removed.

- [ ] **Step 6: Commit interaction styling**

```bash
git add styles.css tests/site-layout.test.mjs
git commit -m "Match reference social icon interactions"
```

### Task 3: Final regression and publishing evidence

**Files:**
- Verify only; no expected source modifications.

**Interfaces:**
- Consumes: completed Tasks 1 and 2.
- Produces: verified commits ready for branch integration and GitHub Pages publication.

- [ ] **Step 1: Run fresh final verification**

Run: `node --test tests/*.test.mjs && git diff --check && git status --short`

Expected: all tests PASS, no whitespace errors, and no uncommitted changes.

- [ ] **Step 2: Record commits and preview paths**

Run: `git log -4 --oneline` and report the two implementation commit IDs plus
desktop and mobile screenshot paths. Use the branch-finishing workflow for the
user's merge/push choice; after publication, verify the GitHub Pages build and
the live Zhihu destination.
