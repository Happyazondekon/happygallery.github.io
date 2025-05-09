document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery filtering functionality
    initGalleryFilter();
    
    // Initialize modal functionality
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const closeModalBtn = document.getElementById('close-modal-btn'); // Nouveau sélecteur par ID
    const prevBtn = document.getElementById('prev-img');
    const nextBtn = document.getElementById('next-img');
    
    let currentImageIndex = 0;
    let images = [];
    
    // Function to load image with progressive enhancement
    function loadImage(imgElement, src, callback) {
        // Afficher d'abord une version floue si l'image n'est pas déjà chargée
        if (!imgElement.complete || imgElement.naturalWidth === 0) {
            imgElement.style.opacity = '0.5';
            imgElement.style.filter = 'blur(10px)';
        }
        
        const img = new Image();
        img.onload = function() {
            imgElement.src = src;
            imgElement.style.opacity = '1';
            imgElement.style.filter = 'blur(0)';
            imgElement.classList.add('loaded');
            if (callback) callback();
        };
        img.onerror = function() {
            console.error('Error loading image:', src);
            // Fallback si l'image ne charge pas
            imgElement.style.opacity = '1';
            imgElement.style.filter = 'none';
        };
        img.src = src;
    }
    
    // Preload all gallery images
    function preloadGalleryImages() {
        const galleryImages = document.querySelectorAll('.gallery-image img');
        galleryImages.forEach(img => {
            const src = img.getAttribute('src');
            // Don't try to preload empty src
            if (!src) return;
            
            // Charger l'image mais ne pas l'afficher tout de suite
            img.style.opacity = '0';
            loadImage(img, src);
        });
    }
    
    // Get all view buttons and set up click events
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Skip buttons with no image source
            if (!this.getAttribute('data-image')) return;
            
            currentImageIndex = index;
            images = Array.from(viewButtons).map(btn => ({
                src: btn.getAttribute('data-image'),
                title: btn.getAttribute('data-title') || '',
                desc: btn.getAttribute('data-desc') || ''
            })).filter(img => img.src); // Filter out empty sources
            
            openModal(images[currentImageIndex]);
        });
    });
    
    // Open modal with image data
    function openModal(imageData) {
        modalImg.classList.remove('loaded');
        modalImg.classList.add('loading');
        
        // Afficher d'abord une version floue
        modalImg.style.opacity = '0.5';
        modalImg.style.filter = 'blur(10px)';
        modalImg.src = imageData.src;
        
        loadImage(modalImg, imageData.src, function() {
            modalImg.classList.remove('loading');
            modalImg.classList.add('loaded');
            modalTitle.textContent = imageData.title;
            modalDesc.textContent = imageData.desc;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close modal
    function closeModalFunc() {
        console.log('Closing modal');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // Navigation functions
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        openModal(images[currentImageIndex]);
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        openModal(images[currentImageIndex]);
    }
    
    // Event listeners - NOUVEAU CODE pour le bouton de fermeture
    if (closeModalBtn) {
        console.log('Close button found:', closeModalBtn);
        
        closeModalBtn.addEventListener('click', function() {
            console.log('Close button clicked');
            closeModalFunc();
        });
    } else {
        console.error('Close modal button not found! Make sure you have updated the HTML.');
        
        // Fallback: try to add a close button if it doesn't exist
        if (document.querySelector('.modal-content') && !document.getElementById('close-modal-btn')) {
            console.log('Adding fallback close button');
            const fallbackBtn = document.createElement('button');
            fallbackBtn.id = 'close-modal-btn';
            fallbackBtn.className = 'close-modal-btn';
            fallbackBtn.innerHTML = '<i class="fas fa-times"></i>';
            fallbackBtn.setAttribute('aria-label', 'Fermer');
            
            document.querySelector('.modal-content').prepend(fallbackBtn);
            
            fallbackBtn.addEventListener('click', function() {
                console.log('Fallback close button clicked');
                closeModalFunc();
            });
        }
    }
    
    // Click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalFunc();
        }
    });
    
    // Navigation buttons
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);
    
    // Add touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    modalImg.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    modalImg.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            showNextImage(); // Swipe left, next image
        } else if (touchEndX > touchStartX + 50) {
            showPrevImage(); // Swipe right, prev image
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('show')) {
            if (e.key === 'Escape') {
                closeModalFunc();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            }
        }
    });
    
    // Initialize gallery filtering
    function initGalleryFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filterValue === 'all') {
                        item.style.display = 'block';
                    } else if (item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Start preloading images when page loads
    preloadGalleryImages();
    
    // Fallback si les images prennent trop de temps à charger
    setTimeout(() => {
        document.querySelectorAll('.gallery-image img').forEach(img => {
            if (!img.classList.contains('loaded')) {
                img.style.opacity = '1';
                img.style.filter = 'none';
            }
        });
    }, 5000); // Après 5 secondes, afficher les images même si pas complètement chargées
});