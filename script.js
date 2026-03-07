/* ============================================
   BRANDON MICHELSON - PORTFOLIO SCRIPTS
   GSAP Animations + Lenis Smooth Scroll
   ============================================ */

// ============================================
// LENIS SMOOTH SCROLL INITIALIZATION
// ============================================
const lenis = new Lenis({
    lerp: 0.08,              // Smoothing factor (lower = smoother)
    smoothWheel: true,       // Smooth mousewheel scrolling
    syncTouch: true,         // Smooth touch scrolling
    touchMultiplier: 1.5,    // Touch scroll sensitivity
    wheelMultiplier: 0.8,    // Wheel scroll sensitivity
    autoResize: false,       // Prevent resize recalculations from iOS address bar
});

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// ============================================
// GSAP SETUP
// ============================================
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

// Detect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================
// ELEMENT REFERENCES
// ============================================
const badgeVideo = document.getElementById('badge-video');

// Start badge video on load
if (badgeVideo) badgeVideo.play().catch(() => {});

// Hash navigation — for "Back to Projects" links from case studies
const hasHash = !!window.location.hash;
if (hasHash) {
    // Show all hero elements instantly (skip intro animations)
    document.querySelectorAll('.hero .gs-reveal').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });
    const nf = document.querySelector('.name-first');
    const nl = document.querySelector('.name-last');
    if (nf) { nf.style.strokeDashoffset = '0'; nf.style.fill = '#ffffff'; }
    if (nl) { nl.style.strokeDashoffset = '0'; nl.style.strokeWidth = '2'; }

    setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) target.scrollIntoView({ behavior: 'auto' });
        ScrollTrigger.refresh();
    }, 100);
}

// ============================================
// NAVIGATION — Staggered Menu (vanilla JS)
// ============================================
const header = document.getElementById('siteHeader');


// =========================================
// STAGGERED MENU — Vanilla JS
// =========================================
(function staggeredMenu() {
    const wrapper = document.getElementById('staggeredMenu');
    const panel = document.getElementById('staggered-menu-panel');
    const toggleBtn = document.getElementById('menuToggle');
    const menuIcon = document.getElementById('menuIcon');
    const textInner = document.getElementById('toggleTextInner');
    const prelayers = document.querySelectorAll('.sm-prelayer');

    const menuRobot = document.getElementById('menuRobot');

    // Robot swipe loop config — adjust these timestamps to match the video
    const SWIPE_START = 4.5;  // seconds — start of swipe action
    const SWIPE_END = 5.5;    // seconds — end of swipe action
    const IDLE_FRAME = 0.5;   // seconds — the still frame shown when idle
    let robotHovering = false;

    if (!wrapper || !panel || !toggleBtn) return;

    let isOpen = false;
    let busy = false;
    let openTl = null;
    let closeTween = null;

    // Initial state — push everything offscreen right
    gsap.set([panel, ...prelayers], { xPercent: 100 });
    gsap.set(menuIcon, { rotate: 0, transformOrigin: '50% 50%' });
    gsap.set(textInner, { yPercent: 0 });

    function openMenu() {
        if (busy) return;
        busy = true;
        isOpen = true;
        wrapper.setAttribute('data-open', '');
        toggleBtn.setAttribute('aria-expanded', 'true');
        panel.setAttribute('aria-hidden', 'false');

        // Stop Lenis scroll while menu is open
        if (typeof lenis !== 'undefined') lenis.stop();

        if (closeTween) { closeTween.kill(); closeTween = null; }
        if (openTl) { openTl.kill(); }

        // Reset items for entrance
        const labels = panel.querySelectorAll('.sm-panel-itemLabel');
        const numbers = panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item');
        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = panel.querySelectorAll('.sm-socials-link');

        gsap.set(labels, { yPercent: 140, rotate: 10 });
        gsap.set(numbers, { '--sm-num-opacity': 0 });
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        gsap.set(socialLinks, { y: 25, opacity: 0 });

        openTl = gsap.timeline({
            onComplete: () => { busy = false; }
        });

        // Phase 1: Prelayers slide in
        prelayers.forEach((layer, i) => {
            openTl.to(layer, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
        });

        // Phase 2: Panel slides in
        const panelStart = prelayers.length * 0.07 + 0.08;
        openTl.to(panel, { xPercent: 0, duration: 0.65, ease: 'power4.out' }, panelStart);

        // Phase 3: Items stagger in
        const itemsStart = panelStart + 0.65 * 0.15;
        if (labels.length) {
            openTl.to(labels, {
                yPercent: 0, rotate: 0,
                duration: 1, ease: 'power4.out',
                stagger: 0.1
            }, itemsStart);
        }
        if (numbers.length) {
            openTl.to(numbers, {
                '--sm-num-opacity': 1,
                duration: 0.6, ease: 'power2.out',
                stagger: 0.08
            }, itemsStart + 0.1);
        }

        // Phase 4: Socials fade in
        const socialsStart = panelStart + 0.65 * 0.4;
        if (socialTitle) {
            openTl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
        }
        if (socialLinks.length) {
            openTl.to(socialLinks, {
                y: 0, opacity: 1,
                duration: 0.55, ease: 'power3.out',
                stagger: 0.08
            }, socialsStart + 0.04);
        }

        // Robot slide-up entrance — paused on idle frame
        if (menuRobot) {
            menuRobot.pause();
            menuRobot.currentTime = IDLE_FRAME;
            robotHovering = false;

            gsap.set(menuRobot, {
                visibility: 'visible',
                opacity: 0,
                yPercent: 40
            });

            gsap.to(menuRobot, {
                opacity: 1,
                yPercent: 0,
                duration: 0.8,
                delay: 0.6,
                ease: 'power3.out'
                // Video does NOT auto-play — waits for hover
            });
        }

        // Icon: plus → X
        gsap.to(menuIcon, { rotate: 225, duration: 0.8, ease: 'power4.out', overwrite: 'auto' });

        // Text: Menu → Close
        gsap.to(textInner, { yPercent: -50, duration: 0.5, ease: 'power4.out' });
    }

    function closeMenu() {
        if (!isOpen) return;
        isOpen = false;

        // Hide robot and reset
        if (menuRobot) {
            gsap.killTweensOf(menuRobot);
            gsap.set(menuRobot, { visibility: 'hidden', opacity: 0, yPercent: 40 });
            menuRobot.pause();
            menuRobot.currentTime = IDLE_FRAME;
            robotHovering = false;
        }
        wrapper.removeAttribute('data-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');

        // Resume Lenis scroll
        if (typeof lenis !== 'undefined') lenis.start();

        if (openTl) { openTl.kill(); openTl = null; }

        const all = [panel, ...prelayers];
        closeTween = gsap.to(all, {
            xPercent: 100,
            duration: 0.32,
            ease: 'power3.in',
            overwrite: 'auto',
            onComplete: () => {
                // Reset for next open
                const labels = panel.querySelectorAll('.sm-panel-itemLabel');
                const numbers = panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item');
                const socialTitle = panel.querySelector('.sm-socials-title');
                const socialLinks = panel.querySelectorAll('.sm-socials-link');
                gsap.set(labels, { yPercent: 140, rotate: 10 });
                gsap.set(numbers, { '--sm-num-opacity': 0 });
                if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
                gsap.set(socialLinks, { y: 25, opacity: 0 });
                busy = false;
            }
        });

        // Icon: X → plus
        gsap.to(menuIcon, { rotate: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' });

        // Text: Close → Menu
        gsap.to(textInner, { yPercent: 0, duration: 0.4, ease: 'power4.out' });
    }

    // Toggle
    toggleBtn.addEventListener('click', () => {
        if (isOpen) closeMenu();
        else openMenu();
    });

    // Close on clicking a nav link — precise close-then-scroll via onComplete
    panel.querySelectorAll('.sm-panel-item').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                if (!isOpen) return;
                isOpen = false;

                if (menuRobot) {
                    gsap.killTweensOf(menuRobot);
                    gsap.set(menuRobot, { visibility: 'hidden', opacity: 0, yPercent: 40 });
                    menuRobot.pause();
                    menuRobot.currentTime = IDLE_FRAME;
                    robotHovering = false;
                }

                wrapper.removeAttribute('data-open');
                toggleBtn.setAttribute('aria-expanded', 'false');
                panel.setAttribute('aria-hidden', 'true');

                // Resume Lenis scroll
                if (typeof lenis !== 'undefined') lenis.start();

                if (openTl) { openTl.kill(); openTl = null; }

                const all = [panel, ...prelayers];
                closeTween = gsap.to(all, {
                    xPercent: 100,
                    duration: 0.32,
                    ease: 'power3.in',
                    overwrite: 'auto',
                    onComplete: () => {
                        // Reset for next open
                        const labels = panel.querySelectorAll('.sm-panel-itemLabel');
                        const numbers = panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item');
                        const socialTitle = panel.querySelector('.sm-socials-title');
                        const socialLinks = panel.querySelectorAll('.sm-socials-link');
                        gsap.set(labels, { yPercent: 140, rotate: 10 });
                        gsap.set(numbers, { '--sm-num-opacity': 0 });
                        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
                        gsap.set(socialLinks, { y: 25, opacity: 0 });
                        busy = false;

                        // NOW scroll — animation is fully complete
                        const target = document.querySelector(href);
                        if (target) {
                            if (typeof lenis !== 'undefined') {
                                lenis.scrollTo(target, { offset: -80, duration: 0.8 });
                            } else {
                                target.scrollIntoView({ behavior: 'smooth' });
                            }
                        }
                    }
                });

                gsap.to(menuIcon, { rotate: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' });
                gsap.to(textInner, { yPercent: 0, duration: 0.4, ease: 'power4.out' });
            }
        });
    });

    // Close on click outside
    document.addEventListener('mousedown', (e) => {
        if (isOpen && panel && !panel.contains(e.target) && !toggleBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) closeMenu();
    });

    // =========================================
    // ROBOT SWIPE LOOP — Triggered by Nav Hover
    // =========================================

    // Looping logic: when video reaches SWIPE_END, jump back to SWIPE_START
    if (menuRobot) {
        menuRobot.addEventListener('timeupdate', () => {
            if (robotHovering && menuRobot.currentTime >= SWIPE_END) {
                menuRobot.currentTime = SWIPE_START;
            }
        });
    }

    function startSwipe() {
        if (!menuRobot || !isOpen) return;
        robotHovering = true;
        menuRobot.currentTime = SWIPE_START;
        menuRobot.play().catch(() => {});
    }

    function stopSwipe() {
        if (!menuRobot) return;
        robotHovering = false;
        menuRobot.pause();
        menuRobot.currentTime = IDLE_FRAME;
    }

    // Attach hover listeners to nav items
    const navItems = panel.querySelectorAll('.sm-panel-item');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', startSwipe);
        item.addEventListener('mouseleave', stopSwipe);
    });
})();

// Smooth scroll for non-menu anchor links (footer nav, etc.)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Skip staggered menu links (handled above)
    if (anchor.closest('.staggered-menu-panel')) return;
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            lenis.scrollTo(targetElement, {
                offset: -80,
                duration: 0.8,
            });
        }
    });
});

// =========================================
// HEADER SCROLL BACKGROUND
// =========================================
(function headerScroll() {
    const header = document.querySelector('.staggered-menu-header');
    const hero = document.getElementById('hero');
    if (!header || !hero || typeof ScrollTrigger === 'undefined') return;

    ScrollTrigger.create({
        trigger: hero,
        start: 'bottom top',
        onEnter: () => header.classList.add('header-scrolled'),
        onLeaveBack: () => header.classList.remove('header-scrolled'),
    });
})();

// =========================================
// ACTIVE LINK HIGHLIGHTING
// =========================================
(function activeLinks() {
    const sections = ['hero', 'projects', 'skills', 'about', 'contact'];
    const menuLinks = document.querySelectorAll('.sm-panel-item');
    if (!menuLinks.length || typeof ScrollTrigger === 'undefined') return;

    sections.forEach((id, index) => {
        const section = document.getElementById(id);
        if (!section || !menuLinks[index]) return;

        ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onToggle: (self) => {
                if (self.isActive) {
                    menuLinks.forEach(link => link.classList.remove('active'));
                    menuLinks[index].classList.add('active');
                }
            }
        });
    });
})();

// ============================================
// HERO ANIMATIONS (homepage only)
// ============================================
let heroTL;

const heroSection = document.querySelector('.hero');

if (heroSection && !prefersReducedMotion && !hasHash) {
    heroTL = gsap.timeline({
        delay: 0.3,
        defaults: { ease: 'expo.out' }
    });

    // Get SVG text elements for drawing animation
    const nameFirst = document.querySelector('.name-first');
    const nameLast = document.querySelector('.name-last');

    // Calculate stroke dash values based on text length
    if (nameFirst && nameLast) {
        const firstLength = nameFirst.getComputedTextLength ? nameFirst.getComputedTextLength() : 800;
        const lastLength = nameLast.getComputedTextLength ? nameLast.getComputedTextLength() : 900;

        gsap.set(nameFirst, {
            strokeDasharray: firstLength + 100,
            strokeDashoffset: firstLength + 100
        });
        gsap.set(nameLast, {
            strokeDasharray: lastLength + 100,
            strokeDashoffset: lastLength + 100
        });
    }

    // Lanyard dropdown animation with enhanced physics
    const lanyardContainer = document.getElementById('lanyardContainer');
    if (lanyardContainer) {
        const lanyardCard = lanyardContainer.querySelector('.lanyard-card');
        const lanyardString = lanyardContainer.querySelector('.lanyard-string');

        // Physics configuration
        const physics = {
            gravity: 9.8,
            damping: 0.92,          // Energy loss per frame (0-1)
            tension: 0.15,          // String tension (spring constant)
            maxAngle: 45,           // Maximum swing angle
            velocityThreshold: 0.1  // Min velocity to continue animation
        };

        // State tracking
        let currentAngle = 0;
        let angularVelocity = 0;
        let isDragging = false;
        let dragStartX = 0;
        let dragStartAngle = 0;

        // Set initial state
        gsap.set('.hero-image-wrapper.gs-reveal', {
            opacity: 1,
            visibility: 'visible'
        });
        gsap.set(lanyardContainer, {
            opacity: 0,
            y: -150,
            rotation: 0
        });

        // Enhanced drop animation with realistic physics
        heroTL.to(lanyardContainer, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'bounce.out'
        });

        // Initial swing with spring physics simulation
        heroTL.to(lanyardContainer, {
            rotation: 18,
            duration: 0.4,
            ease: 'power2.out',
            onUpdate: function () {
                updateStringTension(this.progress());
            }
        }, '-=0.2');

        // Damped oscillation sequence (realistic pendulum)
        const swingSequence = [
            { angle: -12, duration: 0.45 },
            { angle: 8, duration: 0.4 },
            { angle: -5, duration: 0.35 },
            { angle: 3, duration: 0.3 },
            { angle: -1.5, duration: 0.25 },
            { angle: 0.5, duration: 0.2 },
            { angle: 0, duration: 0.15 }
        ];

        swingSequence.forEach((swing, i) => {
            heroTL.to(lanyardContainer, {
                rotation: swing.angle,
                duration: swing.duration,
                ease: 'sine.inOut',
                onUpdate: function () {
                    updateStringTension(Math.abs(swing.angle) / physics.maxAngle);
                }
            });
        });

        // String tension visual feedback
        function updateStringTension(tension) {
            if (!lanyardString) return;
            const stretch = 1 + (tension * 0.08); // Max 8% stretch
            const curve = tension * 3; // Curve amount in degrees
            gsap.set(lanyardString, {
                scaleY: stretch,
                skewX: curve * (currentAngle > 0 ? 1 : -1)
            });
        }

        // Reset string to normal
        function resetString() {
            gsap.to(lanyardString, {
                scaleY: 1,
                skewX: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        }

        // Store reference for drag functionality (initialized after timeline)
        heroTL.call(() => {
            initDragPhysics();
        });

        // Initialize drag physics after intro animation
        function initDragPhysics() {
            if (!lanyardCard) return;

            // Mouse/touch drag handlers
            lanyardCard.addEventListener('mousedown', startDrag);
            lanyardCard.addEventListener('touchstart', startDrag, { passive: false });

            document.addEventListener('mousemove', onDrag);
            document.addEventListener('touchmove', onDrag, { passive: false });

            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchend', endDrag);

            // Cursor feedback
            lanyardCard.style.cursor = 'grab';
        }

        function startDrag(e) {
            e.preventDefault();
            isDragging = true;
            lanyardCard.style.cursor = 'grabbing';
            lanyardContainer.classList.add('dragging');

            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            dragStartX = clientX;
            dragStartAngle = gsap.getProperty(lanyardContainer, 'rotation');

            // Kill any existing animations
            gsap.killTweensOf(lanyardContainer);
        }

        function onDrag(e) {
            if (!isDragging) return;
            e.preventDefault();

            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const deltaX = clientX - dragStartX;

            // Convert pixel movement to angle (sensitivity adjustment)
            const sensitivity = 0.3;
            let newAngle = dragStartAngle + (deltaX * sensitivity);

            // Clamp to max angle with elastic feel at edges
            if (Math.abs(newAngle) > physics.maxAngle) {
                const overflow = Math.abs(newAngle) - physics.maxAngle;
                const elasticFactor = 1 / (1 + overflow * 0.05);
                newAngle = Math.sign(newAngle) * (physics.maxAngle + overflow * elasticFactor * 0.3);
            }

            currentAngle = newAngle;
            angularVelocity = deltaX * 0.1; // Track velocity for release

            gsap.set(lanyardContainer, { rotation: newAngle });
            updateStringTension(Math.abs(newAngle) / physics.maxAngle);
        }

        function endDrag() {
            if (!isDragging) return;
            isDragging = false;
            lanyardCard.style.cursor = 'grab';
            lanyardContainer.classList.remove('dragging');

            // Apply physics-based swing back
            applySwingPhysics();
        }

        function applySwingPhysics() {
            currentAngle = gsap.getProperty(lanyardContainer, 'rotation');

            function animate() {
                if (isDragging) return;

                // Spring force (Hooke's law) + damping
                const springForce = -physics.tension * currentAngle;
                angularVelocity += springForce;
                angularVelocity *= physics.damping;

                currentAngle += angularVelocity;

                // Update rotation
                gsap.set(lanyardContainer, { rotation: currentAngle });
                updateStringTension(Math.abs(currentAngle) / physics.maxAngle);

                // Continue animation if still moving
                if (Math.abs(angularVelocity) > physics.velocityThreshold || Math.abs(currentAngle) > 0.5) {
                    requestAnimationFrame(animate);
                } else {
                    // Settle to rest
                    gsap.to(lanyardContainer, {
                        rotation: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    resetString();
                }
            }

            animate();
        }

    } else {
        // Fallback if lanyard not found
        const heroImageWrapper = document.querySelector('.hero-image-wrapper.gs-reveal');
        if (heroImageWrapper) {
            heroTL.fromTo(heroImageWrapper,
                { opacity: 0, x: -80 },
                { opacity: 1, x: 0, duration: 1.4, visibility: 'visible' }
            );
        }
    }

    // Hero label
    heroTL.fromTo('.hero-label.gs-reveal',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, visibility: 'visible' },
        '-=1'
    );

    // SVG Name Drawing Animation - "Brandon"
    heroTL.to('.name-first', {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power2.inOut'
    }, '-=0.5');

    // SVG Name Drawing Animation - "Michelson" (starts slightly after)
    heroTL.to('.name-last', {
        strokeDashoffset: 0,
        duration: 1.8,
        ease: 'power2.inOut'
    }, '-=1.2');

    // Fill in "Brandon" after stroke completes
    heroTL.to('.name-first', {
        fill: '#ffffff',
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.8');

    // Fill in "Michelson" with outline effect
    heroTL.to('.name-last', {
        fill: 'transparent',
        strokeWidth: 2,
        stroke: '#ffffff',
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.4');

    // Hero subtitle
    heroTL.fromTo('.hero-subtitle.gs-reveal',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, visibility: 'visible' },
        '-=0.3'
    );

    // Hero CTA
    heroTL.fromTo('.hero-cta.gs-reveal',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, visibility: 'visible' },
        '-=0.6'
    );

    // Initialize text effects after subtitle and CTA are visible
    heroTL.call(() => {
        initGlitchEffect();
        initFallingText();
    });

    // Scroll indicator
    heroTL.fromTo('.scroll-indicator.gs-reveal',
        { opacity: 0 },
        { opacity: 1, duration: 1, visibility: 'visible' },
        '-=0.4'
    );

    // Enhanced lanyard idle animation and subtle movements
    const lanyardIdle = document.getElementById('lanyardContainer');
    if (lanyardIdle) {
        const lanyardStringIdle = lanyardIdle.querySelector('.lanyard-string');

        // Subtle idle breathing animation (after intro completes)
        heroTL.call(() => {
            // Gentle floating motion
            gsap.to(lanyardIdle, {
                y: '+=4',
                duration: 2.5,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1
            });

            // Very subtle rotation sway when idle
            gsap.to(lanyardIdle, {
                rotation: '+=1',
                duration: 3,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1
            });

            // String subtle pulse glow
            if (lanyardStringIdle) {
                gsap.to(lanyardStringIdle, {
                    boxShadow: '0 0 15px rgba(233, 69, 96, 0.4)',
                    duration: 2,
                    ease: 'sine.inOut',
                    yoyo: true,
                    repeat: -1
                });
            }
        }, null, '+=0.5');

        // Wind gust effect on random intervals
        function randomWindGust() {
            if (lanyardIdle.classList.contains('dragging')) {
                setTimeout(randomWindGust, 5000);
                return;
            }

            const gustStrength = (Math.random() - 0.5) * 8; // -4 to 4 degrees
            const gustDuration = 0.4 + Math.random() * 0.3;

            gsap.to(lanyardIdle, {
                rotation: `+=${gustStrength}`,
                duration: gustDuration,
                ease: 'power2.out',
                onComplete: () => {
                    gsap.to(lanyardIdle, {
                        rotation: 0,
                        duration: 1.2,
                        ease: 'elastic.out(1, 0.4)'
                    });
                }
            });

            // Random interval between gusts (8-15 seconds)
            const nextGust = 8000 + Math.random() * 7000;
            setTimeout(randomWindGust, nextGust);
        }

        // Start wind gusts after initial animation
        heroTL.call(() => {
            setTimeout(randomWindGust, 5000);
        }, null, '+=2');
    }

    // Hero parallax on scroll
    if (document.querySelector('.hero-content')) {
        gsap.to('.hero-content', {
            yPercent: -40,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.6
            }
        });
    }

    if (document.querySelector('.hero-image-wrapper')) {
        gsap.to('.hero-image-wrapper', {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.6
            }
        });
    }

    // Scroll indicator fade
    if (document.querySelector('.scroll-indicator')) {
        gsap.to('.scroll-indicator', {
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: '15% top',
                end: '30% top',
                scrub: 0.6
            }
        });
    }
} else if (heroSection && prefersReducedMotion) {
    // Reduced motion - just show elements
    document.querySelectorAll('.hero .gs-reveal').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });

    // Show SVG text immediately for reduced motion
    const nameFirst = document.querySelector('.name-first');
    const nameLast = document.querySelector('.name-last');
    if (nameFirst) {
        nameFirst.style.strokeDashoffset = '0';
        nameFirst.style.fill = '#ffffff';
    }
    if (nameLast) {
        nameLast.style.strokeDashoffset = '0';
        nameLast.style.strokeWidth = '2';
    }
}


// ============================================
// SCROLL REVEAL ANIMATIONS (safe - uses querySelectorAll)
// ============================================
function createReveal(selector, fromVars, duration = 1.2) {
    const elements = document.querySelectorAll(selector);

    if (!elements.length) return;

    if (prefersReducedMotion) {
        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        });
        return;
    }

    elements.forEach((el) => {
        gsap.fromTo(el,
            { opacity: 0, visibility: 'hidden', ...fromVars },
            {
                opacity: 1,
                visibility: 'visible',
                y: 0,
                x: 0,
                scale: 1,
                duration: duration,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
}

// Section headers
createReveal('.section-number.gs-reveal', { y: 40 }, 1);
createReveal('.section-title.gs-reveal', { y: 60 }, 1.2);
createReveal('.section-subtitle.gs-reveal', { y: 40 }, 1);

// Project sections - reveal when scrolled into view
createReveal('.project-section.gs-reveal', { y: 80 }, 1.4);

// ============================================
// SCROLL STACK ANIMATION FOR PROJECTS (homepage only)
// ============================================
function initScrollStack() {
    const projectsGrid = document.querySelector('.projects-grid');
    const projectCards = gsap.utils.toArray('.project-card.gs-reveal');

    if (!projectCards.length) return;

    // Scroll Stack Parameters
    const stackConfig = {
        pinPosition: 20,              // Cards pin at 20% from top
        baseScale: 0.85,              // Starting scale for stacked cards
        scaleDecrement: 0.03,         // Scale reduction per depth level
        blurIncrement: 2.5,           // Blur increase per depth level (px)
        stackDistance: 30,            // Vertical offset between stacked cards (px)
    };

    // Check if we're on desktop (stack effect works best on larger screens)
    const isDesktop = window.innerWidth > 768;

    if (isDesktop && !prefersReducedMotion) {
        // Activate scroll-stack mode
        if (projectsGrid) projectsGrid.classList.add('scroll-stack-active');

        // Set initial z-index for proper stacking order
        // Later cards get HIGHER z-index so they stack ON TOP of earlier cards
        // DJ Big Cali (1) -> Bearded Threads (2) -> RDR2 (3) -> TripleTen (4)
        projectCards.forEach((card, i) => {
            gsap.set(card, {
                zIndex: i + 1,  // First card = 1, second = 2, etc. (newer cards on top)
                opacity: 0,
                visibility: 'hidden'
            });
        });

        // Create scroll-stack effect for each card
        projectCards.forEach((card, index) => {
            const isLast = index === projectCards.length - 1;

            // Initial entrance animation
            gsap.to(card, {
                opacity: 1,
                visibility: 'visible',
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            });

            // Stack effect - when the NEXT card enters, THIS card scales down and blurs
            if (!isLast) {
                const nextCard = projectCards[index + 1];

                // Calculate final stacked state values
                const depth = index + 1;
                const finalScale = Math.max(stackConfig.baseScale - (depth * stackConfig.scaleDecrement), 0.7);
                const finalBlur = Math.min(depth * stackConfig.blurIncrement, 8);
                const finalY = depth * stackConfig.stackDistance;

                // Create the stacking animation tied to next card's scroll position
                gsap.to(card, {
                    scale: finalScale,
                    filter: `blur(${finalBlur}px)`,
                    y: finalY,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: nextCard,
                        start: 'top 85%',
                        end: `top ${stackConfig.pinPosition}%`,
                        scrub: 0.6,
                    }
                });
            }
        });

    } else {
        // Mobile/Tablet or reduced motion - simple stagger fade in
        projectCards.forEach((card, i) => {
            if (prefersReducedMotion) {
                card.style.opacity = '1';
                card.style.visibility = 'visible';
            } else {
                gsap.fromTo(card,
                    { opacity: 0, visibility: 'hidden', y: 60 },
                    {
                        opacity: 1,
                        visibility: 'visible',
                        y: 0,
                        duration: 1,
                        delay: i * 0.1,
                        ease: 'expo.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 90%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            }
        });
    }
}

// Initialize scroll stack
initScrollStack();

// ============================================
// FIGMA-STYLE SLIDE-IN ANIMATION (homepage only)
// ============================================
function initSlideInAnimation() {
    const projectSections = document.querySelectorAll('.project-section--fullscreen');

    if (!projectSections.length || prefersReducedMotion) return;

    projectSections.forEach((section) => {
        const mainCard = section.querySelector('.main-project-card');

        if (!mainCard) return;

        // Figma "Smart Animate" style slide-in
        // scrub: 1 adds 1-second delay/friction for smooth curve feel
        gsap.from(mainCard, {
            x: -100,
            opacity: 0,
            scale: 0.95,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'center center',
                scrub: 1,  // 1-second friction for smooth curve
            }
        });
    });
}

// Initialize slide-in animation
initSlideInAnimation();

// ============================================
// 3D TILT EFFECT FOR TILT CARDS (homepage only)
// ============================================
function initTiltCards() {
    const tiltCards = document.querySelectorAll('.tilt-card');

    if (!tiltCards.length || prefersReducedMotion) return;

    const maxRotation = 15; // Max rotation in degrees

    tiltCards.forEach((card) => {
        const inner = card.querySelector('.tilt-card-inner');
        if (!inner) return;

        // Set perspective on parent for 3D effect
        gsap.set(card, { transformPerspective: 1000 });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate mouse position relative to center (-1 to 1)
            const mouseX = (e.clientX - centerX) / (rect.width / 2);
            const mouseY = (e.clientY - centerY) / (rect.height / 2);

            // Calculate rotation (invert Y for natural tilt feel)
            const rotationY = mouseX * maxRotation;
            const rotationX = -mouseY * maxRotation;

            gsap.to(inner, {
                rotationY: rotationY,
                rotationX: rotationX,
                duration: 0.3,
                ease: 'power2.out',
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(inner, {
                rotationY: 0,
                rotationX: 0,
                duration: 0.5,
                ease: 'power2.out',
            });
        });
    });
}

// Initialize tilt cards
initTiltCards();

// ============================================
// RDR2 SCROLL-TRIGGERED VIDEO PLAYBACK (homepage only)
// ============================================
function initRdr2Video() {
    const rdr2Video = document.getElementById('rdr2-video');
    const rdr2Section = document.querySelector('[data-project="rdr2"]');
    const subtitle = document.querySelector('.projects-header .section-subtitle');

    if (!rdr2Video || !rdr2Section || !subtitle) return;

    let playTimeout = null;
    let hasTriggered = false;

    // Trigger: user scrolls past the subtitle text
    ScrollTrigger.create({
        trigger: subtitle,
        start: 'bottom top',
        onEnter: () => {
            if (hasTriggered) return;
            hasTriggered = true;

            // 1.5-second delay (setTimeout), then play
            playTimeout = setTimeout(() => {
                rdr2Video.play().catch(() => { });
            }, 1500);
        }
    });

    // Pause/resume based on RDR2 section visibility
    ScrollTrigger.create({
        trigger: rdr2Section,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => {
            if (hasTriggered && !playTimeout) rdr2Video.play().catch(() => { });
        },
        onEnterBack: () => {
            if (hasTriggered && !playTimeout) rdr2Video.play().catch(() => { });
        },
        onLeave: () => {
            if (playTimeout) {
                clearTimeout(playTimeout);
                playTimeout = null;
            }
            rdr2Video.pause();
        },
        onLeaveBack: () => {
            if (playTimeout) {
                clearTimeout(playTimeout);
                playTimeout = null;
            }
            rdr2Video.pause();
        }
    });
}

initRdr2Video();

// ============================================
// PROJECT SECTION VIDEO MANAGEMENT (homepage only)
// ============================================
function initProjectSectionVideos() {
    const projectSections = document.querySelectorAll('.project-section');

    if (!projectSections.length) return;

    projectSections.forEach((section) => {
        const video = section.querySelector('.project-bg-video');
        if (!video) return;

        // Create ScrollTrigger to manage video playback
        ScrollTrigger.create({
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            onEnter: () => {
                video.play().catch(() => { }); // Silently handle autoplay blocks
            },
            onEnterBack: () => {
                video.play().catch(() => { });
            },
            onLeave: () => {
                video.pause();
            },
            onLeaveBack: () => {
                video.pause();
            },
        });
    });
}

// Initialize project section videos
initProjectSectionVideos();

// ============================================
// CLICK-TO-EXPAND PROJECT INTERACTION (homepage only)
// ============================================
function initProjectExpand() {
    const fullscreenSections = document.querySelectorAll('.project-section--fullscreen');

    if (!fullscreenSections.length) return;

    // Use matchMedia for responsive behavior
    ScrollTrigger.matchMedia({
        // Desktop: Fan-out effect
        "(min-width: 768px)": function () {
            fullscreenSections.forEach((section) => {
                const mainCard = section.querySelector('.main-project-card');
                const tiltContainer = section.querySelector('.tilt-cards-container');
                const skeletonCards = section.querySelectorAll('.skeleton-card');

                if (!mainCard || !tiltContainer) return;

                let isExpanded = false;
                let expandTimeline = null;

                // Create the expand/collapse timeline (Desktop - Fan Out)
                function createExpandTimeline() {
                    const tl = gsap.timeline({ paused: true });

                    tl.to(mainCard, {
                        xPercent: -80,  // Increased spacing
                        duration: 0.6,
                        ease: 'power2.out',
                    }, 0)
                        .to(tiltContainer, {
                            xPercent: 80,   // Increased spacing
                            opacity: 1,
                            scale: 1,
                            duration: 0.6,
                            ease: 'power2.out',
                        }, 0)
                        .fromTo(skeletonCards,
                            { x: -20, opacity: 0 },
                            {
                                x: 0,
                                opacity: 1,
                                duration: 0.4,
                                ease: 'power2.out',
                                stagger: 0.1,
                            },
                            0.2
                        );

                    return tl;
                }

                // Toggle function
                function toggleProject() {
                    if (!expandTimeline) {
                        expandTimeline = createExpandTimeline();
                    }

                    if (isExpanded) {
                        expandTimeline.reverse();
                        section.classList.remove('project-section--expanded');
                    } else {
                        expandTimeline.play();
                        section.classList.add('project-section--expanded');
                    }

                    isExpanded = !isExpanded;
                }

                // Store toggle on element for cleanup
                mainCard._toggleProject = toggleProject;
                mainCard.addEventListener('click', toggleProject);

                section.addEventListener('click', (e) => {
                    if (isExpanded && e.target === section) {
                        toggleProject();
                    }
                });
            });
        },

        // Mobile: Simple vertical stack with scale effect
        "(max-width: 767px)": function () {
            fullscreenSections.forEach((section) => {
                const mainCard = section.querySelector('.main-project-card');
                const tiltContainer = section.querySelector('.tilt-cards-container');
                const skeletonCards = section.querySelectorAll('.skeleton-card');

                if (!mainCard || !tiltContainer) return;

                let isExpanded = false;
                let mobileTimeline = null;

                // Mobile: Simple vertical reveal
                function createMobileTimeline() {
                    const tl = gsap.timeline({ paused: true });

                    tl.to(mainCard, {
                        scale: 0.95,
                        y: -20,
                        duration: 0.4,
                        ease: 'power2.out',
                    }, 0)
                        .to(tiltContainer, {
                            y: 20,
                            opacity: 1,
                            scale: 1,
                            duration: 0.4,
                            ease: 'power2.out',
                        }, 0)
                        .fromTo(skeletonCards,
                            { y: 10, opacity: 0 },
                            {
                                y: 0,
                                opacity: 1,
                                duration: 0.3,
                                ease: 'power2.out',
                                stagger: 0.08,
                            },
                            0.15
                        );

                    return tl;
                }

                function toggleMobile() {
                    if (!mobileTimeline) {
                        mobileTimeline = createMobileTimeline();
                    }

                    if (isExpanded) {
                        mobileTimeline.reverse();
                        section.classList.remove('project-section--expanded');
                    } else {
                        mobileTimeline.play();
                        section.classList.add('project-section--expanded');
                    }

                    isExpanded = !isExpanded;
                }

                mainCard._toggleProject = toggleMobile;
                mainCard.addEventListener('click', toggleMobile);

                section.addEventListener('click', (e) => {
                    if (isExpanded && e.target === section) {
                        toggleMobile();
                    }
                });
            });
        }
    });
}

// Initialize click-to-expand
initProjectExpand();

// ============================================
// RDR2 PILLARS - MOBILE TRANSFORM CLEANUP
// ============================================
// Clear GSAP inline transforms on mobile so CSS layout takes over
const rdr2MM = gsap.matchMedia();

rdr2MM.add("(max-width: 1024px)", () => {
    gsap.set(".rdr2-layout > .main-project-card", { clearProps: "transform,xPercent,scale,x,y" });
    gsap.set(".rdr2-layout > .tilt-cards-container", { clearProps: "transform,xPercent,scale,x,y,opacity" });
    gsap.set(".pillar-card", { clearProps: "transform" });

    return () => {
        // Cleanup runs when switching back to desktop — ScrollTrigger.matchMedia handles revert
    };
});

// Re-initialize on resize (desktop <-> mobile)
let resizeStackTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeStackTimeout);
    resizeStackTimeout = setTimeout(() => {
        // Kill existing ScrollTriggers for project cards
        ScrollTrigger.getAll().forEach(st => {
            if (st.trigger && st.trigger.classList && st.trigger.classList.contains('project-card')) {
                st.kill();
            }
        });
        // Reinitialize stack
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            projectsGrid.classList.remove('scroll-stack-active');
        }
        initScrollStack();

        // Reinitialize video crossfade for new viewport
        initProjectVideos();
    }, 300);
});

// ============================================
// PARALLAX BACKGROUND VIDEO CROSSFADE (homepage only)
// ============================================
function initProjectVideos() {
    const isDesktop = window.innerWidth > 1024;
    const bgVideoDj = document.getElementById('bg-video-dj');
    const bgVideoBearded = document.getElementById('bg-video-bearded');
    const bgVideoRdr2 = document.getElementById('bg-video-rdr2');
    const projectCards = gsap.utils.toArray('.project-card.gs-reveal');

    if (!bgVideoDj || !projectCards.length || !isDesktop || prefersReducedMotion) return;

    // Map each card to its background video (4th card has no video)
    const videoMap = [bgVideoDj, bgVideoBearded, bgVideoRdr2, null];
    let activeVideo = null;

    // Lazy play helper — only plays when needed
    function playVideo(video) {
        if (!video || video === activeVideo) return;
        video.play().catch(() => { }); // Silently handle autoplay blocks
    }

    function pauseVideo(video) {
        if (!video) return;
        video.pause();
    }

    // Crossfade: fade out old video, fade in new video
    function crossfadeTo(newVideo) {
        if (newVideo === activeVideo) return;

        // Fade out current
        if (activeVideo) {
            const outVideo = activeVideo;
            gsap.to(outVideo, {
                opacity: 0,
                duration: 1.2,
                ease: 'power2.inOut',
                onComplete: () => pauseVideo(outVideo)
            });
        }

        // Fade in new (or just clear if null for TripleTen)
        if (newVideo) {
            playVideo(newVideo);
            gsap.to(newVideo, {
                opacity: 1,
                duration: 1.2,
                ease: 'power2.inOut'
            });
        }

        activeVideo = newVideo;
    }

    // Create ScrollTrigger for each project card to trigger its video
    projectCards.forEach((card, index) => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 80%',
            end: 'bottom 20%',
            onEnter: () => crossfadeTo(videoMap[index]),
            onEnterBack: () => crossfadeTo(videoMap[index]),
        });
    });

    // Intersection Observer — pause videos entirely off-screen for performance
    const projectsSection = document.querySelector('.projects');
    if (projectsSection && 'IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    // Section left viewport — pause all videos
                    videoMap.forEach(v => pauseVideo(v));
                    activeVideo = null;
                }
            });
        }, { threshold: 0 });

        sectionObserver.observe(projectsSection);
    }
}

initProjectVideos();

// ============================================
// PARALLAX CARD ENTRANCE ANIMATIONS (homepage only)
// ============================================
function initParallaxCards() {
    const isDesktop = window.innerWidth > 1024;
    const projectCards = gsap.utils.toArray('.project-card.gs-reveal');

    if (!projectCards.length || prefersReducedMotion || !isDesktop) return;

    projectCards.forEach((card) => {
        // Stagger internal content elements
        const contentEls = card.querySelectorAll('.project-image, .project-image-placeholder, .project-title, .project-description, .project-tech, .project-link');

        if (contentEls.length) {
            gsap.from(contentEls, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'expo.out',
                stagger: 0.08,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                }
            });
        }
    });
}

initParallaxCards();

// Skill categories with stagger (safe - checks length)
if (!prefersReducedMotion) {
    const skillCategories = gsap.utils.toArray('.skill-category.gs-reveal');

    if (skillCategories.length) {
        skillCategories.forEach((cat, i) => {
            gsap.fromTo(cat,
                { opacity: 0, visibility: 'hidden', y: 60 },
                {
                    opacity: 1,
                    visibility: 'visible',
                    y: 0,
                    duration: 1,
                    delay: i * 0.1,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: '.skills-grid',
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }
} else {
    document.querySelectorAll('.skill-category.gs-reveal').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });
}

// About section
createReveal('.about-bio.gs-reveal', { y: 60 }, 1.2);
createReveal('.about-process.gs-reveal', { y: 60 }, 1.2);
createReveal('.about-differentiators.gs-reveal', { x: 80 }, 1.4);

// Contact section
createReveal('.contact-info.gs-reveal', { y: 60 }, 1.2);
createReveal('.contact-form.gs-reveal', { y: 60 }, 1.2);

// ============================================
// BACK TO TOP BUTTON (shared across all pages)
// ============================================
const backToTop = document.getElementById('backToTop');

if (backToTop) {
    ScrollTrigger.create({
        start: 'top -400',
        onUpdate: (self) => {
            if (self.progress > 0) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });

    backToTop.addEventListener('click', () => {
        lenis.scrollTo(0, { duration: 1.5 });
    });
}

// ============================================
// CONTACT FORM (homepage only)
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.form-submit');
        const originalText = submitBtn.innerHTML;

        // Demo animation
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';
            submitBtn.style.background = '#22c55e';

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 1500);
        }, 1000);
    });
}

// ============================================
// IMAGE LAZY LOADING PLACEHOLDER
// ============================================
// This would be replaced with actual image loading logic
// when real images are added to the portfolio

function loadImage(placeholder, src) {
    const img = new Image();
    img.onload = () => {
        placeholder.style.backgroundImage = `url(${src})`;
        placeholder.classList.add('loaded');
    };
    img.src = src;
}

// ============================================
// PERFORMANCE: Clean up will-change
// ============================================
// Remove will-change from elements after animations complete
ScrollTrigger.addEventListener('scrollEnd', () => {
    document.querySelectorAll('[style*="will-change"]').forEach(el => {
        el.style.willChange = 'auto';
    });
});

// ============================================
// RESIZE HANDLER
// ============================================
let resizeTimeout;

window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// ============================================
// PAGE VISIBILITY
// ============================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        lenis.stop();
    } else {
        lenis.start();
    }
});

/* REPLACED BY STAGGERED MENU — old keyboard nav + focus trap
// ============================================
// KEYBOARD NAVIGATION ENHANCEMENT (shared)
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('active')) {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        lenis.start();
        menuToggle.focus();
    }
});

if (mobileNav) {
    const focusableElements = mobileNav.querySelectorAll('a');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (firstFocusable && lastFocusable) {
        mobileNav.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        });
    }
}
END REPLACED BY STAGGERED MENU */

// ============================================
// GLITCH TEXT EFFECT (homepage only)
// ============================================
function initGlitchEffect() {
    if (prefersReducedMotion) return;

    const glitchEl = document.querySelector('.glitch-text');
    if (!glitchEl) return;

    function triggerGlitch() {
        glitchEl.classList.add('glitching');
        setTimeout(() => {
            glitchEl.classList.remove('glitching');
        }, 400);
    }

    // Initial burst: 2-3 glitches on reveal
    triggerGlitch();
    setTimeout(triggerGlitch, 700);
    setTimeout(triggerGlitch, 1500);

    // Random glitches every 8-10 seconds
    function scheduleGlitch() {
        const delay = 8000 + Math.random() * 2000;
        setTimeout(() => {
            triggerGlitch();
            scheduleGlitch();
        }, delay);
    }
    scheduleGlitch();
}

// ============================================
// FALLING TEXT EFFECT ON CTA BUTTON (homepage only)
// ============================================
function initFallingText() {
    if (prefersReducedMotion) return;

    const ctaButton = document.querySelector('.hero-cta');
    if (!ctaButton) return;

    const textSpan = ctaButton.querySelector('span');
    if (!textSpan) return;

    const text = textSpan.textContent;
    textSpan.innerHTML = '';

    // Split into individual character spans
    [...text].forEach((char) => {
        const charSpan = document.createElement('span');
        charSpan.classList.add('cta-char');
        charSpan.textContent = char === ' ' ? '\u00A0' : char;
        textSpan.appendChild(charSpan);
    });

    const chars = textSpan.querySelectorAll('.cta-char');

    // GSAP hover: fall on enter, rise on leave
    ctaButton.addEventListener('mouseenter', () => {
        gsap.killTweensOf(chars);
        gsap.to(chars, {
            y: 80,
            duration: 0.6,
            ease: 'power2.in',
            stagger: 0.05
        });
    });

    ctaButton.addEventListener('mouseleave', () => {
        gsap.killTweensOf(chars);
        gsap.to(chars, {
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.05
        });
    });
}

// ============================================
// CONSOLE SIGNATURE
// ============================================
console.log(
    '%c Brandon Michelson Portfolio ',
    'background: #e94560; color: white; padding: 10px 20px; font-size: 14px; font-weight: bold; border-radius: 4px;'
);
console.log(
    '%c Built with GSAP, Lenis & Claude Code ',
    'color: #a0a0a0; font-size: 12px;'
);

// ============================================
// SCROLLTRIGGER REFRESH (Critical for pin-spacer fix)
// ============================================
// Force GSAP to recalculate all layout sizes after everything is loaded
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});

// Also refresh after fonts load (can affect layout measurements)
if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
    });
}
