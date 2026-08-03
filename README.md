# MEI / 梅 — Knowledge Library

A bilingual personal homepage and article index published at
<https://xiemeimeiaaa.github.io/>.

The homepage currently features two long-form Transformer guides:

- [`How Transformer LLMs Generate Text: Inference and the KV Cache`](https://xiemeimeiaaa.github.io/articles/transformer-inference-kv-cache/), maintained in this repository under `articles/transformer-inference-kv-cache/`.
- [`How Transformer LLMs Work`](https://xiemeimeiaaa.github.io/transformer-llms-for-beginners/), maintained in its own article repository and linked from this homepage.

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
