---
layout: post
title: Proof of a formula for modulo
category: en
---

{{ page.title }}
================

$$ 16^{54} \mod 17 = 3^{24 \times 54} \mod 17 $$

Why?

[Public Key Cryptography: Diffie-Hellman Key Exchange (short version) - YouTube](https://www.youtube.com/watch?v=3QnD2c4Xovk) is a good video to understand asymmetric cryptography. There is a jump from 4:34 in the video that is not obvious to everyone.

The jump is from $$ 16^{54} \mod 17 $$ to $$ 3^{24 \times 54} \mod 17 $$, but why? From the comments of video, I'm not the only one who is supprised by this jump.

First let me introduce a formula:

{% include mathjax.html %}

$$ a^b \mod p = ((a \mod p) ^ b) \mod p \tag{1} $$


Then the proof:

There must be one integer `n` to have

$$ a \mod p = a - np \tag{2} $$

so

$$ ((a \mod p) ^ b) \mod p = ((a-np)^b) \mod p $$

With [Binomial theorem - Wikipedia](https://en.wikipedia.org/wiki/Binomial_theorem),

$$ (a-np)^b = a^b + {b\choose 1}a^{b-1}(-np) + {b\choose 2}a^{b-2}(-np)^2 + ... + (-np)^b $$

We could see that all items are times of `p` except $$ a^b $$,

$$
\begin{align} ((a-np)^b \mod p)
& = (a^b + {b\choose 1}a^{b-1}(-np) + {b\choose 2}a^{b-2}(-np)^2 + ... + (-np)^b) \mod p \\
& = a^b \mod p + 0 + 0 + ... + 0
\end{align}
$$

Now we got

$$ ((a-np)^b \mod p) = a^b \mod p $$

Use formula (2)

$$ ((a \mod p) ^ b) \mod p = a^b \mod p $$

Now let a as $$ 3^{24} $$, and b as 54 in formula (1):

$$
\begin{align} 3^{24 \times 54} \mod 17
& = ((3^{24})^{54}) \mod 17 \\
& = ((3^{24} \mod 17)^{54}) \mod 17 \\
& = 16^{54} \mod 17
\end{align}
$$
