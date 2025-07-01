const XHR = require('./xhr');
const utils = require('./utils');
const log = require('./log');
const createWindowClone = require('./clone');

const { decode64 } = utils;

function Proxy(src, proxyUrl, document) {
  const supportsCORS = 'withCredentials' in new XMLHttpRequest();
  if (!proxyUrl) {
    return Promise.reject('No proxy configured');
  }
  const callback = createCallback(supportsCORS);
  const url = createProxyUrl(proxyUrl, src, callback);

  return supportsCORS
    ? XHR(url)
    : jsonp(document, url, callback).then((response) =>
        decode64(response.content),
      );
}
let proxyCount = 0;

function ProxyURL(src, proxyUrl, document) {
  const supportsCORSImage = 'crossOrigin' in new Image();
  const callback = createCallback(supportsCORSImage);
  const url = createProxyUrl(proxyUrl, src, callback);
  return supportsCORSImage
    ? Promise.resolve(url)
    : jsonp(document, url, callback).then(
        (response) => `data:${response.type};base64,${response.content}`,
      );
}

function jsonp(document, url, callback) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    const cleanup = function () {
      delete window.html2canvas.proxy[callback];
      document.body.removeChild(s);
    };
    window.html2canvas.proxy[callback] = function (response) {
      cleanup();
      resolve(response);
    };
    s.src = url;
    s.onerror = function (e) {
      cleanup();
      reject(e);
    };
    document.body.appendChild(s);
  });
}

function createCallback(useCORS) {
  return !useCORS
    ? `html2canvas_${Date.now()}_${++proxyCount}_${Math.round(Math.random() * 100000)}`
    : '';
}

function createProxyUrl(proxyUrl, src, callback) {
  return `${proxyUrl}?url=${encodeURIComponent(src)}${callback.length ? `&callback=html2canvas.proxy.${callback}` : ''}`;
}

function documentFromHTML(src) {
  return function (html) {
    const parser = new DOMParser();
    let doc;
    try {
      doc = parser.parseFromString(html, 'text/html');
    } catch (e) {
      log('DOMParser not supported, falling back to createHTMLDocument');
      doc = document.implementation.createHTMLDocument('');
      try {
        doc.open();
        doc.write(html);
        doc.close();
      } catch (ee) {
        log(
          'createHTMLDocument write not supported, falling back to document.body.innerHTML',
        );
        doc.body.innerHTML = html; // ie9 doesnt support writing to documentElement
      }
    }

    const b = doc.querySelector('base');
    if (!b || !b.href.host) {
      const base = doc.createElement('base');
      base.href = src;
      doc.head.insertBefore(base, doc.head.firstChild);
    }

    return doc;
  };
}

function loadUrlDocument(src, proxy, document, width, height, options) {
  return new Proxy(src, proxy, window.document)
    .then(documentFromHTML(src))
    .then((doc) =>
      createWindowClone(doc, document, width, height, options, 0, 0),
    );
}

exports.Proxy = Proxy;
exports.ProxyURL = ProxyURL;
exports.loadUrlDocument = loadUrlDocument;
