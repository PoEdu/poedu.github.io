import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as a,c as s,f as e}from"./app-7fdc7960.js";const c={},i=e(`<h1 id="静态链接-static-linking" tabindex="-1"><a class="header-anchor" href="#静态链接-static-linking" aria-hidden="true">#</a> 静态链接（Static Linking）</h1><p>库是模块化软件开发中必不可少的概念，它将一下相关功能的代码组织在一起，使得程序员可以很方便地使用它们。链接（Linking）在做的事就是把各个模块之间相互引用的部分处理好，使得各个模块之间能够找到各自定义的符号。</p><p>假设我们正在模块<code>main.c</code>中使用另一个模块<code>func.c</code>中的<code>foo()</code>函数。我们在<code>main.c</code>模块中每一处调用<code>foo</code>时都必须确切知道<code>foo</code>函数的地址。但由于每个模块都是单独编译的。编译器在编译<code>main.c</code>的时候并不知道<code>foo</code>函数的地址。所以编译器会暂时把这些调用<code>foo</code>的指令的目标地址搁置，等待最后链接时由链接器将这些指令的目标地址修正。这就是静态链接最基本的过程和作用。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token comment">// main.c</span>
<span class="token keyword">extern</span> <span class="token keyword">void</span> <span class="token function">foo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">int</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">foo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token comment">// func.c</span>
<span class="token keyword">void</span> <span class="token function">foo</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Hello World!&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面我们使用gcc编译器来进行静态链接。首先我们需要将<code>main.c</code>和<code>func.c</code>编译成目标文件，然后再将目标文件链接成可执行文件。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ gcc <span class="token parameter variable">-c</span> main.c <span class="token parameter variable">-o</span> main.o
$ gcc <span class="token parameter variable">-c</span> func.c <span class="token parameter variable">-o</span> func.o
$ gcc main.o func.o <span class="token parameter variable">-o</span> main  <span class="token comment"># 静态链接</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们可以使用<code>nm</code>命令来查看目标文件中的符号信息。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ nm main.o

0000000000000000 T main
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ nm func.o

0000000000000000 T foo
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10),o=[i];function t(d,l){return a(),s("div",null,o)}const r=n(c,[["render",t],["__file","(1)静态链接.html.vue"]]);export{r as default};
