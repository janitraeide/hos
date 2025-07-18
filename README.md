# JANI Hospital Website

A modern, responsive hospital website built with HTML, CSS, JavaScript, and Supabase. This website provides comprehensive information about JANI Hospital's services, departments, doctors, and career opportunities.

## 🏥 Features

### Core Pages
- **Home Page**: Hero section, welcome message, departments preview, testimonials, health news
- **About Page**: Mission, vision, values, leadership team, accreditations
- **Departments Page**: Comprehensive list of medical specialties with detailed information
- **Doctors Page**: Medical team profiles with filtering by department
- **Careers Page**: Dynamic job listings with application functionality
- **Contact Page**: Contact forms, location map, and hospital information

### Key Functionality
- **Responsive Design**: Mobile-first approach with full responsiveness
- **Dynamic Content**: Job listings loaded from Supabase database
- **Form Handling**: Contact forms and job applications with validation
- **File Upload**: Resume upload functionality for job applications
- **Search & Filter**: Filter doctors by department, search jobs
- **Smooth Animations**: Scroll animations and hover effects
- **SEO Optimized**: Meta tags, semantic HTML, and accessibility features

## 🚀 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (Database, Storage, Authentication)
- **Styling**: Custom CSS with CSS Variables and Flexbox/Grid
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Poppins)
- **Maps**: Google Maps Embed

## 📁 Project Structure

```
JANI-Hospital/
├── index.html              # Home page
├── about.html              # About page
├── departments.html        # Departments page
├── doctors.html           # Doctors page
├── careers.html           # Careers page
├── contact.html           # Contact page
├── assets/
│   ├── css/
│   │   ├── style.css      # Main stylesheet
│   │   └── responsive.css  # Responsive design styles
│   ├── js/
│   │   ├── main.js        # Main JavaScript functionality
│   │   ├── supabase.js    # Supabase integration
│   │   ├── doctors.js     # Doctors page functionality
│   │   ├── careers.js     # Careers page functionality
│   │   └── contact.js     # Contact page functionality
│   └── images/            # Image assets (placeholder)
├── supabase-setup.md      # Supabase setup instructions
└── README.md              # This file
```

## 🛠️ Setup Instructions

### 1. Clone or Download
Download the project files to your local machine or web server.

### 2. Supabase Setup
1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Follow the detailed setup instructions in `supabase-setup.md`
4. Update the Supabase configuration in `assets/js/supabase.js`

### 3. Image Assets
Replace placeholder image references with actual hospital images:
- Hospital building photos
- Doctor profile photos
- Department images
- News article images
- Logo and favicon

### 4. Google Maps
Update the Google Maps embed in `contact.html` with your actual hospital location.

### 5. Contact Information
Update all contact information throughout the website:
- Phone numbers
- Email addresses
- Physical address
- Social media links

## 🎨 Customization

### Colors
The website uses CSS custom properties for easy color customization. Update the `:root` variables in `assets/css/style.css`:

```css
:root {
    --primary-color: #2c5aa0;    /* Main brand color */
    --secondary-color: #4a90a4;  /* Secondary brand color */
    --accent-color: #87ceeb;     /* Accent color */
    /* ... other colors */
}
```

### Typography
Change fonts by updating the Google Fonts import and font-family declarations.

### Layout
Modify layouts using the existing CSS Grid and Flexbox structures.

## 📱 Responsive Design

The website is fully responsive with breakpoints at:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 JavaScript Features

### Main Functionality (`main.js`)
- Navigation menu (mobile toggle)
- Smooth scrolling
- Form validation
- Scroll animations
- Notification system
- Modal functionality

### Supabase Integration (`supabase.js`)
- Database operations
- File upload handling
- Error handling
- Sample data creation

### Page-Specific Scripts
- **Doctors**: Filtering, search, appointment booking
- **Careers**: Job loading, filtering, application submission
- **Contact**: Form handling, map interactions

## 🗄️ Database Schema

### Tables
- **jobs**: Job listings with requirements and benefits
- **job_applications**: Application submissions with resume uploads
- **contact_messages**: Contact form submissions

See `supabase-setup.md` for complete database schema and setup instructions.

## 🔒 Security Features

- Row Level Security (RLS) policies
- Form validation (client and server-side)
- File upload restrictions
- CORS protection
- Input sanitization

## 🚀 Deployment

### Static Hosting
The website can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Traditional web hosting

### Environment Variables
For production deployment, consider using environment variables for:
- Supabase URL and keys
- Google Maps API key
- Email service configuration

## 🧪 Testing

### Manual Testing Checklist
- [ ] All pages load correctly
- [ ] Navigation works on all devices
- [ ] Forms submit successfully
- [ ] File uploads work
- [ ] Responsive design on various screen sizes
- [ ] Cross-browser compatibility

### Automated Testing
Consider adding:
- Unit tests for JavaScript functions
- Integration tests for Supabase operations
- End-to-end tests for user workflows

## 🔧 Maintenance

### Regular Updates
- Update dependencies
- Review and update content
- Monitor Supabase usage
- Check for broken links
- Update doctor profiles and job listings

### Performance Optimization
- Optimize images
- Minify CSS and JavaScript
- Enable compression
- Use CDN for assets
- Monitor Core Web Vitals

## 📞 Support

For technical support or questions:
1. Check the `supabase-setup.md` for database issues
2. Review browser console for JavaScript errors
3. Verify Supabase configuration and policies
4. Check network connectivity and CORS settings

## 📄 License

This project is created for educational and demonstration purposes. Feel free to use and modify for your own hospital or healthcare website.

## 🤝 Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📋 TODO / Future Enhancements

- [ ] Add appointment booking system
- [ ] Implement patient portal
- [ ] Add telemedicine integration
- [ ] Create admin dashboard
- [ ] Add multi-language support
- [ ] Implement push notifications
- [ ] Add blog/news management system
- [ ] Integrate with hospital management system

---

**JANI Hospital Website** - Excellence in Healthcare, Excellence in Web Design
#   h o s  
 