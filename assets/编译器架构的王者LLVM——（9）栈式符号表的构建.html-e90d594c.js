const t=JSON.parse('{"key":"v-0a67d6b1","path":"/LLVM%E6%8C%87%E5%8D%97/%E7%BC%96%E8%AF%91%E5%99%A8%E6%9E%B6%E6%9E%84%E7%9A%84%E7%8E%8B%E8%80%85LLVM%E2%80%94%E2%80%94%EF%BC%889%EF%BC%89%E6%A0%88%E5%BC%8F%E7%AC%A6%E5%8F%B7%E8%A1%A8%E7%9A%84%E6%9E%84%E5%BB%BA.html","title":"编译器架构的王者LLVM——（9）栈式符号表的构建","lang":"zh-CN","frontmatter":{"description":"编译器架构的王者LLVM——（9）栈式符号表的构栈式符号表对于一款编译器，无疑是核心的组件。 无论你在做什么符号扫描，那么都离不开符号表，如何得知一个符号是否定义，以及它的类型，那么唯有查看符号表中的记录。 栈式符号表并不复杂，但思想精妙，本文，将介绍一款栈式符号表的原理及简单构建。 源代码的例子 首先我们来看一段C代码 于是我们发现，符号表在局部声明...","head":[["meta",{"property":"og:url","content":"https://PoIndex.github.io/LLVM%E6%8C%87%E5%8D%97/%E7%BC%96%E8%AF%91%E5%99%A8%E6%9E%B6%E6%9E%84%E7%9A%84%E7%8E%8B%E8%80%85LLVM%E2%80%94%E2%80%94%EF%BC%889%EF%BC%89%E6%A0%88%E5%BC%8F%E7%AC%A6%E5%8F%B7%E8%A1%A8%E7%9A%84%E6%9E%84%E5%BB%BA.html"}],["meta",{"property":"og:site_name","content":"现代黑魔法学院"}],["meta",{"property":"og:title","content":"编译器架构的王者LLVM——（9）栈式符号表的构建"}],["meta",{"property":"og:description","content":"编译器架构的王者LLVM——（9）栈式符号表的构栈式符号表对于一款编译器，无疑是核心的组件。 无论你在做什么符号扫描，那么都离不开符号表，如何得知一个符号是否定义，以及它的类型，那么唯有查看符号表中的记录。 栈式符号表并不复杂，但思想精妙，本文，将介绍一款栈式符号表的原理及简单构建。 源代码的例子 首先我们来看一段C代码 于是我们发现，符号表在局部声明..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://PoIndex.github.io/"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-07-03T07:27:15.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"编译器架构的王者LLVM——（9）栈式符号表的构建"}],["meta",{"property":"article:author","content":"西风逍遥游"}],["meta",{"property":"article:modified_time","content":"2023-07-03T07:27:15.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"编译器架构的王者LLVM——（9）栈式符号表的构建\\",\\"image\\":[\\"https://PoIndex.github.io/\\"],\\"dateModified\\":\\"2023-07-03T07:27:15.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"西风逍遥游\\",\\"url\\":\\"https://github.com/sunxfancy\\"}]}"]]},"headers":[{"level":2,"title":"源代码的例子","slug":"源代码的例子","link":"#源代码的例子","children":[]},{"level":2,"title":"用C++的map和stack构建符号表","slug":"用c-的map和stack构建符号表","link":"#用c-的map和stack构建符号表","children":[]},{"level":2,"title":"附1：Github参考源码","slug":"附1-github参考源码","link":"#附1-github参考源码","children":[]},{"level":2,"title":"附2：Graphviz的绘图源码","slug":"附2-graphviz的绘图源码","link":"#附2-graphviz的绘图源码","children":[]}],"git":{"createdTime":1688369235000,"updatedTime":1688369235000,"contributors":[{"name":"西风逍遥游","email":"sunxfancy@gmail.com","commits":1}]},"readingTime":{"minutes":3.51,"words":1054},"filePathRelative":"LLVM指南/编译器架构的王者LLVM——（9）栈式符号表的构建.md","localizedDate":"2023年7月3日","autoDesc":true}');export{t as data};
