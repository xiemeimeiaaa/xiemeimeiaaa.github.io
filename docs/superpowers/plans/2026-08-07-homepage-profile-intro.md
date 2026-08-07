# Homepage Profile Introduction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic homepage introduction with Mei's bilingual profile, centered circular portrait, and GitHub and LinkedIn links.

**Architecture:** Keep the existing static HTML/CSS/JavaScript structure. Add the profile as semantic homepage markup, extend the existing translation application function for localized image alternative text, and style the section with a responsive grid that collapses to one column on mobile.

**Tech Stack:** HTML5, CSS, vanilla JavaScript ES modules, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- Reproduce the approved English paragraph exactly, including punctuation.
- Store the supplied source photograph locally without destructively editing it.
- Display only GitHub and LinkedIn social links; do not add email or other networks.
- Add no framework, external icon font, or runtime dependency.
- Preserve article content, ordering, URLs, publishing architecture, and language-selection behavior.
- The layout must remain free of horizontal overflow at 390 px.
- Social links must provide at least 44 px interactive targets and visible keyboard focus.

---

## File Structure

- `assets/mei-profile.png`: local copy of the user-supplied portrait source.
- `index.html`: semantic profile markup, fallback English content, inline social SVGs, and exact link destinations.
- `script.js`: English and Chinese profile strings plus localized `alt` attribute handling.
- `styles.css`: desktop profile grid, circular focal crop, social links, and mobile stacking.
- `tests/homepage-content.test.mjs`: content, asset, social-link, and semantic-markup assertions.
- `tests/language.test.mjs`: translation-key and localized portrait-alt assertions.

### Task 1: Profile content, portrait asset, and bilingual behavior

**Files:**
- Create: `assets/mei-profile.png`
- Modify: `index.html`
- Modify: `script.js`
- Modify: `tests/homepage-content.test.mjs`
- Modify: `tests/language.test.mjs`

**Interfaces:**
- Consumes: existing `translations`, `applyLanguage(root, language)`, and `data-i18n` conventions.
- Produces: translation keys `profileHeading`, `profileDescription`, `profileImageAlt`, `linkedinLabel`, `linkedinAria`, and support for `data-i18n-alt`.

- [ ] **Step 1: Add failing homepage content tests**

Add assertions to `tests/homepage-content.test.mjs`:

```js
test("homepage exposes Mei's profile and social destinations", () => {
  assert.match(html, /class="profile-intro"/);
  assert.match(html, /src="\/assets\/mei-profile\.png"/);
  assert.match(
    html,
    /Backend software engineer with 3 years of experience building reliable production systems in insurtech\./,
  );
  assert.match(html, /href="https:\/\/github\.com\/xiemeimeiaaa"/);
  assert.match(
    html,
    /href="https:\/\/www\.linkedin\.com\/in\/mei-xie-7ab332301\/"/,
  );
  assert.match(html, /data-i18n-alt="profileImageAlt"/);
});
```

Add a test to `tests/language.test.mjs` using the file's existing lightweight
DOM-object pattern:

```js
test("applyLanguage localizes the portrait alternative text", () => {
  const portrait = {
    dataset: { i18nAlt: "profileImageAlt" },
    alt: "",
    setAttribute(name, value) {
      if (name === "alt") this.alt = value;
    },
  };
  const root = {
    documentElement: { lang: "en" },
    querySelectorAll(selector) {
      return selector === "[data-i18n-alt]" ? [portrait] : [];
    },
  };

  applyLanguage(root, "zh");

  assert.equal(portrait.alt, "Mei 的个人照片");
});
```

Extend the existing `expectedKeys` array with `profileHeading`,
`profileDescription`, `profileImageAlt`, `linkedinLabel`, and `linkedinAria`.
Add an exact equality assertion for `translations.en.profileDescription` so
future edits cannot silently change the approved paragraph.

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `node --test tests/homepage-content.test.mjs tests/language.test.mjs`

Expected: FAIL because the profile markup, translation keys, and localized alt handling do not exist.

- [ ] **Step 3: Copy the supplied portrait into the site**

Create `assets/`, then copy
`/var/folders/f3/q83vsrzn32d9ynhmfc9tkv_40000gn/T/codex-clipboard-9e1ef1bc-cdaf-43f6-823b-83d2bf62bc78.png`
to `assets/mei-profile.png`. Do not resize or overwrite the source file.

- [ ] **Step 4: Replace the homepage intro markup**

Replace the current contents of `<section class="intro">` with a
`profile-intro` grid containing:

```html
<div class="profile-portrait-wrap">
  <img
    class="profile-portrait"
    src="/assets/mei-profile.png"
    alt="Portrait of Mei"
    data-i18n-alt="profileImageAlt"
  >
</div>
<div class="profile-content">
  <h1 class="home-title" id="page-heading" data-i18n="profileHeading">Hi, I'm Mei. 👋</h1>
  <p class="intro-copy" data-i18n="profileDescription">Backend software engineer with 3 years of experience building reliable production systems in insurtech. I work across AI customer service, multi-agent orchestration and high-concurrency services—and I’m exploring more opportunities in Germany.</p>
  <div class="profile-links" aria-label="Social profiles">
    <!-- Inline GitHub and LinkedIn SVG links with aria-labels and visually hidden text. -->
  </div>
</div>
```

Use exact destinations `https://github.com/xiemeimeiaaa` and
`https://www.linkedin.com/in/mei-xie-7ab332301/`. Each SVG must include
`aria-hidden="true"`, and each link must contain a `.visually-hidden`
localized text label.

- [ ] **Step 5: Add exact bilingual strings and alt localization**

Add these translation values to `script.js`:

```js
// English
profileHeading: "Hi, I'm Mei. 👋",
profileDescription:
  "Backend software engineer with 3 years of experience building reliable production systems in insurtech. I work across AI customer service, multi-agent orchestration and high-concurrency services—and I’m exploring more opportunities in Germany.",
profileImageAlt: "Portrait of Mei",
linkedinLabel: "LinkedIn",
linkedinAria: "Visit Mei's LinkedIn profile",

// Chinese
profileHeading: "你好，我是 Mei。👋",
profileDescription:
  "拥有 3 年保险科技生产系统经验的后端软件工程师，专注于 AI 客服、多智能体编排与高并发服务，目前正在探索更多德国工作机会。",
profileImageAlt: "Mei 的个人照片",
linkedinLabel: "LinkedIn",
linkedinAria: "访问 Mei 的 LinkedIn 主页",
```

Extend `applyLanguage` with:

```js
for (const element of root.querySelectorAll("[data-i18n-alt]")) {
  const value = copy[element.dataset.i18nAlt];
  if (value !== undefined) element.setAttribute("alt", value);
}
```

- [ ] **Step 6: Run focused tests and verify they pass**

Run: `node --test tests/homepage-content.test.mjs tests/language.test.mjs`

Expected: all focused tests PASS.

- [ ] **Step 7: Commit the content implementation**

```bash
git add assets/mei-profile.png index.html script.js tests/homepage-content.test.mjs tests/language.test.mjs
git commit -m "Add bilingual homepage profile content"
```

### Task 2: Responsive profile presentation and visual validation

**Files:**
- Modify: `styles.css`
- Modify: `tests/site-layout.test.mjs`

**Interfaces:**
- Consumes: `.profile-intro`, `.profile-portrait-wrap`, `.profile-portrait`, `.profile-content`, `.profile-links`, `.profile-link`, and `.visually-hidden` markup from Task 1.
- Produces: responsive desktop and mobile profile presentation with a centered circular crop.

- [ ] **Step 1: Add failing CSS contract tests**

Add to `tests/site-layout.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the CSS contract test and verify failure**

Run: `node --test tests/site-layout.test.mjs`

Expected: FAIL because the profile style selectors do not exist.

- [ ] **Step 3: Add desktop profile styles**

Implement a two-column grid around `176px minmax(0, 1fr)`, align items in the
center, and use a restrained `32px` gap. Make the portrait wrapper and image
`176px` square. Apply `border-radius: 50%`, `object-fit: cover`, and an initial
`object-position` around `27% 52%`; adjust only after inspecting the rendered
crop. Add a subtle `1px solid var(--line)` border.

Style `.profile-links` as a horizontal row and `.profile-link` as an inline
44 px square target using `currentColor` SVG strokes/fills. Add the standard
off-screen `.visually-hidden` utility without using `display: none`.

- [ ] **Step 4: Add mobile profile styles**

Inside the existing `@media (max-width: 640px)` block, switch
`.profile-intro` to `grid-template-columns: 1fr`, center the portrait wrapper,
reduce it to `148px`, and center the social-link row. Keep profile text
left-aligned for reading. Confirm no rule changes the existing article list.

- [ ] **Step 5: Run all automated tests**

Run: `node --test tests/*.test.mjs`

Expected: all tests PASS.

- [ ] **Step 6: Render and inspect desktop and mobile screenshots**

Start `python3 -m http.server 8000`, render the homepage at approximately
`1440x1000` and `390x844`, and inspect both screenshots. Verify the face and
upper body are visually centered within the circle, text is not clipped, the
article list follows the profile naturally, and there is no horizontal
overflow. Adjust only `object-position` and profile spacing if needed, then
render both sizes again.

- [ ] **Step 7: Verify bilingual and link behavior in the browser**

Toggle to Chinese and confirm the heading, paragraph, portrait alt, and link
labels update. Activate the GitHub and LinkedIn links and confirm their exact
destinations. Check keyboard focus around both links.

- [ ] **Step 8: Commit the responsive presentation**

```bash
git add styles.css tests/site-layout.test.mjs
git commit -m "Style responsive homepage profile"
```

### Task 3: Final regression check

**Files:**
- Verify only; no expected source modifications.

**Interfaces:**
- Consumes: completed Tasks 1 and 2.
- Produces: evidence that the site is ready to publish.

- [ ] **Step 1: Run the complete test suite from a clean shell**

Run: `node --test tests/*.test.mjs`

Expected: all tests PASS with zero failures.

- [ ] **Step 2: Check repository scope and whitespace**

Run: `git diff --check && git status --short && git log -4 --oneline`

Expected: no whitespace errors; only intended profile work appears in the new
commits; no unrelated files are modified.

- [ ] **Step 3: Record the final screenshot paths and commit IDs**

Retain the desktop and mobile PNGs in a temporary verification directory and
report their absolute paths with the two implementation commit IDs. Publishing
or pushing is not part of this plan unless the user separately requests it.
