const createRequestButton = document.querySelectorAll("#create-request-button");
if (createRequestButton) {
  createRequestButton.forEach((element) => {
    element.addEventListener("click", () => {
      window.location.href = `/hospital/requests?view=createRequest`;
    });
  });
}

const viewRequestsButton = document.querySelectorAll("#view-requests-button");
if (viewRequestsButton) {
  viewRequestsButton.forEach((element) => {
    element.addEventListener("click", () => {
      window.location.href = `/hospital/requests?view=viewRequests`;
    });
  });
}
