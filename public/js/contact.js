document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  const submitBtn = form.querySelector('.submit-btn');
  
  // Form submission handler
  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<div class="spinner"></div> Sending...';
    
    // Hide previous status
    status.classList.remove('show', 'success', 'error');
    
    try {
      const formData = new FormData(form);
      const priority = formData.get('priority');
      
      const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        issue: formData.get('issue'),
        message: formData.get('message'),
        priority: priority,
        timestamp: new Date().toISOString()
      };
      
      const response = await fetch("/contact-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        showStatus('success', '✅ Message sent successfully! We\'ll get back to you within 24 hours.');
        form.reset();
        
        // Reset character counter
        const charCounter = document.querySelector('.char-counter');
        if (charCounter) {
          charCounter.textContent = '0 / 1000 characters';
          charCounter.style.color = '#666';
        }
        
        // Reset priority selector
        document.getElementById('priority-low').checked = true;
        
        // Remove validation classes
        form.querySelectorAll('.valid, .invalid').forEach(input => {
          input.classList.remove('valid', 'invalid');
        });
        
      } else {
        const errorText = await response.text();
        showStatus('error', '❌ Failed to send message. Please try again or contact us directly.');
        console.error('Contact form error:', errorText);
      }
      
    } catch (error) {
      console.error('Network error:', error);
      showStatus('error', '❌ Network error. Please check your connection and try again.');
    }
    
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
  });
  
  // Show status message with animation
  function showStatus(type, message) {
    status.className = `form-status ${type}`;
    status.textContent = message;
    
    setTimeout(() => {
      status.classList.add('show');
    }, 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      status.classList.remove('show');
    }, 5000);
  }
  
  // Enhanced form validation
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    // Real-time validation feedback
    input.addEventListener('blur', function() {
      validateField(this);
    });
    
    input.addEventListener('input', function() {
      // Remove validation classes while typing
      this.classList.remove('valid', 'invalid');
    });
  });
  
  function validateField(field) {
    let isValid = field.checkValidity();
    
    // Additional custom validation
    if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(field.value);
    }
    
    if (field.name === 'username' && field.value) {
      isValid = field.value.length >= 3;
    }
    
    if (field.name === 'message' && field.value) {
      isValid = field.value.length >= 10;
    }
    
    // Apply validation styles
    if (field.value.length > 0) {
      if (isValid) {
        field.classList.add('valid');
        field.classList.remove('invalid');
      } else {
        field.classList.add('invalid');
        field.classList.remove('valid');
      }
    }
    
    return isValid;
  }
  
  // Prevent form submission if validation fails
  form.addEventListener('submit', function(e) {
    let formValid = true;
    
    inputs.forEach(input => {
      if (!validateField(input)) {
        formValid = false;
      }
    });
    
    if (!formValid) {
      e.preventDefault();
      showStatus('error', '❌ Please fill in all required fields correctly.');
      return false;
    }
  }, true); // Use capture to run before the main submit handler
});

// Add some interactive enhancements
window.addEventListener('load', function() {
  // Add smooth scroll behavior for any anchor links
  document.documentElement.style.scrollBehavior = 'smooth';
  
  // Add subtle animations to contact methods on hover
  const contactMethods = document.querySelectorAll('.contact-method');
  contactMethods.forEach(method => {
    method.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    method.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
  
  // Add typing effect to header
  const headerText = document.querySelector('.contact-header p');
  if (headerText) {
    const text = headerText.textContent;
    headerText.textContent = '';
    let i = 0;
    
    function typeWriter() {
      if (i < text.length) {
        headerText.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    }
    
    setTimeout(typeWriter, 1000);
  }
});
