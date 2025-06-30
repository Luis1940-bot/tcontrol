const log = require('./log');
const { smallImage } = require('./utils');

function DummyImageContainer(src) {
  this.src = src;
  log('DummyImageContainer for', src);
  if (!this.promise || !this.image) {
    log('Initiating DummyImageContainer');
    DummyImageContainer.prototype.image = new Image();
    const { image } = this;
    DummyImageContainer.prototype.promise = new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = smallImage();
      if (image.complete === true) {
        resolve(image);
      }
    });
  }
}

module.exports = DummyImageContainer;
