document.addEventListener('DOMContentLoaded', () => {
    
    // --- SVG SCROLL-DRAW EFFECT ---
    const svg = document.getElementById('scroll-svg');
    const path = document.getElementById('road-path');
    
    if (svg && path) {
        
        const updateSVG = () => {
            // Get actual dimensions
            const w = document.documentElement.clientWidth;
            const h = document.documentElement.scrollHeight;
            
            // Set viewBox to match exactly 1:1 with pixels
            svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
            
            // Create a curvy path in real pixel coordinates
            // Starts top center, curves right, then left, ends bottom center
            const d = `M ${w/2},0 C ${w*0.9},${h*0.2} ${w*0.1},${h*0.4} ${w/2},${h*0.5} C ${w*0.9},${h*0.6} ${w*0.1},${h*0.8} ${w/2},${h}`;
            path.setAttribute('d', d);
            
            // Now getTotalLength() returns exact pixels
            const pathLength = path.getTotalLength();
            
            // Setup dash array
            path.style.strokeDasharray = pathLength + ' ' + pathLength;
            
            // Calculate how much to draw based on scroll
            const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
            const totalHeight = h - document.documentElement.clientHeight;
            
            // Calculate how much to draw based on scroll
            let scrollFraction = totalHeight > 0 ? (scrollPosition / totalHeight) : 0;
            
            // Starts at 5% visible at the top, and smoothly reaches exactly 100% at the very bottom
            let scrollPercentage = 0.05 + (0.95 * scrollFraction);
            
            if (scrollPercentage < 0) scrollPercentage = 0;
            if (scrollPercentage > 1) scrollPercentage = 1;
            
            const drawLength = pathLength * scrollPercentage;
            
            // We use stroke-dashoffset to hide the part we haven't scrolled to yet.
            path.style.strokeDashoffset = pathLength - drawLength;
        };

        // Optional: add a tiny transition so the drawing is smoother between scroll events
        path.style.transition = 'stroke-dashoffset 0.1s ease-out';

        window.addEventListener('scroll', updateSVG);
        window.addEventListener('resize', updateSVG);
        
        // Trigger once to draw initial state
        updateSVG();
        // Give the layout a tick to settle, then update again to be sure
        setTimeout(updateSVG, 100);
    }
    
    
    // --- 3D CAR ROTATION EFFECT ---
    const rotatingCar3D = document.getElementById('rotating-car');
    
    if (rotatingCar3D && rotatingCar3D.tagName === 'MODEL-VIEWER') {
        const updateCarRotation = () => {
            const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
            
            // Baza kąta: zaczynamy od -45 stopni
            const baseAngle = -45;
            // Prędkość obrotu: inna dla urządzeń mobilnych (gdzie scrolluje się więcej pikseli)
            const isMobile = window.innerWidth <= 768;
            const scrollFactor = isMobile ? 0.2 : 0.35;
            
            const newAngle = baseAngle + (scrollPosition * scrollFactor);
            
            // Format: theta phi radius (np. "45deg 75deg 3m")
            rotatingCar3D.setAttribute('camera-orbit', `${newAngle}deg 75deg 3m`);
        };
        
        window.addEventListener('scroll', updateCarRotation);
        // Ustawienie początkowe
        updateCarRotation();
    }
    
    // --- REVEAL ANIMATIONS ON SCROLL ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- MOBILE MENU ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // Zamykanie menu po kliknięciu w link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
