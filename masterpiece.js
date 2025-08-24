/**
 * MASTERPIECE.JS - Indian Martial Arts Website
 * Complete animation and interaction system
 * Created for: Indian Martial Arts Heritage Website
 * Author: AI Assistant
 * Version: 1.0.0
 */

class MartialArtsWebsite {
    constructor() {
        this.initializeCore();
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupObservers();
        this.createLightbox();
        this.initializeGallery();
        this.setupNavigation();
        this.setupQuoteSlider();
        this.setupPerformanceOptimizations();
    }

    // ==================== CORE INITIALIZATION ====================
    initializeCore() {
        this.galleryItems = [];
        this.currentLightboxIndex = 0;
        this.isLightboxOpen = false;
        this.lastScrollY = window.scrollY;
        this.scrollDirection = 'up';
        this.animationFrame = null;
        this.observers = {};
        
        // Quote slider functionality
        this.quotes = [];
        this.currentQuoteIndex = 0;
        this.quoteTimer = null;
        
        // Touch and gesture support
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.touchStartY = 0;
        this.touchEndY = 0;
        
        // Performance tracking
        this.performanceMetrics = {
            loadTime: performance.now(),
            animationCount: 0,
            interactionCount: 0
        };

        console.log('🥋 Martial Arts Website Initialized');
    }

    // ==================== EVENT LISTENERS ====================
    setupEventListeners() {
        // Window events
        window.addEventListener('load', () => this.handlePageLoad());
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Performance monitoring
        window.addEventListener('beforeunload', () => this.logPerformanceMetrics());
        
        // Error handling
        window.addEventListener('error', (e) => this.handleError(e));
    }

    // ==================== NAVIGATION SYSTEM ====================
    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        // Enhanced scroll effect for navbar
        this.setupNavbarScrollEffect(navbar);
        
        // Smooth scrolling with easing
        this.setupSmoothScrolling(navLinks);
        
        // Mobile menu functionality
        this.setupMobileMenu(mobileToggle);
        
        // Active link highlighting
        this.setupActiveLinkHighlighting(navLinks);
    }

    setupNavbarScrollEffect(navbar) {
        if (!navbar) return;
        
        const scrollHandler = () => {
            const currentScrollY = window.scrollY;
            const scrollDifference = currentScrollY - this.lastScrollY;
            
            // Determine scroll direction
            this.scrollDirection = scrollDifference > 0 ? 'down' : 'up';
            
            // Add/remove scrolled class
            if (currentScrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar based on scroll direction
            if (Math.abs(scrollDifference) > 5) {
                if (this.scrollDirection === 'down' && currentScrollY > 200) {
                    navbar.style.transform = 'translateY(-100%)';
                } else if (this.scrollDirection === 'up') {
                    navbar.style.transform = 'translateY(0)';
                }
            }
            
            this.lastScrollY = currentScrollY;
        };
        
        // Throttled scroll handler
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(scrollHandler, 16); // ~60fps
        });
    }

    setupSmoothScrolling(navLinks) {
        navLinks.forEach(link => {
            if (link.getAttribute('href')?.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const target = document.querySelector(targetId);
                    
                    if (target) {
                        this.smoothScrollTo(target, 1000);
                        this.performanceMetrics.interactionCount++;
                    }
                });
            }
        });
    }

    smoothScrollTo(element, duration = 1000) {
        const targetPosition = element.offsetTop - 100; // Account for fixed navbar
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    setupMobileMenu(toggle) {
        if (!toggle) return;
        
        toggle.addEventListener('click', () => {
            const navMenu = document.querySelector('.nav-menu');
            const isActive = navMenu.classList.contains('mobile-active');
            
            navMenu.classList.toggle('mobile-active');
            toggle.classList.toggle('active');
            
            // Animate hamburger icon
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? 'auto' : 'hidden';
        });
    }

    setupActiveLinkHighlighting(navLinks) {
        const sections = document.querySelectorAll('section[id]');
        
        const highlightActiveLink = () => {
            const scrollPos = window.scrollY + 150;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };
        
        window.addEventListener('scroll', highlightActiveLink);
        highlightActiveLink(); // Initial call
    }

    // ==================== LIGHTBOX SYSTEM ====================
    createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox hidden';
        lightbox.innerHTML = `
            <div class="lightbox-backdrop" role="dialog" aria-modal="true" aria-label="Image viewer">
                <button class="lightbox-close" aria-label="Close viewer" title="Close (Esc)">
                    <i class="fas fa-times"></i>
                </button>
                <button class="lightbox-nav prev" aria-label="Previous image" title="Previous (←)">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="lightbox-content">
                    <figure class="lightbox-stage">
                        <img src="" alt="" id="lightboxImage">
                        <figcaption id="lightboxCaption"></figcaption>
                    </figure>
                    <div class="lightbox-controls">
                        <div class="lightbox-counter">
                            <span id="lightboxCounter">1 / 1</span>
                        </div>
                        <div class="lightbox-actions">
                            <button class="lightbox-action" id="lightboxZoom" title="Zoom">
                                <i class="fas fa-search-plus"></i>
                            </button>
                            <button class="lightbox-action" id="lightboxFullscreen" title="Fullscreen">
                                <i class="fas fa-expand"></i>
                            </button>
                            <button class="lightbox-action" id="lightboxDownload" title="Download">
                                <i class="fas fa-download"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <button class="lightbox-nav next" aria-label="Next image" title="Next (→)">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        this.lightbox = lightbox;
        this.setupLightboxEvents();
    }

    setupLightboxEvents() {
        const { lightbox } = this;
        
        // Close events
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox());
        lightbox.querySelector('.lightbox-backdrop').addEventListener('click', (e) => {
            if (e.target.classList.contains('lightbox-backdrop')) {
                this.closeLightbox();
            }
        });
        
        // Navigation events
        lightbox.querySelector('.prev').addEventListener('click', () => this.navigateLightbox(-1));
        lightbox.querySelector('.next').addEventListener('click', () => this.navigateLightbox(1));
        
        // Touch events for mobile
        this.setupLightboxTouchEvents();
        
        // Action buttons
        this.setupLightboxActions();
    }

    setupLightboxTouchEvents() {
        const { lightbox } = this;
        let startX, startY, moveX, moveY;
        
        lightbox.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        lightbox.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            moveX = e.touches[0].clientX;
            moveY = e.touches[0].clientY;
            
            const diffX = startX - moveX;
            const diffY = startY - moveY;
            
            // Prevent default scroll behavior
            if (Math.abs(diffX) > Math.abs(diffY)) {
                e.preventDefault();
            }
        });
        
        lightbox.addEventListener('touchend', () => {
            if (!startX || !startY || !moveX || !moveY) return;
            
            const diffX = startX - moveX;
            const diffY = startY - moveY;
            const minSwipeDistance = 50;
            
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
                if (diffX > 0) {
                    this.navigateLightbox(1); // Swipe left - next
                } else {
                    this.navigateLightbox(-1); // Swipe right - previous
                }
            }
            
            // Reset values
            startX = startY = moveX = moveY = null;
        });
    }

    setupLightboxActions() {
        const { lightbox } = this;
        
        // Zoom functionality
        lightbox.querySelector('#lightboxZoom').addEventListener('click', () => {
            const img = lightbox.querySelector('#lightboxImage');
            img.classList.toggle('zoomed');
        });
        
        // Fullscreen functionality
        lightbox.querySelector('#lightboxFullscreen').addEventListener('click', () => {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                lightbox.requestFullscreen().catch(console.warn);
            }
        });
        
        // Download functionality
        lightbox.querySelector('#lightboxDownload').addEventListener('click', () => {
            const img = lightbox.querySelector('#lightboxImage');
            const link = document.createElement('a');
            link.href = img.src;
            link.download = `martial-arts-${Date.now()}.jpg`;
            link.click();
        });
    }

    openLightbox(index) {
        if (!this.galleryItems.length) return;
        
        this.currentLightboxIndex = index;
        this.isLightboxOpen = true;
        
        const item = this.galleryItems[this.currentLightboxIndex];
        const img = item.querySelector('img');
        const title = item.dataset.title || '';
        const desc = item.dataset.desc || '';
        
        const lightboxImg = this.lightbox.querySelector('#lightboxImage');
        const lightboxCaption = this.lightbox.querySelector('#lightboxCaption');
        const lightboxCounter = this.lightbox.querySelector('#lightboxCounter');
        
        // Show loading state
        lightboxImg.style.opacity = '0.5';
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        
        lightboxImg.onload = () => {
            lightboxImg.style.opacity = '1';
        };
        
        lightboxCaption.innerHTML = `<strong>${title}</strong><br>${desc}`;
        lightboxCounter.textContent = `${index + 1} / ${this.galleryItems.length}`;
        
        this.lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        this.lightbox.querySelector('.lightbox-close').focus();
        
        // Preload adjacent images
        this.preloadAdjacentImages();
        
        // Analytics
        this.performanceMetrics.interactionCount++;
    }

    closeLightbox() {
        this.lightbox.classList.add('hidden');
        document.body.style.overflow = '';
        this.isLightboxOpen = false;
        
        // Return focus to the gallery item
        if (this.galleryItems[this.currentLightboxIndex]) {
            this.galleryItems[this.currentLightboxIndex].focus();
        }
    }

    navigateLightbox(direction) {
        const newIndex = (this.currentLightboxIndex + direction + this.galleryItems.length) % this.galleryItems.length;
        this.openLightbox(newIndex);
    }

    preloadAdjacentImages() {
        const preloadIndices = [
            (this.currentLightboxIndex - 1 + this.galleryItems.length) % this.galleryItems.length,
            (this.currentLightboxIndex + 1) % this.galleryItems.length
        ];
        
        preloadIndices.forEach(index => {
            const item = this.galleryItems[index];
            if (item) {
                const img = new Image();
                img.src = item.querySelector('img').src;
            }
        });
    }

    // ==================== GALLERY SYSTEM ====================
    initializeGallery() {
        this.galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        this.setupGalleryEvents();
        this.setupGalleryControls();
        this.initializeMasonryLayout();
    }

    setupGalleryEvents() {
        this.galleryItems.forEach((item, index) => {
            // Click events
            item.addEventListener('click', () => this.openLightbox(index));
            
            // Keyboard events
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openLightbox(index);
                }
            });
            
            // Accessibility
            item.tabIndex = 0;
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `Open image: ${item.dataset.title || 'Gallery image'}`);
            
            // Hover effects with throttling
            let hoverTimeout;
            item.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                hoverTimeout = setTimeout(() => {
                    this.addHoverEffect(item);
                }, 50);
            });
            
            item.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                this.removeHoverEffect(item);
            });
        });
    }

    addHoverEffect(item) {
        const img = item.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1.1) rotate(2deg)';
        }
    }

    removeHoverEffect(item) {
        const img = item.querySelector('img');
        if (img) {
            img.style.transform = '';
        }
    }

    setupGalleryControls() {
        const layoutButtons = document.querySelectorAll('.layout-btn');
        const galleryGrid = document.getElementById('galleryGrid');
        
        if (!galleryGrid) return;
        
        layoutButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                layoutButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
                
                // Apply layout
                const layout = btn.dataset.layout;
                this.applyGalleryLayout(galleryGrid, layout);
                
                // Analytics
                this.performanceMetrics.interactionCount++;
            });
        });
    }

    applyGalleryLayout(grid, layout) {
        grid.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        grid.dataset.layout = layout;
        
        if (layout === 'masonry') {
            this.calculateMasonryLayout();
        }
        
        // Remove transition after animation
        setTimeout(() => {
            grid.style.transition = '';
        }, 500);
    }

    initializeMasonryLayout() {
        if (document.querySelector('[data-layout="masonry"]')) {
            this.calculateMasonryLayout();
        }
    }

    calculateMasonryLayout() {
        const items = document.querySelectorAll('.gallery-item');
        
        items.forEach(item => {
            const img = item.querySelector('img');
            if (img) {
                if (img.complete) {
                    this.setMasonrySpan(item, img);
                } else {
                    img.onload = () => this.setMasonrySpan(item, img);
                }
            }
        });
    }

    setMasonrySpan(item, img) {
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        const spans = Math.ceil(aspectRatio * 30) + 10;
        item.style.setProperty('--row-span', spans);
    }

    // ==================== QUOTE SLIDER SYSTEM ====================
    setupQuoteSlider() {
        this.quotes = document.querySelectorAll('.quote-card');
        if (this.quotes.length === 0) return;
        
        // Set initial state
        this.quotes.forEach((quote, index) => {
            quote.classList.toggle('active', index === 0);
        });
        
        // Setup automatic slideshow
        this.startQuoteAutoplay();
        
        // Setup manual controls
        this.setupQuoteControls();
    }
    
    setupQuoteControls() {
        const prevBtn = document.querySelector('.quote-nav.prev');
        const nextBtn = document.querySelector('.quote-nav.next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.changeQuote(-1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.changeQuote(1));
        }
        
        // Pause autoplay on hover
        const quotesContainer = document.querySelector('.quotes-slider');
        if (quotesContainer) {
            quotesContainer.addEventListener('mouseenter', () => this.pauseQuoteAutoplay());
            quotesContainer.addEventListener('mouseleave', () => this.startQuoteAutoplay());
        }
        
        // Touch support for quotes
        this.setupQuoteTouchEvents();
    }
    
    setupQuoteTouchEvents() {
        const quotesContainer = document.querySelector('.quotes-slider');
        if (!quotesContainer) return;
        
        let startX = 0;
        
        quotesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        quotesContainer.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            const minSwipeDistance = 50;
            
            if (Math.abs(diff) > minSwipeDistance) {
                if (diff > 0) {
                    this.changeQuote(1); // Swipe left - next quote
                } else {
                    this.changeQuote(-1); // Swipe right - previous quote
                }
            }
        });
    }
    
    changeQuote(direction) {
        if (this.quotes.length === 0) return;
        
        // Remove active class from current quote
        this.quotes[this.currentQuoteIndex].classList.remove('active');
        
        // Calculate new index
        this.currentQuoteIndex += direction;
        if (this.currentQuoteIndex >= this.quotes.length) {
            this.currentQuoteIndex = 0;
        } else if (this.currentQuoteIndex < 0) {
            this.currentQuoteIndex = this.quotes.length - 1;
        }
        
        // Add active class to new quote
        this.quotes[this.currentQuoteIndex].classList.add('active');
        
        // Update indicators if they exist
        this.updateQuoteIndicators();
        
        // Reset autoplay timer
        this.startQuoteAutoplay();
        
        // Analytics
        this.performanceMetrics.interactionCount++;
    }
    
    updateQuoteIndicators() {
        const indicators = document.querySelectorAll('.quote-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentQuoteIndex);
        });
    }
    
    startQuoteAutoplay() {
        this.pauseQuoteAutoplay(); // Clear existing timer
        
        this.quoteTimer = setInterval(() => {
            this.changeQuote(1);
        }, 5000); // Change every 5 seconds
    }
    
    pauseQuoteAutoplay() {
        if (this.quoteTimer) {
            clearInterval(this.quoteTimer);
            this.quoteTimer = null;
        }
    }

    // ==================== ANIMATION SYSTEM ====================
    initializeAnimations() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupLoadingAnimations();
        this.setupParallaxEffects();
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .art-card, .event-card, .gallery-item');
        
        this.observers.scroll = new IntersectionObserver(
            (entries) => this.handleScrollAnimations(entries),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        animatedElements.forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.setProperty('--animation-delay', `${index * 100}ms`);
            this.observers.scroll.observe(el);
        });
    }

    handleScrollAnimations(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    this.performanceMetrics.animationCount++;
                }, index * 50);
                
                this.observers.scroll.unobserve(entry.target);
            }
        });
    }

    setupHoverAnimations() {
        const hoverElements = document.querySelectorAll('.art-card, .event-card, .cta-button');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.triggerHoverAnimation(el, 'enter'));
            el.addEventListener('mouseleave', () => this.triggerHoverAnimation(el, 'leave'));
        });
    }

    triggerHoverAnimation(element, type) {
        if (type === 'enter') {
            element.style.transform = 'translateY(-10px) scale(1.02)';
            element.style.boxShadow = '0 20px 40px rgba(212, 175, 55, 0.2)';
        } else {
            element.style.transform = '';
            element.style.boxShadow = '';
        }
        
        this.performanceMetrics.animationCount++;
    }

    setupLoadingAnimations() {
        const buttons = document.querySelectorAll('.cta-button, .layout-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => this.triggerLoadingAnimation(btn));
        });
    }

    triggerLoadingAnimation(button) {
        if (button.classList.contains('loading')) return;
        
        button.classList.add('loading');
        button.style.pointerEvents = 'none';
        
        setTimeout(() => {
            button.classList.remove('loading');
            button.style.pointerEvents = '';
        }, 1000);
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero-image, .section-title');
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const rate = scrolled * -0.2;
                el.style.transform = `translateY(${rate}px)`;
            });
        };
        
        // Throttled parallax effect
        let parallaxFrame;
        window.addEventListener('scroll', () => {
            if (parallaxFrame) cancelAnimationFrame(parallaxFrame);
            parallaxFrame = requestAnimationFrame(updateParallax);
        });
    }

    // ==================== PERFORMANCE OPTIMIZATION ====================
    setupPerformanceOptimizations() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupMemoryManagement();
    }

    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        this.observers.lazy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.onload = () => img.classList.add('loaded');
                    this.observers.lazy.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            this.observers.lazy.observe(img);
        });
    }

    setupImageOptimization() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.style.filter = 'blur(0)';
                img.style.transition = 'filter 0.3s ease';
            });
            
            // Progressive loading effect
            if (img.loading === 'lazy') {
                img.style.filter = 'blur(5px)';
            }
        });
    }

    setupMemoryManagement() {
        // Clean up event listeners on page unload
        window.addEventListener('beforeunload', () => {
            Object.values(this.observers).forEach(observer => {
                if (observer.disconnect) observer.disconnect();
            });
            
            // Clean up quote timer
            this.pauseQuoteAutoplay();
        });
        
        // Throttle resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.handleResize(), 250);
        });
    }

    // ==================== EVENT HANDLERS ====================
    handlePageLoad() {
        document.body.classList.add('loaded');
        this.performanceMetrics.loadTime = performance.now() - this.performanceMetrics.loadTime;
        
        // Initialize masonry layout after images load
        setTimeout(() => this.calculateMasonryLayout(), 1000);
        
        console.log(`🚀 Page loaded in ${this.performanceMetrics.loadTime.toFixed(2)}ms`);
    }

    handleScroll() {
        // Throttled scroll handling is done in individual methods
        // This is kept minimal for performance
        if (this.animationFrame) return;
        
        this.animationFrame = requestAnimationFrame(() => {
            // Update scroll-dependent animations here if needed
            this.animationFrame = null;
        });
    }

    handleResize() {
        // Recalculate masonry layout on resize
        if (document.querySelector('[data-layout="masonry"]')) {
            this.calculateMasonryLayout();
        }
        
        // Update gallery item sizes if needed
        this.updateGalleryItemSizes();
    }

    handleKeyboard(e) {
        if (!this.isLightboxOpen) return;
        
        switch (e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                this.navigateLightbox(1);
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                this.navigateLightbox(-1);
                break;
            case 'Home':
                e.preventDefault();
                this.openLightbox(0);
                break;
            case 'End':
                e.preventDefault();
                this.openLightbox(this.galleryItems.length - 1);
                break;
        }
    }

    handleError(error) {
        console.error('🔥 Website Error:', error);
        
        // Graceful error handling
        if (error.target && error.target.tagName === 'IMG') {
            error.target.style.display = 'none';
        }
    }

    // ==================== UTILITY METHODS ====================
    updateGalleryItemSizes() {
        // Update gallery item sizes for responsive design
        const items = document.querySelectorAll('.gallery-item');
        items.forEach(item => {
            // Trigger reflow for proper sizing
            item.style.transform = 'scale(0.99)';
            requestAnimationFrame(() => {
                item.style.transform = '';
            });
        });
    }

    setupObservers() {
        // Central observer management
        this.observers = {};
    }

    logPerformanceMetrics() {
        const metrics = {
            ...this.performanceMetrics,
            totalTime: performance.now(),
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
        
        console.log('📊 Performance Metrics:', metrics);
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_metrics', metrics);
        }
    }
}

// ==================== GLOBAL FUNCTIONS FOR HTML ====================

// Quote slider functions for HTML onclick handlers
function changeQuote(direction) {
    if (window.martialArtsWebsite) {
        window.martialArtsWebsite.changeQuote(direction);
    }
}

// ==================== ADDITIONAL UTILITIES ====================

// Smooth scroll utility with custom easing
function smoothScrollTo(target, duration = 1000, easing = 'easeInOutCubic') {
    const targetPosition = target.offsetTop - 100;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    const easingFunctions = {
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        easeOutQuart: t => 1 - (--t) * t * t * t,
        easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
    };

    const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easingFunctions[easing](progress);
        
        window.scrollTo(0, startPosition + distance * easedProgress);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    };

    requestAnimationFrame(animation);
}

// Throttle utility for performance
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// Debounce utility for performance
function debounce(func, delay) {
    let timeoutId;
    
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Initialize the website when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.martialArtsWebsite = new MartialArtsWebsite();
    
    // Add global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Alt + H = Home
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            smoothScrollTo(document.getElementById('home') || document.body);
        }
        
        // Alt + G = Gallery
        if (e.altKey && e.key === 'g') {
            e.preventDefault();
            const gallery = document.getElementById('gallery');
            if (gallery) smoothScrollTo(gallery);
        }
        
        // Alt + E = Events
        if (e.altKey && e.key === 'e') {
            e.preventDefault();
            const events = document.getElementById('events');
            if (events) smoothScrollTo(events);
        }
    });
    
    console.log('🥋✨ Martial Arts Website Masterpiece Ready!');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MartialArtsWebsite, smoothScrollTo, throttle, debounce };
}
