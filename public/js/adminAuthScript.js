document.addEventListener("DOMContentLoaded", function () {
  //-------------------------- ADMIN'S LOGIC STARTING HERE ----------------------------

  const adminActionButton = document.getElementById("adminActionButton");

  adminActionButton.style.backgroundColor = "rgb(36 157 251)";
  adminActionButton.style.color = "white";

  const adminSigninForm = document.getElementById("adminSigninForm");

  // ADMIN SIGNIN FORM SCRIPT -  STARTING HERE
  function clearAllSigninFieldErrorsForAdminForms() {
    document.getElementById("admin-signin-usernameError").innerText = "";
    document.getElementById("admin-signin-passwordError").innerText = "";
  }

  // Form field values for admin signup
  const adminSigninUsername = document.getElementById("admin-signin-username");
  const adminSigninPassword = document.getElementById("admin-signin-password");

  adminSigninUsername.addEventListener("change", function (event) {
    const username = adminSigninUsername.value.trim();
    if (username !== "") {
      document.getElementById("admin-signin-usernameError").innerText = "";
    }
  });

  adminSigninPassword.addEventListener("change", function (event) {
    const password = adminSigninPassword.value.trim();
    if (password !== "") {
      document.getElementById("admin-signin-passwordError").innerText = "";
    }
  });

  adminSigninForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Clear previous errors
    clearAllSigninFieldErrorsForAdminForms();

    // Form field values
    const usernameInput = document.getElementById("admin-signin-username");
    const passwordInput = document.getElementById("admin-signin-password");

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Validation
    let valid = true;

    if (username === "") {
      document.getElementById("admin-signin-usernameError").innerText =
        "Username is required";
      valid = false;
    }

    if (password === "") {
      document.getElementById("admin-signin-passwordError").innerText =
        "Password is required";
      valid = false;
    }

    if (valid) {
      alert("Form submitted successfully!");
      adminSigninForm.submit();
    }
  });
  // ADMIN SIGNIN FORM SCRIPT -  ENDING HERE

  //-------------------------- ADMIN'S LOGIC ENDING HERE ----------------------------
});
