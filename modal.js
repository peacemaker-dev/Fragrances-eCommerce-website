const modal = document.getElementById("product-modal");
const modalImg = document.getElementById("modal-image");
const modalName = document.getElementById("modal-name");
const modalDesc = document.getElementById("modal-desc");
const modalPrice = document.getElementById("modal-price");
const closeModal = document.querySelector(".close-modal");

grid.addEventListener("click", e => {
  const card = e.target.closest(".product-card");
  if (!card) return;

  const productId = card.dataset.id;
  const product = products.find(p => p.id === productId);

  if (product) {
    modalImg.src = product.image;
    modalName.textContent = product.name;
    modalDesc.textContent = product.description;
    modalPrice.textContent = `R${product.price.toLocaleString()}`;
    modal.classList.add("active");
  }
});

closeModal.addEventListener("click", () => modal.classList.remove("active"));
modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.remove("active");
});