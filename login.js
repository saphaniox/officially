// Remove this duplicate handler - we have a better one below

// Password visibility toggle
const toggleLoginPassword = document.getElementById('toggleLoginPassword');
const loginPassword = document.getElementById('loginPassword');
if (toggleLoginPassword && loginPassword) {
    toggleLoginPassword.addEventListener('click', function() {
        if (loginPassword.type === 'password') {
            loginPassword.type = 'text';
            toggleLoginPassword.textContent = '🙈';
            toggleLoginPassword.title = 'Hide password';
        } else {
            loginPassword.type = 'password';
            toggleLoginPassword.textContent = '👁️';
            toggleLoginPassword.title = 'Show password';
        }
    });
}

// Real-time validation
loginPassword.addEventListener('input', function() {
    if (loginPassword.value.length < 6) {
        loginPassword.classList.add('invalid');
        loginPassword.classList.remove('valid');
    } else {
        loginPassword.classList.remove('invalid');
        loginPassword.classList.add('valid');
    }
});
const loginEmail = document.getElementById('loginEmail');
loginEmail.addEventListener('input', function() {
    const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(loginEmail.value);
    if (!valid) {
        loginEmail.classList.add('invalid');
        loginEmail.classList.remove('valid');
    } else {
        loginEmail.classList.remove('invalid');
        loginEmail.classList.add('valid');
    }
});
// Button loading spinner
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const btn = loginForm.querySelector('button');
    const msg = document.getElementById('loginMessage');
    
    // Show loading state
    btn.classList.add('loading');
    btn.disabled = true;
    btn.textContent = 'Logging in...';
    msg.textContent = '';
    msg.style.color = '';
    
    const data = {
        email: loginEmail.value.trim(),
        password: loginPassword.value
    };
    
    try {
        console.log('Attempting login with:', { email: data.email, password: '***' });
        
        const res = await fetch(window.API_BASE_URL + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Ensure cookies are sent and received
        body: JSON.stringify(data)
    });
        
        console.log('Login response status:', res.status);
        console.log('Login response headers:', res.headers);
        
    if (res.ok) {
            const responseData = await res.json();
            console.log('Login successful, response data:', responseData);
        msg.style.color = '#00bfae';
            msg.textContent = 'Login successful! Redirecting to homepage...';
        loginForm.reset();
            
            // Redirect to homepage
            setTimeout(() => { 
                console.log('Redirecting to homepage...');
                window.location.href = '/'; 
            }, 1500);
    } else {
        let err;
            try { 
                err = await res.json(); 
                console.log('Login error response:', err);
            } catch (parseError) { 
                console.log('Error parsing response:', parseError);
                err = {}; 
            }
            msg.style.color = '#e53935';
            msg.textContent = (err && err.message) ? err.message : 'Login failed. Please check your credentials.';
        }
    } catch (error) {
        console.error('Login network error:', error);
        msg.style.color = '#e53935';
        msg.textContent = 'Network error. Please check your connection and try again.';
    } finally {
        // Reset button state
        btn.classList.remove('loading');
        btn.disabled = false;
        btn.textContent = 'Login';
    }
});
