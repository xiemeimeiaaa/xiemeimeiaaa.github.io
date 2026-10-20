import test from "node:test";
import assert from "node:assert/strict";

import {
  applyLanguage,
  resolveInitialLanguage,
  translations,
} from "../script.js";

test("stored language overrides the browser locale", () => {
  assert.equal(resolveInitialLanguage("zh", "en-US"), "zh");
  assert.equal(resolveInitialLanguage("en", "zh-CN"), "en");
});

test("browser locale selects Chinese only for zh locales", () => {
  assert.equal(resolveInitialLanguage(null, "zh-CN"), "zh");
  assert.equal(resolveInitialLanguage(null, "en-US"), "en");
});

test("invalid stored language falls back to the browser locale", () => {
  assert.equal(resolveInitialLanguage("invalid", "zh-CN"), "zh");
});

test("English and Chinese translations expose the same complete interface", () => {
  const expectedKeys = [
    "siteName",
    "articlesNav",
    "githubLabel",
    "linkedinLabel",
    "zhihuLabel",
    "primaryNavAria",
    "switchLabel",
    "kicker",
    "heading",
    "description",
    "profileHeading",
    "profileDescription",
    "profileImageAlt",
    "latest",
    "count",
    "topic",
    "date",
    "readingTime",
    "articleTitle",
    "articleSummary",
    "articleAria",
    "article2Date",
    "article2ReadingTime",
    "article2Title",
    "article2Summary",
    "article2Aria",
    "article3Date",
    "article3ReadingTime",
    "article3Title",
    "article3Summary",
    "article3Aria",
    "footer",
    "githubAria",
    "linkedinAria",
    "zhihuAria",
  ].sort();

  assert.deepEqual(Object.keys(translations.en).sort(), expectedKeys);
  assert.deepEqual(Object.keys(translations.zh).sort(), expectedKeys);
});

test("English profile copy preserves the approved introduction", () => {
  assert.equal(
    translations.en.profileDescription,
    "I’m a software engineer based in Tübingen with three years of experience building production backend systems and LLM-powered applications. I’m currently building infrastructure for running and evaluating coding agents, with a focus on reproducible experiments and trustworthy evaluation results. I’m also open to software engineering opportunities in Germany.",
  );
});

test("Chinese profile copy preserves the approved introduction", () => {
  assert.equal(
    translations.zh.profileDescription,
    "我是一名现居图宾根的软件工程师，拥有三年生产级后端系统与大语言模型应用开发经验。目前，我正在构建用于运行和评估编程智能体的基础设施，重点关注实验的可复现性和评估结果的可信度。同时，我也在寻找德国的软件工程师机会。",
  );
});

test("both locales expose exact Zhihu labels", () => {
  assert.equal(translations.en.zhihuLabel, "Zhihu");
  assert.equal(translations.en.zhihuAria, "Visit Mei's Zhihu profile");
  assert.equal(translations.zh.zhihuLabel, "知乎");
  assert.equal(translations.zh.zhihuAria, "访问 Mei 的知乎主页");
});

test("both locales describe the inference article", () => {
  assert.equal(translations.en.siteName, "XIE MEI / 谢媚");
  assert.equal(translations.zh.siteName, "XIE MEI / 谢媚");
  assert.equal(translations.en.githubAria, "Visit Xie Mei's GitHub profile");
  assert.equal(translations.zh.primaryNavAria, "主导航");
  assert.equal(
    translations.en.article2Title,
    "How Transformer LLMs Generate Text",
  );
  assert.equal(translations.zh.article2Title, "Transformer LLM 如何生成文本");
  assert.match(translations.en.article2Summary, /Prefill.*Decode.*KV cache/i);
  assert.match(translations.zh.article2Summary, /Prefill.*Decode.*KV Cache/i);
  assert.equal(translations.en.count, "3 articles");
  assert.equal(translations.zh.count, "3 篇文章");
});

test("both locales describe the Claude watermark article", () => {
  assert.equal(
    translations.en.article3Title,
    "How Claude’s Text Watermark Works",
  );
  assert.equal(translations.zh.article3Title, "Claude 文本水印如何工作");
  assert.match(translations.en.article3Summary, /secret.*key.*token.*sampling/i);
  assert.match(translations.zh.article3Summary, /密钥.*token.*采样/i);
});

test("applying a language updates visible copy, accessible labels, and document language", () => {
  const textNode = {
    dataset: { i18n: "heading" },
    textContent: "",
    lang: "",
    setAttribute(name, value) {
      if (name === "lang") this.lang = value;
    },
  };
  const ariaNode = {
    dataset: { i18nAria: "articleAria" },
    ariaLabel: "",
    setAttribute(name, value) {
      if (name === "aria-label") this.ariaLabel = value;
    },
  };
  const root = {
    documentElement: { lang: "en" },
    querySelectorAll(selector) {
      if (selector === "[data-i18n]") return [textNode];
      if (selector === "[data-i18n-aria]") return [ariaNode];
      return [];
    },
  };

  applyLanguage(root, "zh");

  assert.equal(textNode.textContent, "知识库");
  assert.equal(textNode.lang, "zh");
  assert.equal(ariaNode.ariaLabel, "阅读《初学 Transformer LLM》");
  assert.equal(root.documentElement.lang, "zh");
});

test("applying a language localizes the portrait alternative text", () => {
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
