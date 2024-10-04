document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('/api/auth/register-for-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration.');
    }
  });
  
  document.getElementById('verifyOtpForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('otpEmail').value;
    const otp = document.getElementById('otpCode').value;
  
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp })
      });
      const result = await response.json();
      if (response.ok) {
        alert('OTP verified successfully. Token: ' + result.token);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during OTP verification.');
    }
  });