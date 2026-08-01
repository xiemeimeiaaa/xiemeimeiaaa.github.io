# MEI / 梅 — Knowledge Library

A bilingual personal homepage and article index published at
<https://xiemeimeiaaa.github.io/>.

The first card links to the separately maintained
[`transformer-llms-for-beginners`](https://github.com/xiemeimeiaaa/transformer-llms-for-beginners)
article repository. This homepage does not copy or move that article.

English and Chinese copy lives in the `translations` object in `script.js`.
Add matching keys to both languages when changing interface text.

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

## Tests

```bash
node --test tests/language.test.mjs
```
