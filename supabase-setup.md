# JANI Hospital - Supabase Setup Guide

## Overview
This guide will help you set up Supabase for the JANI Hospital website, including database tables, storage buckets, and security policies.

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project in Supabase
3. Get your project URL and anon key from the project settings

## Step 1: Update Configuration
1. Open `assets/js/supabase.js`
2. Replace `YOUR_SUPABASE_URL` with your actual Supabase project URL
3. Replace `YOUR_SUPABASE_ANON_KEY` with your actual anon key

## Step 2: Create Database Tables

### Jobs Table
```sql
CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] NOT NULL,
    benefits TEXT[] NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Job Applications Table
```sql
CREATE TABLE job_applications (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT REFERENCES jobs(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    cover_letter TEXT,
    experience VARCHAR(50),
    resume_url TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Contact Messages Table
```sql
CREATE TABLE contact_messages (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Step 3: Create Storage Buckets

### Resumes Bucket
1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `resumes`
3. Set it as public bucket for easy access

### Images Bucket (Optional)
1. Create a bucket named `images` for hospital images
2. Set it as public bucket

## Step 4: Set Up Row Level Security (RLS)

### Jobs Table Policies
```sql
-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active jobs
CREATE POLICY "Public read access for active jobs" ON jobs
    FOR SELECT USING (status = 'active');

-- Allow authenticated users to insert jobs (for admin)
CREATE POLICY "Authenticated users can insert jobs" ON jobs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### Job Applications Table Policies
```sql
-- Enable RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anyone can apply)
CREATE POLICY "Public can insert applications" ON job_applications
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read applications (for admin)
CREATE POLICY "Authenticated users can read applications" ON job_applications
    FOR SELECT USING (auth.role() = 'authenticated');
```

### Contact Messages Table Policies
```sql
-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anyone can send messages)
CREATE POLICY "Public can insert messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read messages (for admin)
CREATE POLICY "Authenticated users can read messages" ON contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');
```

## Step 5: Storage Policies

### Resumes Bucket Policies
```sql
-- Allow public upload to resumes bucket
CREATE POLICY "Public can upload resumes" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'resumes');

-- Allow public read access to resumes
CREATE POLICY "Public can read resumes" ON storage.objects
    FOR SELECT USING (bucket_id = 'resumes');
```

## Step 6: Insert Sample Data

### Sample Jobs
```sql
INSERT INTO jobs (title, department, location, job_type, description, requirements, benefits) VALUES
('Registered Nurse - ICU', 'nursing', 'Main Hospital', 'full-time', 
 'We are seeking a dedicated Registered Nurse to join our Intensive Care Unit team.',
 ARRAY['Current RN license', 'BSN preferred', 'Minimum 2 years ICU experience'],
 ARRAY['Competitive salary', 'Health insurance', 'Retirement plan']),

('Emergency Medicine Physician', 'medical', 'Emergency Department', 'full-time',
 'Join our Emergency Medicine team providing 24/7 emergency care.',
 ARRAY['MD or DO degree', 'Board certification in Emergency Medicine', 'Current medical license'],
 ARRAY['Competitive compensation', 'Malpractice insurance', 'CME allowance']),

('Medical Technologist', 'technical', 'Laboratory', 'full-time',
 'Seeking a skilled Medical Technologist for our state-of-the-art laboratory.',
 ARRAY['Bachelor degree in Medical Technology', 'ASCP certification preferred'],
 ARRAY['Competitive salary', 'Health insurance', 'Professional development']);
```

## Step 7: Test the Setup

1. Open the website in your browser
2. Navigate to the Careers page
3. Verify that jobs are loading from Supabase
4. Test the job application form
5. Test the contact form on the Contact page
6. Check your Supabase dashboard to see if data is being inserted

## Step 8: Optional Enhancements

### Email Notifications
Set up Supabase Edge Functions to send email notifications when:
- New job applications are received
- New contact messages are submitted

### Admin Dashboard
Create an admin interface to:
- Manage job listings
- Review applications
- Respond to contact messages

### File Upload Validation
Add server-side validation for uploaded files:
- File type restrictions
- File size limits
- Virus scanning

## Security Considerations

1. **API Keys**: Never expose your service role key in client-side code
2. **File Uploads**: Implement proper file validation and scanning
3. **Rate Limiting**: Consider implementing rate limiting for form submissions
4. **Data Validation**: Always validate data on both client and server side
5. **HTTPS**: Ensure your website is served over HTTPS

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure your domain is added to the allowed origins in Supabase
2. **RLS Policies**: Verify that your RLS policies allow the required operations
3. **API Keys**: Double-check that you're using the correct anon key
4. **Network Issues**: Check your internet connection and Supabase status

### Debug Steps:
1. Check browser console for errors
2. Verify Supabase connection in Network tab
3. Test API calls directly in Supabase dashboard
4. Review Supabase logs for any errors

## Support
- Supabase Documentation: https://supabase.com/docs
- Supabase Community: https://github.com/supabase/supabase/discussions
- JANI Hospital Website Issues: Check the project repository

---

**Note**: This setup provides a basic foundation. For production use, consider additional security measures, monitoring, and backup strategies.
