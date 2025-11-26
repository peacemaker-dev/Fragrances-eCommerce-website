// modal.js
// Works with the updated shop.js (using DOM dataset attributes instead of relying on shop.js logic)

document.addEventListener("DOMContentLoaded", () => {

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
  const qtySelect = document.getElementById("quantity-value");
  const addCartBtn = document.querySelector(".modal-cart-btn");
  const favBtn = document.querySelector(".fav-btn");

  const grid = document.getElementById("product-grid");

  if (!modal || !grid) return;

  // Helper
  function safe(val) {
    return val && val !== "null" && val !== "undefined" ? val : "";
  }

  // Open Modal from product card click
  grid.addEventListener("click", e => {
    const card = e.target.closest(".product-card");
    if (!card) return;

    // The new shop.js stores all product info inside dataset attributes
    const id = card.dataset.id;

    // Try get product from window.getProductById()
    let product = null;
    if (window.getProductById) product = window.getProductById(id);

    // Fallback to dataset if needed
    if (!product) {
      product = {
        id,
        name: safe(card.dataset.name),
        category: safe(card.dataset.category),
        price: Number(card.dataset.price || 0),
        maker: safe(card.dataset.maker),
        image1: safe(card.dataset.image1),
        image2: safe(card.dataset.image2),
        description: safe(card.dataset.desc),
        topNotes: safe(card.dataset.top),
        middleNotes: safe(card.dataset.middle),
        baseNotes: safe(card.dataset.base)
      };
    }

    // Fill modal
    modalImg1.src = product.image1 || "";
    modalImg2.src = product.image2 || product.image1 || "";

    modalName.textContent = product.name;
    modalDesc.textContent = product.description;
    modalMaker.textContent = product.maker;
    modalPrice.textContent = `R${product.price.toLocaleString()}`;

    modalTop.textContent = product.topNotes || "";
    modalMiddle.textContent = product.middleNotes || "";
    modalBase.textContent = product.baseNotes || "";

    qtySelect.value = "1";

    modal.classList.add("active");
    document.body.classList.add("modal-open");
  });

  // Close modal
  function close() {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  }

  closeModal.addEventListener("click", close);

  modal.addEventListener("click", e => {
    if (e.target === modal) close();
  });

  // Add To Cart
  addCartBtn.addEventListener("click", () => {
    const name = modalName.textContent.trim();
    const price = Number(modalPrice.textContent.replace(/[^\d]/g, "")) || 0;
    const image = modalImg1.src;
    const qty = parseInt(qtySelect.value, 10) || 1;

    const productId = (window.getProductById)
      ? (window.getProductById(name)?.id || name)
      : name;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id === productId);

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ id: productId, name, price, image, quantity: qty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    showToast(`${name} added to cart (${qty})`);
    close();
  });

  // Favourites
  favBtn.addEventListener("click", () => {
    const name = modalName.textContent.trim();
    let favs = JSON.parse(localStorage.getItem("favs")) || [];

    if (favs.includes(name)) {
      favs = favs.filter(x => x !== name);
      favBtn.classList.remove("active");
      showToast("Removed from favourites");
    } else {
      favs.push(name);
      favBtn.classList.add("active");
      showToast("Added to favourites");
    }

    localStorage.setItem("favs", JSON.stringify(favs));
  });

  // Toast notification
  function showToast(text) {
    const toast = document.createElement("div");
    toast.className = "cart-toast";
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
  }

});
