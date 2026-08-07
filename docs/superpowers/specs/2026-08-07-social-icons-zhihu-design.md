# Social Icons and Zhihu Link Design

## Objective

Update the homepage profile links so the GitHub and LinkedIn icons match the
outline style used by `steipete.me`, add Mei's Zhihu profile, and reproduce the
reference's subtle hover rotation without adding a runtime dependency.

## Icon System

Use inline 24×24 Tabler-style SVGs with these shared attributes:

- `viewBox="0 0 24 24"`
- `fill="none"`
- `stroke="currentColor"`
- `stroke-width="2"`
- `stroke-linecap="round"`
- `stroke-linejoin="round"`
- `aria-hidden="true"`

Replace the current filled GitHub and LinkedIn paths with the same outline
paths used by the reference site. Add the Tabler `brand-zhihu` outline icon so
all three links share one visual language. Keep the SVGs inline to avoid an
icon font, external CDN, additional network requests, or JavaScript.

The displayed order is GitHub, LinkedIn, then Zhihu. Destinations are:

- GitHub: `https://github.com/xiemeimeiaaa`
- LinkedIn: `https://www.linkedin.com/in/mei-xie-7ab332301/`
- Zhihu: `https://www.zhihu.com/people/wasabimiao-miao-miao`

## Interaction and Layout

Keep the existing 44×44 px link targets and current horizontal spacing. Set
each SVG to 24×24 px and scale it to `1.25` on desktop and `1.1` at the existing
mobile breakpoint, matching the reference. At rest, icons use the muted text
color. On pointer hover, the link changes to the existing accent color and
rotates clockwise by 6 degrees with a short, restrained transition.

Keyboard focus continues to use the site's existing visible focus outline.
When `prefers-reduced-motion: reduce` is active, disable the transform
transition and hover rotation while preserving the color change.

## Bilingual and Accessible Labels

Add `zhihuLabel` and `zhihuAria` to both translation objects:

- English visible/screen-reader label: `Zhihu`
- English accessible label: `Visit Mei's Zhihu profile`
- Chinese visible/screen-reader label: `知乎`
- Chinese accessible label: `访问 Mei 的知乎主页`

Each link retains a localized `aria-label` and a visually hidden localized
text label. The SVGs remain decorative to assistive technology.

## Validation

- Add a failing test for the exact Zhihu URL and new translation keys before
  implementation.
- Add a failing style contract test for outline SVG styling, 6-degree hover
  rotation, and reduced-motion suppression before implementation.
- Run the complete Node test suite after implementation.
- Inspect desktop and 390 px mobile layouts to confirm all three icons fit,
  align consistently, and remain usable without horizontal overflow.
- Verify English and Chinese labels and confirm the three exact destinations.
- Verify hover color and rotation, keyboard focus, and reduced-motion behavior.

## Non-Goals

- Do not change the header's textual GitHub navigation link.
- Do not add other social networks, open links in forced new tabs, or introduce
  an external icon package.
- Do not change the profile portrait, introduction copy, article list, or
  publishing architecture.
