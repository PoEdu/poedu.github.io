import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as a,f as e}from"./app-7fdc7960.js";const t={},p=e(`<h1 id="编译器架构的王者llvm——-2-开发llvm项目" tabindex="-1"><a class="header-anchor" href="#编译器架构的王者llvm——-2-开发llvm项目" aria-hidden="true">#</a> 编译器架构的王者LLVM——（2）开发LLVM项目</h1><h2 id="开发llvm项目" tabindex="-1"><a class="header-anchor" href="#开发llvm项目" aria-hidden="true">#</a> 开发LLVM项目</h2><p>介绍了LLVM这么多，那么我们能用LLVM做一款自己的编程语言么？答案是，有点难度，但不是不可行。只要你熟悉C++编程，而且有足够的热情，那么就没有什么能阻止你了。</p><p>下面我就来介绍一下，LLVM项目的基本方法。 需要的东西： LLVM平台库，文档，CMAKE，C++编译器</p><h3 id="环境搭建" tabindex="-1"><a class="header-anchor" href="#环境搭建" aria-hidden="true">#</a> 环境搭建</h3><p>首先我的系统是Ubuntu14.04，我就介绍Ubuntu下的配置方法了，用Windows的朋友就不好意思了。 安装llvm-3.6及其开发包：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>sudo apt-get install llvm-3.6*
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>一般是推荐将文档和示例都下载下来的，因为比较这些对应版本的参考很重要，很多网上的代码，都是特定版本有效，后来就有API变更的情况。 所以大家一定注意版本问题，我开发的时候，源里面的版本最高就3.6，我也不追求什么最新版本，新特性什么的，所以声明一下，本系列教程的LLVM版本均为3.6版，文档参考也为3.6版。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>sudo apt-get install clang cmake
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>clang编译器，我个人感觉比gcc好用许多倍，而且这个编译器就是用llvm作为后端，能够帮助我们编译一些C代码到LLVM中间码，方便我们有个正确的中间码参考。</p><h3 id="cmake管理项目" tabindex="-1"><a class="header-anchor" href="#cmake管理项目" aria-hidden="true">#</a> CMAKE管理项目</h3><p>CMake作为C++项目管理的利器，也是非常好用的一个工具，这样我们就不用自己很烦的写Makefile了，</p><p>下面是一个CMake示例，同时还带有FLex和Bison的配置：</p><div class="language-cmake line-numbers-mode" data-ext="cmake"><pre class="language-cmake"><code><span class="token keyword">cmake_minimum_required</span><span class="token punctuation">(</span><span class="token property">VERSION</span> <span class="token number">2.8</span><span class="token punctuation">)</span>
<span class="token keyword">project</span><span class="token punctuation">(</span>RedApple<span class="token punctuation">)</span>

<span class="token keyword">set</span><span class="token punctuation">(</span>LLVM_TARGETS_TO_BUILD X86<span class="token punctuation">)</span>
<span class="token keyword">set</span><span class="token punctuation">(</span>LLVM_BUILD_RUNTIME <span class="token boolean">OFF</span><span class="token punctuation">)</span>
<span class="token keyword">set</span><span class="token punctuation">(</span>LLVM_BUILD_TOOLS <span class="token boolean">OFF</span><span class="token punctuation">)</span>

<span class="token keyword">find_package</span><span class="token punctuation">(</span>LLVM REQUIRED CONFIG<span class="token punctuation">)</span>
<span class="token keyword">message</span><span class="token punctuation">(</span>STATUS <span class="token string">&quot;Found LLVM <span class="token interpolation"><span class="token punctuation">\${</span><span class="token variable">LLVM_PACKAGE_VERSION</span><span class="token punctuation">}</span></span>&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">message</span><span class="token punctuation">(</span>STATUS <span class="token string">&quot;Using LLVMConfig.cmake in: <span class="token interpolation"><span class="token punctuation">\${</span><span class="token variable">LLVM_DIR</span><span class="token punctuation">}</span></span>&quot;</span><span class="token punctuation">)</span>

<span class="token keyword">find_package</span><span class="token punctuation">(</span>BISON<span class="token punctuation">)</span>
<span class="token keyword">find_package</span><span class="token punctuation">(</span>FLEX<span class="token punctuation">)</span>

<span class="token function">SET</span> <span class="token punctuation">(</span><span class="token variable">CMAKE_CXX_COMPILER_ENV_VAR</span> <span class="token string">&quot;clang++&quot;</span><span class="token punctuation">)</span>
<span class="token function">SET</span> <span class="token punctuation">(</span><span class="token variable">CMAKE_CXX_FLAGS</span> <span class="token string">&quot;-std=c++11&quot;</span><span class="token punctuation">)</span>
<span class="token function">SET</span> <span class="token punctuation">(</span><span class="token variable">CMAKE_CXX_FLAGS_DEBUG</span>   <span class="token string">&quot;-g&quot;</span><span class="token punctuation">)</span>
<span class="token function">SET</span> <span class="token punctuation">(</span><span class="token variable">CMAKE_CXX_FLAGS_MINSIZEREL</span>  <span class="token string">&quot;-Os -DNDEBUG&quot;</span><span class="token punctuation">)</span>
<span class="token function">SET</span> <span class="token punctuation">(</span><span class="token variable">CMAKE_CXX_FLAGS_RELEASE</span>  <span class="token string">&quot;-O4 -DNDEBUG&quot;</span><span class="token punctuation">)</span>
<span class="token function">SET</span> <span class="token punctuation">(</span><span class="token variable">CMAKE_CXX_FLAGS_RELWITHDEBINFO</span> <span class="token string">&quot;-O2 -g&quot;</span><span class="token punctuation">)</span>

<span class="token function">SET</span><span class="token punctuation">(</span><span class="token variable">EXECUTABLE_OUTPUT_PATH</span> <span class="token punctuation">\${</span><span class="token variable">PROJECT_SOURCE_DIR</span><span class="token punctuation">}</span>/bin<span class="token punctuation">)</span>

<span class="token keyword">include_directories</span><span class="token punctuation">(</span><span class="token punctuation">\${</span>LLVM_INCLUDE_DIRS<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">add_definitions</span><span class="token punctuation">(</span><span class="token punctuation">\${</span>LLVM_DEFINITIONS<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token function">FLEX_TARGET</span><span class="token punctuation">(</span>MyScanner <span class="token punctuation">\${</span><span class="token variable">CMAKE_CURRENT_SOURCE_DIR</span><span class="token punctuation">}</span>/src/redapple_lex.l
                      <span class="token punctuation">\${</span><span class="token variable">CMAKE_CURRENT_BINARY_DIR</span><span class="token punctuation">}</span>/redapple_lex.cpp <span class="token property">COMPILE_FLAGS</span> -w<span class="token punctuation">)</span>
<span class="token function">BISON_TARGET</span><span class="token punctuation">(</span>MyParser <span class="token punctuation">\${</span><span class="token variable">CMAKE_CURRENT_SOURCE_DIR</span><span class="token punctuation">}</span>/src/redapple_parser.y
                      <span class="token punctuation">\${</span><span class="token variable">CMAKE_CURRENT_BINARY_DIR</span><span class="token punctuation">}</span>/redapple_parser.cpp<span class="token punctuation">)</span>
<span class="token function">ADD_FLEX_BISON_DEPENDENCY</span><span class="token punctuation">(</span>MyScanner MyParser<span class="token punctuation">)</span>

<span class="token keyword">include_directories</span><span class="token punctuation">(</span>Debug Release build include src src/Model src/Utils<span class="token punctuation">)</span>

<span class="token keyword">file</span><span class="token punctuation">(</span>GLOB_RECURSE source_files  <span class="token punctuation">\${</span><span class="token variable">CMAKE_CURRENT_SOURCE_DIR</span><span class="token punctuation">}</span>/src/*.cpp
                                <span class="token punctuation">\${</span><span class="token variable">CMAKE_CURRENT_SOURCE_DIR</span><span class="token punctuation">}</span>/src/Model/*.cpp
                                <span class="token punctuation">\${</span><span class="token variable">CMAKE_CURRENT_SOURCE_DIR</span><span class="token punctuation">}</span>/src/Macro/*.cpp
                                <span class="token punctuation">\${</span><span class="token variable">CMAKE_CURRENT_SOURCE_DIR</span><span class="token punctuation">}</span>/src/Utils/*.cpp<span class="token punctuation">)</span>
<span class="token keyword">add_executable</span><span class="token punctuation">(</span>redapple <span class="token punctuation">\${</span>source_files<span class="token punctuation">}</span> 
                        <span class="token punctuation">\${</span>BISON_MyParser_OUTPUTS<span class="token punctuation">}</span> 
                        <span class="token punctuation">\${</span>FLEX_MyScanner_OUTPUTS<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">install</span><span class="token punctuation">(</span>TARGETS redapple RUNTIME DESTINATION bin<span class="token punctuation">)</span>

<span class="token comment"># Find the libraries that correspond to the LLVM components</span>
<span class="token comment"># that we wish to use</span>
<span class="token function">llvm_map_components_to_libnames</span><span class="token punctuation">(</span>llvm_libs 
    support core irreader executionengine interpreter 
    mc mcjit bitwriter x86codegen target<span class="token punctuation">)</span>

<span class="token comment"># Link against LLVM libraries</span>
<span class="token keyword">target_link_libraries</span><span class="token punctuation">(</span>redapple <span class="token punctuation">\${</span>llvm_libs<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Ubuntu的默认安装，有时LLVM会出bug，cmake找不到许多配置文件，我仔细查看了它的CMake配置，发现有一行脚本路径写错了： /usr/share/llvm-3.6/cmake/ 是llvm的cmake配置路径</p><p>其中的LLVMConfig.cmake第48行，它原来的路径是这样的：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>set(LLVM_CMAKE_DIR &quot;/usr/share/llvm-3.6/share/llvm/cmake&quot;)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>应该改成：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>set(LLVM_CMAKE_DIR &quot;/usr/share/llvm-3.6/cmake&quot;)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Ubuntu下的llvm文档和示例都在如下目录： /usr/share/doc/llvm-3.6-doc /usr/share/doc/llvm-3.6-examples</p><p>我们将example下的HowToUseJIT复制到工作目录中，测试编译一下，懒得找的可以粘我后面附录给的内容。 然后再用简单修改后的CMake测试编译一下。</p><p>项目结构是这样的：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>HowToUseJIT -- src
                + --- HowToUseJIT.cpp
        +  --- CMakeLists.txt
        +  --- build 

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在项目根目录执行如下指令：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>cd build
cmake ..
make
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果编译通过了，那么恭喜你，你已经会构建LLVM项目了</p><h3 id="附-cmakelists-txt-和-howtousejit-cpp" tabindex="-1"><a class="header-anchor" href="#附-cmakelists-txt-和-howtousejit-cpp" aria-hidden="true">#</a> 附： CMakeLists.txt 和 HowToUseJIT.cpp</h3><p>CMakeLists.txt</p><div class="language-cmake line-numbers-mode" data-ext="cmake"><pre class="language-cmake"><code><span class="token keyword">cmake_minimum_required</span><span class="token punctuation">(</span><span class="token property">VERSION</span> <span class="token number">2.8</span><span class="token punctuation">)</span>
<span class="token keyword">project</span><span class="token punctuation">(</span>llvm_test<span class="token punctuation">)</span>

<span class="token keyword">set</span><span class="token punctuation">(</span>LLVM_TARGETS_TO_BUILD X86<span class="token punctuation">)</span>
<span class="token keyword">set</span><span class="token punctuation">(</span>LLVM_BUILD_RUNTIME <span class="token boolean">OFF</span><span class="token punctuation">)</span>
<span class="token keyword">set</span><span class="token punctuation">(</span>LLVM_BUILD_TOOLS <span class="token boolean">OFF</span><span class="token punctuation">)</span>

<span class="token keyword">find_package</span><span class="token punctuation">(</span>LLVM REQUIRED CONFIG<span class="token punctuation">)</span>

<span class="token keyword">message</span><span class="token punctuation">(</span>STATUS <span class="token string">&quot;Found LLVM <span class="token interpolation"><span class="token punctuation">\${</span><span class="token variable">LLVM_PACKAGE_VERSION</span><span class="token punctuation">}</span></span>&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">message</span><span class="token punctuation">(</span>STATUS <span class="token string">&quot;Using LLVMConfig.cmake in: <span class="token interpolation"><span class="token punctuation">\${</span><span class="token variable">LLVM_DIR</span><span class="token punctuation">}</span></span>&quot;</span><span class="token punctuation">)</span>


<span class="token function">SET</span> <span class="token punctuation">(</span><span class="token variable">CMAKE_CXX_COMPILER_ENV_VAR</span> <span class="token string">&quot;clang++&quot;</span><span class="token punctuation">)</span>

<span class="token function">SET</span> <span class="token punctuation">(</span><span class="token variable">CMAKE_CXX_FLAGS</span> <span class="token string">&quot;-std=c++11&quot;</span><span class="token punctuation">)</span>
<span class="token function">SET</span> <span class="token punctuation">(</span><span class="token variable">CMAKE_CXX_FLAGS_DEBUG</span>   <span class="token string">&quot;-g&quot;</span><span class="token punctuation">)</span>
<span class="token function">SET</span> <span class="token punctuation">(</span><span class="token variable">CMAKE_CXX_FLAGS_MINSIZEREL</span>  <span class="token string">&quot;-Os -DNDEBUG&quot;</span><span class="token punctuation">)</span>
<span class="token function">SET</span> <span class="token punctuation">(</span><span class="token variable">CMAKE_CXX_FLAGS_RELEASE</span>  <span class="token string">&quot;-O4 -DNDEBUG&quot;</span><span class="token punctuation">)</span>
<span class="token function">SET</span> <span class="token punctuation">(</span><span class="token variable">CMAKE_CXX_FLAGS_RELWITHDEBINFO</span> <span class="token string">&quot;-O2 -g&quot;</span><span class="token punctuation">)</span>

<span class="token function">SET</span><span class="token punctuation">(</span><span class="token variable">EXECUTABLE_OUTPUT_PATH</span> <span class="token punctuation">\${</span><span class="token variable">PROJECT_SOURCE_DIR</span><span class="token punctuation">}</span>/bin<span class="token punctuation">)</span>

<span class="token keyword">include_directories</span><span class="token punctuation">(</span><span class="token punctuation">\${</span>LLVM_INCLUDE_DIRS<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">add_definitions</span><span class="token punctuation">(</span><span class="token punctuation">\${</span>LLVM_DEFINITIONS<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">file</span><span class="token punctuation">(</span>GLOB_RECURSE source_files <span class="token string">&quot;<span class="token interpolation"><span class="token punctuation">\${</span><span class="token variable">CMAKE_CURRENT_SOURCE_DIR</span><span class="token punctuation">}</span></span>/src/*.cpp&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">add_executable</span><span class="token punctuation">(</span>llvm_test <span class="token punctuation">\${</span>source_files<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">install</span><span class="token punctuation">(</span>TARGETS llvm_test RUNTIME DESTINATION bin<span class="token punctuation">)</span>

<span class="token comment"># Find the libraries that correspond to the LLVM components</span>
<span class="token comment"># that we wish to use</span>
<span class="token function">llvm_map_components_to_libnames</span><span class="token punctuation">(</span>llvm_libs 
    Core
    ExecutionEngine
    Interpreter
    MC
    Support
    nativecodegen<span class="token punctuation">)</span>

<span class="token comment"># Link against LLVM libraries</span>
<span class="token keyword">target_link_libraries</span><span class="token punctuation">(</span>llvm_test <span class="token punctuation">\${</span>llvm_libs<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>HowToUseJIT.cpp</p><div class="language-cpp line-numbers-mode" data-ext="cpp"><pre class="language-cpp"><code><span class="token comment">//===-- examples/HowToUseJIT/HowToUseJIT.cpp - An example use of the JIT --===//</span>
<span class="token comment">//</span>
<span class="token comment">//                     The LLVM Compiler Infrastructure</span>
<span class="token comment">//</span>
<span class="token comment">// This file is distributed under the University of Illinois Open Source</span>
<span class="token comment">// License. See LICENSE.TXT for details.</span>
<span class="token comment">//</span>
<span class="token comment">//===----------------------------------------------------------------------===//</span>
<span class="token comment">//</span>
<span class="token comment">//  This small program provides an example of how to quickly build a small</span>
<span class="token comment">//  module with two functions and execute it with the JIT.</span>
<span class="token comment">//</span>
<span class="token comment">// Goal:</span>
<span class="token comment">//  The goal of this snippet is to create in the memory</span>
<span class="token comment">//  the LLVM module consisting of two functions as follow: </span>
<span class="token comment">//</span>
<span class="token comment">// int add1(int x) {</span>
<span class="token comment">//   return x+1;</span>
<span class="token comment">// }</span>
<span class="token comment">//</span>
<span class="token comment">// int foo() {</span>
<span class="token comment">//   return add1(10);</span>
<span class="token comment">// }</span>
<span class="token comment">//</span>
<span class="token comment">// then compile the module via JIT, then execute the \`foo&#39;</span>
<span class="token comment">// function and return result to a driver, i.e. to a &quot;host program&quot;.</span>
<span class="token comment">//</span>
<span class="token comment">// Some remarks and questions:</span>
<span class="token comment">//</span>
<span class="token comment">// - could we invoke some code using noname functions too?</span>
<span class="token comment">//   e.g. evaluate &quot;foo()+foo()&quot; without fears to introduce</span>
<span class="token comment">//   conflict of temporary function name with some real</span>
<span class="token comment">//   existing function name?</span>
<span class="token comment">//</span>
<span class="token comment">//===----------------------------------------------------------------------===//</span>

<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;llvm/ExecutionEngine/GenericValue.h&quot;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;llvm/ExecutionEngine/Interpreter.h&quot;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;llvm/IR/Constants.h&quot;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;llvm/IR/DerivedTypes.h&quot;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;llvm/IR/IRBuilder.h&quot;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;llvm/IR/Instructions.h&quot;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;llvm/IR/LLVMContext.h&quot;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;llvm/IR/Module.h&quot;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;llvm/Support/ManagedStatic.h&quot;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;llvm/Support/TargetSelect.h&quot;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;llvm/Support/raw_ostream.h&quot;</span></span>

<span class="token keyword">using</span> <span class="token keyword">namespace</span> llvm<span class="token punctuation">;</span>

<span class="token keyword">int</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  
  <span class="token function">InitializeNativeTarget</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  LLVMContext Context<span class="token punctuation">;</span>
  
  <span class="token comment">// Create some module to put our function into it.</span>
  std<span class="token double-colon punctuation">::</span>unique_ptr<span class="token operator">&lt;</span>Module<span class="token operator">&gt;</span> Owner <span class="token operator">=</span> <span class="token generic-function"><span class="token function">make_unique</span><span class="token generic class-name"><span class="token operator">&lt;</span>Module<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span><span class="token string">&quot;test&quot;</span><span class="token punctuation">,</span> Context<span class="token punctuation">)</span><span class="token punctuation">;</span>
  Module <span class="token operator">*</span>M <span class="token operator">=</span> Owner<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Create the add1 function entry and insert this entry into module M.  The</span>
  <span class="token comment">// function will have a return type of &quot;int&quot; and take an argument of &quot;int&quot;.</span>
  <span class="token comment">// The &#39;0&#39; terminates the list of argument types.</span>
  Function <span class="token operator">*</span>Add1F <span class="token operator">=</span>
    <span class="token generic-function"><span class="token function">cast</span><span class="token generic class-name"><span class="token operator">&lt;</span>Function<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>M<span class="token operator">-&gt;</span><span class="token function">getOrInsertFunction</span><span class="token punctuation">(</span><span class="token string">&quot;add1&quot;</span><span class="token punctuation">,</span> <span class="token class-name">Type</span><span class="token double-colon punctuation">::</span><span class="token function">getInt32Ty</span><span class="token punctuation">(</span>Context<span class="token punctuation">)</span><span class="token punctuation">,</span>
                                          <span class="token class-name">Type</span><span class="token double-colon punctuation">::</span><span class="token function">getInt32Ty</span><span class="token punctuation">(</span>Context<span class="token punctuation">)</span><span class="token punctuation">,</span>
                                          <span class="token punctuation">(</span>Type <span class="token operator">*</span><span class="token punctuation">)</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Add a basic block to the function. As before, it automatically inserts</span>
  <span class="token comment">// because of the last argument.</span>
  BasicBlock <span class="token operator">*</span>BB <span class="token operator">=</span> <span class="token class-name">BasicBlock</span><span class="token double-colon punctuation">::</span><span class="token function">Create</span><span class="token punctuation">(</span>Context<span class="token punctuation">,</span> <span class="token string">&quot;EntryBlock&quot;</span><span class="token punctuation">,</span> Add1F<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Create a basic block builder with default parameters.  The builder will</span>
  <span class="token comment">// automatically append instructions to the basic block \`BB&#39;.</span>
  IRBuilder<span class="token operator">&lt;</span><span class="token operator">&gt;</span> <span class="token function">builder</span><span class="token punctuation">(</span>BB<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Get pointers to the constant \`1&#39;.</span>
  Value <span class="token operator">*</span>One <span class="token operator">=</span> builder<span class="token punctuation">.</span><span class="token function">getInt32</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Get pointers to the integer argument of the add1 function...</span>
  <span class="token function">assert</span><span class="token punctuation">(</span>Add1F<span class="token operator">-&gt;</span><span class="token function">arg_begin</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> Add1F<span class="token operator">-&gt;</span><span class="token function">arg_end</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Make sure there&#39;s an arg</span>
  Argument <span class="token operator">*</span>ArgX <span class="token operator">=</span> Add1F<span class="token operator">-&gt;</span><span class="token function">arg_begin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// Get the arg</span>
  ArgX<span class="token operator">-&gt;</span><span class="token function">setName</span><span class="token punctuation">(</span><span class="token string">&quot;AnArg&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>            <span class="token comment">// Give it a nice symbolic name for fun.</span>

  <span class="token comment">// Create the add instruction, inserting it into the end of BB.</span>
  Value <span class="token operator">*</span>Add <span class="token operator">=</span> builder<span class="token punctuation">.</span><span class="token function">CreateAdd</span><span class="token punctuation">(</span>One<span class="token punctuation">,</span> ArgX<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Create the return instruction and add it to the basic block</span>
  builder<span class="token punctuation">.</span><span class="token function">CreateRet</span><span class="token punctuation">(</span>Add<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Now, function add1 is ready.</span>


  <span class="token comment">// Now we&#39;re going to create function \`foo&#39;, which returns an int and takes no</span>
  <span class="token comment">// arguments.</span>
  Function <span class="token operator">*</span>FooF <span class="token operator">=</span>
    <span class="token generic-function"><span class="token function">cast</span><span class="token generic class-name"><span class="token operator">&lt;</span>Function<span class="token operator">&gt;</span></span></span><span class="token punctuation">(</span>M<span class="token operator">-&gt;</span><span class="token function">getOrInsertFunction</span><span class="token punctuation">(</span><span class="token string">&quot;foo&quot;</span><span class="token punctuation">,</span> <span class="token class-name">Type</span><span class="token double-colon punctuation">::</span><span class="token function">getInt32Ty</span><span class="token punctuation">(</span>Context<span class="token punctuation">)</span><span class="token punctuation">,</span>
                                          <span class="token punctuation">(</span>Type <span class="token operator">*</span><span class="token punctuation">)</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Add a basic block to the FooF function.</span>
  BB <span class="token operator">=</span> <span class="token class-name">BasicBlock</span><span class="token double-colon punctuation">::</span><span class="token function">Create</span><span class="token punctuation">(</span>Context<span class="token punctuation">,</span> <span class="token string">&quot;EntryBlock&quot;</span><span class="token punctuation">,</span> FooF<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Tell the basic block builder to attach itself to the new basic block</span>
  builder<span class="token punctuation">.</span><span class="token function">SetInsertPoint</span><span class="token punctuation">(</span>BB<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Get pointer to the constant \`10&#39;.</span>
  Value <span class="token operator">*</span>Ten <span class="token operator">=</span> builder<span class="token punctuation">.</span><span class="token function">getInt32</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Pass Ten to the call to Add1F</span>
  CallInst <span class="token operator">*</span>Add1CallRes <span class="token operator">=</span> builder<span class="token punctuation">.</span><span class="token function">CreateCall</span><span class="token punctuation">(</span>Add1F<span class="token punctuation">,</span> Ten<span class="token punctuation">)</span><span class="token punctuation">;</span>
  Add1CallRes<span class="token operator">-&gt;</span><span class="token function">setTailCall</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Create the return instruction and add it to the basic block.</span>
  builder<span class="token punctuation">.</span><span class="token function">CreateRet</span><span class="token punctuation">(</span>Add1CallRes<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Now we create the JIT.</span>
  ExecutionEngine<span class="token operator">*</span> EE <span class="token operator">=</span> <span class="token function">EngineBuilder</span><span class="token punctuation">(</span>std<span class="token double-colon punctuation">::</span><span class="token function">move</span><span class="token punctuation">(</span>Owner<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">outs</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">&quot;We just constructed this LLVM module:\\n\\n&quot;</span> <span class="token operator">&lt;&lt;</span> <span class="token operator">*</span>M<span class="token punctuation">;</span>
  <span class="token function">outs</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">&quot;\\n\\nRunning foo: &quot;</span><span class="token punctuation">;</span>
  <span class="token function">outs</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">flush</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Call the \`foo&#39; function with no arguments:</span>
  std<span class="token double-colon punctuation">::</span>vector<span class="token operator">&lt;</span>GenericValue<span class="token operator">&gt;</span> noargs<span class="token punctuation">;</span>
  GenericValue gv <span class="token operator">=</span> EE<span class="token operator">-&gt;</span><span class="token function">runFunction</span><span class="token punctuation">(</span>FooF<span class="token punctuation">,</span> noargs<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Import result of execution:</span>
  <span class="token function">outs</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token string">&quot;Result: &quot;</span> <span class="token operator">&lt;&lt;</span> gv<span class="token punctuation">.</span>IntVal <span class="token operator">&lt;&lt;</span> <span class="token string">&quot;\\n&quot;</span><span class="token punctuation">;</span>
  <span class="token keyword">delete</span> EE<span class="token punctuation">;</span>
  <span class="token function">llvm_shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,31),o=[p];function c(i,l){return s(),a("div",null,o)}const d=n(t,[["render",c],["__file","编译器架构的王者LLVM——（2）开发LLVM项目.html.vue"]]);export{d as default};
