// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form functionality - Enhanced for mobile
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Add form validation
        const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.style.borderColor = '#F44336';
                } else {
                    this.style.borderColor = '#3C3C3C';
                }
            });
            
            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '#3C3C3C';
                }
            });
        });
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            let isValid = true;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#F44336';
                    isValid = false;
                } else {
                    input.style.borderColor = '#3C3C3C';
                }
            });
            
            if (!isValid) {
                showNotification('Por favor, completa todos los campos requeridos.', 'error');
                return;
            }
            
            
            const submitBtn = this.querySelector('.submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            const formData = new FormData(this);
            
            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            
            // Submit to Formspree
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Reset form
                    this.reset();
                    showNotification('¡Mensaje enviado exitosamente! Te responderé pronto.', 'success');
                } else {
                    throw new Error('Error al enviar el mensaje');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.', 'error');
            })
            .finally(() => {
                // Reset button state
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            });
        });
        
        // Add touch events for submit button to ensure it works on mobile
        const submitBtn = contactForm.querySelector('.submit-btn');
        if (submitBtn) {
            // Ensure touch events work properly for form submission
            submitBtn.addEventListener('touchstart', function(e) {
                // Don't prevent default - allow form submission
            });
            
            submitBtn.addEventListener('touchend', function(e) {
                // Don't prevent default - allow form submission
            });
            
            // Add click event as fallback
            submitBtn.addEventListener('click', function(e) {
                // This will trigger the form submission
            });
        }
    }
});

// Notification system - Mobile optimized
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const iconMap = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'info': 'info-circle'
    };
    
    const colorMap = {
        'success': '#4CAF50',
        'error': '#F44336',
        'info': '#2196F3'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${iconMap[type] || 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Mobile-responsive styles
    const isMobile = window.innerWidth <= 768;
    const position = isMobile ? 'center' : 'right';
    
    notification.style.cssText = `
        position: fixed;
        top: ${isMobile ? '20px' : '20px'};
        ${position === 'center' ? 'left: 50%; transform: translateX(-50%) translateY(-100%);' : 'right: 20px; transform: translateX(100%);'}
        background: ${colorMap[type] || '#2196F3'};
        color: white;
        padding: ${isMobile ? '12px 16px' : '15px 20px'};
        border-radius: ${isMobile ? '12px' : '8px'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: ${isMobile ? '90vw' : '400px'};
        font-size: ${isMobile ? '0.9rem' : '1rem'};
        transition: all 0.3s ease;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        if (isMobile) {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        } else {
            notification.style.transform = 'translateX(0)';
        }
    }, 100);
    
    // Remove after 4 seconds (shorter for mobile)
    setTimeout(() => {
        if (isMobile) {
            notification.style.transform = 'translateX(-50%) translateY(-100%)';
        } else {
            notification.style.transform = 'translateX(100%)';
        }
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, isMobile ? 4000 : 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('section, .project-card, .skill-item, .stat');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
});

// Mobile menu toggle - Enhanced for mobile
function toggleMobileMenu() {
    const nav = document.querySelector('.nav-menu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const overlay = document.querySelector('.menu-overlay');
    
    if (!nav || !menuBtn) return;
    
    nav.classList.toggle('active');
    menuBtn.classList.toggle('active');
    
    if (overlay) {
        overlay.classList.toggle('active');
    }
    
    // Prevent body scroll when menu is open
    if (nav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    const nav = document.querySelector('.nav-menu');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const overlay = document.querySelector('.menu-overlay');
    
    if (!nav || !menuBtn) return;
    
    nav.classList.remove('active');
    menuBtn.classList.remove('active');
    
    if (overlay) {
        overlay.classList.remove('active');
    }
    
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
}

// Enhanced mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const menuCloseBtn = document.querySelector('.menu-close-btn');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const nav = document.querySelector('.nav-menu');
    
    // Add click event to mobile menu button
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Add touch events for better mobile support
        mobileMenuBtn.addEventListener('touchstart', function(e) {
            // Don't prevent default - allow menu toggle
        });
        
        mobileMenuBtn.addEventListener('touchend', function(e) {
            // Don't prevent default - allow menu toggle
        });
    }
    
    // Add click event to menu close button
    if (menuCloseBtn) {
        menuCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMobileMenu();
        });
        
        // Add touch events for better mobile support
        menuCloseBtn.addEventListener('touchstart', function(e) {
            // Don't prevent default - allow menu close
        });
        
        menuCloseBtn.addEventListener('touchend', function(e) {
            // Don't prevent default - allow menu close
        });
    }
    
    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            closeMobileMenu();
            
            // Smooth scroll to target
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300);
            }
        });
        
        // Add touch events for nav links
        link.addEventListener('touchstart', function(e) {
            // Allow default touch behavior for links
        });
    });
    
    // Close menu when clicking on overlay
    const overlay = document.querySelector('.menu-overlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            e.preventDefault();
            closeMobileMenu();
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (nav && nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav && nav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && nav && nav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
});

// Typing effect for hero section
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', function() {
    const heroTitle = document.querySelector('#hero h2');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(21, 21, 21, 0.95)';
        header.style.webkitBackdropFilter = 'blur(10px)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = '#151515';
        header.style.webkitBackdropFilter = 'none';
        header.style.backdropFilter = 'none';
    }
});

// Touch interactions for mobile
document.addEventListener('DOMContentLoaded', function() {
    // Add touch feedback to interactive elements
    const interactiveElements = document.querySelectorAll('.button, .project-card, .skill-item, .contact-method, .social-links a');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
    
    // Improve touch scrolling
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            // Close mobile menu on swipe up
            if (diff > 0) {
                const nav = document.querySelector('.nav-menu');
                if (nav && nav.classList.contains('active')) {
                    closeMobileMenu();
                }
            }
        }
    }
    
    // Prevent zoom on double tap for buttons (except submit button, mobile menu button, and menu close button)
    const buttons = document.querySelectorAll('button:not(.submit-btn):not(.mobile-menu-btn):not(.menu-close-btn), .button');
    buttons.forEach(button => {
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
        });
    });
});
