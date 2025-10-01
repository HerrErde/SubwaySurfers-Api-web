function createMetadataDropdown(metadataList, onAddKey, addedKeys) {
  const container = document.createElement("div");
  container.className = "metadata-dropdown-container flex items-center gap-2";

  // Dropdown
  const select = document.createElement("select");
  select.className =
    "metadata-dropdown w-auto px-3 py-2 rounded-md bg-[#121212] text-white border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#ee9e4f]";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select a key...";
  placeholder.disabled = true;
  placeholder.selected = true;
  select.appendChild(placeholder);

  metadataList.forEach((meta) => {
    if (!addedKeys.includes(meta.name)) {
      const option = document.createElement("option");
      option.value = meta.name;
      option.textContent = meta.name;
      select.appendChild(option);
    }
  });
  container.appendChild(select);

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className =
    "metadata-add-btn px-2 py-1 rounded-md bg-[#1a1a1a] border border-[#333]";
  addBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`;

  addBtn.onclick = () => {
    const selected = select.value;
    if (selected && !addedKeys.includes(selected)) {
      onAddKey(selected);
    }
  };

  container.appendChild(addBtn);

  return container;
}

function renderMetadataInputs(metadataKeys, metadataList, formDiv) {
  const prevValues = {};
  Array.from(formDiv.querySelectorAll("input,select")).forEach((el) => {
    prevValues[el.name] = el.value;
  });

  formDiv.innerHTML = "";

  metadataKeys.forEach((key) => {
    const meta = metadataList.find((m) => m.name === key);
    if (!meta) return;

    const wrapper = document.createElement("div");
    wrapper.className =
      "metadata-input-wrapper flex flex-col gap-1 rounded-md bg-[#121212] text-white border border-[#333] p-2";

    const row = document.createElement("div");
    row.className = "metadata-input-row flex items-center gap-2";

    const label = document.createElement("label");
    label.className =
      "rounded-md bg-[#121212] text-white border border-[#333] px-2 py-1 text-left";
    label.style.width = "350px";
    label.textContent = meta.name;

    let input;
    if (Array.isArray(meta.rules?.options)) {
      input = document.createElement("select");
      input.name = `metadata_${meta.name}`;
      input.className =
        "rounded-md bg-[#121212] text-white border border-[#333] px-2 py-1 text-left metadata-input-select";
      input.style.width = "350px";
      meta.rules.options.forEach((opt) => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        input.appendChild(option);
      });
      if (prevValues[input.name]) input.value = prevValues[input.name];
    } else {
      let inputType = meta.rules?.type === "int" ? "number" : "text";
      input = document.createElement("input");
      input.type = inputType;
      input.name = `metadata_${meta.name}`;
      input.placeholder = meta.rules?.example || "";
      input.className =
        "rounded-md bg-[#121212] text-white border border-[#333] px-2 py-1 text-left metadata-input-select";
      input.style.width = "350px";
      if (prevValues[input.name]) input.value = prevValues[input.name];
    }

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className =
      "metadata-remove-btn px-2 py-1 rounded-md bg-[#1a1a1a] border border-[#333]";
    removeBtn.innerHTML = `<i class="fa-solid fa-minus"></i>`;
    removeBtn.onclick = () => {
      const idx = metadataKeys.indexOf(key);
      if (idx !== -1) {
        metadataKeys.splice(idx, 1);
        renderMetadataInputs(metadataKeys, metadataList, formDiv);

        const dropdownRow = document.getElementById("metadata-dropdown-row");
        dropdownRow.innerHTML = "";
        dropdownRow.appendChild(
          window.createMetadataDropdown(
            metadataList,
            window.onAddKey || (() => {}),
            metadataKeys
          )
        );
      }
    };

    row.appendChild(label);
    row.appendChild(input);
    row.appendChild(removeBtn);

    wrapper.appendChild(row);

    if (meta.rules?.desc) {
      const descLabel = document.createElement("label");
      descLabel.className = "font-poppins text-gray-300 mt-1 text-sm";
      descLabel.textContent = meta.rules.desc;
      wrapper.appendChild(descLabel);
    }

    formDiv.appendChild(wrapper);
  });
}
