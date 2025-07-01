const log = require('./log');

function Renderer(width, height, images, options, document) {
  this.width = width;
  this.height = height;
  this.images = images;
  this.options = options;
  this.document = document;
}

Renderer.prototype.renderImage = function (
  container,
  bounds,
  borderData,
  imageContainer,
) {
  const paddingLeft = container.cssInt('paddingLeft');
  const paddingTop = container.cssInt('paddingTop');
  const paddingRight = container.cssInt('paddingRight');
  const paddingBottom = container.cssInt('paddingBottom');
  const { borders } = borderData;

  const width =
    bounds.width -
    (borders[1].width + borders[3].width + paddingLeft + paddingRight);
  const height =
    bounds.height -
    (borders[0].width + borders[2].width + paddingTop + paddingBottom);
  this.drawImage(
    imageContainer,
    0,
    0,
    imageContainer.image.width || width,
    imageContainer.image.height || height,
    bounds.left + paddingLeft + borders[3].width,
    bounds.top + paddingTop + borders[0].width,
    width,
    height,
  );
};

Renderer.prototype.renderBackground = function (container, bounds, borderData) {
  if (bounds.height > 0 && bounds.width > 0) {
    this.renderBackgroundColor(container, bounds);
    this.renderBackgroundImage(container, bounds, borderData);
  }
};

Renderer.prototype.renderBackgroundColor = function (container, bounds) {
  const color = container.color('backgroundColor');
  if (!color.isTransparent()) {
    this.rectangle(bounds.left, bounds.top, bounds.width, bounds.height, color);
  }
};

Renderer.prototype.renderBorders = function (borders) {
  borders.forEach(this.renderBorder, this);
};

Renderer.prototype.renderBorder = function (data) {
  if (!data.color.isTransparent() && data.args !== null) {
    this.drawShape(data.args, data.color);
  }
};

Renderer.prototype.renderBackgroundImage = function (
  container,
  bounds,
  borderData,
) {
  const backgroundImages = container.parseBackgroundImages();
  backgroundImages.reverse().forEach(function (backgroundImage, index, arr) {
    switch (backgroundImage.method) {
      case 'url':
        var image = this.images.get(backgroundImage.args[0]);
        if (image) {
          this.renderBackgroundRepeating(
            container,
            bounds,
            image,
            arr.length - (index + 1),
            borderData,
          );
        } else {
          log('Error loading background-image', backgroundImage.args[0]);
        }
        break;
      case 'linear-gradient':
      case 'gradient':
        var gradientImage = this.images.get(backgroundImage.value);
        if (gradientImage) {
          this.renderBackgroundGradient(gradientImage, bounds, borderData);
        } else {
          log('Error loading background-image', backgroundImage.args[0]);
        }
        break;
      case 'none':
        break;
      default:
        log('Unknown background-image type', backgroundImage.args[0]);
    }
  }, this);
};

Renderer.prototype.renderBackgroundRepeating = function (
  container,
  bounds,
  imageContainer,
  index,
  borderData,
) {
  const size = container.parseBackgroundSize(
    bounds,
    imageContainer.image,
    index,
  );
  const position = container.parseBackgroundPosition(
    bounds,
    imageContainer.image,
    index,
    size,
  );
  const repeat = container.parseBackgroundRepeat(index);
  switch (repeat) {
    case 'repeat-x':
    case 'repeat no-repeat':
      this.backgroundRepeatShape(
        imageContainer,
        position,
        size,
        bounds,
        bounds.left + borderData[3],
        bounds.top + position.top + borderData[0],
        99999,
        size.height,
        borderData,
      );
      break;
    case 'repeat-y':
    case 'no-repeat repeat':
      this.backgroundRepeatShape(
        imageContainer,
        position,
        size,
        bounds,
        bounds.left + position.left + borderData[3],
        bounds.top + borderData[0],
        size.width,
        99999,
        borderData,
      );
      break;
    case 'no-repeat':
      this.backgroundRepeatShape(
        imageContainer,
        position,
        size,
        bounds,
        bounds.left + position.left + borderData[3],
        bounds.top + position.top + borderData[0],
        size.width,
        size.height,
        borderData,
      );
      break;
    default:
      this.renderBackgroundRepeat(
        imageContainer,
        position,
        size,
        { top: bounds.top, left: bounds.left },
        borderData[3],
        borderData[0],
      );
      break;
  }
};

module.exports = Renderer;
