import{_ as c}from"./plugin-vue_export-helper-c27b6911.js";import{r as l,o as r,c as u,a as s,d as e,e as n,w as t,f as i}from"./app-36705845.js";const p={},v=e("h1",{id:"flex-极速教程",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#flex-极速教程","aria-hidden":"true"},"#"),n(" Flex 极速教程")],-1),m=e("p",null,[n("Flex 是一个流行的"),e("strong",null,"词法分析器生成器"),n("。你不用手写 "),e("code",null,"switch"),n(" 逐字符扫字符串，只要写一份 "),e("code",null,".l"),n(" 规则文件，Flex 就会帮你生成 "),e("code",null,"lex.yy.c"),n("——一个能切分 token 的词法分析器。")],-1),b=i(`<p>一句话：<strong>你写正则 + 动作，Flex 自动生成 C 代码。</strong></p><h2 id="先提醒-flex-也有-代沟" tabindex="-1"><a class="header-anchor" href="#先提醒-flex-也有-代沟" aria-hidden="true">#</a> 先提醒：Flex 也有“代沟”</h2><p>Flex 源自 Unix 的 Lex，但现在已经不是同一个东西了。常见差异：</p><table><thead><tr><th>情况</th><th>说明</th></tr></thead><tbody><tr><td><strong>Lex vs Flex</strong></td><td>Lex 是老古董；现在几乎都用 GNU Flex。语法大体兼容，但选项和行为细节不同。</td></tr><tr><td><strong>Flex 2.5 vs 2.6</strong></td><td>2.6 起完善了与 Bison 3 的 <code>%option bison-bridge</code> 等桥接选项。</td></tr><tr><td><strong>Windows 上的 flex</strong></td><td>可能是 <code>win_flex</code>，行为和 Linux 上的 GNU flex 略有差别，报错信息也可能不一样。</td></tr></tbody></table><p><strong>本文按 GNU Flex 2.6+ 的现代用法来写。</strong> 老教程里手动写 <code>yywrap()</code>、全局 <code>yyin</code>/<code>yyout</code> 的写法仍然常见，但新项目更推荐 <code>%option noyywrap</code> 等显式选项。</p><p>先确认版本：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>flex <span class="token parameter variable">--version</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="l-文件的三段式结构" tabindex="-1"><a class="header-anchor" href="#l-文件的三段式结构" aria-hidden="true">#</a> <code>.l</code> 文件的三段式结构</h2><p>Flex 文件固定分成三块，用 <code>%%</code> 隔开：</p><div class="language-flex line-numbers-mode" data-ext="flex"><pre class="language-flex"><code>/* 第一段：定义区（选项、头文件、正则别名） */

%option noyywrap
%option nounput
%option noinput

%{
#include &lt;stdio.h&gt;
#include &quot;parser.tab.h&quot;   /* 如果和 Bison 联用，token 枚举在这里 */
%}

DIGIT   [0-9]
LETTER  [A-Za-z_]

/* 第二段：规则区（正则 + 匹配后动作） */
%%
{DIGIT}+        { return NUMBER; }
{LETTER}({LETTER}|{DIGIT})*  { return IDENT; }
[ \\t\\r\\n]+      { /* 忽略空白 */ }
.               { return yytext[0]; }   /* 未知字符，原样返回 */
%%

/* 第三段：用户代码区（辅助函数，可选） */
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对应关系：</p><ol><li><strong>定义区</strong>：放 <code>%option</code>、C 代码块、正则别名（如 <code>DIGIT [0-9]</code>）。</li><li><strong>规则区</strong>：核心。每行是 <code>模式 { 动作 }</code>，匹配到了就执行动作。</li><li><strong>用户代码区</strong>：放你自己写的 C 函数，比如 <code>main</code> 测试入口。</li></ol><h2 id="最小可运行示例" tabindex="-1"><a class="header-anchor" href="#最小可运行示例" aria-hidden="true">#</a> 最小可运行示例</h2><p><code>calc.l</code>——只识别整数和 <code>+ - * / ( )</code>：</p><div class="language-flex line-numbers-mode" data-ext="flex"><pre class="language-flex"><code>%option noyywrap nounput noinput

%{
#include &lt;stdio.h&gt;
enum { NUM = 256, ADD, SUB, MUL, DIV };
%}

%%
[0-9]+          { printf(&quot;NUM %s\\n&quot;, yytext); return NUM; }
&quot;+&quot;             { return ADD; }
&quot;-&quot;             { return SUB; }
&quot;*&quot;             { return MUL; }
&quot;/&quot;             { return DIV; }
[ \\t\\n]+        { /* skip */ }
.               { printf(&quot;未知字符: %s\\n&quot;, yytext); }
%%

int main(void) {
    while (yylex() != 0) { /* 一直扫到 EOF */ }
    return 0;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>生成并编译：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>flex calc.l          <span class="token comment"># 生成 lex.yy.c</span>
cc <span class="token parameter variable">-o</span> calc lex.yy.c <span class="token parameter variable">-lfl</span>   <span class="token comment"># Linux: -lfl；macOS 可能是 -ll</span>
./calc
<span class="token comment"># 然后输入: 1+2*3 回车，Ctrl+D 结束（Windows 可能是 Ctrl+Z）</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Windows 上如果没有 <code>-lfl</code>，有时需要手动链接或改用 CMake 管理（见后文）。</p><h2 id="匹配规则-最长优先-一样长则靠前" tabindex="-1"><a class="header-anchor" href="#匹配规则-最长优先-一样长则靠前" aria-hidden="true">#</a> 匹配规则：最长优先，一样长则靠前</h2><p>Flex 不是“谁先写正则谁就赢”，规则是：</p><ol><li><strong>最长匹配优先</strong>（longest match）</li><li>长度相同时，<strong>文件里更靠前的规则优先</strong></li></ol><p>例子：</p><div class="language-flex line-numbers-mode" data-ext="flex"><pre class="language-flex"><code>%%
&quot;if&quot;            { return IF; }
[a-z]+          { return IDENT; }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输入 <code>if</code> 会匹配关键字 <code>if</code>，不会变成 IDENT。<br> 输入 <code>iffy</code> 会整体匹配 IDENT（更长）。</p><p>这和编译原理里说的“正则列表 + 优先级”是一回事，只是 Flex 把优先级默认绑定成了<strong>规则书写顺序</strong>。</p><h2 id="常用-option" tabindex="-1"><a class="header-anchor" href="#常用-option" aria-hidden="true">#</a> 常用 <code>%option</code></h2><div class="language-flex line-numbers-mode" data-ext="flex"><pre class="language-flex"><code>%option noyywrap      /* 不提供 yywrap，EOF 时直接结束 */
%option nounput noinput  /* 抑制编译器警告 */
%option yylineno      /* 维护 yylineno，报错时可显示行号 */
%option case-insensitive  /* 规则大小写不敏感 */
%option bison-bridge  /* 与 Bison 3 联用时推荐 */
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="关于-yywrap" tabindex="-1"><a class="header-anchor" href="#关于-yywrap" aria-hidden="true">#</a> 关于 <code>yywrap</code></h3><p>老教程会让你写：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">int</span> <span class="token function">yywrap</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">return</span> <span class="token number">1</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>意思是“没有下一个输入文件了”。<br> 现代写法直接 <code>%option noyywrap</code>，省得每个项目都复制粘贴这个函数。</p><h2 id="动作里常用的内置变量-函数" tabindex="-1"><a class="header-anchor" href="#动作里常用的内置变量-函数" aria-hidden="true">#</a> 动作里常用的内置变量/函数</h2><table><thead><tr><th>名字</th><th>含义</th></tr></thead><tbody><tr><td><code>yytext</code></td><td>当前匹配到的字符串（<code>char *</code>）</td></tr><tr><td><code>yyleng</code></td><td>匹配长度</td></tr><tr><td><code>yylineno</code></td><td>当前行号（需 <code>%option yylineno</code>）</td></tr><tr><td><code>yylex()</code></td><td>执行一次扫描，返回 token</td></tr><tr><td><code>yyin</code> / <code>yyout</code></td><td>输入/输出文件指针，默认 stdin/stdout</td></tr><tr><td><code>unput(c)</code></td><td>把字符退回输入流（少用，但调试 handy）</td></tr></tbody></table><p>典型动作：</p><div class="language-flex line-numbers-mode" data-ext="flex"><pre class="language-flex"><code>{DIGIT}+   { yylval = atoi(yytext); return NUMBER; }
&quot;//&quot;.*     { /* 单行注释，吞掉 */ }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="开始条件-start-conditions" tabindex="-1"><a class="header-anchor" href="#开始条件-start-conditions" aria-hidden="true">#</a> 开始条件（Start Conditions）</h2><p>有时词法规则和上下文有关，比如 <code>&quot;</code> 进字符串模式，<code>/*</code> 进注释模式：</p><div class="language-flex line-numbers-mode" data-ext="flex"><pre class="language-flex"><code>%x STR

%%
\\&quot;          { BEGIN(STR); }
&lt;STR&gt;[^\\&quot;\\\\]+  { /* 字符串内容 */ }
&lt;STR&gt;\\\\\\&quot;   { /* 转义引号 */ }
&lt;STR&gt;\\&quot;     { BEGIN(INITIAL); return STRING; }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>INITIAL</code> 是默认状态。<code>%x STR</code> 定义独占状态；还有 <code>%s</code> inclusive 状态，初学知道 <code>%x</code> 够用。</p><h2 id="和-bison-联用" tabindex="-1"><a class="header-anchor" href="#和-bison-联用" aria-hidden="true">#</a> 和 Bison 联用</h2><p>做编译器时，Flex 通常不负责 <code>main</code>，只提供 <code>yylex()</code>；Bison 的 <code>yyparse()</code> 会反复调用它。</p><p>典型分工：</p><ul><li><strong>Flex</strong>：识别 token，必要时设置 <code>yylval</code></li><li><strong>Bison</strong>：根据 token 流做语法分析</li></ul><p><code>.l</code> 文件里常见：</p><div class="language-flex line-numbers-mode" data-ext="flex"><pre class="language-flex"><code>%option bison-bridge
%{
#include &quot;parser.tab.h&quot;
#define YY_DECL int yylex(YYSTYPE *yylval_param, yyscan_t yyscanner)
%}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,45),x=e("strong",null,"Flex 管“切词”，Bison 管“造句”。",-1),h=e("h2",{id:"用-cmake-集成-flex",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#用-cmake-集成-flex","aria-hidden":"true"},"#"),n(" 用 CMake 集成 Flex")],-1),g=e("code",null,"FindFlex",-1),y=i(`<div class="language-cmake line-numbers-mode" data-ext="cmake"><pre class="language-cmake"><code><span class="token keyword">cmake_minimum_required</span><span class="token punctuation">(</span><span class="token property">VERSION</span> <span class="token number">3.20</span><span class="token punctuation">)</span>
<span class="token keyword">project</span><span class="token punctuation">(</span>LexDemo LANGUAGES C<span class="token punctuation">)</span>

<span class="token keyword">find_package</span><span class="token punctuation">(</span>FLEX REQUIRED<span class="token punctuation">)</span>

<span class="token function">flex_target</span><span class="token punctuation">(</span>Scanner calc.l <span class="token punctuation">\${</span><span class="token variable">CMAKE_CURRENT_BINARY_DIR</span><span class="token punctuation">}</span>/lex.yy.c<span class="token punctuation">)</span>

<span class="token keyword">add_executable</span><span class="token punctuation">(</span>calc <span class="token punctuation">\${</span>FLEX_Scanner_OUTPUTS<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">target_include_directories</span><span class="token punctuation">(</span>calc <span class="token namespace">PRIVATE</span> <span class="token punctuation">\${</span><span class="token variable">CMAKE_CURRENT_BINARY_DIR</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">target_link_libraries</span><span class="token punctuation">(</span>calc <span class="token namespace">PRIVATE</span> <span class="token punctuation">\${</span>FLEX_LIBRARIES<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样不用手敲 <code>flex calc.l</code>，改 <code>.l</code> 文件会自动重新生成。</p><h2 id="新手常踩的坑" tabindex="-1"><a class="header-anchor" href="#新手常踩的坑" aria-hidden="true">#</a> 新手常踩的坑</h2><ol><li><strong>忘记 <code>%option noyywrap</code></strong>：链接时报 <code>undefined reference to yywrap</code>。</li><li><strong>规则区没写动作</strong>：空动作 <code>{}</code> 合法，表示“匹配但什么都不做”——注释、空白常这么写。</li><li><strong><code>.</code> 规则放太靠前</strong>：<code>.</code> 能匹配任意单字符，通常会吃光所有“兜底”输入，一般放最后。</li><li><strong>把 C 代码写进规则区但没包 <code>{}</code></strong>：Flex 会把你的 C 语句当正则解析，报错非常抽象——看到 bizarre 报错先检查 <code>{}</code>。</li><li><strong>复制 Linux 教程在 Windows 编译</strong>：<code>-lfl</code>、路径、换行符都可能不一样，先 <code>flex --version</code> 确认环境。</li></ol><h2 id="日常流程" tabindex="-1"><a class="header-anchor" href="#日常流程" aria-hidden="true">#</a> 日常流程</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 1. 写 xxx.l</span>
<span class="token comment"># 2. 生成 C 文件</span>
flex xxx.l

<span class="token comment"># 3. 编译 lex.yy.c（和你的 parser、main 一起）</span>
cc <span class="token parameter variable">-o</span> mylexer lex.yy.c main.c <span class="token parameter variable">-lfl</span>

<span class="token comment"># 4. 运行</span>
./mylexer <span class="token operator">&lt;</span> input.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>改规则后重新 <code>flex xxx.l</code> 再编译。用 CMake 的话，<code>cmake --build</code> 会自动帮你做这一步。</p><h2 id="最后总结" tabindex="-1"><a class="header-anchor" href="#最后总结" aria-hidden="true">#</a> 最后总结</h2><p>Flex 就干三件事：</p><ol><li><strong>定义 token 长什么样</strong>（正则 / 别名）</li><li><strong>定义匹配后干什么</strong>（<code>return TOKEN</code>、<code>yylval = ...</code>、忽略）</li><li><strong>生成 <code>yylex()</code></strong> 供主程序或 Bison 调用</li></ol><p>初学只记这个骨架：</p><div class="language-flex line-numbers-mode" data-ext="flex"><pre class="language-flex"><code>%option noyywrap nounput noinput
%{ /* 头文件 */ %}
别名定义
%%
规则 { 动作 }
%%
/* 可选辅助代码 */
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>构建只记：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>flex xxx.l
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>词法分析的本质没变：<strong>按优先级和最长匹配切 token</strong>。Flex 只是把这个过程自动化了，让你专注写规则，而不是手写状态机 switch。</p><p>如果你已经会正则表达式，Flex 的上手成本很低——本质上就是“<strong>带动作的、有优先级的正则列表</strong>”。剩下的坑，多半出在版本差异和与 Bison 的接口上，而不是 Flex 本身有多玄学。</p><h2 id="扩展延伸" tabindex="-1"><a class="header-anchor" href="#扩展延伸" aria-hidden="true">#</a> 扩展延伸</h2>`,17),k={href:"https://github.com/sunxfancy/flex-bison-examples",target:"_blank",rel:"noopener noreferrer"},f=i(`<h3 id="中文等-utf-8-支持" tabindex="-1"><a class="header-anchor" href="#中文等-utf-8-支持" aria-hidden="true">#</a> 中文等 Utf-8 支持</h3><p>Flex 默认按<strong>字节</strong>扫描，不是按 Unicode 码点。好消息是：如果你的源文件是 UTF-8，<strong>ASCII 范围内的 token</strong>（关键字、运算符、数字）照样正常工作；中文通常出现在<strong>字符串字面量</strong>或<strong>注释</strong>里，不必强行让 Flex “认识中文关键字”。</p><p>Utf-8 是一种变长编码，每个字符 1～4 字节。ASCII 字符仍是单字节，且与 UTF-8 兼容。常见中文在 UTF-8 里一般是 3 字节，例如 <code>中</code> 的编码为 <code>E4 B8 AD</code>。那么它是如何控制编码长度的呢？</p><ol><li>如果第一个字节以 0 开头，那么这个字符就是单字节，如 <code>A</code> 的编码为 <code>0x41</code> 即 <code>01000001</code>。</li><li>第一个字节的前 n 位为 1，紧接着的第 n + 1 位为 0，表示该字符占用 n 个字节；后续字节的前两位固定为 10，后面的位用于表示字符的 Unicode 码。如 <code>中</code> 的编码为 <code>E4 B8 AD</code>，即 <code>11100100 10111000 10101101</code>，那么它占用 3 个字节。</li></ol><p>也就是说，<code>中</code> 的 UTF-8 编码可以这样拆：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>E4        B8        AD
11100100  10111000  10101101
^^^^      ^^        ^^
1110      10        10
3字节开头  后续字节  后续字节
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以 Flex 如果用 <code>.</code> 去扫中文，它不是一次吃掉整个 <code>中</code>，而是先吃 <code>E4</code>，再吃 <code>B8</code>，最后吃 <code>AD</code>。这就是为什么前面强调：Flex 默认看见的是<strong>字节流</strong>，不是“一个个汉字”。</p>`,7),_={href:"https://github.com/sunxfancy/flex-bison-examples/blob/master/utf8/lexer.l",target:"_blank",rel:"noopener noreferrer"},E={href:"https://stackoverflow.com/questions/9611682/flexlexer-support-for-unicode/9617585",target:"_blank",rel:"noopener noreferrer"},I=i(`<div class="language-flex line-numbers-mode" data-ext="flex"><pre class="language-flex"><code>/* 后续字节：10xxxxxx */
U       [\\x80-\\xbf]

/* 首字节：110xxxxx / 1110xxxx / 11110xxx */
U2      [\\xc2-\\xdf]    /* 2 字节字符 */
U3      [\\xe0-\\xef]    /* 3 字节字符，如 中 的首字节 E4 */
U4      [\\xf0-\\xf4]    /* 4 字节字符 */

/* 只匹配非 ASCII 的 UTF-8 字符 */
UONLY   {U2}{U}|{U3}{U}{U}|{U4}{U}{U}{U}

/* 匹配任意字符（ASCII 或 UTF-8） */
UANY    [\\x00-\\x7f]|{U2}{U}|{U3}{U}{U}|{U4}{U}{U}{U}

%%

&quot;类型&quot;           { return TYPE; }              /* 中文关键字 */
{UONLY}+         { SAVE_TOKEN; return ID; }   /* 中文标识符 */
\\&quot;({UANY}|\\\\.)*\\&quot; { SAVE_STRING; return STRING; }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对照前面的 <code>中 = E4 B8 AD</code>：</p><ul><li><code>U3</code> 匹配首字节 <code>E4</code>（落在 <code>\\xe0-\\xef</code>）</li><li>后面两个 <code>U</code> 分别匹配 <code>B8</code>、<code>AD</code>（落在 <code>\\x80-\\xbf</code>）</li><li>三个字节拼起来，Flex 才认为匹配到了<strong>一个</strong> <code>{UONLY}</code> token</li></ul><p>所以 <code>{UONLY}+</code> 可以识别 <code>变量名</code> 这种中文标识符；而 <code>\\&quot;...\\&quot;</code> 里用 <code>UANY</code> 则允许 ASCII 和中文混写字符串。</p><h3 id="可重入性" tabindex="-1"><a class="header-anchor" href="#可重入性" aria-hidden="true">#</a> 可重入性</h3><p>默认 Flex 生成的 <code>yylex()</code> 大量使用<strong>全局变量</strong>：<code>yytext</code>、<code>yylineno</code>、<code>yyin</code>……<br> 单线程、单文件扫描时没问题；一旦你想：</p><ul><li>同时扫两个输入流；</li><li>在多线程里各跑一个词法器；</li><li>递归/嵌套 include 时再开一层扫描；</li></ul><p>全局状态就会互相踩踏。Flex 2.6 的解法是 <strong>可重入（reentrant）</strong> 扫描器：所有状态塞进 <code>yyscan_t</code>，每个实例各用各的。</p><p>开启方式：</p><div class="language-flex line-numbers-mode" data-ext="flex"><pre class="language-flex"><code>%option reentrant bison-bridge
%option noyywrap nounput noinput
%option extra-type=&quot;struct LexExtra*&quot;

%{
#include &quot;parser.tab.h&quot;

struct LexExtra {
    int error_count;
    const char *filename;
};

#define YY_DECL int yylex(YYSTYPE *yylval, yyscan_t yyscanner)
%}

%%
[0-9]+   { return NUMBER; }
[a-z]+   { return IDENT; }
.        { return yytext[0]; }
%%
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用侧（注意生命周期）：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token class-name">yyscan_t</span> scanner<span class="token punctuation">;</span>
<span class="token keyword">struct</span> <span class="token class-name">LexExtra</span> extra <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token punctuation">.</span>error_count <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token punctuation">.</span>filename <span class="token operator">=</span> <span class="token string">&quot;input.txt&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">yylex_init_extra</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>extra<span class="token punctuation">,</span> <span class="token operator">&amp;</span>scanner<span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* 出错 */</span> <span class="token punctuation">}</span>

FILE <span class="token operator">*</span>f <span class="token operator">=</span> <span class="token function">fopen</span><span class="token punctuation">(</span><span class="token string">&quot;input.txt&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;r&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">yyset_in</span><span class="token punctuation">(</span>f<span class="token punctuation">,</span> scanner<span class="token punctuation">)</span><span class="token punctuation">;</span>

YYSTYPE yylval<span class="token punctuation">;</span>
<span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token function">yylex</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>yylval<span class="token punctuation">,</span> scanner<span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* 扫 token */</span> <span class="token punctuation">}</span>

<span class="token function">fclose</span><span class="token punctuation">(</span>f<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">yylex_destroy</span><span class="token punctuation">(</span>scanner<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>几个要点：</p><table><thead><tr><th>默认写法</th><th>可重入写法</th></tr></thead><tbody><tr><td><code>yylex()</code></td><td><code>yylex(&amp;yylval, scanner)</code></td></tr><tr><td><code>yyin = f</code></td><td><code>yyset_in(f, scanner)</code></td></tr><tr><td>全局 <code>yyextra</code></td><td><code>yylex_init_extra(&amp;extra, &amp;scanner)</code></td></tr><tr><td>单实例</td><td>多个 <code>yyscan_t</code> 互不干扰</td></tr></tbody></table>`,14),T=e("code",null,"%option reentrant bison-bridge",-1),N=e("code",null,"%define api.pure full",-1),U=i('<p><strong>什么时候需要？</strong> 写编译器 demo 不必强行上；写 IDE 插件、多文件并行预处理、嵌入式脚本多次 <code>eval</code> 时，可重入能省很多“怎么 reset 全局状态”的玄学 bug。</p><h3 id="python-风格的缩进该如何处理" tabindex="-1"><a class="header-anchor" href="#python-风格的缩进该如何处理" aria-hidden="true">#</a> Python 风格的缩进该如何处理</h3><p>Python 的缩进<strong>不是</strong>源文件里的字面 token。你看不见一个叫 <code>INDENT</code> 的字符——它是词法器根据<strong>行首空白列数</strong>算出来的。<br> 所以 Flex 不能只靠 <code>{空格}+</code> 一条正则搞定，得用<strong>状态机</strong>在行首专门统计缩进。</p>',3),F={href:"https://github.com/sunxfancy/flex-bison-examples/blob/master/python-like-indentation/lexer.l",target:"_blank",rel:"noopener noreferrer"},A={href:"https://stackoverflow.com/questions/1413204/how-to-use-indentation-as-block-delimiters-with-bison-and-flex",target:"_blank",rel:"noopener noreferrer"},q=i('<h4 id="核心思路-两个状态" tabindex="-1"><a class="header-anchor" href="#核心思路-两个状态" aria-hidden="true">#</a> 核心思路：两个状态</h4><p>参考实现用了两个 start condition：</p><table><thead><tr><th>状态</th><th>干什么</th></tr></thead><tbody><tr><td><code>INITIAL</code>（默认）</td><td>行首阶段：逐个读空格/Tab，累计 <code>current_line_indent</code></td></tr><tr><td><code>NORMAL</code></td><td>正常阶段：识别关键字、标识符、运算符等 token</td></tr></tbody></table><p>外加两个全局变量：</p><ul><li><code>current_line_indent</code>：当前物理行已经读到的缩进列数</li><li><code>indent_level</code>：已经交给语法分析器的逻辑缩进层级</li></ul><p>流程可以概括成：</p>',6),L=i(`<h4 id="参考实现的关键代码" tabindex="-1"><a class="header-anchor" href="#参考实现的关键代码" aria-hidden="true">#</a> 参考实现的关键代码</h4><p><code>INITIAL</code> 阶段：只关心空白；遇到第一个“真正的 token 字符”时，用 <code>unput()</code> 把它塞回输入流，再决定发 <code>INDENT</code> / <code>DEDENT</code> 还是进入 <code>NORMAL</code>：</p><div class="language-flex line-numbers-mode" data-ext="flex"><pre class="language-flex"><code>%option yylineno
%option noyywrap

%{
#include &quot;parser.h&quot;
int current_line_indent = 0;   /* 当前行的缩进列数 */
int indent_level = 0;            /* 已确认的逻辑缩进层级 */
%}

%x NORMAL

%%
&quot; &quot;     { current_line_indent++; }
&quot;\\t&quot;    { current_line_indent = (current_line_indent + 4) &amp; ~3; }
&quot;\\n&quot;    { current_line_indent = 0; }

.       {
          unput(*yytext);   /* 第一个非空白字符先放回去，稍后在 NORMAL 里再读 */

          if (current_line_indent &gt; indent_level) {
              if (current_line_indent == indent_level + 4) {
                  indent_level = current_line_indent;
                  BEGIN(NORMAL);
                  return INDENT;
              } else {
                  /* 缩进不是严格 +4，报错 */
              }
          } else if (current_line_indent &lt; indent_level) {
              if (indent_level - current_line_indent &lt; 4) {
                  /* 缩进对不齐，报错 */
              }
              indent_level -= 4;
              return DEDENT;   /* 一次只退一层，多层要多次调用 yylex */
          } else {
              BEGIN(NORMAL);
          }
        }

&lt;&lt;EOF&gt;&gt; {
          if (current_line_indent &lt; indent_level) {
              indent_level -= 4;
              return DEDENT;   /* 文件结束前把栈弹干净 */
          } else {
              return YYEOF;
          }
        }

&lt;NORMAL&gt;{
    &quot;\\n&quot;                    { current_line_indent = 0; return &#39;\\n&#39;; }
    [ \\t]                   { /* 行内空白忽略 */ }
    [a-zA-Z_][a-zA-Z0-9_]*  { return TID; }
    /* ... 其他 token 规则 ... */
}
%%
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>和之前“先算列号、再调 <code>handle_indent()</code>”的写法相比，这个例子的特点是：</p><ol><li><strong>不用单独的 <code>AFTER_NEWLINE</code> 状态</strong>，而是默认 <code>INITIAL</code> 专门吃行首空白。</li><li><strong>用 <code>unput()</code> 退回字符</strong>，避免把“判断缩进的触发点”和“读 token”绑死在同一规则里。</li><li><strong>缩进步长固定为 4</strong>（空格 +1，Tab 按 4 列对齐），是教学 demo，不是完整 CPython 实现。</li></ol><h4 id="为什么要-unput" tabindex="-1"><a class="header-anchor" href="#为什么要-unput" aria-hidden="true">#</a> 为什么要 <code>unput()</code>？</h4><p>当 Flex 在 <code>INITIAL</code> 里读到 <code>if</code> 的 <code>i</code> 时，这个字符既是“缩进结束信号”，本身又应该是 <code>IF</code> token 的一部分。</p><p>如果不在动作里 <code>unput(*yytext)</code>，就会出现：</p><ul><li>要么 <code>i</code> 被缩进逻辑吃掉，后面的 token 规则读不到完整单词；</li><li>要么你得在缩进逻辑里手动拼 token，Flex 规则迅速膨胀成灾难。</li></ul><p><code>unput()</code> 的意思就是：<strong>“我知道了，这里缩进算完了；刚才那个字符不算缩进，放回去，NORMAL 状态重新读。”</strong></p><h4 id="两个实现上的坑" tabindex="-1"><a class="header-anchor" href="#两个实现上的坑" aria-hidden="true">#</a> 两个实现上的坑</h4><ol><li><strong>一次只吐一个 DEDENT</strong>：参考实现里 <code>indent_level -= 4</code> 后 <code>return DEDENT</code>，如果要从 12 空格退回 0，需要 parser 多次调用 <code>yylex()</code>，或在 <code>&lt;&lt;EOF&gt;&gt;</code> 里循环退栈。这也是 Bison 里 <code>%destructor</code> / 空规则配合的常见写法。</li><li><strong>这是简化版，不是完整 Python</strong>：示例固定 4 空格一级，没有处理括号续行（implicit line joining）、也没有混用 Tab/空格 的完整报错逻辑。工业级 CPython 前端还要维护 pending token 队列和括号深度——Flex 仍然负责字符级扫描，但缩进算法会比这个 demo 长得多。</li></ol><p><strong>一句话总结</strong>：Python 缩进是<strong>上下文相关</strong>的。参考实现的做法是——<strong>INITIAL 统计行首空白，首个非空白字符触发 INDENT/DEDENT，NORMAL 负责正常 token</strong>；比堆抽象 helper 函数更贴近真实 Flex 项目。</p>`,13),w={href:"https://github.com/sunxfancy/flex-bison-examples",target:"_blank",rel:"noopener noreferrer"};function D(R,C){const o=l("Mermaid"),d=l("RouterLink"),a=l("ExternalLinkIcon");return r(),u("div",null,[v,m,s(o,{id:"mermaid-6",code:"eJxLy8kvT85ILCpR8AniUgCCnNQKvRwFXV07hTQgMzraDUjaJBXZheTn58TGgiVASior9ZLB6gmpyoCbCtIClknOzy3IzEktio5+vmfai/UTn85cAdVTnJyYlweUeLG+99nmqU872p7NmwCS5QIAAZI95g=="}),b,e("p",null,[n("Bison 的细节放在 "),s(d,{to:"/%E6%9E%81%E9%80%9F%E6%95%99%E7%A8%8B/bison.html"},{default:t(()=>[n("bison.md")]),_:1}),n("，这里只要知道："),x]),h,e("p",null,[n("配合 "),s(d,{to:"/%E6%9E%81%E9%80%9F%E6%95%99%E7%A8%8B/cmake.html"},{default:t(()=>[n("cmake.md")]),_:1}),n(" 的现代写法，可以用 "),g,n("：")]),y,e("p",null,[n("对于Flex来说，有很多不同的实现风格，如 C、C++ 等，还会涉及一些高级用法，这里简要列出了一些常见的问题。这里的代码均可以在仓库 "),e("a",k,[n("flex-bison-examples"),s(a)]),n(" 中找到。")]),f,e("p",null,[n("于是，一个可以匹配 UTF-8 多字节字符的正则可以这样写。完整示例见仓库："),e("a",_,[n("utf8/lexer.l"),s(a)]),n("（思路来自 "),e("a",E,[n("Stack Overflow 讨论"),s(a)]),n("）：")]),I,e("p",null,[n("与 Bison 联用时，"),T,n(" 常成对出现；Bison 侧也要 "),N,n(" 等配置（详见 "),s(d,{to:"/%E6%9E%81%E9%80%9F%E6%95%99%E7%A8%8B/bison.html"},{default:t(()=>[n("bison.md")]),_:1}),n("）。")]),U,e("p",null,[n("完整可运行示例见仓库："),e("a",F,[n("python-like-indentation/lexer.l"),s(a)]),n("（思路来自 "),e("a",A,[n("Stack Overflow 讨论"),s(a)]),n("）。")]),q,s(o,{id:"mermaid-548",code:"eJxLy8kvT85ILCpR8AniUgACx2glTz/PEE9Hn/d7Zr1Yv/vFwp6Xy6Y9X7nr+cy9SrEKurp2Ck7VSi8b2592bHi+Zs2THQ1Pdqx6OXceRMXTtdOfr1mmVAs2ygmkukbp+Z6VL/bPVtA2UapRcI5WKkotKS3KU/D0c3H1C7FJKrIDSj5tXarg5x/k6+ijFItFqy5Iqwtcq4srTCvEupcNDU9nz3uxbzLQmGdbG7EZ8WRH79P+GUBTXKOVUOwjZIor2Mdu0UoQ5cAwebZ28dMdO551rlYoyc9OzYOqcwOrc4+GhoxCTAxMxh0s48gFAE0xngE="}),L,e("p",null,[n("更多可运行示例见仓库 "),e("a",w,[n("flex-bison-examples"),s(a)]),n("。")])])}const O=c(p,[["render",D],["__file","flex.html.vue"]]);export{O as default};
