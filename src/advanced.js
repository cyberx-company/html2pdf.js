/**
 * HTML2PDF Advanced - Extended API with cutting-edge features
 *
 * This module extends the base html2pdf functionality with advanced features:
 * - Multi-format export
 * - Progressive rendering
 * - Intelligent optimization
 * - Batch processing
 * - Advanced styling
 * - Content analysis
 *
 * @usage
 * ```javascript
 * // Basic advanced export
 * html2pdf.advanced(element, {
 *   template: 'PRINT_READY',
 *   watermark: 'CONFIDENTIAL'
 * });
 *
 * // Multi-format export
 * html2pdf.advanced(element, {
 *   format: 'multi',
 *   formats: ['pdf', 'png', 'jpeg']
 * });
 *
 * // Batch export with progress tracking
 * html2pdf.advancedBatch(elements, options)
 *   .onProgress(progress => console.log(progress))
 *   .then(results => console.log('Done!'));
 * ```
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./plugin/advanced-exporter'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./plugin/advanced-exporter'));
  } else {
    root.html2pdfAdvanced = factory(root.AdvancedExporter);
  }
}(typeof self !== 'undefined' ? self : this, function(AdvancedExporter) {
  'use strict';

  // Global instance
  let globalExporter = null;

  /**
   * Get or create global exporter instance
   */
  function getExporter(options) {
    if (!globalExporter || options._newInstance) {
      globalExporter = new AdvancedExporter(options);
    }
    return globalExporter;
  }

  /**
   * Advanced export function
   */
  function html2pdfAdvanced(element, options = {}) {
    const exporter = getExporter(options);
    return exporter.export(element, options);
  }

  /**
   * Batch export function
   */
  function html2pdfAdvancedBatch(elements, options = {}) {
    const exporter = getExporter(options);
    const promise = exporter.exportBatch(elements, options);

    // Return promise with chainable methods
    promise.onProgress = function(callback) {
      exporter.onProgress(callback);
      return this;
    };

    promise.onError = function(handler) {
      exporter.onError(handler);
      return this;
    };

    return promise;
  }

  /**
   * Queue-based export
   */
  function html2pdfQueue(element, options = {}) {
    const exporter = getExporter(options);
    return exporter.queueExport(element, options);
  }

  /**
   * Create a new exporter instance
   */
  function createExporter(options = {}) {
    return new AdvancedExporter(options);
  }

  /**
   * Extend the original html2pdf with advanced features
   */
  function extendHtml2Pdf(html2pdf) {
    if (!html2pdf) {
      console.warn('html2pdf not found. Advanced features available as standalone.');
      return;
    }

    // Add advanced method to html2pdf
    html2pdf.advanced = function(element, options = {}) {
      return html2pdfAdvanced(element, options);
    };

    // Add batch method
    html2pdf.advancedBatch = function(elements, options = {}) {
      return html2pdfAdvancedBatch(elements, options);
    };

    // Add queue method
    html2pdf.queue = function(element, options = {}) {
      return html2pdfQueue(element, options);
    };

    // Add create exporter method
    html2pdf.createAdvancedExporter = function(options = {}) {
      return createExporter(options);
    };

    // Add template presets
    html2pdf.TEMPLATES = AdvancedExporter.TEMPLATES;
    html2pdf.QUALITY_PRESETS = AdvancedExporter.QUALITY_PRESETS;
    html2pdf.EXPORT_FORMATS = AdvancedExporter.FORMATS;

    // Add utility methods
    html2pdf.getExporterStats = function() {
      if (globalExporter) {
        return globalExporter.getStats();
      }
      return null;
    };

    html2pdf.clearExporterCache = function() {
      if (globalExporter) {
        globalExporter.clearCache();
      }
    };
  }

  // Auto-extend if html2pdf is available
  if (typeof root !== 'undefined' && root.html2pdf) {
    extendHtml2Pdf(root.html2pdf);
  }

  // Export API
  const api = {
    advanced: html2pdfAdvanced,
    batch: html2pdfAdvancedBatch,
    queue: html2pdfQueue,
    createExporter: createExporter,
    extendHtml2Pdf: extendHtml2Pdf,
    AdvancedExporter: AdvancedExporter,
    TEMPLATES: AdvancedExporter.TEMPLATES,
    QUALITY_PRESETS: AdvancedExporter.QUALITY_PRESETS,
    FORMATS: AdvancedExporter.FORMATS
  };

  return api;
}));
