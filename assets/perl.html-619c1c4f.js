import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as c,o as i,c as r,a as d,w as a,e as s,f as l,d as n}from"./app-7fdc7960.js";const u={},k=l(`<h1 id="perl-极速教程" tabindex="-1"><a class="header-anchor" href="#perl-极速教程" aria-hidden="true">#</a> Perl 极速教程</h1><p>Perl是一门古老的通用编程脚本语言，内部集成了好用的正则表达式功能，python，php等语言在后来的发展中极大的借鉴了perl的很多设计思想。如果你学习过PHP，那么你会发现很多语法都是极其相似的。</p><h2 id="安装与环境配置" tabindex="-1"><a class="header-anchor" href="#安装与环境配置" aria-hidden="true">#</a> 安装与环境配置</h2><p>一般如果你在使用linux时，系统往往已经自带了perl，你可以用 <code>perl -v</code>来查看perl是否安装并显示其版本信息：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ perl <span class="token parameter variable">-v</span>

This is perl <span class="token number">5</span>, version <span class="token number">18</span>, subversion <span class="token number">2</span> <span class="token punctuation">(</span>v5.18.2<span class="token punctuation">)</span> built <span class="token keyword">for</span> darwin-thread-multi-2level
<span class="token punctuation">(</span>with <span class="token number">2</span> registered patches, see perl <span class="token parameter variable">-V</span> <span class="token keyword">for</span> <span class="token function">more</span> detail<span class="token punctuation">)</span>

Copyright <span class="token number">1987</span>-2013, Larry Wall
……
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果没有，那么你需要下载安装perl语言，可以访问 <code>https://www.perl.org/get.html</code>来获取最新 Perl解释器。</p><p>你可以在命令行下输入 <code>perl -e &lt;perl code&gt;</code> 或 <code>perl &lt;perl-script.pl&gt;</code>来执行一段perl代码。一般perl脚本的后缀是 <code>*.pl</code></p><p>或者在Linux下，你可以把一个脚本的解释器写在脚本开头</p><div class="language-perl line-numbers-mode" data-ext="perl"><pre class="language-perl"><code><span class="token comment">#!/usr/env perl</span>

<span class="token keyword">print</span> <span class="token string">&quot;Hello world~!\\n&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="基础语法" tabindex="-1"><a class="header-anchor" href="#基础语法" aria-hidden="true">#</a> 基础语法</h2><p>下面是一些基础语法的示例，调用函数：</p><div class="language-perl line-numbers-mode" data-ext="perl"><pre class="language-perl"><code><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&quot;Hello, world\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">print</span> <span class="token string">&quot;Hello, world\\n&quot;</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>注释有两种，单行或多行:</p><div class="language-perl line-numbers-mode" data-ext="perl"><pre class="language-perl"><code><span class="token comment"># 这是一个单行注释</span>
<span class="token keyword">print</span> <span class="token string">&quot;Hello, world\\n&quot;</span><span class="token punctuation">;</span>
 
<span class="token comment">=pod 注释
这是一个多行注释
这是一个多行注释
这是一个多行注释
这是一个多行注释
=cut</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>变量，主要有三种 标量（scalar）、数组（array）和哈希（hashes） 每种类型都有属于自己的符号：分别是 <code>$</code>、<code>@</code>和 <code>%</code> 变量定义如果使用 <code>my</code>关键字，生命期直到其所在的代码块结束或者文件的末尾。 如果使用 <code>our</code>关键字，则生命期是整个模块。</p><p>例如，下面的：</p><div class="language-perl line-numbers-mode" data-ext="perl"><pre class="language-perl"><code><span class="token keyword">my</span> <span class="token variable">$email</span><span class="token operator">=</span><span class="token string">&#39;myemail\\@xxx.com&#39;</span><span class="token punctuation">;</span> 
<span class="token keyword">my</span> <span class="token variable">@to</span><span class="token operator">=</span><span class="token punctuation">(</span><span class="token string">&#39;john&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;david&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">our</span> <span class="token variable">%contacts</span><span class="token operator">=</span><span class="token punctuation">{</span><span class="token string">&#39;john&#39;</span> <span class="token operator">=&gt;</span> <span class="token string">&#39;john\\@xxx.com&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;david&#39;</span><span class="token operator">=&gt;</span><span class="token string">&#39;david\\@xxx.com&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>小心！如果你把email存放到一个数组里时，由于默认的解析规则，@有可能会被perl当作是一个@xxx的全局变量，所以必须对 <code>@</code>转义,写成 <code>\\@</code>.</p><p>于是你可以用 <code>[N]</code>来对数组进行取值，需要注意的是，这里类型符号要以取到的值的类型为准：</p><div class="language-perl line-numbers-mode" data-ext="perl"><pre class="language-perl"><code><span class="token keyword">print</span> <span class="token variable">$to</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>  <span class="token comment"># &quot;john&quot; 这里取到的是一个scala, 所以用$符号，即使@to是一个数组</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>你也可以使用负数作为下标，这样就可以从末尾开始往前取某个元素：</p><div class="language-perl line-numbers-mode" data-ext="perl"><pre class="language-perl"><code><span class="token keyword">print</span> <span class="token variable">$to</span><span class="token punctuation">[</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment"># &quot;david&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>类似的，对于hash表，我们可以用 <code>{N}</code> 来获取其元素</p><div class="language-perl line-numbers-mode" data-ext="perl"><pre class="language-perl"><code><span class="token keyword">print</span> <span class="token variable">$contacts</span><span class="token punctuation">{</span><span class="token string">&quot;jonh&quot;</span><span class="token punctuation">}</span> <span class="token comment"># &#39;john@xxx.com&#39;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>控制流语句主要有 if..elsif..else 语句：</p><div class="language-perl line-numbers-mode" data-ext="perl"><pre class="language-perl"><code><span class="token variable">$a</span> <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span>
<span class="token comment"># 使用 == 判断两个数是否相等</span>
<span class="token keyword">if</span><span class="token punctuation">(</span> <span class="token variable">$a</span>  <span class="token operator">==</span>  <span class="token number">20</span> <span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token comment"># 条件为 true 时执行</span>
    printf <span class="token string">&quot;a 的值为 20\\n&quot;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token keyword">elsif</span><span class="token punctuation">(</span> <span class="token variable">$a</span> <span class="token operator">==</span>  <span class="token number">30</span> <span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token comment"># 条件为 true 时执行</span>
    printf <span class="token string">&quot;a 的值为 30\\n&quot;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token keyword">else</span><span class="token punctuation">{</span>
    <span class="token comment"># 以上所有的条件为 false 时执行</span>
    printf <span class="token string">&quot;a 的值为 $a\\n&quot;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>循环语句：</p>`,27),v=n("div",{class:"language-perl line-numbers-mode","data-ext":"perl"},[n("pre",{class:"language-perl"},[n("code",null,[n("span",{class:"token comment"},"# 执行 while 循环"),s(`
`),n("span",{class:"token keyword"},"while"),n("span",{class:"token punctuation"},"("),s(),n("span",{class:"token variable"},"$a"),s(),n("span",{class:"token operator"},"<"),s(),n("span",{class:"token number"},"20"),s(),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"{"),s(`
   printf `),n("span",{class:"token string"},'"a 的值为 : $a\\n"'),n("span",{class:"token punctuation"},";"),s(`
   `),n("span",{class:"token variable"},"$a"),s(),n("span",{class:"token operator"},"="),s(),n("span",{class:"token variable"},"$a"),s(),n("span",{class:"token operator"},"+"),s(),n("span",{class:"token number"},"1"),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),m=n("div",{class:"language-perl line-numbers-mode","data-ext":"perl"},[n("pre",{class:"language-perl"},[n("code",null,[n("span",{class:"token comment"},"# 执行 until 循环"),s(`
`),n("span",{class:"token keyword"},"until"),n("span",{class:"token punctuation"},"("),s(),n("span",{class:"token variable"},"$a"),s(),n("span",{class:"token operator"},">"),s(),n("span",{class:"token number"},"10"),s(),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"{"),s(`
   printf `),n("span",{class:"token string"},'"a 的值为 : $a\\n"'),n("span",{class:"token punctuation"},";"),s(`
   `),n("span",{class:"token variable"},"$a"),s(),n("span",{class:"token operator"},"="),s(),n("span",{class:"token variable"},"$a"),s(),n("span",{class:"token operator"},"+"),s(),n("span",{class:"token number"},"1"),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),b=n("div",{class:"language-perl line-numbers-mode","data-ext":"perl"},[n("pre",{class:"language-perl"},[n("code",null,[n("span",{class:"token comment"},"# 执行 for 循环"),s(`
`),n("span",{class:"token keyword"},"for"),n("span",{class:"token punctuation"},"("),s(),n("span",{class:"token variable"},"$a"),s(),n("span",{class:"token operator"},"="),s(),n("span",{class:"token number"},"0"),n("span",{class:"token punctuation"},";"),s(),n("span",{class:"token variable"},"$a"),s(),n("span",{class:"token operator"},"<"),s(),n("span",{class:"token number"},"10"),n("span",{class:"token punctuation"},";"),s(),n("span",{class:"token variable"},"$a"),s(),n("span",{class:"token operator"},"="),s(),n("span",{class:"token variable"},"$a"),s(),n("span",{class:"token operator"},"+"),s(),n("span",{class:"token number"},"1"),s(),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"{"),s(`
    `),n("span",{class:"token keyword"},"print"),s(),n("span",{class:"token string"},'"a 的值为: $a\\n"'),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),g=n("div",{class:"language-perl line-numbers-mode","data-ext":"perl"},[n("pre",{class:"language-perl"},[n("code",null,[n("span",{class:"token variable"},"@list"),s(),n("span",{class:"token operator"},"="),s(),n("span",{class:"token punctuation"},"("),n("span",{class:"token number"},"2"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token number"},"12"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token number"},"36"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token number"},"42"),n("span",{class:"token punctuation"},","),s(),n("span",{class:"token number"},"51"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
 
`),n("span",{class:"token comment"},"# 执行foreach 循环"),s(`
`),n("span",{class:"token keyword"},"foreach"),s(),n("span",{class:"token variable"},"$a"),s(),n("span",{class:"token punctuation"},"("),n("span",{class:"token variable"},"@list"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},"{"),s(`
    `),n("span",{class:"token keyword"},"print"),s(),n("span",{class:"token string"},'"a 的值为: $a\\n"'),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),h=n("div",{class:"language-perl line-numbers-mode","data-ext":"perl"},[n("pre",{class:"language-perl"},[n("code",null,[n("span",{class:"token comment"},"# 无限循环"),s(`
`),n("span",{class:"token keyword"},"for"),n("span",{class:"token punctuation"},"("),s(),n("span",{class:"token punctuation"},";"),s(),n("span",{class:"token punctuation"},";"),s(),n("span",{class:"token punctuation"},")"),s(`
`),n("span",{class:"token punctuation"},"{"),s(`
   printf `),n("span",{class:"token string"},'"循环会无限执行。\\n"'),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),x=l(`<p>当你在循环中想跳出时，perl也提供了如下几种控制语句：</p><div class="language-perl line-numbers-mode" data-ext="perl"><pre class="language-perl"><code><span class="token keyword">next</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>字符串操作</p><p>拼接，使用 <code>.</code>运算符：</p><div class="language-perl line-numbers-mode" data-ext="perl"><pre class="language-perl"><code><span class="token keyword">my</span> <span class="token variable">$string</span> <span class="token operator">=</span> <span class="token string">&quot;world&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">print</span> <span class="token string">&quot;Hello &quot;</span><span class="token operator">.</span><span class="token variable">$string</span><span class="token punctuation">;</span> <span class="token comment"># &quot;Hello world&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="高级用法" tabindex="-1"><a class="header-anchor" href="#高级用法" aria-hidden="true">#</a> 高级用法</h2><p>Perl 可以很方便的用正则表达式进行匹配，很多操作都可以用这个功能实现</p><p>判断一个字符串是否匹配一个正则式：</p><div class="language-perl line-numbers-mode" data-ext="perl"><pre class="language-perl"><code><span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token variable">$string</span> <span class="token operator">=~</span> <span class="token regex">/hel+o/</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">print</span> <span class="token string">&quot;matched!&quot;</span><span class="token punctuation">;</span> <span class="token comment"># match hellllllo</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="perl-调试器" tabindex="-1"><a class="header-anchor" href="#perl-调试器" aria-hidden="true">#</a> Perl 调试器</h2><p>Perl可以用自带的调试器方便的调试脚本，启动方法只需要加上 <code>-d</code>参数</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>perl <span class="token parameter variable">-d</span> <span class="token operator">&lt;</span>script<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>下面列出了一系列的常用命令，非常类似GDB:</p><table><thead><tr><th>命令</th><th>解释</th><th>示例</th></tr></thead><tbody><tr><td><code>b [# of line]</code></td><td>在当天调试的文件某行设置断点</td><td><code>b 19</code></td></tr><tr><td></td><td></td><td></td></tr></tbody></table>`,14);function w(f,y){const p=c("CodeTabs");return i(),r("div",null,[k,d(p,{id:"63",data:[{id:"while"},{id:"until"},{id:"for"},{id:"foreach"},{id:"endless"}],"tab-id":"loops"},{title0:a(({value:e,isActive:t})=>[s("while")]),title1:a(({value:e,isActive:t})=>[s("until")]),title2:a(({value:e,isActive:t})=>[s("for")]),title3:a(({value:e,isActive:t})=>[s("foreach")]),title4:a(({value:e,isActive:t})=>[s("endless")]),tab0:a(({value:e,isActive:t})=>[v]),tab1:a(({value:e,isActive:t})=>[m]),tab2:a(({value:e,isActive:t})=>[b]),tab3:a(({value:e,isActive:t})=>[g]),tab4:a(({value:e,isActive:t})=>[h]),_:1}),x])}const q=o(u,[["render",w],["__file","perl.html.vue"]]);export{q as default};
