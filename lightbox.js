// Lightbox Gallery Functionality
class MartialArtsLightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightbox-image');
        this.lightboxTitle = document.querySelector('.lightbox-title');
        this.lightboxCounter = document.querySelector('.lightbox-counter');
        this.closeBtn = document.querySelector('.lightbox-close');
        this.prevBtn = document.querySelector('.lightbox-prev');
        this.nextBtn = document.querySelector('.lightbox-next');
        this.overlay = document.querySelector('.lightbox-overlay');
        
        this.galleryItems = [];
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        // Get all gallery items
        this.galleryItems = Array.from(document.querySelectorAll('[data-lightbox="gallery"]'));
        
        // Add click listeners to gallery items
        this.galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => this.openLightbox(index));
        });
        
        // Add event listeners
        this.closeBtn.addEventListener('click', () => this.closeLightbox());
        this.prevBtn.addEventListener('click', () => this.prevImage());
        this.nextBtn.addEventListener('click', () => this.nextImage());
        this.overlay.addEventListener('click', () => this.closeLightbox());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Prevent body scroll when lightbox is open
        this.lightbox.addEventListener('transitionend', () => {
            if (this.lightbox.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    openLightbox(index) {
        this.currentIndex = index;
        this.updateLightbox();
        this.lightbox.classList.add('active');
        this.lightbox.setAttribute('aria-hidden', 'false');
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        this.lightbox.setAttribute('aria-hidden', 'true');
    }
    
    prevImage() {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.galleryItems.length - 1;
        this.updateLightbox();
    }
    
    nextImage() {
        this.currentIndex = this.currentIndex < this.galleryItems.length - 1 ? this.currentIndex + 1 : 0;
        this.updateLightbox();
    }
    
    updateLightbox() {
        const currentItem = this.galleryItems[this.currentIndex];
        const img = currentItem.querySelector('img');
        
        // Update image
        this.lightboxImg.src = img.src;
        this.lightboxImg.alt = img.alt;
        
        // Update title
        this.lightboxTitle.textContent = img.alt || 'Martial Arts Gallery';
        
        // Update counter
        this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.galleryItems.length}`;
        
        // Add loading effect
        this.lightboxImg.style.opacity = '0';
        this.lightboxImg.onload = () => {
            this.lightboxImg.style.opacity = '1';
        };
    }
    
    handleKeyboard(e) {
        if (!this.lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.prevImage();
                break;
            case 'ArrowRight':
                this.nextImage();
                break;
        }
    }
}

// Initialize lightbox when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MartialArtsLightbox();
});

// Add smooth scroll to gallery section when clicking gallery links
document.addEventListener('DOMContentLoaded', () => {
    const galleryLinks = document.querySelectorAll('a[href="#gallery"]');
    galleryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('gallery').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
