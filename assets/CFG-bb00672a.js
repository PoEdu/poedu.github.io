import{g as F}from"./index-e7011871.js";import"./index-cdd54719.js";import{_ as G}from"./plugin-vue_export-helper-c27b6911.js";import{i as C,j,r as z,o as T,c as x,d as b,a as N,F as E}from"./app-7fdc7960.js";import"./transform-9d025c96.js";import"./selectAll-21777112.js";import"./defaultLocale-1b949c49.js";import"./path-8d162d8b.js";import"./commonjsHelpers-725317a4.js";const O={__name:"CFG",setup(B){const g=C(null);var f=null;const m=C([]),h=C([]);j(()=>{f=w(_),D(f)});const _={node1:{pred:[],succ:["node4","node2"],data:"instruction 1"},node2:{pred:["node1","node3"],succ:["node3"],data:"instruction 2"},node3:{pred:["node2"],succ:["node2"],data:"instruction 3"},node4:{pred:["node1"],succ:[],data:"instruction 4"}},D=t=>{const o=g.value;for(;o.firstChild;)o.removeChild(o.firstChild);F(o).dot(t).render()};function w(t){let o=`digraph G {
`;const e=new Set,r=i=>{e.add(i);const p=t[i],u=p.data.replace(/"/g,'\\"');o+=`  ${i} [label="${u}"];
`;const v=p.succ;for(const a of v)e.has(a)?o+=`  ${a}:ne -> ${i}:se [dir=back]`:o+=`  ${i} -> ${a}`,o+=`;
`,e.has(a)||r(a)},n=Object.keys(t)[0];return r(n),o+="}",o}function k(t){const o=Object.keys(t),e=Object.keys(t)[0],r={id:e,children:[]},n={},i=[];for(const s of o)n[s]=new Set(o);n[e]=new Set([e]),i.push({...n});function p(s,c){return new Set([...s].filter(d=>c.has(d)))}const u=()=>{let s=!1;for(const c of o)if(c!==e){const d=t[c].pred;let l=new Set(o);for(const S of d)n[S]&&(l=p(l,n[S]));l.add(c),v(l,n[c])||(n[c]=l,s=!0)}return s&&(console.log(n),i.push({...n})),s},v=(s,c)=>{if(s.size!==c.size)return!1;for(const d of s)if(!c.has(d))return!1;return!0},a=(s,c)=>{const d={id:s,children:[]};c.children.push(d);for(const l of t[s].succ)n[l].has(s)&&a(l,d)};for(;u(););return a(e,r),{domTree:r,steps:i}}const $=()=>{const{domTree:t,steps:o}=k(_);for(const r in _)h.value.push(r);console.log(h.value);for(const r of o)m.value.push(r);console.log(m.value);const e=y(f,t);D(e)},y=(t,o)=>{const e=t.trim().split(`
`);e.pop();let r=e.join(`
`);const n=(i,p)=>{for(const u of i.children)r+=`
  ${p} -> ${u.id} [color="red"];`,n(u,u.id)};return n(o,o.id),r+=`
}`,r};return(t,o)=>{const e=z("DominatorTable");return T(),x(E,null,[b("div",{ref_key:"graphContainer",ref:g},null,512),b("button",{onClick:$},"显示支配树"),N(e,{dominatorSteps:m.value,nodes:h.value},null,8,["dominatorSteps","nodes"])],64)}}},P=G(O,[["__file","CFG.vue"]]);export{P as default};
