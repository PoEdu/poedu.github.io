import{g as d}from"./index-e7011871.js";import{_ as p}from"./plugin-vue_export-helper-c27b6911.js";import{o as u,c as f,F as h,d as c}from"./app-7fdc7960.js";import"./transform-9d025c96.js";import"./selectAll-21777112.js";import"./defaultLocale-1b949c49.js";import"./path-8d162d8b.js";function m(o){let r=`digraph G {
`;function n(e){if(e){const i=`"${e.id}"`,s=`"${e.type}${e.value?` (${e.value})`:""}"`;if(r+=`${i} [label=${s}];
`,e.children)for(const a of e.children){const l=`"${a.id}"`;r+=`${i} -> ${l};
`,n(a)}}}return n($),r+="}",r}function _(o){const r=m(),n=d("#parse-tree");n.on("initEnd",()=>{n.width(800).height(325).fit(!0).renderDot(r)})}function t(o,r,n,e){this.id=o,this.type=r,this.value=n,this.children=e}const $=new t("A","Expression",null,[new t("B","Term",null,[new t("C","Factor","2"),new t("D","Operator","*",[]),new t("E","Factor","3")]),new t("F","Operator","+",[]),new t("G","Term",null,[new t("H","Factor","4"),new t("I","Operator","*",[]),new t("J","Factor","5")])]),w={mounted(){_()}},v=c("span",null,"ParseTree",-1),F=c("div",{id:"parse-tree"},null,-1);function T(o,r,n,e,i,s){return u(),f(h,null,[v,F],64)}const I=p(w,[["render",T],["__file","ParseTree.vue"]]);export{I as default};
