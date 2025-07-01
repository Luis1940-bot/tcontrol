const punycode = require('punycode');
const log = require('./log');
const NodeContainer = require('./nodecontainer');
const TextContainer = require('./textcontainer');
const PseudoElementContainer = require('./pseudoelementcontainer');
const FontMetrics = require('./fontmetrics');
const Color = require('./color');
const StackingContext = require('./stackingcontext');
const utils = require('./utils');

const { bind } = utils;
const { getBounds } = utils;
const { parseBackgrounds } = utils;
const { offsetBounds } = utils;

function NodeParser(element, renderer, support, imageLoader, options) {
  log('Starting NodeParser');
  this.renderer = renderer;
  this.options = options;
  this.range = null;
  this.support = support;
  this.renderQueue = [];
  this.stack = new StackingContext(true, 1, element.ownerDocument, null);
  const parent = new NodeContainer(element, null);
  if (options.background) {
    renderer.rectangle(
      0,
      0,
      renderer.width,
      renderer.height,
      new Color(options.background),
    );
  }
  if (element === element.ownerDocument.documentElement) {
    // http://www.w3.org/TR/css3-background/#special-backgrounds
    const canvasBackground = new NodeContainer(
      parent.color('backgroundColor').isTransparent()
        ? element.ownerDocument.body
        : element.ownerDocument.documentElement,
      null,
    );
    renderer.rectangle(
      0,
      0,
      renderer.width,
      renderer.height,
      canvasBackground.color('backgroundColor'),
    );
  }
  parent.visibile = parent.isElementVisible();
  this.createPseudoHideStyles(element.ownerDocument);
  this.disableAnimations(element.ownerDocument);
  this.nodes = flatten(
    [parent]
      .concat(this.getChildren(parent))
      .filter((container) => (container.visible = container.isElementVisible()))
      .map(this.getPseudoElements, this),
  );
  this.fontMetrics = new FontMetrics();
  log('Fetched nodes, total:', this.nodes.length);
  log('Calculate overflow clips');
  this.calculateOverflowClips();
  log('Start fetching images');
  this.images = imageLoader.fetch(this.nodes.filter(isElement));
  this.ready = this.images.ready.then(
    bind(function () {
      log('Images loaded, starting parsing');
      log('Creating stacking contexts');
      this.createStackingContexts();
      log('Sorting stacking contexts');
      this.sortStackingContexts(this.stack);
      this.parse(this.stack);
      log(`Render queue created with ${this.renderQueue.length} items`);
      return new Promise(
        bind(function (resolve) {
          if (!options.async) {
            this.renderQueue.forEach(this.paint, this);
            resolve();
          } else if (typeof options.async === 'function') {
            options.async.call(this, this.renderQueue, resolve);
          } else if (this.renderQueue.length > 0) {
            this.renderIndex = 0;
            this.asyncRenderer(this.renderQueue, resolve);
          } else {
            resolve();
          }
        }, this),
      );
    }, this),
  );
}

NodeParser.prototype.calculateOverflowClips = function () {
  this.nodes.forEach(function (container) {
    if (isElement(container)) {
      if (isPseudoElement(container)) {
        container.appendToDOM();
      }
      container.borders = this.parseBorders(container);
      const clip =
        container.css('overflow') === 'hidden' ? [container.borders.clip] : [];
      const cssClip = container.parseClip();
      if (
        cssClip &&
        ['absolute', 'fixed'].indexOf(container.css('position')) !== -1
      ) {
        clip.push([
          [
            'rect',
            container.bounds.left + cssClip.left,
            container.bounds.top + cssClip.top,
            cssClip.right - cssClip.left,
            cssClip.bottom - cssClip.top,
          ],
        ]);
      }
      container.clip = hasParentClip(container)
        ? container.parent.clip.concat(clip)
        : clip;
      container.backgroundClip =
        container.css('overflow') !== 'hidden'
          ? container.clip.concat([container.borders.clip])
          : container.clip;
      if (isPseudoElement(container)) {
        container.cleanDOM();
      }
    } else if (isTextNode(container)) {
      container.clip = hasParentClip(container) ? container.parent.clip : [];
    }
    if (!isPseudoElement(container)) {
      container.bounds = null;
    }
  }, this);
};

function hasParentClip(container) {
  return container.parent && container.parent.clip.length;
}

NodeParser.prototype.asyncRenderer = function (queue, resolve, asyncTimer) {
  asyncTimer = asyncTimer || Date.now();
  this.paint(queue[this.renderIndex++]);
  if (queue.length === this.renderIndex) {
    resolve();
  } else if (asyncTimer + 20 > Date.now()) {
    this.asyncRenderer(queue, resolve, asyncTimer);
  } else {
    setTimeout(
      bind(function () {
        this.asyncRenderer(queue, resolve);
      }, this),
      0,
    );
  }
};

NodeParser.prototype.createPseudoHideStyles = function (document) {
  this.createStyles(
    document,
    `.${PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE}:before { content: "" !important; display: none !important; }` +
      `.${PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER}:after { content: "" !important; display: none !important; }`,
  );
};

NodeParser.prototype.disableAnimations = function (document) {
  this.createStyles(
    document,
    '* { -webkit-animation: none !important; -moz-animation: none !important; -o-animation: none !important; animation: none !important; ' +
      '-webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; transition: none !important;}',
  );
};

NodeParser.prototype.createStyles = function (document, styles) {
  const hidePseudoElements = document.createElement('style');
  hidePseudoElements.innerHTML = styles;
  document.body.appendChild(hidePseudoElements);
};

NodeParser.prototype.getPseudoElements = function (container) {
  const nodes = [[container]];
  if (container.node.nodeType === Node.ELEMENT_NODE) {
    const before = this.getPseudoElement(container, ':before');
    const after = this.getPseudoElement(container, ':after');

    if (before) {
      nodes.push(before);
    }

    if (after) {
      nodes.push(after);
    }
  }
  return flatten(nodes);
};

function toCamelCase(str) {
  return str.replace(/(\-[a-z])/g, (match) =>
    match.toUpperCase().replace('-', ''),
  );
}

NodeParser.prototype.getPseudoElement = function (container, type) {
  const style = container.computedStyle(type);
  if (
    !style ||
    !style.content ||
    style.content === 'none' ||
    style.content === '-moz-alt-content' ||
    style.display === 'none'
  ) {
    return null;
  }

  const content = stripQuotes(style.content);
  const isImage = content.substr(0, 3) === 'url';
  const pseudoNode = document.createElement(
    isImage ? 'img' : 'html2canvaspseudoelement',
  );
  const pseudoContainer = new PseudoElementContainer(
    pseudoNode,
    container,
    type,
  );

  for (let i = style.length - 1; i >= 0; i--) {
    const property = toCamelCase(style.item(i));
    pseudoNode.style[property] = style[property];
  }

  pseudoNode.className = `${PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE} ${PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER}`;

  if (isImage) {
    pseudoNode.src = parseBackgrounds(content)[0].args[0];
    return [pseudoContainer];
  }
  const text = document.createTextNode(content);
  pseudoNode.appendChild(text);
  return [pseudoContainer, new TextContainer(text, pseudoContainer)];
};

NodeParser.prototype.getChildren = function (parentContainer) {
  return flatten(
    [].filter
      .call(parentContainer.node.childNodes, renderableNode)
      .map(function (node) {
        const container = [
          node.nodeType === Node.TEXT_NODE
            ? new TextContainer(node, parentContainer)
            : new NodeContainer(node, parentContainer),
        ].filter(nonIgnoredElement);
        return node.nodeType === Node.ELEMENT_NODE &&
          container.length &&
          node.tagName !== 'TEXTAREA'
          ? container[0].isElementVisible()
            ? container.concat(this.getChildren(container[0]))
            : []
          : container;
      }, this),
  );
};

NodeParser.prototype.newStackingContext = function (container, hasOwnStacking) {
  const stack = new StackingContext(
    hasOwnStacking,
    container.getOpacity(),
    container.node,
    container.parent,
  );
  container.cloneTo(stack);
  const parentStack = hasOwnStacking
    ? stack.getParentStack(this)
    : stack.parent.stack;
  parentStack.contexts.push(stack);
  container.stack = stack;
};

NodeParser.prototype.createStackingContexts = function () {
  this.nodes.forEach(function (container) {
    if (
      isElement(container) &&
      (this.isRootElement(container) ||
        hasOpacity(container) ||
        isPositionedForStacking(container) ||
        this.isBodyWithTransparentRoot(container) ||
        container.hasTransform())
    ) {
      this.newStackingContext(container, true);
    } else if (
      isElement(container) &&
      ((isPositioned(container) && zIndex0(container)) ||
        isInlineBlock(container) ||
        isFloating(container))
    ) {
      this.newStackingContext(container, false);
    } else {
      container.assignStack(container.parent.stack);
    }
  }, this);
};

NodeParser.prototype.isBodyWithTransparentRoot = function (container) {
  return (
    container.node.nodeName === 'BODY' &&
    container.parent.color('backgroundColor').isTransparent()
  );
};

NodeParser.prototype.isRootElement = function (container) {
  return container.parent === null;
};

NodeParser.prototype.sortStackingContexts = function (stack) {
  stack.contexts.sort(zIndexSort(stack.contexts.slice(0)));
  stack.contexts.forEach(this.sortStackingContexts, this);
};

NodeParser.prototype.parseTextBounds = function (container) {
  return function (text, index, textList) {
    if (
      container.parent.css('textDecoration').substr(0, 4) !== 'none' ||
      text.trim().length !== 0
    ) {
      if (this.support.rangeBounds && !container.parent.hasTransform()) {
        const offset = textList.slice(0, index).join('').length;
        return this.getRangeBounds(container.node, offset, text.length);
      }
      if (container.node && typeof container.node.data === 'string') {
        const replacementNode = container.node.splitText(text.length);
        const bounds = this.getWrapperBounds(
          container.node,
          container.parent.hasTransform(),
        );
        container.node = replacementNode;
        return bounds;
      }
    } else if (!this.support.rangeBounds || container.parent.hasTransform()) {
      container.node = container.node.splitText(text.length);
    }
    return {};
  };
};

NodeParser.prototype.getWrapperBounds = function (node, transform) {
  const wrapper = node.ownerDocument.createElement('html2canvaswrapper');
  const parent = node.parentNode;
  const backupText = node.cloneNode(true);

  wrapper.appendChild(node.cloneNode(true));
  parent.replaceChild(wrapper, node);
  const bounds = transform ? offsetBounds(wrapper) : getBounds(wrapper);
  parent.replaceChild(backupText, wrapper);
  return bounds;
};

NodeParser.prototype.getRangeBounds = function (node, offset, length) {
  const range = this.range || (this.range = node.ownerDocument.createRange());
  range.setStart(node, offset);
  range.setEnd(node, offset + length);
  return range.getBoundingClientRect();
};

function ClearTransform() {}

NodeParser.prototype.parse = function (stack) {
  // http://www.w3.org/TR/CSS21/visuren.html#z-index
  const negativeZindex = stack.contexts.filter(negativeZIndex); // 2. the child stacking contexts with negative stack levels (most negative first).
  const descendantElements = stack.children.filter(isElement);
  const descendantNonFloats = descendantElements.filter(not(isFloating));
  const nonInlineNonPositionedDescendants = descendantNonFloats
    .filter(not(isPositioned))
    .filter(not(inlineLevel)); // 3 the in-flow, non-inline-level, non-positioned descendants.
  const nonPositionedFloats = descendantElements
    .filter(not(isPositioned))
    .filter(isFloating); // 4. the non-positioned floats.
  const inFlow = descendantNonFloats
    .filter(not(isPositioned))
    .filter(inlineLevel); // 5. the in-flow, inline-level, non-positioned descendants, including inline tables and inline blocks.
  const stackLevel0 = stack.contexts
    .concat(descendantNonFloats.filter(isPositioned))
    .filter(zIndex0); // 6. the child stacking contexts with stack level 0 and the positioned descendants with stack level 0.
  const text = stack.children.filter(isTextNode).filter(hasText);
  const positiveZindex = stack.contexts.filter(positiveZIndex); // 7. the child stacking contexts with positive stack levels (least positive first).
  negativeZindex
    .concat(nonInlineNonPositionedDescendants)
    .concat(nonPositionedFloats)
    .concat(inFlow)
    .concat(stackLevel0)
    .concat(text)
    .concat(positiveZindex)
    .forEach(function (container) {
      this.renderQueue.push(container);
      if (isStackingContext(container)) {
        this.parse(container);
        this.renderQueue.push(new ClearTransform());
      }
    }, this);
};

NodeParser.prototype.paint = function (container) {
  try {
    if (container instanceof ClearTransform) {
      this.renderer.ctx.restore();
    } else if (isTextNode(container)) {
      if (isPseudoElement(container.parent)) {
        container.parent.appendToDOM();
      }
      this.paintText(container);
      if (isPseudoElement(container.parent)) {
        container.parent.cleanDOM();
      }
    } else {
      this.paintNode(container);
    }
  } catch (e) {
    log(e);
    if (this.options.strict) {
      throw e;
    }
  }
};

NodeParser.prototype.paintNode = function (container) {
  if (isStackingContext(container)) {
    this.renderer.setOpacity(container.opacity);
    this.renderer.ctx.save();
    if (container.hasTransform()) {
      this.renderer.setTransform(container.parseTransform());
    }
  }

  if (
    container.node.nodeName === 'INPUT' &&
    container.node.type === 'checkbox'
  ) {
    this.paintCheckbox(container);
  } else if (
    container.node.nodeName === 'INPUT' &&
    container.node.type === 'radio'
  ) {
    this.paintRadio(container);
  } else {
    this.paintElement(container);
  }
};

NodeParser.prototype.paintElement = function (container) {
  const bounds = container.parseBounds();
  this.renderer.clip(
    container.backgroundClip,
    function () {
      this.renderer.renderBackground(
        container,
        bounds,
        container.borders.borders.map(getWidth),
      );
    },
    this,
  );

  this.renderer.clip(
    container.clip,
    function () {
      this.renderer.renderBorders(container.borders.borders);
    },
    this,
  );

  this.renderer.clip(
    container.backgroundClip,
    function () {
      switch (container.node.nodeName) {
        case 'svg':
        case 'IFRAME':
          var imgContainer = this.images.get(container.node);
          if (imgContainer) {
            this.renderer.renderImage(
              container,
              bounds,
              container.borders,
              imgContainer,
            );
          } else {
            log(`Error loading <${container.node.nodeName}>`, container.node);
          }
          break;
        case 'IMG':
          var imageContainer = this.images.get(container.node.src);
          if (imageContainer) {
            this.renderer.renderImage(
              container,
              bounds,
              container.borders,
              imageContainer,
            );
          } else {
            log('Error loading <img>', container.node.src);
          }
          break;
        case 'CANVAS':
          this.renderer.renderImage(container, bounds, container.borders, {
            image: container.node,
          });
          break;
        case 'SELECT':
        case 'INPUT':
        case 'TEXTAREA':
          this.paintFormValue(container);
          break;
      }
    },
    this,
  );
};

NodeParser.prototype.paintCheckbox = function (container) {
  const b = container.parseBounds();

  const size = Math.min(b.width, b.height);
  const bounds = {
    width: size - 1,
    height: size - 1,
    top: b.top,
    left: b.left,
  };
  const r = [3, 3];
  const radius = [r, r, r, r];
  const borders = [1, 1, 1, 1].map((w) => ({
    color: new Color('#A5A5A5'),
    width: w,
  }));

  const borderPoints = calculateCurvePoints(bounds, radius, borders);

  this.renderer.clip(
    container.backgroundClip,
    function () {
      this.renderer.rectangle(
        bounds.left + 1,
        bounds.top + 1,
        bounds.width - 2,
        bounds.height - 2,
        new Color('#DEDEDE'),
      );
      this.renderer.renderBorders(
        calculateBorders(borders, bounds, borderPoints, radius),
      );
      if (container.node.checked) {
        this.renderer.font(
          new Color('#424242'),
          'normal',
          'normal',
          'bold',
          `${size - 3}px`,
          'arial',
        );
        this.renderer.text(
          '\u2714',
          bounds.left + size / 6,
          bounds.top + size - 1,
        );
      }
    },
    this,
  );
};

NodeParser.prototype.paintRadio = function (container) {
  const bounds = container.parseBounds();

  const size = Math.min(bounds.width, bounds.height) - 2;

  this.renderer.clip(
    container.backgroundClip,
    function () {
      this.renderer.circleStroke(
        bounds.left + 1,
        bounds.top + 1,
        size,
        new Color('#DEDEDE'),
        1,
        new Color('#A5A5A5'),
      );
      if (container.node.checked) {
        this.renderer.circle(
          Math.ceil(bounds.left + size / 4) + 1,
          Math.ceil(bounds.top + size / 4) + 1,
          Math.floor(size / 2),
          new Color('#424242'),
        );
      }
    },
    this,
  );
};

NodeParser.prototype.paintFormValue = function (container) {
  const value = container.getValue();
  if (value.length > 0) {
    const document = container.node.ownerDocument;
    const wrapper = document.createElement('html2canvaswrapper');
    const properties = [
      'lineHeight',
      'textAlign',
      'fontFamily',
      'fontWeight',
      'fontSize',
      'color',
      'paddingLeft',
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'width',
      'height',
      'borderLeftStyle',
      'borderTopStyle',
      'borderLeftWidth',
      'borderTopWidth',
      'boxSizing',
      'whiteSpace',
      'wordWrap',
    ];

    properties.forEach((property) => {
      try {
        wrapper.style[property] = container.css(property);
      } catch (e) {
        // Older IE has issues with "border"
        log(
          `html2canvas: Parse: Exception caught in renderFormValue: ${e.message}`,
        );
      }
    });
    const bounds = container.parseBounds();
    wrapper.style.position = 'fixed';
    wrapper.style.left = `${bounds.left}px`;
    wrapper.style.top = `${bounds.top}px`;
    wrapper.textContent = value;
    document.body.appendChild(wrapper);
    this.paintText(new TextContainer(wrapper.firstChild, container));
    document.body.removeChild(wrapper);
  }
};

NodeParser.prototype.paintText = function (container) {
  container.applyTextTransform();
  const characters = punycode.ucs2.decode(container.node.data);
  const textList =
    (!this.options.letterRendering || noLetterSpacing(container)) &&
    !hasUnicode(container.node.data)
      ? getWords(characters)
      : characters.map((character) => punycode.ucs2.encode([character]));

  const weight = container.parent.fontWeight();
  const size = container.parent.css('fontSize');
  const family = container.parent.css('fontFamily');
  const shadows = container.parent.parseTextShadows();

  this.renderer.font(
    container.parent.color('color'),
    container.parent.css('fontStyle'),
    container.parent.css('fontVariant'),
    weight,
    size,
    family,
  );
  if (shadows.length) {
    // TODO: support multiple text shadows
    this.renderer.fontShadow(
      shadows[0].color,
      shadows[0].offsetX,
      shadows[0].offsetY,
      shadows[0].blur,
    );
  } else {
    this.renderer.clearShadow();
  }

  this.renderer.clip(
    container.parent.clip,
    function () {
      textList.map(this.parseTextBounds(container), this).forEach(function (
        bounds,
        index,
      ) {
        if (bounds) {
          this.renderer.text(textList[index], bounds.left, bounds.bottom);
          this.renderTextDecoration(
            container.parent,
            bounds,
            this.fontMetrics.getMetrics(family, size),
          );
        }
      }, this);
    },
    this,
  );
};

NodeParser.prototype.renderTextDecoration = function (
  container,
  bounds,
  metrics,
) {
  switch (container.css('textDecoration').split(' ')[0]) {
    case 'underline':
      // Draws a line at the baseline of the font
      // TODO As some browsers display the line as more than 1px if the font-size is big, need to take that into account both in position and size
      this.renderer.rectangle(
        bounds.left,
        Math.round(bounds.top + metrics.baseline + metrics.lineWidth),
        bounds.width,
        1,
        container.color('color'),
      );
      break;
    case 'overline':
      this.renderer.rectangle(
        bounds.left,
        Math.round(bounds.top),
        bounds.width,
        1,
        container.color('color'),
      );
      break;
    case 'line-through':
      // TODO try and find exact position for line-through
      this.renderer.rectangle(
        bounds.left,
        Math.ceil(bounds.top + metrics.middle + metrics.lineWidth),
        bounds.width,
        1,
        container.color('color'),
      );
      break;
  }
};

const borderColorTransforms = {
  inset: [
    ['darken', 0.6],
    ['darken', 0.1],
    ['darken', 0.1],
    ['darken', 0.6],
  ],
};

NodeParser.prototype.parseBorders = function (container) {
  const nodeBounds = container.parseBounds();
  const radius = getBorderRadiusData(container);
  const borders = ['Top', 'Right', 'Bottom', 'Left'].map((side, index) => {
    const style = container.css(`border${side}Style`);
    let color = container.color(`border${side}Color`);
    if (style === 'inset' && color.isBlack()) {
      color = new Color([255, 255, 255, color.a]); // this is wrong, but
    }
    const colorTransform = borderColorTransforms[style]
      ? borderColorTransforms[style][index]
      : null;
    return {
      width: container.cssInt(`border${side}Width`),
      color: colorTransform
        ? color[colorTransform[0]](colorTransform[1])
        : color,
      args: null,
    };
  });
  const borderPoints = calculateCurvePoints(nodeBounds, radius, borders);

  return {
    clip: this.parseBackgroundClip(
      container,
      borderPoints,
      borders,
      radius,
      nodeBounds,
    ),
    borders: calculateBorders(borders, nodeBounds, borderPoints, radius),
  };
};

function calculateBorders(borders, nodeBounds, borderPoints, radius) {
  return borders.map((border, borderSide) => {
    if (border.width > 0) {
      let bx = nodeBounds.left;
      let by = nodeBounds.top;
      let bw = nodeBounds.width;
      let bh = nodeBounds.height - borders[2].width;

      switch (borderSide) {
        case 0:
          // top border
          bh = borders[0].width;
          border.args = drawSide(
            {
              c1: [bx, by],
              c2: [bx + bw, by],
              c3: [bx + bw - borders[1].width, by + bh],
              c4: [bx + borders[3].width, by + bh],
            },
            radius[0],
            radius[1],
            borderPoints.topLeftOuter,
            borderPoints.topLeftInner,
            borderPoints.topRightOuter,
            borderPoints.topRightInner,
          );
          break;
        case 1:
          // right border
          bx = nodeBounds.left + nodeBounds.width - borders[1].width;
          bw = borders[1].width;

          border.args = drawSide(
            {
              c1: [bx + bw, by],
              c2: [bx + bw, by + bh + borders[2].width],
              c3: [bx, by + bh],
              c4: [bx, by + borders[0].width],
            },
            radius[1],
            radius[2],
            borderPoints.topRightOuter,
            borderPoints.topRightInner,
            borderPoints.bottomRightOuter,
            borderPoints.bottomRightInner,
          );
          break;
        case 2:
          // bottom border
          by = by + nodeBounds.height - borders[2].width;
          bh = borders[2].width;
          border.args = drawSide(
            {
              c1: [bx + bw, by + bh],
              c2: [bx, by + bh],
              c3: [bx + borders[3].width, by],
              c4: [bx + bw - borders[3].width, by],
            },
            radius[2],
            radius[3],
            borderPoints.bottomRightOuter,
            borderPoints.bottomRightInner,
            borderPoints.bottomLeftOuter,
            borderPoints.bottomLeftInner,
          );
          break;
        case 3:
          // left border
          bw = borders[3].width;
          border.args = drawSide(
            {
              c1: [bx, by + bh + borders[2].width],
              c2: [bx, by],
              c3: [bx + bw, by + borders[0].width],
              c4: [bx + bw, by + bh],
            },
            radius[3],
            radius[0],
            borderPoints.bottomLeftOuter,
            borderPoints.bottomLeftInner,
            borderPoints.topLeftOuter,
            borderPoints.topLeftInner,
          );
          break;
      }
    }
    return border;
  });
}

NodeParser.prototype.parseBackgroundClip = function (
  container,
  borderPoints,
  borders,
  radius,
  bounds,
) {
  const backgroundClip = container.css('backgroundClip');
  const borderArgs = [];

  switch (backgroundClip) {
    case 'content-box':
    case 'padding-box':
      parseCorner(
        borderArgs,
        radius[0],
        radius[1],
        borderPoints.topLeftInner,
        borderPoints.topRightInner,
        bounds.left + borders[3].width,
        bounds.top + borders[0].width,
      );
      parseCorner(
        borderArgs,
        radius[1],
        radius[2],
        borderPoints.topRightInner,
        borderPoints.bottomRightInner,
        bounds.left + bounds.width - borders[1].width,
        bounds.top + borders[0].width,
      );
      parseCorner(
        borderArgs,
        radius[2],
        radius[3],
        borderPoints.bottomRightInner,
        borderPoints.bottomLeftInner,
        bounds.left + bounds.width - borders[1].width,
        bounds.top + bounds.height - borders[2].width,
      );
      parseCorner(
        borderArgs,
        radius[3],
        radius[0],
        borderPoints.bottomLeftInner,
        borderPoints.topLeftInner,
        bounds.left + borders[3].width,
        bounds.top + bounds.height - borders[2].width,
      );
      break;

    default:
      parseCorner(
        borderArgs,
        radius[0],
        radius[1],
        borderPoints.topLeftOuter,
        borderPoints.topRightOuter,
        bounds.left,
        bounds.top,
      );
      parseCorner(
        borderArgs,
        radius[1],
        radius[2],
        borderPoints.topRightOuter,
        borderPoints.bottomRightOuter,
        bounds.left + bounds.width,
        bounds.top,
      );
      parseCorner(
        borderArgs,
        radius[2],
        radius[3],
        borderPoints.bottomRightOuter,
        borderPoints.bottomLeftOuter,
        bounds.left + bounds.width,
        bounds.top + bounds.height,
      );
      parseCorner(
        borderArgs,
        radius[3],
        radius[0],
        borderPoints.bottomLeftOuter,
        borderPoints.topLeftOuter,
        bounds.left,
        bounds.top + bounds.height,
      );
      break;
  }

  return borderArgs;
};

function getCurvePoints(x, y, r1, r2) {
  const kappa = 4 * ((Math.sqrt(2) - 1) / 3);
  const ox = r1 * kappa; // control point offset horizontal
  const oy = r2 * kappa; // control point offset vertical
  const xm = x + r1; // x-middle
  const ym = y + r2; // y-middle
  return {
    topLeft: bezierCurve(
      { x, y: ym },
      { x, y: ym - oy },
      { x: xm - ox, y },
      { x: xm, y },
    ),
    topRight: bezierCurve(
      { x, y },
      { x: x + ox, y },
      { x: xm, y: ym - oy },
      { x: xm, y: ym },
    ),
    bottomRight: bezierCurve(
      { x: xm, y },
      { x: xm, y: y + oy },
      { x: x + ox, y: ym },
      { x, y: ym },
    ),
    bottomLeft: bezierCurve(
      { x: xm, y: ym },
      { x: xm - ox, y: ym },
      { x, y: y + oy },
      { x, y },
    ),
  };
}

function calculateCurvePoints(bounds, borderRadius, borders) {
  const x = bounds.left;
  const y = bounds.top;
  const { width } = bounds;
  const { height } = bounds;

  const tlh = borderRadius[0][0] < width / 2 ? borderRadius[0][0] : width / 2;
  const tlv = borderRadius[0][1] < height / 2 ? borderRadius[0][1] : height / 2;
  const trh = borderRadius[1][0] < width / 2 ? borderRadius[1][0] : width / 2;
  const trv = borderRadius[1][1] < height / 2 ? borderRadius[1][1] : height / 2;
  const brh = borderRadius[2][0] < width / 2 ? borderRadius[2][0] : width / 2;
  const brv = borderRadius[2][1] < height / 2 ? borderRadius[2][1] : height / 2;
  const blh = borderRadius[3][0] < width / 2 ? borderRadius[3][0] : width / 2;
  const blv = borderRadius[3][1] < height / 2 ? borderRadius[3][1] : height / 2;

  const topWidth = width - trh;
  const rightHeight = height - brv;
  const bottomWidth = width - brh;
  const leftHeight = height - blv;

  return {
    topLeftOuter: getCurvePoints(x, y, tlh, tlv).topLeft.subdivide(0.5),
    topLeftInner: getCurvePoints(
      x + borders[3].width,
      y + borders[0].width,
      Math.max(0, tlh - borders[3].width),
      Math.max(0, tlv - borders[0].width),
    ).topLeft.subdivide(0.5),
    topRightOuter: getCurvePoints(x + topWidth, y, trh, trv).topRight.subdivide(
      0.5,
    ),
    topRightInner: getCurvePoints(
      x + Math.min(topWidth, width + borders[3].width),
      y + borders[0].width,
      topWidth > width + borders[3].width ? 0 : trh - borders[3].width,
      trv - borders[0].width,
    ).topRight.subdivide(0.5),
    bottomRightOuter: getCurvePoints(
      x + bottomWidth,
      y + rightHeight,
      brh,
      brv,
    ).bottomRight.subdivide(0.5),
    bottomRightInner: getCurvePoints(
      x + Math.min(bottomWidth, width - borders[3].width),
      y + Math.min(rightHeight, height + borders[0].width),
      Math.max(0, brh - borders[1].width),
      brv - borders[2].width,
    ).bottomRight.subdivide(0.5),
    bottomLeftOuter: getCurvePoints(
      x,
      y + leftHeight,
      blh,
      blv,
    ).bottomLeft.subdivide(0.5),
    bottomLeftInner: getCurvePoints(
      x + borders[3].width,
      y + leftHeight,
      Math.max(0, blh - borders[3].width),
      blv - borders[2].width,
    ).bottomLeft.subdivide(0.5),
  };
}

function bezierCurve(start, startControl, endControl, end) {
  const lerp = function (a, b, t) {
    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    };
  };

  return {
    start,
    startControl,
    endControl,
    end,
    subdivide(t) {
      const ab = lerp(start, startControl, t);
      const bc = lerp(startControl, endControl, t);
      const cd = lerp(endControl, end, t);
      const abbc = lerp(ab, bc, t);
      const bccd = lerp(bc, cd, t);
      const dest = lerp(abbc, bccd, t);
      return [
        bezierCurve(start, ab, abbc, dest),
        bezierCurve(dest, bccd, cd, end),
      ];
    },
    curveTo(borderArgs) {
      borderArgs.push([
        'bezierCurve',
        startControl.x,
        startControl.y,
        endControl.x,
        endControl.y,
        end.x,
        end.y,
      ]);
    },
    curveToReversed(borderArgs) {
      borderArgs.push([
        'bezierCurve',
        endControl.x,
        endControl.y,
        startControl.x,
        startControl.y,
        start.x,
        start.y,
      ]);
    },
  };
}

function drawSide(
  borderData,
  radius1,
  radius2,
  outer1,
  inner1,
  outer2,
  inner2,
) {
  const borderArgs = [];

  if (radius1[0] > 0 || radius1[1] > 0) {
    borderArgs.push(['line', outer1[1].start.x, outer1[1].start.y]);
    outer1[1].curveTo(borderArgs);
  } else {
    borderArgs.push(['line', borderData.c1[0], borderData.c1[1]]);
  }

  if (radius2[0] > 0 || radius2[1] > 0) {
    borderArgs.push(['line', outer2[0].start.x, outer2[0].start.y]);
    outer2[0].curveTo(borderArgs);
    borderArgs.push(['line', inner2[0].end.x, inner2[0].end.y]);
    inner2[0].curveToReversed(borderArgs);
  } else {
    borderArgs.push(['line', borderData.c2[0], borderData.c2[1]]);
    borderArgs.push(['line', borderData.c3[0], borderData.c3[1]]);
  }

  if (radius1[0] > 0 || radius1[1] > 0) {
    borderArgs.push(['line', inner1[1].end.x, inner1[1].end.y]);
    inner1[1].curveToReversed(borderArgs);
  } else {
    borderArgs.push(['line', borderData.c4[0], borderData.c4[1]]);
  }

  return borderArgs;
}

function parseCorner(borderArgs, radius1, radius2, corner1, corner2, x, y) {
  if (radius1[0] > 0 || radius1[1] > 0) {
    borderArgs.push(['line', corner1[0].start.x, corner1[0].start.y]);
    corner1[0].curveTo(borderArgs);
    corner1[1].curveTo(borderArgs);
  } else {
    borderArgs.push(['line', x, y]);
  }

  if (radius2[0] > 0 || radius2[1] > 0) {
    borderArgs.push(['line', corner2[0].start.x, corner2[0].start.y]);
  }
}

function negativeZIndex(container) {
  return container.cssInt('zIndex') < 0;
}

function positiveZIndex(container) {
  return container.cssInt('zIndex') > 0;
}

function zIndex0(container) {
  return container.cssInt('zIndex') === 0;
}

function inlineLevel(container) {
  return (
    ['inline', 'inline-block', 'inline-table'].indexOf(
      container.css('display'),
    ) !== -1
  );
}

function isStackingContext(container) {
  return container instanceof StackingContext;
}

function hasText(container) {
  return container.node.data.trim().length > 0;
}

function noLetterSpacing(container) {
  return /^(normal|none|0px)$/.test(container.parent.css('letterSpacing'));
}

function getBorderRadiusData(container) {
  return ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].map((side) => {
    const value = container.css(`border${side}Radius`);
    const arr = value.split(' ');
    if (arr.length <= 1) {
      arr[1] = arr[0];
    }
    return arr.map(asInt);
  });
}

function renderableNode(node) {
  return (
    node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE
  );
}

function isPositionedForStacking(container) {
  const position = container.css('position');
  const zIndex =
    ['absolute', 'relative', 'fixed'].indexOf(position) !== -1
      ? container.css('zIndex')
      : 'auto';
  return zIndex !== 'auto';
}

function isPositioned(container) {
  return container.css('position') !== 'static';
}

function isFloating(container) {
  return container.css('float') !== 'none';
}

function isInlineBlock(container) {
  return (
    ['inline-block', 'inline-table'].indexOf(container.css('display')) !== -1
  );
}

function not(callback) {
  const context = this;
  return function () {
    return !callback.apply(context, arguments);
  };
}

function isElement(container) {
  return container.node.nodeType === Node.ELEMENT_NODE;
}

function isPseudoElement(container) {
  return container.isPseudoElement === true;
}

function isTextNode(container) {
  return container.node.nodeType === Node.TEXT_NODE;
}

function zIndexSort(contexts) {
  return function (a, b) {
    return (
      a.cssInt('zIndex') +
      contexts.indexOf(a) / contexts.length -
      (b.cssInt('zIndex') + contexts.indexOf(b) / contexts.length)
    );
  };
}

function hasOpacity(container) {
  return container.getOpacity() < 1;
}

function asInt(value) {
  return parseInt(value, 10);
}

function getWidth(border) {
  return border.width;
}

function nonIgnoredElement(nodeContainer) {
  return (
    nodeContainer.node.nodeType !== Node.ELEMENT_NODE ||
    ['SCRIPT', 'HEAD', 'TITLE', 'OBJECT', 'BR', 'OPTION'].indexOf(
      nodeContainer.node.nodeName,
    ) === -1
  );
}

function flatten(arrays) {
  return [].concat.apply([], arrays);
}

function stripQuotes(content) {
  const first = content.substr(0, 1);
  return first === content.substr(content.length - 1) && first.match(/'|"/)
    ? content.substr(1, content.length - 2)
    : content;
}

function getWords(characters) {
  const words = [];
  let i = 0;
  let onWordBoundary = false;
  let word;
  while (characters.length) {
    if (isWordBoundary(characters[i]) === onWordBoundary) {
      word = characters.splice(0, i);
      if (word.length) {
        words.push(punycode.ucs2.encode(word));
      }
      onWordBoundary = !onWordBoundary;
      i = 0;
    } else {
      i++;
    }

    if (i >= characters.length) {
      word = characters.splice(0, i);
      if (word.length) {
        words.push(punycode.ucs2.encode(word));
      }
    }
  }
  return words;
}

function isWordBoundary(characterCode) {
  return (
    [
      32, // <space>
      13, // \r
      10, // \n
      9, // \t
      45, // -
    ].indexOf(characterCode) !== -1
  );
}

function hasUnicode(string) {
  return /[^\u0000-\u00ff]/.test(string);
}

module.exports = NodeParser;
