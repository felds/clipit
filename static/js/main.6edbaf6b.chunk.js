(this.webpackJsonpclipit=this.webpackJsonpclipit||[]).push([[0],{168:function(e,t,n){},169:function(e,t,n){"use strict";n.r(t);var r=n(1),c=n(0),a=n.n(c),i=n(20),o=n.n(i),u=n(3);var s=n(180),j=n(17),d=n(5),f=n(10),l=n(8),b=n.n(l),O=n(29),p=n(4),h=Object(p.pipe)(Object(p.map)((function(e){return e*e})),p.mean,Math.sqrt),m=function(e){return function(t){return Object(p.pipe)(Object(p.chunk)(Math.ceil(t.length/e)),Object(p.map)(h))(t)}},v=function(e){return new Promise((function(t,n){var r=new FileReader;r.readAsArrayBuffer(e),r.onload=function(e){return t(r.result)},r.onerror=function(e){return n(new Error("Couldn't read file."))}}))},x=function(){var e=Object(O.a)(b.a.mark((function e(t){var n,r,c,a,i;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=[],r=window.webkitAudioContext?new window.webkitAudioContext:new AudioContext,e.next=4,v(t);case 4:return c=e.sent,e.next=7,r.decodeAudioData(c);case 7:for(a=e.sent,i=0;i<a.numberOfChannels;i++)n.push(Array.from(a.getChannelData(i)));return e.abrupt("return",n);case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),g=p.pipe(p.unzip,p.map(p.min),p.map(p.toNumber)),w=function(){var e=Object(O.a)(b.a.mark((function e(t,n){var r,c;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,x(t);case 2:return r=e.sent,c=r.map(m(n)),e.abrupt("return",1===c.length?c:[].concat(Object(f.a)(c),[g(c)]));case 5:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),C=1200,y=0,E=0,k=C-E-0,N=120-y-0,L=Object(d.d)().domain([0,239]).range([0,k]),R=Object(d.d)().domain([0,10]).range([N,0]),S=Object(d.a)().x((function(e,t){return L(t)})).y0(N).y1((function(e){return R(e)})).curve(d.b);function A(e){var t=e.file,n=e.currentTime,a=e.duration,i=e.trim,o=Object(c.useState)([]),s=Object(u.a)(o,2),j=s[0],f=s[1],l=Object(c.useRef)(null);Object(c.useEffect)((function(){var e=Object(d.c)(j.flat(2));R.domain(e),Object(d.e)(l.current).selectAll("path").data(j).join("path").transition().attr("d",S)}),[j]),Object(c.useEffect)((function(){w(t,240).then(f)}),[t]);var b=Object(c.useRef)(null),O=Object(d.d)().domain([0,a]).range([1,k-1]);Object(c.useEffect)((function(){Object(d.e)(b.current).datum(n).attr("x1",O).attr("x2",O).attr("y1",0).attr("y2",N)}),[n,a,O]);var p=Object(c.useRef)(null),h=Object(c.useRef)(null);return Object(c.useEffect)((function(){var e=Object(d.d)([0,a],[0,k]),t=Object(u.a)(i,2),n=t[0],r=t[1],c=p.current,o=h.current;Object(d.e)(c).datum(n).attr("width",(function(t){return e(t)})),Object(d.e)(o).datum(r).attr("x",(function(t){return e(t)})).attr("width",(function(t){return e(a-t)}))}),[i,a]),Object(r.jsxs)("svg",{width:C,height:120,viewBox:"0 0 ".concat(C," ").concat(120),className:"curve",children:[Object(r.jsxs)("defs",{children:[Object(r.jsxs)("g",{id:"filterMask",children:[Object(r.jsx)("rect",{x:"0",y:"0",width:"0",height:"500",ref:p}),Object(r.jsx)("rect",{x:"1200",y:"0",width:"500",height:"500",ref:h})]}),Object(r.jsxs)("filter",{id:"filter",colorInterpolationFilters:"linearRGB",children:[Object(r.jsx)("feImage",{id:"feimage",href:"#filterMask",x:"0",y:"0",result:"mask"}),Object(r.jsx)("feFlood",{floodColor:"#ffffff",floodOpacity:"1",x:"0%",y:"0%",width:"100%",height:"100%",result:"flood"}),Object(r.jsx)("feBlend",{mode:"color",x:"0%",y:"0%",width:"100%",height:"100%",in:"flood",in2:"SourceGraphic",result:"blend"}),Object(r.jsx)("feFlood",{floodColor:"#ffffff",floodOpacity:"0.666",x:"0%",y:"0%",width:"100%",height:"100%",result:"flood1"}),Object(r.jsx)("feBlend",{mode:"screen",x:"0%",y:"0%",width:"100%",height:"100%",in:"blend",in2:"flood1",result:"blend1"}),Object(r.jsx)("feComposite",{in2:"mask",in:"blend1",operator:"in",result:"comp"}),Object(r.jsxs)("feMerge",{result:"merge",children:[Object(r.jsx)("feMergeNode",{in:"SourceGraphic"}),Object(r.jsx)("feMergeNode",{in:"comp"})]})]})]}),Object(r.jsxs)("g",{transform:"translate(".concat(E,", ").concat(y,")"),children:[Object(r.jsx)("g",{ref:l,className:"curve__paths",filter:"url(#filter)",children:Object(r.jsx)("rect",{x:"0",y:"0",width:k,height:N,fill:"whitesmoke"})}),Object(r.jsx)("line",{ref:b,className:"curve__playhead"})]})]})}var D=n(21),_=n.n(D);function M(e){var t=e.status,n=e.onContent,c=e.offContent,a=e.onChange;return Object(r.jsx)("button",{onClick:function(){a&&a(!t)},className:_()("btn--toggle",t?"btn--on":"btn--off"),children:t?n:c})}function q(e){var t=e.file,n=Object(c.useState)(!1),a=Object(u.a)(n,2),i=a[0],o=a[1],d=Object(c.useState)(0),f=Object(u.a)(d,2),l=f[0],b=f[1],O=Object(c.useState)(0),p=Object(u.a)(O,2),h=p[0],m=p[1],v=Object(c.useState)(0),x=Object(u.a)(v,2),g=x[0],w=x[1],C=Object(c.useState)(h),y=Object(u.a)(C,2),E=y[0],k=y[1],N=Object(c.useState)(!1),L=Object(u.a)(N,2),R=L[0],S=L[1],D=function(){var e=_.current;b(e.duration),w(e.duration),m(0),e.currentTime=0},_=Object(c.useRef)(null);Object(c.useEffect)((function(){_.current.onloadedmetadata=D,_.current.onplay=function(){return o(!0)},_.current.onpause=function(){return o(!1)}}));var q=Object(c.useCallback)((function(){var e=_.current;i?e.pause():e.play()}),[i]);Object(c.useEffect)((function(){var e=_.current,t=0;return function n(){k(e.currentTime),t=requestAnimationFrame(n)}(),function(){t&&cancelAnimationFrame(t)}}),[]),Object(c.useEffect)((function(){var e=_.current;E>=g&&(e.currentTime=h,R||e.pause())}),[E,g,R,h]),Object(c.useEffect)((function(){var e=_.current;e.src=URL.createObjectURL(t);e.addEventListener("load",(function t(){URL.revokeObjectURL(e.src),e.removeEventListener("load",t)}))}),[t]),Object(c.useEffect)((function(){_.current.currentTime=h}),[h]);return Object(r.jsxs)("div",{className:"clipper",children:[Object(r.jsxs)("div",{className:"clipper__view",children:[Object(r.jsx)(A,{file:t,currentTime:E,duration:l,trim:[h,g]}),Object(r.jsx)(s.a,{value:[h,g],onChange:function(e,t){var n=t,r=Object(u.a)(n,2),c=r[0],a=r[1];m(c),w(a)},min:0,max:l,step:.001}),Object(r.jsx)("audio",{ref:_})]}),Object(r.jsxs)("div",{className:"clipper__controls",children:[Object(r.jsx)(M,{status:i,onContent:Object(r.jsx)(j.b,{}),offContent:Object(r.jsx)(j.b,{}),onChange:q})," ",Object(r.jsx)(M,{status:R,onContent:Object(r.jsx)(j.a,{}),offContent:Object(r.jsx)(j.a,{}),onChange:function(e){return S(e)}})]})]})}var B=n(9),F=n(22),P={accept:"audio/mpeg",multiple:!1};function T(e){var t=e.children,n=e.onDrop,c=e.isHidden,a=Object(F.a)(Object(B.a)(Object(B.a)({},P),{},{onDrop:n})),i=a.getRootProps,o=a.getInputProps,u=a.isDragActive,s=a.isDragReject;return Object(r.jsxs)("div",Object(B.a)(Object(B.a)({className:_()("drop-area",u&&"drop-area--active",s&&"drop-area--rejected",c&&"drop-area--hidden")},i()),{},{children:[Object(r.jsx)("input",Object(B.a)({},o())),t]}))}function I(e){var t=e.onDrop,n=Object(F.a)(Object(B.a)(Object(B.a)({},P),{},{noClick:!0,onDrop:t}));return Object(r.jsxs)("div",{children:[Object(r.jsx)("button",{onClick:n.open,children:"Selecione um arquivo"}),Object(r.jsx)("input",Object(B.a)({},n.getInputProps()))]})}function U(){var e=Object(c.useState)(null),t=Object(u.a)(e,2),n=t[0],a=t[1],i=function(){var e=Object(c.useState)(!1),t=Object(u.a)(e,2),n=t[0],r=t[1];return Object(c.useEffect)((function(){var e=0;function t(e){e.preventDefault()}function n(t){e++,i()}function c(t){e--,i()}function a(t){e=0,i()}function i(){r(e>0)}return window.addEventListener("dragover",t),window.addEventListener("dragenter",n),window.addEventListener("dragleave",c),window.addEventListener("drop",a),function(){window.removeEventListener("dragover",t),window.removeEventListener("dragenter",n),window.removeEventListener("dragleave",c),window.removeEventListener("drop",a)}}),[]),n}(),o=Object(c.useCallback)((function(e){e.length<1||a(e[0])}),[]);return Object(r.jsxs)("div",{className:"app",children:[Object(r.jsx)("div",{className:"layout",children:Object(r.jsxs)("main",{className:"layout__content",children:[Object(r.jsx)("h1",{children:"Clipit"}),!n&&Object(r.jsxs)("div",{className:"begin text--center",children:[Object(r.jsx)("p",{children:"Para come\xe7ar, selecione um arquivo MP3 no seu computador. Voc\xea tamb\xe9m pode arrastar e soltar o arquivo em qualquer lugar da p\xe1gina."}),Object(r.jsx)(I,{onDrop:o}),Object(r.jsx)("p",{})]}),n&&Object(r.jsx)(q,{file:n})]})}),Object(r.jsx)(T,{isHidden:!i,onDrop:o,children:"\ud83d\udd25 drop it like it's hot \ud83d\udd25"})]})}n(168);o.a.render(Object(r.jsx)(a.a.StrictMode,{children:Object(r.jsx)(U,{})}),document.getElementById("root"))}},[[169,1,2]]]);
//# sourceMappingURL=main.6edbaf6b.chunk.js.map