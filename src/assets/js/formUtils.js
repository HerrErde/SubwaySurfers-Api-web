function buildFormHtml(ep) {
  let formHTML = `<form id="apiForm" class="space-y-4">`;
  let hasMetadata = false;
  if (ep.params) {
    for (const key in ep.params) {
      const paramDef = ep.params[key];
      if (paramDef.type === "list" && paramDef.metadata) {
        hasMetadata = true;
        break;
      }
    }
  }
  if (hasMetadata) {
    formHTML += `
      <div>
        <label class="block mb-1 text-sm">Paste userData JSON</label>
        <textarea id="userDataJsonInput" rows="2" class="w-full px-3 py-2 rounded-md bg-[#121212] text-white border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f]" placeholder='{"userData":{...}}'></textarea>
        <button type="button" id="userDataJsonSubmit" class="mt-2 bg-[#ffcc99] hover:bg-[#ee9e4f] text-black font-semibold px-3 py-1 rounded-lg">Autofill from JSON</button>
      </div>
    `;
    document.addEventListener("click", (e) => {
      if (e.target && e.target.id === "userDataJsonSubmit") {
        try {
          const input = document
            .getElementById("userDataJsonInput")
            .value.trim();
          if (!input) return;
          const parsed = JSON.parse(input);
          if (parsed.userData) {
            autofillFormFromUserData(parsed.userData);
          } else {
            alert("JSON must contain { userData: {...} }");
          }
        } catch (err) {
          alert("Invalid JSON: " + err.message);
        }
      }
    });
  }
  let metadataList = null;
  if (ep.params) {
    for (const key in ep.params) {
      const paramDef = ep.params[key];
      if (paramDef.type === "list" && paramDef.metadata) {
        metadataList = Object.entries(paramDef.metadata).map(
          ([name, rules]) => {
            if (typeof rules === "object") {
              return { name, rules };
            } else {
              return { name, rules: { example: rules } };
            }
          }
        );
        formHTML += `
          <div id="metadata-list-container">
            <label class="block mb-1 text-sm">${paramDef.name}</label>
            <div id="metadata-dropdown-row" class="w-full px-3 py-2 rounded-md bg-[#121212] text-white border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f]"></div>
            <div id="metadata-keys-row"></div>
            <div class="text-xs text-gray-400">Maximal 20 Keys, every key only once.</div>
          </div>
        `;
      } else {
        let inputType = paramDef.type === "int" ? "number" : "text";
        formHTML += `
          <div>
            <label class="block mb-1 text-sm">${paramDef.name || key}</label>
            <input type="${inputType}" name="${key}" placeholder="${
          paramDef.example || ""
        }" value="${
          paramDef.default || ""
        }" class="w-full px-3 py-2 rounded-md bg-[#121212] text-white border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f]" ${
          paramDef.required ? "required" : ""
        } />
            ${
              paramDef.desc
                ? `<label class="font-poppins text-gray-300 mb-4 mt-2 text-sm">${paramDef.desc}</label>`
                : ""
            }
          </div>
        `;
      }
    }
  }
  formHTML += `
    <div class="flex items-center space-x-2">
      <button type="submit" class="bg-[#ffcc99] hover:bg-[#ee9e4f] text-black font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
        <i class="fas fa-paper-plane"></i> Send Request
      </button>
    </div>
    <div id="errors" class="text-red-500 mt-2"></div>
  </form>`;

  setTimeout(() => {
    if (metadataList) {
      const dropdownRow = document.getElementById("metadata-dropdown-row");
      const keysRow = document.getElementById("metadata-keys-row");
      if (!dropdownRow || !keysRow) return;

      let addedKeys = [];

      function refreshUI() {
        renderMetadataInputs(addedKeys, metadataList, keysRow);

        dropdownRow.innerHTML = "";
        dropdownRow.appendChild(
          createMetadataDropdown(metadataList, onAddKey, addedKeys)
        );
      }

      function onAddKey(key) {
        if (addedKeys.length >= 20) {
          if (typeof Notify === "function") {
            new Notify({
              status: "error",
              title: "Metadata Limit",
              text: "The maximal limit is 20 fields",
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
            alert("The maximal limit is 20 fields");
          }
          return;
        }
        if (!addedKeys.includes(key)) {
          addedKeys.push(key);
          refreshUI();
        }
      }

      window.onAddKey = onAddKey;

      refreshUI();
    }
  });

  return formHTML;
}

function validateForm(ep, formElements) {
  if (!ep) {
    console.error("validateForm called with undefined ep");
    return "Internal error: no endpoint definition.";
  }

  const limitsDisabled = localStorage.getItem("limitsDisabled") === "true";

  for (const key in ep.params) {
    const paramDef = ep.params[key];

    if (
      key === "metadata" &&
      paramDef &&
      paramDef.metadata &&
      !limitsDisabled
    ) {
      let body;
      try {
        body = buildRequestBody(ep, formElements);
      } catch (err) {
        console.error("buildRequestBody threw:", err);
        return "Internal error while building request body for metadata.";
      }

      const metaObj = (body && body.metadata) || {};

      for (const nestedKey in paramDef.metadata) {
        const nestedDef = paramDef.metadata[nestedKey];
        const nestedVal = metaObj[nestedKey];

        if (
          !nestedDef.regex ||
          nestedVal === undefined ||
          nestedVal === null ||
          String(nestedVal).trim() === ""
        ) {
          continue;
        }

        let re;
        try {
          re = new RegExp(nestedDef.regex);
        } catch (err) {
          console.error(`  Invalid regex for ${nestedKey}:`, nestedDef.regex);
          return `Invalid regex for ${nestedDef.name || nestedKey}`;
        }

        if (!re.test(String(nestedVal))) {
          return `
            <div class="text-sm text-red-400">
              Field ${
                nestedDef.name || nestedKey
              } does not match required format.
              ${
                nestedDef.example
                  ? `<div>Example: ${nestedDef.example}</div>`
                  : ""
              }
              ${
                nestedDef.errordesc
                  ? `<label class="font-poppins font-bold text-red-400 mt-2 block">${nestedDef.errordesc}</label>`
                  : ""
              }
            </div>
          `;
        }
      }

      continue;
    }

    // regular field handling
    const element = formElements[key];
    if (!element) {
      if (paramDef && paramDef.required) {
        return `Field ${paramDef.name || key} is required.`;
      }
      continue;
    }

    const valRaw = element.value;
    const val =
      valRaw !== undefined && valRaw !== null ? String(valRaw).trim() : "";

    // required check
    if (paramDef && paramDef.required && !val) {
      return `Field ${paramDef.name || key} is required.`;
    }

    // If not required and not metadata skip
    if ((!paramDef || !paramDef.required) && key !== "metadata") {
      continue;
    }

    // Only validate further if limits are enabled
    if (!limitsDisabled) {
      // Regular field regex
      if (paramDef && paramDef.regex && val) {
        let re;
        try {
          re = new RegExp(paramDef.regex);
        } catch (err) {
          return `Invalid regex for ${paramDef.name || key}`;
        }

        if (!re.test(val)) {
          return `
            <div class="text-sm text-red-400">
              Field ${paramDef.name || key} does not match required format.
              ${
                paramDef.example
                  ? `<div>Example: ${paramDef.example}</div>`
                  : ""
              }
              ${
                paramDef.errordesc
                  ? `<label class="font-poppins font-bold text-red-400 mt-2 block">${paramDef.errordesc}</label>`
                  : ""
              }
            </div>
          `;
        }
      }
    }
  }

  return null;
}

function buildRequestBody(ep, formElements, e) {
  let body = null;
  if (ep.body) {
    function fillTemplate(obj) {
      if (typeof obj === "string" && obj.startsWith("$")) {
        const key = obj.slice(1);
        let val = formElements[key]?.value;
        if (val === undefined) return obj;
        if (
          ep.params &&
          typeof ep.params[key] === "object" &&
          ep.params[key].type === "int"
        ) {
          val = parseInt(val, 10);
        } else if (ep.params && ep.params[key] === "int") {
          val = parseInt(val, 10);
        }
        return val;
      } else if (typeof obj === "object" && obj !== null) {
        const out = Array.isArray(obj) ? [] : {};
        for (const k in obj) out[k] = fillTemplate(obj[k]);
        return out;
      }
      return obj;
    }
    body = fillTemplate(ep.body);
  } else if (ep.params) {
    if (ep.type === "json") {
      body = {};
      for (const key in ep.params) {
        const paramDef = ep.params[key];
        if (!formElements[key]) continue;
        let val = formElements[key].value.trim();
        if (typeof paramDef === "object" && paramDef.type === "int") {
          val = parseInt(val, 10);
        } else if (paramDef === "int") {
          val = parseInt(val, 10);
        }
        body[key] = val;
      }
    } else if (ep.type === "rpc") {
      body = {};
      for (const key in ep.params) {
        const paramDef = ep.params[key];
        let valueKey = key;
        if (typeof paramDef === "string") {
          valueKey = paramDef;
        } else if (typeof paramDef === "object" && paramDef.value) {
          valueKey = paramDef.value;
        }
        if (!formElements[valueKey]) continue;
        let val = formElements[valueKey]?.value?.trim();
        if (typeof paramDef === "object" && paramDef.type === "int") {
          val = parseInt(val, 10);
        } else if (paramDef === "int") {
          val = parseInt(val, 10);
        }
        body[key] = val;
      }
      const metadata = {};
      const metaInputs = document.querySelectorAll('[name^="metadata_"]');

      metaInputs.forEach((el) => {
        const metaName = el.name.replace("metadata_", "");
        const metaVal = (el.value || "").trim();
        if (metaName && metaVal !== "") {
          metadata[metaName] = metaVal;
        }
      });

      if (metaInputs.length > 0) {
        if (Object.keys(metadata).length > 0) {
          body.metadata = metadata;
        }
      }
    }
  }
  return body;
}
