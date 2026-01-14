// Register Form Validation & Storage
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const firstName = document.getElementById("first-name").value.trim();
      const lastName = document.getElementById("last-name").value.trim();
      const username = document.getElementById("reg-username").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const password = document.getElementById("reg-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      const errorMsg = document.getElementById("reg-error-msg");

      // Clear previous message
      errorMsg.textContent = "";

      // Validation regex
      const nameRegex = /^[A-Za-z]+$/;
      const usernameRegex = /^[A-Za-z0-9]+$/;
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

      // Check empty fields
      if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
        errorMsg.textContent = "Please fill out all fields.";
        return;
      }

      // First and last name alphabetic
      if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        errorMsg.textContent = "First and Last Name should contain only letters.";
        return;
      }

      // Username alphanumeric
      if (!usernameRegex.test(username)) {
        errorMsg.textContent = "Username should be alphanumeric.";
        return;
      }

      // Password strength
      if (!passwordRegex.test(password)) {
        errorMsg.textContent =
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
        return;
      }

      // Password match
      if (password !== confirmPassword) {
        errorMsg.textContent = "Passwords do not match.";
        return;
      }

      // Duplicate user check
      if (localStorage.getItem("user_" + username)) {
        errorMsg.textContent = "Username already exists.";
        return;
      }

      // Show loading state
      const submitBtn = document.querySelector('.btn-primary');
      const originalBtnContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
      
      // Send registration data to backend
      fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      })
        .then((response) => {
          if (response.redirected) {
            window.location.href = response.url;
          } else if (response.ok) {
            // Show success message
            errorMsg.textContent = "";
            const successMsg = document.getElementById("reg-success-msg");
            if (successMsg) {
              successMsg.style.display = "flex";
              successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Account created successfully! Redirecting to login...';
            }
            
            // Update button to show success
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Account Created!';
            submitBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
              window.location.href = "/login";
            }, 2000);
          } else {
            errorMsg.textContent = "Registration failed. Try a different username.";
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
          }
        })
        .catch(() => {
          errorMsg.textContent = "Server error. Please try again later.";
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnContent;
        });
    });
  }

  // Login Form Logic (preserved)
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;
      const errorMsg = document.getElementById("error-msg");
      if (errorMsg) errorMsg.textContent = "";

      fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.text())
        .then((text) => {
          if (text.includes("Invalid credentials")) {
            if (errorMsg) errorMsg.textContent = "User not found or password incorrect. Please try again or register.";
            else alert("User not found or password incorrect. Please try again or register.");
          } else {
            window.location.href = "/index";
          }
        })
        .catch(() => {
          if (errorMsg) errorMsg.textContent = "Server error. Please try again later.";
          else alert("Server error. Please try again later.");
        });
    });
  }
});
