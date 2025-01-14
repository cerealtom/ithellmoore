document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return console.error("Gallery not found");

    const grid = gallery.querySelector('.grid');
    if (!grid) return console.error("Grid not found");

    const gridItems = grid.querySelectorAll('.grid-item'); // Select grid items
    if (gridItems.length === 0) return console.warn("No grid items found");

    const images = grid.querySelectorAll('.grid-item img'); // Select images inside grid items
    if (images.length === 0) return console.warn("No images found");

    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return console.error("Lightbox not found");
    const lightboxImg = lightbox.querySelector('img');
    const caption = lightbox.querySelector('#caption');
    const closeButton = lightbox.querySelector('.close');
    const prevButton = lightbox.querySelector('.prev');
    const nextButton = lightbox.querySelector('.next');

    let currentImageIndex = 0;

    imagesLoaded(grid, () => {
        const msnry = new Masonry(grid, { itemSelector: '.grid-item', gutter: 10 });
        msnry.layout(); // Initial layout

        let imagesLoadedCount = 0;
        images.forEach(img => {
            if (img.complete) {
              imagesLoadedCount++
              if (imagesLoadedCount === images.length) {
                msnry.layout()
              }
            } else {
              img.addEventListener('load', () => {
                imagesLoadedCount++
                msnry.layout()
                if(imagesLoadedCount === images.length) {
                  msnry.layout()
                }
              });
            }
        });

        window.addEventListener('resize', () => {
            msnry.layout();
        });

        grid.style.display = 'none';
        grid.offsetHeight;
        grid.style.display = 'block';
    });


    // Corrected Lightbox Event Listeners (AFTER Masonry initialization)
    images.forEach((img, index) => { // Use index for correct image selection
        img.addEventListener('click', () => {
            currentImageIndex = index;
            showLightbox(img);
        });
    });

    closeButton.addEventListener('click', closeLightbox);
    prevButton.addEventListener('click', showPrevious);
    nextButton.addEventListener('click', showNext);

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeLightbox();
        else if (event.key === 'ArrowLeft') showPrevious();
        else if (event.key === 'ArrowRight') showNext();
    });

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Lightbox Functions (same as before)
    function showLightbox(img) {
        lightboxImg.src = img.dataset.full;
        lightboxImg.alt = img.alt;
        caption.innerHTML = img.dataset.caption || '';
        lightbox.style.display = 'flex';
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
    }

    function showPrevious() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        showLightbox(images[currentImageIndex]);
    }

    function showNext() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        showLightbox(images[currentImageIndex]);
    }
});