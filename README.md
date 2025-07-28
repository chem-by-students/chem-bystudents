# Chem By Students - Chemistry Club Website

A modern, responsive website for your school's chemistry club where students can explore and upload chemistry topics.

## 🌟 Features

- **Beautiful Design**: Modern, chemistry-themed design with animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Elements**: Smooth scrolling, hover effects, and animations
- **Upload System**: Students can upload their chemistry explanations
- **Contact Form**: Easy way for students to get in touch
- **Mobile Navigation**: Hamburger menu for mobile devices

## 📁 File Structure

```
ChemByStudents/
├── index.html          # Main HTML file
├── styles.css          # CSS styling and animations
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🚀 How to Use

1. **Open the Website**: Simply open `index.html` in your web browser
2. **Authentication**: You'll be greeted with a login/signup screen
3. **Sign Up**: Create an account with username, email, and password
4. **Email Verification**: Enter the OTP sent to your email
5. **Login**: Use your credentials to access the website
6. **Admin Access**: Only admins can upload new chemistry explanations
7. **Browse Content**: Explore chemistry topics and watch videos
8. **Contact**: Use the contact form to get in touch with the club

## 🎨 Customization

### Changing Colors
The website uses a blue-purple gradient theme. To change colors, edit these CSS variables in `styles.css`:

```css
/* Primary colors */
--primary-color: #2563eb;
--secondary-color: #667eea;
--accent-color: #764ba2;
```

### Adding New Topics
To add new chemistry topics, edit the `topics-grid` section in `index.html`:

```html
<div class="topic-card">
    <div class="topic-icon">
        <i class="fas fa-[icon-name]"></i>
    </div>
    <h3>Your Topic Title</h3>
    <p>Description of your chemistry topic.</p>
    <a href="#" class="topic-link">Read More</a>
</div>
```

### Changing Club Information
Update the contact information in the contact section:

```html
<div class="contact-item">
    <i class="fas fa-envelope"></i>
    <div>
        <h4>Email</h4>
        <p>your-email@school.edu</p>
    </div>
</div>
```

## 📱 Responsive Design

The website automatically adapts to different screen sizes:
- **Desktop**: Full layout with side-by-side sections
- **Tablet**: Adjusted spacing and layout
- **Mobile**: Single-column layout with hamburger navigation

## 🔧 Technical Features

### Animations
- Floating molecule animation in hero section
- Chemistry lab equipment animations
- Scroll-triggered animations
- Particle effects
- Typing effect on hero title

### Interactive Elements
- Smooth scrolling navigation
- Modal popup for uploads
- Form validation
- Hover effects on cards
- Mobile-friendly navigation

### Performance
- Optimized CSS animations
- Efficient JavaScript
- Fast loading times
- Cross-browser compatibility

## 🎯 Chemistry Topics Included

1. **Chemical Reactions** - Different types and mechanisms
2. **Stoichiometry** - Balancing equations and calculations
3. **Thermochemistry** - Heat energy in reactions
4. **Atomic Structure** - Building blocks of matter
5. **Solutions & Concentration** - Types and calculations
6. **Electrochemistry** - Electricity and chemical reactions

## 🔐 Authentication System

The website includes a comprehensive authentication system with email verification and Google integration.

### User Registration
1. **Sign Up**: Create account with username, email, and password
2. **Email Verification**: Receive OTP via email (real email delivery)
3. **Account Activation**: Enter OTP to verify email address
4. **Profile Setup**: Google profile picture and name displayed

### EmailJS Setup (Required for OTP Emails)

To enable real email OTP delivery:

1. **Sign up for EmailJS**:
   - Go to https://www.emailjs.com/
   - Create a free account
   - Add your email service (Gmail, Outlook, etc.)

2. **Get Your Credentials**:
   - Public Key (found in Account > API Keys)
   - Service ID (found in Email Services)
   - Template ID (create a new email template)

3. **Create Email Template**:
   - Template Name: "OTP Verification"
   - Subject: "Your Chem By Students Verification Code"
   - Content:
   ```
   Hello {{user_name}},
   
   Your verification code is: {{otp_code}}
   
   Enter this code to complete your registration.
   
   Best regards,
   Chem By Students Team
   ```

4. **Update Configuration**:
   - Replace `YOUR_EMAILJS_PUBLIC_KEY` in `script.js`
   - Replace `YOUR_EMAILJS_SERVICE_ID` in `script.js`
   - Replace `YOUR_EMAILJS_TEMPLATE_ID` in `script.js`

### Login Options
- **Email/Password**: Traditional login with registered credentials
- **Google Sign-In**: One-click login with Google account
- **Admin Login**: Special admin accounts for content management

### Admin Credentials
- **Username**: `lohith` | **Password**: `adminclub101`
- **Username**: `admin` | **Password**: `adminclub101`

### Security Features
- Email verification with OTP
- Password validation and confirmation
- Session management with persistent login
- Google OAuth integration
- Secure admin access control
- User profile management

## 📝 Adding Content

### For Students
1. Contact an administrator to submit content
2. Provide your topic title and explanation
3. Admins will review and upload approved content

### For Administrators
1. Login with admin credentials
2. Click "Admin Login" to access upload interface
3. Fill in topic details and content
4. Upload files and submit
5. Edit the HTML file to add new topic categories
6. Update contact information and about section

## 🌐 Deployment

To make this website live on the internet:

1. **GitHub Pages** (Free):
   - Upload files to a GitHub repository
   - Enable GitHub Pages in repository settings
   - Your site will be available at `username.github.io/repository-name`

2. **Netlify** (Free):
   - Drag and drop the folder to Netlify
   - Get a custom URL instantly

3. **School Server**:
   - Upload files to your school's web server
   - Configure domain settings

## 🔮 Future Enhancements

Potential features to add:
- **Database Integration**: Store topics in a real database
- **User Authentication**: Login system for students
- **Search Functionality**: Search through topics
- **Comments System**: Allow students to comment on topics
- **File Upload**: Support for images, videos, and documents
- **Admin Panel**: Easy content management interface

## 🛠️ Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 📞 Support

If you need help customizing or deploying the website:
1. Check this README file
2. Review the code comments
3. Contact your school's IT department
4. Consider hiring a web developer for advanced features

## 📄 License

This project is open source and available for educational use. Feel free to modify and adapt it for your school's needs.

---

**Made with ❤️ for Chemistry Education**

*Empowering students to learn and teach chemistry together!* 