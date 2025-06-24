// ===== SUPABASE CONFIGURATION =====

// Supabase configuration - Replace with your actual Supabase URL and anon key
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
let supabase;

// Check if Supabase is available
if (typeof window !== 'undefined' && window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.warn('Supabase client not loaded. Please include the Supabase CDN script.');
}

// ===== DATABASE OPERATIONS =====

// ===== JOBS OPERATIONS =====
async function fetchJobs(filters = {}) {
    try {
        let query = supabase
            .from('jobs')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false });
        
        // Apply filters
        if (filters.department) {
            query = query.eq('department', filters.department);
        }
        
        if (filters.job_type) {
            query = query.eq('job_type', filters.job_type);
        }
        
        const { data, error } = await query;
        
        if (error) {
            console.error('Error fetching jobs:', error);
            return [];
        }
        
        return data || [];
    } catch (error) {
        console.error('Error in fetchJobs:', error);
        return [];
    }
}

async function createJobApplication(applicationData) {
    try {
        const { data, error } = await supabase
            .from('job_applications')
            .insert([applicationData])
            .select();
        
        if (error) {
            console.error('Error creating job application:', error);
            throw error;
        }
        
        return data[0];
    } catch (error) {
        console.error('Error in createJobApplication:', error);
        throw error;
    }
}

// ===== CONTACT OPERATIONS =====
async function createContactMessage(messageData) {
    try {
        const { data, error } = await supabase
            .from('contact_messages')
            .insert([messageData])
            .select();
        
        if (error) {
            console.error('Error creating contact message:', error);
            throw error;
        }
        
        return data[0];
    } catch (error) {
        console.error('Error in createContactMessage:', error);
        throw error;
    }
}

// ===== FILE UPLOAD OPERATIONS =====
async function uploadFile(file, bucket = 'resumes') {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file);
        
        if (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);
        
        return {
            path: data.path,
            url: urlData.publicUrl
        };
    } catch (error) {
        console.error('Error in uploadFile:', error);
        throw error;
    }
}

// ===== SAMPLE DATA FUNCTIONS =====
// These functions create sample data for demonstration purposes
async function createSampleJobs() {
    const sampleJobs = [
        {
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
            ],
            status: 'active'
        },
        {
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
            ],
            status: 'active'
        },
        {
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
            ],
            status: 'active'
        },
        {
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
            ],
            status: 'active'
        },
        {
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
            ],
            status: 'active'
        },
        {
            title: 'Pharmacy Technician',
            department: 'technical',
            location: 'Hospital Pharmacy',
            job_type: 'full-time',
            description: 'Seeking a certified Pharmacy Technician to assist pharmacists in medication preparation and distribution.',
            requirements: [
                'Pharmacy Technician certification',
                'High school diploma or equivalent',
                'Previous pharmacy experience preferred',
                'Attention to detail',
                'Ability to work in fast-paced environment'
            ],
            benefits: [
                'Competitive salary',
                'Health and dental insurance',
                'Paid time off',
                'Shift differentials',
                'Employee discounts'
            ],
            status: 'active'
        }
    ];
    
    try {
        const { data, error } = await supabase
            .from('jobs')
            .insert(sampleJobs)
            .select();
        
        if (error) {
            console.error('Error creating sample jobs:', error);
            return false;
        }
        
        console.log('Sample jobs created successfully:', data);
        return true;
    } catch (error) {
        console.error('Error in createSampleJobs:', error);
        return false;
    }
}

// ===== INITIALIZATION =====
async function initializeSupabase() {
    if (!supabase) {
        console.error('Supabase client not initialized');
        return false;
    }
    
    try {
        // Test connection
        const { data, error } = await supabase
            .from('jobs')
            .select('count', { count: 'exact', head: true });
        
        if (error) {
            console.error('Supabase connection test failed:', error);
            return false;
        }
        
        console.log('Supabase connected successfully');
        return true;
    } catch (error) {
        console.error('Error initializing Supabase:', error);
        return false;
    }
}

// ===== HELPER FUNCTIONS =====
function formatJobData(formData, jobId) {
    return {
        job_id: jobId,
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        cover_letter: formData.get('cover_letter'),
        experience: formData.get('experience'),
        resume_url: null, // Will be updated after file upload
        status: 'pending',
        applied_at: new Date().toISOString()
    };
}

function formatContactData(formData) {
    return {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        status: 'new',
        created_at: new Date().toISOString()
    };
}

// ===== ERROR HANDLING =====
function handleSupabaseError(error, operation) {
    console.error(`Supabase error in ${operation}:`, error);
    
    let userMessage = 'An error occurred. Please try again.';
    
    if (error.message.includes('network')) {
        userMessage = 'Network error. Please check your connection and try again.';
    } else if (error.message.includes('permission')) {
        userMessage = 'Permission denied. Please contact support.';
    } else if (error.message.includes('validation')) {
        userMessage = 'Invalid data. Please check your input and try again.';
    }
    
    showNotification(userMessage, 'error');
    return userMessage;
}

// ===== EXPORT FUNCTIONS =====
// Make functions available globally
window.SupabaseAPI = {
    fetchJobs,
    createJobApplication,
    createContactMessage,
    uploadFile,
    createSampleJobs,
    initializeSupabase,
    formatJobData,
    formatContactData,
    handleSupabaseError
};

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're not in a development environment
    if (SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
        initializeSupabase();
    } else {
        console.warn('Supabase not configured. Please update SUPABASE_URL and SUPABASE_ANON_KEY in supabase.js');
    }
});
