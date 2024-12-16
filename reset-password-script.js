$(document).ready(function () {
    // Send OTP to the user's email
    $('#resetPasswordForm').on('submit', function (e) {
      e.preventDefault(); // Prevent default form submission
  
      const email = $('#resetEmail').val();
  
      // Axios POST request to backend to send OTP
      axios.post('http://localhost:7000/api/user/reset-password', { email })
        .then((response) => {
          alert('OTP sent to your email!');
          $('#resetPasswordForm')[0].reset();
          
          // Show OTP Modal
          $('#otpModal').modal('show');
        })
        .catch((error) => {
          alert('Error occurred while sending OTP.');
          console.error('Error:', error);
        });
    });
  
    // Verify OTP
    $('#verifyOtpButton').on('click', function () {
      const otp = $('#otp').val();
    
      // Axios POST request to verify OTP
      axios.post('http://localhost:7000/api/user/verify-otp', { otp })
        .then((response) => {
          if (response.data.success) {
            alert('OTP Verified! Redirecting to Change Password page.');
            // Redirect to the Change Password page, passing email and OTP as query parameters
            const email = $('#resetEmail').val(); // Email input from the form
            window.location.href = `change-password.html?email=${encodeURIComponent(email)}&otp=${otp}`;
          } else {
            alert('Invalid OTP. Please try again.');
          }
        })
        .catch((error) => {
          alert('Error verifying OTP.');
          console.error('Error:', error);
        });
    });
  });
  