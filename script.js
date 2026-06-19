// ─── Smooth Scroll to Hero Form ──────────────────────────────────────────────
function scrollToForm(e) {
    e.preventDefault();
    const target = document.getElementById('hero-form-section');
    if (!target) return;
    const formCard = target.querySelector('.form-card');
    const scrollTarget = formCard || target;
    scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // Subtle highlight pulse on the form card
    if (formCard) {
        formCard.style.transition = 'box-shadow 0.3s ease';
        formCard.style.boxShadow = '0 0 0 4px rgba(17, 16, 77, 0.4)';
        setTimeout(() => { formCard.style.boxShadow = ''; }, 1800);
    }
}

// ─── Toast Notification Helper ────────────────────────────────────────────────
function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existing = document.getElementById('edzio-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'edzio-toast';
    toast.innerHTML = `
        <span style="font-size:1.4rem;">${type === 'success' ? '✅' : '❌'}</span>
        <span>${message}</span>
    `;
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        background: type === 'success' ? 'linear-gradient(135deg,#11104d,#1a1994)' : '#b00020',
        color: '#fff',
        padding: '16px 24px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.95rem',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: '500',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        zIndex: '99999',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        maxWidth: '380px',
        lineHeight: '1.4',
    });
    document.body.appendChild(toast);
    // Animate in
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });
    // Auto dismiss after 5s
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 400);
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    // ─── AJAX Form Submission (Multi-Account Routing) ──────────────────────────
    const admissionForm = document.querySelector('.admission-form');
    if (admissionForm) {
        admissionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = admissionForm.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending…';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(admissionForm);
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);

                // Service 1: Web3Forms (Primary Account)
                const req1 = fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify({
                        access_key: "2a94b0ad-1347-44b8-a6fb-63983726b454",
                        ...object
                    })
                });

                // Service 2: FormSubmit.co (CC Account: darshangadhave10@gmail.com)
                // This will forward the same lead to your second email instantly.
                const req2 = fetch("https://formsubmit.co/ajax/darshangadhave10@gmail.com", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify({
                        ...object,
                        _subject: "CC: New Lead from Edzio"
                    })
                });

                const [res1, res2] = await Promise.all([req1, req2]);

                if (res1.ok || res2.ok) {
                    admissionForm.reset();
                    window.location.href = 'thankyou.html';
                } else {
                    throw new Error('Submission failed');
                }

            } catch (err) {
                console.error('Submission Error:', err);
                // Fallback to ensure user sees the thank you page if at least one service likely worked
                window.location.href = 'thankyou.html';
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // 1. Header Scroll Logic
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Sequenced Hero Animations
    const heroTl = gsap.timeline();

    // Set initial states to prevent flash
    const isMobile = window.innerWidth <= 768;
    gsap.set('.sticky-logo', { opacity: 0, x: isMobile ? 0 : -20, xPercent: isMobile ? -50 : 0 });
    gsap.set('.main-heading', { opacity: 0, y: 30 });
    gsap.set(['.sub-heading', '.sub-heading-secondary', '.hero-tagline', '.hero-intake-text'], { opacity: 0, y: 20 });
    gsap.set('.form-card', { x: 100, opacity: 0 }); // Starting from right

    // Animation Sequence
    heroTl.to('.sticky-logo', {
        opacity: 1,
        x: 0,
        xPercent: isMobile ? -50 : 0,
        duration: 1.2,
        ease: 'expo.out'
    })
    .to('.main-heading', {
        opacity: 1,
        y: 0,
        duration: 1.8, /* Slightly longer for "butter" feel */
        ease: 'expo.out',
        delay: isMobile ? 0 : 0.2 
    })
    .to(['.sub-heading', '.sub-heading-secondary', '.hero-tagline', '.hero-intake-text'], {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.25,
        ease: 'expo.out'
    }, '-=0.8') /* Smoother overlap */
    .to('.form-card', {
        opacity: 1,
        x: 0,
        duration: 1.8,
        ease: 'expo.out'
    }, '-=1.0') /* Elegant slide-in */
    .from('.f-item', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'expo.out'
    }, '-=1.0'); // 0.5 seconds after form animation

    // Scroll Reveal for Features
    gsap.from('.feature-card', {
        scrollTrigger: {
            trigger: '.feature-grid',
            start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // 3. Cinematic Background Animations
    const heroBg = document.querySelector('.hero-bg img');
    if (heroBg) {
        // Parallax Effect using ScrollTrigger
        gsap.to(heroBg, {
            yPercent: 30, // Moves down slightly as you scroll
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Continuous Slow Zoom (Ken Burns Effect)
        gsap.to(heroBg, {
            scale: 1.15,
            duration: 20,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }

    // 5. University Filter Logic
    const filterBtns = document.querySelectorAll('.tab-btn');
    const uniCards = document.querySelectorAll('.uni-card');
    const usaReadMoreText = document.querySelector('.usa-read-more-text');
    let currentCountry = 'uk'; // Default to UK as per index.html initial state
    let usaExpanded = false;

    const updateUniVisibility = () => {
        const targetCards = [];
        let usaCount = 0;

        uniCards.forEach(card => {
            const cardCountry = card.getAttribute('data-country');
            if (currentCountry === 'all' || cardCountry === currentCountry) {
                if (currentCountry === 'usa') {
                    usaCount++;
                    if (usaCount > 6 && !usaExpanded) {
                        card.style.display = 'none';
                    } else {
                        targetCards.push(card);
                        card.style.display = 'flex';
                    }
                } else {
                    targetCards.push(card);
                    card.style.display = 'flex';
                }
            } else {
                card.style.display = 'none';
            }
        });

        if (usaReadMoreText) {
            if (currentCountry === 'usa' && !usaExpanded) {
                usaReadMoreText.style.display = 'block';
            } else {
                usaReadMoreText.style.display = 'none';
            }
        }

        // Animate visible items
        gsap.to(targetCards, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out'
        });

        if (usaReadMoreText && usaReadMoreText.style.display === 'block') {
            gsap.to(usaReadMoreText, { opacity: 1, duration: 0.5 });
        }
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCountry = btn.getAttribute('data-country');

            // Reset animation before changing visibility
            gsap.to(uniCards, {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                onComplete: () => updateUniVisibility()
            });
            if (usaReadMoreText) gsap.to(usaReadMoreText, { opacity: 0, duration: 0.3 });
        });
    });

    if (usaReadMoreText) {
        usaReadMoreText.addEventListener('click', () => {
            usaExpanded = true;
            gsap.to(uniCards, {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                onComplete: () => updateUniVisibility()
            });
            gsap.to(usaReadMoreText, { opacity: 0, duration: 0.3 });
        });
    }

    // Initial check on load
    updateUniVisibility();

    // Why Choose Us Reveal
    gsap.from('.wcu-item', {
        scrollTrigger: {
            trigger: '.wcu-grid',
            start: 'top 90%',
        },
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // End-to-End Admission Process (Vanilla JS Stacking Effect)
    const processSteps = document.querySelectorAll('.process-step');

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;

        processSteps.forEach((step, i) => {
            const nextStep = processSteps[i + 1];
            if (nextStep) {
                const nextRect = nextStep.getBoundingClientRect();
                const nextStepTop = nextRect.top;

                let progress = 1 - (nextStepTop / windowHeight);
                progress = Math.max(0, Math.min(1, progress));

                if (progress > 0) {
                    const scale = 1 - (progress * 0.1);
                    const opacity = 1 - (progress * 0.5);
                    const blur = progress * 10;

                    step.style.transform = `scale(${scale})`;
                    step.style.opacity = opacity;
                    step.style.filter = `blur(${blur}px)`;
                } else {
                    step.style.transform = `scale(1)`;
                    step.style.opacity = 1;
                    step.style.filter = `blur(0px)`;
                }
            }
        });
    });

    // 6. Testimonial Avatar Floating Animation
    gsap.to('.avatar', {
        y: 'random(-20, 20)',
        x: 'random(-20, 20)',
        rotation: 'random(-5, 5)',
        duration: 'random(2, 4)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    // 7. Testimonial Slider Logic
    const sliderContainer = document.getElementById('testimonials-container');
    const prevBtn = document.getElementById('prev-test');
    const nextBtn = document.getElementById('next-test');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;

    const updateSlider = () => {
        if (!sliderContainer) return;
        const cardWidth = document.querySelector('.testimonial-card').offsetWidth + 30;
        sliderContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    };

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < 2) {
                currentIndex++;
                updateSlider();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
    }

    window.addEventListener('resize', updateSlider);

    // Target date: July 1, 2026, 12:00 AM (midnight)
    const targetDate = new Date(2026, 6, 1, 0, 0, 0);

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            // Target date reached, set display to all zeros
            updateDigits('days', 0);
            updateDigits('hours', 0);
            updateDigits('minutes', 0);
            updateDigits('seconds', 0);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        updateDigits('days', days);
        updateDigits('hours', hours);
        updateDigits('minutes', minutes);
        updateDigits('seconds', seconds);
    }

    function updateDigits(prefix, value) {
        const valueStr = String(value).padStart(2, '0');
        const tens = valueStr[0];
        const ones = valueStr[1];

        updateDigitDOM(prefix + '-tens', tens);
        updateDigitDOM(prefix + '-ones', ones);
    }

    function updateDigitDOM(id, newValue) {
        const el = document.getElementById(id);
        if (!el) return;
        const valEl = el.querySelector('.digit-val');
        if (valEl && valEl.textContent !== newValue) {
            // Add a subtle flip animation class on change
            valEl.style.transform = 'scaleY(0)';
            valEl.style.opacity = '0.5';
            setTimeout(() => {
                valEl.textContent = newValue;
                valEl.style.transform = 'scaleY(1)';
                valEl.style.opacity = '1';
            }, 150);
        }
    }

    // Set transition style for digit values
    const digitVals = document.querySelectorAll('.digit-val');
    digitVals.forEach(val => {
        val.style.transition = 'transform 0.15s ease-in-out, opacity 0.15s ease-in-out';
        val.style.display = 'inline-block';
    });

    // Run immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ─── Brochure Modal & Download Logic ──────────────────────────────────────
    const brochureModal = document.getElementById('brochure-modal');
    const openBrochureBtn = document.getElementById('open-brochure-modal-btn');
    const closeBrochureBtn = document.getElementById('close-brochure-modal-btn');
    const brochureOverlay = document.getElementById('brochure-modal-overlay');
    const brochureForm = document.getElementById('brochure-download-form');

    if (openBrochureBtn && brochureModal) {
        openBrochureBtn.addEventListener('click', () => {
            brochureModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    }

    const closeBrochureModal = () => {
        if (brochureModal) {
            brochureModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    if (closeBrochureBtn) {
        closeBrochureBtn.addEventListener('click', closeBrochureModal);
    }
    if (brochureOverlay) {
        brochureOverlay.addEventListener('click', closeBrochureModal);
    }

    if (brochureForm) {
        brochureForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = brochureForm.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Preparing download…';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(brochureForm);
                const object = Object.fromEntries(formData);

                // Service 1: Web3Forms (Primary Account)
                const req1 = fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify({
                        access_key: "2a94b0ad-1347-44b8-a6fb-63983726b454",
                        ...object
                    })
                });

                // Service 2: FormSubmit.co (CC Account: darshangadhave10@gmail.com)
                const req2 = fetch("https://formsubmit.co/ajax/darshangadhave10@gmail.com", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify({
                        ...object,
                        _subject: "New Brochure Lead: " + object.full_name
                    })
                });

                // Trigger PDF download in parallel
                const link = document.createElement('a');
                link.href = 'EDZIO%20Final%20Brochure%20%281%29_compressed.pdf';
                link.download = 'EDZIO Final Brochure (1)_compressed.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Wait for API submissions to finish
                await Promise.all([req1, req2]);

                brochureForm.reset();
                closeBrochureModal();
                showToast('Study Abroad Guide download started successfully!');

            } catch (err) {
                console.error('Brochure Lead Submission Error:', err);
                brochureForm.reset();
                closeBrochureModal();
                showToast('Study Abroad Guide download started successfully!');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
