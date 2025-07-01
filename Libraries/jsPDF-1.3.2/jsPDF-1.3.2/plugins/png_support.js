/** @preserve
 *  ====================================================================
 * jsPDF PNG PlugIn
 * Copyright (c) 2014 James Robb, https://github.com/jamesbrobb
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
 * ====================================================================
 */

(function (jsPDFAPI) {
  /*
	 * @see http://www.w3.org/TR/PNG-Chunks.html
	 *
	 Color    Allowed      Interpretation
	 Type     Bit Depths

	   0       1,2,4,8,16  Each pixel is a grayscale sample.

	   2       8,16        Each pixel is an R,G,B triple.

	   3       1,2,4,8     Each pixel is a palette index;
	                       a PLTE chunk must appear.

	   4       8,16        Each pixel is a grayscale sample,
	                       followed by an alpha sample.

	   6       8,16        Each pixel is an R,G,B triple,
	                       followed by an alpha sample.
	*/

  /*
	 * PNG filter method types
	 *
	 * @see http://www.w3.org/TR/PNG-Filters.html
	 * @see http://www.libpng.org/pub/png/book/chapter09.html
	 *
	 * This is what the value 'Predictor' in decode params relates to
	 *
	 * 15 is "optimal prediction", which means the prediction algorithm can change from line to line.
	 * In that case, you actually have to read the first byte off each line for the prediction algorthim (which should be 0-4, corresponding to PDF 10-14) and select the appropriate unprediction algorithm based on that byte.
	 *
	   0       None
	   1       Sub
	   2       Up
	   3       Average
	   4       Paeth
	 */

  const doesNotHavePngJS = function () {
    return typeof PNG !== 'function' || typeof FlateStream !== 'function';
  };
  const canCompress = function (value) {
    return value !== jsPDFAPI.image_compression.NONE && hasCompressionJS();
  };
  var hasCompressionJS = function () {
    const inst = typeof Deflater === 'function';
    if (!inst) throw new Error('requires deflate.js for compression');
    return inst;
  };
  const compressBytes = function (
    bytes,
    lineLength,
    colorsPerPixel,
    compression,
  ) {
    let level = 5;
    let filter_method = filterUp;

    switch (compression) {
      case jsPDFAPI.image_compression.FAST:
        level = 3;
        filter_method = filterSub;
        break;

      case jsPDFAPI.image_compression.MEDIUM:
        level = 6;
        filter_method = filterAverage;
        break;

      case jsPDFAPI.image_compression.SLOW:
        level = 9;
        filter_method = filterPaeth; // uses to sum to choose best filter for each line
        break;
    }

    bytes = applyPngFilterMethod(
      bytes,
      lineLength,
      colorsPerPixel,
      filter_method,
    );

    const header = new Uint8Array(createZlibHeader(level));
    const checksum = adler32(bytes);

    const deflate = new Deflater(level);
    const a = deflate.append(bytes);
    const cBytes = deflate.flush();

    let len = header.length + a.length + cBytes.length;

    const cmpd = new Uint8Array(len + 4);
    cmpd.set(header);
    cmpd.set(a, header.length);
    cmpd.set(cBytes, header.length + a.length);

    cmpd[len++] = (checksum >>> 24) & 0xff;
    cmpd[len++] = (checksum >>> 16) & 0xff;
    cmpd[len++] = (checksum >>> 8) & 0xff;
    cmpd[len++] = checksum & 0xff;

    return jsPDFAPI.arrayBufferToBinaryString(cmpd);
  };
  var createZlibHeader = function (bytes, level) {
    /*
     * @see http://www.ietf.org/rfc/rfc1950.txt for zlib header
     */
    const cm = 8;
    const cinfo = Math.LOG2E * Math.log(0x8000) - 8;
    const cmf = (cinfo << 4) | cm;

    let hdr = cmf << 8;
    const flevel = Math.min(3, ((level - 1) & 0xff) >> 1);

    hdr |= flevel << 6;
    hdr |= 0; // FDICT
    hdr += 31 - (hdr % 31);

    return [cmf, hdr & 0xff & 0xff];
  };
  var adler32 = function (array, param) {
    const adler = 1;
    let s1 = adler & 0xffff;
    let s2 = (adler >>> 16) & 0xffff;
    let len = array.length;
    let tlen;
    let i = 0;

    while (len > 0) {
      tlen = len > param ? param : len;
      len -= tlen;
      do {
        s1 += array[i++];
        s2 += s1;
      } while (--tlen);

      s1 %= 65521;
      s2 %= 65521;
    }

    return ((s2 << 16) | s1) >>> 0;
  };
  var applyPngFilterMethod = function (
    bytes,
    lineLength,
    colorsPerPixel,
    filter_method,
  ) {
    const lines = bytes.length / lineLength;
    const result = new Uint8Array(bytes.length + lines);
    const filter_methods = getFilterMethods();
    let i = 0;
    let line;
    let prevLine;
    let offset;

    for (; i < lines; i++) {
      offset = i * lineLength;
      line = bytes.subarray(offset, offset + lineLength);

      if (filter_method) {
        result.set(filter_method(line, colorsPerPixel, prevLine), offset + i);
      } else {
        let j = 0;
        const len = filter_methods.length;
        const results = [];

        for (; j < len; j++)
          results[j] = filter_methods[j](line, colorsPerPixel, prevLine);

        const ind = getIndexOfSmallestSum(results.concat());

        result.set(results[ind], offset + i);
      }

      prevLine = line;
    }

    return result;
  };
  const filterNone = function (line, colorsPerPixel, prevLine) {
    /* var result = new Uint8Array(line.length + 1);
		result[0] = 0;
		result.set(line, 1); */

    const result = Array.apply([], line);
    result.unshift(0);

    return result;
  };
  var filterSub = function (line, colorsPerPixel, prevLine) {
    const result = [];
    let i = 0;
    const len = line.length;
    let left;

    result[0] = 1;

    for (; i < len; i++) {
      left = line[i - colorsPerPixel] || 0;
      result[i + 1] = (line[i] - left + 0x0100) & 0xff;
    }

    return result;
  };
  var filterUp = function (line, colorsPerPixel, prevLine) {
    const result = [];
    let i = 0;
    const len = line.length;
    let up;

    result[0] = 2;

    for (; i < len; i++) {
      up = (prevLine && prevLine[i]) || 0;
      result[i + 1] = (line[i] - up + 0x0100) & 0xff;
    }

    return result;
  };
  var filterAverage = function (line, colorsPerPixel, prevLine) {
    const result = [];
    let i = 0;
    const len = line.length;
    let left;
    let up;

    result[0] = 3;

    for (; i < len; i++) {
      left = line[i - colorsPerPixel] || 0;
      up = (prevLine && prevLine[i]) || 0;
      result[i + 1] = (line[i] + 0x0100 - ((left + up) >>> 1)) & 0xff;
    }

    return result;
  };
  var filterPaeth = function (line, colorsPerPixel, prevLine) {
    const result = [];
    let i = 0;
    const len = line.length;
    let left;
    let up;
    let upLeft;
    let paeth;

    result[0] = 4;

    for (; i < len; i++) {
      left = line[i - colorsPerPixel] || 0;
      up = (prevLine && prevLine[i]) || 0;
      upLeft = (prevLine && prevLine[i - colorsPerPixel]) || 0;
      paeth = paethPredictor(left, up, upLeft);
      result[i + 1] = (line[i] - paeth + 0x0100) & 0xff;
    }

    return result;
  };
  var paethPredictor = function (left, up, upLeft) {
    const p = left + up - upLeft;
    const pLeft = Math.abs(p - left);
    const pUp = Math.abs(p - up);
    const pUpLeft = Math.abs(p - upLeft);

    return pLeft <= pUp && pLeft <= pUpLeft
      ? left
      : pUp <= pUpLeft
        ? up
        : upLeft;
  };
  var getFilterMethods = function () {
    return [filterNone, filterSub, filterUp, filterAverage, filterPaeth];
  };
  var getIndexOfSmallestSum = function (arrays) {
    let i = 0;
    const len = arrays.length;
    let sum;
    let min;
    let ind;

    while (i < len) {
      sum = absSum(arrays[i].slice(1));

      if (sum < min || !min) {
        min = sum;
        ind = i;
      }

      i++;
    }

    return ind;
  };
  var absSum = function (array) {
    let i = 0;
    const len = array.length;
    let sum = 0;

    while (i < len) sum += Math.abs(array[i++]);

    return sum;
  };
  const getPredictorFromCompression = function (compression) {
    let predictor;
    switch (compression) {
      case jsPDFAPI.image_compression.FAST:
        predictor = 11;
        break;

      case jsPDFAPI.image_compression.MEDIUM:
        predictor = 13;
        break;

      case jsPDFAPI.image_compression.SLOW:
        predictor = 14;
        break;
    }
    return predictor;
  };
  const logImg = function (img) {
    console.log(`width: ${img.width}`);
    console.log(`height: ${img.height}`);
    console.log(`bits: ${img.bits}`);
    console.log(`colorType: ${img.colorType}`);
    console.log('transparency:');
    console.log(img.transparency);
    console.log('text:');
    console.log(img.text);
    console.log(`compressionMethod: ${img.compressionMethod}`);
    console.log(`filterMethod: ${img.filterMethod}`);
    console.log(`interlaceMethod: ${img.interlaceMethod}`);
    console.log('imgData:');
    console.log(img.imgData);
    console.log('palette:');
    console.log(img.palette);
    console.log(`colors: ${img.colors}`);
    console.log(`colorSpace: ${img.colorSpace}`);
    console.log(`pixelBitlength: ${img.pixelBitlength}`);
    console.log(`hasAlphaChannel: ${img.hasAlphaChannel}`);
  };

  jsPDFAPI.processPNG = function (
    imageData,
    imageIndex,
    alias,
    compression,
    dataAsBinaryString,
  ) {
    let colorSpace = this.color_spaces.DEVICE_RGB;
    let decode = this.decode.FLATE_DECODE;
    let bpc = 8;
    let img;
    let dp;
    let trns;
    let colors;
    let pal;
    let smask;

    /*	if(this.isString(imageData)) {

		} */

    if (this.isArrayBuffer(imageData)) imageData = new Uint8Array(imageData);

    if (this.isArrayBufferView(imageData)) {
      if (doesNotHavePngJS())
        throw new Error('PNG support requires png.js and zlib.js');

      img = new PNG(imageData);
      imageData = img.imgData;
      bpc = img.bits;
      colorSpace = img.colorSpace;
      colors = img.colors;

      // logImg(img);

      /*
       * colorType 6 - Each pixel is an R,G,B triple, followed by an alpha sample.
       *
       * colorType 4 - Each pixel is a grayscale sample, followed by an alpha sample.
       *
       * Extract alpha to create two separate images, using the alpha as a sMask
       */
      if ([4, 6].indexOf(img.colorType) !== -1) {
        /*
         * processes 8 bit RGBA and grayscale + alpha images
         */
        if (img.bits === 8) {
          var pixels =
            img.pixelBitlength == 32
              ? new Uint32Array(img.decodePixels().buffer)
              : img.pixelBitlength == 16
                ? new Uint16Array(img.decodePixels().buffer)
                : new Uint8Array(img.decodePixels().buffer);
          var len = pixels.length;
          var imgData = new Uint8Array(len * img.colors);
          var alphaData = new Uint8Array(len);
          const pDiff = img.pixelBitlength - img.bits;
          var i = 0;
          var n = 0;
          var pixel;
          let pbl;

          for (; i < len; i++) {
            pixel = pixels[i];
            pbl = 0;

            while (pbl < pDiff) {
              imgData[n++] = (pixel >>> pbl) & 0xff;
              pbl += img.bits;
            }

            alphaData[i] = (pixel >>> pbl) & 0xff;
          }
        }

        /*
         * processes 16 bit RGBA and grayscale + alpha images
         */
        if (img.bits === 16) {
          var pixels = new Uint32Array(img.decodePixels().buffer);
          var len = pixels.length;
          var imgData = new Uint8Array(
            len * (32 / img.pixelBitlength) * img.colors,
          );
          var alphaData = new Uint8Array(len * (32 / img.pixelBitlength));
          const hasColors = img.colors > 1;
          var i = 0;
          var n = 0;
          let a = 0;
          var pixel;

          while (i < len) {
            pixel = pixels[i++];

            imgData[n++] = (pixel >>> 0) & 0xff;

            if (hasColors) {
              imgData[n++] = (pixel >>> 16) & 0xff;

              pixel = pixels[i++];
              imgData[n++] = (pixel >>> 0) & 0xff;
            }

            alphaData[a++] = (pixel >>> 16) & 0xff;
          }

          bpc = 8;
        }

        if (canCompress(compression)) {
          imageData = compressBytes(
            imgData,
            img.width * img.colors,
            img.colors,
            compression,
          );
          smask = compressBytes(alphaData, img.width, 1, compression);
        } else {
          imageData = imgData;
          smask = alphaData;
          decode = null;
        }
      }

      /*
       * Indexed png. Each pixel is a palette index.
       */
      if (img.colorType === 3) {
        colorSpace = this.color_spaces.INDEXED;
        pal = img.palette;

        if (img.transparency.indexed) {
          const trans = img.transparency.indexed;

          let total = 0;
          var i = 0;
          var len = trans.length;

          for (; i < len; ++i) total += trans[i];

          total /= 255;

          /*
           * a single color is specified as 100% transparent (0),
           * so we set trns to use a /Mask with that index
           */
          if (total === len - 1 && trans.indexOf(0) !== -1) {
            trns = [trans.indexOf(0)];

            /*
             * there's more than one colour within the palette that specifies
             * a transparency value less than 255, so we unroll the pixels to create an image sMask
             */
          } else if (total !== len) {
            var pixels = img.decodePixels();
            var alphaData = new Uint8Array(pixels.length);
            var i = 0;
            var len = pixels.length;

            for (; i < len; i++) alphaData[i] = trans[pixels[i]];

            smask = compressBytes(alphaData, img.width, 1);
          }
        }
      }

      const predictor = getPredictorFromCompression(compression);

      if (decode === this.decode.FLATE_DECODE)
        dp = `/Predictor ${predictor} /Colors ${colors} /BitsPerComponent ${bpc} /Columns ${img.width}`;
      // remove 'Predictor' as it applies to the type of png filter applied to its IDAT - we only apply with compression
      else {
        dp = `/Colors ${colors} /BitsPerComponent ${bpc} /Columns ${img.width}`;
      }

      if (this.isArrayBuffer(imageData) || this.isArrayBufferView(imageData))
        imageData = this.arrayBufferToBinaryString(imageData);

      if ((smask && this.isArrayBuffer(smask)) || this.isArrayBufferView(smask))
        smask = this.arrayBufferToBinaryString(smask);

      return this.createImageInfo(
        imageData,
        img.width,
        img.height,
        colorSpace,
        bpc,
        decode,
        imageIndex,
        alias,
        dp,
        trns,
        pal,
        smask,
        predictor,
      );
    }

    throw new Error('Unsupported PNG image data, try using JPEG instead.');
  };
})(jsPDF.API);
