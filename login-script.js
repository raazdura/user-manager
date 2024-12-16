$(document).ready(function () {
    // Handle form submission
    $('#contactForm').on('submit', function (e) {
      e.preventDefault(); // Prevent default form submission
  
      // Collect form data
      const email = $('#email').val();
      const password = $('#password').val();
  
      // Basic validation (optional)
      if (!email || !password) {
        alert('Please fill out all fields.');
        return;
      }
  
      // Axios POST request to backend
      axios.post('http://localhost:7000/api/user/login', {
        email,
        password,
      })
        .then((response) => {
          alert('Message sent successfully!');
          console.log('Response:', response.data);
  
          // Clear form fields
          $('#contactForm')[0].reset();
          window.location.href = './index.html';
        })
        .catch((error) => {
          alert('An error occurred while sending the message.');
          console.error('Error:', error);
        });
    });
  });
  