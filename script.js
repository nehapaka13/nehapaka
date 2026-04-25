// Theme Switcher Functionality
document.addEventListener("DOMContentLoaded", () => {
    const themeSwitcher = document.querySelector('.theme-switcher');
    const html = document.documentElement;
    
    // Check for saved theme or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    html.setAttribute('data-theme', initialTheme);
    
    // Update theme switcher active state if needed
    updateThemeIcon(initialTheme);
    
    // Toggle theme on click
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', (e) => {
            // Prevent event from bubbling if clicking on icons
            e.stopPropagation();
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
    
    function updateThemeIcon(theme) {
        const sunIcon = themeSwitcher?.querySelector('.fa-sun');
        const moonIcon = themeSwitcher?.querySelector('.fa-moon');
        if (sunIcon && moonIcon) {
            if (theme === 'dark') {
                sunIcon.style.opacity = '0.5';
                moonIcon.style.opacity = '1';
            } else {
                sunIcon.style.opacity = '1';
                moonIcon.style.opacity = '0.5';
            }
        }
    }

    // Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    
    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navList.classList.toggle('active');
            // Prevent body scroll when menu is open
            if (navList.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navList) {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Update active link
            document.querySelectorAll('.nav-link').forEach(item => {
                item.classList.remove('active');
            });
            link.classList.add('active');
        });
    });

    // Update active link on scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                // Close mobile menu if open
                if (navList && navList.classList.contains('active')) {
                    hamburger?.classList.remove('active');
                    navList.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sticky header on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        }
    });

    // Animate elements when they come into view
    const animateOnScroll = () => {
        const animateElements = document.querySelectorAll('.section-header, .skill-category, .timeline-item, .project-card, .contact-container > *');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    };

    // Initialize animations
    animateOnScroll();

    // Add hardware typing effect (reduced complexity for performance)
    const hardwareCode = document.querySelector('.hardware-snippet code');
    if (hardwareCode && !hardwareCode.hasAttribute('data-typed')) {
        hardwareCode.setAttribute('data-typed', 'true');
        // Don't do full typing effect on mobile for performance
        const isMobile = window.innerWidth < 768;
        if (!isMobile) {
            const originalText = hardwareCode.textContent;
            if (originalText && originalText.length > 0) {
                hardwareCode.textContent = '';
                let i = 0;
                function typeWriter() {
                    if (i < originalText.length) {
                        hardwareCode.textContent += originalText.charAt(i);
                        i++;
                        setTimeout(typeWriter, Math.random() * 30 + 10);
                    }
                }
                setTimeout(typeWriter, 500);
            }
        }
    }
});

// Add blinking cursor styles dynamically (only if not already added)
if (!document.querySelector('#dynamic-cursor-styles')) {
    const style = document.createElement('style');
    style.id = 'dynamic-cursor-styles';
    style.textContent = `
        @keyframes blink {
            from, to { opacity: 1; }
            50% { opacity: 0; }
        }
        .blinking-cursor {
            animation: blink 1s step-end infinite;
            color: var(--secondary);
        }
    `;
    document.head.appendChild(style);
}

// Contact Form Submission with Google Sheets
let formSubmitted = false;
const form = document.getElementById("contactForm");
const iframe = document.querySelector('iframe[name="hidden_iframe"]');
const statusMessage = document.getElementById("statusMessage");

if (form && iframe) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        const name = form.querySelector('input[name="name"]')?.value.trim();
        const email = form.querySelector('input[name="email"]')?.value.trim();
        const message = form.querySelector('textarea[name="message"]')?.value.trim();
        
        if (!name || !email || !message) {
            showToast("Please fill all fields", "error");
            return;
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            showToast("Please enter a valid email address", "error");
            return;
        }
        
        formSubmitted = true;
        if (statusMessage) {
            statusMessage.style.display = "block";
            statusMessage.textContent = "Sending message...";
            statusMessage.style.color = "var(--primary)";
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
        }
        
        // Submit the form
        form.submit();
    });
    
    iframe.addEventListener('load', () => {
        if (!formSubmitted) return;
        
        formSubmitted = false;
        form.reset();
        showToast("Message sent successfully! I'll get back to you soon.", "success");
        
        if (statusMessage) {
            statusMessage.style.display = "none";
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
        }
    });
}

// Toast notification function
function showToast(message, type = "success") {
    const toast = document.getElementById("toastBubble");
    if (!toast) return;
    
    toast.textContent = message;
    toast.style.backgroundColor = type === "success" ? "var(--secondary)" : "var(--danger)";
    toast.classList.add("show");
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}

// Handle window resize for mobile menu cleanup
window.addEventListener('resize', () => {
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    
    if (window.innerWidth > 768 && navList && navList.classList.contains('active')) {
        hamburger?.classList.remove('active');
        navList.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Add keyboard accessibility for project cards
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
});

// Prevent scroll chaining on mobile menu
document.addEventListener('touchmove', function(e) {
    const navList = document.querySelector('.nav-list');
    if (navList && navList.classList.contains('active')) {
        e.preventDefault();
    }
}, { passive: false });

// Lazy load any images if needed (optional enhancement)
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    if ('loading' in HTMLImageElement.prototype) {
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }
});

// Handle theme transition for smooth color changes
const themeStyle = document.createElement('style');
themeStyle.textContent = `
    * {
        transition: background-color 0.2s ease, border-color 0.2s ease, color 0.15s ease;
    }
    
    .header, .preloader, .project-card, .skill-category, .timeline-content, .contact-info {
        transition: background-color 0.25s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    @media (prefers-reduced-motion: reduce) {
        * {
            transition: none !important;
            animation: none !important;
        }
    }
`;
document.head.appendChild(themeStyle);

// Add year to footer (already in HTML but ensure it works)
const yearSpan = document.getElementById('year');
if (yearSpan && !yearSpan.textContent) {
    yearSpan.textContent = new Date().getFullYear();
}

// Console greeting (fun easter egg)
console.log("%c👩‍💻 Neha Paka | Python Backend Developer | IoT & Embedded Systems", "color: #3b82f6; font-size: 14px; font-weight: bold;");
console.log("%cLet's build something amazing together! 🚀", "color: #10b981; font-size: 12px;");
