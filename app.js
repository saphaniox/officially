// Professional Slider Logic
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slider-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const leftArrow = document.querySelector('.slider-arrow.left');
    const rightArrow = document.querySelector('.slider-arrow.right');
    let current = 0;
    let timer;

    function showSlide(idx) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === idx);
            if (dots[i]) dots[i].classList.toggle('active', i === idx);
        });
        current = idx;
    }

    function nextSlide() {
        showSlide((current + 1) % slides.length);
    }

    function prevSlide() {
        showSlide((current - 1 + slides.length) % slides.length);
    }

    function startAuto() {
        timer = setInterval(nextSlide, 5000);
    }

    function stopAuto() {
        clearInterval(timer);
    }

    if (slides.length) {
        showSlide(0);
        startAuto();
        rightArrow.addEventListener('click', () => { stopAuto(); nextSlide(); startAuto(); });
        leftArrow.addEventListener('click', () => { stopAuto(); prevSlide(); startAuto(); });
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => { stopAuto(); showSlide(i); startAuto(); });
        });
    }
});
// SAP Technologies Frontend JS

document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const msgDiv = document.getElementById('formMessage');
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    msgDiv.textContent = '';
    msgDiv.style.color = '';
    
    const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim()
    };
    
    try {
        const res = await fetch(window.API_BASE_URL + '/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await res.json();
        
        if (res.ok) {
            msgDiv.textContent = result.message || 'Thank you for contacting us! We will get back to you soon.';
            msgDiv.style.color = 'green';
            form.reset();
        } else {
            msgDiv.textContent = result.message || 'There was an error. Please try again later.';
            msgDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Contact form error:', error);
        msgDiv.textContent = 'Network error. Please check your connection and try again.';
        msgDiv.style.color = 'red';
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
});

// Modal logic for login/signup
const authModal = document.getElementById('authModal');
const loginNav = document.getElementById('loginNav');
const signupNav = document.getElementById('signupNav');
const closeModal = document.getElementById('closeModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

loginNav.onclick = function() {
    authModal.style.display = 'block';
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
};
signupNav.onclick = function() {
    authModal.style.display = 'block';
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
};
closeModal.onclick = function() {
    authModal.style.display = 'none';
};
window.onclick = function(event) {
    if (event.target == authModal) {
        authModal.style.display = 'none';
    }
};

// Signup logic
signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const data = {
        name: signupForm.name.value,
        email: signupForm.email.value,
        password: signupForm.password.value
    };
    const res = await fetch(window.API_BASE_URL + '/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    const msg = document.getElementById('signupMessage');
    if (res.ok) {
        msg.textContent = 'Signup successful! Redirecting to login...';
        signupForm.reset();
        setTimeout(() => { window.location.href = '/login.html'; }, 1500);
    } else {
        const err = await res.json();
        msg.textContent = err.message || 'Signup failed.';
    }
});

// Login logic
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const data = {
        email: loginForm.email.value,
        password: loginForm.password.value
    };
    const res = await fetch(window.API_BASE_URL + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    const msg = document.getElementById('loginMessage');
    if (res.ok) {
        msg.textContent = 'Login successful! Redirecting to homepage...';
        loginForm.reset();
        setTimeout(() => { window.location.href = '/'; }, 1000);
    } else {
        let err;
        try { err = await res.json(); } catch { err = {}; }
        msg.textContent = (err && err.message) ? err.message : 'Login failed.';
    }
});

// Check login state and update nav
async function updateNavAuth() {
    try {
        const res = await fetch(window.API_BASE_URL + '/api/account', { credentials: 'include' });
        const navLogin = document.getElementById('loginNav');
        const navSignup = document.getElementById('signupNav');
        
        if (res.status === 200) {
            // Logged in - hide login/signup, show account/logout
            if (navLogin) navLogin.style.display = 'none';
            if (navSignup) navSignup.style.display = 'none';
            
            // Add My Account link if it doesn't exist
            let accountLink = document.getElementById('accountNav');
            if (!accountLink) {
                accountLink = document.createElement('li');
                accountLink.id = 'accountNav';
                accountLink.innerHTML = '<a href="/account.html" class="nav-link">My Account</a>';
                document.querySelector('.nav-links').appendChild(accountLink);
            }
            
            // Add Logout link if it doesn't exist
            let logoutLink = document.getElementById('logoutNav');
            if (!logoutLink) {
                logoutLink = document.createElement('li');
                logoutLink.id = 'logoutNav';
                logoutLink.innerHTML = '<a href="#" class="nav-link">Logout</a>';
                document.querySelector('.nav-links').appendChild(logoutLink);
                logoutLink.onclick = async function(e) {
                    e.preventDefault();
                    try {
                        await fetch(window.API_BASE_URL + '/api/logout', { 
                            method: 'POST',
                            credentials: 'include'
                        });
                        window.location.href = '/';
                    } catch (error) {
                        console.error('Logout error:', error);
                        window.location.href = '/';
                    }
                };
            }
        } else {
            // Not logged in - show login/signup, hide account/logout
            if (navLogin) navLogin.style.display = '';
            if (navSignup) navSignup.style.display = '';
            const accountLink = document.getElementById('accountNav');
            if (accountLink) accountLink.remove();
            const logoutLink = document.getElementById('logoutNav');
            if (logoutLink) logoutLink.remove();
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        // On error, show login/signup links
        const navLogin = document.getElementById('loginNav');
        const navSignup = document.getElementById('signupNav');
        if (navLogin) navLogin.style.display = '';
        if (navSignup) navSignup.style.display = '';
    }
}

// Call updateNavAuth when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateNavAuth();
});

// Slider functionality
const slides = document.querySelectorAll('.slider-slide');
const dots = document.querySelectorAll('.slider-dots .dot');
const leftArrow = document.querySelector('.slider-arrow.left');
const rightArrow = document.querySelector('.slider-arrow.right');
let currentSlide = 0;

function showSlide(idx) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === idx);
        if (dots[i]) dots[i].classList.toggle('active', i === idx);
    });
}
function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}
function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

if (slides.length > 0) {
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentSlide = i;
            showSlide(currentSlide);
        });
    });
    rightArrow.addEventListener('click', nextSlide);
    leftArrow.addEventListener('click', prevSlide);
    let sliderInterval = setInterval(nextSlide, 5000);
    
    // Pause on hover
    const slider = document.querySelector('.slider-container');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(sliderInterval));
        slider.addEventListener('mouseleave', () => sliderInterval = setInterval(nextSlide, 5000));
    }
}
