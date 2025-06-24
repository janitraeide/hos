// ===== MAIN JAVASCRIPT FILE =====

// ===== GLOBAL VARIABLES =====
let isLoading = false;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initNavigation();
    initScrollAnimations();
    initSmoothScrolling();
    initFormValidation();
    
    // Page-specific initializations
    if (window.location.pathname.includes('doctors.html')) {
        initDoctorFilters();
    }
    
    if (window.location.pathname.includes('careers.html')) {
        initCareersPage();
    }
    
    if (window.location.pathname.includes('contact.html')) {
        initContactPage();
    }
});

// ===== PRELOADER =====
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        // Hide preloader after page load
        window.addEventListener('load', function() {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        });
    }
}

// ===== NAVIGATION =====
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const header = document.getElementById('header');
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.backgroundColor = '#ffffff';
                header.style.backdropFilter = 'none';
            }
        });
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.department-card, .testimonial-card, .news-card, .benefit-card, .doctor-card, .job-card, .contact-card, .service-card');
    
    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                handleFormSubmission(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Remove existing error styling
    field.classList.remove('error');
    removeErrorMessage(field);
    
    // Check if required field is empty
    if (required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // File validation
    if (type === 'file' && field.files.length > 0) {
        const file = field.files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        if (file.size > maxSize) {
            showFieldError(field, 'File size must be less than 5MB');
            return false;
        }
        
        if (!allowedTypes.includes(file.type)) {
            showFieldError(field, 'Please upload a PDF, DOC, or DOCX file');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorElement);
}

function removeErrorMessage(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// ===== FORM SUBMISSION =====
function handleFormSubmission(form) {
    if (isLoading) return;
    
    isLoading = true;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual Supabase integration)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Show success message
        showNotification('Form submitted successfully!', 'success');
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        isLoading = false;
        
        // Close modal if it exists
        const modal = form.closest('.modal');
        if (modal) {
            closeModal(modal);
        }
    }, 2000);
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
        border-radius: 0.375rem;
        padding: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== MODAL FUNCTIONALITY =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    if (typeof modal === 'string') {
        modal = document.getElementById(modal);
    }
    
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== CSS ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.25rem;
        cursor: pointer;
        margin-left: 1rem;
        opacity: 0.7;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .field-error {
        display: block;
    }
    
    input.error,
    select.error,
    textarea.error {
        border-color: #dc3545 !important;
    }
`;
document.head.appendChild(style);
