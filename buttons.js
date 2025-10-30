// Modal favourite toggle
document.addEventListener("click", e => {
  const favBtn = e.target.closest(".fav-btn");
  if (!favBtn) return;

  const icon = favBtn.querySelector("i");

  // Toggle between filled and outline heart
  if (icon.classList.contains("fa-regular")) {
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
    favBtn.title = "Remove from Favourites";
  } else {
    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");
    favBtn.title = "Add to Favourites";
  }
});
