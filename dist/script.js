/**
 * Premium Portfolio Website - Main JavaScript
 * Author: Hemanth Pelluru
 * Description: Handles interactivity, animations, and theme toggling using pure vanilla JS.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 0. Constants & State ---
    const EMAIL = 'pelluruhemanth@gmail.com';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // --- 1. Theme Toggle ---
    const initTheme = () => {
        const themeBtn = document.querySelector('#themeToggle');
        const themeMeta = document.querySelector('meta[name="theme-color"]');
        let currentTheme = localStorage.getItem('hemanth-theme');
        
        if (!currentTheme) {
            currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        const applyTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('hemanth-theme', theme);
            
            if (themeBtn) {
                themeBtn.textContent = theme === 'dark' ? '☀' : '☾';
                themeBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
            }
            if (themeMeta) {
                themeMeta.setAttribute('content', theme === 'dark' ? '#0f172a' : '#ffffff');
            }
        };

        // Apply on load
        applyTheme(currentTheme);

        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
                applyTheme(currentTheme);
            });
        }
    };

    // --- 2. Mobile Menu ---
    const initMobileMenu = () => {
        const menuBtn = document.querySelector('#hamburgerMenu');
        const nav = document.querySelector('#navMenu');
        
        if (!menuBtn || !nav) return;
        
        const links = nav.querySelectorAll('a');

        const toggleMenu = (forceClose = false) => {
            const isOpen = nav.classList.contains('open');
            const willOpen = forceClose ? false : !isOpen;
            
            nav.classList.toggle('open', willOpen);
            menuBtn.classList.toggle('active', willOpen);
            menuBtn.setAttribute('aria-expanded', String(willOpen));
        };

        menuBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
        
        links.forEach(link => {
            link.addEventListener('click', () => toggleMenu(true));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') toggleMenu(true);
        });

        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
                toggleMenu(true);
            }
        });
    };

    // --- 3. Email Copy ---
    const initEmailCopy = () => {
        const copyBtns = document.querySelectorAll('[data-copy-email]');
        if (!copyBtns.length) return;

        // Create toast element dynamically
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: var(--text-color, #333); color: var(--bg-color, #fff);
            padding: 12px 24px; border-radius: 8px; font-size: 14px;
            opacity: 0; transform: translateY(20px); transition: all 0.3s ease;
            pointer-events: none; z-index: 9999;
        `;
        toast.textContent = 'Email address copied!';
        document.body.appendChild(toast);

        let toastTimeout;
        const showToast = () => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(20px)';
            }, 3000);
        };

        copyBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    await navigator.clipboard.writeText(EMAIL);
                    showToast();
                } catch (err) {
                    console.error('Failed to copy email:', err);
                }
            });
        });
    };

    // --- 4. Scroll Reveal Animations ---
    const initScrollReveal = () => {
        if (!prefersReducedMotion.matches) {
            document.documentElement.classList.add('motion');
        }

        const revealElements = document.querySelectorAll('.reveal');
        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        revealElements.forEach(el => observer.observe(el));
    };

    // --- 5. Scroll Progress Bar ---
    const initScrollProgress = () => {
        const progressBar = document.querySelector('#scrollProgress');
        if (!progressBar) return;

        let ticking = false;
        const updateProgress = () => {
            const scrollPx = document.documentElement.scrollTop || document.body.scrollTop;
            const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = scrollPx / winHeightPx;
            
            progressBar.style.transform = `scaleX(${scrolled})`;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateProgress);
                ticking = true;
            }
        });
    };

    // --- 6. Active Nav Highlighting ---
    const initActiveNav = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!sections.length || !navLinks.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                            link.setAttribute('aria-current', 'location');
                        }
                    });
                }
            });
        }, { rootMargin: '-15% 0px -60% 0px' });

        sections.forEach(sec => observer.observe(sec));
    };

    // --- 7. Year Update ---
    const initYear = () => {
        const yearEl = document.getElementById('year');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    };

    // --- 8. Smooth Counter Animation ---
    const initCounters = () => {
        if (prefersReducedMotion.matches) return;
        
        const counters = document.querySelectorAll('.metric-value');
        if (!counters.length) return;

        const animateCounter = (el) => {
            const targetStr = el.getAttribute('data-target') || el.innerText;
            const targetNum = parseInt(targetStr.replace(/[^0-9]/g, ''));
            const suffix = targetStr.replace(/[0-9]/g, '');
            
            if (isNaN(targetNum)) return;

            const duration = 2000; // 2 seconds
            const startTime = performance.now();
            const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const currentVal = Math.floor(easeOutQuart(progress) * targetNum);
                el.innerText = currentVal + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.innerText = targetStr; // Ensure exact final value
                }
            };
            requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));
    };

    // --- 9. Parallax Effect ---
    const initParallax = () => {
        if (prefersReducedMotion.matches || window.matchMedia('(pointer: coarse)').matches) return;
        
        const hero = document.querySelector('#home');
        const profileCard = document.querySelector('.profile-card');
        
        if (!hero || !profileCard) return;

        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * -10;
            const y = (e.clientY / window.innerHeight - 0.5) * -10;
            profileCard.style.transform = `translate(${x}px, ${y}px)`;
        });

        hero.addEventListener('mouseleave', () => {
            profileCard.style.transform = 'translate(0, 0)';
            profileCard.style.transition = 'transform 0.5s ease-out';
        });

        hero.addEventListener('mouseenter', () => {
            profileCard.style.transition = 'none';
        });
    };

    // --- 10. Typed Text Effect ---
    const initTypedText = () => {
        const typeEl = document.querySelector('.typewriter-wrapper');
        if (!typeEl) return;

        // Get text content, excluding the cursor span
        const cursorSpan = typeEl.querySelector('.blinking-cursor');
        const text = typeEl.textContent.replace('_', '').trim();
        
        // Clear and prepare
        typeEl.innerHTML = '';
        const textNode = document.createTextNode('');
        const cursor = document.createElement('span');
        cursor.className = 'blinking-cursor';
        cursor.textContent = '|';
        typeEl.appendChild(textNode);
        typeEl.appendChild(cursor);

        let i = 0;
        setTimeout(() => {
            const type = () => {
                if (i < text.length) {
                    textNode.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 80);
                }
            };
            type();
        }, 1000);
    };

    // --- 11. Skill Card Tilt ---
    const initSkillTilt = () => {
        if (prefersReducedMotion.matches || window.matchMedia('(pointer: coarse)').matches) return;

        const cards = document.querySelectorAll('.skill-card, .staggered-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -5; // max 5deg tilt
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.style.transition = 'none';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                card.style.transition = 'transform 0.5s ease';
            });
        });
    };

    // --- 12. Magnetic Button Effect ---
    const initMagneticBtns = () => {
        if (prefersReducedMotion.matches || window.matchMedia('(pointer: coarse)').matches) return;

        const buttons = document.querySelectorAll('.btn-primary');
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Scale down movement for subtlety (max ~5px)
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
                btn.style.transition = 'none';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
                btn.style.transition = 'transform 0.3s ease';
            });
        });
    };

    // --- 13. Header Scroll Behavior ---
    const initHeader = () => {
        const header = document.querySelector('header');
        if (!header) return;

        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initialize on load
    };

    // --- 14. Hero Button Click-to-Fill ---
    const initHeroBtnToggle = () => {
        const heroBtns = document.querySelectorAll('.hero-btn');
        if (!heroBtns.length) return;

        heroBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove filled state from all hero buttons
                heroBtns.forEach(b => {
                    b.classList.remove('btn-filled');
                    b.classList.add('btn-secondary');
                });
                // Fill the clicked button
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-filled');
            });
        });
    };

    // --- 15. Flip Cards Click Handler ---
    const initFlipCards = () => {
        const flipCards = document.querySelectorAll('.project-flip-card');
        if (!flipCards.length) return;

        flipCards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('is-flipped');
            });
        });
    };

    // --- Initialize All Features ---
    initTheme();
    initMobileMenu();
    initEmailCopy();
    initScrollReveal();
    initScrollProgress();
    initActiveNav();
    initYear();
    initCounters();
    initParallax();
    initTypedText();
    initSkillTilt();
    initMagneticBtns();
    initHeader();
    initHeroBtnToggle();
    initFlipCards();
});
