document.getElementById("create-account-btn").addEventListener("click", function () {
  window.location.href = "/register";
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");
  const submitBtn = document.querySelector('button[type="submit"]');
  
  if (errorMsg) errorMsg.textContent = "";
  
  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Show success message briefly
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Welcome!';
        submitBtn.style.backgroundColor = '#28a745';
        
        // Redirect based on role after brief delay
        setTimeout(() => {
          window.location.href = data.redirect;
        }, 1000);
      } else {
        // Show error
        if (errorMsg) {
          errorMsg.textContent = data.message || "Invalid credentials. Please try again.";
          errorMsg.style.animation = 'shake 0.5s ease-in-out';
        }
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Login';
      }
    })
    .catch(error => {
      console.error('Login error:', error);
      if (errorMsg) {
        errorMsg.textContent = "Server error. Please try again later.";
        errorMsg.style.animation = 'shake 0.5s ease-in-out';
      }
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Login';
    });
});
