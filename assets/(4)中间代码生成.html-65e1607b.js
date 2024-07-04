import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{o as a,c as r,f as t}from"./app-7fdc7960.js";const n={},i=t('<h1 id="中间代码生成-ir-generation" tabindex="-1"><a class="header-anchor" href="#中间代码生成-ir-generation" aria-hidden="true">#</a> 中间代码生成 (IR Generation)</h1><p>中间代码生成是编译器前端的重要阶段，表示我们已经完成了语法检查和语义检查，我们内存中已经获取到了完整的代码结构信息，接下来我们可以将代码转换为内部的标准形式，这样就可以方便我们接下来进行优化、转换，或者使用虚拟机执行等操作。</p><h2 id="三地址码" tabindex="-1"><a class="header-anchor" href="#三地址码" aria-hidden="true">#</a> 三地址码</h2><p>三地址码是一种非常简单的中间代码形式，它的每条指令最多只有三个操作数，这样的指令非常容易转换为汇编代码，也非常容易进行优化。</p><h2 id="字节码表示" tabindex="-1"><a class="header-anchor" href="#字节码表示" aria-hidden="true">#</a> 字节码表示</h2><p>字节码表示也是另一种常见的中间代码，它的特点是不使用寄存器，而是一个抽象的栈来表示计算，使用Push，Pop将变量进行移动到栈顶，计算后的结果也是处于栈顶。这种表示法的操作表示特别小，往往能做到一个Byte内表示，所以又叫字节码。典型代表如Java语言的字节码就是这种表示方法。</p>',6),o=[i];function h(_,c){return a(),r("div",null,o)}const f=e(n,[["render",h],["__file","(4)中间代码生成.html.vue"]]);export{f as default};
