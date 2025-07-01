const utils = require('./utils');

const { getBounds } = utils;
const { loadUrlDocument } = require('./proxy');

function FrameContainer(container, sameOrigin, options) {
  this.image = null;
  this.src = container;
  const self = this;
  const bounds = getBounds(container);
  this.promise = (
    !sameOrigin
      ? this.proxyLoad(options.proxy, bounds, options)
      : new Promise((resolve) => {
          if (
            container.contentWindow.document.URL === 'about:blank' ||
            container.contentWindow.document.documentElement == null
          ) {
            container.contentWindow.onload = container.onload = function () {
              resolve(container);
            };
          } else {
            resolve(container);
          }
        })
  )
    .then((container) => {
      const html2canvas = require('./core');
      return html2canvas(container.contentWindow.document.documentElement, {
        type: 'view',
        width: container.width,
        height: container.height,
        proxy: options.proxy,
        javascriptEnabled: options.javascriptEnabled,
        removeContainer: options.removeContainer,
        allowTaint: options.allowTaint,
        imageTimeout: options.imageTimeout / 2,
      });
    })
    .then((canvas) => (self.image = canvas));
}

FrameContainer.prototype.proxyLoad = function (proxy, bounds, options) {
  const container = this.src;
  return loadUrlDocument(
    container.src,
    proxy,
    container.ownerDocument,
    bounds.width,
    bounds.height,
    options,
  );
};

module.exports = FrameContainer;
