import{_ as d}from"./plugin-vue_export-helper-c27b6911.js";import{o as e,c as t,d as r,F as l,C as a,D as o}from"./app-7fdc7960.js";const c=r("th",null,"步骤",-1),m={__name:"DominatorTable",props:{dominatorSteps:{type:Array,required:!0},nodes:{type:Array,required:!0}},setup(u){return(y,p)=>(e(),t("div",null,[r("table",null,[r("thead",null,[r("tr",null,[c,(e(!0),t(l,null,a(u.nodes,n=>(e(),t("th",{key:n},o(n),1))),128))])]),r("tbody",null,[(e(!0),t(l,null,a(u.dominatorSteps,(n,s)=>(e(),t("tr",{key:s},[r("td",null,o(s+1),1),(e(!0),t(l,null,a(u.nodes,i=>(e(),t("td",{key:i},[(e(!0),t(l,null,a(n[i],_=>(e(),t("span",null,o(_+" "),1))),256))]))),128))]))),128))])])]))}},D=d(m,[["__file","DominatorTable.vue"]]);export{D as default};