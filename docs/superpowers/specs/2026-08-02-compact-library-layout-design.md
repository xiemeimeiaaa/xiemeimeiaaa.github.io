# Compact Library Layout and Article Navigation Design

## Objective

Refine the existing bilingual Knowledge Library homepage so it feels compact,
balanced, and editorial without changing its content or visual identity. Move
the Transformer article's return control out of the article header and into a
small bottom-right position so it no longer pushes the title and body down the
page or covers text on narrow screens.

## Scope and Repository Boundaries

This refinement touches two existing GitHub Pages repositories:

- `xiemeimeiaaa.github.io`: homepage spacing and article-card layout;
- `transformer-llms-for-beginners`: return-link position, copy, and styling.

It does not change the bilingual language logic, article metadata, article
content, MathJax behavior, URLs, color palette, or publishing architecture.

## Homepage Layout

### Introduction and Section Rhythm

Keep the existing header, kicker, heading, and description. Tighten vertical
spacing so the article list appears sooner and the page reads as one connected
composition:

- reduce desktop introduction padding from `108px 0 84px` to `64px 0 48px`;
- reduce mobile introduction padding to `44px 0 36px`;
- set the kicker's bottom margin to `12px` and the heading's bottom margin to
  `16px`;
- reduce the article section's bottom padding from `132px` to `72px` on
  desktop and `52px` on mobile;
- set the footer minimum height to `88px` and its mobile vertical padding to
  `18px`.

The user-approved heading sizes remain unchanged:

- library heading: `clamp(1.25rem, 6vw, 4.4rem)`;
- article-card title: `clamp(1rem, 4vw, 2.65rem)`.

### Compact Article Card

Preserve the white rounded card, subtle border, shadow, topic badge, metadata,
summary, and full-card link target. Replace fixed-height composition with
content-driven layout:

- remove the `300px` desktop and `390px` mobile minimum heights;
- remove vertical `space-between` behavior;
- use `30px 32px 32px` desktop padding and `22px 22px 24px` mobile padding;
- place metadata above the article body with a `22px` gap;
- retain the title and summary as a compact text block;
- keep the arrow aligned to the lower right of the card, reduce it to `44px`,
  and avoid a separate mobile row that creates empty space;
- with the current English copy, keep the desktop card's rendered height within
  `190–220px`; let the mobile height remain content-dependent without clipping.

The card remains easy to scan and click, with its existing hover and keyboard
focus behavior. No new categories, controls, images, or placeholder articles
are introduced.

## Article Return Control

Remove the return navigation from the article header so the article begins
directly with its title. Float the control at the viewport's bottom-right only
when the viewport is wide enough to keep it outside the reading column; place
it at the article's bottom-right on narrower screens:

- visible copy: `返回主页 / Back to Library`;
- destination: `https://xiemeimeiaaa.github.io/`;
- fixed positioning above `1200px`, with `right: clamp(12px, 3vw, 28px)` and
  `bottom: calc(16px + env(safe-area-inset-bottom))`;
- absolute article-end positioning at `1200px` and below so the bilingual pill
  never covers mobile or tablet reading content;
- compact pill shape with a subtle white translucent surface, restrained
  border and shadow, and at least a `44px` touch target;
- inherit the article's font family and text rendering instead of introducing
  a separate UI font;
- remain visually quiet at rest and become clearer on hover or keyboard focus;
- use `calc(112px + env(safe-area-inset-bottom))` article bottom padding on
  desktop and `calc(104px + env(safe-area-inset-bottom))` on mobile so the
  final paragraph can scroll above the control rather than being permanently
  covered.

The link remains ordinary HTML navigation, so it works without JavaScript and
preserves browser-native behavior.

## Responsive and Accessibility Behavior

- The homepage and article must remain free of horizontal overflow at `390px`.
- Article metadata may wrap, but must not collide with the title or arrow.
- The return control must stay fully inside the viewport on wide desktop and
  inside the article boundary on narrower screens, including devices with a
  bottom safe area.
- Existing focus-visible and reduced-motion behavior remains intact.
- Both the full article card and floating return link retain at least a
  `44px` interactive target.
- English static fallback and bilingual homepage switching remain unchanged.

## Validation

- Run the existing five homepage language tests.
- Update the article navigation browser test to expect the new bilingual copy
  and verify the exact homepage destination.
- Use browser-computed styles to confirm that neither approved heading size was
  changed.
- Check desktop and `390px` mobile screenshots for card density, collisions,
  clipping, and unnecessary blank space.
- Scroll the article and verify the return control remains bottom-right outside
  the wide desktop reading column and appears after the final paragraph on
  narrower screens, without moving the title or causing horizontal overflow.
- Click the return control on the published article and confirm the browser
  reaches `https://xiemeimeiaaa.github.io/`.
- Confirm both Pages builds complete and both repositories are clean and synced.

## Non-Goals

- No content rewrite beyond the return-control label.
- No changes to the article's formulas, diagrams, typography scale, or prose.
- No new framework, JavaScript interaction, animation, navigation system,
  category structure, or article card.
