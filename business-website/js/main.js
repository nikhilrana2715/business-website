/**
 * Business Website - Main JavaScript File
 * यह फाइल सभी पेजों के लिए सामान्य फंक्शनलिटी हैंडल करती है
 */

// DOM लोड होने का इंतज़ार करें
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully!');
    
    // स्मूथ स्क्रॉलिंग फंक्शन
    initSmoothScroll(); 
    
    // लेज़ी लोडिंग इमेज
    initLazyLoading();
    
    // कॉपीराइट वर्ष अपडेट करें
    updateCopyrightYear();
    
    // बैक-टू-टॉप बटन
    initBackToTop();
    
    // फॉर्म सबमिशन हैंडलिंग
    initFormHandling();
});

/**
 * स्मूथ स्क्रॉलिंग इनिशियलाइज़ करें
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * लेज़ी लोडिंग इनिशियलाइज़ करें
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

/**
 * कॉपीराइट वर्ष अपडेट करें
 */
function updateCopyrightYear() {
    const copyrightElements = document.querySelectorAll('.copyright-year');
    const currentYear = new Date().getFullYear();
    
    copyrightElements.forEach(element => {
        element.textContent = currentYear;
    });
}

/**
 * बैक-टू-टॉप बटन
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * फॉर्म हैंडलिंग
 */
function initFormHandling() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // यहाँ आप AJAX रिक्वेस्ट भेज सकते हैं
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData);
            
            console.log('Form submitted with values:', formValues);
            
            // सबमिशन मैसेज दिखाएँ
            showNotification('Thank you for your message! We will contact you soon.', 'success');
            
            // फॉर्म रीसेट करें
            this.reset();
        });
    }
}

/**
 * नोटिफिकेशन दिखाएँ
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <p>${message}</p>
        <button class="close-notification">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // एनीमेशन के लिए थोड़ी देर रुकें
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // क्लोज बटन पर क्लिक करने पर
    notification.querySelector('.close-notification').addEventListener('click', function() {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // ऑटो-क्लोज (5 सेकंड बाद)
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}