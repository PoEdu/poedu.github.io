import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{o as i,c as n,f as a}from"./app-7fdc7960.js";const l={},t=a(`<h1 id="编译器架构的王者llvm——-1-现代编译器架构" tabindex="-1"><a class="header-anchor" href="#编译器架构的王者llvm——-1-现代编译器架构" aria-hidden="true">#</a> 编译器架构的王者LLVM——（1）现代编译器架构</h1><h2 id="现代编译器架构" tabindex="-1"><a class="header-anchor" href="#现代编译器架构" aria-hidden="true">#</a> 现代编译器架构</h2><p>编译器技术，作为计算机科学的皇后，从诞生起，就不断推进着计算机科学的发展，编译器的发展史，简直就是计算机发展史的缩影，而编译器的架构也逐句变得更加优雅，独立性更强。</p><p>但说到编译器的架构，可能还留存着编译原理课程的印象，5个经典流程： 词法分析 -&gt; 语法分析 -&gt; 语义分析 -&gt; 中间代码优化 -&gt; 目标代码生成</p><p>一般，我们会将编译器分为一个前端，一个后端，前端负责处理源代码，后端负责生成目标代码。 但软件工程，就是在不断的抽象和分层，分层解决问题是重要的特点，分层能够增加层之间的独立性，更好的完成任务。</p><h3 id="llvm中间代码优化" tabindex="-1"><a class="header-anchor" href="#llvm中间代码优化" aria-hidden="true">#</a> LLVM中间代码优化</h3><p>LLVM的一大特色就是，有着独立的、完善的、严格约束的中间代码表示。这种中间代码，就是LLVM的字节码，是LLVM抽象的精髓，前端生成这种中间代码，后端自动进行各类优化分析，让用LLVM开发的编译器，都能用上最先见的后端优化技术。</p><p><img src="http://www.aosabook.org/images/llvm/SimpleCompiler.png" alt=""></p><p>LLVM另外一大特色就是自带JIT，要知道，这可是在原来很难想象的技术，一个编译器要想实现JIT，是需要进行大量努力的，即时翻译代码，还要兼顾效率和编译时间，可不是一件简单的事情。 但如果你用上了LLVM，JIT只是其中的副产品，直接就可以使用的。</p><p>LLVM将中间代码优化这个流程做到了极致，LLVM工具链，不但可以生成所支持的各个后端平台的代码，更可以方便的将各语言的前端编译后的模块链接到一起，你可以方便的在你的语言中调用C函数。</p><p><img src="http://www.aosabook.org/images/llvm/RetargetableCompiler.png" alt=""></p><h3 id="可读的中间代码" tabindex="-1"><a class="header-anchor" href="#可读的中间代码" aria-hidden="true">#</a> 可读的中间代码</h3><p>LLVM中间代码是非常易读的，而且拥有很多高级结构，例如类型和结构体、元数据等，使用起来非常方便。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>; Declare the string constant as a global constant.
@.str = private unnamed_addr constant [13 x i8] c&quot;hello world\\0A\\00&quot;

; External declaration of the puts function
declare i32 @puts(i8* nocapture) nounwind

; Definition of main function
define i32 @main() {   ; i32()*
  ; Convert [13 x i8]* to i8  *...
  %cast210 = getelementptr [13 x i8], [13 x i8]* @.str, i64 0, i64 0

  ; Call puts function to write out the string to stdout.
  call i32 @puts(i8* %cast210)
  ret i32 0
}

; Named metadata
!0 = !{i32 42, null, !&quot;string&quot;}
!foo = !{!0}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是一段HelloWorld的LLVM字节码，我们发现很清晰，而且几乎所有的位置都有注明类型，这也是在强调，LLVM是强类型的，每个变量和临时值，都要有明确的类型定义。</p><p>下面是结构体的声明：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>%mytype = type { %mytype*, i32 }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>非常遗憾的是，这个结构体的定义只有类型序列信息，没有对应子成员的名称，这是让编译器前端自行保存和查表，来记录这些信息。</p><p>C函数的调用非常方便，只需要简单的声明</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>declare i32 @printf(i8* noalias nocapture, ...)
declare i32 @atoi(i8 zeroext)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>你可以将源码用LLVM编译成.bc，然后用llc编译成.o，再拿Clang链接上各个库就可以了。</p>`,21),d=[t];function s(r,c){return i(),n("div",null,d)}const u=e(l,[["render",s],["__file","编译器架构的王者LLVM——（1）现代编译器架构.html.vue"]]);export{u as default};
