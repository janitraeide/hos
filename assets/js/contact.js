// ===== CONTACT PAGE JAVASCRIPT =====

// ===== CONTACT PAGE INITIALIZATION =====
function initContactPage() {
    initContactForm();
    initMapInteractions();
    initServiceCards();
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleContactFormSubmission);
    
    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateContactField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateContactField(this);
            }
        });
    });
}

function validateContactField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Remove existing error styling
    field.classList.remove('error');
    removeContactFieldError(field);
    
    // Check if required field is empty
    if (required && !value) {
        showContactFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showContactFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showContactFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // Message length validation
    if (field.name === 'message' && value && value.length < 10) {
        showContactFieldError(field, 'Message must be at least 10 characters long');
        return false;
    }
    
    return true;
}

function showContactFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('span');
    errorElement.className = 'contact-field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
    field.parentNode.appendChild(errorElement);
}

function removeContactFieldError(field) {
    const errorElement = field.parentNode.querySelector('.contact-field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

async function handleContactFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateContactField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please correct the errors in the form', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    try {
        // Prepare contact data
        const contactData = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            status: 'new',
            created_at: new Date().toISOString()
        };
        
        // Submit to Supabase if available
        if (typeof window.SupabaseAPI !== 'undefined' && window.SupabaseAPI.createContactMessage) {
            await window.SupabaseAPI.createContactMessage(contactData);
        }
        
        // Show success message
        showContactSuccess();
        
        // Reset form
        form.reset();
        
    } catch (error) {
        console.error('Error submitting contact form:', error);
        showContactError();
    } finally {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

function showContactSuccess() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');
    
    if (form && successMessage) {
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Hide success message and show form again after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
            form.style.display = 'block';
        }, 5000);
    }
    
    showNotification('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
}

function showContactError() {
    const errorMessage = document.getElementById('form-error');
    
    if (errorMessage) {
        errorMessage.style.display = 'block';
        
        // Hide error message after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
    
    showNotification('Error sending message. Please try again or contact us directly.', 'error');
}

// ===== MAP INTERACTIONS =====
function initMapInteractions() {
    const mapContainer = document.querySelector('.map-embed');
    const mapIframe = document.querySelector('.map-embed iframe');
    
    if (!mapContainer || !mapIframe) return;
    
    // Add click overlay to prevent accidental scrolling
    const overlay = document.createElement('div');
    overlay.className = 'map-overlay';
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        cursor: pointer;
        z-index: 1;
    `;
    
    mapContainer.style.position = 'relative';
    mapContainer.appendChild(overlay);
    
    // Remove overlay on click to enable map interaction
    overlay.addEventListener('click', function() {
        this.style.display = 'none';
        mapIframe.focus();
        
        // Re-add overlay after losing focus
        setTimeout(() => {
            this.style.display = 'block';
        }, 3000);
    });
    
    // Add map loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'map-loading';
    loadingIndicator.innerHTML = `
        <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 2;
        ">
            <i class="fas fa-spinner fa-spin"></i>
            Loading map...
        </div>
    `;
    
    mapContainer.appendChild(loadingIndicator);
    
    // Hide loading indicator when map loads
    mapIframe.addEventListener('load', function() {
        loadingIndicator.style.display = 'none';
    });
}

// ===== SERVICE CARDS INTERACTIONS =====
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const button = card.querySelector('.btn');
        
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const serviceName = card.querySelector('h3').textContent;
                handleServiceClick(serviceName, this);
            });
        }
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function handleServiceClick(serviceName, button) {
    const originalText = button.textContent;
    
    // Show loading state
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
    
    // Simulate service action
    setTimeout(() => {
        // Reset button
        button.textContent = originalText;
        button.disabled = false;
        
        // Show appropriate message based on service
        let message = '';
        let type = 'info';
        
        switch (serviceName) {
            case 'Online Appointments':
                message = 'Redirecting to appointment booking system...';
                type = 'success';
                // In a real implementation, redirect to appointment system
                break;
            case 'Patient Portal':
                message = 'Redirecting to patient portal login...';
                type = 'success';
                // In a real implementation, redirect to patient portal
                break;
            case 'Telemedicine':
                message = 'Redirecting to telemedicine platform...';
                type = 'success';
                // In a real implementation, redirect to telemedicine
                break;
            case 'Pharmacy Services':
                message = 'Redirecting to pharmacy information...';
                type = 'success';
                // In a real implementation, redirect to pharmacy page
                break;
            default:
                message = `${serviceName} information will be available soon.`;
                type = 'info';
        }
        
        showNotification(message, type);
    }, 1500);
}

// ===== CONTACT CARD INTERACTIONS =====
function initContactCardInteractions() {
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        const link = card.querySelector('.contact-link');
        
        if (link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Handle different types of contact links
                if (href.startsWith('tel:')) {
                    // Phone call
                    showNotification('Opening phone dialer...', 'info');
                } else if (href.startsWith('mailto:')) {
                    // Email
                    showNotification('Opening email client...', 'info');
                } else if (href === '#map') {
                    // Map link
                    e.preventDefault();
                    const mapSection = document.getElementById('map');
                    if (mapSection) {
                        mapSection.scrollIntoView({ behavior: 'smooth' });
                        showNotification('Scrolling to map location...', 'info');
                    }
                }
            });
        }
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ===== EMERGENCY CONTACT INTERACTIONS =====
function initEmergencyContact() {
    const emergencyButtons = document.querySelectorAll('.emergency-actions .btn');
    
    emergencyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('tel:')) {
                // Show emergency call confirmation
                const phoneNumber = href.replace('tel:', '');
                showNotification(`Calling ${phoneNumber}...`, 'warning');
            }
        });
    });
}

// ===== FORM AUTO-SAVE =====
function initFormAutoSave() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Load saved data
        const savedValue = localStorage.getItem(`contact_form_${input.name}`);
        if (savedValue && input.type !== 'checkbox') {
            input.value = savedValue;
        }
        
        // Save data on input
        input.addEventListener('input', debounce(function() {
            localStorage.setItem(`contact_form_${this.name}`, this.value);
        }, 500));
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        inputs.forEach(input => {
            localStorage.removeItem(`contact_form_${input.name}`);
        });
    });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initAccessibilityEnhancements() {
    // Add keyboard navigation for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const button = this.querySelector('.btn');
                if (button) {
                    button.click();
                }
            }
        });
    });
    
    // Add ARIA labels to form fields
    const formFields = document.querySelectorAll('#contact-form input, #contact-form select, #contact-form textarea');
    
    formFields.forEach(field => {
        const label = field.parentNode.querySelector('label');
        if (label) {
            const labelText = label.textContent.replace('*', '').trim();
            field.setAttribute('aria-label', labelText);
            
            if (field.hasAttribute('required')) {
                field.setAttribute('aria-required', 'true');
            }
        }
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('contact.html')) {
        initContactPage();
        initContactCardInteractions();
        initEmergencyContact();
        initFormAutoSave();
        initAccessibilityEnhancements();
    }
});
