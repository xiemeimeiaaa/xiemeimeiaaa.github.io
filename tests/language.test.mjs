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
    "switchLabel",
    "kicker",
    "heading",
    "description",
    "latest",
    "count",
    "topic",
    "date",
    "readingTime",
    "articleTitle",
    "articleSummary",
    "articleAria",
    "footer",
    "githubAria",
  ].sort();

  assert.deepEqual(Object.keys(translations.en).sort(), expectedKeys);
  assert.deepEqual(Object.keys(translations.zh).sort(), expectedKeys);
});

test("applying a language updates visible copy, accessible labels, and document language", () => {
  const textNode = { dataset: { i18n: "heading" }, textContent: "" };
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
  assert.equal(ariaNode.ariaLabel, "阅读《初学 Transformer LLM》");
  assert.equal(root.documentElement.lang, "zh");
});
