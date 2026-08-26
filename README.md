# MEI / 梅 — Knowledge Library

A bilingual personal homepage and article index published at
<https://xiemeimeiaaa.github.io/>.

The homepage currently features three long-form guides maintained in this
repository:

- [`How Transformer LLMs Generate Text: Inference and the KV Cache`](https://xiemeimeiaaa.github.io/articles/transformer-inference-kv-cache/), maintained in this repository under `articles/transformer-inference-kv-cache/`.
- [`Transformer LLMs for Beginners`](https://xiemeimeiaaa.github.io/articles/transformer-llms-for-beginners/), maintained under `articles/transformer-llms-for-beginners/`.
- [`How Claude’s Text Watermark Works`](https://xiemeimeiaaa.github.io/articles/claude-text-watermark/), maintained in this repository under `articles/claude-text-watermark/`.

English and Chinese copy lives in the `translations` object in `script.js`.
Add matching keys to both languages when changing interface text.

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

## Tests

```bash
node --test tests/*.test.mjs
```
