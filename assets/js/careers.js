// ===== CAREERS PAGE JAVASCRIPT =====

let currentJobs = [];
let filteredJobs = [];

// ===== CAREERS PAGE INITIALIZATION =====
function initCareersPage() {
    initJobFilters();
    initApplicationModal();
    loadJobs();
}

// ===== JOB LOADING =====
async function loadJobs() {
    const jobsContainer = document.getElementById('jobs-container');
    const loadingSpinner = document.getElementById('jobs-loading');
    const noJobsMessage = document.getElementById('no-jobs');
    
    if (!jobsContainer) return;
    
    try {
        // Show loading spinner
        if (loadingSpinner) {
            loadingSpinner.style.display = 'block';
        }
        
        // Check if Supabase is configured
        if (typeof window.SupabaseAPI !== 'undefined' && window.SupabaseAPI.fetchJobs) {
            // Try to fetch from Supabase
            currentJobs = await window.SupabaseAPI.fetchJobs();
        }
        
        // If no jobs from Supabase, use sample data
        if (currentJobs.length === 0) {
            currentJobs = getSampleJobs();
        }
        
        filteredJobs = [...currentJobs];
        
        // Hide loading spinner
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
        
        // Display jobs
        displayJobs(filteredJobs);
        
    } catch (error) {
        console.error('Error loading jobs:', error);
        
        // Hide loading spinner
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
        
        // Use sample data as fallback
        currentJobs = getSampleJobs();
        filteredJobs = [...currentJobs];
        displayJobs(filteredJobs);
    }
}

function getSampleJobs() {
    return [
        {
            id: 1,
            title: 'Registered Nurse - ICU',
            department: 'nursing',
            location: 'Main Hospital',
            job_type: 'full-time',
            description: 'We are seeking a dedicated Registered Nurse to join our Intensive Care Unit team. The ideal candidate will provide direct patient care in a fast-paced, critical care environment.',
            requirements: [
                'Current RN license in good standing',
                'BSN preferred',
                'Minimum 2 years ICU experience',
                'BLS and ACLS certification required',
                'Strong critical thinking skills'
            ],
            benefits: [
                'Competitive salary',
                'Comprehensive health insurance',
                'Retirement plan with matching',
                'Continuing education support',
                'Flexible scheduling'
            ]
        },
        {
            id: 2,
            title: 'Emergency Medicine Physician',
            department: 'medical',
            location: 'Emergency Department',
            job_type: 'full-time',
            description: 'Join our Emergency Medicine team providing 24/7 emergency care. We are looking for a board-certified Emergency Medicine physician.',
            requirements: [
                'MD or DO degree',
                'Board certification in Emergency Medicine',
                'Current medical license',
                'ATLS certification',
                'Excellent communication skills'
            ],
            benefits: [
                'Competitive compensation package',
                'Malpractice insurance coverage',
                'CME allowance',
                'Health and dental insurance',
                'Retirement benefits'
            ]
        },
        {
            id: 3,
            title: 'Medical Technologist',
            department: 'technical',
            location: 'Laboratory',
            job_type: 'full-time',
            description: 'Seeking a skilled Medical Technologist to perform complex laboratory tests and procedures in our state-of-the-art laboratory.',
            requirements: [
                'Bachelor\'s degree in Medical Technology or related field',
                'ASCP certification preferred',
                'Experience with laboratory equipment',
                'Attention to detail',
                'Ability to work independently'
            ],
            benefits: [
                'Competitive salary',
                'Health insurance',
                'Paid time off',
                'Professional development opportunities',
                'Stable work schedule'
            ]
        },
        {
            id: 4,
            title: 'Patient Care Coordinator',
            department: 'administrative',
            location: 'Outpatient Services',
            job_type: 'full-time',
            description: 'We are looking for a Patient Care Coordinator to help manage patient flow and ensure excellent patient experience.',
            requirements: [
                'High school diploma or equivalent',
                'Previous healthcare experience preferred',
                'Strong communication skills',
                'Computer proficiency',
                'Customer service orientation'
            ],
            benefits: [
                'Competitive hourly wage',
                'Health benefits',
                'Paid holidays',
                'Training provided',
                'Career advancement opportunities'
            ]
        },
        {
            id: 5,
            title: 'Physical Therapist',
            department: 'medical',
            location: 'Rehabilitation Center',
            job_type: 'part-time',
            description: 'Join our rehabilitation team as a Physical Therapist providing comprehensive therapy services to patients.',
            requirements: [
                'Doctor of Physical Therapy degree',
                'Current state PT license',
                'Experience in acute care preferred',
                'Strong interpersonal skills',
                'Commitment to patient care'
            ],
            benefits: [
                'Flexible scheduling',
                'Competitive hourly rate',
                'Professional development support',
                'Collaborative work environment',
                'Part-time benefits package'
            ]
        }
    ];
}

// ===== JOB DISPLAY =====
function displayJobs(jobs) {
    const jobsContainer = document.getElementById('jobs-container');
    const noJobsMessage = document.getElementById('no-jobs');
    
    if (!jobsContainer) return;
    
    // Clear existing content
    jobsContainer.innerHTML = '';
    
    if (jobs.length === 0) {
        if (noJobsMessage) {
            noJobsMessage.style.display = 'block';
        }
        return;
    }
    
    if (noJobsMessage) {
        noJobsMessage.style.display = 'none';
    }
    
    jobs.forEach(job => {
        const jobCard = createJobCard(job);
        jobsContainer.appendChild(jobCard);
    });
}

function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
        <div class="job-header">
            <div class="job-info">
                <h3 class="job-title">${job.title}</h3>
                <div class="job-meta">
                    <span class="job-department">${formatDepartment(job.department)}</span>
                    <span class="job-location">${job.location}</span>
                    <span class="job-type">${formatJobType(job.job_type)}</span>
                </div>
            </div>
            <div class="job-actions">
                <button class="btn btn-primary apply-btn" data-job-id="${job.id}" data-job-title="${job.title}">
                    Apply Now
                </button>
            </div>
        </div>
        <div class="job-description">
            <p>${job.description}</p>
        </div>
        <div class="job-requirements">
            <h4>Requirements:</h4>
            <ul>
                ${job.requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
        </div>
        <div class="job-benefits">
            <h4>Benefits:</h4>
            <ul>
                ${job.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
        </div>
    `;
    
    // Add apply button event listener
    const applyButton = card.querySelector('.apply-btn');
    applyButton.addEventListener('click', function() {
        const jobId = this.getAttribute('data-job-id');
        const jobTitle = this.getAttribute('data-job-title');
        openApplicationModal(jobId, jobTitle);
    });
    
    return card;
}

function formatDepartment(department) {
    const departments = {
        'nursing': 'Nursing',
        'medical': 'Medical',
        'administrative': 'Administrative',
        'technical': 'Technical',
        'support': 'Support Services'
    };
    return departments[department] || department;
}

function formatJobType(jobType) {
    const types = {
        'full-time': 'Full-time',
        'part-time': 'Part-time',
        'contract': 'Contract'
    };
    return types[jobType] || jobType;
}

// ===== JOB FILTERS =====
function initJobFilters() {
    const departmentFilter = document.getElementById('department-filter');
    const typeFilter = document.getElementById('type-filter');
    
    if (departmentFilter) {
        departmentFilter.addEventListener('change', applyFilters);
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }
}

function applyFilters() {
    const departmentFilter = document.getElementById('department-filter');
    const typeFilter = document.getElementById('type-filter');
    
    const selectedDepartment = departmentFilter ? departmentFilter.value : '';
    const selectedType = typeFilter ? typeFilter.value : '';
    
    filteredJobs = currentJobs.filter(job => {
        const departmentMatch = !selectedDepartment || job.department === selectedDepartment;
        const typeMatch = !selectedType || job.job_type === selectedType;
        return departmentMatch && typeMatch;
    });
    
    displayJobs(filteredJobs);
}

// ===== APPLICATION MODAL =====
function initApplicationModal() {
    const modal = document.getElementById('application-modal');
    const closeButton = document.getElementById('close-modal');
    const cancelButton = document.getElementById('cancel-application');
    const form = document.getElementById('application-form');
    
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            closeModal(modal);
        });
    }
    
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            closeModal(modal);
        });
    }
    
    if (form) {
        form.addEventListener('submit', handleApplicationSubmission);
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    }
}

function openApplicationModal(jobId, jobTitle) {
    const modal = document.getElementById('application-modal');
    const jobTitleInput = document.getElementById('job-title');
    
    if (modal && jobTitleInput) {
        jobTitleInput.value = jobTitle;
        modal.setAttribute('data-job-id', jobId);
        openModal('application-modal');
    }
}

async function handleApplicationSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const modal = form.closest('.modal');
    const jobId = modal.getAttribute('data-job-id');
    const formData = new FormData(form);
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitButton.disabled = true;
    
    try {
        // Handle file upload if resume is provided
        const resumeFile = formData.get('resume');
        let resumeUrl = null;
        
        if (resumeFile && resumeFile.size > 0) {
            if (typeof window.SupabaseAPI !== 'undefined' && window.SupabaseAPI.uploadFile) {
                const uploadResult = await window.SupabaseAPI.uploadFile(resumeFile, 'resumes');
                resumeUrl = uploadResult.url;
            }
        }
        
        // Prepare application data
        const applicationData = {
            job_id: jobId,
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            cover_letter: formData.get('cover_letter'),
            experience: formData.get('experience'),
            resume_url: resumeUrl,
            status: 'pending',
            applied_at: new Date().toISOString()
        };
        
        // Submit application
        if (typeof window.SupabaseAPI !== 'undefined' && window.SupabaseAPI.createJobApplication) {
            await window.SupabaseAPI.createJobApplication(applicationData);
        }
        
        // Show success message
        showNotification('Application submitted successfully! We will review your application and contact you soon.', 'success');
        
        // Reset form and close modal
        form.reset();
        closeModal(modal);
        
    } catch (error) {
        console.error('Error submitting application:', error);
        showNotification('Error submitting application. Please try again.', 'error');
    } finally {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// ===== UTILITY FUNCTIONS =====
function searchJobs(searchTerm) {
    if (!searchTerm.trim()) {
        filteredJobs = [...currentJobs];
    } else {
        const term = searchTerm.toLowerCase();
        filteredJobs = currentJobs.filter(job => 
            job.title.toLowerCase().includes(term) ||
            job.description.toLowerCase().includes(term) ||
            job.department.toLowerCase().includes(term) ||
            job.location.toLowerCase().includes(term)
        );
    }
    
    displayJobs(filteredJobs);
}

// Add search functionality
function initJobSearch() {
    // Create search input
    const searchContainer = document.createElement('div');
    searchContainer.className = 'job-search';
    searchContainer.style.cssText = `
        margin-bottom: 2rem;
        text-align: center;
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search jobs by title, description, or location...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        width: 100%;
        max-width: 500px;
        padding: 0.75rem 1rem;
        border: 2px solid var(--gray-300);
        border-radius: var(--border-radius);
        font-size: var(--font-size-base);
        transition: var(--transition);
    `;
    
    searchContainer.appendChild(searchInput);
    
    // Insert search before job filter
    const jobFilter = document.querySelector('.job-filter');
    if (jobFilter) {
        jobFilter.parentNode.insertBefore(searchContainer, jobFilter);
    }
    
    // Add search functionality
    searchInput.addEventListener('input', debounce(function() {
        searchJobs(this.value);
    }, 300));
    
    // Focus styles
    searchInput.addEventListener('focus', function() {
        this.style.borderColor = 'var(--primary-color)';
        this.style.outline = 'none';
    });
    
    searchInput.addEventListener('blur', function() {
        this.style.borderColor = 'var(--gray-300)';
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('careers.html')) {
        initCareersPage();
        initJobSearch();
    }
});
