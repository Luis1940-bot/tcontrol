const XHR = require('./xhr');
const { decode64 } = require('./utils');

function SVGContainer(src) {
  this.src = src;
  this.image = null;
  const self = this;

  this.promise = this.hasFabric()
    .then(() =>
      self.isInline(src)
        ? Promise.resolve(self.inlineFormatting(src))
        : XHR(src),
    )
    .then(
      (svg) =>
        new Promise((resolve) => {
          window.html2canvas.svg.fabric.loadSVGFromString(
            svg,
            self.createCanvas.call(self, resolve),
          );
        }),
    );
}

SVGContainer.prototype.hasFabric = function () {
  return !window.html2canvas.svg || !window.html2canvas.svg.fabric
    ? Promise.reject(
        new Error('html2canvas.svg.js is not loaded, cannot render svg'),
      )
    : Promise.resolve();
};

SVGContainer.prototype.inlineFormatting = function (src) {
  return /^data:image\/svg\+xml;base64,/.test(src)
    ? this.decode64(this.removeContentType(src))
    : this.removeContentType(src);
};

SVGContainer.prototype.removeContentType = function (src) {
  return src.replace(/^data:image\/svg\+xml(;base64)?,/, '');
};

SVGContainer.prototype.isInline = function (src) {
  return /^data:image\/svg\+xml/i.test(src);
};

SVGContainer.prototype.createCanvas = function (resolve) {
  const self = this;
  return function (objects, options) {
    const canvas = new window.html2canvas.svg.fabric.StaticCanvas('c');
    self.image = canvas.lowerCanvasEl;
    canvas
      .setWidth(options.width)
      .setHeight(options.height)
      .add(
        window.html2canvas.svg.fabric.util.groupSVGElements(objects, options),
      )
      .renderAll();
    resolve(canvas.lowerCanvasEl);
  };
};

SVGContainer.prototype.decode64 = function (str) {
  return typeof window.atob === 'function' ? window.atob(str) : decode64(str);
};

module.exports = SVGContainer;
