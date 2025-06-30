/*
 Copyright (c) 2013 Yehuda Katz, Tom Dale, and contributors

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do
 so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
!(function () {
  let a; let b; let c; let d; !(function () { const e = {}; const f = {}; a = function (a, b, c) { e[a] = { deps: b, callback: c }; }, d = c = b = function (a) { function c(b) { if (b.charAt(0) !== '.') return b; for (var c = b.split('/'), d = a.split('/').slice(0, -1), e = 0, f = c.length; f > e; e++) { const g = c[e]; if (g === '..')d.pop(); else { if (g === '.') continue; d.push(g); } } return d.join('/'); } if (d._eak_seen = e, f[a]) return f[a]; if (f[a] = {}, !e[a]) throw new Error(`Could not find module ${a}`); for (var g, h = e[a], i = h.deps, j = h.callback, k = [], l = 0, m = i.length; m > l; l++)i[l] === 'exports' ? k.push(g = {}) : k.push(b(c(i[l]))); const n = j.apply(this, k); return f[a] = g || n; }; }()), a('promise/all', ['./utils', 'exports'], (a, b) => {
    function c(a) { const b = this; if (!d(a)) throw new TypeError('You must pass an array to all.'); return new b((b, c) => { function d(a) { return function (b) { f(a, b); }; } function f(a, c) { h[a] = c, --i === 0 && b(h); } let g; var h = []; var i = a.length; i === 0 && b([]); for (let j = 0; j < a.length; j++)g = a[j], g && e(g.then) ? g.then(d(j), c) : f(j, g); }); } var d = a.isArray; var e = a.isFunction; b.all = c;
  }), a('promise/asap', ['exports'], function (a) {
    function b() { return function () { process.nextTick(e); }; } function c() { let a = 0; const b = new i(e); const c = document.createTextNode(''); return b.observe(c, { characterData: !0 }), function () { c.data = a = ++a % 2; }; } function d() { return function () { j.setTimeout(e, 1); }; } function e() { for (let a = 0; a < k.length; a++) { const b = k[a]; const c = b[0]; const d = b[1]; c(d); }k = []; } function f(a, b) { const c = k.push([a, b]); c === 1 && g(); } let g; const h = typeof window !== 'undefined' ? window : {}; var i = h.MutationObserver || h.WebKitMutationObserver; var j = typeof global !== 'undefined' ? global : this; var k = []; g = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]' ? b() : i ? c() : d(), a.asap = f;
  }), a('promise/cast', ['exports'], (a) => {
    function b(a) { if (a && typeof a === 'object' && a.constructor === this) return a; const b = this; return new b((b) => { b(a); }); }a.cast = b;
  }), a('promise/config', ['exports'], (a) => {
    function b(a, b) { return arguments.length !== 2 ? c[a] : (c[a] = b, void 0); } var c = { instrument: !1 }; a.config = c, a.configure = b;
  }), a('promise/polyfill', ['./promise', './utils', 'exports'], (a, b, c) => {
    function d() { const a = 'Promise' in window && 'cast' in window.Promise && 'resolve' in window.Promise && 'reject' in window.Promise && 'all' in window.Promise && 'race' in window.Promise && (function () { let a; return new window.Promise((b) => { a = b; }), f(a); }()); a || (window.Promise = e); } var e = a.Promise; var f = b.isFunction; c.polyfill = d;
  }), a('promise/promise', ['./config', './utils', './cast', './all', './race', './resolve', './reject', './asap', 'exports'], (a, b, c, d, e, f, g, h, i) => {
    function j(a) { if (!w(a)) throw new TypeError('You must pass a resolver function as the first argument to the promise constructor'); if (!(this instanceof j)) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."); this._subscribers = [], k(a, this); } function k(a, b) { function c(a) { p(b, a); } function d(a) { r(b, a); } try { a(c, d); } catch (e) { d(e); } } function l(a, b, c, d) { let e; let f; let g; let h; const i = w(c); if (i) try { e = c(d), g = !0; } catch (j) { h = !0, f = j; } else e = d, g = !0; o(b, e) || (i && g ? p(b, e) : h ? r(b, f) : a === F ? p(b, e) : a === G && r(b, e)); } function m(a, b, c, d) { const e = a._subscribers; const f = e.length; e[f] = b, e[f + F] = c, e[f + G] = d; } function n(a, b) { for (var c, d, e = a._subscribers, f = a._detail, g = 0; g < e.length; g += 3)c = e[g], d = e[g + b], l(b, c, d, f); a._subscribers = null; } function o(a, b) { let c; let d = null; try { if (a === b) throw new TypeError('A promises callback cannot return that same promise.'); if (v(b) && (d = b.then, w(d))) return d.call(b, (d) => (c ? !0 : (c = !0, b !== d ? p(a, d) : q(a, d), void 0)), (b) => (c ? !0 : (c = !0, r(a, b), void 0))), !0; } catch (e) { return c ? !0 : (r(a, e), !0); } return !1; } function p(a, b) { a === b ? q(a, b) : o(a, b) || q(a, b); } function q(a, b) { a._state === D && (a._state = E, a._detail = b, u.async(s, a)); } function r(a, b) { a._state === D && (a._state = E, a._detail = b, u.async(t, a)); } function s(a) { n(a, a._state = F); } function t(a) { n(a, a._state = G); } var u = a.config; var v = (a.configure, b.objectOrFunction); var w = b.isFunction; const x = (b.now, c.cast); const y = d.all; const z = e.race; const A = f.resolve; const B = g.reject; const C = h.asap; u.async = C; var D = void 0; var E = 0; var F = 1; var G = 2; j.prototype = {
      constructor: j, _state: void 0, _detail: void 0, _subscribers: void 0, then(a, b) { const c = this; const d = new this.constructor(() => {}); if (this._state) { const e = arguments; u.async(() => { l(c._state, d, e[c._state - 1], c._detail); }); } else m(this, d, a, b); return d; }, catch(a) { return this.then(null, a); },
    }, j.all = y, j.cast = x, j.race = z, j.resolve = A, j.reject = B, i.Promise = j;
  }), a('promise/race', ['./utils', 'exports'], (a, b) => {
    function c(a) { const b = this; if (!d(a)) throw new TypeError('You must pass an array to race.'); return new b((b, c) => { for (var d, e = 0; e < a.length; e++)d = a[e], d && typeof d.then === 'function' ? d.then(b, c) : b(d); }); } var d = a.isArray; b.race = c;
  }), a('promise/reject', ['exports'], (a) => {
    function b(a) { const b = this; return new b((b, c) => { c(a); }); }a.reject = b;
  }), a('promise/resolve', ['exports'], (a) => {
    function b(a) { const b = this; return new b((b) => { b(a); }); }a.resolve = b;
  }), a('promise/utils', ['exports'], (a) => {
    function b(a) { return c(a) || typeof a === 'object' && a !== null; } function c(a) { return typeof a === 'function'; } function d(a) { return Object.prototype.toString.call(a) === '[object Array]'; } const e = Date.now || function () { return (new Date()).getTime(); }; a.objectOrFunction = b, a.isFunction = c, a.isArray = d, a.now = e;
  }), b('promise/polyfill').polyfill();
}());
