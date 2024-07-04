import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{o as n,c as i,f as t}from"./app-7fdc7960.js";const d={},s=t(`<h1 id="编译器架构的王者llvm——-7-函数的翻译方法" tabindex="-1"><a class="header-anchor" href="#编译器架构的王者llvm——-7-函数的翻译方法" aria-hidden="true">#</a> 编译器架构的王者LLVM——（7）函数的翻译方法</h1><h1 id="函数的翻译方法" tabindex="-1"><a class="header-anchor" href="#函数的翻译方法" aria-hidden="true">#</a> 函数的翻译方法</h1><p>前面介绍了许多编译器架构上面的特点，如何组织语法树、如果多遍扫描语法树。今天开始，我们就要设计本编译器中最核心的部分了，如何设计一个编译时宏，再利用LLVM按顺序生成模块。</p><h2 id="设计宏" tabindex="-1"><a class="header-anchor" href="#设计宏" aria-hidden="true">#</a> 设计宏</h2><p>我们的编译器可以说是宏驱动的，因为我们扫描每个语法节点后，都会考察当前是不是一个合法的宏，例如我们来分析一下上一章的示例代码：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>void hello(int k, int g) {
    ......
}   
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我暂时隐藏了函数体部分，让大家先关注一下函数头</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>		String function
        String void
        String hello
        Node
            Node
                String set
                String int
                String k

            Node
                String set
                String int
                String g

        Node
        	......
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们的语法树的每一层相当于是链表组织的，通过next指针都可以找到下一个元素。 而语法树的开头部分，是一个“function”的宏名称，这个部分就是提示我们用哪个宏函数来翻译用的。</p><p>接下来的节点就是： 返回类型，函数名，参数表，函数体</p><p>例如参数表，里面的内容很多，但我们扫描时，它们是一个整体，进行识别。</p><p>所以我们的宏的形式实际上就是这样：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>	(function 返回类型 函数名 (形参表) (函数体))
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>括号括起来的部分表示是一个列表，而不是一个元素。</p><h2 id="宏函数的编写" tabindex="-1"><a class="header-anchor" href="#宏函数的编写" aria-hidden="true">#</a> 宏函数的编写</h2><p>我们之前已经定义了宏的函数形式，我们需要传入的有我们自己的上下文类和当前要处理的Node节点，返回的是LLVM的Value类型（各个语句的抽象基类）</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>typedef Value* (*CodeGenFunction)(CodeGenContext*, Node*);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>于是我们将这个函数实现出来：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>static Value* function_macro(CodeGenContext* context, Node* node) {
	// 第一个参数, 返回类型


	// 第二个参数, 函数名
	node = node-&gt;getNext();


	// 第三个参数, 参数表
	Node* args_node = node = node-&gt;getNext();


	// 第四个参数, 代码块
	node = node-&gt;getNext();

	return F;
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>获取一个字符串代表的类型，往往不是一件容易的事，尤其在存在结构体和类的情况下，这时，我们往往需要查一下符号表，检查这个字符串是否为类型，以及是什么样的类型，是基本类型、结构体，还是函数指针或者指向其他结构的指针等等。 获取类型，往往是LLVM中非常重要的一步。</p><p>我们这里先写一下查符号表的接口，不做实现，接下来的章节中，我们会介绍经典的栈式符号表的实现。</p><p>第二个参数是函数名，我们将其保存在临时变量中待用：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>static Value* function_type_macro(CodeGenContext* context, Node* node) {
	// 第一个参数, 返回类型
	Type* ret_type = context-&gt;FindType(node);

	// 第二个参数, 函数名
	node = node-&gt;getNext();
	std::string function_name = node-&gt;getStr();

	// 第三个参数, 参数表
	Node* args_node = node = node-&gt;getNext();

	// 第四个参数, 代码块
	node = node-&gt;getNext();

	return F;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来的参数表也许是很不好实现的一部分，因为其嵌套比较复杂，不过思路还好，就是不断的去扫描节点，这样我们就可以写出如下的代码：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>	// 第三个参数, 参数表
	Node* args_node = node = node-&gt;getNext();
	std::vector&lt;Type*&gt; type_vec;   // 类型列表
	std::vector&lt;std::string&gt; arg_name; // 参数名列表
	if (args_node-&gt;getChild() != NULL) {
		for (Node* pC = args_node-&gt;getChild(); 
			 pC != NULL; pC = pC-&gt;getNext() ) 
		{
			Node* pSec = pC-&gt;getChild()-&gt;getNext();
			Type* t = context-&gt;FindType(pSec);
			type_vec.push_back(t);
			arg_name.push_back(pSec-&gt;getNext()-&gt;getStr());	
		}
	}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实有了前三个参数，我们就可以构建LLVM中的函数声明了，这样是不用写函数体代码的。 LLVM里很多对象都有这个特点，函数可以只声明函数头，解析完函数体后再将其填回去。结构体也一样，可以先声明符号，回头再向里填入类型信息。这些特性都是方便生成声明的实现，并且在多遍扫描的实现中也会显得很灵活。</p><p>我们下面来声明这个函数：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>	// 先合成一个函数
	FunctionType *FT = FunctionType::get(ret_type, type_vec, 
		/*not vararg*/false);

	Module* M = context-&gt;getModule();
	Function *F = Function::Create(FT, Function::ExternalLinkage, 
		function_name, M);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里，我们使用了函数类型，这也是派生自Type的其中一个类，函数类型也可以getPointerTo来获取函数指针类型。 另外，如果构建函数时，添加了Function::ExternalLinkage参数，就相当于C语言的extern关键字，确定这个函数要导出符号。这样，你写的函数就能够被外部链接，或者作为外部函数的声明使用。</p><h2 id="函数的特殊问题" tabindex="-1"><a class="header-anchor" href="#函数的特殊问题" aria-hidden="true">#</a> 函数的特殊问题</h2><p>接下来我们要创建函数的代码块，但这部分代码实际上和上面的不是在同一个函数中实现的，应该说，他们不是在一趟扫描中。 我们知道，如果要让一个函数内的代码块能够调用在任意位置声明的函数，那么我们就必须对所有函数都先处理刚才讲过的前三个参数，这样函数的声明就有了，在之后的正式扫描中，才有了如下的代码块生成部分：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>	// 第四个参数, 代码块
	node = node-&gt;getNext();
	BasicBlock* bb = context-&gt;createBlock(F); // 创建新的Block

	// 特殊处理参数表, 这个地方特别坑，你必须给每个函数的参数
	// 手动AllocaInst开空间，再用StoreInst存一遍才行，否则一Load就报错
	// context-&gt;MacroMake(args_node-&gt;getChild());
	if (args_node-&gt;getChild() != NULL) {
		context-&gt;MacroMake(args_node);
		int i = 0;
		for (auto arg = F-&gt;arg_begin(); i != arg_name.size(); ++arg, ++i) {
			arg-&gt;setName(arg_name[i]);
			Value* argumentValue = arg;
			ValueSymbolTable* st = bb-&gt;getValueSymbolTable();
			Value* v = st-&gt;lookup(arg_name[i]);
			new StoreInst(argumentValue, v, false, bb);
		}
	}
	context-&gt;MacroMake(node);

	// 处理块结尾
	bb = context-&gt;getNowBlock();
	if (bb-&gt;getTerminator() == NULL)
		ReturnInst::Create(*(context-&gt;getContext()), bb);
	return F;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个地方问题非常多，我先保留一个悬念，在接下来代码块和变量存储与加载的讲解中，我会再次提到这个部分的特殊处理。</p>`,33),l=[s];function a(r,v){return n(),i("div",null,l)}const o=e(d,[["render",a],["__file","编译器架构的王者LLVM——（7）函数的翻译方法.html.vue"]]);export{o as default};
