/* ===== Animation Scripts ===== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initializeParallaxEffect();
    initializeTextAnimations();
    initializeImageAnimations();
    initializeCounters();
});

/**
 * Add parallax scrolling effect to specified elements
 */
function initializeParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.hero, .page-header');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(element => {
            // Move background image at a different rate than scroll
            const speed = 0.5; // Lower values create more subtle effect
            element.style.backgroundPositionY = `${scrollY * speed}px`;
        });
    });
}

/**
 * Add text reveal animations for headings and paragraphs
 */
function initializeTextAnimations() {
    // Text animation for hero section
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        // Add a small delay for better visual appearance after page load
        setTimeout(() => {
            heroContent.classList.add('animate');
        }, 300);
    }
    
    // Animate section titles when they come into view
    const animatedTexts = document.querySelectorAll('.section-title, .lead, .about-content p');
    
    if ('IntersectionObserver' in window) {
        const textObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add staggered delay based on element position
                    const delay = Array.from(animatedTexts).indexOf(entry.target) * 100;
                    setTimeout(() => {
                        entry.target.classList.add('text-animate');
                    }, delay);
                    textObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        animatedTexts.forEach(text => {
            textObserver.observe(text);
            // Set initial state
            text.classList.add('text-hidden');
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        animatedTexts.forEach(text => {
            text.classList.add('text-animate');
        });
    }
}

/**
 * Add animations for images and gallery items
 */
function initializeImageAnimations() {
    const images = document.querySelectorAll('.about-image img, .book-image img, .collection-item img, .gallery-item img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('image-animate');
                    imageObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        images.forEach(image => {
            imageObserver.observe(image);
            // Set initial state
            image.classList.add('image-hidden');
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach(image => {
            image.classList.add('image-animate');
        });
    }
    
    // Add hover animations for gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        item.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
}

/**
 * Add animated counters for stats (can be used in About page)
 */
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0 && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const countTo = parseInt(target.getAttribute('data-count'), 10);
                    let current = 0;
                    const increment = countTo > 100 ? Math.ceil(countTo / 50) : 1;
                    const duration = 1500; // ms
                    const step = Math.ceil(duration / (countTo / increment));
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current <= countTo) {
                            target.textContent = current;
                            setTimeout(updateCounter, step);
                        } else {
                            target.textContent = countTo; // Ensure we hit the exact target
                        }
                    };
                    
                    updateCounter();
                    counterObserver.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
}

/**
 * Add scroll-triggered animations for sections
 * This is called from main.js but implemented here for cleaner separation
 */
function animateSections() {
    const sections = document.querySelectorAll('section');
    
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-animate');
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => {
            sectionObserver.observe(section);
            section.classList.add('section-hidden');
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        sections.forEach(section => {
            section.classList.add('section-animate');
        });
    }
}

// Export functions to be used in other scripts
window.animateElements = {
    animateSections: animateSections
};