// Login form validation
document.getElementById('login-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please fill in both Email Address and Password.');
        return;
    }

    console.log(`Login attempt with email: ${email}, password: ${password}`);
    alert('Login successful! (Simulated)');
});

// Registration form validation
document.getElementById('registration-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    console.log(`Registration with email: ${email}, password: ${password}`);
    alert('Registration successful! (Simulated)');
});


 

 document.getElementById('forgot-password-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
   const email = document.getElementById('email').value;
     const securityAnswer = document.getElementById('security-answer').value;

     if (!email) {
        alert('Please enter a valid email address.');
         return;
    }

     if (!securityAnswer) {
         alert('Please enter your answer to "What is your mother\'s maiden name?"');
         return;
     }

    console.log(`Password reset requested for email: ${email}`);
     console.log(`Security Answer: ${securityAnswer}`);
    alert(`A password reset link has been sent to ${email} after verifying your security answer.`);
 });
