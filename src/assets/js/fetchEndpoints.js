window.addEventListener("DOMContentLoaded", function () {
  const mobileIdentityInput = document.getElementById("identity-file-mobile");
  const mobileIdentityBtn = document.getElementById(
    "identity-upload-btn-mobile"
  );
  if (mobileIdentityBtn) {
    mobileIdentityBtn.innerHTML = "";
    const icon = document.createElement("i");
    icon.className = "fa fa-upload";
    icon.setAttribute("aria-hidden", "true");
    mobileIdentityBtn.appendChild(icon);
    mobileIdentityBtn.appendChild(document.createTextNode(" Choose a file"));
    mobileIdentityBtn.classList.remove("file-selected");
  }
  if (mobileIdentityBtn && mobileIdentityInput) {
    mobileIdentityBtn.addEventListener("click", function (e) {
      e.preventDefault();
      mobileIdentityInput.click();
    });
    mobileIdentityInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.name.startsWith("identity")) {
        alert('Please select a file named "identity"');
        e.target.value = "";
        if (mobileIdentityBtn) {
          mobileIdentityBtn.innerHTML = "";
          const icon = document.createElement("i");
          icon.className = "fa fa-upload";
          icon.setAttribute("aria-hidden", "true");
          mobileIdentityBtn.appendChild(icon);
          mobileIdentityBtn.appendChild(
            document.createTextNode(" Choose a file")
          );
          mobileIdentityBtn.classList.remove("file-selected");
        }
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
          if (json.identityToken.expiresAt) {
            const expires = new Date(json.identityToken.expiresAt);
            if (!isNaN(expires.getTime()) && expires < new Date()) {
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
          if (mobileIdentityBtn) {
            mobileIdentityBtn.innerHTML = "";
            const icon = document.createElement("i");
            icon.className = "fa fa-file";
            icon.setAttribute("aria-hidden", "true");
            mobileIdentityBtn.appendChild(icon);
            mobileIdentityBtn.appendChild(document.createTextNode(" identity"));
            mobileIdentityBtn.classList.add("file-selected");
          }
        } catch (err) {
          identityToken = null;
          if (mobileIdentityBtn) {
            mobileIdentityBtn.innerHTML = "";
            const icon = document.createElement("i");
            icon.className = "fa fa-upload";
            icon.setAttribute("aria-hidden", "true");
            mobileIdentityBtn.appendChild(icon);
            mobileIdentityBtn.appendChild(
              document.createTextNode(" Choose a file")
            );
            mobileIdentityBtn.classList.remove("file-selected");
          }
          e.target.value = "";
        }
      };
      reader.readAsText(file);
    });
  }
});
let endpoints = [];
let endpointData = [];
let identityToken = null;

endpointData = endpointsList;
renderSidebar();

window.addEventListener("DOMContentLoaded", function () {
  const sidebarIdentityInput = document.getElementById("identity-file");
  const sidebarIdentityBtn = document.getElementById("identity-upload-btn");
  if (sidebarIdentityBtn) {
    sidebarIdentityBtn.innerHTML = "";
    const icon = document.createElement("i");
    icon.className = "fa fa-upload";
    icon.setAttribute("aria-hidden", "true");
    sidebarIdentityBtn.appendChild(icon);
    sidebarIdentityBtn.appendChild(document.createTextNode(" Choose a file"));
    sidebarIdentityBtn.classList.remove("file-selected");
  }
  if (sidebarIdentityBtn && sidebarIdentityInput) {
    sidebarIdentityBtn.addEventListener("click", function (e) {
      e.preventDefault();
      sidebarIdentityInput.click();
    });
    sidebarIdentityInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (!file.name.startsWith("identity")) {
        alert('Please select a file named "identity"');
        e.target.value = "";
        if (sidebarIdentityBtn) {
          sidebarIdentityBtn.innerHTML = "";
          const icon = document.createElement("i");
          icon.className = "fa fa-upload";
          icon.setAttribute("aria-hidden", "true");
          sidebarIdentityBtn.appendChild(icon);
          sidebarIdentityBtn.appendChild(
            document.createTextNode(" Choose a file")
          );
          sidebarIdentityBtn.classList.remove("file-selected");
        }
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
          if (json.identityToken.expiresAt) {
            const expires = new Date(json.identityToken.expiresAt);
            if (!isNaN(expires.getTime()) && expires < new Date()) {
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
          if (sidebarIdentityBtn) {
            sidebarIdentityBtn.innerHTML = "";
            const icon = document.createElement("i");
            icon.className = "fa fa-file";
            icon.setAttribute("aria-hidden", "true");
            sidebarIdentityBtn.appendChild(icon);
            sidebarIdentityBtn.appendChild(
              document.createTextNode(" identity")
            );
            sidebarIdentityBtn.classList.add("file-selected");
          }
        } catch (err) {
          identityToken = null;
          if (sidebarIdentityBtn) {
            sidebarIdentityBtn.innerHTML = "";
            const icon = document.createElement("i");
            icon.className = "fa fa-upload";
            icon.setAttribute("aria-hidden", "true");
            sidebarIdentityBtn.appendChild(icon);
            sidebarIdentityBtn.appendChild(
              document.createTextNode(" Choose a file")
            );
            sidebarIdentityBtn.classList.remove("file-selected");
          }
          e.target.value = "";
        }
      };
      reader.readAsText(file);
    });
  }
});
