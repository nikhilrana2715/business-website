/**
 * Mobile Menu Toggle Functionality
 
 */

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = initMobileMenu();
    
    if (mobileMenu) {
        console.log('Mobile menu initialized successfully');
    }
});

// Add this to your JavaScript file
const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-list');

menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navList.classList.toggle('active');
});
 
function initMobileMenu() {
    // मोबाइल मेनू बटन और मेनू ढूँढें
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // अगर मोबाइल मेनू एलिमेंट नहीं हैं तो रिटर्न
    if (!menuToggle || !navMenu) return null;
    
    // टॉगल फंक्शन
    function toggleMenu() {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // ARIA एट्रिब्यूट अपडेट करें
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
    }
    
    // मेनू बटन पर क्लिक इवेंट
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    // मेनू लिंक्स पर क्लिक करने पर मेनू बंद करें
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // बॉडी पर क्लिक करने पर मेनू बंद करें
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // कीबोर्ड नेविगेशन (Escape key)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // विंडो रीसाइज़ पर मेनू रीसेट करें
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // ARIA एट्रिब्यूट सेट करें
    menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', 'nav-menu');
    
    return {
        toggle: toggleMenu,
        close: function() {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    };
}

/**
 * स्टिकी नेविगेशन
 */
document.addEventListener('DOMContentLoaded', function() {
    initStickyNavigation();
});

function initStickyNavigation() {
    const header = document.querySelector('.main-header');
    const nav = document.querySelector('.main-nav');
    
    if (!header || !nav) return;
    
    const stickyClass = 'sticky';
    const headerHeight = header.offsetHeight;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > headerHeight) {
            header.classList.add(stickyClass);
            document.body.style.paddingTop = nav.offsetHeight + 'px';
        } else {
            header.classList.remove(stickyClass);
            document.body.style.paddingTop = '0';
        }
    });
}