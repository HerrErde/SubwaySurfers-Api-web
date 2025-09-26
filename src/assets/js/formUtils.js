function buildFormHtml(ep) {
  let formHTML = `<form id="apiForm" class="space-y-4">`;
  if (ep.params) {
    for (const key in ep.params) {
      const paramDef = ep.params[key];
      let inputType = paramDef.type === "int" ? "number" : "text";
      formHTML += `
        <div>
          <label class="block mb-1 text-sm">${paramDef.name}</label>
          <input type="${inputType}" name="${key}" placeholder="${
        paramDef.example || ""
      }" class="w-full px-3 py-2 rounded-md bg-[#121212] text-white border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f]" />
          ${
            paramDef.desc
              ? `<label class="block mb-1 text-sm">${paramDef.name}</label>`
              : ""
          }
        </div>
      `;
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
  return formHTML;
}

function validateForm(ep, formElements) {
  if (ep.params) {
    for (const key in ep.params) {
      const paramDef = ep.params[key];
      let val = formElements[key].value.trim();
      if (!val) {
        return `Field ${paramDef.name || key} is required.`;
      }
      if (typeof paramDef === "object" && paramDef.regex) {
        let re;
        try {
          re = new RegExp(paramDef.regex);
        } catch (err) {
          return `Invalid regex for ${paramDef.name || key}`;
        }
        if (!re.test(val)) {
          return `Field ${
            paramDef.name || key
          } does not match required format.\n ${
            paramDef.example ? "Example: " + paramDef.example : ""
          }`;
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
        let val = formElements[valueKey]?.value?.trim();
        if (typeof paramDef === "object" && paramDef.type === "int") {
          val = parseInt(val, 10);
        } else if (paramDef === "int") {
          val = parseInt(val, 10);
        }
        body[key] = val;
      }
    }
  }
  return body;
}
