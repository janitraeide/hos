// ===== DOCTORS PAGE JAVASCRIPT =====

// ===== DOCTOR FILTER FUNCTIONALITY =====
function initDoctorFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const doctorCards = document.querySelectorAll('.doctor-card');
    
    if (filterButtons.length === 0 || doctorCards.length === 0) {
        return;
    }
    
    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter doctors
            filterDoctors(filter, doctorCards);
        });
    });
}

function filterDoctors(filter, doctorCards) {
    doctorCards.forEach(card => {
        const department = card.getAttribute('data-department');
        
        if (filter === 'all' || department === filter) {
            // Show card with animation
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            // Hide card with animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Update results count
    updateDoctorCount(filter, doctorCards);
}

function updateDoctorCount(filter, doctorCards) {
    const visibleCards = Array.from(doctorCards).filter(card => {
        const department = card.getAttribute('data-department');
        return filter === 'all' || department === filter;
    });
    
    // Create or update count display
    let countDisplay = document.querySelector('.doctor-count');
    if (!countDisplay) {
        countDisplay = document.createElement('div');
        countDisplay.className = 'doctor-count';
        countDisplay.style.cssText = `
            text-align: center;
            margin: 2rem 0;
            font-size: 1.125rem;
            color: var(--gray-600);
        `;
        
        const doctorsGrid = document.querySelector('.doctors-grid');
        if (doctorsGrid) {
            doctorsGrid.parentNode.insertBefore(countDisplay, doctorsGrid);
        }
    }
    
    const count = visibleCards.length;
    const filterName = filter === 'all' ? 'All Departments' : 
                      filter.charAt(0).toUpperCase() + filter.slice(1);
    
    countDisplay.textContent = `Showing ${count} doctor${count !== 1 ? 's' : ''} in ${filterName}`;
}



// ===== DOCTOR CARD INTERACTIONS =====
function initDoctorCardInteractions() {
    const doctorCards = document.querySelectorAll('.doctor-card');
    
    doctorCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Handle appointment booking
        const bookButton = card.querySelector('.btn-primary');
        if (bookButton) {
            bookButton.addEventListener('click', function(e) {
                e.preventDefault();
                const doctorName = card.querySelector('.doctor-info h3').textContent;
                const doctorSpecialty = card.querySelector('.doctor-specialty').textContent;
                handleAppointmentBooking(doctorName, doctorSpecialty);
            });
        }
        
        // Handle profile viewing
        const profileButton = card.querySelector('.btn-outline');
        if (profileButton) {
            profileButton.addEventListener('click', function(e) {
                e.preventDefault();
                const doctorName = card.querySelector('.doctor-info h3').textContent;
                showDoctorProfile(doctorName, card);
            });
        }
    });
}

function handleAppointmentBooking(doctorName, specialty) {
    // Create appointment booking modal
    const modal = createAppointmentModal(doctorName, specialty);
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Handle modal close
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', function() {
        closeModal(modal);
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });
    
    // Handle form submission
    const form = modal.querySelector('form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulate appointment booking
        showNotification(`Appointment request sent for Dr. ${doctorName}`, 'success');
        closeModal(modal);
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });
}

function createAppointmentModal(doctorName, specialty) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="appointment-info">
                    <h3>Dr. ${doctorName}</h3>
                    <p>${specialty}</p>
                </div>
                <form class="appointment-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="patient-name">Full Name *</label>
                            <input type="text" id="patient-name" name="patient_name" required>
                        </div>
                        <div class="form-group">
                            <label for="patient-phone">Phone Number *</label>
                            <input type="tel" id="patient-phone" name="patient_phone" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="patient-email">Email Address *</label>
                        <input type="email" id="patient-email" name="patient_email" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="appointment-date">Preferred Date *</label>
                            <input type="date" id="appointment-date" name="appointment_date" required>
                        </div>
                        <div class="form-group">
                            <label for="appointment-time">Preferred Time *</label>
                            <select id="appointment-time" name="appointment_time" required>
                                <option value="">Select time</option>
                                <option value="09:00">9:00 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="14:00">2:00 PM</option>
                                <option value="15:00">3:00 PM</option>
                                <option value="16:00">4:00 PM</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="appointment-reason">Reason for Visit</label>
                        <textarea id="appointment-reason" name="appointment_reason" rows="3" placeholder="Please describe the reason for your appointment..."></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary close-modal">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Set minimum date to today
    const dateInput = modal.querySelector('#appointment-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    return modal;
}

function showDoctorProfile(doctorName, card) {
    // Extract doctor information
    const doctorInfo = {
        name: doctorName,
        specialty: card.querySelector('.doctor-specialty').textContent,
        experience: card.querySelector('.doctor-experience').textContent,
        description: card.querySelector('.doctor-description').textContent,
        credentials: Array.from(card.querySelectorAll('.doctor-credentials span')).map(span => span.textContent),
        image: card.querySelector('.doctor-image img').src
    };
    
    // Create profile modal
    const modal = createDoctorProfileModal(doctorInfo);
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Handle modal close
    const closeButtons = modal.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeModal(modal);
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
    });
}

function createDoctorProfileModal(doctorInfo) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h2>Doctor Profile</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="doctor-profile">
                    <div class="profile-header">
                        <img src="${doctorInfo.image}" alt="${doctorInfo.name}" class="profile-image">
                        <div class="profile-info">
                            <h3>${doctorInfo.name}</h3>
                            <p class="profile-specialty">${doctorInfo.specialty}</p>
                            <p class="profile-experience">${doctorInfo.experience}</p>
                            <div class="profile-credentials">
                                ${doctorInfo.credentials.map(cred => `<span class="credential">${cred}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="profile-description">
                        <h4>About</h4>
                        <p>${doctorInfo.description}</p>
                    </div>
                    <div class="profile-actions">
                        <button type="button" class="btn btn-outline close-modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add styles for profile modal
    const style = document.createElement('style');
    style.textContent = `
        .doctor-profile {
            padding: 1rem;
        }
        .profile-header {
            display: flex;
            gap: 2rem;
            margin-bottom: 2rem;
            align-items: center;
        }
        .profile-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
        }
        .profile-info h3 {
            font-size: 1.5rem;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        }
        .profile-specialty {
            font-size: 1.125rem;
            color: var(--secondary-color);
            font-weight: 500;
            margin-bottom: 0.5rem;
        }
        .profile-experience {
            color: var(--gray-600);
            margin-bottom: 1rem;
        }
        .profile-credentials {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        .credential {
            background-color: var(--accent-color);
            color: var(--primary-color);
            padding: 0.25rem 0.75rem;
            border-radius: var(--border-radius);
            font-size: 0.875rem;
            font-weight: 500;
        }
        .profile-description h4 {
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
        .profile-description p {
            line-height: 1.6;
            color: var(--gray-600);
            margin-bottom: 2rem;
        }
        .profile-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
        @media (max-width: 768px) {
            .profile-header {
                flex-direction: column;
                text-align: center;
            }
            .profile-actions {
                flex-direction: column;
            }
        }
    `;
    modal.appendChild(style);
    
    return modal;
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('doctors.html')) {
        initDoctorFilters();
        initDoctorCardInteractions();
    }
});
