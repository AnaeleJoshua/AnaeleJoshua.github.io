// Wait for the DOM to be fully loaded
(function () {
    function init() {
        // Theme toggle functionality
        const themeToggle = document.getElementById("theme-toggle");
        const themeToggleMobile = document.getElementById('theme-toggle-mobile');
        const htmlElement = document.documentElement;
        const bodyElement = document.body;

        // If both toggles are missing nothing to do
        if (!themeToggle && !themeToggleMobile) return;

        const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
        const themeIconMobile = themeToggleMobile ? themeToggleMobile.querySelector('i') : null;

        // Check for saved theme preference or use preferred color scheme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Ensure no stray 'light' class interferes
        document.documentElement.classList.remove('light');
        bodyElement.classList.remove('light');

        // Apply the saved theme or use system preference
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            enableDarkMode();
        } else {
            enableLightMode();
        }

        // Toggle theme function
        function toggleTheme() {
            const isDark = document.documentElement.classList.contains('dark') || bodyElement.classList.contains('dark');
            if (isDark) {
                enableLightMode();
            } else {
                enableDarkMode();
            }
        }

        // Enable dark mode
        function enableDarkMode() {
            // add 'dark' and remove any 'light' to keep state consistent
            htmlElement.classList.add('dark');
            bodyElement.classList.add('dark');
            htmlElement.classList.remove('light');
            bodyElement.classList.remove('light');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            if (themeIconMobile) {
                themeIconMobile.classList.remove('fa-sun');
                themeIconMobile.classList.add('fa-moon');
            }
            localStorage.setItem('theme', 'dark');
        }

        // Enable light mode
        function enableLightMode() {
            // remove 'dark' and make sure no stray 'light' remains
            htmlElement.classList.remove('dark');
            bodyElement.classList.remove('dark');
            htmlElement.classList.remove('light');
            bodyElement.classList.remove('light');

            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
            if (themeIconMobile) {
                themeIconMobile.classList.remove('fa-moon');
                themeIconMobile.classList.add('fa-sun');
            }
            localStorage.setItem('theme', 'light');
        }

        // Attach listeners only to existing buttons
        if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
        if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

        // Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
                // Toggle icon between bars and times
                const icon = mobileMenuButton.querySelector('i');
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }

        // Close mobile menu when a link is clicked
        const mobileLinks = document.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (mobileMenu && mobileMenuButton) {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileMenuButton.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });

        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 70, // Adjust for fixed header
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Active navigation link based on scroll position
        const sections = document.querySelectorAll('section');

        function setActiveLink() {
            const scrollPosition = window.scrollY;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionBottom = sectionTop + section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', setActiveLink);

        // Form validation
        const contactForm = document.getElementById('contact-form');

        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();

                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const subject = document.getElementById('subject').value.trim();
                const message = document.getElementById('message').value.trim();

                if (name === '' || email === '' || subject === '' || message === '') {
                    alert('Please fill in all fields');
                    return;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address');
                    return;
                }

                fetch('https://portfolio-server-snowy-omega.vercel.app/mail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        subject,
                        message
                    })
                })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(() => {
                    alert('Message sent successfully!');
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                    alert('There was an error sending your message. Please try again later.');
                });
            });
        }

        // Back to top button
        const backToTopButton = document.createElement('div');
        backToTopButton.classList.add('back-to-top');
        backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTopButton);

        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Add animation to project cards on scroll
        const projectCards = document.querySelectorAll('.project-card');

        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        projectCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            observer.observe(card);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already ready
        init();
    }
})();
