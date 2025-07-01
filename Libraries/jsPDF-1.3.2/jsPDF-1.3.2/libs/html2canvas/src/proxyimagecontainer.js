const { ProxyURL } = require('./proxy');

function ProxyImageContainer(src, proxy) {
  const link = document.createElement('a');
  link.href = src;
  src = link.href;
  this.src = src;
  this.image = new Image();
  const self = this;
  this.promise = new Promise((resolve, reject) => {
    self.image.crossOrigin = 'Anonymous';
    self.image.onload = resolve;
    self.image.onerror = reject;

    new ProxyURL(src, proxy, document)
      .then((url) => {
        self.image.src = url;
      })
      .catch(reject);
  });
}

module.exports = ProxyImageContainer;
