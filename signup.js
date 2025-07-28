document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Client-side validation
    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value;
    
    const msg = document.getElementById('signupMessage');
    
    // Validate name
    if (name.length < 2 || name.length > 50) {
        msg.style.color = '#e53935';
        msg.textContent = 'Name must be between 2 and 50 characters.';
        return;
    }
    
    // Validate name format (letters and spaces only)
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        msg.style.color = '#e53935';
        msg.textContent = 'Name can only contain letters and spaces.';
        return;
    }
    
    // Validate email
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        msg.style.color = '#e53935';
        msg.textContent = 'Please enter a valid email address.';
        return;
    }
    
    // Validate password
    const passwordRequirements = validatePassword(password);
    const allRequirementsMet = Object.values(passwordRequirements).every(req => req);
    
    if (!allRequirementsMet) {
        msg.style.color = '#e53935';
        msg.textContent = 'Please ensure your password meets all requirements.';
        return;
    }
    
    // If validation passes, submit to server
    const btn = signupForm.querySelector('button');
    btn.classList.add('loading');
    const data = { name, email, password };
    
    try {
        console.log('Submitting signup data:', { name, email, password: '***' });
        
        const res = await fetch(window.API_BASE_URL + '/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        console.log('Signup response status:', res.status);
        
        btn.classList.remove('loading');
        msg.classList.remove('hide');
        
        if (res.ok) {
            msg.style.color = '#00bfae';
            msg.textContent = 'Signup successful! Redirecting to login...';
            signupForm.reset();
            document.getElementById('passwordRequirements').style.display = 'none';
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 2000);
        } else {
            let err;
            try { 
                err = await res.json(); 
                console.log('Signup error response:', err);
            } catch (parseError) { 
                console.log('Error parsing response:', parseError);
                err = {}; 
            }
            msg.style.color = '#e53935';
            msg.textContent = (err && err.message) ? err.message : 'Signup failed.';
        }
    } catch (error) {
        console.error('Signup network error:', error);
        btn.classList.remove('loading');
        msg.style.color = '#e53935';
        msg.textContent = 'Network error. Please try again.';
    }
    
    setTimeout(() => msg.classList.add('hide'), 5000);
});

// Password visibility toggle
const toggleSignupPassword = document.getElementById('toggleSignupPassword');
const signupPassword = document.getElementById('signupPassword');
if (toggleSignupPassword && signupPassword) {
    toggleSignupPassword.addEventListener('click', function() {
        if (signupPassword.type === 'password') {
            signupPassword.type = 'text';
            toggleSignupPassword.textContent = '🙈';
            toggleSignupPassword.title = 'Hide password';
        } else {
            signupPassword.type = 'password';
            toggleSignupPassword.textContent = '👁️';
            toggleSignupPassword.title = 'Show password';
        }
    });
}

// Password validation function
function validatePassword(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[@$!%*?&]/.test(password)
    };
    
    return requirements;
}

// Real-time password validation
signupPassword.addEventListener('input', function() {
    const password = signupPassword.value;
    const requirements = validatePassword(password);
    const requirementsDiv = document.getElementById('passwordRequirements');
    
    // Show/hide requirements
    if (password.length > 0) {
        requirementsDiv.style.display = 'block';
    } else {
        requirementsDiv.style.display = 'none';
    }
    
    // Update requirement indicators
    document.getElementById('reqLength').style.color = requirements.length ? '#28a745' : '#dc3545';
    document.getElementById('reqUppercase').style.color = requirements.uppercase ? '#28a745' : '#dc3545';
    document.getElementById('reqLowercase').style.color = requirements.lowercase ? '#28a745' : '#dc3545';
    document.getElementById('reqNumber').style.color = requirements.number ? '#28a745' : '#dc3545';
    document.getElementById('reqSpecial').style.color = requirements.special ? '#28a745' : '#dc3545';
    
    // Overall password validation
    const allValid = Object.values(requirements).every(req => req);
    if (allValid && password.length > 0) {
        signupPassword.classList.remove('invalid');
        signupPassword.classList.add('valid');
    } else {
        signupPassword.classList.add('invalid');
        signupPassword.classList.remove('valid');
    }
});
const signupEmail = document.getElementById('signupEmail');
signupEmail.addEventListener('input', function() {
    const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(signupEmail.value);
    if (!valid) {
        signupEmail.classList.add('invalid');
        signupEmail.classList.remove('valid');
    } else {
        signupEmail.classList.remove('invalid');
        signupEmail.classList.add('valid');
    }
});
const signupName = document.getElementById('signupName');
signupName.addEventListener('input', function() {
    if (signupName.value.length < 2) {
        signupName.classList.add('invalid');
        signupName.classList.remove('valid');
    } else {
        signupName.classList.remove('invalid');
        signupName.classList.add('valid');
    }
});
