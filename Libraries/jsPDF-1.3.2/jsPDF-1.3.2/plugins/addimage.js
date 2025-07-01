/** @preserve
 * jsPDF addImage plugin
 * Copyright (c) 2012 Jason Siefken, https://github.com/siefkenj/
 *               2013 Chris Dowling, https://github.com/gingerchris
 *               2013 Trinh Ho, https://github.com/ineedfat
 *               2013 Edwin Alejandro Perez, https://github.com/eaparango
 *               2013 Norah Smith, https://github.com/burnburnrocket
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 James Robb, https://github.com/jamesbrobb
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function (jsPDFAPI) {
  const namespace = 'addImage_';
  const supported_image_types = ['jpeg', 'jpg', 'png'];

  // Image functionality ported from pdf.js
  const putImage = function (img) {
    const objectNumber = this.internal.newObject();
    const out = this.internal.write;
    const { putStream } = this.internal;

    img.n = objectNumber;

    out('<</Type /XObject');
    out('/Subtype /Image');
    out(`/Width ${img.w}`);
    out(`/Height ${img.h}`);
    if (img.cs === this.color_spaces.INDEXED) {
      out(
        `/ColorSpace [/Indexed /DeviceRGB ${
          // if an indexed png defines more than one colour with transparency, we've created a smask
          img.pal.length / 3 - 1
        } ${'smask' in img ? objectNumber + 2 : objectNumber + 1} 0 R]`,
      );
    } else {
      out(`/ColorSpace /${img.cs}`);
      if (img.cs === this.color_spaces.DEVICE_CMYK) {
        out('/Decode [1 0 1 0 1 0 1 0]');
      }
    }
    out(`/BitsPerComponent ${img.bpc}`);
    if ('f' in img) {
      out(`/Filter /${img.f}`);
    }
    if ('dp' in img) {
      out(`/DecodeParms <<${img.dp}>>`);
    }
    if ('trns' in img && img.trns.constructor == Array) {
      let trns = '';
      let i = 0;
      const len = img.trns.length;
      for (; i < len; i++) trns += `${img.trns[i]} ${img.trns[i]} `;
      out(`/Mask [${trns}]`);
    }
    if ('smask' in img) {
      out(`/SMask ${objectNumber + 1} 0 R`);
    }
    out(`/Length ${img.data.length}>>`);

    putStream(img.data);

    out('endobj');

    // Soft mask
    if ('smask' in img) {
      const dp = `/Predictor ${img.p} /Colors 1 /BitsPerComponent ${img.bpc} /Columns ${img.w}`;
      const smask = {
        w: img.w,
        h: img.h,
        cs: 'DeviceGray',
        bpc: img.bpc,
        dp,
        data: img.smask,
      };
      if ('f' in img) smask.f = img.f;
      putImage.call(this, smask);
    }

    // Palette
    if (img.cs === this.color_spaces.INDEXED) {
      this.internal.newObject();
      // out('<< /Filter / ' + img['f'] +' /Length ' + img['pal'].length + '>>');
      // putStream(zlib.compress(img['pal']));
      out(`<< /Length ${img.pal.length}>>`);
      putStream(this.arrayBufferToBinaryString(new Uint8Array(img.pal)));
      out('endobj');
    }
  };
  const putResourcesCallback = function () {
    const images = this.internal.collections[`${namespace}images`];
    for (const i in images) {
      putImage.call(this, images[i]);
    }
  };
  const putXObjectsDictCallback = function () {
    const images = this.internal.collections[`${namespace}images`];
    const out = this.internal.write;
    let image;
    for (const i in images) {
      image = images[i];
      out(`/I${image.i}`, image.n, '0', 'R');
    }
  };
  const checkCompressValue = function (value) {
    if (value && typeof value === 'string') value = value.toUpperCase();
    return value in jsPDFAPI.image_compression
      ? value
      : jsPDFAPI.image_compression.NONE;
  };
  const getImages = function () {
    let images = this.internal.collections[`${namespace}images`];
    // first run, so initialise stuff
    if (!images) {
      this.internal.collections[`${namespace}images`] = images = {};
      this.internal.events.subscribe('putResources', putResourcesCallback);
      this.internal.events.subscribe('putXobjectDict', putXObjectsDictCallback);
    }

    return images;
  };
  const getImageIndex = function (images) {
    let imageIndex = 0;

    if (images) {
      // this is NOT the first time this method is ran on this instance of jsPDF object.
      imageIndex = Object.keys
        ? Object.keys(images).length
        : (function (o) {
            let i = 0;
            for (const e in o) {
              if (o.hasOwnProperty(e)) {
                i++;
              }
            }
            return i;
          })(images);
    }

    return imageIndex;
  };
  const notDefined = function (value) {
    return typeof value === 'undefined' || value === null;
  };
  const generateAliasFromData = function (data) {
    return typeof data === 'string' && jsPDFAPI.sHashCode(data);
  };
  const doesNotSupportImageType = function (type) {
    return supported_image_types.indexOf(type) === -1;
  };
  const processMethodNotEnabled = function (type) {
    return typeof jsPDFAPI[`process${type.toUpperCase()}`] !== 'function';
  };
  const isDOMElement = function (object) {
    return typeof object === 'object' && object.nodeType === 1;
  };
  const createDataURIFromElement = function (element, format, angle) {
    // if element is an image which uses data url definition, just return the dataurl
    if (element.nodeName === 'IMG' && element.hasAttribute('src')) {
      const src = `${element.getAttribute('src')}`;
      if (!angle && src.indexOf('data:image/') === 0) return src;

      // only if the user doesn't care about a format
      if (!format && /\.png(?:[?#].*)?$/i.test(src)) format = 'png';
    }

    if (element.nodeName === 'CANVAS') {
      var canvas = element;
    } else {
      var canvas = document.createElement('canvas');
      canvas.width = element.clientWidth || element.width;
      canvas.height = element.clientHeight || element.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw 'addImage requires canvas to be supported by browser.';
      }
      if (angle) {
        let x;
        let y;
        let b;
        let c;
        let s;
        let w;
        let h;
        const to_radians = Math.PI / 180;
        let angleInRadians;

        if (typeof angle === 'object') {
          x = angle.x;
          y = angle.y;
          b = angle.bg;
          angle = angle.angle;
        }
        angleInRadians = angle * to_radians;
        c = Math.abs(Math.cos(angleInRadians));
        s = Math.abs(Math.sin(angleInRadians));
        w = canvas.width;
        h = canvas.height;
        canvas.width = h * s + w * c;
        canvas.height = h * c + w * s;

        if (isNaN(x)) x = canvas.width / 2;
        if (isNaN(y)) y = canvas.height / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = b || 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angleInRadians);
        ctx.drawImage(element, -(w / 2), -(h / 2));
        ctx.rotate(-angleInRadians);
        ctx.translate(-x, -y);
        ctx.restore();
      } else {
        ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
      }
    }
    return canvas.toDataURL(
      `${format}`.toLowerCase() == 'png' ? 'image/png' : 'image/jpeg',
    );
  };
  const checkImagesForAlias = function (alias, images) {
    let cached_info;
    if (images) {
      for (const e in images) {
        if (alias === images[e].alias) {
          cached_info = images[e];
          break;
        }
      }
    }
    return cached_info;
  };
  const determineWidthAndHeight = function (w, h, info) {
    if (!w && !h) {
      w = -96;
      h = -96;
    }
    if (w < 0) {
      w = (-1 * info.w * 72) / w / this.internal.scaleFactor;
    }
    if (h < 0) {
      h = (-1 * info.h * 72) / h / this.internal.scaleFactor;
    }
    if (w === 0) {
      w = (h * info.w) / info.h;
    }
    if (h === 0) {
      h = (w * info.h) / info.w;
    }

    return [w, h];
  };
  const writeImageToPDF = function (x, y, w, h, info, index, images) {
    const dims = determineWidthAndHeight.call(this, w, h, info);
    const coord = this.internal.getCoordinateString;
    const vcoord = this.internal.getVerticalCoordinateString;

    w = dims[0];
    h = dims[1];

    images[index] = info;

    this.internal.write(
      'q',
      coord(w),
      '0 0',
      coord(h), // TODO: check if this should be shifted by vcoord
      coord(x),
      vcoord(y + h),
      `cm /I${info.i}`,
      'Do Q',
    );
  };

  /**
   * COLOR SPACES
   */
  jsPDFAPI.color_spaces = {
    DEVICE_RGB: 'DeviceRGB',
    DEVICE_GRAY: 'DeviceGray',
    DEVICE_CMYK: 'DeviceCMYK',
    CAL_GREY: 'CalGray',
    CAL_RGB: 'CalRGB',
    LAB: 'Lab',
    ICC_BASED: 'ICCBased',
    INDEXED: 'Indexed',
    PATTERN: 'Pattern',
    SEPARATION: 'Separation',
    DEVICE_N: 'DeviceN',
  };

  /**
   * DECODE METHODS
   */
  jsPDFAPI.decode = {
    DCT_DECODE: 'DCTDecode',
    FLATE_DECODE: 'FlateDecode',
    LZW_DECODE: 'LZWDecode',
    JPX_DECODE: 'JPXDecode',
    JBIG2_DECODE: 'JBIG2Decode',
    ASCII85_DECODE: 'ASCII85Decode',
    ASCII_HEX_DECODE: 'ASCIIHexDecode',
    RUN_LENGTH_DECODE: 'RunLengthDecode',
    CCITT_FAX_DECODE: 'CCITTFaxDecode',
  };

  /**
   * IMAGE COMPRESSION TYPES
   */
  jsPDFAPI.image_compression = {
    NONE: 'NONE',
    FAST: 'FAST',
    MEDIUM: 'MEDIUM',
    SLOW: 'SLOW',
  };

  jsPDFAPI.sHashCode = function (str) {
    return (
      Array.prototype.reduce &&
      str.split('').reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0)
    );
  };

  jsPDFAPI.isString = function (object) {
    return typeof object === 'string';
  };

  /**
   * Strips out and returns info from a valid base64 data URI
   * @param {String[dataURI]} a valid data URI of format 'data:[<MIME-type>][;base64],<data>'
   * @returns an Array containing the following
   * [0] the complete data URI
   * [1] <MIME-type>
   * [2] format - the second part of the mime-type i.e 'png' in 'image/png'
   * [4] <data>
   */
  jsPDFAPI.extractInfoFromBase64DataURI = function (dataURI) {
    return /^data:([\w]+?\/([\w]+?));base64,(.+?)$/g.exec(dataURI);
  };

  /**
   * Check to see if ArrayBuffer is supported
   */
  jsPDFAPI.supportsArrayBuffer = function () {
    return (
      typeof ArrayBuffer !== 'undefined' && typeof Uint8Array !== 'undefined'
    );
  };

  /**
   * Tests supplied object to determine if ArrayBuffer
   * @param {Object[object]}
   */
  jsPDFAPI.isArrayBuffer = function (object) {
    if (!this.supportsArrayBuffer()) return false;
    return object instanceof ArrayBuffer;
  };

  /**
   * Tests supplied object to determine if it implements the ArrayBufferView (TypedArray) interface
   * @param {Object[object]}
   */
  jsPDFAPI.isArrayBufferView = function (object) {
    if (!this.supportsArrayBuffer()) return false;
    if (typeof Uint32Array === 'undefined') return false;
    return (
      object instanceof Int8Array ||
      object instanceof Uint8Array ||
      (typeof Uint8ClampedArray !== 'undefined' &&
        object instanceof Uint8ClampedArray) ||
      object instanceof Int16Array ||
      object instanceof Uint16Array ||
      object instanceof Int32Array ||
      object instanceof Uint32Array ||
      object instanceof Float32Array ||
      object instanceof Float64Array
    );
  };

  /**
   * Exactly what it says on the tin
   */
  jsPDFAPI.binaryStringToUint8Array = function (binary_string) {
    /*
     * not sure how efficient this will be will bigger files. Is there a native method?
     */
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  };

  /**
   * @see this discussion
   * http://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
   *
   * As stated, i imagine the method below is highly inefficent for large files.
   *
   * Also of note from Mozilla,
   *
   * "However, this is slow and error-prone, due to the need for multiple conversions (especially if the binary data is not actually byte-format data, but, for example, 32-bit integers or floats)."
   *
   * https://developer.mozilla.org/en-US/Add-ons/Code_snippets/StringView
   *
   * Although i'm strugglig to see how StringView solves this issue? Doesn't appear to be a direct method for conversion?
   *
   * Async method using Blob and FileReader could be best, but i'm not sure how to fit it into the flow?
   */
  jsPDFAPI.arrayBufferToBinaryString = function (buffer) {
    /* if('TextDecoder' in window){
			var decoder = new TextDecoder('ascii');
			return decoder.decode(buffer);
		} */

    if (this.isArrayBuffer(buffer)) buffer = new Uint8Array(buffer);

    let binary_string = '';
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
      binary_string += String.fromCharCode(buffer[i]);
    }
    return binary_string;
    /*
     * Another solution is the method below - convert array buffer straight to base64 and then use atob
     */
    // return atob(this.arrayBufferToBase64(buffer));
  };

  /**
   * Converts an ArrayBuffer directly to base64
   *
   * Taken from here
   *
   * http://jsperf.com/encoding-xhr-image-data/31
   *
   * Need to test if this is a better solution for larger files
   *
   */
  jsPDFAPI.arrayBufferToBase64 = function (arrayBuffer) {
    let base64 = '';
    const encodings =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    const bytes = new Uint8Array(arrayBuffer);
    const { byteLength } = bytes;
    const byteRemainder = byteLength % 3;
    const mainLength = byteLength - byteRemainder;

    let a;
    let b;
    let c;
    let d;
    let chunk;

    // Main loop deals with bytes in chunks of 3
    for (let i = 0; i < mainLength; i += 3) {
      // Combine the three bytes into a single integer
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

      // Use bitmasks to extract 6-bit segments from the triplet
      a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
      b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
      c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
      d = chunk & 63; // 63       = 2^6 - 1

      // Convert the raw binary segments to the appropriate ASCII encoding
      base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
      chunk = bytes[mainLength];

      a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

      // Set the 4 least significant bits to zero
      b = (chunk & 3) << 4; // 3   = 2^2 - 1

      base64 += `${encodings[a] + encodings[b]}==`;
    } else if (byteRemainder == 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

      a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
      b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

      // Set the 2 least significant bits to zero
      c = (chunk & 15) << 2; // 15    = 2^4 - 1

      base64 += `${encodings[a] + encodings[b] + encodings[c]}=`;
    }

    return base64;
  };

  jsPDFAPI.createImageInfo = function (
    data,
    wd,
    ht,
    cs,
    bpc,
    f,
    imageIndex,
    alias,
    dp,
    trns,
    pal,
    smask,
    p,
  ) {
    const info = {
      alias,
      w: wd,
      h: ht,
      cs,
      bpc,
      i: imageIndex,
      data,
      // n: objectNumber will be added by putImage code
    };

    if (f) info.f = f;
    if (dp) info.dp = dp;
    if (trns) info.trns = trns;
    if (pal) info.pal = pal;
    if (smask) info.smask = smask;
    if (p) info.p = p; // predictor parameter for PNG compression

    return info;
  };

  jsPDFAPI.addImage = function (
    imageData,
    format,
    x,
    y,
    w,
    h,
    alias,
    compression,
    rotation,
  ) {
    if (typeof format !== 'string') {
      const tmp = h;
      h = w;
      w = y;
      y = x;
      x = format;
      format = tmp;
    }

    if (
      typeof imageData === 'object' &&
      !isDOMElement(imageData) &&
      'imageData' in imageData
    ) {
      const options = imageData;

      imageData = options.imageData;
      format = options.format || format;
      x = options.x || x || 0;
      y = options.y || y || 0;
      w = options.w || w;
      h = options.h || h;
      alias = options.alias || alias;
      compression = options.compression || compression;
      rotation = options.rotation || options.angle || rotation;
    }

    if (isNaN(x) || isNaN(y)) {
      console.error('jsPDF.addImage: Invalid coordinates', arguments);
      throw new Error('Invalid coordinates passed to jsPDF.addImage');
    }

    const images = getImages.call(this);
    let info;

    if (!(info = checkImagesForAlias(imageData, images))) {
      let dataAsBinaryString;

      if (isDOMElement(imageData))
        imageData = createDataURIFromElement(imageData, format, rotation);

      if (notDefined(alias)) alias = generateAliasFromData(imageData);

      if (!(info = checkImagesForAlias(alias, images))) {
        if (this.isString(imageData)) {
          const base64Info = this.extractInfoFromBase64DataURI(imageData);

          if (base64Info) {
            format = base64Info[2];
            imageData = atob(base64Info[3]); // convert to binary string
          } else if (
            imageData.charCodeAt(0) === 0x89 &&
            imageData.charCodeAt(1) === 0x50 &&
            imageData.charCodeAt(2) === 0x4e &&
            imageData.charCodeAt(3) === 0x47
          )
            format = 'png';
        }
        format = (format || 'JPEG').toLowerCase();

        if (doesNotSupportImageType(format))
          throw new Error(
            `addImage currently only supports formats ${supported_image_types}, not '${format}'`,
          );

        if (processMethodNotEnabled(format))
          throw new Error(
            `please ensure that the plugin for '${format}' support is added`,
          );

        /**
         * need to test if it's more efficient to convert all binary strings
         * to TypedArray - or should we just leave and process as string?
         */
        if (this.supportsArrayBuffer()) {
          // no need to convert if imageData is already uint8array
          if (!(imageData instanceof Uint8Array)) {
            dataAsBinaryString = imageData;
            imageData = this.binaryStringToUint8Array(imageData);
          }
        }

        info = this[`process${format.toUpperCase()}`](
          imageData,
          getImageIndex(images),
          alias,
          checkCompressValue(compression),
          dataAsBinaryString,
        );

        if (!info)
          throw new Error(
            'An unkwown error occurred whilst processing the image',
          );
      }
    }

    writeImageToPDF.call(this, x, y, w, h, info, info.i, images);

    return this;
  };

  /**
   * JPEG SUPPORT
   * */

  // takes a string imgData containing the raw bytes of
  // a jpeg image and returns [width, height]
  // Algorithm from: http://www.64lines.com/jpeg-width-height
  const getJpegSize = function (imgData) {
    let width;
    let height;
    let numcomponents;
    // Verify we have a valid jpeg header 0xff,0xd8,0xff,0xe0,?,?,'J','F','I','F',0x00
    if (
      !imgData.charCodeAt(0) === 0xff ||
      !imgData.charCodeAt(1) === 0xd8 ||
      !imgData.charCodeAt(2) === 0xff ||
      !imgData.charCodeAt(3) === 0xe0 ||
      !imgData.charCodeAt(6) === 'J'.charCodeAt(0) ||
      !imgData.charCodeAt(7) === 'F'.charCodeAt(0) ||
      !imgData.charCodeAt(8) === 'I'.charCodeAt(0) ||
      !imgData.charCodeAt(9) === 'F'.charCodeAt(0) ||
      !imgData.charCodeAt(10) === 0x00
    ) {
      throw new Error('getJpegSize requires a binary string jpeg file');
    }
    let blockLength = imgData.charCodeAt(4) * 256 + imgData.charCodeAt(5);
    let i = 4;
    const len = imgData.length;
    while (i < len) {
      i += blockLength;
      if (imgData.charCodeAt(i) !== 0xff) {
        throw new Error('getJpegSize could not find the size of the image');
      }
      if (
        imgData.charCodeAt(i + 1) === 0xc0 || // (SOF) Huffman  - Baseline DCT
        imgData.charCodeAt(i + 1) === 0xc1 || // (SOF) Huffman  - Extended sequential DCT
        imgData.charCodeAt(i + 1) === 0xc2 || // Progressive DCT (SOF2)
        imgData.charCodeAt(i + 1) === 0xc3 || // Spatial (sequential) lossless (SOF3)
        imgData.charCodeAt(i + 1) === 0xc4 || // Differential sequential DCT (SOF5)
        imgData.charCodeAt(i + 1) === 0xc5 || // Differential progressive DCT (SOF6)
        imgData.charCodeAt(i + 1) === 0xc6 || // Differential spatial (SOF7)
        imgData.charCodeAt(i + 1) === 0xc7
      ) {
        height = imgData.charCodeAt(i + 5) * 256 + imgData.charCodeAt(i + 6);
        width = imgData.charCodeAt(i + 7) * 256 + imgData.charCodeAt(i + 8);
        numcomponents = imgData.charCodeAt(i + 9);
        return [width, height, numcomponents];
      }
      i += 2;
      blockLength = imgData.charCodeAt(i) * 256 + imgData.charCodeAt(i + 1);
    }
  };
  const getJpegSizeFromBytes = function (data) {
    const hdr = (data[0] << 8) | data[1];

    if (hdr !== 0xffd8) throw new Error('Supplied data is not a JPEG');

    const len = data.length;
    let block = (data[4] << 8) + data[5];
    let pos = 4;
    let bytes;
    let width;
    let height;
    let numcomponents;

    while (pos < len) {
      pos += block;
      bytes = readBytes(data, pos);
      block = (bytes[2] << 8) + bytes[3];
      if (
        (bytes[1] === 0xc0 || bytes[1] === 0xc2) &&
        bytes[0] === 0xff &&
        block > 7
      ) {
        bytes = readBytes(data, pos + 5);
        width = (bytes[2] << 8) + bytes[3];
        height = (bytes[0] << 8) + bytes[1];
        numcomponents = bytes[4];
        return { width, height, numcomponents };
      }

      pos += 2;
    }

    throw new Error(
      'getJpegSizeFromBytes could not find the size of the image',
    );
  };
  var readBytes = function (data, offset) {
    return data.subarray(offset, offset + 5);
  };

  jsPDFAPI.processJPEG = function (
    data,
    index,
    alias,
    compression,
    dataAsBinaryString,
  ) {
    const colorSpace = this.color_spaces.DEVICE_RGB;
    const filter = this.decode.DCT_DECODE;
    const bpc = 8;
    let dims;

    if (this.isString(data)) {
      dims = getJpegSize(data);
      return this.createImageInfo(
        data,
        dims[0],
        dims[1],
        dims[3] == 1 ? this.color_spaces.DEVICE_GRAY : colorSpace,
        bpc,
        filter,
        index,
        alias,
      );
    }

    if (this.isArrayBuffer(data)) data = new Uint8Array(data);

    if (this.isArrayBufferView(data)) {
      dims = getJpegSizeFromBytes(data);

      // if we already have a stored binary string rep use that
      data = dataAsBinaryString || this.arrayBufferToBinaryString(data);

      return this.createImageInfo(
        data,
        dims.width,
        dims.height,
        dims.numcomponents == 1 ? this.color_spaces.DEVICE_GRAY : colorSpace,
        bpc,
        filter,
        index,
        alias,
      );
    }

    return null;
  };

  jsPDFAPI.processJPG =
    function (/* data, index, alias, compression, dataAsBinaryString */) {
      return this.processJPEG.apply(this, arguments);
    };
})(jsPDF.API);
