function renderSidebar() {
  // Desktop Sidebar
  const list = document.getElementById("endpointList");
  if (list) {
    list.innerHTML = "";
    endpointData.forEach((ep, i) => {
      const div = document.createElement("div");
      div.className =
        "sidebar-link rounded-[9px] text-left w-[90%] transition-colors cursor-pointer px-3 py-2 flex items-start gap-1 flex-col justify-between";
      const a = document.createElement("a");
      a.textContent = ep.name;
      a.className =
        "flex font-semibold justify-between font-poppins items-center gap-1";
      div.appendChild(a);
      div.onclick = () => {
        document
          .querySelectorAll("#endpointList .sidebar-link")
          .forEach((el) => {
            el.classList.remove("sb-selected");
          });
        div.classList.add("sb-selected");
        document.getElementById("endpointTitle").textContent = ep.name;
        document.getElementById("endpointPath").textContent = ep.endpoint;
        document.getElementById("endpointDesc").textContent = ep.desc;
        renderForm(ep);
      };
      list.appendChild(div);
    });
  }

  // Mobile Sidebar
  const mobileList = document.getElementById("mobileEndpointList");
  if (mobileList) {
    mobileList.innerHTML = "";
    endpointData.forEach((ep, i) => {
      const div = document.createElement("div");
      div.className =
        "sidebar-link rounded-[9px] text-left w-[90%] transition-colors cursor-pointer px-3 py-2 flex items-start gap-1 flex-col justify-between";
      const a = document.createElement("a");
      a.textContent = ep.name;
      a.className =
        "flex font-semibold justify-between font-poppins items-center gap-1";
      div.appendChild(a);
      div.onclick = () => {
        document
          .querySelectorAll("#mobileEndpointList .sidebar-link")
          .forEach((el) => {
            el.classList.remove("sb-selected");
          });
        div.classList.add("sb-selected");
        document.getElementById("endpointTitle").textContent = ep.name;
        document.getElementById("endpointPath").textContent = ep.endpoint;
        document.getElementById("endpointDesc").textContent = ep.desc;
        renderForm(ep);
        const mobileSidebar = document.getElementById("mobileSidebar");
        const overlay = document.getElementById("overlay");
        if (mobileSidebar && overlay) {
          mobileSidebar.classList.add("-translate-x-full");
          overlay.classList.add("hidden");
        }
      };
      mobileList.appendChild(div);
    });
  }
}

function handleFormSubmit(ep, MsgType, RespType, url, opts, formElements, e) {
  const errorsEl = document.getElementById("errors");
  if (errorsEl) errorsEl.innerText = "";
  if (!identityToken) {
    if (typeof Notify === "function") {
      new Notify({
        status: "error",
        title: "Token missing",
        text: "You need to upload a valid identity file first",
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
      alert("Token missing");
    }
    return;
  }
  const errorMsg = validateForm(ep, formElements);
  if (errorMsg) {
    if (errorsEl) errorsEl.innerText = errorMsg;
    return;
  }
  const body = buildRequestBody(ep, formElements, e);
  const responseResultDiv = document.getElementById("responseResult");
  if (responseResultDiv) {
    const newDiv = document.createElement("div");
    newDiv.id = "responseResult";
    newDiv.className = responseResultDiv.className;
    newDiv.innerHTML =
      '<textarea id="response-output" rows="36" class="w-full mt-4 bg-[#121212] text-white border border-[#333] rounded p-2 border-0"></textarea>';
    responseResultDiv.replaceWith(newDiv);
  }
  function setTextIfExists(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  sendRequest(url, identityToken, MsgType, RespType, body, opts);
}

function renderForm(ep) {
  const formDiv = document.getElementById("endpointForm");
  formDiv.innerHTML = buildFormHtml(ep);
  document.getElementById("apiForm").onsubmit = function (e) {
    e.preventDefault();
    const url = "https://subway.prod.sybo.net" + ep.endpoint;
    const opts = { json: ep.type === "json" };
    let MsgType = null;
    let RespType = null;
    if (ep.type === "rpc") {
      try {
        if (
          ep.request &&
          typeof proto?.player?.ext?.v1?.[ep.request] === "function"
        ) {
          MsgType = proto.player.ext.v1[ep.request];
        }
        if (
          ep.response &&
          typeof proto?.player?.ext?.v1?.[ep.response] === "function"
        ) {
          RespType = proto.player.ext.v1[ep.response];
        }
        if (!MsgType || !RespType) {
          throw new Error("MsgType oder RespType nicht gefunden");
        }
      } catch (err) {
        alert("Protobuf-Typen konnten nicht geladen werden: " + err.message);
        return;
      }
    }
    handleFormSubmit(ep, MsgType, RespType, url, opts, this.elements, e);
  };
}
