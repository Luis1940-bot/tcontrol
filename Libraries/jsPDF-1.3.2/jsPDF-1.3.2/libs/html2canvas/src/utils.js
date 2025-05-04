exports.smallImage = function smallImage() {
  return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
};

exports.bind = function (callback, context) {
  return function () {
    return callback.apply(context, arguments);
  };
};

/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */

exports.decode64 = function (base64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const len = base64.length; let i; let encoded1; let encoded2; let encoded3; let encoded4; let byte1; let byte2; let
    byte3;

  let output = '';

  for (i = 0; i < len; i += 4) {
    encoded1 = chars.indexOf(base64[i]);
    encoded2 = chars.indexOf(base64[i + 1]);
    encoded3 = chars.indexOf(base64[i + 2]);
    encoded4 = chars.indexOf(base64[i + 3]);

    byte1 = (encoded1 << 2) | (encoded2 >> 4);
    byte2 = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    byte3 = ((encoded3 & 3) << 6) | encoded4;
    if (encoded3 === 64) {
      output += String.fromCharCode(byte1);
    } else if (encoded4 === 64 || encoded4 === -1) {
      output += String.fromCharCode(byte1, byte2);
    } else {
      output += String.fromCharCode(byte1, byte2, byte3);
    }
  }

  return output;
};

exports.getBounds = function (node) {
  if (node.getBoundingClientRect) {
    const clientRect = node.getBoundingClientRect();
    const width = node.offsetWidth == null ? clientRect.width : node.offsetWidth;
    return {
      top: clientRect.top,
      bottom: clientRect.bottom || (clientRect.top + clientRect.height),
      right: clientRect.left + width,
      left: clientRect.left,
      width,
      height: node.offsetHeight == null ? clientRect.height : node.offsetHeight,
    };
  }
  return {};
};

exports.offsetBounds = function (node) {
  const parent = node.offsetParent ? exports.offsetBounds(node.offsetParent) : { top: 0, left: 0 };

  return {
    top: node.offsetTop + parent.top,
    bottom: node.offsetTop + node.offsetHeight + parent.top,
    right: node.offsetLeft + parent.left + node.offsetWidth,
    left: node.offsetLeft + parent.left,
    width: node.offsetWidth,
    height: node.offsetHeight,
  };
};

exports.parseBackgrounds = function (backgroundImage) {
  const whitespace = ' \r\n\t';
  let method; let definition; let prefix; let prefix_i; let block; const results = [];
  let mode = 0; let numParen = 0; let quote; let
    args;
  const appendResult = function () {
    if (method) {
      if (definition.substr(0, 1) === '"') {
        definition = definition.substr(1, definition.length - 2);
      }
      if (definition) {
        args.push(definition);
      }
      if (method.substr(0, 1) === '-' && (prefix_i = method.indexOf('-', 1) + 1) > 0) {
        prefix = method.substr(0, prefix_i);
        method = method.substr(prefix_i);
      }
      results.push({
        prefix,
        method: method.toLowerCase(),
        value: block,
        args,
        image: null,
      });
    }
    args = [];
    method = prefix = definition = block = '';
  };
  args = [];
  method = prefix = definition = block = '';
  backgroundImage.split('').forEach((c) => {
    if (mode === 0 && whitespace.indexOf(c) > -1) {
      return;
    }
    switch (c) {
      case '"':
        if (!quote) {
          quote = c;
        } else if (quote === c) {
          quote = null;
        }
        break;
      case '(':
        if (quote) {
          break;
        } else if (mode === 0) {
          mode = 1;
          block += c;
          return;
        } else {
          numParen++;
        }
        break;
      case ')':
        if (quote) {
          break;
        } else if (mode === 1) {
          if (numParen === 0) {
            mode = 0;
            block += c;
            appendResult();
            return;
          }
          numParen--;
        }
        break;

      case ',':
        if (quote) {
          break;
        } else if (mode === 0) {
          appendResult();
          return;
        } else if (mode === 1) {
          if (numParen === 0 && !method.match(/^url$/i)) {
            args.push(definition);
            definition = '';
            block += c;
            return;
          }
        }
        break;
    }

    block += c;
    if (mode === 0) {
      method += c;
    } else {
      definition += c;
    }
  });

  appendResult();
  return results;
};
