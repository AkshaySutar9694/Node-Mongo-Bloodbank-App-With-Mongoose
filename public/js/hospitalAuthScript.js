document.addEventListener("DOMContentLoaded", function () {
  const hospitalActionButton = document.getElementById("hospitalActionButton");

  hospitalActionButton.style.backgroundColor = "rgb(36 157 251)";
  hospitalActionButton.style.color = "white";

  //-------------------------- HOSPITAL MANAGEMENT TEAM MEMBER'S LOGIC STARTING HERE ----------------------------

  const hospitalSignupForm = document.getElementById("hospitalSignupForm");
  const hospitalSigninForm = document.getElementById("hospitalSigninForm");

  hospitalSignupForm.style.display = "none";

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const hospitalLoginButton = document.getElementById("hospitalLoginButton");
  const hospitalSignupButton = document.getElementById("hospitalSignupButton");

  hospitalLoginButton.style.backgroundColor = "rgb(36 157 251)";

  hospitalLoginButton.addEventListener("click", function (event) {
    hospitalSignupForm.style.display = "none";
    hospitalSigninForm.style.display = "flex";

    hospitalLoginButton.style.backgroundColor = "rgb(36 157 251)";
    hospitalSignupButton.style.removeProperty("background-color");
    clearAllSigninFieldErrorsForHospital();
    clearAllSignupFieldErrorsForHospital();
  });

  hospitalSignupButton.addEventListener("click", function (event) {
    hospitalSignupForm.style.display = "flex";
    hospitalSigninForm.style.display = "none";

    hospitalSignupButton.style.backgroundColor = "rgb(36 157 251)";
    hospitalLoginButton.style.removeProperty("background-color");
    clearAllSigninFieldErrorsForHospital();
    clearAllSignupFieldErrorsForHospital();
  });

  // HOSPITAL SIGNUP FORM SCRIPT -  STARTING HERE
  function clearAllSignupFieldErrorsForHospital() {
    document.getElementById("hospital-signup-nameError").innerText = "";
    document.getElementById("hospital-signup-addressError").innerText = "";
    document.getElementById("hospital-signup-emailError").innerText = "";
    document.getElementById("hospital-signup-mobileError").innerText = "";
    document.getElementById("hospital-signup-passwordError").innerText = "";
  }

  // Form field values for donor signup
  const nameInputHospital = document.getElementById("hospital-signup-name");
  const addressInputHospital = document.getElementById(
    "hospital-signup-address"
  );
  const emailInputHospital = document.getElementById("hospital-signup-email");
  const mobileInputHospital = document.getElementById("hospital-signup-mobile");
  const passwordInputHospital = document.getElementById(
    "hospital-signup-password"
  );

  nameInputHospital.addEventListener("change", function (event) {
    const name = nameInputHospital.value.trim();
    if (name !== "") {
      document.getElementById("hospital-signup-nameError").innerText = "";
    }
  });

  addressInputHospital.addEventListener("change", function (event) {
    const address = addressInputHospital.value.trim();
    if (address !== "") {
      document.getElementById("hospital-signup-addressError").innerText = "";
    }
  });

  emailInputHospital.addEventListener("change", function (event) {
    const email = emailInputHospital.value.trim();
    if (emailPattern.test(email)) {
      document.getElementById("hospital-signup-emailError").innerText = "";
    }
  });

  mobileInputHospital.addEventListener("change", function (event) {
    const mobile = mobileInputHospital.value.trim();
    if (mobile !== "") {
      document.getElementById("hospital-signup-mobileError").innerText = "";
    }
  });

  passwordInputHospital.addEventListener("change", function (event) {
    const password = passwordInputHospital.value.trim();
    if (password !== "" || password.length < 8) {
      document.getElementById("hospital-signup-passwordError").innerText = "";
    }
  });

  hospitalSignupForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Clear previous errors
    clearAllSignupFieldErrorsForHospital();

    // Form field values
    const nameInputHospital = document.getElementById("hospital-signup-name");
    const addressInputHospital = document.getElementById(
      "hospital-signup-address"
    );
    const emailInputHospital = document.getElementById("hospital-signup-email");
    const mobileInputHospital = document.getElementById(
      "hospital-signup-mobile"
    );
    const passwordInputHospital = document.getElementById(
      "hospital-signup-password"
    );

    const name = nameInputHospital.value.trim();
    const address = addressInputHospital.value.trim();
    const email = emailInputHospital.value.trim();
    const mobileNo = mobileInputHospital.value.trim();
    const password = passwordInputHospital.value.trim();

    // Validation
    let valid = true;

    if (name === "") {
      document.getElementById("hospital-signup-nameError").innerText =
        "Name is required";
      valid = false;
    }

    if (address === "") {
      document.getElementById("hospital-signup-addressError").innerText =
        "Address is required";
      valid = false;
    }

    if (!emailPattern.test(email)) {
      document.getElementById("hospital-signup-emailError").innerText =
        "Invalid email address";
      valid = false;
    }

    if (mobileNo === "") {
      document.getElementById("hospital-signup-mobileError").innerText =
        "Mobile number is required";
      valid = false;
    }

    if (password.length < 8) {
      document.getElementById("hospital-signup-passwordError").innerText =
        "Password must be at least 8 characters long";
      valid = false;
    }

    if (valid) {
      alert("Form submitted successfully!");
      hospitalSignupForm.submit();
    }
  });
  // HOSPITAL SIGNUP FORM SCRIPT -  ENDING HERE

  // HOSPITAL SIGNIN FORM SCRIPT -  STARTING HERE
  function clearAllSigninFieldErrorsForHospital() {
    document.getElementById("hospital-signin-emailError").innerText = "";
    document.getElementById("hospital-signin-passwordError").innerText = "";
  }

  // Form field values for donor signup
  const hospitalEmailInputSignin = document.getElementById(
    "hospital-signin-email"
  );
  const hospitalPasswordInputSignin = document.getElementById(
    "hospital-signin-password"
  );

  hospitalEmailInputSignin.addEventListener("change", function (event) {
    const email = hospitalEmailInputSignin.value.trim();
    if (emailPattern.test(email)) {
      document.getElementById("hospital-signin-emailError").innerText = "";
    }
  });

  hospitalPasswordInputSignin.addEventListener("change", function (event) {
    const password = hospitalPasswordInputSignin.value.trim();
    if (password !== "" || password.length < 8) {
      document.getElementById("hospital-signin-passwordError").innerText = "";
    }
  });

  hospitalSigninForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Clear previous errors
    clearAllSigninFieldErrorsForHospital();

    // Form field values
    const emailInputSignin = document.getElementById("hospital-signin-email");
    const passwordInputSignin = document.getElementById(
      "hospital-signin-password"
    );

    const email = emailInputSignin.value.trim();
    const password = passwordInputSignin.value.trim();

    // Validation
    let valid = true;

    if (!emailPattern.test(email)) {
      document.getElementById("hospital-signin-emailError").innerText =
        "Invalid email address";
      valid = false;
    }

    if (password === "") {
      document.getElementById("hospital-signin-passwordError").innerText =
        "Password is required";
      valid = false;
    }

    if (valid) {
      alert("Form submitted successfully!");
      hospitalSigninForm.submit();
    }
  });
  // DONOR SIGNIN FORM SCRIPT -  ENDING HERE

  //-------------------------- HOSPITAL MANAGEMENT TEAM MEMBER'S LOGIC ENDING HERE ----------------------------
});
