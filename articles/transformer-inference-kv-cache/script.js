export function selectActiveHeading(entries) {
  const visibleEntries = entries
    .filter((entry) => entry.isIntersecting)
    .sort((left, right) =>
      left.boundingClientRect.top - right.boundingClientRect.top
    );

  return visibleEntries[0]?.target.id ?? null;
}

function initializeArticleNavigation() {
  if (!("IntersectionObserver" in window)) return;

  const links = new Map(
    [...document.querySelectorAll('nav[aria-label="Article contents"] a')]
      .map((link) => [link.hash.slice(1), link]),
  );
  const headings = [...links.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const activeId = selectActiveHeading(entries);
      if (!activeId) return;

      for (const [id, link] of links) {
        if (id === activeId) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      }
    },
    { rootMargin: "-15% 0px -70%", threshold: 0 },
  );

  for (const heading of headings) observer.observe(heading);
}

if (typeof document !== "undefined" && typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeArticleNavigation, {
      once: true,
    });
  } else {
    initializeArticleNavigation();
  }
}
