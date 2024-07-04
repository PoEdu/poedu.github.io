import{_ as O}from"./plugin-vue_export-helper-c27b6911.js";import{E as H}from"./index-7633a99c.js";import{o as P,c as T,a as W,w as q,e as z,u as I,F as J,d as B}from"./app-7fdc7960.js";import"./use-form-item-62b2a36d.js";import"./baseSet-d888215f.js";import"./isArray-ba7284aa.js";const Q=B("p",null,"Graph Editor",-1),R=B("svg",{id:"container",width:"600",height:"400"},null,-1),U={__name:"Graph",setup(Z){function M(x,h){var s=document.createElement("script"),l=document.getElementsByTagName("head")[0];s.type="text/javascript",s.src=x,s.addEventListener?s.addEventListener("load",function(){h()},!1):s.attachEvent&&s.attachEvent("onreadystatechange",function(){var o=window.event.srcElement;o.readyState=="loaded"&&h()}),l.appendChild(s)}return M("https://d3js.org/d3.v3.min.js",function(){var x=600,h=400,s=d3.scale.category10(),l=d3.select("#container"),o=[{id:0,reflexive:!1},{id:1,reflexive:!0},{id:2,reflexive:!1}],C=2,c=[{source:o[0],target:o[1],left:!1,right:!0},{source:o[1],target:o[2],left:!1,right:!0}],E=d3.layout.force().nodes(o).links(c).size([x,h]).linkDistance(150).charge(-500).on("tick",N);l.append("svg:defs").append("svg:marker").attr("id","end-arrow").attr("viewBox","0 -5 10 10").attr("refX",6).attr("markerWidth",3).attr("markerHeight",3).attr("orient","auto").append("svg:path").attr("d","M0,-5L10,0L0,5").attr("fill","#000"),l.append("svg:defs").append("svg:marker").attr("id","start-arrow").attr("viewBox","0 -5 10 10").attr("refX",4).attr("markerWidth",3).attr("markerHeight",3).attr("orient","auto").append("svg:path").attr("d","M10,-5L0,0L10,5").attr("fill","#000");var _=l.append("svg:path").attr("class","link dragline hidden").attr("d","M0,0L0,0"),v=l.append("svg:g").selectAll("path"),f=l.append("svg:g").selectAll("g"),a=null,n=null,y=null,t=null,m=null;function L(){t=null,m=null,y=null}function N(){v.attr("d",function(r){var e=r.target.x-r.source.x,i=r.target.y-r.source.y,p=Math.sqrt(e*e+i*i),g=e/p,d=i/p,k=r.left?17:12,b=r.right?17:12,j=r.source.x+k*g,A=r.source.y+k*d,D=r.target.x-b*g,F=r.target.y-b*d;return"M"+j+","+A+"L"+D+","+F}),f.attr("transform",function(r){return"translate("+r.x+","+r.y+")"})}function u(){v=v.data(c),v.classed("selected",function(e){return e===n}).style("marker-start",function(e){return e.left?"url(#start-arrow)":""}).style("marker-end",function(e){return e.right?"url(#end-arrow)":""}),v.enter().append("svg:path").attr("class","link").classed("selected",function(e){return e===n}).style("marker-start",function(e){return e.left?"url(#start-arrow)":""}).style("marker-end",function(e){return e.right?"url(#end-arrow)":""}).on("mousedown",function(e){d3.event.ctrlKey||(y=e,y===n?n=null:n=y,a=null,u())}),v.exit().remove(),f=f.data(o,function(e){return e.id}),f.selectAll("circle").style("fill",function(e){return e===a?d3.rgb(s(e.id)).brighter().toString():s(e.id)}).classed("reflexive",function(e){return e.reflexive});var r=f.enter().append("svg:g");r.append("svg:circle").attr("class","node").attr("r",12).style("fill",function(e){return e===a?d3.rgb(s(e.id)).brighter().toString():s(e.id)}).style("stroke",function(e){return d3.rgb(s(e.id)).darker().toString()}).classed("reflexive",function(e){return e.reflexive}).on("mouseover",function(e){!t||e===t||d3.select(this).attr("transform","scale(1.1)")}).on("mouseout",function(e){!t||e===t||d3.select(this).attr("transform","")}).on("mousedown",function(e){d3.event.ctrlKey||(t=e,t===a?a=null:a=t,n=null,_.style("marker-end","url(#end-arrow)").classed("hidden",!1).attr("d","M"+t.x+","+t.y+"L"+t.x+","+t.y),u())}).on("mouseup",function(e){if(t){if(_.classed("hidden",!0).style("marker-end",""),m=e,m===t){L();return}d3.select(this).attr("transform","");var i,p,g;t.id<m.id?(i=t,p=m,g="right"):(i=m,p=t,g="left");var d;d=c.filter(function(k){return k.source===i&&k.target===p})[0],d?d[g]=!0:(d={source:i,target:p,left:!1,right:!1},d[g]=!0,c.push(d)),n=d,a=null,u()}}),r.append("svg:text").attr("x",0).attr("y",4).attr("class","id").text(function(e){return e.id}),f.exit().remove(),E.start()}function S(){if(l.classed("active",!0),!(d3.event.ctrlKey||t||y)){var r=d3.mouse(this),e={id:++C,reflexive:!1};e.x=r[0],e.y=r[1],o.push(e),u()}}function X(){t&&(_.attr("d","M"+t.x+","+t.y+"L"+d3.mouse(this)[0]+","+d3.mouse(this)[1]),u())}function G(){t&&_.classed("hidden",!0).style("marker-end",""),l.classed("active",!1),L()}function K(r){var e=c.filter(function(i){return i.source===r||i.target===r});e.map(function(i){c.splice(c.indexOf(i),1)})}var w=-1;function V(){if(d3.event.preventDefault(),w===-1&&(w=d3.event.keyCode,d3.event.keyCode===17&&(f.call(E.drag),l.classed("ctrl",!0)),!(!a&&!n)))switch(d3.event.keyCode){case 8:case 46:a?(o.splice(o.indexOf(a),1),K(a)):n&&c.splice(c.indexOf(n),1),n=null,a=null,u();break;case 66:n&&(n.left=!0,n.right=!0),u();break;case 76:n&&(n.left=!0,n.right=!1),u();break;case 82:a?a.reflexive=!a.reflexive:n&&(n.left=!1,n.right=!0),u();break}}function Y(){w=-1,d3.event.keyCode===17&&(f.on("mousedown.drag",null).on("touchstart.drag",null),l.classed("ctrl",!1))}l.on("mousedown",S).on("mousemove",X).on("mouseup",G),d3.select(window).on("keydown",V).on("keyup",Y),u()}),(x,h)=>(P(),T(J,null,[Q,R,W(I(H),null,{default:q(()=>[z("Button")]),_:1})],64))}},se=O(U,[["__file","Graph.vue"]]);export{se as default};
