export const translations = {
  en: {
    siteName: "XIE MEI / 谢媚",
    articlesNav: "Articles",
    githubLabel: "GitHub",
    switchLabel: "中文 · EN",
    kicker: "WRITING & NOTES",
    heading: "Knowledge Library",
    description:
      "Clear explanations of language models, AI agents, and software engineering—built from first principles.",
    latest: "Articles",
    count: "2 articles",
    topic: "LLMs",
    date: "AUG 2026",
    readingTime: "15 MIN READ",
    articleTitle: "Transformer LLMs for Beginners",
    articleSummary:
      "From tokens and attention to logits, loss, backpropagation, and weight updates.",
    articleAria: "Read “Transformer LLMs for Beginners”",
    article2Date: "AUG 2026",
    article2ReadingTime: "18 MIN READ",
    article2Title: "How Transformer LLMs Generate Text",
    article2Summary:
      "Prefill, Decode, the KV cache, and prompt caching—from compute savings to memory trade-offs.",
    article2Aria: "Read “How Transformer LLMs Generate Text”",
    footer: "More writing will appear here over time.",
    githubAria: "Visit Xie Mei's GitHub profile",
    primaryNavAria: "Primary navigation",
  },
  zh: {
    siteName: "XIE MEI / 谢媚",
    articlesNav: "文章",
    githubLabel: "GitHub",
    switchLabel: "中文 · EN",
    kicker: "写作与笔记",
    heading: "知识库",
    description: "从第一性原理出发，清晰解释大语言模型、AI Agent 与软件工程。",
    latest: "文章",
    count: "2 篇文章",
    topic: "LLMs",
    date: "2026年8月",
    readingTime: "阅读约 15 分钟",
    articleTitle: "初学 Transformer LLM",
    articleSummary:
      "从 token 与注意力机制，到 logits、损失、反向传播和权重更新。",
    articleAria: "阅读《初学 Transformer LLM》",
    article2Date: "2026年8月",
    article2ReadingTime: "阅读约 18 分钟",
    article2Title: "Transformer LLM 如何生成文本",
    article2Summary:
      "从 Prefill、Decode 与 KV Cache，到计算节省、显存代价和 Prompt Cache。",
    article2Aria: "阅读《Transformer LLM 如何生成文本》",
    footer: "更多文章会陆续整理在这里。",
    githubAria: "访问谢媚的 GitHub 主页",
    primaryNavAria: "主导航",
  },
};

export function resolveInitialLanguage(storedLanguage, browserLanguage = "") {
  if (storedLanguage === "en" || storedLanguage === "zh") {
    return storedLanguage;
  }

  return browserLanguage.toLowerCase().startsWith("zh") ? "zh" : "en";
}

export function applyLanguage(root, language) {
  const selectedLanguage = language === "zh" ? "zh" : "en";
  const copy = translations[selectedLanguage];

  for (const element of root.querySelectorAll("[data-i18n]")) {
    const value = copy[element.dataset.i18n];
    if (value !== undefined) {
      element.textContent = value;
      element.setAttribute("lang", selectedLanguage);
    }
  }

  for (const element of root.querySelectorAll("[data-i18n-aria]")) {
    const value = copy[element.dataset.i18nAria];
    if (value !== undefined) element.setAttribute("aria-label", value);
  }

  root.documentElement.lang = selectedLanguage;
  return selectedLanguage;
}

function readStoredLanguage() {
  try {
    return window.localStorage.getItem("preferred-language");
  } catch {
    return null;
  }
}

function saveStoredLanguage(language) {
  try {
    window.localStorage.setItem("preferred-language", language);
  } catch {
    // The visible language switch still works when storage is unavailable.
  }
}

function initializeLanguageSwitching() {
  let activeLanguage = resolveInitialLanguage(
    readStoredLanguage(),
    window.navigator.language,
  );
  activeLanguage = applyLanguage(document, activeLanguage);

  const switchButton = document.querySelector("[data-language-switch]");
  switchButton?.addEventListener("click", () => {
    activeLanguage = applyLanguage(
      document,
      activeLanguage === "en" ? "zh" : "en",
    );
    saveStoredLanguage(activeLanguage);
  });
}

if (typeof document !== "undefined" && typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeLanguageSwitching, {
      once: true,
    });
  } else {
    initializeLanguageSwitching();
  }
}
