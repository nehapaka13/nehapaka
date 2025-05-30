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
    
    // Toggle theme on click
    themeSwitcher.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Rest of your existing JavaScript...
});

// script.js - Embedded Systems Portfolio
document.addEventListener("DOMContentLoaded", () => {
    // Preloader
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navList.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
            
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
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
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
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    // Project card interactions
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const projectLink = card.querySelector('.project-link');
        if (projectLink) {
            card.addEventListener('click', (e) => {
                // Only open link if not clicking on the actual link
                if (!e.target.closest('.project-link') && projectLink.href && projectLink.href !== '#') {
                    window.open(projectLink.href, '_blank');
                }
            });

            // Keyboard accessibility
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && projectLink.href && projectLink.href !== '#') {
                    window.open(projectLink.href, '_blank');
                }
            });
        }
    });

    // Project details toggle
    document.querySelectorAll('.project-link[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.style.display = targetElement.style.display === 'none' ? 'block' : 'none';
                
                // Scroll to the details if showing
                if (targetElement.style.display === 'block') {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    

    

    // Hardware terminal effect for hero code snippet
    const hardwareCode = document.querySelector('.hardware-snippet code');
    if (hardwareCode) {
        const originalCode = hardwareCode.textContent;
        hardwareCode.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < originalCode.length) {
                hardwareCode.textContent += originalCode.charAt(i);
                i++;
                setTimeout(typeWriter, Math.random() * 50);
            } else {
                // Add blinking cursor
                hardwareCode.innerHTML += '<span class="blinking-cursor">|</span>';
            }
        }
        
        // Start typing effect after 1 second
        setTimeout(typeWriter, 1000);
    }

    // Animate elements when they come into view
    const animateOnScroll = () => {
        const animateElements = document.querySelectorAll('.section-header, .skill-category, .timeline-item, .project-card, .contact-container > *');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
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
});

// Add blinking cursor styles dynamically
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.animate__fadeInUp {
    animation-name: fadeInUp;
}

.blinking-cursor {
    animation: blink 1s step-end infinite;
    color: var(--secondary-color);
}
@keyframes blink {
    from, to { opacity: 1; }
    50% { opacity: 0; }
}
`;
document.head.appendChild(style);

let formSubmitted = false;

const form = document.getElementById("contactForm");
const iframe = document.querySelector('iframe[name="hidden_iframe"]');

form.addEventListener('submit', () => {
  formSubmitted = true;
  statusMessage.style.display = "block";
  form.querySelector('button[type="submit"]').disabled = true;
});

iframe.addEventListener('load', () => {
  if (!formSubmitted) return; // Ignore iframe loads before submit

  formSubmitted = false; // reset flag

  form.reset();
  showToast("Message sent!", "success");
  statusMessage.style.display = "none";
  form.querySelector('button[type="submit"]').disabled = false;
});


function showToast(message, type = "success", duration = 3000) {
  const toast = document.getElementById("toastBubble");
  
  toast.textContent = message;
  toast.className = "";  // reset classes
  toast.classList.add(type);
  
  toast.style.visibility = "visible";
  toast.style.opacity = "1";
  toast.style.transform = "translateX(0)";

  // Hide after duration ms
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.visibility = "hidden";
  }, duration);
}

