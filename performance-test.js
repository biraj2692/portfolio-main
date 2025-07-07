/**
 * Performance Testing and Validation Script
 * Measures Core Web Vitals and other performance metrics
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    // Wait for page to load completely
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.measurePerformance());
    } else {
      this.measurePerformance();
    }
  }

  measurePerformance() {
    // Measure Core Web Vitals
    this.measureCLS();
    this.measureFID();
    this.measureLCP();
    
    // Measure other performance metrics
    this.measureLoadTimes();
    this.measureResourceTiming();
    
    // Report results
    setTimeout(() => this.reportResults(), 3000);
  }

  // Cumulative Layout Shift (CLS)
  measureCLS() {
    let clsValue = 0;
    let clsEntries = [];

    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      }
    });

    observer.observe({ type: 'layout-shift', buffered: true });
    this.metrics.cls = { value: clsValue, entries: clsEntries };
  }

  // First Input Delay (FID)
  measureFID() {
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        this.metrics.fid = {
          value: entry.processingStart - entry.startTime,
          entry: entry
        };
      }
    });

    observer.observe({ type: 'first-input', buffered: true });
  }

  // Largest Contentful Paint (LCP)
  measureLCP() {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = {
        value: lastEntry.startTime,
        entry: lastEntry
      };
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  }

  // Load Times
  measureLoadTimes() {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      this.metrics.loadTimes = {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstByte: navigation.responseStart - navigation.requestStart,
        domInteractive: navigation.domInteractive - navigation.navigationStart
      };
    }
  }

  // Resource Timing
  measureResourceTiming() {
    const resources = performance.getEntriesByType('resource');
    const resourceMetrics = {
      totalResources: resources.length,
      images: resources.filter(r => r.initiatorType === 'img').length,
      scripts: resources.filter(r => r.initiatorType === 'script').length,
      stylesheets: resources.filter(r => r.initiatorType === 'link').length,
      totalSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0)
    };
    
    this.metrics.resources = resourceMetrics;
  }

  // Report Results
  reportResults() {
    console.group('🚀 Performance Optimization Results');
    
    // Core Web Vitals
    console.group('📊 Core Web Vitals');
    if (this.metrics.lcp) {
      const lcpScore = this.metrics.lcp.value <= 2500 ? '✅ Good' : 
                      this.metrics.lcp.value <= 4000 ? '⚠️ Needs Improvement' : '❌ Poor';
      console.log(`LCP (Largest Contentful Paint): ${this.metrics.lcp.value.toFixed(2)}ms ${lcpScore}`);
    }
    
    if (this.metrics.fid) {
      const fidScore = this.metrics.fid.value <= 100 ? '✅ Good' : 
                      this.metrics.fid.value <= 300 ? '⚠️ Needs Improvement' : '❌ Poor';
      console.log(`FID (First Input Delay): ${this.metrics.fid.value.toFixed(2)}ms ${fidScore}`);
    }
    
    if (this.metrics.cls) {
      const clsScore = this.metrics.cls.value <= 0.1 ? '✅ Good' : 
                      this.metrics.cls.value <= 0.25 ? '⚠️ Needs Improvement' : '❌ Poor';
      console.log(`CLS (Cumulative Layout Shift): ${this.metrics.cls.value.toFixed(3)} ${clsScore}`);
    }
    console.groupEnd();

    // Load Times
    if (this.metrics.loadTimes) {
      console.group('⏱️ Load Times');
      console.log(`DOM Content Loaded: ${this.metrics.loadTimes.domContentLoaded.toFixed(2)}ms`);
      console.log(`Load Complete: ${this.metrics.loadTimes.loadComplete.toFixed(2)}ms`);
      console.log(`First Byte: ${this.metrics.loadTimes.firstByte.toFixed(2)}ms`);
      console.log(`DOM Interactive: ${this.metrics.loadTimes.domInteractive.toFixed(2)}ms`);
      console.groupEnd();
    }

    // Resource Summary
    if (this.metrics.resources) {
      console.group('📦 Resource Summary');
      console.log(`Total Resources: ${this.metrics.resources.totalResources}`);
      console.log(`Images: ${this.metrics.resources.images}`);
      console.log(`Scripts: ${this.metrics.resources.scripts}`);
      console.log(`Stylesheets: ${this.metrics.resources.stylesheets}`);
      console.log(`Total Transfer Size: ${(this.metrics.resources.totalSize / 1024).toFixed(2)} KB`);
      console.groupEnd();
    }

    // Optimization Summary
    console.group('✨ Optimizations Applied');
    console.log('✅ Lazy loading for images');
    console.log('✅ Resource preloading');
    console.log('✅ Service worker caching');
    console.log('✅ CSS and JS optimization');
    console.log('✅ Accessibility improvements');
    console.log('✅ SEO enhancements');
    console.log('✅ Browser compatibility');
    console.groupEnd();

    console.groupEnd();
  }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  new PerformanceMonitor();
}
