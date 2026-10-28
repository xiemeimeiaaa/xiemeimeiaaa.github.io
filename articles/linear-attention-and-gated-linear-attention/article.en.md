# What Are Linear Attention and Gated Linear Attention?

Standard attention has a computational complexity of $O(N^2)$, which makes processing long token sequences expensive. Linear attention was introduced to address this cost: “linear” means $O(N)$, so computation grows only linearly with sequence length. Gated linear attention adds a gate that controls how much information from earlier tokens is forgotten. How do these mechanisms work? Let’s walk through them.

## 1. Reviewing Standard Self-Attention

### 1.1 A brief recap of attention

For a single attention head, assume the sequence length is $N$:

$$
Q,K\in\mathbb{R}^{N\times d_k},\qquad V\in\mathbb{R}^{N\times d_v}
$$

- **Q (Query):** the features a token uses to look for information.
- **K (Key):** the features past tokens provide for a query to match against.
- **V (Value):** the content to aggregate after matching.

Standard scaled dot-product attention is:

$$
O=\operatorname{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

The output vector $o_t$ for token $t$ is:

$$
o_t=\sum_{i=1}^{t}\alpha_{ti}v_i
$$

Here, $\alpha_{ti}$ is the attention weight that token $t$ assigns to token $i$:

$$
\alpha_{ti}=\frac{\exp(q_t^\top k_i/\sqrt{d_k})}{\sum_{j=1}^{t}\exp(q_t^\top k_j/\sqrt{d_k})}
$$

The term $q_t^\top k_i$ is the dot product of query $t$ and key $i$. Softmax converts matching scores into nonnegative weights that sum to 1, while $\sqrt{d_k}$ controls the scale of those scores.

### 1.2 Where does the O(N²) complexity come from?

First, recall how we derive the complexity of matrix multiplication. Suppose we have two matrices:

$$
A\in\mathbb{R}^{m\times k},\quad B\in\mathbb{R}^{k\times n}
$$

Their product is:

$$
C=AB\in\mathbb{R}^{m\times n}
$$

The computation proceeds as follows:

1. The result matrix C contains m × n elements.
2. Each element is the dot product of a row and a column, both of length k.
3. Each dot product requires **k multiplications and (k − 1) additions**.

The total operation count is therefore approximately:

$$
(m\times n)\times(2k-1)
$$

Ignoring constants and lower-order terms gives the time complexity:

$$
\boxed{O(mkn)}
$$

As noted above, $Q,K\in\mathbb{R}^{N\times d_k}$, so computing $QK^\top$ costs:

$$
(N\times d_k)(d_k\times N)\Longrightarrow O(N^2d_k)
$$

Multiplying the post-softmax matrix $A\in\mathbb R^{N\times N}$ by $V$ costs:

$$
(N\times N)(N\times d_v)\Longrightarrow O(N^2d_v)
$$

The dominant computational complexity is therefore:

$$
\boxed{O(N^2d_k+N^2d_v)}
$$

When $d_k$ and $d_v$ are fixed, we can write this as $O(N^2)$. Doubling the sequence length roughly quadruples the dominant computation. A causal mask changes only the constant factor, not the asymptotic order.

## 2. How Linear Attention Reduces Computational Complexity

### 2.1 The associativity of matrix multiplication

Let’s temporarily remove softmax and apply the associativity of matrix multiplication:

$$
(QK^\top)V=Q(K^\top V)
$$

On the left, the intermediate result $QK^\top$ has shape $N\times N$. On the right, we can aggregate first and obtain a fixed-size matrix:

$$
K^\top V\in\mathbb R^{d_k\times d_v}
$$

The two matrix multiplications on the right have a combined complexity of $O(Nd_kd_v)$. With fixed feature dimensions, this grows linearly with the sequence length $N$.

But actual attention is $\operatorname{softmax}(QK^\top)V$. Softmax computes $\operatorname{softmax}(s_i)=e^{s_i}/\sum_j e^{s_j}$: it exponentiates each score and normalizes using scores across all keys. In general:

$$
\operatorname{softmax}(QK^\top)V\neq Q(K^\top V)
$$

Linear attention therefore typically redefines the similarity function.

### 2.2 Redefining similarity with a feature map

A typical approach is to define query–key similarity as:

$$
\operatorname{sim}(q,k)=\phi(q)^\top\phi(k)
$$

The **feature map** $\phi$ transforms the input vectors into a new feature space. Similarity remains a dot product of two vectors, which allows past keys and values to be aggregated in advance.

A classic choice is:

$$
\phi(x)=\operatorname{ELU}(x)+1
$$

Applied element by element:

$$
\phi(x)=\begin{cases}x+1,&x>0\\e^x,&x\le 0\end{cases}
$$

This mapping produces positive features, so $\phi(q)^\top\phi(k)>0$, making it convenient to define nonnegative, normalized attention weights.

**Why use positive values here?** If we normalize potentially negative dot products by their sum, positive and negative terms may cancel, making the denominator zero or close to zero. The resulting weights may also be negative. A positive feature map avoids this sign-cancellation problem, although floating-point implementations may still need to handle denominators close to zero.

**How do researchers find $\phi$?** They can design it by hand, as with ELU + 1; derive it from a particular kernel; construct it using random features; or learn it as part of a model. For example, one family of designs used in Performer aims for:

$$
\phi(q)^\top\phi(k)\approx\exp(q^\top k/\sqrt{d_k})
$$

This approximates the exponential kernel used by softmax. ELU + 1 usually defines a different similarity function; it is not guaranteed to equal or approximate the original softmax kernel. Linear attention may therefore trade some expressiveness for efficiency on long sequences. **This does not mean a trained linear-attention model must perform worse than a Transformer with softmax attention. During training, the model can adjust its Q/K/V projections and other parameters to adapt to the new attention mechanism.**

Can we simply replace softmax with ELU + 1 in an already trained Transformer?

Usually, we cannot make that replacement and expect the model’s behavior to stay the same. The pretrained parameters were learned under the computational rules of softmax attention. If we directly replace:

$$
\operatorname{softmax}(QK^\top)V \longrightarrow \operatorname{LinearAttention}(Q,K,V)
$$

the output distribution of each layer may change. These changes can accumulate across layers and degrade model performance.

We therefore usually need to:

- Train a model with linear attention from scratch; or
- Use a suitable architecture conversion, distillation, and continued training to help the model adapt.

This is why linear attention is an architectural choice, rather than merely a GPU acceleration algorithm that can freely replace softmax.

### 2.3 Implementing causal linear attention

Causal attention means token $t$ can attend only to itself and earlier tokens. Notice that the following sums run from $i=1$ through $t$, preserving causality.

For normalized linear attention:

$$
o_t=\frac{\sum_{i=1}^{t}[\phi(q_t)^\top\phi(k_i)]v_i}{\sum_{i=1}^{t}\phi(q_t)^\top\phi(k_i)}
$$

Factoring $\phi(q_t)$ out of the sums gives:

$$
o_t^\top=\frac{\phi(q_t)^\top\left(\sum_{i=1}^{t}\phi(k_i)v_i^\top\right)}{\phi(q_t)^\top\left(\sum_{i=1}^{t}\phi(k_i)\right)}
$$

Define:

$$
S_t=\sum_{i=1}^{t}\phi(k_i)v_i^\top,\qquad z_t=\sum_{i=1}^{t}\phi(k_i)
$$

Then:

$$
\boxed{o_t^\top=\frac{\phi(q_t)^\top S_t}{\phi(q_t)^\top z_t}}
$$

Both states can be updated recurrently:

$$
S_t=S_{t-1}+\phi(k_t)v_t^\top,\qquad z_t=z_{t-1}+\phi(k_t)
$$

The state size depends on the feature-map dimension $d_\phi$ and the value dimension $d_v$. It does not grow with the number of past tokens.

### 2.4 Is linear attention an RNN?

The general form of a recurrent neural network (RNN) is:

$$
h_t=f(h_{t-1},x_t)
$$

The current linear-attention state $S_t$ depends on the previous state $S_{t-1}$ and the current keys and values, so its computation is also recurrent. Compared with a traditional RNN, the state here is typically a matrix, and the current query reads information from that state.

## 3. Gated Linear Attention: Adding Forgetting to the State

Take the identity feature map $\phi(x)=x$ and omit the normalization state $z_t$:

$$
S_t=S_{t-1}+k_tv_t^\top,\qquad o_t^\top=q_t^\top S_t
$$

This changes the attention mechanism from the normalized version discussed above. The weights likewise need to adapt to the new architecture; equivalent behavior does not follow automatically.

Historical key–value outer products keep accumulating, with no explicit forgetting mechanism. GLA introduces a gate so that the model can decide which parts of the old state should decay:

$$
S_t=G_tS_{t-1}+k_tv_t^\top
$$

### 3.1 An example of gating

$$
\boxed{S_t=\operatorname{diag}(e^{g_t})S_{t-1}+k_tv_t^\top}
$$

$$
\boxed{o_t^\top=\frac{q_t^\top S_t}{\sqrt{d_k}}}
$$

Here:

- $S_t\in\mathbb R^{d_k\times d_v}$ is the current aggregate memory state.
- $g_t\in\mathbb R^{d_k}$ is a **log-space gate** that controls decay along the key-feature dimension. A neural network computes the gate from the current token’s content, determining how much old memory to retain.
- $k_tv_t^\top$ is the outer product written into the state by the current token.
- $q_t$ is the query the current token uses to read the state.
- $\operatorname{diag}$ places a vector on the main diagonal of a square matrix.

For example:

$$
e^{g_t}=\begin{bmatrix}0.9\\0.5\\0.1\end{bmatrix},\qquad \operatorname{diag}(e^{g_t})=\begin{bmatrix}0.9&0&0\\0&0.5&0\\0&0&0.1\end{bmatrix}
$$

Left-multiplying $S_{t-1}$ by this matrix scales the first row by 0.9, the second by 0.5, and the third by 0.1.

### 3.2 How historical information gradually decays

Let $G_t=\operatorname{diag}(e^{g_t})$ and assume $S_0=0$. Then:

$$
S_1=k_1v_1^\top
$$

$$
S_2=G_2k_1v_1^\top+k_2v_2^\top
$$

$$
S_3=G_3G_2k_1v_1^\top+G_3k_2v_2^\top+k_3v_3^\top
$$

$$
S_4=G_4G_3G_2k_1v_1^\top+G_4G_3k_2v_2^\top+G_4k_3v_3^\top+k_4v_4^\top
$$

For an arbitrary step $t$:

$$
\boxed{S_t=\sum_{i=1}^{t}\left(\prod_{j=i+1}^{t}G_j\right)k_iv_i^\top}
$$

The symbol $\prod$ denotes a product of successive terms. Substituting into $o_t^\top=q_t^\top S_t/\sqrt{d_k}$ gives:

$$
o_t^\top=\frac{q_t^\top}{\sqrt{d_k}}\sum_{i=1}^{t}\left(\prod_{j=i+1}^{t}G_j\right)k_iv_i^\top
$$

Matrix multiplication distributes over addition, so we can move $q_t^\top$ inside the sum:

$$
o_t^\top=\frac{1}{\sqrt{d_k}}\sum_{i=1}^{t}q_t^\top\left(\prod_{j=i+1}^{t}G_j\right)k_iv_i^\top
$$

Look at this part:

$$
\underbrace{q_t^\top\left(\prod_{j=i+1}^{t}G_j\right)k_i}_{\text{a scalar}}
$$

Its dimensions follow:

$$
\underbrace{q_t^\top}_{1\times d_k}\underbrace{G_j}_{d_k\times d_k}\underbrace{k_i}_{d_k\times 1}
$$

The product is a single number that we can interpret as a weight. GLA can still be understood as a weighted sum of past values, but the effective weight of each historical position also depends on the intervening gates. Gate values close to 1 let information persist longer; values consistently below 1 gradually attenuate it.

## 4. Comparing the Three Attention Mechanisms

| Aspect | Standard softmax attention | Linear attention | Gated linear attention (the formulation here) |
| --- | --- | --- | --- |
| Historical information | Stores and matches against past K/V | Aggregates past K/V into a fixed-size state | Fixed-size state with dynamic forgetting |
| Weights | Nonnegative and sum to 1 after softmax | Depends on the variant | No cross-token softmax normalization |
| Autoregressive cache | Grows with the token count | Fixed-size state | Fixed-size state |
| Complexity in sequence length, with fixed dimensions | O(N²) | O(N) | O(N) |
| Explicit forgetting | No dedicated state-forgetting gate | None in the basic formulation | Uses a gate |
| Main challenges | High cost for long sequences | State capacity and retrieval interference | State capacity, decay, and GPU parallel efficiency |

The three core expressions are:

**Standard softmax attention**

$$
O=\operatorname{softmax}(QK^\top/\sqrt{d_k})V
$$

**Simple, unnormalized linear attention**

$$
S_t=S_{t-1}+k_tv_t^\top,\qquad o_t^\top=q_t^\top S_t
$$

**Gated linear attention**

$$
S_t=\operatorname{diag}(e^{g_t})S_{t-1}+k_tv_t^\top,\qquad o_t^\top=\frac{q_t^\top S_t}{\sqrt{d_k}}
$$

Standard attention accesses past tokens directly. Linear attention compresses history into a fixed-size state. GLA adds selective forgetting to that state.

For further discussion, see [Gated DeltaNet: The Linear Attention Mechanism Used by Qwen and Kimi](https://zhuanlan.zhihu.com/p/1971671251123705351) (in Chinese).

## References

1. [Attention Is All You Need — Vaswani et al. (2017)](https://arxiv.org/abs/1706.03762)
2. [Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention (ICML 2020)](https://proceedings.mlr.press/v119/katharopoulos20a.html)
3. [Gated Linear Attention Transformers with Hardware-Efficient Training (ICML 2024)](https://proceedings.mlr.press/v235/yang24ab.html)
