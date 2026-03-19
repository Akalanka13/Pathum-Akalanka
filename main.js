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
});
