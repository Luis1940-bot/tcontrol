/**
 * jsPDF Context2D PlugIn Copyright (c) 2014 Steven Spungin (TwelveTone LLC) steven@twelvetone.tv
 *
 * Licensed under the MIT License. http://opensource.org/licenses/mit-license
 */

/**
 * This plugin mimics the HTML5 Canvas's context2d.
 *
 * The goal is to provide a way for current canvas implementations to print directly to a PDF.
 */

/**
 * TODO implement stroke opacity (refactor from fill() method )
 * TODO transform angle and radii parameters
 */

/**
 * require('jspdf.js'); require('lib/css_colors.js');
 */

(function (jsPDFAPI) {
  jsPDFAPI.events.push([
    'initialized', function () {
      this.context2d.pdf = this;
      this.context2d.internal.pdf = this;
      this.context2d.ctx = new context();
      this.context2d.ctxStack = [];
      this.context2d.path = [];
    },
  ]);

  jsPDFAPI.context2d = {
    pageWrapXEnabled: false,
    pageWrapYEnabled: false,
    pageWrapX: 9999999,
    pageWrapY: 9999999,
    ctx: new context(),
    f2(number) {
      return number.toFixed(2);
    },

    fillRect(x, y, w, h) {
      if (this._isFillTransparent()) {
        return;
      }
      x = this._wrapX(x);
      y = this._wrapY(y);

      const xRect = this._matrix_map_rect(this.ctx._transform, {
        x, y, w, h,
      });
      this.pdf.rect(xRect.x, xRect.y, xRect.w, xRect.h, 'f');
    },

    strokeRect(x, y, w, h) {
      if (this._isStrokeTransparent()) {
        return;
      }
      x = this._wrapX(x);
      y = this._wrapY(y);

      const xRect = this._matrix_map_rect(this.ctx._transform, {
        x, y, w, h,
      });
      this.pdf.rect(xRect.x, xRect.y, xRect.w, xRect.h, 's');
    },

    /**
         * We cannot clear PDF commands that were already written to PDF, so we use white instead. <br />
         * As a special case, read a special flag (ignoreClearRect) and do nothing if it is set.
         * This results in all calls to clearRect() to do nothing, and keep the canvas transparent.
         * This flag is stored in the save/restore context and is managed the same way as other drawing states.
         * @param x
         * @param y
         * @param w
         * @param h
         */
    clearRect(x, y, w, h) {
      if (this.ctx.ignoreClearRect) {
        return;
      }

      x = this._wrapX(x);
      y = this._wrapY(y);

      const xRect = this._matrix_map_rect(this.ctx._transform, {
        x, y, w, h,
      });
      this.save();
      this.setFillStyle('#ffffff');
      // TODO This is hack to fill with white.
      this.pdf.rect(xRect.x, xRect.y, xRect.w, xRect.h, 'f');
      this.restore();
    },

    save() {
      this.ctx._fontSize = this.pdf.internal.getFontSize();
      const ctx = new context();
      ctx.copy(this.ctx);
      this.ctxStack.push(this.ctx);
      this.ctx = ctx;
    },

    restore() {
      this.ctx = this.ctxStack.pop();
      this.setFillStyle(this.ctx.fillStyle);
      this.setStrokeStyle(this.ctx.strokeStyle);
      this.setFont(this.ctx.font);
      this.pdf.setFontSize(this.ctx._fontSize);
      this.setLineCap(this.ctx.lineCap);
      this.setLineWidth(this.ctx.lineWidth);
      this.setLineJoin(this.ctx.lineJoin);
    },

    rect(x, y, w, h) {
      this.moveTo(x, y);
      this.lineTo(x + w, y);
      this.lineTo(x + w, y + h);
      this.lineTo(x, y + h);
      this.lineTo(x, y); // TODO not needed
      this.closePath();
    },

    beginPath() {
      this.path = [];
    },

    closePath() {
      this.path.push({
        type: 'close',
      });
    },

    _getRgba(style) {
      // get the decimal values of r, g, and b;
      const rgba = {};

      if (this.internal.rxTransparent.test(style)) {
        rgba.r = 0;
        rgba.g = 0;
        rgba.b = 0;
        rgba.a = 0;
      } else {
        let m = this.internal.rxRgb.exec(style);
        if (m != null) {
          rgba.r = parseInt(m[1]);
          rgba.g = parseInt(m[2]);
          rgba.b = parseInt(m[3]);
          rgba.a = 1;
        } else {
          m = this.internal.rxRgba.exec(style);
          if (m != null) {
            rgba.r = parseInt(m[1]);
            rgba.g = parseInt(m[2]);
            rgba.b = parseInt(m[3]);
            rgba.a = parseFloat(m[4]);
          } else {
            rgba.a = 1;
            if (style.charAt(0) != '#') {
              style = CssColors.colorNameToHex(style);
              if (!style) {
                style = '#000000';
              }
            } else {
            }

            if (style.length === 4) {
              rgba.r = style.substring(1, 2);
              rgba.r += r;
              rgba.g = style.substring(2, 3);
              rgba.g += g;
              rgba.b = style.substring(3, 4);
              rgba.b += b;
            } else {
              rgba.r = style.substring(1, 3);
              rgba.g = style.substring(3, 5);
              rgba.b = style.substring(5, 7);
            }
            rgba.r = parseInt(rgba.r, 16);
            rgba.g = parseInt(rgba.g, 16);
            rgba.b = parseInt(rgba.b, 16);
          }
        }
      }
      rgba.style = style;
      return rgba;
    },

    setFillStyle(style) {
      // get the decimal values of r, g, and b;
      let r; let g; let b; let
        a;

      if (this.internal.rxTransparent.test(style)) {
        r = 0;
        g = 0;
        b = 0;
        a = 0;
      } else {
        let m = this.internal.rxRgb.exec(style);
        if (m != null) {
          r = parseInt(m[1]);
          g = parseInt(m[2]);
          b = parseInt(m[3]);
          a = 1;
        } else {
          m = this.internal.rxRgba.exec(style);
          if (m != null) {
            r = parseInt(m[1]);
            g = parseInt(m[2]);
            b = parseInt(m[3]);
            a = parseFloat(m[4]);
          } else {
            a = 1;
            if (style.charAt(0) != '#') {
              style = CssColors.colorNameToHex(style);
              if (!style) {
                style = '#000000';
              }
            } else {
            }

            if (style.length === 4) {
              r = style.substring(1, 2);
              r += r;
              g = style.substring(2, 3);
              g += g;
              b = style.substring(3, 4);
              b += b;
            } else {
              r = style.substring(1, 3);
              g = style.substring(3, 5);
              b = style.substring(5, 7);
            }
            r = parseInt(r, 16);
            g = parseInt(g, 16);
            b = parseInt(b, 16);
          }
        }
      }

      this.ctx.fillStyle = style;
      this.ctx._isFillTransparent = (a == 0);
      this.ctx._fillOpacity = a;

      this.pdf.setFillColor(r, g, b, {
        a,
      });
      this.pdf.setTextColor(r, g, b, {
        a,
      });
    },

    setStrokeStyle(style) {
      const rgba = this._getRgba(style);

      this.ctx.strokeStyle = rgba.style;
      this.ctx._isStrokeTransparent = (rgba.a == 0);
      this.ctx._strokeOpacity = rgba.a;

      // TODO jsPDF to handle rgba
      if (rgba.a === 0) {
        this.pdf.setDrawColor(255, 255, 255);
      } else if (rgba.a === 1) {
        this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b);
      } else {
        // this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b, {a: rgba.a});
        this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b);
      }
    },

    fillText(text, x, y, maxWidth) {
      if (this._isFillTransparent()) {
        return;
      }
      x = this._wrapX(x);
      y = this._wrapY(y);

      const xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
      x = xpt[0];
      y = xpt[1];
      const rads = this._matrix_rotation(this.ctx._transform);
      const degs = rads * 57.2958;

      // TODO only push the clip if it has not been applied to the current PDF context
      if (this.ctx._clip_path.length > 0) {
        var lines;
        if (window.outIntercept) {
          lines = window.outIntercept.type === 'group' ? window.outIntercept.stream : window.outIntercept;
        } else {
          lines = this.pdf.internal.pages[1];
        }
        lines.push('q');
        const origPath = this.path;
        this.path = this.ctx._clip_path;
        this.ctx._clip_path = [];
        this._fill(null, true);
        this.ctx._clip_path = this.path;
        this.path = origPath;
      }

      this.pdf.text(text, x, this._getBaseline(y), null, degs);

      if (this.ctx._clip_path.length > 0) {
        lines.push('Q');
      }
    },

    strokeText(text, x, y, maxWidth) {
      if (this._isStrokeTransparent()) {
        return;
      }
      x = this._wrapX(x);
      y = this._wrapY(y);

      const xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
      x = xpt[0];
      y = xpt[1];
      const rads = this._matrix_rotation(this.ctx._transform);
      const degs = rads * 57.2958;

      // TODO only push the clip if it has not been applied to the current PDF context
      if (this.ctx._clip_path.length > 0) {
        var lines;
        if (window.outIntercept) {
          lines = window.outIntercept.type === 'group' ? window.outIntercept.stream : window.outIntercept;
        } else {
          lines = this.pdf.internal.pages[1];
        }
        lines.push('q');
        const origPath = this.path;
        this.path = this.ctx._clip_path;
        this.ctx._clip_path = [];
        this._fill(null, true);
        this.ctx._clip_path = this.path;
        this.path = origPath;
      }

      this.pdf.text(text, x, this._getBaseline(y), {
        stroke: true,
      }, degs);

      if (this.ctx._clip_path.length > 0) {
        lines.push('Q');
      }
    },

    setFont(font) {
      this.ctx.font = font;

      // var rx = /\s*(\w+)\s+(\w+)\s+(\w+)\s+([\d\.]+)(px|pt|em)\s+["']?(\w+)['"]?/;
      var rx = /\s*(\w+)\s+(\w+)\s+(\w+)\s+([\d\.]+)(px|pt|em)\s+(.*)?/;
      m = rx.exec(font);
      if (m != null) {
        const fontStyle = m[1];
        const fontVariant = m[2];
        const fontWeight = m[3];
        var fontSize = m[4];
        var fontSizeUnit = m[5];
        const fontFamily = m[6];

        if (fontSizeUnit === 'px') {
          fontSize = Math.floor(parseFloat(fontSize));
          // fontSize = fontSize * 1.25;
        } else if (fontSizeUnit === 'em') {
          fontSize = Math.floor(parseFloat(fontSize) * this.pdf.getFontSize());
        } else {
          fontSize = Math.floor(parseFloat(fontSize));
        }

        this.pdf.setFontSize(fontSize);

        if (fontWeight === 'bold' || fontWeight === '700') {
          this.pdf.setFontStyle('bold');
        } else if (fontStyle === 'italic') {
          this.pdf.setFontStyle('italic');
        } else {
          this.pdf.setFontStyle('normal');
        }

        var name = fontFamily;
        const parts = name.toLowerCase().split(/\s*,\s*/);
        let jsPdfFontName;

        if (parts.indexOf('arial') != -1) {
          jsPdfFontName = 'Arial';
        } else if (parts.indexOf('verdana') != -1) {
          jsPdfFontName = 'Verdana';
        } else if (parts.indexOf('helvetica') != -1) {
          jsPdfFontName = 'Helvetica';
        } else if (parts.indexOf('sans-serif') != -1) {
          jsPdfFontName = 'sans-serif';
        } else if (parts.indexOf('fixed') != -1) {
          jsPdfFontName = 'Fixed';
        } else if (parts.indexOf('monospace') != -1) {
          jsPdfFontName = 'Monospace';
        } else if (parts.indexOf('terminal') != -1) {
          jsPdfFontName = 'Terminal';
        } else if (parts.indexOf('courier') != -1) {
          jsPdfFontName = 'Courier';
        } else if (parts.indexOf('times') != -1) {
          jsPdfFontName = 'Times';
        } else if (parts.indexOf('cursive') != -1) {
          jsPdfFontName = 'Cursive';
        } else if (parts.indexOf('fantasy') != -1) {
          jsPdfFontName = 'Fantasy';
        } else if (parts.indexOf('serif') != -1) {
          jsPdfFontName = 'Serif';
        } else {
          jsPdfFontName = 'Serif';
        }

        // TODO check more cases
        var style;
        if (fontWeight === 'bold') {
          style = 'bold';
        } else {
          style = 'normal';
        }

        this.pdf.setFont(jsPdfFontName, style);
      } else {
        var rx = /(\d+)(pt|px|em)\s+(\w+)\s*(\w+)?/;
        var m = rx.exec(font);
        if (m != null) {
          let size = m[1];
          const unit = m[2];
          var name = m[3];
          var style = m[4];
          if (!style) {
            style = 'normal';
          }
          if (fontSizeUnit === 'em') {
            size = Math.floor(parseFloat(fontSize) * this.pdf.getFontSize());
          } else {
            size = Math.floor(parseFloat(size));
          }
          this.pdf.setFontSize(size);
          this.pdf.setFont(name, style);
        }
      }
    },

    setTextBaseline(baseline) {
      this.ctx.textBaseline = baseline;
    },

    getTextBaseline() {
      return this.ctx.textBaseline;
    },

    // TODO implement textAlign
    setTextAlign(align) {
      this.ctx.textAlign = align;
    },

    getTextAlign() {
      return this.ctx.textAlign;
    },

    setLineWidth(width) {
      this.ctx.lineWidth = width;
      this.pdf.setLineWidth(width);
    },

    setLineCap(style) {
      this.ctx.lineCap = style;
      this.pdf.setLineCap(style);
    },

    setLineJoin(style) {
      this.ctx.lineJoin = style;
      this.pdf.setLineJoin(style);
    },

    moveTo(x, y) {
      x = this._wrapX(x);
      y = this._wrapY(y);

      const xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
      x = xpt[0];
      y = xpt[1];

      const obj = {
        type: 'mt',
        x,
        y,
      };
      this.path.push(obj);
    },

    _wrapX(x) {
      if (this.pageWrapXEnabled) {
        return x % this.pageWrapX;
      }
      return x;
    },

    _wrapY(y) {
      if (this.pageWrapYEnabled) {
        this._gotoPage(this._page(y));
        return (y - this.lastBreak) % this.pageWrapY;
      }
      return y;
    },

    transform(a, b, c, d, e, f) {
      // TODO apply to current transformation instead of replacing
      this.ctx._transform = [a, b, c, d, e, f];
    },

    setTransform(a, b, c, d, e, f) {
      this.ctx._transform = [a, b, c, d, e, f];
    },

    _getTransform() {
      return this.ctx._transform;
    },

    lastBreak: 0,
    // Y Position of page breaks.
    pageBreaks: [],
    // returns: One-based Page Number
    // Should only be used if pageWrapYEnabled is true
    _page(y) {
      if (this.pageWrapYEnabled) {
        this.lastBreak = 0;
        let manualBreaks = 0;
        let autoBreaks = 0;
        for (let i = 0; i < this.pageBreaks.length; i++) {
          if (y >= this.pageBreaks[i]) {
            manualBreaks++;
            if (this.lastBreak === 0) {
              autoBreaks++;
            }
            const spaceBetweenLastBreak = this.pageBreaks[i] - this.lastBreak;
            this.lastBreak = this.pageBreaks[i];
            var pagesSinceLastBreak = Math.floor(spaceBetweenLastBreak / this.pageWrapY);
            autoBreaks += pagesSinceLastBreak;
          }
        }
        if (this.lastBreak === 0) {
          var pagesSinceLastBreak = Math.floor(y / this.pageWrapY) + 1;
          autoBreaks += pagesSinceLastBreak;
        }
        return autoBreaks + manualBreaks;
      }
      return this.pdf.internal.getCurrentPageInfo().pageNumber;
    },

    _gotoPage(pageOneBased) {
      // This is a stub to be overriden if needed
    },

    lineTo(x, y) {
      x = this._wrapX(x);
      y = this._wrapY(y);

      const xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
      x = xpt[0];
      y = xpt[1];

      const obj = {
        type: 'lt',
        x,
        y,
      };
      this.path.push(obj);
    },

    bezierCurveTo(x1, y1, x2, y2, x, y) {
      x1 = this._wrapX(x1);
      y1 = this._wrapY(y1);
      x2 = this._wrapX(x2);
      y2 = this._wrapY(y2);
      x = this._wrapX(x);
      y = this._wrapY(y);

      let xpt;
      xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
      x = xpt[0];
      y = xpt[1];
      xpt = this._matrix_map_point(this.ctx._transform, [x1, y1]);
      x1 = xpt[0];
      y1 = xpt[1];
      xpt = this._matrix_map_point(this.ctx._transform, [x2, y2]);
      x2 = xpt[0];
      y2 = xpt[1];

      const obj = {
        type: 'bct',
        x1,
        y1,
        x2,
        y2,
        x,
        y,
      };
      this.path.push(obj);
    },

    quadraticCurveTo(x1, y1, x, y) {
      x1 = this._wrapX(x1);
      y1 = this._wrapY(y1);
      x = this._wrapX(x);
      y = this._wrapY(y);

      let xpt;
      xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
      x = xpt[0];
      y = xpt[1];
      xpt = this._matrix_map_point(this.ctx._transform, [x1, y1]);
      x1 = xpt[0];
      y1 = xpt[1];

      const obj = {
        type: 'qct',
        x1,
        y1,
        x,
        y,
      };
      this.path.push(obj);
    },

    arc(x, y, radius, startAngle, endAngle, anticlockwise) {
      x = this._wrapX(x);
      y = this._wrapY(y);

      const xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
      x = xpt[0];
      y = xpt[1];

      const obj = {
        type: 'arc',
        x,
        y,
        radius,
        startAngle,
        endAngle,
        anticlockwise,
      };
      this.path.push(obj);
    },

    drawImage(img, x, y, w, h, x2, y2, w2, h2) {
      if (x2 !== undefined) {
        x = x2;
        y = y2;
        w = w2;
        h = h2;
      }
      x = this._wrapX(x);
      y = this._wrapY(y);

      const xRect = this._matrix_map_rect(this.ctx._transform, {
        x, y, w, h,
      });
      const xRect2 = this._matrix_map_rect(this.ctx._transform, {
        x: x2, y: y2, w: w2, h: h2,
      });

      // TODO implement source clipping and image scaling
      let format;
      const rx = /data:image\/(\w+).*/i;
      const m = rx.exec(img);
      if (m != null) {
        format = m[1];
      } else {
        // format = "jpeg";
        format = 'png';
      }

      this.pdf.addImage(img, format, xRect.x, xRect.y, xRect.w, xRect.h);
    },

    /**
         * Multiply the first matrix by the second
         * @param m1
         * @param m2
         * @returns {*[]}
         * @private
         */
    _matrix_multiply(m2, m1) {
      let sx = m1[0];
      let shy = m1[1];
      let shx = m1[2];
      let sy = m1[3];
      let tx = m1[4];
      let ty = m1[5];

      const t0 = sx * m2[0] + shy * m2[2];
      const t2 = shx * m2[0] + sy * m2[2];
      const t4 = tx * m2[0] + ty * m2[2] + m2[4];
      shy = sx * m2[1] + shy * m2[3];
      sy = shx * m2[1] + sy * m2[3];
      ty = tx * m2[1] + ty * m2[3] + m2[5];
      sx = t0;
      shx = t2;
      tx = t4;

      return [sx, shy, shx, sy, tx, ty];
    },

    _matrix_rotation(m) {
      return Math.atan2(m[2], m[0]);
    },

    _matrix_decompose(matrix) {
      let a = matrix[0];
      let b = matrix[1];
      let c = matrix[2];
      let d = matrix[3];

      let scaleX = Math.sqrt(a * a + b * b);
      a /= scaleX;
      b /= scaleX;

      let shear = a * c + b * d;
      c -= a * shear;
      d -= b * shear;

      const scaleY = Math.sqrt(c * c + d * d);
      c /= scaleY;
      d /= scaleY;
      shear /= scaleY;

      if (a * d < b * c) {
        a = -a;
        b = -b;
        shear = -shear;
        scaleX = -scaleX;
      }

      return {
        scale: [scaleX, 0, 0, scaleY, 0, 0],
        translate: [1, 0, 0, 1, matrix[4], matrix[5]],
        rotate: [a, b, -b, a, 0, 0],
        skew: [1, 0, shear, 1, 0, 0],
      };
    },

    _matrix_map_point(m1, pt) {
      const sx = m1[0];
      const shy = m1[1];
      const shx = m1[2];
      const sy = m1[3];
      const tx = m1[4];
      const ty = m1[5];

      const px = pt[0];
      const py = pt[1];

      const x = px * sx + py * shx + tx;
      const y = px * shy + py * sy + ty;
      return [x, y];
    },

    _matrix_map_point_obj(m1, pt) {
      const xpt = this._matrix_map_point(m1, [pt.x, pt.y]);
      return { x: xpt[0], y: xpt[1] };
    },

    _matrix_map_rect(m1, rect) {
      const p1 = this._matrix_map_point(m1, [rect.x, rect.y]);
      const p2 = this._matrix_map_point(m1, [rect.x + rect.w, rect.y + rect.h]);
      return {
        x: p1[0], y: p1[1], w: p2[0] - p1[0], h: p2[1] - p1[1],
      };
    },

    _matrix_is_identity(m1) {
      if (m1[0] != 1) {
        return false;
      }
      if (m1[1] != 0) {
        return false;
      }
      if (m1[2] != 0) {
        return false;
      }
      if (m1[3] != 1) {
        return false;
      }
      if (m1[4] != 0) {
        return false;
      }
      if (m1[5] != 0) {
        return false;
      }
      return true;
    },

    rotate(angle) {
      const matrix = [Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle), 0.0, 0.0];
      this.ctx._transform = this._matrix_multiply(this.ctx._transform, matrix);
    },

    scale(sx, sy) {
      const matrix = [sx, 0.0, 0.0, sy, 0.0, 0.0];
      this.ctx._transform = this._matrix_multiply(this.ctx._transform, matrix);
    },

    translate(x, y) {
      const matrix = [1.0, 0.0, 0.0, 1.0, x, y];
      this.ctx._transform = this._matrix_multiply(this.ctx._transform, matrix);
    },

    stroke() {
      if (this.ctx._clip_path.length > 0) {
        let lines;
        if (window.outIntercept) {
          lines = window.outIntercept.type === 'group' ? window.outIntercept.stream : window.outIntercept;
        } else {
          lines = this.pdf.internal.pages[1];
        }
        lines.push('q');

        const origPath = this.path;
        this.path = this.ctx._clip_path;
        this.ctx._clip_path = [];
        this._stroke(true);

        this.ctx._clip_path = this.path;
        this.path = origPath;
        this._stroke(false);

        lines.push('Q');
      } else {
        this._stroke(false);
      }
    },

    _stroke(isClip) {
      if (!isClip && this._isStrokeTransparent()) {
        return;
      }

      // TODO opacity

      const moves = [];
      let closed = false;

      const xPath = this.path;

      for (var i = 0; i < xPath.length; i++) {
        const pt = xPath[i];
        switch (pt.type) {
          case 'mt':
            moves.push({ start: pt, deltas: [], abs: [] });
            break;
          case 'lt':
            var delta = [
              pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y,
            ];
            moves[moves.length - 1].deltas.push(delta);
            moves[moves.length - 1].abs.push(pt);
            break;
          case 'bct':
            var delta = [
              pt.x1 - xPath[i - 1].x, pt.y1 - xPath[i - 1].y,
              pt.x2 - xPath[i - 1].x, pt.y2 - xPath[i - 1].y,
              pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y,
            ];
            moves[moves.length - 1].deltas.push(delta);
            break;
          case 'qct':
            // convert to bezier
            var x1 = xPath[i - 1].x + 2.0 / 3.0 * (pt.x1 - xPath[i - 1].x);
            var y1 = xPath[i - 1].y + 2.0 / 3.0 * (pt.y1 - xPath[i - 1].y);
            var x2 = pt.x + 2.0 / 3.0 * (pt.x1 - pt.x);
            var y2 = pt.y + 2.0 / 3.0 * (pt.y1 - pt.y);
            var x3 = pt.x;
            var y3 = pt.y;
            var delta = [
              x1 - xPath[i - 1].x, y1 - xPath[i - 1].y,
              x2 - xPath[i - 1].x, y2 - xPath[i - 1].y,
              x3 - xPath[i - 1].x, y3 - xPath[i - 1].y,
            ];
            moves[moves.length - 1].deltas.push(delta);
            break;
          case 'arc':
            moves[moves.length - 1].arc = true;
            moves[moves.length - 1].abs.push(pt);
            break;
          case 'close':
            closed = true;
            break;
        }
      }

      for (var i = 0; i < moves.length; i++) {
        var style;
        if (i == moves.length - 1) {
          style = 's';
        } else {
          style = null;
        }
        if (moves[i].arc) {
          const arcs = moves[i].abs;
          for (let ii = 0; ii < arcs.length; ii++) {
            const arc = arcs[ii];
            const start = arc.startAngle * 360 / (2 * Math.PI);
            const end = arc.endAngle * 360 / (2 * Math.PI);
            var { x } = arc;
            var { y } = arc;
            this.internal.arc2(this, x, y, arc.radius, start, end, arc.anticlockwise, style, isClip);
          }
        } else {
          var { x } = moves[i].start;
          var { y } = moves[i].start;
          if (!isClip) {
            this.pdf.lines(moves[i].deltas, x, y, null, style);
          } else {
            this.pdf.lines(moves[i].deltas, x, y, null, null);
            this.pdf.clip_fixed();
          }
        }
      }
    },

    _isFillTransparent() {
      return this.ctx._isFillTransparent || this.globalAlpha == 0;
    },

    _isStrokeTransparent() {
      return this.ctx._isStrokeTransparent || this.globalAlpha == 0;
    },

    fill(fillRule) { // evenodd or nonzero (default)
      if (this.ctx._clip_path.length > 0) {
        let lines;
        if (window.outIntercept) {
          lines = window.outIntercept.type === 'group' ? window.outIntercept.stream : window.outIntercept;
        } else {
          lines = this.pdf.internal.pages[1];
        }
        lines.push('q');

        const origPath = this.path;
        this.path = this.ctx._clip_path;
        this.ctx._clip_path = [];
        this._fill(fillRule, true);

        this.ctx._clip_path = this.path;
        this.path = origPath;
        this._fill(fillRule, false);

        lines.push('Q');
      } else {
        this._fill(fillRule, false);
      }
    },

    _fill(fillRule, isClip) {
      if (this._isFillTransparent()) {
        return;
      }
      const v2Support = typeof this.pdf.internal.newObject2 === 'function';

      let lines;
      if (window.outIntercept) {
        lines = window.outIntercept.type === 'group' ? window.outIntercept.stream : window.outIntercept;
      } else {
        lines = this.pdf.internal.pages[1];
      }

      // if (this.ctx._clip_path.length > 0) {
      //     lines.push('q');
      //     var oldPath = this.path;
      //     this.path = this.ctx._clip_path;
      //     this.ctx._clip_path = [];
      //     this._fill(fillRule, true);
      //     this.ctx._clip_path = this.path;
      //     this.path = oldPath;
      // }

      const moves = [];
      const outInterceptOld = window.outIntercept;

      if (v2Support) {
        // Blend and Mask
        switch (this.ctx.globalCompositeOperation) {
          case 'normal':
          case 'source-over':
            break;
          case 'destination-in':
          case 'destination-out':
            // TODO this need to be added to the current group or page
            // define a mask stream
            var obj = this.pdf.internal.newStreamObject();

            // define a mask state
            var obj2 = this.pdf.internal.newObject2();
            obj2.push('<</Type /ExtGState');
            obj2.push(`/SMask <</S /Alpha /G ${obj.objId} 0 R>>`); // /S /Luminosity will need to define color space
            obj2.push('>>');

            // add mask to page resources
            var gsName = `MASK${obj2.objId}`;
            this.pdf.internal.addGraphicsState(gsName, obj2.objId);

            var instruction = `/${gsName} gs`;
            // add mask to page, group, or stream
            lines.splice(0, 0, 'q');
            lines.splice(1, 0, instruction);
            lines.push('Q');

            window.outIntercept = obj;
            break;
          default:
            var dictionaryEntry = `/${this.pdf.internal.blendModeMap[this.ctx.globalCompositeOperation.toUpperCase()]}`;
            if (dictionaryEntry) {
              this.pdf.internal.out(`${dictionaryEntry} gs`);
            }
            break;
        }
      }

      let alpha = this.ctx.globalAlpha;
      if (this.ctx._fillOpacity < 1) {
        // TODO combine this with global opacity
        alpha = this.ctx._fillOpacity;
      }

      // TODO check for an opacity graphics state that was already created
      // TODO do not set opacity if current value is already active
      if (v2Support) {
        const objOpac = this.pdf.internal.newObject2();
        objOpac.push('<</Type /ExtGState');
        // objOpac.push(this.ctx.globalAlpha + " CA"); // Stroke
        // objOpac.push(this.ctx.globalAlpha + " ca"); // Not Stroke
        objOpac.push(`/CA ${alpha}`); // Stroke
        objOpac.push(`/ca ${alpha}`); // Not Stroke
        objOpac.push('>>');
        var gsName = `GS_O_${objOpac.objId}`;
        this.pdf.internal.addGraphicsState(gsName, objOpac.objId);
        this.pdf.internal.out(`/${gsName} gs`);
      }

      const xPath = this.path;

      for (var i = 0; i < xPath.length; i++) {
        const pt = xPath[i];
        switch (pt.type) {
          case 'mt':
            moves.push({ start: pt, deltas: [], abs: [] });
            break;
          case 'lt':
            var delta = [
              pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y,
            ];
            moves[moves.length - 1].deltas.push(delta);
            moves[moves.length - 1].abs.push(pt);
            break;
          case 'bct':
            var delta = [
              pt.x1 - xPath[i - 1].x, pt.y1 - xPath[i - 1].y,
              pt.x2 - xPath[i - 1].x, pt.y2 - xPath[i - 1].y,
              pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y,
            ];
            moves[moves.length - 1].deltas.push(delta);
            break;
          case 'qct':
            // convert to bezier
            var x1 = xPath[i - 1].x + 2.0 / 3.0 * (pt.x1 - xPath[i - 1].x);
            var y1 = xPath[i - 1].y + 2.0 / 3.0 * (pt.y1 - xPath[i - 1].y);
            var x2 = pt.x + 2.0 / 3.0 * (pt.x1 - pt.x);
            var y2 = pt.y + 2.0 / 3.0 * (pt.y1 - pt.y);
            var x3 = pt.x;
            var y3 = pt.y;
            var delta = [
              x1 - xPath[i - 1].x, y1 - xPath[i - 1].y,
              x2 - xPath[i - 1].x, y2 - xPath[i - 1].y,
              x3 - xPath[i - 1].x, y3 - xPath[i - 1].y,
            ];
            moves[moves.length - 1].deltas.push(delta);
            break;
          case 'arc':
            // TODO this was hack to avoid out of bounds issue
            if (moves.length == 0) {
              moves.push({ start: { x: 0, y: 0 }, deltas: [], abs: [] });
            }
            moves[moves.length - 1].arc = true;
            moves[moves.length - 1].abs.push(pt);
            break;
          case 'close':
            // moves[moves.length - 1].deltas.push('close');
            break;
        }
      }

      for (var i = 0; i < moves.length; i++) {
        var style;
        if (i == moves.length - 1) {
          style = 'f';
          if (fillRule === 'evenodd') {
            style += '*';
          }
        } else {
          style = null;
        }

        if (moves[i].arc) {
          const arcs = moves[i].abs;
          for (let ii = 0; ii < arcs.length; ii++) {
            const arc = arcs[ii];
            // TODO lines deltas were getting in here
            if (typeof arc.startAngle !== 'undefined') {
              const start = arc.startAngle * 360 / (2 * Math.PI);
              const end = arc.endAngle * 360 / (2 * Math.PI);
              // Add the current position (last move to)
              // var x = moves[i].start.x + arc.x;
              // var y = moves[i].start.y + arc.y;
              var { x } = arc;
              var { y } = arc;
              if (ii == 0) {
                this.internal.move2(this, x, y);
              }
              this.internal.arc2(this, x, y, arc.radius, start, end, arc.anticlockwise, null, isClip);
            } else {
              this.internal.line2(c2d, arc.x, arc.y);
            }
          }

          // extra move bug causing close to resolve to wrong point
          var { x } = moves[i].start;
          var { y } = moves[i].start;
          this.internal.line2(c2d, x, y);

          this.pdf.internal.out('h');
          this.pdf.internal.out('f');
        } else {
          var { x } = moves[i].start;
          var { y } = moves[i].start;
          if (!isClip) {
            this.pdf.lines(moves[i].deltas, x, y, null, style);
          } else {
            this.pdf.lines(moves[i].deltas, x, y, null, null);
            this.pdf.clip_fixed();
          }
        }
      }

      window.outIntercept = outInterceptOld;

      // if (this.ctx._clip_path.length > 0) {
      //     lines.push('Q');
      // }
    },

    pushMask() {
      const v2Support = typeof this.pdf.internal.newObject2 === 'function';

      if (!v2Support) {
        console.log('jsPDF v2 not enabled');
        return;
      }

      // define a mask stream
      const obj = this.pdf.internal.newStreamObject();

      // define a mask state
      const obj2 = this.pdf.internal.newObject2();
      obj2.push('<</Type /ExtGState');
      obj2.push(`/SMask <</S /Alpha /G ${obj.objId} 0 R>>`); // /S /Luminosity will need to define color space
      obj2.push('>>');

      // add mask to page resources
      const gsName = `MASK${obj2.objId}`;
      this.pdf.internal.addGraphicsState(gsName, obj2.objId);

      const instruction = `/${gsName} gs`;
      this.pdf.internal.out(instruction);
    },

    clip() {
      // TODO do we reset the path, or just copy it?
      if (this.ctx._clip_path.length > 0) {
        for (let i = 0; i < this.path.length; i++) {
          this.ctx._clip_path.push(this.path[i]);
        }
      } else {
        this.ctx._clip_path = this.path;
      }
      this.path = [];
    },

    measureText(text) {
      const { pdf } = this;
      return {
        getWidth() {
          const fontSize = pdf.internal.getFontSize();
          const txtWidth = pdf.getStringUnitWidth(text) * fontSize / pdf.internal.scaleFactor;
          return txtWidth;
        },

        get width() {
          return this.getWidth(text);
        },
      };
    },
    _getBaseline(y) {
      const height = parseInt(this.pdf.internal.getFontSize());
      // TODO Get descent from font descriptor
      const descent = height * 0.25;
      switch (this.ctx.textBaseline) {
        case 'bottom':
          return y - descent;
        case 'top':
          return y + height;
        case 'hanging':
          return y + height - descent;
        case 'middle':
          return y + height / 2 - descent;
        case 'ideographic':
          // TODO not implemented
          return y;
        case 'alphabetic':
        default:
          return y;
      }
    },
  };
  var c2d = jsPDFAPI.context2d;

  // accessor methods
  Object.defineProperty(c2d, 'fillStyle', {
    set(value) {
      this.setFillStyle(value);
    },
    get() {
      return this.ctx.fillStyle;
    },
  });
  Object.defineProperty(c2d, 'strokeStyle', {
    set(value) {
      this.setStrokeStyle(value);
    },
    get() {
      return this.ctx.strokeStyle;
    },
  });
  Object.defineProperty(c2d, 'lineWidth', {
    set(value) {
      this.setLineWidth(value);
    },
    get() {
      return this.ctx.lineWidth;
    },
  });
  Object.defineProperty(c2d, 'lineCap', {
    set(val) {
      this.setLineCap(val);
    },
    get() {
      return this.ctx.lineCap;
    },
  });
  Object.defineProperty(c2d, 'lineJoin', {
    set(val) {
      this.setLineJoin(val);
    },
    get() {
      return this.ctx.lineJoin;
    },
  });
  Object.defineProperty(c2d, 'miterLimit', {
    set(val) {
      this.ctx.miterLimit = val;
    },
    get() {
      return this.ctx.miterLimit;
    },
  });
  Object.defineProperty(c2d, 'textBaseline', {
    set(value) {
      this.setTextBaseline(value);
    },
    get() {
      return this.getTextBaseline();
    },
  });
  Object.defineProperty(c2d, 'textAlign', {
    set(value) {
      this.setTextAlign(value);
    },
    get() {
      return this.getTextAlign();
    },
  });
  Object.defineProperty(c2d, 'font', {
    set(value) {
      this.setFont(value);
    },
    get() {
      return this.ctx.font;
    },
  });
  Object.defineProperty(c2d, 'globalCompositeOperation', {
    set(value) {
      this.ctx.globalCompositeOperation = value;
    },
    get() {
      return this.ctx.globalCompositeOperation;
    },
  });
  Object.defineProperty(c2d, 'globalAlpha', {
    set(value) {
      this.ctx.globalAlpha = value;
    },
    get() {
      return this.ctx.globalAlpha;
    },
  });
  // Not HTML API
  Object.defineProperty(c2d, 'ignoreClearRect', {
    set(value) {
      this.ctx.ignoreClearRect = value;
    },
    get() {
      return this.ctx.ignoreClearRect;
    },
  });
  // End Not HTML API

  c2d.internal = {};

  c2d.internal.rxRgb = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
  c2d.internal.rxRgba = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)/;
  c2d.internal.rxTransparent = /transparent|rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*0+\s*\)/;

  // http://hansmuller-flex.blogspot.com/2011/10/more-about-approximating-circular-arcs.html
  c2d.internal.arc = function (c2d, xc, yc, r, a1, a2, anticlockwise, style) {
    const includeMove = true;

    const k = this.pdf.internal.scaleFactor;
    const pageHeight = this.pdf.internal.pageSize.height;
    const { f2 } = this.pdf.internal;

    const a1r = a1 * (Math.PI / 180);
    const a2r = a2 * (Math.PI / 180);
    const curves = this.createArc(r, a1r, a2r, anticlockwise);
    const pathData = null;

    for (let i = 0; i < curves.length; i++) {
      const curve = curves[i];
      if (includeMove && i == 0) {
        this.pdf.internal.out([
          f2((curve.x1 + xc) * k), f2((pageHeight - (curve.y1 + yc)) * k), 'm', f2((curve.x2 + xc) * k), f2((pageHeight - (curve.y2 + yc)) * k), f2((curve.x3 + xc) * k), f2((pageHeight - (curve.y3 + yc)) * k), f2((curve.x4 + xc) * k), f2((pageHeight - (curve.y4 + yc)) * k), 'c',
        ].join(' '));
      } else {
        this.pdf.internal.out([
          f2((curve.x2 + xc) * k), f2((pageHeight - (curve.y2 + yc)) * k), f2((curve.x3 + xc) * k), f2((pageHeight - (curve.y3 + yc)) * k), f2((curve.x4 + xc) * k), f2((pageHeight - (curve.y4 + yc)) * k), 'c',
        ].join(' '));
      }

      // c2d._lastPoint = {x: curve.x1 + xc, y: curve.y1 + yc};
      c2d._lastPoint = { x: xc, y: yc };
      // f2((curve.x1 + xc) * k), f2((pageHeight - (curve.y1 + yc)) * k), 'm', f2((curve.x2 + xc) * k), f2((pageHeight - (curve.y2 + yc)) * k), f2((curve.x3 + xc) * k), f2((pageHeight - (curve.y3 + yc)) * k), f2((curve.x4 + xc) * k), f2((pageHeight - (curve.y4 + yc)) * k), 'c'
    }

    if (style !== null) {
      this.pdf.internal.out(this.pdf.internal.getStyle(style));
    }
  };

  /**
     *
     * @param x Edge point X
     * @param y Edge point Y
     * @param r Radius
     * @param a1 start angle
     * @param a2 end angle
     * @param anticlockwise
     * @param style
     * @param isClip
     */
  c2d.internal.arc2 = function (c2d, x, y, r, a1, a2, anticlockwise, style, isClip) {
    // we need to convert from cartesian to polar here methinks.
    const centerX = x;// + r;
    const centerY = y;

    if (false) {
      const phi = (a2 - a1);
      let start = {
        x: r,
        y: 0,
      };

      let pt1 = {
        x: r,
        y: r * 4 / 3 * Math.tan(phi / 4),
      };

      let pt2 = {
        x: r * (Math.cos(phi) + 4 / 3 * Math.tan(phi / 4) * Math.sin(phi)),
        y: r * (Math.sin(phi) - 4 / 3 * Math.tan(phi / 4) * Math.cos(phi)),
      };

      let end = {
        x: r * Math.cos(phi),
        y: r * Math.sin(phi),
      };

      const matrix = [Math.cos(a1), Math.sin(a1), -Math.sin(a1), Math.cos(a1), x, y];
      start = c2d._matrix_map_point_obj(matrix, start);
      pt1 = c2d._matrix_map_point_obj(matrix, pt1);
      pt2 = c2d._matrix_map_point_obj(matrix, pt2);
      end = c2d._matrix_map_point_obj(matrix, end);

      const k = this.pdf.internal.scaleFactor;
      const pageHeight = this.pdf.internal.pageSize.height;
      const { f2 } = this.pdf.internal;
      this.pdf.internal.out([
        f2((start.x) * k), f2((pageHeight - (start.y)) * k), 'm', f2((pt1.x) * k), f2((pageHeight - (pt1.y)) * k), f2((pt2.x) * k), f2((pageHeight - (pt2.y)) * k), f2((end.x) * k), f2((pageHeight - (end.y)) * k), 'c',
      ].join(' '));
      // this.pdf.internal.out('f');
      c2d._lastPoint = end;
      return;
    }

    if (!isClip) {
      this.arc(c2d, centerX, centerY, r, a1, a2, anticlockwise, style);
    } else {
      this.arc(c2d, centerX, centerY, r, a1, a2, anticlockwise, null);
      this.pdf.clip_fixed();
    }
  };

  c2d.internal.move2 = function (c2d, x, y) {
    const k = this.pdf.internal.scaleFactor;
    const pageHeight = this.pdf.internal.pageSize.height;
    const { f2 } = this.pdf.internal;

    this.pdf.internal.out([
      f2((x) * k), f2((pageHeight - (y)) * k), 'm',
    ].join(' '));
    c2d._lastPoint = { x, y };
  };

  c2d.internal.line2 = function (c2d, dx, dy) {
    const k = this.pdf.internal.scaleFactor;
    const pageHeight = this.pdf.internal.pageSize.height;
    const { f2 } = this.pdf.internal;

    // var pt = {x: c2d._lastPoint.x + dx, y: c2d._lastPoint.y + dy};
    const pt = { x: dx, y: dy };

    this.pdf.internal.out([
      f2((pt.x) * k), f2((pageHeight - (pt.y)) * k), 'l',
    ].join(' '));
    // this.pdf.internal.out('f');
    c2d._lastPoint = pt;
  };

  /**
     * Return a array of objects that represent bezier curves which approximate the circular arc centered at the origin, from startAngle to endAngle (radians) with the specified radius.
     *
     * Each bezier curve is an object with four points, where x1,y1 and x4,y4 are the arc's end points and x2,y2 and x3,y3 are the cubic bezier's control points.
     */

  c2d.internal.createArc = function (radius, startAngle, endAngle, anticlockwise) {
    const EPSILON = 0.00001; // Roughly 1/1000th of a degree, see below

    // normalize startAngle, endAngle to [-2PI, 2PI]
    const twoPI = Math.PI * 2;
    let startAngleN = startAngle;
    if (startAngleN < twoPI || startAngleN > twoPI) {
      startAngleN %= twoPI;
    }
    let endAngleN = endAngle;
    if (endAngleN < twoPI || endAngleN > twoPI) {
      endAngleN %= twoPI;
    }

    // Compute the sequence of arc curves, up to PI/2 at a time.
    // Total arc angle is less than 2PI.
    const curves = [];
    const piOverTwo = Math.PI / 2.0;
    // var sgn = (startAngle < endAngle) ? +1 : -1; // clockwise or counterclockwise
    const sgn = anticlockwise ? -1 : +1;

    let a1 = startAngle;
    for (let totalAngle = Math.min(twoPI, Math.abs(endAngleN - startAngleN)); totalAngle > EPSILON;) {
      const a2 = a1 + sgn * Math.min(totalAngle, piOverTwo);
      curves.push(this.createSmallArc(radius, a1, a2));
      totalAngle -= Math.abs(a2 - a1);
      a1 = a2;
    }

    return curves;
  };

  /**
     * Cubic bezier approximation of a circular arc centered at the origin, from (radians) a1 to a2, where a2-a1 < pi/2. The arc's radius is r.
     *
     * Returns an object with four points, where x1,y1 and x4,y4 are the arc's end points and x2,y2 and x3,y3 are the cubic bezier's control points.
     *
     * This algorithm is based on the approach described in: A. Riškus, "Approximation of a Cubic Bezier Curve by Circular Arcs and Vice Versa," Information Technology and Control, 35(4), 2006 pp. 371-378.
     */

  c2d.internal.createSmallArc = function (r, a1, a2) {
    // Compute all four points for an arc that subtends the same total angle
    // but is centered on the X-axis

    const a = (a2 - a1) / 2.0;

    const x4 = r * Math.cos(a);
    const y4 = r * Math.sin(a);
    const x1 = x4;
    const y1 = -y4;

    const q1 = x1 * x1 + y1 * y1;
    const q2 = q1 + x1 * x4 + y1 * y4;
    const k2 = 4 / 3 * (Math.sqrt(2 * q1 * q2) - q2) / (x1 * y4 - y1 * x4);

    const x2 = x1 - k2 * y1;
    const y2 = y1 + k2 * x1;
    const x3 = x2;
    const y3 = -y2;

    // Find the arc points' actual locations by computing x1,y1 and x4,y4
    // and rotating the control points by a + a1

    const ar = a + a1;
    const cos_ar = Math.cos(ar);
    const sin_ar = Math.sin(ar);

    return {
      x1: r * Math.cos(a1),
      y1: r * Math.sin(a1),
      x2: x2 * cos_ar - y2 * sin_ar,
      y2: x2 * sin_ar + y2 * cos_ar,
      x3: x3 * cos_ar - y3 * sin_ar,
      y3: x3 * sin_ar + y3 * cos_ar,
      x4: r * Math.cos(a2),
      y4: r * Math.sin(a2),
    };
  };

  function context() {
    this._isStrokeTransparent = false;
    this._strokeOpacity = 1;
    this.strokeStyle = '#000000';
    this.fillStyle = '#000000';
    this._isFillTransparent = false;
    this._fillOpacity = 1;
    this.font = '12pt times';
    this.textBaseline = 'alphabetic'; // top,bottom,middle,ideographic,alphabetic,hanging
    this.textAlign = 'start';
    this.lineWidth = 1;
    this.lineJoin = 'miter'; // round, bevel, miter
    this.lineCap = 'butt'; // butt, round, square
    this._transform = [1, 0, 0, 1, 0, 0]; // sx, shy, shx, sy, tx, ty
    this.globalCompositeOperation = 'normal';
    this.globalAlpha = 1.0;
    this._clip_path = [];
    // TODO miter limit //default 10

    // Not HTML API
    this.ignoreClearRect = false;

    this.copy = function (ctx) {
      this._isStrokeTransparent = ctx._isStrokeTransparent;
      this._strokeOpacity = ctx._strokeOpacity;
      this.strokeStyle = ctx.strokeStyle;
      this._isFillTransparent = ctx._isFillTransparent;
      this._fillOpacity = ctx._fillOpacity;
      this.fillStyle = ctx.fillStyle;
      this.font = ctx.font;
      this.lineWidth = ctx.lineWidth;
      this.lineJoin = ctx.lineJoin;
      this.lineCap = ctx.lineCap;
      this.textBaseline = ctx.textBaseline;
      this.textAlign = ctx.textAlign;
      this._fontSize = ctx._fontSize;
      this._transform = ctx._transform.slice(0);
      this.globalCompositeOperation = ctx.globalCompositeOperation;
      this.globalAlpha = ctx.globalAlpha;
      this._clip_path = ctx._clip_path.slice(0); // TODO deep copy?

      // Not HTML API
      this.ignoreClearRect = ctx.ignoreClearRect;
    };
  }

  return this;
}(jsPDF.API));
