import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{o as n,c as i,f as t}from"./app-7fdc7960.js";const d={},s=t(`<h1 id="编译器架构的王者llvm——-4-简单的词法和语法分析" tabindex="-1"><a class="header-anchor" href="#编译器架构的王者llvm——-4-简单的词法和语法分析" aria-hidden="true">#</a> 编译器架构的王者LLVM——（4）简单的词法和语法分析</h1><h2 id="简单的词法和语法分析" tabindex="-1"><a class="header-anchor" href="#简单的词法和语法分析" aria-hidden="true">#</a> 简单的词法和语法分析</h2><p>Lex和Yacc真是太好用了，非常方便我们构建一门语言的分析程序。</p><p>如果你对Lex和Yacc不了解的话，建议先看下我之前写的两篇文章，分别介绍了Lex和Yacc的用法。</p><p>Lex识别C风格字符串和注释 http://blog.csdn.net/xfxyy_sxfancy/article/details/45024573</p><p>创造新语言（2）——用Lex&amp;Yacc构建简单的分析程序 http://blog.csdn.net/xfxyy_sxfancy/article/details/45046465</p><h3 id="flex创建一门语言的词法分析程序" tabindex="-1"><a class="header-anchor" href="#flex创建一门语言的词法分析程序" aria-hidden="true">#</a> FLex创建一门语言的词法分析程序</h3><p>我们创建的是一门编程语言，那么词法分析程序就不能像做实验一样那么草率，必须考虑周全，一般一门语言的词法分析程序大概需要囊括如下的几个方面：</p><p>识别关键字、识别标识符、识别基本常量（数字、浮点数、字符串、字符）、识别注释、识别运算符</p><p>这些都是非常重要的，而且是一门语言语法中必不可少的部分。</p><p>于是RedApple的词法分析部分，我就设计成了这样：</p><div class="language-lex line-numbers-mode" data-ext="lex"><pre class="language-lex"><code>%{
#include &lt;string&gt;
#include &quot;Model/nodes.h&quot;
#include &lt;list&gt;
using namespace std;

#include &quot;redapple_parser.hpp&quot;
#include &quot;StringEscape.h&quot;

#define SAVE_TOKEN     yylval.str = maketoken(yytext, yyleng)
#define SAVE_STRING    yylval.str = makestring(yytext, yyleng, 2)
#define SAVE_STRING_NC yylval.str = makestring(yytext, yyleng, 3)
extern &quot;C&quot; int yywrap() { return 1; }
char* maketoken(const char* data, int len);
char* makestring(const char* data, int len, int s);

%}

%option yylineno

%%

&quot;/*&quot;([^\\*]|(\\*)*[^\\*/])*(\\*)*&quot;*/&quot; ; /* 就是这种注释 */ 

#[^\\n]*\\n               ; /* 井号注释 */ 
&quot;//&quot;[^\\n]*\\n            ; /* 双线注释 */ 

[ \\t\\v\\n\\f]             ; /* 过滤空白字符 */


&quot;==&quot;                    return CEQ;
&quot;&lt;=&quot;                    return CLE;
&quot;&gt;=&quot;                    return CGE;
&quot;!=&quot;                    return CNE;

&quot;&lt;&quot;                     return &#39;&lt;&#39;;
&quot;=&quot;                     return &#39;=&#39;;
&quot;&gt;&quot;                     return &#39;&gt;&#39;;
&quot;(&quot;                     return &#39;(&#39;;
&quot;)&quot;                     return &#39;)&#39;;
&quot;[&quot;                     return &#39;[&#39;;
&quot;]&quot;                     return &#39;]&#39;;
&quot;{&quot;                     return &#39;{&#39;;
&quot;}&quot;                     return &#39;}&#39;;
&quot;.&quot;                     return &#39;.&#39;;
&quot;,&quot;                     return &#39;,&#39;;
&quot;:&quot;                     return &#39;:&#39;;
&quot;;&quot;                     return &#39;;&#39;;
&quot;+&quot;                     return &#39;+&#39;;
&quot;-&quot;                     return &#39;-&#39;;
&quot;*&quot;                     return &#39;*&#39;;
&quot;/&quot;                     return &#39;/&#39;;
&quot;%&quot;                     return &#39;%&#39;;
&quot;^&quot;                     return &#39;^&#39;;
&quot;&amp;&quot;                     return &#39;&amp;&#39;;
&quot;|&quot;                     return &#39;|&#39;;
&quot;~&quot;                     return &#39;~&#39;;

    /* 宏运算符 */
&quot;@&quot;                     return &#39;@&#39;;
&quot;,@&quot;                    return MBK;

    /* 下面声明要用到的关键字 */

    /* 控制流 */
&quot;if&quot;                    return IF;
&quot;else&quot;                  return ELSE;
&quot;while&quot;                 return WHILE;
&quot;do&quot;                    return DO;
&quot;goto&quot;                  return GOTO;
&quot;for&quot;                   return FOR;
&quot;foreach&quot;               return FOREACH;

    /* 退出控制 */
&quot;break&quot;|&quot;continue&quot;|&quot;exit&quot;   SAVE_TOKEN; return KWS_EXIT;

&quot;return&quot;                return RETURN;

    /* 特殊运算符 */
&quot;new&quot;                   return NEW;
&quot;this&quot;                  return THIS;
    
    /* 特殊定义 */
&quot;delegate&quot;              return DELEGATE;
&quot;def&quot;                   return DEF;
&quot;define&quot;                return DEFINE;
&quot;import&quot;                return IMPORT;
&quot;using&quot;                 return USING;
&quot;namespace&quot;             return NAMESPACE;

&quot;try&quot;|&quot;catch&quot;|&quot;finally&quot;|&quot;throw&quot;  SAVE_TOKEN; return KWS_ERROR; /* 异常控制 */

&quot;null&quot;|&quot;true&quot;|&quot;false&quot;               SAVE_TOKEN; return KWS_TSZ; /* 特殊值 */

&quot;struct&quot;|&quot;enum&quot;|&quot;union&quot;|&quot;module&quot;|&quot;interface&quot;|&quot;class&quot;     SAVE_TOKEN; return KWS_STRUCT; /* 结构声明 */

&quot;public&quot;|&quot;private&quot;|&quot;protected&quot;  SAVE_TOKEN; return KWS_FWKZ; /* 访问控制 */

&quot;const&quot;|&quot;static&quot;|&quot;extern&quot;|&quot;virtual&quot;|&quot;abstract&quot;|&quot;in&quot;|&quot;out&quot;        SAVE_TOKEN; return KWS_FUNC_XS; /* 函数修饰符 */

&quot;void&quot;|&quot;double&quot;|&quot;int&quot;|&quot;float&quot;|&quot;char&quot;|&quot;bool&quot;|&quot;var&quot;|&quot;auto&quot;  SAVE_TOKEN; return KWS_TYPE; /* 基本类型 */

[a-zA-Z_][a-zA-Z0-9_]*  SAVE_TOKEN; return ID; /* 标识符 */

[0-9]*\\.[0-9]*          SAVE_TOKEN; return DOUBLE;
[0-9]+                  SAVE_TOKEN; return INTEGER;

\\&quot;(\\\\.|[^\\\\&quot;])*\\&quot;       SAVE_STRING; return STRING; /* 字符串 */
@\\&quot;(\\\\.|[^\\\\&quot;])*\\&quot;      SAVE_STRING_NC; return STRING; /* 无转义字符串 */
\\&#39;(\\\\.|.)\\&#39;             SAVE_STRING; return CHAR;   /* 字符 */

.                       printf(&quot;Unknown Token!\\n&quot;); yyterminate();

%%


char* maketoken(const char* data, int len) {
    char* str = new char[len+1];
    strncpy(str, data, len);
    str[len] = 0;
    return str;
}

char* makestring(const char* data, int len, int s) {
    char* str = new char[len-s+1];
    strncpy(str, data+s-1, len-s);
    str[len-s] = 0;
    if (s == 3) return str;
    printf(&quot;source: %s\\n&quot;,str);
    char* ans = CharEscape(str);
    printf(&quot;escape: %s\\n&quot;,ans);
    delete[] str; 
    return ans; 
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看起来非常的长，但主要多的就是枚举了大量的关键字和运算符，当然，这个你在开发一门语言的前期，不用面面俱到，可以选自己用到的先写，不足的再日后补充。</p><p>要注意，这里最难的应该就是：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&quot;/*&quot;([^\\*]|(\\*)*[^\\*/])*(\\*)*&quot;*/&quot; ; /* 就是这种注释 */ 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>乍看起来，非常恐怖的正则式，但其实就是在枚举多种可能情况，来保障注释范围的正确性。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&quot;/*&quot;   (  [^\\*]   |   (\\*)* [^\\*/]   )*   (\\*)*    &quot;*/&quot; ; /* 就是这种注释 */ 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="用bison创建通用的语法分析程序" tabindex="-1"><a class="header-anchor" href="#用bison创建通用的语法分析程序" aria-hidden="true">#</a> 用Bison创建通用的语法分析程序</h3><p>这里我编写的是类C语言的语法，要注意的是，很多情况会造成规约-规约冲突和移入-规约冲突。这里我简要介绍一个bison的工作原理。</p><p>这种算法在编译原理中，被称为LALR(1)分析法，是自底向上规约的算法之一，而且又会向前看一个token，Bison中的每一行，被称为一个产生式（或BNF范式）</p><p>例如下面这行：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>def_module_statement : KWS_STRUCT ID &#39;{&#39; def_statements &#39;}&#39; 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>左边的是要规约的节点， 冒号右边是描述这个语法节点是用哪些节点产生的。 这是一个结构体定义的语法描述，KWS_STRUCT是终结符，来自Lex里的元素，看了上面的Lex描述，你应该能找到它的定义：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&quot;struct&quot;|&quot;enum&quot;|&quot;union&quot;|&quot;module&quot;|&quot;interface&quot;|&quot;class&quot;     SAVE_TOKEN; return KWS_STRUCT; /* 结构声明 */
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>其实就是可能的一些关键字。而def_statements是另外的语法节点，由其他定义得来。</p><p>规约-规约冲突，是说，在当前产生式结束后，后面跟的元素还确定的情况下，能够规约到两个不同的语法节点:</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>def_module_statement : KWS_STRUCT ID &#39;{&#39; def_statements &#39;}&#39; ;
def_class_statement : KWS_STRUCT ID &#39;{&#39; def_statements &#39;}&#39; ;

statement : def_module_statement &#39;;&#39; 
		  | def_class_statement &#39;;&#39; 
		  ;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上文法便会产生规约-规约冲突，这是严重的定义错误，必须加以避免。 注意，我为了体现这个语法的错误，特意加上了上下文环境，不是说一样的语法定义会产生规约规约冲突，而是说后面可能跟的终结符都一样时，（在这里是&#39;;&#39;）才会产生规约规约冲突，所以避免这种问题也简单，就是把相似的语法节点合并在一起就可以了。</p><p>说道移入-规约冲突，就要谈起if-else的摇摆问题：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>if_state : IF &#39;(&#39; expr &#39;)&#39; statement 
         | IF &#39;(&#39; expr &#39;)&#39; statement ELSE statement 
         ;

statement : if_state
		  | ...
		  ;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>正如这个定义一样，在 if的前半部识别完成后，下一个元素是ELSE终结符，此时可以规约，可以移入 说规约合法的理由是，if_state也是statement，而if第二条statement后面就是ELSE。 根据算法，这里规约是合理的，而移入同样是合理的。</p><p>为了避免这种冲突，一般Bison会优先选择移入，这样ELSE会和最近的IF匹配。 所以说，移入-规约冲突在你清楚的知道是哪的问题的时候，可以不加处理。但未期望的移入-规约冲突有可能让你的分析器不正确工作，这点还需要注意。</p><p>下面是我的Bison配置文件：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>%{
#include &quot;Model/nodes.h&quot;
#include &lt;list&gt;
using namespace std;

#define YYERROR_VERBOSE 1

Node *programBlock; /* the top level root node of our final AST */

extern int yylex();
extern int yylineno;
extern char* yytext;
extern int yyleng;

void yyerror(const char *s);

%}

 

/* Represents the many different ways we can access our data */

%union {
    Node *nodes;
    char *str;
    int token;
}

 

/* Define our terminal symbols (tokens). This should

   match our tokens.l lex file. We also define the node type

   they represent.

 */

%token &lt;str&gt; ID INTEGER DOUBLE
%token &lt;token&gt; CEQ CNE CGE CLE MBK
%token &lt;token&gt; &#39;&lt;&#39; &#39;&gt;&#39; &#39;=&#39; &#39;+&#39; &#39;-&#39; &#39;*&#39; &#39;/&#39; &#39;%&#39; &#39;^&#39; &#39;&amp;&#39; &#39;|&#39; &#39;~&#39; &#39;@&#39;
%token &lt;str&gt; STRING CHAR
%token &lt;token&gt; IF ELSE WHILE DO GOTO FOR FOREACH  
%token &lt;token&gt; DELEGATE DEF DEFINE IMPORT USING NAMESPACE
%token &lt;token&gt; RETURN NEW THIS 
%token &lt;str&gt; KWS_EXIT KWS_ERROR KWS_TSZ KWS_STRUCT KWS_FWKZ KWS_FUNC_XS KWS_TYPE

/* 
   Define the type of node our nonterminal symbols represent.
   The types refer to the %union declaration above. Ex: when
   we call an ident (defined by union type ident) we are really
   calling an (NIdentifier*). It makes the compiler happy.
 */

%type &lt;nodes&gt; program
%type &lt;nodes&gt; def_module_statement
%type &lt;nodes&gt; def_module_statements
%type &lt;nodes&gt; def_statement
%type &lt;nodes&gt; def_statements
%type &lt;nodes&gt; for_state
%type &lt;nodes&gt; if_state
%type &lt;nodes&gt; while_state
%type &lt;nodes&gt; statement
%type &lt;nodes&gt; statements
%type &lt;nodes&gt; block
%type &lt;nodes&gt; var_def
%type &lt;nodes&gt; func_def
%type &lt;nodes&gt; func_def_args
%type &lt;nodes&gt; func_def_xs 
%type &lt;nodes&gt; numeric
%type &lt;nodes&gt; expr
%type &lt;nodes&gt; call_arg 
%type &lt;nodes&gt; call_args 
%type &lt;nodes&gt; return_state

//%type &lt;token&gt; operator 这个设计容易引起规约冲突，舍弃
/* Operator precedence for mathematical operators */


%left &#39;~&#39;
%left &#39;&amp;&#39; &#39;|&#39;
%left CEQ CNE CLE CGE &#39;&lt;&#39; &#39;&gt;&#39; &#39;=&#39;
%left &#39;+&#39; &#39;-&#39;
%left &#39;*&#39; &#39;/&#39; &#39;%&#39; &#39;^&#39;
%left &#39;.&#39;
%left MBK &#39;@&#39;

%start program

%%

program : def_statements { programBlock = Node::getList($1); }
        ;

def_module_statement : KWS_STRUCT ID &#39;{&#39; def_statements &#39;}&#39; { $$ = Node::make_list(3, StringNode::Create($1), StringNode::Create($2), $4); }
                     | KWS_STRUCT ID &#39;;&#39; { $$ = Node::make_list(3, StringNode::Create($1), StringNode::Create($2), Node::Create()); }
                     ;

def_module_statements  : def_module_statement { $$ = Node::getList($1); }
                       | def_module_statements def_module_statement { $$ = $1; $$-&gt;addBrother(Node::getList($2)); }
                       ;

func_def_xs : KWS_FUNC_XS { $$ = StringNode::Create($1); }
            | func_def_xs KWS_FUNC_XS {$$ = $1; $$-&gt;addBrother(StringNode::Create($2)); }
            ;

def_statement : var_def &#39;;&#39; { $$ = $1; }
              | func_def 
              | def_module_statement 
              | func_def_xs func_def { $$ = $2; $2-&gt;addBrother(Node::getList($1)); } 
              ;

def_statements : def_statement { $$ = Node::getList($1); }
               | def_statements def_statement { $$ = $1; $$-&gt;addBrother(Node::getList($2)); }
               ;

statements : statement { $$ = Node::getList($1); }
           | statements statement { $$ = $1; $$-&gt;addBrother(Node::getList($2)); }
           ;

statement : def_statement 
          | expr &#39;;&#39; { $$ = $1; } 
          | block 
          | if_state
          | while_state
          | for_state
          | return_state
          ;

if_state : IF &#39;(&#39; expr &#39;)&#39; statement { $$ = Node::make_list(3, StringNode::Create(&quot;if&quot;), $3, $5); }
         | IF &#39;(&#39; expr &#39;)&#39; statement ELSE statement { $$ = Node::make_list(4, StringNode::Create(&quot;if&quot;), $3, $5, $7); }
         ;

while_state : WHILE &#39;(&#39; expr &#39;)&#39; statement { $$ = Node::make_list(3, StringNode::Create(&quot;while&quot;), $3, $5); }
            ;

for_state : FOR &#39;(&#39; expr &#39;;&#39; expr &#39;;&#39; expr &#39;)&#39; statement { $$ = Node::make_list(5, StringNode::Create(&quot;for&quot;), $3, $5, $7, $9); }
          | FOR &#39;(&#39; var_def &#39;;&#39; expr &#39;;&#39; expr &#39;)&#39; statement { $$ = Node::make_list(5, StringNode::Create(&quot;for&quot;), Node::Create($3), $5, $7, $9); }
          ;

return_state : RETURN &#39;;&#39; { $$ = StringNode::Create(&quot;return&quot;); }
             | RETURN expr &#39;;&#39; { $$ = StringNode::Create(&quot;return&quot;); $$-&gt;addBrother($2); }              

block : &#39;{&#39; statements &#39;}&#39; { $$ = Node::Create($2); }
      | &#39;{&#39; &#39;}&#39; { $$ = Node::Create(); }
      ; 

var_def : KWS_TYPE ID { $$ = Node::make_list(3, StringNode::Create(&quot;set&quot;), StringNode::Create($1), StringNode::Create($2)); }
        | ID ID { $$ = Node::make_list(3, StringNode::Create(&quot;set&quot;), StringNode::Create($1), StringNode::Create($2)); }
        | KWS_TYPE ID &#39;=&#39; expr { $$ = Node::make_list(4, StringNode::Create(&quot;set&quot;), StringNode::Create($1), StringNode::Create($2), $4); }
        | ID ID &#39;=&#39; expr { $$ = Node::make_list(4, StringNode::Create(&quot;set&quot;), StringNode::Create($1), StringNode::Create($2), $4); }
        ;

func_def : ID ID &#39;(&#39; func_def_args &#39;)&#39; block
            { $$ = Node::make_list(5, StringNode::Create(&quot;function&quot;), StringNode::Create($1), StringNode::Create($2), $4, $6); }
         | KWS_TYPE ID &#39;(&#39; func_def_args &#39;)&#39; block
            { $$ = Node::make_list(5, StringNode::Create(&quot;function&quot;), StringNode::Create($1), StringNode::Create($2), $4, $6); }
         | ID ID &#39;(&#39; func_def_args &#39;)&#39; &#39;;&#39;
            { $$ = Node::make_list(5, StringNode::Create(&quot;function&quot;), StringNode::Create($1), StringNode::Create($2), $4); }
         | KWS_TYPE ID &#39;(&#39; func_def_args &#39;)&#39; &#39;;&#39;
            { $$ = Node::make_list(5, StringNode::Create(&quot;function&quot;), StringNode::Create($1), StringNode::Create($2), $4); }
         ;

func_def_args : var_def { $$ = Node::Create(Node::Create($1)); }
              | func_def_args &#39;,&#39; var_def { $$ = $1; $$-&gt;addChildren(Node::Create($3)); }
              | %empty  { $$ = Node::Create(); }
              ;

numeric : INTEGER { $$ = IntNode::Create($1); }
        | DOUBLE { $$ = FloatNode::Create($1); }
        ;

expr : expr &#39;=&#39; expr { $$ = Node::make_list(4, StringNode::Create(&quot;opt2&quot;), StringNode::Create(&quot;=&quot;), $1, $3); }
     | ID &#39;(&#39; call_args &#39;)&#39; { $$ = Node::make_list(2, StringNode::Create(&quot;call&quot;), StringNode::Create($1)); $$-&gt;addBrother($3); }
     | ID { $$ = IDNode::Create($1); }
     | numeric { $$ = $1; }
     | STRING { $$ = StringNode::Create($1); }
     | KWS_TSZ 
     | NEW ID &#39;(&#39; call_args &#39;)&#39; { $$ = Node::make_list(3, StringNode::Create(&quot;new&quot;), StringNode::Create($2), $4); }
     | expr CEQ expr { $$ = Node::make_list(4, StringNode::Create(&quot;opt2&quot;), StringNode::Create(&quot;==&quot;), $1, $3); }
     | expr CNE expr { $$ = Node::make_list(4, StringNode::Create(&quot;opt2&quot;), StringNode::Create(&quot;!=&quot;), $1, $3); }
     | expr CLE expr { $$ = Node::make_list(4, StringNode::Create(&quot;opt2&quot;), StringNode::Create(&quot;&lt;=&quot;), $1, $3); }
     | expr CGE expr { $$ = Node::make_list(4, StringNode::Create(&quot;opt2&quot;), StringNode::Create(&quot;&gt;=&quot;), $1, $3); }
     | expr &#39;&lt;&#39; expr { $$ = Node::make_list(4, StringNode::Create(&quot;opt2&quot;), StringNode::Create(&quot;&lt;&quot;), $1, $3); }
     | expr &#39;&gt;&#39; expr { $$ = Node::make_list(4, StringNode::Create(&quot;opt2&quot;), StringNode::Create(&quot;&gt;&quot;), $1, $3); }
     | expr &#39;+&#39; expr { $$ = Node::make_list(4, StringNode::Create(&quot;opt2&quot;), StringNode::Create(&quot;+&quot;), $1, $3); }
     | expr &#39;-&#39; expr { $$ = Node::make_list(4, StringNode::Create(&quot;opt2&quot;), StringNode::Create(&quot;-&quot;), $1, $3); }
     | expr &#39;*&#39; expr { $$ = Node::make_list(4, StringNode::Create(&quot;opt2&quot;), StringNode::Create(&quot;*&quot;), $1, $3); }
     | expr &#39;/&#39; expr { $$ = Node::make_list(4, StringNode::Create(&quot;opt2&quot;), StringNode::Create(&quot;/&quot;), $1, $3); }
     | expr &#39;%&#39; expr { $$ = Node::make_list(4, StringNode::Create(&quot;opt2&quot;), StringNode::Create(&quot;%&quot;), $1, $3); }
     | expr &#39;^&#39; expr { $$ = Node::make_list(4, StringNode::Create(&quot;opt2&quot;), StringNode::Create(&quot;^&quot;), $1, $3); }
     | expr &#39;&amp;&#39; expr { $$ = Node::make_list(4, StringNode::Create(&quot;opt2&quot;), StringNode::Create(&quot;&amp;&quot;), $1, $3); }
     | expr &#39;|&#39; expr { $$ = Node::make_list(4, StringNode::Create(&quot;opt2&quot;), StringNode::Create(&quot;|&quot;), $1, $3); }
     | expr &#39;.&#39; expr { $$ = Node::make_list(4, StringNode::Create(&quot;opt2&quot;), StringNode::Create(&quot;.&quot;), $1, $3); }
     | &#39;~&#39; expr { $$ = Node::make_list(4, StringNode::Create(&quot;opt1&quot;), StringNode::Create(&quot;~&quot;), $2); }
     | &#39;(&#39; expr &#39;)&#39;  /* ( expr ) */  { $$ = $2; }
     ;


call_arg  :  expr { $$ = $1;  }
          |  ID &#39;:&#39; expr { $$ = Node::make_list(3, StringNode::Create(&quot;:&quot;), $1, $3); }
          ;

call_args : %empty { $$ = Node::Create(); }
          | call_arg { $$ = Node::getList($1); }
          | call_args &#39;,&#39; call_arg  { $$ = $1; $$-&gt;addBrother(Node::getList($3)); }
          ;

%%

void yyerror(const char* s){
    fprintf(stderr, &quot;%s \\n&quot;, s);    
    fprintf(stderr, &quot;line %d: &quot;, yylineno);
    fprintf(stderr, &quot;text %s \\n&quot;, yytext);
    exit(1);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,34),l=[s];function r(u,a){return n(),i("div",null,l)}const c=e(d,[["render",r],["__file","编译器架构的王者LLVM——（4）简单的词法和语法分析.html.vue"]]);export{c as default};
