document.addEventListener("DOMContentLoaded", function () {
  const editButton = document.getElementById("editButton");
  const cancelButton = document.getElementById("cancelButton");
  const hospitalReadMode = document.getElementById("hospitalReadMode");
  const hospitalEditMode = document.getElementById("hospitalEditMode");

  editButton.addEventListener("click", () => {
    hospitalReadMode.style.display = "none";
    hospitalEditMode.style.display = "flex";
  });

  cancelButton.addEventListener("click", () => {
    hospitalEditMode.style.display = "none";
    hospitalReadMode.style.display = "flex";
  });

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const hospitalProfileDetailsForm = document.getElementById(
    "hospitalDetailsUpdateForm"
  );

  function clearDetailsFieldErrors() {
    document.getElementById("hospital-updated-nameError").innerText = "";
    document.getElementById("hospital-updated-emailError").innerText = "";
    document.getElementById("hospital-updated-mobilenoError").innerText = "";
    document.getElementById("hospital-updated-addressError").innerText = "";

    document.getElementById("hospital-updated-newPasswordError").innerText = "";
    document.getElementById("hospital-updated-confirmPasswordError").innerText =
      "";
  }

  const nameInput = document.getElementById("hospital-updated-name");
  const emailInput = document.getElementById("hospital-updated-email");
  const mobileInput = document.getElementById("hospital-updated-mobileNo");
  const addressInput = document.getElementById("hospital-updated-address");

  const newPasswordInput = document.getElementById(
    "hospital-updated-new-password"
  );

  const confirmedPasswordInput = document.getElementById(
    "hospital-updated-confirm-password"
  );

  nameInput.addEventListener("change", function (event) {
    const name = nameInput.value.trim();
    if (name !== "") {
      document.getElementById("hospital-updated-nameError").innerText = "";
    }
  });

  emailInput.addEventListener("change", function (event) {
    const email = emailInput.value.trim();
    if (emailPattern.test(email)) {
      document.getElementById("hospital-updated-emailError").innerText = "";
    }
  });

  mobileInput.addEventListener("change", function (event) {
    const mobileNo = mobileInput.value.trim();
    if (mobileNo !== "") {
      document.getElementById("hospital-updated-mobilenoError").innerText = "";
    }
  });

  addressInput.addEventListener("change", function (event) {
    const address = addressInput.value.trim();
    if (address !== "") {
      document.getElementById("hospital-updated-addressError").innerText = "";
    }
  });

  newPasswordInput.addEventListener("change", function (event) {
    const newPassword = newPasswordInput.value.trim();
    if (newPassword !== "" || newPassword.length < 8) {
      document.getElementById("hospital-updated-newPasswordError").innerText =
        "";
    }
  });

  confirmedPasswordInput.addEventListener("change", function (event) {
    const confirmedPassword = confirmedPasswordInput.value.trim();
    if (confirmedPassword !== "") {
      document.getElementById(
        "hospital-updated-confirmPasswordError"
      ).innerText = "";
    }
  });

  hospitalProfileDetailsForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Clear previous errors
    clearDetailsFieldErrors();

    // Form field values
    const nameInput = document.getElementById("hospital-updated-name");
    const emailInput = document.getElementById("hospital-updated-email");
    const mobileInput = document.getElementById("hospital-updated-mobileNo");
    const addressInput = document.getElementById("hospital-updated-address");

    const newPasswordInput = document.getElementById(
      "hospital-updated-new-password"
    );
    const confirmedPasswordInput = document.getElementById(
      "hospital-updated-confirm-password"
    );

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const mobileNo = mobileInput.value.trim();
    const address = addressInput.value.trim();

    const newPassword = newPasswordInput.value.trim();
    const confirmedPassword = confirmedPasswordInput.value.trim();

    // Validation
    let validDetails = true;
    let validPasswordDetails = true;

    if (name === "") {
      document.getElementById("hospital-updated-nameError").innerText =
        "Name is required";
      validDetails = false;
    }

    if (!emailPattern.test(email)) {
      document.getElementById("hospital-updated-emailError").innerText =
        "Invalid email address";
      validDetails = false;
    }

    if (mobileNo === "") {
      document.getElementById("hospital-updated-mobilenoError").innerText =
        "Mobile number is required";
      validDetails = false;
    }

    if (address === "") {
      document.getElementById("hospital-updated-addressError").innerText =
        "Address is required";
      validDetails = false;
    }

    if (newPassword.length < 8 && newPassword.length > 0) {
      document.getElementById("hospital-updated-newPasswordError").innerText =
        "Password must be at least 8 characters long";
      validPasswordDetails = false;
    }

    if (
      (newPassword.length !== 0 && confirmedPassword.length === 0) ||
      newPassword !== confirmedPassword
    ) {
      document.getElementById(
        "hospital-updated-confirmPasswordError"
      ).innerText = "Password must be same as above";
      validPasswordDetails = false;
    }

    if (validDetails === true && validPasswordDetails === true) {
      alert("Form submitted successfully!");
      hospitalProfileDetailsForm.submit();
    }
  });
});
