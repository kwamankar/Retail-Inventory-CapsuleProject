document.getElementById("logout-link")?.addEventListener("click", function(e) {
  e.preventDefault();
  fetch("/logout", { method: "POST" })
    .then(() => {
      window.location.href = "/";
    });
});
