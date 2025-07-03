/**
 * PORTFOLIO WEBSITE INTERACTIVE FUNCTIONALITY
 * Modern JavaScript with smooth animations and accessibility features
 */

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function calls
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ===================================
// SMOOTH SCROLLING NAVIGATION
// ===================================

class SmoothScrolling {
  constructor() {
    this.init();
  }

  init() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          this.scrollToElement(target);
        }
      });
    });
  }

  scrollToElement(element, offset = 80) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

// ===================================
// MOBILE MENU FUNCTIONALITY
// ===================================

class MobileMenu {
  constructor() {
    this.hamburger = document.querySelector('.hamburger');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.closeBtn = document.querySelector('.mobile-menu__close');
    this.menuLinks = document.querySelectorAll('.mobile-menu__link');
    this.body = document.body;
    
    this.init();
  }

  init() {
    if (!this.hamburger || !this.mobileMenu) return;

    // Create mobile menu if it doesn't exist
    this.createMobileMenu();
    
    // Hamburger click event
    this.hamburger.addEventListener('click', () => this.toggleMenu());
    
    // Close button click event
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeMenu());
    }
    
    // Menu link click events
    this.menuLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileMenu.classList.contains('active')) {
        this.closeMenu();
      }
    });
    
    // Close menu on outside click
    this.mobileMenu.addEventListener('click', (e) => {
      if (e.target === this.mobileMenu) {
        this.closeMenu();
      }
    });
  }

  createMobileMenu() {
    // If mobile menu doesn't exist, create it
    if (!this.mobileMenu) {
      const navLinks = document.querySelectorAll('.portfolio-nav a');
      const mobileMenuHTML = `
        <div class="mobile-menu">
          <button class="mobile-menu__close" aria-label="Close menu">&times;</button>
          <nav class="mobile-menu__nav">
            ${Array.from(navLinks).map(link => 
              `<a href="${link.href}" class="mobile-menu__link">${link.textContent}</a>`
            ).join('')}
          </nav>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', mobileMenuHTML);
      
      // Re-query elements
      this.mobileMenu = document.querySelector('.mobile-menu');
      this.closeBtn = document.querySelector('.mobile-menu__close');
      this.menuLinks = document.querySelectorAll('.mobile-menu__link');
    }
  }

  toggleMenu() {
    if (this.mobileMenu.classList.contains('active')) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.mobileMenu.classList.add('active');
    this.hamburger.classList.add('active');
    this.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    this.closeBtn?.focus();
  }

  closeMenu() {
    this.mobileMenu.classList.remove('active');
    this.hamburger.classList.remove('active');
    this.body.style.overflow = '';
    
    // Return focus to hamburger button
    this.hamburger.focus();
  }
}

// ===================================
// FORM VALIDATION
// ===================================

class FormValidator {
  constructor() {
    this.forms = document.querySelectorAll('form');
    this.init();
  }

  init() {
    this.forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      // Real-time validation
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearErrors(input));
      });
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const isValid = this.validateForm(form);
    
    if (isValid) {
      this.submitForm(form);
    }
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    
    // Email validation
    else if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    
    // Name validation (no numbers)
    else if (field.name === 'name' && value) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(value)) {
        isValid = false;
        errorMessage = 'Name should only contain letters and spaces';
      }
    }
    
    // Message length validation
    else if (field.name === 'message' && value && value.length < 10) {
      isValid = false;
      errorMessage = 'Message should be at least 10 characters long';
    }
    
    this.showFieldValidation(field, isValid, errorMessage);
    return isValid;
  }

  showFieldValidation(field, isValid, errorMessage) {
    const errorElement = field.parentNode.querySelector('.form__error') || 
                        this.createErrorElement(field);
    
    if (isValid) {
      field.classList.remove('error');
      field.classList.add('valid');
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    } else {
      field.classList.remove('valid');
      field.classList.add('error');
      errorElement.textContent = errorMessage;
      errorElement.classList.add('show');
    }
  }

  createErrorElement(field) {
    const errorElement = document.createElement('div');
    errorElement.className = 'form__error';
    field.parentNode.appendChild(errorElement);
    return errorElement;
  }

  clearErrors(field) {
    field.classList.remove('error', 'valid');
    const errorElement = field.parentNode.querySelector('.form__error');
    if (errorElement) {
      errorElement.classList.remove('show');
    }
  }

  async submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
    
    try {
      // Simulate form submission (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      this.showSuccessMessage(form);
      form.reset();
      
    } catch (error) {
      this.showErrorMessage(form, 'Failed to send message. Please try again.');
    } finally {
      // Reset button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  showSuccessMessage(form) {
    const message = document.createElement('div');
    message.className = 'form__success show';
    message.textContent = 'Message sent successfully! Thank you for contacting me.';
    form.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 5000);
  }

  showErrorMessage(form, errorText) {
    const message = document.createElement('div');
    message.className = 'form__error show';
    message.textContent = errorText;
    form.appendChild(message);

    setTimeout(() => {
      message.remove();
    }, 5000);
  }
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll('.animate-on-scroll');
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    // Create intersection observer for scroll animations
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Unobserve after animation to improve performance
          this.observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    // Observe all animated elements
    this.animatedElements.forEach(element => {
      this.observer.observe(element);
    });

    // Add animate-on-scroll class to elements that should animate
    this.addAnimationClasses();
  }

  addAnimationClasses() {
    // Add animation classes to various elements
    const elementsToAnimate = [
      '.skills__card',
      '.projects__card',
      '.hero__content > *',
      'section > h2',
      'section > p'
    ];

    elementsToAnimate.forEach(selector => {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.classList.add('animate-on-scroll');
        // Add staggered delay for multiple elements
        element.style.transitionDelay = `${index * 0.1}s`;
      });
    });
  }
}

// ===================================
// HEADER SCROLL EFFECTS
// ===================================

class HeaderEffects {
  constructor() {
    this.header = document.querySelector('.portfolio-header') || document.querySelector('header');
    this.scrollThreshold = 100;
    this.init();
  }

  init() {
    if (!this.header) return;

    // Throttled scroll handler for performance
    const handleScroll = throttle(() => {
      this.updateHeaderOnScroll();
    }, 16); // ~60fps

    window.addEventListener('scroll', handleScroll);

    // Initial check
    this.updateHeaderOnScroll();
  }

  updateHeaderOnScroll() {
    const scrollY = window.scrollY;

    if (scrollY > this.scrollThreshold) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }
}

// ===================================
// SCROLL TO TOP BUTTON
// ===================================

class ScrollToTop {
  constructor() {
    this.button = null;
    this.showThreshold = 300;
    this.init();
  }

  init() {
    this.createButton();
    this.setupEventListeners();
  }

  createButton() {
    // Create scroll to top button if it doesn't exist
    if (!document.querySelector('.scroll-to-top')) {
      const button = document.createElement('button');
      button.className = 'scroll-to-top';
      button.innerHTML = '↑';
      button.setAttribute('aria-label', 'Scroll to top');
      button.setAttribute('title', 'Scroll to top');
      document.body.appendChild(button);
    }

    this.button = document.querySelector('.scroll-to-top');
  }

  setupEventListeners() {
    if (!this.button) return;

    // Button click event
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Show/hide button based on scroll position
    const handleScroll = throttle(() => {
      this.toggleButtonVisibility();
    }, 100);

    window.addEventListener('scroll', handleScroll);

    // Initial check
    this.toggleButtonVisibility();
  }

  toggleButtonVisibility() {
    const scrollY = window.scrollY;

    if (scrollY > this.showThreshold) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }
}

// ===================================
// TYPING ANIMATION
// ===================================

class TypingAnimation {
  constructor(element, texts, options = {}) {
    this.element = element;
    this.texts = texts;
    this.options = {
      typeSpeed: 100,
      deleteSpeed: 50,
      pauseTime: 2000,
      loop: true,
      ...options
    };
    this.currentTextIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.init();
  }

  init() {
    if (!this.element || !this.texts.length) return;
    this.type();
  }

  type() {
    const currentText = this.texts[this.currentTextIndex];

    if (this.isDeleting) {
      // Delete characters
      this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;

      if (this.currentCharIndex === 0) {
        this.isDeleting = false;
        this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
        setTimeout(() => this.type(), this.options.pauseTime / 2);
        return;
      }

      setTimeout(() => this.type(), this.options.deleteSpeed);
    } else {
      // Type characters
      this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;

      if (this.currentCharIndex === currentText.length) {
        if (this.options.loop) {
          this.isDeleting = true;
          setTimeout(() => this.type(), this.options.pauseTime);
        }
        return;
      }

      setTimeout(() => this.type(), this.options.typeSpeed);
    }
  }
}

// ===================================
// PERFORMANCE OPTIMIZATIONS
// ===================================

class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    // Lazy load images
    this.setupLazyLoading();

    // Preload critical resources
    this.preloadCriticalResources();

    // Setup performance monitoring
    this.setupPerformanceMonitoring();
  }

  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
    }
  }

  preloadCriticalResources() {
    // Preload critical CSS and fonts
    const criticalResources = [
      { href: 'style.css', as: 'style' },
      // Add other critical resources as needed
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      document.head.appendChild(link);
    });
  }

  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // This would require importing web-vitals library
      // For now, we'll use basic performance monitoring
    }

    // Basic performance logging
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    });
  }
}

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================

class AccessibilityEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupARIALabels();
    this.setupReducedMotion();
  }

  setupKeyboardNavigation() {
    // Enhanced keyboard navigation for interactive elements
    document.addEventListener('keydown', (e) => {
      // Skip links functionality
      if (e.key === 'Tab' && !e.shiftKey) {
        this.handleTabNavigation(e);
      }

      // Close modals/menus with Escape
      if (e.key === 'Escape') {
        this.closeActiveModals();
      }
    });
  }

  setupFocusManagement() {
    // Ensure focus is visible and properly managed
    document.addEventListener('focusin', (e) => {
      e.target.classList.add('focus-visible');
    });

    document.addEventListener('focusout', (e) => {
      e.target.classList.remove('focus-visible');
    });
  }

  setupARIALabels() {
    // Add missing ARIA labels to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, textarea');

    interactiveElements.forEach(element => {
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        const text = element.textContent || element.value || element.placeholder;
        if (text) {
          element.setAttribute('aria-label', text.trim());
        }
      }
    });
  }

  setupReducedMotion() {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
      document.body.classList.add('reduce-motion');
    }

    prefersReducedMotion.addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('reduce-motion');
      } else {
        document.body.classList.remove('reduce-motion');
      }
    });
  }

  handleTabNavigation(e) {
    // Custom tab navigation logic if needed
    // This can be expanded based on specific requirements
  }

  closeActiveModals() {
    // Close any open modals or menus
    const activeModal = document.querySelector('.mobile-menu.active');
    if (activeModal) {
      const mobileMenu = new MobileMenu();
      mobileMenu.closeMenu();
    }
  }
}

// ===================================
// MAIN INITIALIZATION
// ===================================

class PortfolioApp {
  constructor() {
    this.components = {};
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Initialize all components
      this.components.smoothScrolling = new SmoothScrolling();
      this.components.mobileMenu = new MobileMenu();
      this.components.formValidator = new FormValidator();
      this.components.scrollAnimations = new ScrollAnimations();
      this.components.headerEffects = new HeaderEffects();
      this.components.scrollToTop = new ScrollToTop();
      this.components.performanceOptimizer = new PerformanceOptimizer();
      this.components.accessibilityEnhancements = new AccessibilityEnhancements();

      // Initialize typing animation if element exists
      const typingElement = document.querySelector('.typing-animation');
      if (typingElement) {
        const texts = typingElement.dataset.texts ?
          JSON.parse(typingElement.dataset.texts) :
          ['Web Developer', 'UI/UX Designer', 'Problem Solver'];

        this.components.typingAnimation = new TypingAnimation(typingElement, texts);
      }

      // Add loaded class to body for CSS animations
      document.body.classList.add('loaded');

      console.log('Portfolio app initialized successfully');

    } catch (error) {
      console.error('Error initializing portfolio app:', error);
    }
  }

  // Public method to reinitialize components if needed
  reinitialize() {
    this.initializeComponents();
  }

  // Public method to get component instances
  getComponent(name) {
    return this.components[name];
  }
}

// ===================================
// GLOBAL INITIALIZATION
// ===================================

// Initialize the portfolio app
const portfolioApp = new PortfolioApp();

// Make it globally accessible for debugging
window.portfolioApp = portfolioApp;

// Additional global event listeners
window.addEventListener('resize', debounce(() => {
  // Handle resize events
  console.log('Window resized');
}, 250));

window.addEventListener('orientationchange', () => {
  // Handle orientation changes on mobile
  setTimeout(() => {
    window.scrollTo(0, window.scrollY);
  }, 100);
});

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
