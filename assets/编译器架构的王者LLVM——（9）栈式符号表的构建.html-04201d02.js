import{_ as s}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o as l,c as r,d as e,e as i,a as d,f as a}from"./app-7fdc7960.js";const v="/assets/fhb-9fed109f.png",c={},u=a(`<h1 id="编译器架构的王者llvm——-9-栈式符号表的构建" tabindex="-1"><a class="header-anchor" href="#编译器架构的王者llvm——-9-栈式符号表的构建" aria-hidden="true">#</a> 编译器架构的王者LLVM——（9）栈式符号表的构建</h1><h1 id="栈式符号表的构建" tabindex="-1"><a class="header-anchor" href="#栈式符号表的构建" aria-hidden="true">#</a> 栈式符号表的构建</h1><p>栈式符号表对于一款编译器，无疑是核心的组件。 无论你在做什么符号扫描，那么都离不开符号表，如何得知一个符号是否定义，以及它的类型，那么唯有查看符号表中的记录。 栈式符号表并不复杂，但思想精妙，本文，将介绍一款栈式符号表的原理及简单构建。</p><h2 id="源代码的例子" tabindex="-1"><a class="header-anchor" href="#源代码的例子" aria-hidden="true">#</a> 源代码的例子</h2><p>首先我们来看一段C代码</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>int a[3] = { 100, 10, 1};

int work() {
	if (a[0] == 100) { // 这里的a指向的是全局符号a
		int a = 99999; // 重新定义了局部符号    下图的符号表是扫描到这里后的情况
		for (int i = 0; i&lt; 10; ++i) {
			a /= 3; // 由于局部符号优先级较高，引用局部符号
		}
		return a; // 局部符号
	}
	return a[0]; // 局部符号生命周期已过，找到全局符号
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>于是我们发现，符号表在局部声明变量后，将局部符号增加了，这和全局符号并不冲突，而是优先级不同，越靠近栈顶，越先发现</p><p><img src="`+v+`" alt=""></p><h2 id="用c-的map和stack构建符号表" tabindex="-1"><a class="header-anchor" href="#用c-的map和stack构建符号表" aria-hidden="true">#</a> 用C++的map和stack构建符号表</h2><p>如果考虑效率的话，最佳选择是用C语言构建符号表，这样操作起来会更快，但我们毕竟目前考虑开发的简便型而言，用C++的map就可以方便地实现符号表。</p><p>首先我们做一个局部符号表，由于其中不会有重复的符号名，所以我们只要简单的将其存放起来即可。 然后符号表还需要记录很多类型信息、指针信息等，我们设计一个结构体表示它们：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>enum SymbolType
{
	var_t, type_t, struct_t, enum_t, delegate_t, function_t
};

struct id {
    int        level;
    SymbolType type;
    void*      data;
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们目前是简单起见，由于还不知道都可能放哪些东西，例如数组符号，肯定要包含数组长度、维度等信息，各种变量都会包含类型信息，所以我们这里放了一个void*的指针，到时候需要的化，就强制转换一下。</p><p>这里其实定义一个基类，需要存储的内容去多态派生也是可以的，没做主要是因为可能存放的东西类型很多，暂时先用一个void*，这样可能方便一点。</p><p>于是我们的局部符号表就有了：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>class IDMap
{
public:
    IDMap();
    ~IDMap();
    id* find(string&amp; str) const; // 查找一个符号
    void insert(string&amp; str, int level, SymbolType type, void* data); // 插入一个符号
private:
    map&lt;string,id*&gt; ID_map;
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我想查找和插入都是C++中map的基础函数，大家应该很轻松就能实现吧。</p><p>再弄一个栈来存储一个IDMap：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>class IDTable
{
public:
    IDTable();
    id* find(string&amp; str) const;
    void insert(string&amp; str,SymbolType type, void* data);
    void push(); // 压栈和弹栈操作，例如在函数的解析时，需要压栈，一个函数解析完，就弹栈
    void pop();
    int getLevel(); // 获取当前的层级，如果为0，则说明是只有全局符号了
private:
    deque&lt;IDMap&gt; ID_stack;
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里用deque而没用stack的原因是，deque支持随机访问，而stack只能访问栈顶。</p><p>寻找时，就按照从栈顶到栈底的顺序依次寻找符号：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>id* IDTable::find(string&amp; idname) const {
    for (auto p = ID_stack.rbegin(); p != ID_stack.rend(); ++p) {
        const IDMap&amp; imap = *p;
        id* pid = imap.find(idname);
        if (pid != NULL) return pid;
    }
    return NULL;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>插入时，就往栈顶，当前最新的符号表里面插入：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>void IDTable::insert(string&amp; str,SymbolType type, void* data) {
    IDMap&amp; imap = ID_stack.back();
    imap.insert(str,getLevel(), type, data);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，一款简易的栈式符号表就构建好了。</p><h2 id="附1-github参考源码" tabindex="-1"><a class="header-anchor" href="#附1-github参考源码" aria-hidden="true">#</a> 附1：Github参考源码</h2>`,26),m={href:"https://github.com/sunxfancy/RedApple/blob/master/src/idmap.h",target:"_blank",rel:"noopener noreferrer"},o={href:"https://github.com/sunxfancy/RedApple/blob/master/src/idmap.cpp",target:"_blank",rel:"noopener noreferrer"},b={href:"https://github.com/sunxfancy/RedApple/blob/master/src/idtable.h",target:"_blank",rel:"noopener noreferrer"},p={href:"https://github.com/sunxfancy/RedApple/blob/master/src/idtable.cpp",target:"_blank",rel:"noopener noreferrer"},h=e("h2",{id:"附2-graphviz的绘图源码",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#附2-graphviz的绘图源码","aria-hidden":"true"},"#"),i(" 附2：Graphviz的绘图源码")],-1),_={href:"http://blog.csdn.net/xfxyy_sxfancy/article/details/49641825",target:"_blank",rel:"noopener noreferrer"},g=a(`<div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>digraph g {
	graph [
		rankdir = &quot;LR&quot;
	];
	node [
		fontsize = &quot;16&quot;
		shape = &quot;ellipse&quot;
	];
	edge [
	];

	&quot;node0&quot; [
		label = &quot;&lt;f0&gt; stack | &lt;f1&gt; | &lt;f2&gt; | ...&quot;
		shape = &quot;record&quot;	
	];

	&quot;node1&quot; [
		label = &quot;&lt;f0&gt; 全局符号 | a | work |  | ...&quot;
		shape = &quot;record&quot;
	]

	&quot;node2&quot; [
		label = &quot;&lt;f0&gt; 局部符号 | a |  | ...&quot;
		shape = &quot;record&quot;
	]

	&quot;node0&quot;:f1 -&gt; &quot;node1&quot;:f0 [
		id = 0
	];

	&quot;node0&quot;:f2 -&gt; &quot;node2&quot;:f0 [
		id = 1
	];

}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1);function f(x,q){const n=t("ExternalLinkIcon");return l(),r("div",null,[u,e("p",null,[e("a",m,[i("idmap.h"),d(n)]),e("a",o,[i("idmap.cpp"),d(n)]),e("a",b,[i("idtable.h"),d(n)]),e("a",p,[i("idtable.cpp"),d(n)])]),h,e("p",null,[i("Graphviz绘图真的非常爽，上面的数据结构图就是用它的dot画的，想了解的朋友可以参考我之前写的 "),e("a",_,[i("结构化图形绘制利器Graphviz"),d(n)]),i("：")]),g])}const I=s(c,[["render",f],["__file","编译器架构的王者LLVM——（9）栈式符号表的构建.html.vue"]]);export{I as default};
