$(document).ready(function () {
  // Handle Login button click
  $("#login-btn").click(function () {
    window.location.href = "./login.html"; // Navigate to login page
  });

  // Handle Register button click
  $("#register-btn").click(function () {
    window.location.href = "./register.html"; // Navigate to register page
  });

  // Fetch users from the backend
  function fetchUsers() {
    axios
      .get("http://localhost:7000/api/user/users") // Replace with your API URL
      .then((response) => {
        const users = response.data;
        console.log(response.data);
        const tableBody = $("#users-table-body");
        tableBody.empty(); // Clear any existing rows

        // Loop through users and add rows with Action buttons
        users.forEach((user, index) => {
          const row = `
            <tr data-id="${user._id}" data-username="${
            user.username
          }" data-email="${user.email}" data-registeredAt="${user.createdAt}">
              <td>${index + 1}</td>
              <td>${user.username}</td>
              <td>${user.email}</td>
              <td>${new Date(user.createdAt).toLocaleString()}</td>
              <td>
                <button class="btn btn-warning btn-sm edit-btn" data-id="${
                  user._id
                }">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${
                  user._id
                }">Delete</button>
                <button class="btn btn-primary btn-sm change-password-btn" data-email="${
                  user.email
                }">Change Password</button>
              </td>
            </tr>
          `;
          tableBody.append(row);
        });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }

  // Fetch users on page load
  fetchUsers();

  // Edit button handler
  $("#users-table-body").on("click", ".edit-btn", function () {
    const userId = $(this).data("id");

    // Fetch user details for editing
    axios
      .get(`http://localhost:7000/api/user/${userId}`)
      .then((response) => {
        const user = response.data;
        // Populate the Edit Modal fields
        $("#edit-username").val(user.username);
        $("#edit-email").val(user.email);
        $("#edit-user-id").val(user._id);
        $("#editModal").modal("show");
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  });

  // Delete button handler
  $("#users-table-body").on("click", ".delete-btn", function () {
    const userId = $(this).data("id");
    $("#delete-user-id").val(userId);
    $("#deleteModal").modal("show");
  });

  // Update user info from Edit Modal
  $("#edit-form").submit(function (e) {
    e.preventDefault();
    const userId = $("#edit-user-id").val();
    const updatedUsername = $("#edit-username").val();
    const updatedEmail = $("#edit-email").val();

    axios
      .put(`http://localhost:7000/api/user/${userId}`, {
        username: updatedUsername,
        email: updatedEmail,
      })
      .then(() => {
        alert("User updated successfully!");
        fetchUsers(); // Refresh the users list
        $("#editModal").modal("hide");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  });

  // Confirm delete user
  $("#delete-confirm").click(function () {
    const userId = $("#delete-user-id").val();
    axios
      .delete(`http://localhost:7000/api/user/${userId}`)
      .then(() => {
        alert("User deleted successfully!");
        fetchUsers(); // Refresh the users list
        $("#deleteModal").modal("hide");
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  });

  // Change Password button handler
  $("#users-table-body").on("click", ".change-password-btn", function () {
    const userEmail = $(this).data("email");

    // Redirect to reset-password.html with the user's email as a query parameter
    window.location.href = `reset-password.html?email=${encodeURIComponent(
      userEmail
    )}`;
  });
});
