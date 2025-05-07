document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery filtering functionality
    initGalleryFilter();
    
    // Initialize modal functionality
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const closeModal = document.querySelector('.close-modal');
    const prevBtn = document.getElementById('prev-img');
    const nextBtn = document.getElementById('next-img');
    
    let currentImageIndex = 0;
    let images = [];
    
    // Get all view buttons and set up click events
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            currentImageIndex = index;
            images = Array.from(viewButtons).map(btn => ({
                src: btn.getAttribute('data-image'),
                title: btn.getAttribute('data-title'),
                desc: btn.getAttribute('data-desc')
            }));
            openModal(images[currentImageIndex]);
        });
    });
    
    // Open modal with image data
    function openModal(imageData) {
        modalImg.src = imageData.src;
        modalTitle.textContent = imageData.title;
        modalDesc.textContent = imageData.desc;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Close modal
    function closeModalFunc() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Re-enable scrolling
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
    
    // Event listeners
    closeModal.addEventListener('click', closeModalFunc);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalFunc();
        }
    });
    
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);
    
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
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Filter gallery items
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
});