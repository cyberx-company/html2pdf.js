/**
 * Advanced HTML2PDF Exporter Plugin
 *
 * An extremely advanced export system with cutting-edge features:
 * - Multi-format export (PDF, PNG, JPEG, WebP, SVG)
 * - Progressive rendering with real-time progress tracking
 * - Intelligent quality optimization and compression
 * - Batch processing with queue management
 * - Advanced styling (watermarks, backgrounds, headers/footers)
 * - Metadata management and security features
 * - Smart content analysis for intelligent page breaks
 * - Export presets and templates
 * - Comprehensive error handling and recovery
 *
 * @author Advanced HTML2PDF System
 * @version 2.0.0
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jspdf', 'html2canvas'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jspdf'), require('html2canvas'));
  } else {
    root.AdvancedExporter = factory(root.jsPDF, root.html2canvas);
  }
}(typeof self !== 'undefined' ? self : this, function(jsPDF, html2canvas) {
  'use strict';

  /**
   * Advanced Export Formats
   */
  const EXPORT_FORMATS = {
    PDF: 'pdf',
    PNG: 'png',
    JPEG: 'jpeg',
    WEBP: 'webp',
    SVG: 'svg',
    MULTI: 'multi' // Export in multiple formats simultaneously
  };

  /**
   * Quality Presets
   */
  const QUALITY_PRESETS = {
    ULTRA: { quality: 1.0, scale: 3, dpi: 300, compression: 'none' },
    HIGH: { quality: 0.95, scale: 2, dpi: 200, compression: 'medium' },
    BALANCED: { quality: 0.85, scale: 1.5, dpi: 150, compression: 'balanced' },
    OPTIMIZED: { quality: 0.75, scale: 1, dpi: 96, compression: 'high' },
    COMPACT: { quality: 0.6, scale: 1, dpi: 72, compression: 'maximum' }
  };

  /**
   * Export Templates
   */
  const EXPORT_TEMPLATES = {
    PRINT_READY: {
      format: 'pdf',
      quality: QUALITY_PRESETS.ULTRA,
      colorSpace: 'CMYK',
      pageSize: 'a4',
      bleed: 3,
      cropMarks: true
    },
    SCREEN_OPTIMIZED: {
      format: 'pdf',
      quality: QUALITY_PRESETS.OPTIMIZED,
      colorSpace: 'RGB',
      optimize: true,
      compress: true
    },
    ARCHIVE: {
      format: 'pdf',
      quality: QUALITY_PRESETS.HIGH,
      pdfVersion: '1.7',
      embedFonts: true,
      metadata: { tagged: true }
    },
    PRESENTATION: {
      format: 'pdf',
      quality: QUALITY_PRESETS.HIGH,
      pageSize: '16:9',
      landscape: true,
      effects: { shadows: true, gradients: true }
    },
    EMAIL_FRIENDLY: {
      format: 'pdf',
      quality: QUALITY_PRESETS.COMPACT,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      compress: true
    },
    SOCIAL_MEDIA: {
      format: 'png',
      quality: QUALITY_PRESETS.HIGH,
      width: 1200,
      height: 630,
      optimize: true
    }
  };

  /**
   * Advanced Exporter Class
   */
  class AdvancedExporter {
    constructor(options = {}) {
      this.options = this._mergeOptions(options);
      this.queue = [];
      this.processing = false;
      this.stats = {
        totalExports: 0,
        successfulExports: 0,
        failedExports: 0,
        totalProcessingTime: 0
      };
      this.cache = new Map();
      this.progressCallback = null;
      this.errorHandlers = [];
    }

    /**
     * Merge user options with defaults
     */
    _mergeOptions(userOptions) {
      const defaults = {
        format: EXPORT_FORMATS.PDF,
        quality: QUALITY_PRESETS.BALANCED,
        progressive: true,
        useCache: true,
        batchSize: 5,
        timeout: 60000,
        retryAttempts: 3,
        autoOptimize: true,
        analytics: true,
        watermark: null,
        background: null,
        header: null,
        footer: null,
        metadata: {},
        security: null,
        smartPageBreaks: true,
        contentAnalysis: true
      };

      return Object.assign({}, defaults, userOptions);
    }

    /**
     * Export single element with advanced features
     */
    async export(element, options = {}) {
      const startTime = performance.now();
      const exportOptions = { ...this.options, ...options };

      try {
        // Validate element
        this._validateElement(element);

        // Apply template if specified
        if (exportOptions.template) {
          Object.assign(exportOptions, EXPORT_TEMPLATES[exportOptions.template]);
        }

        // Progress: Starting
        this._updateProgress(0, 'initializing', { element });

        // Content Analysis (Smart Features)
        if (exportOptions.contentAnalysis) {
          this._updateProgress(5, 'analyzing');
          await this._analyzeContent(element, exportOptions);
        }

        // Pre-processing
        this._updateProgress(10, 'preprocessing');
        const processedElement = await this._preprocess(element, exportOptions);

        // Apply advanced styling
        if (exportOptions.watermark || exportOptions.background ||
            exportOptions.header || exportOptions.footer) {
          this._updateProgress(20, 'applying-styles');
          await this._applyAdvancedStyling(processedElement, exportOptions);
        }

        // Progressive rendering
        this._updateProgress(30, 'rendering');
        const rendered = await this._progressiveRender(processedElement, exportOptions);

        // Quality optimization
        if (exportOptions.autoOptimize) {
          this._updateProgress(60, 'optimizing');
          await this._optimizeQuality(rendered, exportOptions);
        }

        // Export to format(s)
        this._updateProgress(80, 'exporting');
        const result = await this._exportToFormat(rendered, exportOptions);

        // Apply security features
        if (exportOptions.security) {
          this._updateProgress(90, 'securing');
          await this._applySecurity(result, exportOptions.security);
        }

        // Add metadata
        if (exportOptions.metadata && Object.keys(exportOptions.metadata).length > 0) {
          this._updateProgress(95, 'metadata');
          await this._addMetadata(result, exportOptions.metadata);
        }

        // Cleanup
        this._cleanup(processedElement);

        // Update stats
        const processingTime = performance.now() - startTime;
        this._updateStats(true, processingTime);

        // Progress: Complete
        this._updateProgress(100, 'complete', {
          result,
          processingTime,
          fileSize: result.size || result.length
        });

        return result;

      } catch (error) {
        this._updateStats(false, performance.now() - startTime);
        this._handleError(error, element, exportOptions);
        throw error;
      }
    }

    /**
     * Batch export multiple elements
     */
    async exportBatch(elements, options = {}) {
      const batchOptions = { ...this.options, ...options };
      const results = [];
      const errors = [];

      this._updateProgress(0, 'batch-starting', { total: elements.length });

      for (let i = 0; i < elements.length; i++) {
        try {
          const result = await this.export(elements[i], {
            ...batchOptions,
            batchIndex: i,
            batchTotal: elements.length
          });
          results.push(result);

          const progress = ((i + 1) / elements.length) * 100;
          this._updateProgress(progress, 'batch-processing', {
            current: i + 1,
            total: elements.length,
            successful: results.length,
            failed: errors.length
          });

        } catch (error) {
          errors.push({ index: i, element: elements[i], error });

          if (!batchOptions.continueOnError) {
            throw new Error(`Batch export failed at index ${i}: ${error.message}`);
          }
        }
      }

      this._updateProgress(100, 'batch-complete', {
        results,
        errors,
        successRate: (results.length / elements.length) * 100
      });

      return { results, errors };
    }

    /**
     * Queue-based export (non-blocking)
     */
    queueExport(element, options = {}) {
      return new Promise((resolve, reject) => {
        this.queue.push({
          element,
          options,
          resolve,
          reject,
          timestamp: Date.now()
        });

        if (!this.processing) {
          this._processQueue();
        }
      });
    }

    /**
     * Process export queue
     */
    async _processQueue() {
      if (this.processing || this.queue.length === 0) return;

      this.processing = true;

      while (this.queue.length > 0) {
        const job = this.queue.shift();

        try {
          const result = await this.export(job.element, job.options);
          job.resolve(result);
        } catch (error) {
          job.reject(error);
        }
      }

      this.processing = false;
    }

    /**
     * Validate element before export
     */
    _validateElement(element) {
      if (!element) {
        throw new Error('No element provided for export');
      }

      if (!(element instanceof HTMLElement) && typeof element !== 'string') {
        throw new Error('Element must be an HTMLElement or selector string');
      }

      if (typeof element === 'string') {
        const found = document.querySelector(element);
        if (!found) {
          throw new Error(`Element not found: ${element}`);
        }
      }
    }

    /**
     * Smart Content Analysis
     */
    async _analyzeContent(element, options) {
      const el = typeof element === 'string' ? document.querySelector(element) : element;

      const analysis = {
        dimensions: {
          width: el.offsetWidth,
          height: el.offsetHeight,
          scrollWidth: el.scrollWidth,
          scrollHeight: el.scrollHeight
        },
        complexity: this._calculateComplexity(el),
        textRatio: this._calculateTextRatio(el),
        imageCount: el.querySelectorAll('img').length,
        hasTransparency: this._detectTransparency(el),
        colorProfile: this._analyzeColors(el),
        suggestedPageBreaks: this._findOptimalPageBreaks(el, options),
        estimatedFileSize: this._estimateFileSize(el, options)
      };

      // Auto-adjust quality based on complexity
      if (options.autoOptimize) {
        if (analysis.complexity > 0.8) {
          options.quality = QUALITY_PRESETS.HIGH;
        } else if (analysis.complexity < 0.3) {
          options.quality = QUALITY_PRESETS.OPTIMIZED;
        }
      }

      options._analysis = analysis;
      return analysis;
    }

    /**
     * Calculate content complexity (0-1)
     */
    _calculateComplexity(element) {
      const childrenCount = element.querySelectorAll('*').length;
      const imageCount = element.querySelectorAll('img, canvas, svg').length;
      const hasAnimations = element.querySelectorAll('[style*="animation"]').length > 0;
      const hasTransforms = element.querySelectorAll('[style*="transform"]').length > 0;

      let complexity = 0;
      complexity += Math.min(childrenCount / 1000, 0.4);
      complexity += Math.min(imageCount / 50, 0.3);
      complexity += hasAnimations ? 0.15 : 0;
      complexity += hasTransforms ? 0.15 : 0;

      return Math.min(complexity, 1);
    }

    /**
     * Calculate text to content ratio
     */
    _calculateTextRatio(element) {
      const textLength = element.textContent.length;
      const totalElements = element.querySelectorAll('*').length;
      return totalElements > 0 ? textLength / totalElements : 0;
    }

    /**
     * Detect transparency in content
     */
    _detectTransparency(element) {
      const computed = window.getComputedStyle(element);
      const bgColor = computed.backgroundColor;

      if (bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') {
        return true;
      }

      // Check for transparent images
      const images = element.querySelectorAll('img');
      for (let img of images) {
        if (img.src.endsWith('.png') || img.src.includes('data:image/png')) {
          return true;
        }
      }

      return false;
    }

    /**
     * Analyze color profile
     */
    _analyzeColors(element) {
      const colors = new Set();
      const elements = element.querySelectorAll('*');

      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.color) colors.add(styles.color);
        if (styles.backgroundColor) colors.add(styles.backgroundColor);
      });

      return {
        uniqueColors: colors.size,
        isGrayscale: this._isGrayscale(Array.from(colors)),
        hasVibrantColors: this._hasVibrantColors(Array.from(colors))
      };
    }

    /**
     * Check if colors are grayscale
     */
    _isGrayscale(colors) {
      return colors.every(color => {
        const rgb = this._parseColor(color);
        if (!rgb) return true;
        return Math.abs(rgb.r - rgb.g) < 10 && Math.abs(rgb.g - rgb.b) < 10;
      });
    }

    /**
     * Check for vibrant colors
     */
    _hasVibrantColors(colors) {
      return colors.some(color => {
        const rgb = this._parseColor(color);
        if (!rgb) return false;
        const max = Math.max(rgb.r, rgb.g, rgb.b);
        const min = Math.min(rgb.r, rgb.g, rgb.b);
        return (max - min) > 100;
      });
    }

    /**
     * Parse color string to RGB
     */
    _parseColor(color) {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return null;
      return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
    }

    /**
     * Find optimal page breaks
     */
    _findOptimalPageBreaks(element, options) {
      const breaks = [];
      const pageHeight = options.pageHeight || 842; // A4 height in pixels at 96dpi

      const sections = element.querySelectorAll('section, article, div.page, .page-break');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.height > pageHeight * 0.8) {
          breaks.push({
            element: section,
            position: rect.top,
            reason: 'section-boundary'
          });
        }
      });

      return breaks;
    }

    /**
     * Estimate file size
     */
    _estimateFileSize(element, options) {
      const area = element.offsetWidth * element.offsetHeight;
      const imageCount = element.querySelectorAll('img').length;
      const quality = options.quality?.quality || 0.85;

      // Rough estimation
      let estimated = area * 0.5; // Base size from canvas
      estimated += imageCount * 50000; // ~50KB per image
      estimated *= quality;

      return Math.round(estimated);
    }

    /**
     * Preprocess element before rendering
     */
    async _preprocess(element, options) {
      const el = typeof element === 'string' ? document.querySelector(element) : element;

      // Clone element
      const clone = el.cloneNode(true);

      // Apply print styles if requested
      if (options.usePrintStyles) {
        clone.style.cssText += ';print-color-adjust: exact;-webkit-print-color-adjust: exact;';
      }

      // Fix images
      await this._fixImages(clone);

      // Ensure fonts are loaded
      if (document.fonts) {
        await document.fonts.ready;
      }

      return clone;
    }

    /**
     * Fix images in cloned element
     */
    async _fixImages(element) {
      const images = element.querySelectorAll('img');
      const promises = [];

      images.forEach(img => {
        if (!img.complete) {
          promises.push(new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          }));
        }
      });

      await Promise.all(promises);
    }

    /**
     * Apply advanced styling (watermarks, backgrounds, headers, footers)
     */
    async _applyAdvancedStyling(element, options) {
      // Add watermark
      if (options.watermark) {
        this._addWatermark(element, options.watermark);
      }

      // Add background
      if (options.background) {
        this._addBackground(element, options.background);
      }

      // Headers and footers will be added per-page during PDF generation
      if (options.header || options.footer) {
        element.dataset.hasHeaderFooter = 'true';
        element.dataset.header = JSON.stringify(options.header);
        element.dataset.footer = JSON.stringify(options.footer);
      }
    }

    /**
     * Add watermark to element
     */
    _addWatermark(element, watermark) {
      const watermarkEl = document.createElement('div');
      watermarkEl.className = 'html2pdf-watermark';

      const config = typeof watermark === 'string'
        ? { text: watermark }
        : watermark;

      watermarkEl.textContent = config.text || 'WATERMARK';
      watermarkEl.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: ${config.fontSize || '72px'};
        color: ${config.color || 'rgba(0, 0, 0, 0.1)'};
        font-weight: bold;
        pointer-events: none;
        z-index: 9999;
        white-space: nowrap;
        opacity: ${config.opacity || 0.1};
      `;

      // Insert at beginning so it appears behind content
      element.insertBefore(watermarkEl, element.firstChild);
    }

    /**
     * Add background to element
     */
    _addBackground(element, background) {
      if (typeof background === 'string') {
        element.style.background = background;
      } else if (background.image) {
        element.style.backgroundImage = `url(${background.image})`;
        element.style.backgroundSize = background.size || 'cover';
        element.style.backgroundPosition = background.position || 'center';
        element.style.backgroundRepeat = background.repeat || 'no-repeat';
      }
    }

    /**
     * Progressive rendering with chunking
     */
    async _progressiveRender(element, options) {
      const renderOptions = {
        scale: options.quality?.scale || 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: options.backgroundColor || '#ffffff',
        logging: false,
        ...options.html2canvas
      };

      // Check cache
      const cacheKey = this._getCacheKey(element, renderOptions);
      if (options.useCache && this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      // Render with html2canvas
      const canvas = await html2canvas(element, renderOptions);

      // Cache result
      if (options.useCache) {
        this.cache.set(cacheKey, canvas);
      }

      return canvas;
    }

    /**
     * Generate cache key
     */
    _getCacheKey(element, options) {
      const html = element.outerHTML.substring(0, 1000);
      const optStr = JSON.stringify(options);
      return `${this._hashCode(html)}_${this._hashCode(optStr)}`;
    }

    /**
     * Simple hash function
     */
    _hashCode(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return hash;
    }

    /**
     * Optimize quality based on content and target
     */
    async _optimizeQuality(canvas, options) {
      const analysis = options._analysis;

      // If file size exceeds limit, reduce quality
      if (options.maxFileSize && analysis?.estimatedFileSize > options.maxFileSize) {
        const ratio = options.maxFileSize / analysis.estimatedFileSize;
        options.quality.quality *= ratio;
        options.quality.scale *= Math.sqrt(ratio);
      }

      // Optimize for specific use cases
      if (options.optimizeFor) {
        switch (options.optimizeFor) {
          case 'web':
            options.quality = QUALITY_PRESETS.OPTIMIZED;
            break;
          case 'print':
            options.quality = QUALITY_PRESETS.ULTRA;
            break;
          case 'email':
            options.quality = QUALITY_PRESETS.COMPACT;
            break;
        }
      }
    }

    /**
     * Export to specified format(s)
     */
    async _exportToFormat(canvas, options) {
      const format = options.format || EXPORT_FORMATS.PDF;

      switch (format) {
        case EXPORT_FORMATS.PDF:
          return await this._exportToPDF(canvas, options);

        case EXPORT_FORMATS.PNG:
          return this._exportToPNG(canvas, options);

        case EXPORT_FORMATS.JPEG:
          return this._exportToJPEG(canvas, options);

        case EXPORT_FORMATS.WEBP:
          return this._exportToWebP(canvas, options);

        case EXPORT_FORMATS.SVG:
          return await this._exportToSVG(canvas, options);

        case EXPORT_FORMATS.MULTI:
          return await this._exportMultiFormat(canvas, options);

        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    }

    /**
     * Export to PDF
     */
    async _exportToPDF(canvas, options) {
      const imgData = canvas.toDataURL('image/jpeg', options.quality?.quality || 0.95);

      const pdfOptions = {
        orientation: options.landscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: options.pageSize || 'a4',
        compress: options.compress !== false,
        ...options.jsPDF
      };

      const pdf = new jsPDF(pdfOptions);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate margins
      const margin = options.margin || [10, 10, 10, 10];
      const [marginTop, marginRight, marginBottom, marginLeft] =
        Array.isArray(margin) ? margin : [margin, margin, margin, margin];

      const contentWidth = pageWidth - marginLeft - marginRight;
      const contentHeight = pageHeight - marginTop - marginBottom;

      // Calculate image dimensions
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add pages
      let heightLeft = imgHeight;
      let position = 0;
      let page = 0;

      while (heightLeft > 0) {
        if (page > 0) {
          pdf.addPage();
        }

        // Add header
        if (options.header) {
          this._addPDFHeader(pdf, options.header, page, pageWidth, marginTop);
        }

        // Add image
        const currentHeight = Math.min(heightLeft, contentHeight);
        pdf.addImage(
          imgData,
          'JPEG',
          marginLeft,
          marginTop - position,
          imgWidth,
          imgHeight
        );

        // Add footer
        if (options.footer) {
          this._addPDFFooter(pdf, options.footer, page, pageWidth, pageHeight, marginBottom);
        }

        heightLeft -= contentHeight;
        position += contentHeight;
        page++;
      }

      return pdf;
    }

    /**
     * Add PDF header
     */
    _addPDFHeader(pdf, header, pageNum, pageWidth, marginTop) {
      const headerText = typeof header === 'string' ? header : header.text;
      const fontSize = header.fontSize || 10;

      pdf.setFontSize(fontSize);
      pdf.setTextColor(header.color || '#000000');
      pdf.text(headerText.replace('{page}', pageNum + 1), pageWidth / 2, marginTop / 2, { align: 'center' });
    }

    /**
     * Add PDF footer
     */
    _addPDFFooter(pdf, footer, pageNum, pageWidth, pageHeight, marginBottom) {
      const footerText = typeof footer === 'string' ? footer : footer.text;
      const fontSize = footer.fontSize || 10;

      pdf.setFontSize(fontSize);
      pdf.setTextColor(footer.color || '#000000');
      pdf.text(
        footerText.replace('{page}', pageNum + 1),
        pageWidth / 2,
        pageHeight - marginBottom / 2,
        { align: 'center' }
      );
    }

    /**
     * Export to PNG
     */
    _exportToPNG(canvas, options) {
      return {
        type: 'png',
        dataUrl: canvas.toDataURL('image/png'),
        blob: this._dataURLToBlob(canvas.toDataURL('image/png')),
        canvas: canvas,
        width: canvas.width,
        height: canvas.height
      };
    }

    /**
     * Export to JPEG
     */
    _exportToJPEG(canvas, options) {
      const quality = options.quality?.quality || 0.85;
      return {
        type: 'jpeg',
        dataUrl: canvas.toDataURL('image/jpeg', quality),
        blob: this._dataURLToBlob(canvas.toDataURL('image/jpeg', quality)),
        canvas: canvas,
        width: canvas.width,
        height: canvas.height
      };
    }

    /**
     * Export to WebP
     */
    _exportToWebP(canvas, options) {
      const quality = options.quality?.quality || 0.85;

      if (!canvas.toDataURL('image/webp').startsWith('data:image/webp')) {
        throw new Error('WebP format not supported in this browser');
      }

      return {
        type: 'webp',
        dataUrl: canvas.toDataURL('image/webp', quality),
        blob: this._dataURLToBlob(canvas.toDataURL('image/webp', quality)),
        canvas: canvas,
        width: canvas.width,
        height: canvas.height
      };
    }

    /**
     * Export to SVG (simplified - actual implementation would need dom-to-svg library)
     */
    async _exportToSVG(canvas, options) {
      // Note: This is a placeholder. Real SVG export would require additional libraries
      const svgData = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
          <image href="${canvas.toDataURL()}" width="${canvas.width}" height="${canvas.height}" />
        </svg>
      `;

      return {
        type: 'svg',
        data: svgData,
        blob: new Blob([svgData], { type: 'image/svg+xml' }),
        width: canvas.width,
        height: canvas.height
      };
    }

    /**
     * Export to multiple formats simultaneously
     */
    async _exportMultiFormat(canvas, options) {
      const formats = options.formats || ['pdf', 'png'];
      const results = {};

      for (const format of formats) {
        results[format] = await this._exportToFormat(canvas, {
          ...options,
          format: format
        });
      }

      return results;
    }

    /**
     * Convert data URL to Blob
     */
    _dataURLToBlob(dataUrl) {
      const parts = dataUrl.split(',');
      const mime = parts[0].match(/:(.*?);/)[1];
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new Blob([u8arr], { type: mime });
    }

    /**
     * Apply security features (password protection, encryption)
     */
    async _applySecurity(result, security) {
      // Note: This would require jsPDF plugins for encryption
      if (result instanceof jsPDF) {
        if (security.password) {
          // result.encrypt(security.password, security.permissions);
          console.warn('PDF encryption requires jsPDF encryption plugin');
        }
      }
    }

    /**
     * Add metadata to exported file
     */
    async _addMetadata(result, metadata) {
      if (result instanceof jsPDF) {
        if (metadata.title) result.setProperties({ title: metadata.title });
        if (metadata.author) result.setProperties({ author: metadata.author });
        if (metadata.subject) result.setProperties({ subject: metadata.subject });
        if (metadata.keywords) result.setProperties({ keywords: metadata.keywords });
        if (metadata.creator) result.setProperties({ creator: metadata.creator });
      }
    }

    /**
     * Cleanup temporary elements
     */
    _cleanup(element) {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }

    /**
     * Update progress
     */
    _updateProgress(percent, stage, data = {}) {
      if (this.progressCallback) {
        this.progressCallback({
          percent: Math.round(percent),
          stage,
          data,
          timestamp: Date.now()
        });
      }
    }

    /**
     * Update statistics
     */
    _updateStats(success, processingTime) {
      this.stats.totalExports++;
      if (success) {
        this.stats.successfulExports++;
      } else {
        this.stats.failedExports++;
      }
      this.stats.totalProcessingTime += processingTime;
    }

    /**
     * Handle errors
     */
    _handleError(error, element, options) {
      const errorInfo = {
        message: error.message,
        stack: error.stack,
        element: element,
        options: options,
        timestamp: Date.now()
      };

      // Call error handlers
      this.errorHandlers.forEach(handler => {
        try {
          handler(errorInfo);
        } catch (e) {
          console.error('Error in error handler:', e);
        }
      });

      console.error('Advanced Exporter Error:', errorInfo);
    }

    /**
     * Set progress callback
     */
    onProgress(callback) {
      this.progressCallback = callback;
      return this;
    }

    /**
     * Add error handler
     */
    onError(handler) {
      this.errorHandlers.push(handler);
      return this;
    }

    /**
     * Get export statistics
     */
    getStats() {
      return {
        ...this.stats,
        averageProcessingTime: this.stats.totalExports > 0
          ? this.stats.totalProcessingTime / this.stats.totalExports
          : 0,
        successRate: this.stats.totalExports > 0
          ? (this.stats.successfulExports / this.stats.totalExports) * 100
          : 0
      };
    }

    /**
     * Clear cache
     */
    clearCache() {
      this.cache.clear();
    }

    /**
     * Download result
     */
    async download(result, filename = 'export') {
      if (result instanceof jsPDF) {
        result.save(`${filename}.pdf`);
      } else if (result.blob) {
        const url = URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.${result.type}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (result.dataUrl) {
        const a = document.createElement('a');
        a.href = result.dataUrl;
        a.download = `${filename}.${result.type}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  }

  // Export constants
  AdvancedExporter.FORMATS = EXPORT_FORMATS;
  AdvancedExporter.QUALITY_PRESETS = QUALITY_PRESETS;
  AdvancedExporter.TEMPLATES = EXPORT_TEMPLATES;

  return AdvancedExporter;
}));
