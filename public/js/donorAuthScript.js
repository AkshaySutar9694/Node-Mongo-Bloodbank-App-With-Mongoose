document.addEventListener("DOMContentLoaded", function () {
  const donorActionButton = document.getElementById("donorActionButton");

  donorActionButton.style.backgroundColor = "rgb(36 157 251)";
  donorActionButton.style.color = "white";

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const signUpForm = document.getElementById("donorSignupForm");
  const loginForm = document.getElementById("donorSigninForm");

  const loginButton = document.getElementById("donorLoginButton");
  const signUpButton = document.getElementById("donorSignupButton");

  function clearAllSigninFieldErrors() {
    document.getElementById("donor-signin-emailError").innerText = "";
    document.getElementById("donor-signin-passwordError").innerText = "";
  }

  function clearAllSignupFieldErrors() {
    document.getElementById("donor-signup-nameError").innerText = "";
    document.getElementById("donor-signup-ageError").innerText = "";
    document.getElementById("donor-signup-bloodTypeError").innerText = "";
    document.getElementById("donor-signup-emailError").innerText = "";
    document.getElementById("donor-signup-mobilenoError").innerText = "";
    document.getElementById("donor-signup-addressError").innerText = "";
    document.getElementById("donor-signup-passwordError").innerText = "";
  }

  //-------------------------- DONOR'S LOGIC STARTING HERE ----------------------------

  // DONOR SIGNUP FORM SCRIPT -  STARTING HERE
  if (signUpForm) {
    signUpButton.style.backgroundColor = "rgb(36 157 251)";

    clearAllSignupFieldErrors();

    // Form field values for donor signup
    const nameInput = document.getElementById("donor-signup-name");
    const ageInput = document.getElementById("donor-signup-age");
    const bloodTypeInput = document.getElementById("donor-signup-bloodGroup");
    const emailInput = document.getElementById("donor-signup-email");
    const mobileInput = document.getElementById("donor-signup-mobileNo");
    const addressInput = document.getElementById("donor-signup-address");
    const passwordInput = document.getElementById("donor-signup-password");

    nameInput.addEventListener("change", function (event) {
      const name = nameInput.value.trim();
      if (name !== "") {
        document.getElementById("donor-signup-nameError").innerText = "";
      }
    });

    ageInput.addEventListener("change", function (event) {
      const age = parseInt(ageInput.value);
      if (!(isNaN(age) || age < 18 || age > 65)) {
        document.getElementById("donor-signup-ageError").innerText = "";
      }
    });

    bloodTypeInput.addEventListener("change", function (event) {
      const bloodGroup = bloodTypeInput.value;
      if (bloodGroup !== "") {
        document.getElementById("donor-signup-bloodTypeError").innerText = "";
      }
    });

    emailInput.addEventListener("change", function (event) {
      const email = emailInput.value.trim();
      if (emailPattern.test(email)) {
        document.getElementById("donor-signup-emailError").innerText = "";
      }
    });

    mobileInput.addEventListener("change", function (event) {
      const mobileNo = mobileInput.value.trim();
      if (mobileNo !== "") {
        document.getElementById("donor-signup-mobilenoError").innerText = "";
      }
    });

    addressInput.addEventListener("change", function (event) {
      const address = addressInput.value.trim();
      if (address !== "") {
        document.getElementById("donor-signup-addressError").innerText = "";
      }
    });

    passwordInput.addEventListener("change", function (event) {
      const password = passwordInput.value.trim();
      if (password !== "" || password.length < 8) {
        document.getElementById("donor-signup-passwordError").innerText = "";
      }
    });

    signUpForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission

      // Clear previous errors
      clearAllSignupFieldErrors();

      // Form field values
      const nameInput = document.getElementById("donor-signup-name");
      const ageInput = document.getElementById("donor-signup-age");
      const bloodTypeInput = document.getElementById("donor-signup-bloodGroup");
      const emailInput = document.getElementById("donor-signup-email");
      const mobileInput = document.getElementById("donor-signup-mobileNo");
      const addressInput = document.getElementById("donor-signup-address");
      const passwordInput = document.getElementById("donor-signup-password");

      const name = nameInput.value.trim();
      const age = parseInt(ageInput.value);
      const bloodGroup = bloodTypeInput.value;
      const email = emailInput.value.trim();
      const mobileNo = mobileInput.value.trim();
      const address = addressInput.value.trim();
      const password = passwordInput.value.trim();

      // Validation
      let valid = true;

      if (name === "") {
        document.getElementById("donor-signup-nameError").innerText =
          "Name is required";
        valid = false;
      }

      if (isNaN(age) || age < 18 || age > 65) {
        document.getElementById("donor-signup-ageError").innerText =
          "Age must be between 18 and 65";
        valid = false;
      }

      if (bloodGroup === "") {
        document.getElementById("donor-signup-bloodTypeError").innerText =
          "Please select a blood type";
        valid = false;
      }

      if (!emailPattern.test(email)) {
        document.getElementById("donor-signup-emailError").innerText =
          "Invalid email address";
        valid = false;
      }

      if (mobileNo === "") {
        document.getElementById("donor-signup-mobilenoError").innerText =
          "Mobile number is required";
        valid = false;
      }

      if (address === "") {
        document.getElementById("donor-signup-addressError").innerText =
          "Address is required";
        valid = false;
      }

      if (password.length < 8) {
        document.getElementById("donor-signup-passwordError").innerText =
          "Password must be at least 8 characters long";
        valid = false;
      }

      if (valid) {
        alert("Form submitted successfully!");
        signUpForm.submit();
      }
    });
  }

  // DONOR SIGNUP FORM SCRIPT -  ENDING HERE

  // DONOR SIGNIN FORM SCRIPT -  STARTING HERE
  if (loginForm) {
    loginButton.style.backgroundColor = "rgb(36 157 251)";

    clearAllSigninFieldErrors();
    // Form field values for donor signup
    const emailInputSignin = document.getElementById("donor-signin-email");
    const passwordInputSignin = document.getElementById(
      "donor-signin-password"
    );

    emailInputSignin.addEventListener("change", function (event) {
      const email = emailInputSignin.value.trim();
      if (emailPattern.test(email)) {
        document.getElementById("donor-signin-emailError").innerText = "";
      }
    });

    passwordInputSignin.addEventListener("change", function (event) {
      const password = passwordInputSignin.value.trim();
      if (password !== "" || password.length < 8) {
        document.getElementById("donor-signin-passwordError").innerText = "";
      }
    });

    loginForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission

      // Clear previous errors
      clearAllSigninFieldErrors();

      // Form field values
      const emailInputSignin = document.getElementById("donor-signin-email");
      const passwordInputSignin = document.getElementById(
        "donor-signin-password"
      );

      const email = emailInputSignin.value.trim();
      const password = passwordInputSignin.value.trim();

      // Validation
      let valid = true;

      if (!emailPattern.test(email)) {
        document.getElementById("donor-signin-emailError").innerText =
          "Invalid email address";
        valid = false;
      }

      if (password === "") {
        document.getElementById("donor-signin-passwordError").innerText =
          "Password is required";
        valid = false;
      }

      if (valid) {
        alert("Form submitted successfully!");
        loginForm.submit();
      }
    });
  }
  // DONOR SIGNIN FORM SCRIPT -  ENDING HERE

  //-------------------------- DONOR'S LOGIC ENDING HERE ----------------------------
});
