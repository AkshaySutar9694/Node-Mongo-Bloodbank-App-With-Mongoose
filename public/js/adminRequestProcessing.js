document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("requester-details-modal");
  const modalContent = document.getElementById("requester-details-content");
  const closeIcon = document.getElementById("close-modal");

  document.querySelectorAll(".donors-details-link").forEach((element) => {
    element.addEventListener("click", async (event) => {
      const requesterId = event.target.getAttribute("data-donor-id");

      try {
        const response = await fetch(
          "/admin/donor-details/" + requesterId
        ).then((results) => results.json());

        if (response.ok === true && response.donorInfo != null) {
          const data = response.donorInfo;
          modalContent.innerHTML = `
                            <p><strong>Name :</strong> ${data.name}</p>
                            <p><strong>Email :</strong> ${data.email}</p>
                            <p><strong>Contact No :</strong> ${
                              data.mobileNo
                            }</p>
                            <p><strong>Last Donation Date :</strong> ${
                              data.lastDonationDone || "N/A"
                            }</p>
                        `;
          modal.classList.remove("hidden");
        } else {
          modalContent.innerHTML = `<p class="text-red-600">${data.error}</p>`;
          modal.classList.remove("hidden");
        }
      } catch (error) {
        modalContent.innerHTML = `<p class="text-red-600">Failed to fetch donor details. Please try again.</p>`;
        modal.classList.remove("hidden");
      }
    });
  });

  document.querySelectorAll(".hospital-details-link").forEach((element) => {
    element.addEventListener("click", async (event) => {
      const requesterId = event.target.getAttribute("data-hospital-id");

      try {
        const response = await fetch(
          "/admin/hospital-details/" + requesterId
        ).then((results) => results.json());

        if (response.ok === true && response.hospitalInfo != null) {
          const data = response.hospitalInfo;
          modalContent.innerHTML = `
                            <p><strong>Name :</strong> ${data.name}</p>
                            <p><strong>Email :</strong> ${data.email}</p>
                            <p><strong>Contact No :</strong> ${
                              data.mobileNo
                            }</p>
                            <p><strong>Address :</strong> ${
                              data.address || "N/A"
                            }</p>
                        `;
          modal.classList.remove("hidden");
        } else {
          modalContent.innerHTML = `<p class="text-red-600">${data.error}</p>`;
          modal.classList.remove("hidden");
        }
      } catch (error) {
        modalContent.innerHTML = `<p class="text-red-600">Failed to fetch donor details. Please try again.</p>`;
        modal.classList.remove("hidden");
      }
    });
  });

  const requestForm = document.querySelectorAll("#process-requester-form");
  requestForm.forEach((element) => {
    element.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target);
      const csrfToken = document.querySelector(
        'meta[name="csrf-token"]'
      ).content;
      const data = Object.fromEntries(formData.entries());
      data["_csrf"] = csrfToken;
      try {
        const response = await fetch("/admin/process-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.ok || result.message != null) {
          alert(result.message);
          window.location.reload();
        } else {
          alert("Something went wrong!");
        }
      } catch (error) {
        console.log(error);
        alert("Something went wrong!");
      }
    });
  });

  closeIcon.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
});
