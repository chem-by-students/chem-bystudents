// Global variables
let currentUser = null;
let isAuthenticated = false;
let pendingUser = null;
let adminVerified = false;

// Admin credentials (in a real app, this would be on a server)
const adminCredentials = {
    'Lohith': 'adminclub101',
    'Nitin': 'adminclub101',
    'Dhanunjay': 'adminclub101',
    'Praveen': 'adminclub101',
    'admin': 'adminclub101',
    'club': 'adminclub101'
};

// Content storage
let uploadedTopics = JSON.parse(localStorage.getItem('uploadedTopics')) || [];

// User storage
let users = JSON.parse(localStorage.getItem('users')) || [];

// Doubts & Answers Logic
let doubts = JSON.parse(localStorage.getItem('doubts')) || [];

function saveDoubts() {
    localStorage.setItem('doubts', JSON.stringify(doubts));
}

function renderDoubts() {
    const doubtsList = document.getElementById('doubtsList');
    if (!doubtsList) return;
    doubtsList.innerHTML = '';
    if (doubts.length === 0) {
        doubtsList.innerHTML = '<p style="color:#888;text-align:center;">No doubts have been posted yet. Be the first to ask a question!</p>';
        return;
    }
    doubts.slice().reverse().forEach(doubt => {
        const doubtCard = document.createElement('div');
        doubtCard.className = 'doubt-card';
        doubtCard.innerHTML = `
            <div class="doubt-meta">Asked by <strong>${doubt.author}</strong> on ${doubt.date}</div>
            <div class="doubt-question">${escapeHTML(doubt.text)}</div>
            <div class="answers-list" id="answers-${doubt.id}">
                ${doubt.answers && doubt.answers.length > 0 ? doubt.answers.map(a => `
                    <div class="answer-card">
                        <div class="answer-meta">Answered by <strong>${a.author}</strong> on ${a.date}</div>
                        <div class="answer-text">${escapeHTML(a.text)}</div>
                    </div>
                `).join('') : '<div style="color:#aaa;">No answers yet.</div>'}
            </div>
            <form class="answer-form" data-doubt-id="${doubt.id}">
                <textarea placeholder="Write your answer..." rows="2" required></textarea>
                <button type="submit" class="btn btn-primary">Reply</button>
            </form>
        `;
        doubtsList.appendChild(doubtCard);
    });
    // Attach answer form handlers
    document.querySelectorAll('.answer-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!currentUser) {
                alert('You must be logged in to reply.');
                return;
            }
            const doubtId = this.getAttribute('data-doubt-id');
            const answerText = this.querySelector('textarea').value.trim();
            if (!answerText) return;
            const doubt = doubts.find(d => d.id == doubtId);
            if (!doubt) return;
            if (!doubt.answers) doubt.answers = [];
            doubt.answers.push({
                author: currentUser.name || currentUser.username,
                text: answerText,
                date: new Date().toLocaleString()
            });
            saveDoubts();
            renderDoubts();
        });
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, function(tag) {
        const charsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        };
        return charsToReplace[tag] || tag;
    });
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    loadUploadedTopics();
    window.openAdminVerifyModal = openAdminVerifyModal;
    window.closeAdminVerifyModal = closeAdminVerifyModal;
    renderDoubts();
    const doubtForm = document.getElementById('doubtForm');
    if (doubtForm) {
        doubtForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!currentUser) {
                alert('You must be logged in to post a doubt.');
                return;
            }
            const doubtText = document.getElementById('doubtText').value.trim();
            if (!doubtText) return;
            const newDoubt = {
                id: Date.now(),
                text: doubtText,
                author: currentUser.name || currentUser.username,
                date: new Date().toLocaleString(),
                answers: []
            };
            doubts.push(newDoubt);
            saveDoubts();
            renderDoubts();
            doubtForm.reset();
        });
    }

    // If adminVerified flag is set, show the message and allow admin signup
    if (localStorage.getItem('adminVerified') === 'true') {
        const adminMsg = document.getElementById('adminVerifiedMsg');
        if (adminMsg) adminMsg.style.display = 'inline';
        adminVerified = true;
        // Optionally, scroll to signup form
        if (window.location.hash === '#signup') {
            const signupForm = document.getElementById('signupForm');
            if (signupForm) signupForm.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Authentication functions
function checkAuthentication() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isAuthenticated = true;
        showMainContent();
        updateUserProfile();
    } else {
        showAuthOverlay();
    }
}

function showAuthOverlay() {
    document.getElementById('authOverlay').style.display = 'flex';
    document.body.classList.remove('authenticated');
}

function hideAuthOverlay() {
    document.getElementById('authOverlay').style.display = 'none';
    document.body.classList.add('authenticated');
}

function showMainContent() {
    hideAuthOverlay();
    updateUserProfile();
}

function updateUserProfile() {
    if (currentUser) {
        const userProfile = document.getElementById('userProfile');
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        
        userProfile.style.display = 'flex';
        userAvatar.src = currentUser.avatar || 'https://via.placeholder.com/40';
        userName.textContent = currentUser.name || currentUser.username;
        
        // Display user role
        if (currentUser.isAdmin) {
            userRole.textContent = 'Admin';
            userRole.style.color = '#000000';
            userRole.style.fontWeight = '600';
        } else {
            userRole.textContent = 'Student';
            userRole.style.color = '#666666';
            userRole.style.fontWeight = '400';
        }
    }
}

// Form switching functions
function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const loginAsAdmin = document.getElementById('loginIsAdmin').checked;
    
    // Check if it's an admin login (case-insensitive)
    const adminKey = Object.keys(adminCredentials).find(key => key.toLowerCase() === username.toLowerCase());
    if (adminKey && adminCredentials[adminKey] === password) {
        currentUser = {
            username: adminKey,
            name: adminKey,
            email: '',
            isAdmin: true,
            avatar: 'https://via.placeholder.com/40'
        };
        authenticateUser(currentUser);
        return;
    }
    
    // Check regular user login (case-insensitive username)
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (user) {
        // If user checked "Login as admin" but is not an admin
        if (loginAsAdmin && !user.isAdmin) {
            alert('You do not have admin privileges. Please contact an administrator.');
            return;
        }
        
        currentUser = user;
        authenticateUser(currentUser);
    } else {
        alert('Invalid username or password. Please try again.');
    }
});

function openAdminVerifyModal() {
    document.getElementById('adminVerifyModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    document.getElementById('adminVerifyError').style.display = 'none';
    document.getElementById('adminVerifyForm').reset();
}

function closeAdminVerifyModal() {
    document.getElementById('adminVerifyModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.getElementById('adminVerifyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('verifyAdminUsername').value.trim();
    const password = document.getElementById('verifyAdminPassword').value;
    // Case-insensitive username check
    const adminKey = Object.keys(adminCredentials).find(key => key.toLowerCase() === username.toLowerCase());
    if (adminKey && adminCredentials[adminKey] === password) {
        adminVerified = true;
        closeAdminVerifyModal();
        document.getElementById('adminVerifiedMsg').style.display = 'inline';
        document.getElementById('adminVerifyError').style.display = 'none';
        alert('Admin verified! You can now sign up as an admin.');
    } else {
        adminVerified = false;
        document.getElementById('adminVerifyError').textContent = 'Invalid admin username or password.';
        document.getElementById('adminVerifyError').style.display = 'block';
    }
});

// Signup form handler
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    // Admin signup is only allowed if adminVerified is true
    const isAdmin = adminVerified;
    
    // Validation
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        alert('User with this email already exists!');
        return;
    }
    
    // If user wants to sign up as admin but hasn't verified, block
    if (document.getElementById('adminVerifiedMsg').style.display !== 'inline' && adminVerified) {
        alert('Please verify your admin credentials first.');
        return;
    }
    
    // Create and authenticate user immediately
    const newUser = {
        username: username,
        email: email,
        password: password,
        isAdmin: isAdmin
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    authenticateUser(newUser);
    adminVerified = false;
    document.getElementById('adminVerifiedMsg').style.display = 'none';
    localStorage.removeItem('adminVerified');
});

// Authentication helper
function authenticateUser(user) {
    currentUser = user;
    isAuthenticated = true;
    localStorage.setItem('currentUser', JSON.stringify(user));
    showMainContent();
}

// Logout function
function logout() {
    currentUser = null;
    isAuthenticated = false;
    localStorage.removeItem('currentUser');
    showAuthOverlay();
    
    // Reset forms
    document.getElementById('loginForm').reset();
    document.getElementById('signupForm').reset();
    document.getElementById('otpForm').reset();
    showLogin();
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only scroll if href is not just "#" and is a valid selector
        if (href && href.length > 1 && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Admin authentication state
let isAdminLoggedIn = false;

// Modal functionality
function openLoginModal() {
    if (!isAuthenticated) {
        alert('Please login to your account first.');
        return;
    }
    
    if (!currentUser.isAdmin) {
        alert('Only administrators can upload content.');
        return;
    }
    
    isAdminLoggedIn = true;
    const modal = document.getElementById('uploadModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openUploadModal() {
    if (!isAuthenticated) {
        alert('Please login to your account first.');
        return;
    }
    
    if (!currentUser.isAdmin) {
        alert('Only administrators can upload content.');
        return;
    }
    
    isAdminLoggedIn = true;
    const modal = document.getElementById('uploadModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const uploadModal = document.getElementById('uploadModal');
    const loginModal = document.getElementById('loginModal');
    const topicDetailsModal = document.getElementById('topicDetailsModal');
    if (e.target === uploadModal) {
        closeUploadModal();
    }
    if (e.target === loginModal) {
        closeLoginModal();
    }
    if (e.target === topicDetailsModal) {
        closeTopicDetailsModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeUploadModal();
        closeLoginModal();
        closeTopicDetailsModal();
    }
});

// Handle upload form submission
document.querySelector('.upload-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!isAuthenticated || !currentUser.isAdmin) {
        alert('You must be logged in as an administrator to upload content.');
        return;
    }
    
    const title = document.getElementById('topicTitle').value;
    const category = document.getElementById('topicCategory').value;
    const content = document.getElementById('topicContent').value;
    const files = document.getElementById('topicFile').files;
    
    // Create new topic object
    const newTopic = {
        id: Date.now(),
        title: title,
        category: category,
        content: content,
        author: currentUser.name || currentUser.username,
        date: new Date().toLocaleDateString(),
        files: []
    };
    
    // Handle file uploads
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                newTopic.files.push({
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: e.target.result
                });
            };
            
            if (file.type.startsWith('video/')) {
                reader.readAsDataURL(file);
            } else {
                reader.readAsText(file);
            }
        }
    }
    
    // Add to storage
    uploadedTopics.push(newTopic);
    localStorage.setItem('uploadedTopics', JSON.stringify(uploadedTopics));
    
    // Add to website
    addTopicToWebsite(newTopic);
    
    alert(`Topic "${title}" uploaded successfully by ${currentUser.name}! It's now visible to all students.`);
    
    // Reset form and close modal
    this.reset();
    closeUploadModal();
});

// Handle contact form submission
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const subject = this.querySelectorAll('input[type="text"]')[1].value;
    const message = this.querySelector('textarea').value;
    
    alert(`Thank you for your message, ${name}! We'll get back to you soon.`);
    
    // Reset form
    this.reset();
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.topic-card, .feature, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add topic to website
function addTopicToWebsite(topic) {
    const topicsGrid = document.getElementById('topicsGrid');
    
    // Create topic card
    const topicCard = document.createElement('div');
    topicCard.className = 'topic-card';
    topicCard.innerHTML = `
        <div class="topic-icon">
            <i class="fas fa-${getCategoryIcon(topic.category)}"></i>
        </div>
        <h3>${topic.title}</h3>
        <p>${topic.content.substring(0, 100)}${topic.content.length > 100 ? '...' : ''}</p>
        <a href="#" class="topic-link" onclick="showTopicDetails('${topic.title}', '${topic.content.replace(/'/g, "\\'")}', '${topic.category}', ${topic.id})">Read More</a>
    `;
    
    // Add to the beginning of the grid
    topicsGrid.insertBefore(topicCard, topicsGrid.firstChild);
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'reactions': 'flask',
        'stoichiometry': 'percentage',
        'thermochemistry': 'temperature-high',
        'atomic': 'atom',
        'solutions': 'tint',
        'electrochemistry': 'bolt',
        'other': 'book'
    };
    return icons[category] || 'book';
}

// Show topic details modal
function showTopicDetails(title, content, category, topicId = null) {
    const modal = document.getElementById('topicDetailsModal');
    const titleElement = document.getElementById('topicDetailsTitle');
    const categoryElement = document.getElementById('topicDetailsCategory');
    const authorElement = document.getElementById('topicDetailsAuthor');
    const contentElement = document.getElementById('topicDetailsContent');
    const filesElement = document.getElementById('topicDetailsFiles');
    
    titleElement.textContent = title;
    categoryElement.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    
    // Find topic details if it's an uploaded topic
    if (topicId) {
        const topic = uploadedTopics.find(t => t.id === topicId);
        if (topic) {
            authorElement.textContent = topic.author;
            contentElement.innerHTML = formatContent(topic.content);
            
            // Display files
            if (topic.files && topic.files.length > 0) {
                filesElement.innerHTML = '<h4>Attached Files:</h4>';
                topic.files.forEach(file => {
                    if (file.type.startsWith('video/')) {
                        filesElement.innerHTML += `
                            <div class="video-container">
                                <video controls>
                                    <source src="${file.data}" type="${file.type}">
                                    Your browser does not support the video tag.
                                </video>
                                <p><strong>${file.name}</strong> (${formatFileSize(file.size)})</p>
                            </div>
                        `;
                    } else {
                        filesElement.innerHTML += `
                            <div class="file-item">
                                <i class="fas fa-file"></i>
                                <a href="${file.data}" download="${file.name}">${file.name}</a>
                                <span>(${formatFileSize(file.size)})</span>
                            </div>
                        `;
                    }
                });
            } else {
                filesElement.innerHTML = '';
            }
        }
    } else {
        // Default topic
        authorElement.textContent = 'Chemistry Club';
        contentElement.innerHTML = formatContent(content);
        filesElement.innerHTML = '';
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close topic details modal
function closeTopicDetailsModal() {
    const modal = document.getElementById('topicDetailsModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Format content with line breaks
function formatContent(content) {
    return content.replace(/\n/g, '<br>');
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Load uploaded topics
function loadUploadedTopics() {
    uploadedTopics.forEach(topic => {
        addTopicToWebsite(topic);
    });
}

// Add particle effect to hero section
function createParticle() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particle = document.createElement('div');
    
    particle.style.position = 'absolute';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = 'rgba(255, 255, 255, 0.6)';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight + 10;
    const endX = startX + (Math.random() - 0.5) * 200;
    const endY = -10;
    const duration = Math.random() * 3000 + 2000;
    
    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    
    hero.appendChild(particle);
    
    const animation = particle.animate([
        { transform: 'translate(0, 0)', opacity: 1 },
        { transform: `translate(${endX - startX}px, ${endY - startY}px)`, opacity: 0 }
    ], {
        duration: duration,
        easing: 'linear'
    });
    
    animation.onfinish = () => {
        particle.remove();
    };
}

// Create particles periodically
setInterval(createParticle, 500);

// Add typing effect to hero title
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
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 500);
    }
});

// Add hover effects to topic cards
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.topic-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '0%';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(90deg, #000000, #333333)';
    progressBar.style.zIndex = '9999';
    progressBar.style.transition = 'width 0.1s ease';
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress
createScrollProgress();

// Add tooltip functionality
function addTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.position = 'absolute';
            tooltip.style.background = '#000000';
            tooltip.style.color = 'white';
            tooltip.style.padding = '8px 12px';
            tooltip.style.borderRadius = '6px';
            tooltip.style.fontSize = '14px';
            tooltip.style.zIndex = '10000';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.3s ease';
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 10);
            
            this.tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                this.tooltip.remove();
                this.tooltip = null;
            }
        });
    });
}

// Initialize tooltips
addTooltips(); 