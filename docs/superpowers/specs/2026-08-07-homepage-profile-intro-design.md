# Homepage Profile Introduction Design

## Objective

Replace the homepage's generic knowledge-library introduction with a concise,
personal profile section inspired by the supplied reference. The new section
should introduce Mei as a backend software engineer, show her portrait in a
well-composed circular crop, and provide direct GitHub and LinkedIn links while
preserving the site's existing bilingual article library.

## Content

The English profile heading is:

> Hi, I'm Mei. 👋

The approved English introduction is reproduced exactly:

> Backend software engineer with 3 years of experience building reliable
> production systems in insurtech. I work across AI customer service,
> multi-agent orchestration and high-concurrency services—and I’m exploring
> more opportunities in Germany.

The corresponding Chinese introduction is:

> 拥有 3 年保险科技生产系统经验的后端软件工程师，专注于 AI 客服、多智能体编排与高并发服务，目前正在探索更多德国工作机会。

The Chinese heading is:

> 你好，我是 Mei。👋

The profile exposes two social links:

- GitHub: `https://github.com/xiemeimeiaaa`
- LinkedIn: `https://www.linkedin.com/in/mei-xie-7ab332301/`

No email address or additional social network is displayed.

## Layout and Styling

On desktop, the profile is a two-column introduction within the existing
`site-shell`: a circular portrait on the left and the heading, description,
and social links on the right. It follows the reference's composition without
copying its larger page width or adding unrelated controls. The existing
monospace typography, color palette, borders, and restrained editorial style
remain unchanged.

The portrait uses the supplied source image and a CSS circular crop. Its focal
position is adjusted so Mei's face and upper body sit at the visual center of
the circle despite their left-of-frame position in the original landscape
photo. The source photo remains unedited and is stored as a local site asset.

GitHub and LinkedIn appear as compact icon links with visible accessible names
for screen readers and clear hover and keyboard-focus states. No external icon
font or runtime dependency is introduced.

The existing Articles section follows directly after the profile. Its article
count, entries, metadata, and URLs remain unchanged.

## Responsive Behavior

At narrow widths, the profile becomes a single-column composition. The portrait
is centered above the text, and the heading, copy, and social links remain
readable without horizontal overflow. The portrait scales down while retaining
the same focal position. Touch targets remain at least 44 pixels.

The existing header behavior at 640 px and 360 px remains intact. The profile
must work in both languages without clipping or layout collisions.

## Bilingual Behavior and Accessibility

The new heading, description, and social-link labels are added to both language
objects in `script.js`. Static English fallback content remains present in the
HTML so the profile works without JavaScript. The portrait includes concise
alternative text in the static markup, and its accessible label is localized
when the language changes.

Semantic section labeling, visible focus styles, reduced-motion behavior, and
the existing skip link are preserved. Social links open through ordinary HTML
navigation and do not require JavaScript.

## Validation

- Add or update automated tests for the profile content, portrait asset,
  localized strings, and exact GitHub and LinkedIn destinations.
- Run all existing Node tests.
- Preview at desktop and mobile widths, including 390 px, and confirm there is
  no horizontal overflow or text collision.
- Verify the portrait's circular crop keeps Mei visually centered on desktop
  and mobile.
- Toggle English and Chinese and verify all profile copy and accessible labels.
- Click both social links and confirm their destinations.

## Non-Goals

- No email link, résumé download, dark-mode control, new framework, or external
  icon library.
- No changes to article content, article ordering, publishing architecture, or
  the existing language-selection behavior.
- No destructive edits to the supplied source photograph.
