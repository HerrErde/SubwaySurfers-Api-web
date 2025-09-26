document.addEventListener("DOMContentLoaded", function () {
  const mobileSidebarToggle = document.getElementById("mobileSidebarToggle");
  const mobileSidebar = document.getElementById("mobileSidebar");
  const overlay = document.getElementById("overlay");
  const mobileList = document.getElementById("mobileEndpointList");

  if (mobileSidebarToggle && mobileSidebar && overlay) {
    mobileSidebarToggle.addEventListener("click", () => {
      mobileSidebar.classList.toggle("-translate-x-full");
      overlay.classList.toggle("hidden");
    });

    overlay.addEventListener("click", () => {
      mobileSidebar.classList.add("-translate-x-full");
      overlay.classList.add("hidden");
    });
  }

  if (mobileList && mobileSidebar && overlay) {
    mobileList.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        mobileSidebar.classList.add("-translate-x-full");
        overlay.classList.add("hidden");
      }
    });
  }
});
