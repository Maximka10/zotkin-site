document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const themeLink = document.getElementById("theme-link");

  themeToggle.addEventListener("click", () => {
    if (themeLink.getAttribute("href") === "style.css") {
      themeLink.setAttribute("href", "dark-theme.css");
      themeToggle.textContent = "☀️ Светлая тема";
    } else {
      themeLink.setAttribute("href", "style.css");
      themeToggle.textContent = "🌙 Темная тема";
    }
  });
});
