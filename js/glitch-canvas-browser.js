!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t=t||self,t.glitch=e())}(this,function(){"use strict";function t(t,e,a){return t<e?e:t>a?a:t}function e(t){var e=!1;if(void 0!==t)try{e=JSON.parse(JSON.stringify(t))}catch(t){}return e}function a(a){return"object"!=typeof(a=e(a))&&(a={}),Object.keys(f).filter(function(t){return"iterations"!==t}).forEach(function(e){"number"!=typeof a[e]||isNaN(a[e])?a[e]=f[e]:a[e]=t(a[e],0,100),a[e]=Math.round(a[e])}),("number"!=typeof a.iterations||isNaN(a.iterations)||a.iterations<=0)&&(a.iterations=f.iterations),a.iterations=Math.round(a.iterations),a}function n(t){if(t instanceof HTMLImageElement){if(!t.naturalWidth||!t.naturalHeight||!1===t.complete)throw new Error("This this image hasn't finished loading: "+t.src);var e=new g(t.naturalWidth,t.naturalHeight),a=e.getContext("2d");a.drawImage(t,0,0,e.width,e.height);var n=a.getImageData(0,0,e.width,e.height);return n.data&&n.data.length&&(void 0===n.width&&(n.width=t.naturalWidth),void 0===n.height&&(n.height=t.naturalHeight)),n}throw new Error("This object does not seem to be an image.")}function i(t){return new Promise(function(e,a){var n=new p;n.onload=function(){e(n)},n.onerror=a;try{n.src=t}catch(t){a(t)}})}function r(t,e,a,n){i(t).then(a,n)}function s(t){return{width:t.width||t.naturalWidth,height:t.height||t.naturalHeight}}function o(t){var e=s(t),a=new g(e.width,e.height),n=a.getContext("2d");return n.drawImage(t,0,0,e.width,e.height),{canvas:a,ctx:n}}function h(t,e,a,n){i(t).then(function(t){var e=s(t),n=o(t).ctx.getImageData(0,0,e.width,e.height);n.width||(n.width=e.width),n.height||(n.height=e.height),a(n)},n)}function u(t){return t&&"number"==typeof t.width&&"number"==typeof t.height&&t.data&&"number"==typeof t.data.length&&"object"==typeof t.data}function c(t,e){return new Promise(function(a,n){if(u(t)){var i=new g(t.width,t.height);i.getContext("2d").putImageData(t,0,0),a(i.toDataURL("image/jpeg",e/100))}else n(new Error("object is not valid imageData"))})}var f={amount:35,iterations:20,quality:30,seed:25},g=function(t,e){void 0===t&&(t=300),void 0===e&&(e=150),"undefined"==typeof window?(this.canvasEl={width:t,height:e},this.ctx=null):(this.canvasEl=document.createElement("canvas"),this.canvasEl.width=t,this.canvasEl.height=e,this.ctx=this.canvasEl.getContext("2d"))},d={width:{configurable:!0},height:{configurable:!0}};g.prototype.getContext=function(){return this.ctx},g.prototype.toDataURL=function(t,e,a){if("function"!=typeof a)return this.canvasEl.toDataURL(t,e);a(this.canvasEl.toDataURL(t,e))},d.width.get=function(){return this.canvasEl.width},d.width.set=function(t){this.canvasEl.width=t},d.height.get=function(){return this.canvasEl.height},d.height.set=function(t){this.canvasEl.height=t},Object.defineProperties(g.prototype,d),"undefined"!=typeof window&&(g.Image=Image);var p=g.Image,m=Object.assign;return function(t){function e(){var t=m({},v);return l||m(t,y),t}function i(){var t=m({},v);return b||m(t,D),t}function s(t){return t}function o(t,e,a){return l=function(){return new Promise(function(n,i){if(a)t(e,n,i);else if(t===s)n(e);else try{n(t(e,n,i))}catch(t){i(t)}})},f()?g():i()}function u(t,a,n){return b=function(e){return new Promise(function(i,r){n?t(e,a,i,r):t===s?i(e):t(e,a).then(i,r)})},f()?g():e()}function f(){return l&&b}function g(){return new Promise(function(e,a){l().then(function(e){return d(e,t)},a).then(function(t){b(t).then(e,a)},a)})}function d(t,e){return new Promise(function(a,n){c(t,e.quality).then(function(a){return p(t,a,e)},n).then(a,n)})}function p(t,e,a){return new Promise(function(n,i){w.addEventListener("message",function(t){t.data&&t.data.base64URL?n(t.data.base64URL):i(t.data&&t.data.err?t.data.err:t)}),w.postMessage({params:a,base64URL:e,imageData:t,imageDataWidth:t.width,imageDataHeight:t.height})})}t=a(t);var l,b,w=new Worker(URL.createObjectURL(new Blob(['function isImageData(a){return a&&"number"==typeof a.width&&"number"==typeof a.height&&a.data&&"number"==typeof a.data.length&&"object"==typeof a.data}function base64ToByteArray(a){for(var e,s=[],t=a.replace("data:image/jpeg;base64,",""),r=0,i=t.length;r<i;r++){t[r];var p=reversedBase64Map$1[t[r]];switch(r%4){case 1:s.push(e<<2|p>>4);break;case 2:s.push((15&e)<<4|p>>2);break;case 3:s.push((3&e)<<6|p)}e=p}return s}function jpgHeaderLength(a){for(var e=417,s=0,t=a.length;s<t;s++)if(255===a[s]&&218===a[s+1]){e=s+2;break}return e}function glitchByteArray(a,e,s,t){for(var r=jpgHeaderLength(a),i=a.length-r-4,p=s/100,n=e/100,h=0;h<t;h++){var g=i/t*h|0,o=g+((i/t*(h+1)|0)-g)*n|0;o>i&&(o=i),a[~~(r+o)]=~~(256*p)}return a}function byteArrayToBase64(a){for(var e,s,t=["data:image/jpeg;base64,"],r=0,i=a.length;r<i;r++){var p=a[r];switch(e=r%3){case 0:t.push(base64Map$1[p>>2]);break;case 1:t.push(base64Map$1[(3&s)<<4|p>>4]);break;case 2:t.push(base64Map$1[(15&s)<<2|p>>6]),t.push(base64Map$1[63&p])}s=p}return 0===e?(t.push(base64Map$1[(3&s)<<4]),t.push("==")):1===e&&(t.push(base64Map$1[(15&s)<<2]),t.push("=")),t.join("")}function glitchImageData(a,e,s){if(isImageData(a))return byteArrayToBase64(glitchByteArray(base64ToByteArray(e),s.seed,s.amount,s.iterations));throw new Error("glitchImageData: imageData seems to be corrupt.")}function fail(a){self.postMessage({err:a.message||a})}function success(a){self.postMessage({base64URL:a})}var base64Chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",base64Map=base64Chars.split(""),reversedBase64Map={};base64Map.forEach(function(a,e){reversedBase64Map[a]=e});var maps={base64Map:base64Map,reversedBase64Map:reversedBase64Map},reversedBase64Map$1=maps.reversedBase64Map,base64Map$1=maps.base64Map;onmessage=function(a){var e=a.data.imageData,s=a.data.params,t=a.data.base64URL;if(e&&t&&s)try{void 0===e.width&&"number"==typeof a.data.imageDataWidth&&(e.width=a.data.imageDataWidth),void 0===e.height&&"number"==typeof a.data.imageDataHeight&&(e.height=a.data.imageDataHeight),success(glitchImageData(e,t,s))}catch(a){fail(a)}else fail(a.data.imageData?"Parameters are missing.":"ImageData is missing.");self.close()};'],{type:"text/javascript"}))),v={getParams:function(){return t},getInput:e,getOutput:i},y={fromImageData:function(t){return o(s,t)},fromImage:function(t){return o(n,t)}},D={toImage:function(t){return u(r,t,!0)},toDataURL:function(t){return u(s)},toImageData:function(t){return u(h,t,!0)}};return e()}});