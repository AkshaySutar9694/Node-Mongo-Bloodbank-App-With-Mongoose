document.addEventListener("DOMContentLoaded", function () {
  const editButton = document.getElementById("editButton");
  const cancelButton = document.getElementById("cancelButton");
  const donorReadMode = document.getElementById("donorReadMode");
  const donorEditMode = document.getElementById("donorEditMode");

  editButton.addEventListener("click", () => {
    donorReadMode.style.display = "none";
    donorEditMode.style.display = "flex";
  });

  cancelButton.addEventListener("click", () => {
    donorEditMode.style.display = "none";
    donorReadMode.style.display = "flex";
  });

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const donorProfileDetailsForm = document.getElementById(
    "donorDetailsUpdateForm"
  );

  function clearDetailsFieldErrors() {
    document.getElementById("donor-updated-nameError").innerText = "";
    document.getElementById("donor-updated-ageError").innerText = "";
    document.getElementById("donor-updated-emailError").innerText = "";
    document.getElementById("donor-updated-mobilenoError").innerText = "";
    document.getElementById("donor-updated-addressError").innerText = "";

    document.getElementById("donor-updated-newPasswordError").innerText = "";
    document.getElementById("donor-updated-confirmPasswordError").innerText =
      "";
  }

  const nameInput = document.getElementById("donor-updated-name");
  const ageInput = document.getElementById("donor-updated-age");
  const emailInput = document.getElementById("donor-updated-email");
  const mobileInput = document.getElementById("donor-updated-mobileNo");
  const addressInput = document.getElementById("donor-updated-address");

  const newPasswordInput = document.getElementById(
    "donor-updated-new-password"
  );
  const confirmedPasswordInput = document.getElementById(
    "donor-updated-confirm-password"
  );

  nameInput.addEventListener("change", function (event) {
    const name = nameInput.value.trim();
    if (name !== "") {
      document.getElementById("donor-updated-nameError").innerText = "";
    }
  });

  ageInput.addEventListener("change", function (event) {
    const age = parseInt(ageInput.value);
    if (!(isNaN(age) || age < 18 || age > 65)) {
      document.getElementById("donor-updated-ageError").innerText = "";
    }
  });

  emailInput.addEventListener("change", function (event) {
    const email = emailInput.value.trim();
    if (emailPattern.test(email)) {
      document.getElementById("donor-updated-emailError").innerText = "";
    }
  });

  mobileInput.addEventListener("change", function (event) {
    const mobileNo = mobileInput.value.trim();
    if (mobileNo !== "") {
      document.getElementById("donor-updated-mobilenoError").innerText = "";
    }
  });

  addressInput.addEventListener("change", function (event) {
    const address = addressInput.value.trim();
    if (address !== "") {
      document.getElementById("donor-updated-addressError").innerText = "";
    }
  });

  newPasswordInput.addEventListener("change", function (event) {
    const newPassword = newPasswordInput.value.trim();
    if (newPassword !== "" || newPassword.length < 8) {
      document.getElementById("donor-updated-newPasswordError").innerText = "";
    }
  });

  confirmedPasswordInput.addEventListener("change", function (event) {
    const confirmedPassword = confirmedPasswordInput.value.trim();
    if (confirmedPassword !== "") {
      document.getElementById("donor-updated-confirmPasswordError").innerText =
        "";
    }
  });

  donorProfileDetailsForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Clear previous errors
    clearDetailsFieldErrors();

    // Form field values
    const nameInput = document.getElementById("donor-updated-name");
    const ageInput = document.getElementById("donor-updated-age");
    const emailInput = document.getElementById("donor-updated-email");
    const mobileInput = document.getElementById("donor-updated-mobileNo");
    const addressInput = document.getElementById("donor-updated-address");

    const newPasswordInput = document.getElementById(
      "donor-updated-new-password"
    );
    const confirmedPasswordInput = document.getElementById(
      "donor-updated-confirm-password"
    );

    const name = nameInput.value.trim();
    const age = parseInt(ageInput.value);
    const email = emailInput.value.trim();
    const mobileNo = mobileInput.value.trim();
    const address = addressInput.value.trim();

    const newPassword = newPasswordInput.value.trim();
    const confirmedPassword = confirmedPasswordInput.value.trim();

    // Validation
    let validDetails = true;
    let validPasswordDetails = true;

    if (name === "") {
      document.getElementById("donor-updated-nameError").innerText =
        "Name is required";
      validDetails = false;
    }

    if (isNaN(age) || age < 18 || age > 65) {
      document.getElementById("donor-updated-ageError").innerText =
        "Age must be between 18 and 65";
      validDetails = false;
    }

    if (!emailPattern.test(email)) {
      document.getElementById("donor-updated-emailError").innerText =
        "Invalid email address";
      validDetails = false;
    }

    if (mobileNo === "") {
      document.getElementById("donor-updated-mobilenoError").innerText =
        "Mobile number is required";
      validDetails = false;
    }

    if (address === "") {
      document.getElementById("donor-updated-addressError").innerText =
        "Address is required";
      validDetails = false;
    }

    if (newPassword.length < 8 && newPassword.length > 0) {
      document.getElementById("donor-updated-newPasswordError").innerText =
        "Password must be at least 8 characters long";
      validPasswordDetails = false;
    }

    if (
      (newPassword.length !== 0 && confirmedPassword.length === 0) ||
      newPassword !== confirmedPassword
    ) {
      document.getElementById("donor-updated-confirmPasswordError").innerText =
        "Password must be same as above";
      validPasswordDetails = false;
    }

    if (validDetails === true && validPasswordDetails === true) {
      alert("Form submitted successfully!");
      donorProfileDetailsForm.submit();
    }
  });
});
