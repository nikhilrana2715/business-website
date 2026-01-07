/**
 * Form Validation Script
 * यह फाइल कॉन्टैक्ट फॉर्म और अन्य फॉर्म्स के वैलिडेशन के लिए है
 */

document.addEventListener('DOMContentLoaded', function() {
    initFormValidation();
});

function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
     
    forms.forEach(form => {
        setupFormValidation(form);
    });
}

function setupFormValidation(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // इनपुट्स पर ब्लर इवेंट
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });
    
    // फॉर्म सबमिशन
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const firstInvalidField = [];
        
        // सभी फील्ड्स वैलिडेट करें
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
                if (firstInvalidField.length === 0) {
                    firstInvalidField.push(input);
                }
            }
        });
        
        if (isValid) {
            // फॉर्म वैलिड है, सबमिट करें
            handleFormSubmission(form);
        } else {
            // पहले इनवैलिड फील्ड पर फोकस करें
            if (firstInvalidField.length > 0) {
                firstInvalidField[0].focus();
                showNotification('Please correct the errors in the form.', 'error');
            }
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.getAttribute('id');
    let isValid = true;
    let errorMessage = '';
    
    // रिक्वायर्ड फील्ड चेक
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = field.getAttribute('data-required-message') || 
                      'This field is required';
    }
    
    // ईमेल वैलिडेशन
    if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = field.getAttribute('data-email-message') || 
                      'Please enter a valid email address';
    }
    
    // टेलीफोन वैलिडेशन
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = field.getAttribute('data-phone-message') || 
                      'Please enter a valid phone number';
    }
    
    // मिनिमम लेंथ चेक
    const minLength = field.getAttribute('minlength');
    if (minLength && value.length < parseInt(minLength)) {
        isValid = false;
        errorMessage = field.getAttribute('data-minlength-message') || 
                      `Minimum ${minLength} characters required`;
    }
    
    // मैक्सिमम लेंथ चेक
    const maxLength = field.getAttribute('maxlength');
    if (maxLength && value.length > parseInt(maxLength)) {
        isValid = false;
        errorMessage = field.getAttribute('data-maxlength-message') || 
                      `Maximum ${maxLength} characters allowed`;
    }
    
    // कस्टम वैलिडेशन (data-validate पैटर्न)
    const validatePattern = field.getAttribute('data-validate');
    if (validatePattern && value) {
        const pattern = new RegExp(validatePattern);
        if (!pattern.test(value)) {
            isValid = false;
            errorMessage = field.getAttribute('data-pattern-message') || 
                          'Please enter a valid value';
        }
    }
    
    // एरर या सक्सेस स्टेट सेट करें
    if (!isValid) {
        showError(field, errorMessage);
    } else {
        showSuccess(field);
    }
    
    return isValid;
}

function showError(field, message) {
    const fieldWrapper = field.closest('.form-group') || field.parentElement;
    
    // पुरानी एरर रिमूव करें
    clearError(field);
    
    // एरर क्लास एड करें
    field.classList.add('error');
    fieldWrapper.classList.add('has-error');
    
    // एरर मैसेज क्रिएट करें
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.setAttribute('aria-live', 'polite');
    
    // एरर मैसेज इंसर्ट करें
    fieldWrapper.appendChild(errorElement);
    
    // ARIA एट्रिब्यूट सेट करें
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', `error-${field.id}`);
    errorElement.id = `error-${field.id}`;
}

function showSuccess(field) {
    const fieldWrapper = field.closest('.form-group') || field.parentElement;
    
    // सक्सेस क्लास एड करें
    field.classList.remove('error');
    field.classList.add('success');
    fieldWrapper.classList.remove('has-error');
    fieldWrapper.classList.add('has-success');
    
    // ARIA एट्रिब्यूट सेट करें
    field.setAttribute('aria-invalid', 'false');
}

function clearError(field) {
    const fieldWrapper = field.closest('.form-group') || field.parentElement;
    
    // एरर क्लासेज रिमूव करें
    field.classList.remove('error');
    fieldWrapper.classList.remove('has-error');
    
    // एरर मैसेज रिमूव करें
    const existingError = fieldWrapper.querySelector('.error-message');
    if (existingError) {
        fieldWrapper.removeChild(existingError);
    }
    
    // ARIA एट्रिब्यूट रिमूव करें
    field.removeAttribute('aria-describedby');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function handleFormSubmission(form) {
    const formData = new FormData(form);
    const formValues = {};
    
    // फॉर्म डेटा को ऑब्जेक्ट में कन्वर्ट करें
    for (let [key, value] of formData.entries()) {
        formValues[key] = value;
    }
    
    console.log('Form submission data:', formValues);
    
    // यहाँ आप AJAX रिक्वेस्ट भेज सकते हैं
    // उदाहरण: fetch API का उपयोग करके
    /*
    fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showNotification('Message sent successfully!', 'success');
            form.reset();
        } else {
            showNotification('Something went wrong. Please try again.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Network error. Please try again.', 'error');
    });
    */
    
    // डेमो के लिए, सिर्फ नोटिफिकेशन दिखाएँ
    showNotification('Form submitted successfully! We will contact you soon.', 'success');
    form.reset();
    
    // सभी फील्ड्स से सक्सेस क्लास हटाएँ
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.classList.remove('success');
        const fieldWrapper = input.closest('.form-group') || input.parentElement;
        fieldWrapper.classList.remove('has-success');
    });
}