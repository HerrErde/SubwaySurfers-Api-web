function autofillFormFromUserData(userData) {
  if (userData.name) {
    const nameInput = document.querySelector('input[name="name"]');
    if (nameInput) nameInput.value = userData.name;
  }
  if (userData.level !== undefined) {
    const levelInput = document.querySelector('input[name="level"]');
    if (levelInput) levelInput.value = userData.level;
  }
  if (userData.highscore !== undefined) {
    const highscoreInput = document.querySelector('input[name="highscore"]');
    if (highscoreInput) highscoreInput.value = userData.highscore;
  }

  if (Array.isArray(userData.metadataMap)) {
    let i = 0;
    function addNextKey() {
      if (i >= userData.metadataMap.length) return;
      const [key, value] = userData.metadataMap[i];
      const addBtn = document.querySelector(
        "#metadata-dropdown-row .metadata-add-btn"
      );
      const select = document.querySelector("#metadata-dropdown-row select");
      if (select && addBtn) {
        select.value = key;
        addBtn.click();
        setTimeout(() => {
          const metaInput = document.querySelector(`[name="metadata_${key}"]`);
          if (metaInput) metaInput.value = value;
          i++;
          addNextKey();
        }, 50);
      } else {
        setTimeout(addNextKey, 50);
      }
    }
    addNextKey();
  }
}
