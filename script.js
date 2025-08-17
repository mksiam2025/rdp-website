// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const emailText = document.getElementById('emailText');
const copyBtn = document.getElementById('copyBtn');
const newEmailBtn = document.getElementById('newEmailBtn');
const refreshBtn = document.getElementById('refreshBtn');
const deleteBtn = document.getElementById('deleteBtn');
const autoRefreshBtn = document.getElementById('autoRefreshBtn');
const inboxContainer = document.getElementById('inboxContainer');
const emailCount = document.getElementById('emailCount');
const clearBtn = document.getElementById('clearBtn');
const toast = document.getElementById('toast');
const emailExpiry = document.getElementById('emailExpiry');
const expiryTimer = document.getElementById('expiryTimer');
const extendBtn = document.getElementById('extendBtn');

const emailModal = document.getElementById('emailModal');
const modalClose = document.getElementById('modalClose');
const modalSubject = document.getElementById('modalSubject');
const modalSender = document.getElementById('modalSender');
const modalTime = document.getElementById('modalTime');
const modalBody = document.getElementById('modalBody');
const deleteModal = document.getElementById('deleteModal');
const deleteModalClose = document.getElementById('deleteModalClose');
const deleteEmailText = document.getElementById('deleteEmailText');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');
const loadingOverlay = document.getElementById('loadingOverlay');

// State
let currentEmail = '';
let emails = [];
let autoRefreshInterval = null;
let isAutoRefreshActive = false;
let emailHistory = [];
let expiryCountdown = null;
let expiryTime = 600; // 10 minutes in seconds
let isInitialized = false;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Add page load animation
    document.body.classList.add('page-loaded');
    
    // Initialize with a slight delay for smooth appearance
    setTimeout(() => {
        initializeApp();
        setupEventListeners();
        loadThemePreference();
        startExpiryTimer();
        isInitialized = true;
        
        // Add success animation
        showPageReadyAnimation();
    }, 300);
});

// Initialize app
function initializeApp() {
    generateNewEmail();
    updateEmailCount();
    showEmptyInbox();
    updateAutoRefreshButton();
    updateDeleteButton();
    
    // Add subtle entrance animations
    animateElementsOnLoad();
}

// Animate elements on page load
function animateElementsOnLoad() {
    const elements = [
        '.email-card',
        '.action-buttons',
        '.inbox-section'
    ];
    
    elements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            setTimeout(() => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 50);
            }, index * 200);
        }
    });
}

// Show page ready animation
function showPageReadyAnimation() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.animation = 'logoGlow 1s ease-out';
        setTimeout(() => {
            logo.style.animation = '';
        }, 1000);
    }
}

// Setup event listeners
function setupEventListeners() {
    themeToggle.addEventListener('click', toggleTheme);
    copyBtn.addEventListener('click', copyEmailToClipboard);
    newEmailBtn.addEventListener('click', generateNewEmail);
    refreshBtn.addEventListener('click', refreshInbox);
    deleteBtn.addEventListener('click', showDeleteConfirmation);
    autoRefreshBtn.addEventListener('click', toggleAutoRefresh);
    clearBtn.addEventListener('click', clearInbox);
    extendBtn.addEventListener('click', extendEmailExpiry);

    
    // Modal event listeners
    modalClose.addEventListener('click', closeEmailModal);
    deleteModalClose.addEventListener('click', closeDeleteModal);
    cancelDelete.addEventListener('click', closeDeleteModal);
    confirmDelete.addEventListener('click', deleteCurrentEmail);
    
    // Close modals on overlay click
    emailModal.addEventListener('click', (e) => {
        if (e.target === emailModal) closeEmailModal();
    });
    
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) closeDeleteModal();
    });
    
    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeEmailModal();
            closeDeleteModal();
        }
    });
    
    // Add smooth scroll for better UX
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
}

// Theme management with enhanced transitions
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    // Add transition class for smooth theme change
    body.classList.add('theme-transitioning');
    
    if (isDark) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
    
    // Remove transition class after animation completes
    setTimeout(() => {
        body.classList.remove('theme-transitioning');
    }, 400);
    
    // Add theme change feedback
    showToast(`Switched to ${isDark ? 'light' : 'dark'} theme`);
}

function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.className = `${savedTheme}-theme`;
    }
}

// Email generation with enhanced loading state
async function generateNewEmail() {
    if (newEmailBtn.classList.contains('loading')) return;
    
    showButtonLoading(newEmailBtn);
    
    // Simulate processing time with realistic delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const domains = [
        'tempmail.org',
        'disposable.email',
        'throwaway.com',
        'tempinbox.com',
        'mailinator.com',
        'guerrillamail.com',
        '10minutemail.com',
        'mailnesia.com'
    ];
    
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const randomString = generateRandomString(12);
    const newEmail = `${randomString}@${randomDomain}`;
    
    // Save current email to history if it exists
    if (currentEmail) {
        emailHistory.push(currentEmail);
        if (emailHistory.length > 10) {
            emailHistory.shift(); // Keep only last 10 emails
        }
    }
    
    currentEmail = newEmail;
    
    // Smooth text transition
    emailText.style.opacity = '0';
    emailText.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        emailText.textContent = currentEmail;
        emailText.style.opacity = '1';
        emailText.style.transform = 'translateY(0)';
    }, 200);
    
    // Clear inbox when new email is generated
    clearInbox();
    
    // Update button states
    updateDeleteButton();
    
    // Reset expiry timer
    resetExpiryTimer();
    
    hideButtonLoading(newEmailBtn);
    
    // Enhanced success feedback
    showToast('✨ New email address generated successfully!');
    
    // Add success animation to email card
    const emailCard = document.querySelector('.email-card');
    if (emailCard) {
        emailCard.style.animation = 'emailCardSuccess 0.6s ease-out';
        setTimeout(() => {
            emailCard.style.animation = '';
        }, 600);
    }
}

function generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Enhanced copy functionality with better feedback
async function copyEmailToClipboard() {
    if (!currentEmail) {
        showToast('⚠️ No email address to copy!');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(currentEmail);
        
        // Enhanced visual feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span class="copy-icon">✅</span><span class="copy-text">Copied!</span>';
        copyBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        copyBtn.style.transform = 'scale(1.05)';
        
        showToast('📋 Email address copied to clipboard!');
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = 'linear-gradient(135deg, var(--accent-blue), var(--accent-pink))';
            copyBtn.style.transform = 'scale(1)';
        }, 2000);
        
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = currentEmail;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        showToast('📋 Email address copied to clipboard!');
    }
}



// Enhanced refresh inbox with better feedback
async function refreshInbox() {
    if (refreshBtn.classList.contains('loading')) return;
    
    showButtonLoading(refreshBtn);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (emails.length === 0) {
        simulateIncomingEmails();
        showToast('📬 Inbox refreshed successfully!');
    } else {
        // Add a new email to existing inbox
        simulateIncomingEmails();
        showToast('📧 New emails added to inbox!');
    }
    
    hideButtonLoading(refreshBtn);
}

// Enhanced delete confirmation with better UX
function showDeleteConfirmation() {
    if (!currentEmail) {
        showToast('⚠️ No email address to delete!');
        return;
    }
    
    deleteEmailText.textContent = currentEmail;
    deleteModal.classList.add('show');
    
    // Add entrance animation
    const modal = document.querySelector('.delete-confirmation');
    if (modal) {
        modal.style.animation = 'modalEntrance 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    }
}

function closeDeleteModal() {
    deleteModal.classList.remove('show');
}

// Enhanced delete email with better feedback
async function deleteCurrentEmail() {
    if (deleteBtn.classList.contains('loading')) return;
    
    closeDeleteModal();
    showButtonLoading(deleteBtn);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Generate a new email immediately
    generateNewEmail();
    
    hideButtonLoading(deleteBtn);
    showToast('🗑️ Email deleted and new one generated!');
}

// Enhanced email expiry functionality
function extendEmailExpiry() {
    expiryTime += 300; // Add 5 minutes
    resetExpiryTimer();
    
    // Add visual feedback
            extendBtn.style.animation = 'buttonSuccess 0.6s ease-out';
        setTimeout(() => {
            extendBtn.style.animation = '';
        }, 600);
    
    showToast('⏰ Email expiry extended by 5 minutes!');
}

// Enhanced expiry timer functions
function startExpiryTimer() {
    expiryCountdown = setInterval(() => {
        if (expiryTime > 0) {
            expiryTime--;
            updateExpiryDisplay();
        } else {
            // Email expired, generate new one
            clearInterval(expiryCountdown);
            showToast('⏰ Email expired! Generating new address...');
            generateNewEmail();
        }
    }, 1000);
}

function resetExpiryTimer() {
    expiryTime = 600; // Reset to 10 minutes
    updateExpiryDisplay();
}

function updateExpiryDisplay() {
    const minutes = Math.floor(expiryTime / 60);
    const seconds = expiryTime % 60;
    expiryTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Enhanced color changes with smooth transitions
    if (expiryTime <= 60) {
        expiryTimer.style.color = 'var(--accent-red)';
        expiryTimer.style.animation = 'pulse 1s ease-in-out infinite';
    } else if (expiryTime <= 300) {
        expiryTimer.style.color = 'var(--accent-orange)';
        expiryTimer.style.animation = '';
    } else {
        expiryTimer.style.color = 'var(--accent-orange)';
        expiryTimer.style.animation = '';
    }
}

// Enhanced auto-refresh functionality
function toggleAutoRefresh() {
    if (isAutoRefreshActive) {
        stopAutoRefresh();
    } else {
        startAutoRefresh();
    }
}

function startAutoRefresh() {
    isAutoRefreshActive = true;
    autoRefreshBtn.classList.add('active');
    autoRefreshBtn.innerHTML = '<span class="btn-icon">⏸️</span><span class="btn-text">Stop Auto-refresh</span>';
    
    // Generate new email every 30 seconds
    autoRefreshInterval = setInterval(() => {
        generateNewEmail();
        simulateIncomingEmails();
    }, 30000);
    
    showToast('🔄 Auto-refresh activated! New emails every 30 seconds.');
}

function stopAutoRefresh() {
    isAutoRefreshActive = false;
    autoRefreshBtn.classList.remove('active');
    autoRefreshBtn.innerHTML = '<span class="btn-icon">⏰</span><span class="btn-text">Start Auto-refresh</span>';
    
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
    
    showToast('⏸️ Auto-refresh deactivated.');
}

// Update button states with enhanced feedback
function updateAutoRefreshButton() {
    if (isAutoRefreshActive) {
        autoRefreshBtn.classList.add('active');
        autoRefreshBtn.innerHTML = '<span class="btn-icon">⏸️</span><span class="btn-text">Stop Auto-refresh</span>';
    } else {
        autoRefreshBtn.classList.remove('active');
        autoRefreshBtn.innerHTML = '<span class="btn-icon">⏰</span><span class="btn-text">Start Auto-refresh</span>';
    }
}

function updateDeleteButton() {
    if (currentEmail) {
        deleteBtn.disabled = false;
        deleteBtn.style.opacity = '1';
        deleteBtn.style.cursor = 'pointer';
    } else {
        deleteBtn.disabled = true;
        deleteBtn.style.opacity = '0.5';
        deleteBtn.style.cursor = 'not-allowed';
    }
}

// Enhanced button loading states
function showButtonLoading(button) {
    button.classList.add('loading');
    button.disabled = true;
    button.style.cursor = 'wait';
}

function hideButtonLoading(button) {
    button.classList.remove('loading');
    button.disabled = false;
    button.style.cursor = 'pointer';
}

// Enhanced inbox management
function addEmailToInbox(email) {
    emails.unshift(email);
    updateEmailCount();
    renderInbox();
}

function clearInbox() {
    emails = [];
    updateEmailCount();
    showEmptyInbox();
}

function updateEmailCount() {
    const count = emails.length;
    emailCount.textContent = `${count} email${count !== 1 ? 's' : ''}`;
    
    // Add count change animation
    emailCount.style.animation = 'countChange 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => {
        emailCount.style.animation = '';
    }, 400);
}

function showEmptyInbox() {
    inboxContainer.innerHTML = `
        <div class="empty-inbox">
            <div class="empty-icon">📭</div>
            <p>No emails yet</p>
            <span>Emails will appear here automatically</span>
        </div>
    `;
}

function renderInbox() {
    if (emails.length === 0) {
        showEmptyInbox();
        return;
    }
    
    inboxContainer.innerHTML = emails.map((email, index) => `
        <div class="email-item" data-index="${index}">
            <div class="email-header">
                <div class="email-sender">${email.sender}</div>
                <div class="email-time">${email.time}</div>
            </div>
            <div class="email-subject">${email.subject}</div>
            <div class="email-preview">${email.preview}</div>
        </div>
    `).join('');
    
    // Add click listeners to email items with enhanced feedback
    document.querySelectorAll('.email-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            // Add click feedback
            item.style.animation = 'emailItemClick 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => {
                item.style.animation = '';
                openEmailModal(emails[index]);
            }, 150);
        });
    });
}

// Enhanced email modal functions
function openEmailModal(email) {
    modalSubject.textContent = email.subject;
    modalSender.textContent = email.sender;
    modalTime.textContent = email.time;
    modalBody.textContent = email.preview;
    
    emailModal.classList.add('show');
    
    // Add entrance animation
    const modal = document.querySelector('.modal-content');
    if (modal) {
        modal.style.animation = 'modalEntrance 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    }
}

function closeEmailModal() {
    emailModal.classList.remove('show');
}

// Enhanced email simulation
function simulateIncomingEmails() {
    const senders = [
        'noreply@example.com',
        'support@service.com',
        'newsletter@company.org',
        'alerts@platform.net',
        'info@website.com',
        'system@app.io',
        'notifications@service.co',
        'updates@platform.dev'
    ];
    
    const subjects = [
        'Welcome to our service!',
        'Your account has been created',
        'Important security update',
        'New features available',
        'Password reset request',
        'Account verification needed',
        'Weekly newsletter',
        'System maintenance notice'
    ];
    
    const previews = [
        'Thank you for signing up! We\'re excited to have you on board.',
        'Your account has been successfully created. You can now access all features.',
        'We\'ve implemented new security measures to protect your data.',
        'Check out the latest features we\'ve added to improve your experience.',
        'We received a request to reset your password. Click the link below.',
        'Please verify your email address to complete your registration.',
        'Here\'s what\'s new this week in our platform.',
        'We\'ll be performing maintenance on our servers this weekend.'
    ];
    
    const randomSender = senders[Math.floor(Math.random() * senders.length)];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const randomPreview = previews[Math.floor(Math.random() * previews.length)];
    
    const newEmail = {
        sender: randomSender,
        subject: randomSubject,
        preview: randomPreview,
        time: formatTime(new Date())
    };
    
    addEmailToInbox(newEmail);
}

function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
}

// Enhanced toast notifications
function showToast(message) {
    const toastMessage = toast.querySelector('.toast-message');
    toastMessage.textContent = message;
    
    toast.classList.add('show');
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Simulate some initial emails after a delay
setTimeout(() => {
    if (isInitialized) {
        simulateIncomingEmails();
    }
}, 2000);

// Simulate emails periodically (every 2-5 minutes)
setInterval(() => {
    if (Math.random() < 0.3 && !isAutoRefreshActive && isInitialized) {
        simulateIncomingEmails();
    }
}, 120000 + Math.random() * 180000);

// Enhanced keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'c':
                e.preventDefault();
                copyEmailToClipboard();
                break;
            case 'r':
                e.preventDefault();
                generateNewEmail();
                break;
            case 't':
                e.preventDefault();
                toggleTheme();
                break;
            case 'd':
                e.preventDefault();
                showDeleteConfirmation();
                break;
        }
    }
});

// Enhanced Easter egg with better feedback
let clickCount = 0;
const logo = document.querySelector('.logo');

logo.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
        showToast('🎉 You found the secret! 🎉');
        
        // Enhanced fun effects
        document.body.style.animation = 'gradient-shift 0.5s ease-in-out 10';
        
        // Add confetti effect
        createConfetti();
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
        clickCount = 0;
    }
});

// Create confetti effect
function createConfetti() {
    const colors = ['#3b82f6', '#ec4899', '#f97316', '#10b981', '#8b5cf6'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.borderRadius = '50%';
        
        document.body.appendChild(confetti);
        
        const animation = confetti.animate([
            { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Performance optimization with enhanced debouncing
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
        // Handle scroll-based animations or effects here
    }, 16);
});

// Enhanced error handling
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
    showToast('⚠️ Something went wrong. Please refresh the page.');
});

// Add service worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Add CSS animations for enhanced UX
const style = document.createElement('style');
style.textContent = `
    @keyframes logoGlow {
        0% { filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0)); }
        50% { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.6)); }
        100% { filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0)); }
    }
    
    @keyframes emailCardSuccess {
        0% { box-shadow: var(--card-shadow); }
        50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.3); }
        100% { box-shadow: var(--card-shadow); }
    }
    
    @keyframes buttonSuccess {
        0% { box-shadow: var(--button-shadow); }
        50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
        100% { box-shadow: var(--button-shadow); }
    }
    
    @keyframes modalEntrance {
        0% { transform: scale(0.9) translateY(-20px); opacity: 0; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
    }
    
    @keyframes countChange {
        0% { opacity: 1; }
        50% { opacity: 0.8; }
        100% { opacity: 1; }
    }
    
    @keyframes emailItemClick {
        0% { opacity: 1; }
        50% { opacity: 0.9; }
        100% { opacity: 1; }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    .page-loaded {
        animation: pageLoad 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @keyframes pageLoad {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    
    .theme-transitioning * {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
`;
document.head.appendChild(style);
