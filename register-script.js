$(document).ready(function () {
    // Handle form submission
    $('#registerForm').on('submit', function (e) {
      e.preventDefault(); // Prevent default form submission
  
      // Collect form data
      const name = $('#name').val();
      const email = $('#email').val();
      const password = $('#password').val();
      const confirmPassword = $('#confirmPassword').val();
  
      // Basic validation
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
  
      // Axios POST request to backend
      axios.post('http://localhost:7000/api/user/register', {
        name,
        email,
        password,
      })
        .then((response) => {
          alert('Registration successful!');
          console.log('Response:', response.data);
  
          // Clear form fields
          $('#registerForm')[0].reset();
          window.location.href = './index.html';
        })
        .catch((error) => {
          alert('An error occurred during registration.');
          console.error('Error:', error.response?.data || error.message);
        });
    });
  });
  