function setupIdentityUpload(inputId, btnId, statusId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  const status = statusId ? document.getElementById(statusId) : null;

  function resetButton() {
    btn.innerHTML = "";
    const icon = document.createElement("i");
    icon.className = "fa fa-upload";
    icon.setAttribute("aria-hidden", "true");
    btn.appendChild(icon);
    btn.appendChild(document.createTextNode(" Choose a file"));
    btn.classList.remove("file-selected");
    if (status) status.textContent = "";
  }

  function setFileSelected(expiryDate) {
    btn.innerHTML = "";
    const icon = document.createElement("i");
    icon.className = "fa fa-file";
    icon.setAttribute("aria-hidden", "true");
    btn.appendChild(icon);
    btn.appendChild(document.createTextNode(" identity"));
    btn.classList.add("file-selected");

    if (status && expiryDate) {
      const expiryDate = new Date();
      status.innerHTML = `Expires:<br>${expiryDate.toLocaleString()}`;
      status.title = expiryDate.toString();
    }
  }

  if (!btn) return;
  resetButton();

  if (btn && input) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      input.click();
    });

    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.name.startsWith("identity")) {
        alert('Please select a file named "identity"');
        e.target.value = "";
        resetButton();
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const json = JSON.parse(ev.target.result);

          if (
            !json.user?.id ||
            !json.identityToken?.token ||
            !json.refreshToken?.token
          ) {
            throw new Error("JSON missing required fields");
          }

          const jwt = json.identityToken.token;
          if (!/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(jwt)) {
            throw new Error("Invalid JWT format");
          }

          let expiryDate = null;
          if (json.identityToken.expiresAt) {
            expiryDate = new Date(json.identityToken.expiresAt);
            if (!isNaN(expiryDate.getTime()) && expiryDate < new Date()) {
              if (typeof Notify === "function") {
                new Notify({
                  status: "error",
                  title: "Token Expired",
                  text: "Token has expired",
                  effect: "fade",
                  speed: 300,
                  showIcon: true,
                  showCloseButton: true,
                  autoclose: true,
                  autotimeout: 3000,
                  type: "filled",
                  position: "right top"
                });
              } else {
                alert("Token has expired");
              }
              return;
            }
          }

          identityToken = jwt;
          setFileSelected(expiryDate);
        } catch (err) {
          identityToken = null;
          resetButton();
          e.target.value = "";
        }
      };
      reader.readAsText(file);
    });
  }
}

let endpoints = [];
let endpointData = [];
let identityToken = null;

endpointData = endpointsList;
renderSidebar();

window.addEventListener("DOMContentLoaded", function () {
  setupIdentityUpload(
    "identity-file-mobile",
    "identity-upload-btn-mobile",
    "token-expire-mobile"
  );
  setupIdentityUpload("identity-file", "identity-upload-btn", "token-expire");
});
