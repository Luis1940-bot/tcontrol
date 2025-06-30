const Support = require('./support');
const CanvasRenderer = require('./renderers/canvas');
const ImageLoader = require('./imageloader');
const NodeParser = require('./nodeparser');
const NodeContainer = require('./nodecontainer');
const log = require('./log');
const utils = require('./utils');
const createWindowClone = require('./clone');
const { loadUrlDocument } = require('./proxy');

const { getBounds } = utils;

const html2canvasNodeAttribute = 'data-html2canvas-node';
let html2canvasCloneIndex = 0;

function html2canvas(nodeList, options) {
  const index = html2canvasCloneIndex++;
  options = options || {};
  if (options.logging) {
    log.options.logging = true;
    log.options.start = Date.now();
  }

  options.async = typeof (options.async) === 'undefined' ? true : options.async;
  options.allowTaint = typeof (options.allowTaint) === 'undefined' ? false : options.allowTaint;
  options.removeContainer = typeof (options.removeContainer) === 'undefined' ? true : options.removeContainer;
  options.javascriptEnabled = typeof (options.javascriptEnabled) === 'undefined' ? false : options.javascriptEnabled;
  options.imageTimeout = typeof (options.imageTimeout) === 'undefined' ? 10000 : options.imageTimeout;
  options.renderer = typeof (options.renderer) === 'function' ? options.renderer : CanvasRenderer;
  options.strict = !!options.strict;

  if (typeof (nodeList) === 'string') {
    if (typeof (options.proxy) !== 'string') {
      return Promise.reject('Proxy must be used when rendering url');
    }
    const width = options.width != null ? options.width : window.innerWidth;
    const height = options.height != null ? options.height : window.innerHeight;
    return loadUrlDocument(absoluteUrl(nodeList), options.proxy, document, width, height, options).then((container) => renderWindow(container.contentWindow.document.documentElement, container, options, width, height));
  }

  const node = ((nodeList === undefined) ? [document.documentElement] : ((nodeList.length) ? nodeList : [nodeList]))[0];
  node.setAttribute(html2canvasNodeAttribute + index, index);
  return renderDocument(node.ownerDocument, options, node.ownerDocument.defaultView.innerWidth, node.ownerDocument.defaultView.innerHeight, index).then((canvas) => {
    if (typeof (options.onrendered) === 'function') {
      log('options.onrendered is deprecated, html2canvas returns a Promise containing the canvas');
      options.onrendered(canvas);
    }
    return canvas;
  });
}

html2canvas.CanvasRenderer = CanvasRenderer;
html2canvas.NodeContainer = NodeContainer;
html2canvas.log = log;
html2canvas.utils = utils;

const html2canvasExport = (typeof (document) === 'undefined' || typeof (Object.create) !== 'function' || typeof (document.createElement('canvas').getContext) !== 'function') ? function () {
  return Promise.reject('No canvas support');
} : html2canvas;

module.exports = html2canvasExport;

if (typeof (define) === 'function' && define.amd) {
  define('html2canvas', [], () => html2canvasExport);
}

function renderDocument(document, options, windowWidth, windowHeight, html2canvasIndex) {
  return createWindowClone(document, document, windowWidth, windowHeight, options, document.defaultView.pageXOffset, document.defaultView.pageYOffset).then((container) => {
    log('Document cloned');
    const attributeName = html2canvasNodeAttribute + html2canvasIndex;
    const selector = `[${attributeName}='${html2canvasIndex}']`;
    document.querySelector(selector).removeAttribute(attributeName);
    const clonedWindow = container.contentWindow;
    const node = clonedWindow.document.querySelector(selector);
    const oncloneHandler = (typeof (options.onclone) === 'function') ? Promise.resolve(options.onclone(clonedWindow.document)) : Promise.resolve(true);
    return oncloneHandler.then(() => renderWindow(node, container, options, windowWidth, windowHeight));
  });
}

function renderWindow(node, container, options, windowWidth, windowHeight) {
  const clonedWindow = container.contentWindow;
  const support = new Support(clonedWindow.document);
  const imageLoader = new ImageLoader(options, support);
  const bounds = getBounds(node);
  const width = options.type === 'view' ? windowWidth : documentWidth(clonedWindow.document);
  const height = options.type === 'view' ? windowHeight : documentHeight(clonedWindow.document);
  const renderer = new options.renderer(width, height, imageLoader, options, document);
  const parser = new NodeParser(node, renderer, support, imageLoader, options);
  return parser.ready.then(() => {
    log('Finished rendering');
    let canvas;

    if (options.type === 'view') {
      canvas = crop(renderer.canvas, {
        width: renderer.canvas.width, height: renderer.canvas.height, top: 0, left: 0, x: 0, y: 0,
      });
    } else if (node === clonedWindow.document.body || node === clonedWindow.document.documentElement || options.canvas != null) {
      canvas = renderer.canvas;
    } else {
      canvas = crop(renderer.canvas, {
        width: options.width != null ? options.width : bounds.width, height: options.height != null ? options.height : bounds.height, top: bounds.top, left: bounds.left, x: 0, y: 0,
      });
    }

    cleanupContainer(container, options);
    return canvas;
  });
}

function cleanupContainer(container, options) {
  if (options.removeContainer) {
    container.parentNode.removeChild(container);
    log('Cleaned up container');
  }
}

function crop(canvas, bounds) {
  const croppedCanvas = document.createElement('canvas');
  const x1 = Math.min(canvas.width - 1, Math.max(0, bounds.left));
  const x2 = Math.min(canvas.width, Math.max(1, bounds.left + bounds.width));
  const y1 = Math.min(canvas.height - 1, Math.max(0, bounds.top));
  const y2 = Math.min(canvas.height, Math.max(1, bounds.top + bounds.height));
  croppedCanvas.width = bounds.width;
  croppedCanvas.height = bounds.height;
  const width = x2 - x1;
  const height = y2 - y1;
  log('Cropping canvas at:', 'left:', bounds.left, 'top:', bounds.top, 'width:', width, 'height:', height);
  log('Resulting crop with width', bounds.width, 'and height', bounds.height, 'with x', x1, 'and y', y1);
  croppedCanvas.getContext('2d').drawImage(canvas, x1, y1, width, height, bounds.x, bounds.y, width, height);
  return croppedCanvas;
}

function documentWidth(doc) {
  return Math.max(
    Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth),
    Math.max(doc.body.offsetWidth, doc.documentElement.offsetWidth),
    Math.max(doc.body.clientWidth, doc.documentElement.clientWidth),
  );
}

function documentHeight(doc) {
  return Math.max(
    Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
    Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
    Math.max(doc.body.clientHeight, doc.documentElement.clientHeight),
  );
}

function absoluteUrl(url) {
  const link = document.createElement('a');
  link.href = url;
  link.href = link.href;
  return link;
}
