function setupModal(products) {
  const modal = document.getElementById("product-modal");
  const modalImg1 = document.getElementById("modal-image1");
  const modalImg2 = document.getElementById("modal-image2");
  const modalName = document.getElementById("modal-name");
  const modalDesc = document.getElementById("modal-desc");
  const modalPrice = document.getElementById("modal-price");
  const modalMaker = document.getElementById("modal-maker");
  const modalTop = document.getElementById("modal-top");
  const modalMiddle = document.getElementById("modal-middle");
  const modalBase = document.getElementById("modal-base");
  const closeModal = document.querySelector(".close-modal");

  const qtyValue = document.getElementById("quantity-value");
  const increaseQty = document.getElementById("increase-qty");
  const decreaseQty = document.getElementById("decrease-qty");

  grid.addEventListener("click", e => {
    const card = e.target.closest(".product-card");
    if (!card) return;

    const productId = card.dataset.id;
    const product = products.find(p => p.id === productId);

    if (product) {
      modalImg1.src = product.image1;
      modalImg2.src = product.image2 || product.image1; // fallback
      modalName.textContent = product.name;
      modalDesc.textContent = product.description;
      modalMaker.textContent = product.maker;
      modalPrice.textContent = `R${product.price.toLocaleString()}`;
      modalTop.textContent = product.topNotes || "—";
      modalMiddle.textContent = product.middleNotes || "—";
      modalBase.textContent = product.baseNotes || "—";
      qtyValue.textContent = 1;

      modal.classList.add("active");
    }
  });

  closeModal.addEventListener("click", () => modal.classList.remove("active"));
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("active");
  });

  increaseQty.addEventListener("click", () => {
    qtyValue.textContent = parseInt(qtyValue.textContent) + 1;
  });

  decreaseQty.addEventListener("click", () => {
    const val = parseInt(qtyValue.textContent);
    if (val > 1) qtyValue.textContent = val - 1;
  });
}
