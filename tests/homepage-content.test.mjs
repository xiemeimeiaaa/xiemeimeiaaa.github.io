import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("homepage links to both Transformer articles", () => {
  assert.match(
    html,
    /href="articles\/transformer-llms-for-beginners\/"/,
  );
  assert.doesNotMatch(
    html,
    /href="https:\/\/xiemeimeiaaa\.github\.io\/transformer-llms-for-beginners\/"/,
  );
  assert.match(html, /articles\/transformer-inference-kv-cache\//);
  assert.equal((html.match(/class="post-entry"/g) ?? []).length, 2);
  assert.doesNotMatch(html, /class="article-card"/);
});

test("post list exposes localized copy and accessible labels", () => {
  for (const key of [
    "article2Title",
    "article2Summary",
    "article2Aria",
    "article2ReadingTime",
    "article2Date",
  ]) {
    assert.match(html, new RegExp(`data-i18n(?:-aria)?="${key}"`));
  }
});

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

test("profile links expose three ordered outline brand icons", () => {
  const profileStart = html.indexOf('class="profile-links"');
  const githubIndex = html.indexOf(
    'href="https://github.com/xiemeimeiaaa"',
    profileStart,
  );
  const linkedinIndex = html.indexOf(
    'href="https://www.linkedin.com/in/mei-xie-7ab332301/"',
    githubIndex,
  );
  const zhihuIndex = html.indexOf(
    'href="https://www.zhihu.com/people/wasabimiao-miao-miao"',
    linkedinIndex,
  );

  assert.ok(githubIndex > profileStart);
  assert.ok(linkedinIndex > githubIndex);
  assert.ok(zhihuIndex > linkedinIndex);
  assert.equal((html.match(/class="profile-link"/g) ?? []).length, 3);
  assert.equal((html.match(/stroke="currentColor"/g) ?? []).length, 3);
  assert.equal((html.match(/stroke-width="2"/g) ?? []).length, 3);
  assert.equal((html.match(/stroke-linecap="round"/g) ?? []).length, 3);
  assert.equal((html.match(/stroke-linejoin="round"/g) ?? []).length, 3);
});
