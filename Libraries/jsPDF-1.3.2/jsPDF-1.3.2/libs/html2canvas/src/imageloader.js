const log = require('./log');
const ImageContainer = require('./imagecontainer');
const DummyImageContainer = require('./dummyimagecontainer');
const ProxyImageContainer = require('./proxyimagecontainer');
const FrameContainer = require('./framecontainer');
const SVGContainer = require('./svgcontainer');
const SVGNodeContainer = require('./svgnodecontainer');
const LinearGradientContainer = require('./lineargradientcontainer');
const WebkitGradientContainer = require('./webkitgradientcontainer');
const { bind } = require('./utils');

function ImageLoader(options, support) {
  this.link = null;
  this.options = options;
  this.support = support;
  this.origin = this.getOrigin(window.location.href);
}

ImageLoader.prototype.findImages = function (nodes) {
  const images = [];
  nodes
    .reduce((imageNodes, container) => {
      switch (container.node.nodeName) {
        case 'IMG':
          return imageNodes.concat([
            {
              args: [container.node.src],
              method: 'url',
            },
          ]);
        case 'svg':
        case 'IFRAME':
          return imageNodes.concat([
            {
              args: [container.node],
              method: container.node.nodeName,
            },
          ]);
      }
      return imageNodes;
    }, [])
    .forEach(this.addImage(images, this.loadImage), this);
  return images;
};

ImageLoader.prototype.findBackgroundImage = function (images, container) {
  container
    .parseBackgroundImages()
    .filter(this.hasImageBackground)
    .forEach(this.addImage(images, this.loadImage), this);
  return images;
};

ImageLoader.prototype.addImage = function (images, callback) {
  return function (newImage) {
    newImage.args.forEach(function (image) {
      if (!this.imageExists(images, image)) {
        images.splice(0, 0, callback.call(this, newImage));
        log(
          `Added image #${images.length}`,
          typeof image === 'string' ? image.substring(0, 100) : image,
        );
      }
    }, this);
  };
};

ImageLoader.prototype.hasImageBackground = function (imageData) {
  return imageData.method !== 'none';
};

ImageLoader.prototype.loadImage = function (imageData) {
  if (imageData.method === 'url') {
    var src = imageData.args[0];
    if (this.isSVG(src) && !this.support.svg && !this.options.allowTaint) {
      return new SVGContainer(src);
    }
    if (src.match(/data:image\/.*;base64,/i)) {
      return new ImageContainer(
        src.replace(/url\(['"]{0,}|['"]{0,}\)$/gi, ''),
        false,
      );
    }
    if (
      this.isSameOrigin(src) ||
      this.options.allowTaint === true ||
      this.isSVG(src)
    ) {
      return new ImageContainer(src, false);
    }
    if (this.support.cors && !this.options.allowTaint && this.options.useCORS) {
      return new ImageContainer(src, true);
    }
    if (this.options.proxy) {
      return new ProxyImageContainer(src, this.options.proxy);
    }
    return new DummyImageContainer(src);
  }
  if (imageData.method === 'linear-gradient') {
    return new LinearGradientContainer(imageData);
  }
  if (imageData.method === 'gradient') {
    return new WebkitGradientContainer(imageData);
  }
  if (imageData.method === 'svg') {
    return new SVGNodeContainer(imageData.args[0], this.support.svg);
  }
  if (imageData.method === 'IFRAME') {
    return new FrameContainer(
      imageData.args[0],
      this.isSameOrigin(imageData.args[0].src),
      this.options,
    );
  }
  return new DummyImageContainer(imageData);
};

ImageLoader.prototype.isSVG = function (src) {
  return (
    src.substring(src.length - 3).toLowerCase() === 'svg' ||
    SVGContainer.prototype.isInline(src)
  );
};

ImageLoader.prototype.imageExists = function (images, src) {
  return images.some((image) => image.src === src);
};

ImageLoader.prototype.isSameOrigin = function (url) {
  return this.getOrigin(url) === this.origin;
};

ImageLoader.prototype.getOrigin = function (url) {
  const link = this.link || (this.link = document.createElement('a'));
  link.href = url;
  link.href = link.href; // IE9, LOL! - http://jsfiddle.net/niklasvh/2e48b/
  return link.protocol + link.hostname + link.port;
};

ImageLoader.prototype.getPromise = function (container) {
  return this.timeout(container, this.options.imageTimeout).catch(() => {
    const dummy = new DummyImageContainer(container.src);
    return dummy.promise.then((image) => {
      container.image = image;
    });
  });
};

ImageLoader.prototype.get = function (src) {
  let found = null;
  return this.images.some((img) => (found = img).src === src) ? found : null;
};

ImageLoader.prototype.fetch = function (nodes) {
  this.images = nodes.reduce(
    bind(this.findBackgroundImage, this),
    this.findImages(nodes),
  );
  this.images.forEach((image, index) => {
    image.promise.then(
      () => {
        log(`Succesfully loaded image #${index + 1}`, image);
      },
      (e) => {
        log(`Failed loading image #${index + 1}`, image, e);
      },
    );
  });
  this.ready = Promise.all(this.images.map(this.getPromise, this));
  log('Finished searching images');
  return this;
};

ImageLoader.prototype.timeout = function (container, timeout) {
  let timer;
  const promise = Promise.race([
    container.promise,
    new Promise((res, reject) => {
      timer = setTimeout(() => {
        log('Timed out loading image', container);
        reject(container);
      }, timeout);
    }),
  ]).then((container) => {
    clearTimeout(timer);
    return container;
  });
  promise.catch(() => {
    clearTimeout(timer);
  });
  return promise;
};

module.exports = ImageLoader;
