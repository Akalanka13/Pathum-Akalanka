// main.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Interactive Parallax & Float for floating elements
    // Now selecting both shapes and bg-logos for the parallax effect
    const floatingElements = document.querySelectorAll('.shape, .bg-logo');
    const cursorGlow = document.querySelector('.cursor-glow');
    let mouseX = 0;
    let mouseY = 0;
    let time = 0;

    document.addEventListener('mousemove', (e) => {
        // Calculate mouse position relative to center of screen (-0.5 to 0.5)
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;

        // Update custom cursor position using transform for performance
        if (cursorGlow) {
            // Circle is 30x30, so offset by 15px to center exactly on pointer
            cursorGlow.style.transform = `translate(${e.clientX - 15}px, ${e.clientY - 15}px)`;
            // Ensure no pointer events grab interaction
            cursorGlow.style.pointerEvents = 'none';
        }
    });

    const animateShapes = () => {
        time += 0.02; // Adjust time speed for float
        floatingElements.forEach((el, index) => {
            // Check if it's a shape or a logo
            const isLogo = el.classList.contains('bg-logo');

            // Parallax target based on mouse
            const parallaxMultiplier = isLogo ? 15 : 30; // Less parallax for logos
            const targetX = mouseX * (index + 1) * parallaxMultiplier;
            const targetY = mouseY * (index + 1) * parallaxMultiplier;

            if (!isLogo) {
                // Shapes get both parallax and JS sine wave float
                const floatY = Math.sin(time + index * 2) * 20;
                const rot = Math.sin(time * 0.5 + index) * 3;
                el.style.transform = `translate(${targetX}px, ${targetY + floatY}px) rotate(${rot}deg)`;
            } else {
                // Logos only get parallax appended CSS variable so keyframes can still run
                // We inject CSS variables that the keyframes could use, or just use margin/top for parallax
                // To avoid overriding the animation's transform, we apply the parallax to the margin instead
                el.style.marginLeft = `${targetX}px`;
                el.style.marginTop = `${targetY}px`;
            }
        });
        requestAnimationFrame(animateShapes);
    };

    animateShapes();

    // 2. Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Targets to animate on scroll
    const targets = document.querySelectorAll('.project-card, .service-item, .contact-form-container, .section-title');
    targets.forEach(target => {
        target.classList.add('fade-in-up');
        observer.observe(target);
    });

    // 3. Slideshow Logic
    const track = document.querySelector('.slideshow-track');
    if (track) {
        const cards = Array.from(track.children);
        const nextButton = document.querySelector('.next-slide');
        const prevButton = document.querySelector('.prev-slide');
        const dotsNav = document.querySelector('.slideshow-dots');
        
        let currentIndex = 0;

        // Create dots
        cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.dataset.index = index;
            dotsNav.appendChild(dot);
        });

        const dots = Array.from(dotsNav.children);

        const getCardWidth = () => {
            if (!cards[0]) return 0;
            const cardWidth = cards[0].getBoundingClientRect().width;
            const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
            return cardWidth + gap;
        };

        const updateTrackPosition = () => {
            if (!cards[0]) return;
            const trackWrapperWidth = document.querySelector('.slideshow-track-wrapper').getBoundingClientRect().width;
            const cardWidth = getCardWidth();
            const visibleCards = Math.max(1, Math.floor(trackWrapperWidth / cardWidth));
            const maxIndex = Math.max(0, cards.length - visibleCards);
            
            if (currentIndex > maxIndex) {
                currentIndex = 0;
            }
            if (currentIndex < 0) {
                currentIndex = Math.max(0, maxIndex);
            }
            
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            dots.forEach(dot => dot.classList.remove('active'));
            if(dots[currentIndex]) {
                dots[currentIndex].classList.add('active');
            }
        };

        const moveToNextSlide = () => {
            const trackWrapperWidth = document.querySelector('.slideshow-track-wrapper').getBoundingClientRect().width;
            let cardWidth = getCardWidth();
            // Fallback for very first load sometimes returning 0
            if (cardWidth === 0) cardWidth = 280; 
            
            const maxIndex = Math.max(0, cards.length - Math.floor(trackWrapperWidth / cardWidth));
            
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateTrackPosition();
        };

        const moveToPrevSlide = () => {
            const trackWrapperWidth = document.querySelector('.slideshow-track-wrapper').getBoundingClientRect().width;
            let cardWidth = getCardWidth();
            if (cardWidth === 0) cardWidth = 280;

            const maxIndex = Math.max(0, cards.length - Math.floor(trackWrapperWidth / cardWidth));
            
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = maxIndex;
            }
            updateTrackPosition();
        };

        if (nextButton) nextButton.addEventListener('click', () => {
            moveToNextSlide();
            resetAutoPlay();
        });

        if (prevButton) prevButton.addEventListener('click', () => {
            moveToPrevSlide();
            resetAutoPlay();
        });

        if (dotsNav) dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('.dot');
            if (!targetDot) return;
            
            currentIndex = parseInt(targetDot.dataset.index);
            updateTrackPosition();
            resetAutoPlay();
        });

        window.addEventListener('resize', updateTrackPosition);

        // Auto-play
        let autoPlayInterval = setInterval(moveToNextSlide, 3500);

        const resetAutoPlay = () => {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(moveToNextSlide, 3500);
        };
        
        // Pause auto-play on hover
        track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        track.addEventListener('mouseleave', () => resetAutoPlay());
    }
});
