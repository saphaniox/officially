// Fetch user info and show name, email, date, pic, and activity
console.log('Loading account page...');
fetch('/api/account', {
  credentials: 'include' // Ensure cookies are sent
})
  .then(res => {
    console.log('Account API response status:', res.status);
    console.log('Account API response headers:', res.headers);
    if (res.status === 401) {
      console.log('Unauthorized, redirecting to login');
      window.location.href = '/login.html';
      return null;
    }
    return res.json();
  })
  .then(data => {
    if (data && data.user) {
      document.getElementById('accountName').textContent = data.user.name;
      document.getElementById('editName').value = data.user.name;
      document.getElementById('accountEmail').textContent = data.user.email;
      document.getElementById('editEmail').value = data.user.email;
      document.getElementById('accountDate').textContent = new Date(data.user.createdAt).toLocaleString();
      document.getElementById('profilePic').src = data.user.profilePic || 'profile-pics/default.png';
      // Activity log
      const log = document.getElementById('activityLog');
      log.innerHTML = '';
      (data.user.activity || []).slice(-10).reverse().forEach(act => {
        const li = document.createElement('li');
        li.textContent = act;
        log.appendChild(li);
      });
      
      // Check if user is admin and show admin link
      checkAdminStatus();
    }
  });

// Check admin status and show admin link if authorized
async function checkAdminStatus() {
  try {
    console.log('Checking admin status...');
    const res = await fetch('/api/admin/check', {
      credentials: 'include' // Ensure cookies are sent
    });
    console.log('Admin check response status:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log('Admin check data:', data);
      if (data.isAdmin) {
        document.getElementById('adminLink').style.display = 'block';
      }
    } else {
      console.log('Admin check failed with status:', res.status);
    }
  } catch (err) {
    console.log('Admin check failed:', err);
  }
}

// Handle admin link click with authorization check
document.addEventListener('DOMContentLoaded', function() {
  const adminLink = document.querySelector('#adminLink a');
  if (adminLink) {
    adminLink.addEventListener('click', async function(e) {
      e.preventDefault();
      
      try {
        const res = await fetch('/api/admin/check');
        if (res.ok) {
          const data = await res.json();
          if (data.isAdmin) {
            window.location.href = '/admin.html';
          } else {
            showNotification();
          }
        } else {
          showNotification();
        }
      } catch (err) {
        showNotification();
      }
    });
  }
});

// Show notification modal
function showNotification() {
  document.getElementById('notificationModal').style.display = 'flex';
}

// Close notification modal
function closeNotification() {
  document.getElementById('notificationModal').style.display = 'none';
}

// Profile picture upload
const profilePicForm = document.getElementById('profilePicForm');
if (profilePicForm) {
  profilePicForm.onsubmit = async function(e) {
    e.preventDefault();
    const input = document.getElementById('profilePicInput');
    if (!input.files[0]) return;
    const formData = new FormData();
    formData.append('profilePic', input.files[0]);
    const res = await fetch('/api/account/profile-pic', {
      method: 'POST',
      body: formData
    });
    const msg = document.getElementById('profilePicMsg');
    if (res.ok) {
      const data = await res.json();
      document.getElementById('profilePic').src = data.profilePic;
      msg.textContent = 'Profile picture updated!';
      msg.style.color = '#00bfae';
    } else {
      msg.textContent = 'Upload failed.';
      msg.style.color = '#e53935';
    }
  };
}

// Edit name logic
const editNameForm = document.getElementById('editNameForm');
if (editNameForm) {
  editNameForm.onsubmit = async function(e) {
    e.preventDefault();
    const newName = document.getElementById('editName').value;
    const res = await fetch('/api/account', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName })
    });
    const msg = document.getElementById('editNameMsg');
    if (res.ok) {
      const data = await res.json();
      document.getElementById('accountName').textContent = data.user.name;
      msg.textContent = 'Name updated!';
      msg.style.color = '#00bfae';
    } else {
      msg.textContent = 'Update failed.';
      msg.style.color = '#e53935';
    }
  };
}

// Edit email logic
const editEmailForm = document.getElementById('editEmailForm');
if (editEmailForm) {
  editEmailForm.onsubmit = async function(e) {
    e.preventDefault();
    const newEmail = document.getElementById('editEmail').value;
    const res = await fetch('/api/account/email', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail })
    });
    const msg = document.getElementById('editEmailMsg');
    if (res.ok) {
      const data = await res.json();
      document.getElementById('accountEmail').textContent = data.user.email;
      msg.textContent = 'Email updated!';
      msg.style.color = '#00bfae';
    } else {
      msg.textContent = 'Update failed.';
      msg.style.color = '#e53935';
    }
  };
}

// Edit password logic
const editPasswordForm = document.getElementById('editPasswordForm');
if (editPasswordForm) {
  editPasswordForm.onsubmit = async function(e) {
    e.preventDefault();
    const newPassword = document.getElementById('editPassword').value;
    const res = await fetch('/api/account/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword })
    });
    const msg = document.getElementById('editPasswordMsg');
    if (res.ok) {
      msg.textContent = 'Password updated!';
      msg.style.color = '#00bfae';
    } else {
      msg.textContent = 'Update failed.';
      msg.style.color = '#e53935';
    }
  };
}

// Password strength meter
const passwordInput = document.getElementById('editPassword');
const strengthDiv = document.getElementById('passwordStrength');
if (passwordInput && strengthDiv) {
  passwordInput.addEventListener('input', function() {
    const val = passwordInput.value;
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[a-z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    let msg = '', color = '#e53935';
    if (score <= 2) { msg = 'Weak'; color = '#e53935'; }
    else if (score === 3) { msg = 'Medium'; color = '#ffb300'; }
    else if (score >= 4) { msg = 'Strong'; color = '#00bfae'; }
    strengthDiv.textContent = msg;
    strengthDiv.style.color = color;
  });
}

// Delete account logic
const deleteBtn = document.getElementById('deleteAccountBtn');
if (deleteBtn) {
  deleteBtn.onclick = async function() {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    const res = await fetch('/api/account', { method: 'DELETE' });
    const msg = document.getElementById('deleteMsg');
    if (res.ok) {
      msg.textContent = 'Account deleted.';
      msg.style.color = '#00bfae';
      setTimeout(() => { window.location.href = '/signup.html'; }, 1200);
    } else {
      msg.textContent = 'Delete failed.';
      msg.style.color = '#e53935';
    }
  };
}

// Logout logic
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.onclick = async function() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login.html';
  };
}
// Also support nav logout
const logoutNav = document.getElementById('logoutNav');
if (logoutNav) {
  logoutNav.onclick = async function(e) {
    e.preventDefault();
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login.html';
  };
}
