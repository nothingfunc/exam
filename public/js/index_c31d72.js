webpackJsonp([1],{0:function(e,t,n){"use strict";var r=n(58),s=n(147);r(s)},58:function(e,t,n){"use strict";e.exports=function(e){var t=n(63),r={viewResolver:function(){return e}};document.addEventListener("DOMContentLoaded",function(){t.boot(r,function(e,t){console.log(e,"ReactEngineClient boot successfully!")})})}},59:function(e,t,n){"use strict";var r=n(5),s=r.createClass({displayName:"DefaultLayout",render:function(){var e=n(89),t=this.props.ASSETS;return r.createElement("html",null,r.createElement("head",null,r.createElement("meta",{charSet:"utf-8"}),r.createElement("title",null,"sss"),r.createElement("link",{rel:"shortcut icon",href:e,type:"image/x-icon"}),this.props.css&&this.props.css.map(function(e,n){return r.createElement("link",{key:n,rel:"stylesheet",href:t.styles[e]})})),r.createElement("body",null,this.props.children,this.props.js&&this.props.js.map(function(e,n){return r.createElement("script",{key:n,src:t.javascript[e]})})))}});e.exports=s},89:function(e,t,n){e.exports=n.p+"img/favicon_3a68f9.png"},146:function(e,t,n){"use strict";var r=n(5);"undefined"!=typeof window;var s=r.createClass({displayName:"XX",render:function(){return r.createElement("ul",{className:"list abc"},r.createElement("li",null,r.createElement("i",{className:"icon icon-qqicon"})," Hello"),r.createElement("li",null,"World"))}});e.exports=s},147:function(e,t,n){"use strict";var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e};"undefined"!=typeof window&&n(151);var s=n(5),o=n(59),c=n(146),i=s.createClass({displayName:"Index",handleClickImg:function(){console.log(Date.now())},componentDidMount:function(){},render:function(){var e=n(292);return s.createElement(o,r({},this.props,{css:["common","components","index"],js:["boot","index"]}),s.createElement("div",{className:"hello"},"Hello ",this.props.name),s.createElement("img",{src:e,onClick:this.handleClickImg}),this.props.list.map(function(e,t){return s.createElement("i",{key:t},e," ")}),s.createElement(c,null),"sssss")}});e.exports=i},151:function(e,t){},292:function(e,t,n){e.exports=n.p+"img/favicon_5_3a68f9.png"}});