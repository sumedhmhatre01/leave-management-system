function showToast(message, type = "success") {
  const toast = document.createElement("div");

  toast.className = `toast ${type}`;

  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

function showConfirm(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    overlay.innerHTML = `
      <div class="confirm-modal">

        <h3>Confirmation</h3>

        <p>${message}</p>

        <div class="modal-buttons">

          <button id="cancelBtn">
            Cancel
          </button>

          <button id="confirmBtn">
            Confirm
          </button>

        </div>

      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("cancelBtn").addEventListener("click", () => {
      overlay.remove();

      resolve(false);
    });

    document.getElementById("confirmBtn").addEventListener("click", () => {
      overlay.remove();

      resolve(true);
    });
  });
}
