const viewCampButton = document.querySelectorAll("#view-camps-button");
const registerCampButton = document.getElementById("register-camp-button");

if (viewCampButton) {
  viewCampButton.forEach((item) => {
    item.addEventListener("click", () => {
      window.location.href = `/admin/camps?view=viewCamps`;
    });
  });
}

if (registerCampButton) {
  registerCampButton.addEventListener("click", () => {
    window.location.href = `/admin/camps?view=registerCamp`;
  });
}

const campDetailsEditButtons = document.querySelectorAll(
  "#camp-details-edit-button"
);

const campDetailsSaveButtons = document.querySelectorAll(
  "#camp-details-save-button"
);

function editRow(donorId) {
  const input = document.getElementById(`bloodCollected-${donorId}`);
  const editBtn = document.getElementById(`editBtn-${donorId}`);
  const saveBtn = document.getElementById(`saveBtn-${donorId}`);

  input.removeAttribute("readonly");
  input.classList.add("border-blue-500");
  editBtn.classList.add("hidden");
  saveBtn.classList.remove("hidden");
}

if (campDetailsEditButtons) {
  campDetailsEditButtons.forEach((ietm) => {
    item.addEventListener("click", () => {
      const donorId = this.getAttribute("data-id");
      const bloodGroup = this.getAttribute("data-blood-group");
      const donationId = this.getAttribute("data-donation-id");
      editRow(donorId);
    });
  });
}

async function saveRow(donorId, bloodGroup, donationId = null) {
  const input = document.getElementById(`bloodCollected-${donorId}`);
  const editBtn = document.getElementById(`editBtn-${donorId}`);
  const saveBtn = document.getElementById(`saveBtn-${donorId}`);
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
  const bloodCollected = input.value;

  // Send data to the server using AJAX
  try {
    const response = await fetch("record-donation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donorId,
        bloodCollected,
        bloodGroup,
        donationId,
        _csrf: csrfToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save data");
    } else {
      alert("Donation saved successfully!");
      window.location.reload();
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  } finally {
    // Switch back to readonly mode
    input.setAttribute("readonly", true);
    input.classList.remove("border-blue-500");
    editBtn.classList.remove("hidden");
    saveBtn.classList.add("hidden");
  }
}

if (campDetailsSaveButtons) {
  campDetailsSaveButtons.forEach((ietm) => {
    item.addEventListener("click", () => {
      const donorId = this.getAttribute("data-id");
      const bloodGroup = this.getAttribute("data-blood-group");
      const donationId = this.getAttribute("data-donation-id");
      saveRow(donorId, bloodGroup, donationId);
    });
  });
}

document.querySelectorAll(".camp-edit-btn").forEach((editBtn) => {
  editBtn.addEventListener("click", (event) => {
    const row = event.target.closest("tr");
    toggleEditMode(row, true);
  });
});

document.querySelectorAll(".camp-cancel-btn").forEach((editBtn) => {
  editBtn.addEventListener("click", (event) => {
    const row = event.target.closest("tr");
    toggleEditMode(row, false);
  });
});

document.querySelectorAll(".camp-save-btn").forEach((saveBtn) => {
  saveBtn.addEventListener("click", async (event) => {
    const errMessageContainer = document.getElementById(
      "error-messges-container"
    );
    if (errMessageContainer) {
      errMessageContainer.innerText = "";
      errMessageContainer.classList.add("hidden");
    }
    const row = event.target.closest("tr");
    const campId = row.dataset.id;
    const inputs = row.querySelectorAll(".edit-mode");
    const updatedData = {};
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    inputs.forEach((input) => {
      updatedData[input.name] = input.value;
    });

    updatedData["_csrf"] = csrfToken;

    try {
      const response = await fetch(`/admin/camps/updateCamp/${campId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const result = await response.json();
      if (result.ok) {
        toggleEditMode(row, false);
        inputs.forEach((input) => {
          input.previousElementSibling.innerText = input.value; // Update display mode values
        });
        window.location.reload();
      } else {
        if (result.message && result.message !== "" && errMessageContainer) {
          errMessageContainer.innerText = result.message;
          errMessageContainer.classList.remove("hidden");
        }
      }
    } catch (error) {
      console.error("Error updating camp", error);
    }
  });
});

document.querySelectorAll(".camp-delete-btn").forEach((deleteBtn) => {
  deleteBtn.addEventListener("click", async (event) => {
    const row = event.target.closest("tr");
    const campId = row.dataset.id;
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    if (confirm("Are you sure you want to delete this camp?")) {
      try {
        const response = await fetch(`/admin/camps/deleteCamp/${campId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _csrf: csrfToken,
          }),
        });
        if (response.ok) {
          row.remove();
          window.location.reload();
        } else {
          console.error("Failed to delete:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting camp:", error);
      }
    }
  });
});

function toggleEditMode(row, isEdit) {
  const displayElements = row.querySelectorAll(".display-mode");
  const editElements = row.querySelectorAll(".edit-mode");
  const editBtn = row.querySelector(".camp-edit-btn");
  const saveBtn = row.querySelector(".camp-save-btn");
  const cancelBtn = row.querySelector(".camp-cancel-btn");
  const deleteBtn = row.querySelector(".camp-delete-btn");
  const campInfoButton = row.querySelector(".camp-info-button");

  if (isEdit) {
    displayElements.forEach((el) => el.classList.add("hidden"));
    editElements.forEach((el) => el.classList.remove("hidden"));
    editBtn.classList.add("hidden");
    deleteBtn.classList.add("hidden");
    saveBtn.classList.remove("hidden");
    cancelBtn.classList.remove("hidden");
    campInfoButton.classList.add("hidden");
  } else {
    displayElements.forEach((el) => el.classList.remove("hidden"));
    editElements.forEach((el) => el.classList.add("hidden"));
    editBtn.classList.remove("hidden");
    saveBtn.classList.add("hidden");
    cancelBtn.classList.add("hidden");
    deleteBtn.classList.remove("hidden");
    campInfoButton.classList.remove("hidden");
  }
}
