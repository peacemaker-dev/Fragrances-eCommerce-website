// modal.js
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

  // quantity select (your HTML uses a select)
  const qtySelect = document.getElementById("quantity-value");
  const addCartBtn = document.querySelector(".modal-cart-btn");
  const favBtn = document.querySelector(".fav-btn");

  // Guard: ensure required elements exist
  if (!modal || !modalImg1 || !modalName || !qtySelect || !addCartBtn) return;

  // Helper to read product note fields tolerant of snake/camel
  function readNote(product, key1, key2) {
    return product[key1] || product[key2] || "—";
  }

  // Open modal when clicking a product card (shop.js still calls setupModal but we'll keep our own listener too)
  grid.addEventListener("click", e => {
    const card = e.target.closest(".product-card");
    if (!card) return;

    const productId = card.dataset.id;
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // images: support image1/image and images[] (tolerant)
    const img1 = product.image1 || product.image || (product.images && product.images[0]) || "";
    const img2 = product.image2 || (product.images && product.images[1]) || img1;

    modalImg1.src = img1;
    modalImg2.src = img2;
    modalImg1.alt = product.name;
    modalImg2.alt = product.name + " (angle 2)";

    modalName.textContent = product.name || "Product";
    modalDesc.textContent = product.description || "";
    modalMaker.textContent = product.maker || product.brand || "";
    modalPrice.textContent = `R${(product.price || 0).toLocaleString()}`;

    // Notes tolerant to both key styles
    modalTop.textContent = readNote(product, "topNotes", "top_notes");
    modalMiddle.textContent = readNote(product, "middleNotes", "middle_notes");
    modalBase.textContent = readNote(product, "baseNotes", "base_notes");

    // Reset select to 1
    qtySelect.value = "1";

    // show modal and stop background scroll
    modal.classList.add("active");
    document.body.classList.add("modal-open");
  });

  // Close modal
  closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      document.body.classList.remove("modal-open");
    }
  });

  // Add to cart from modal
  addCartBtn.addEventListener("click", () => {
    // read current modal product
    const name = modalName.textContent.trim();
    const priceText = modalPrice.textContent.replace(/[^\d.]/g, "");
    const price = parseFloat(priceText) || 0;
    const image = modalImg1.src;
    const qty = parseInt(qtySelect.value, 10) || 1;

    // we need an id — attempt to find one from products (matching by name)
    const productObj = products.find(p => p.name === name || p.id === (p.id + ""));
    const id = productObj ? productObj.id : name; // fallback to name if id not found

    // Load cart, merge, save
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => String(item.id) === String(id) || item.name === name);

    if (existing) {
      existing.quantity = (existing.quantity || 0) + qty;
    } else {
      cart.push({ id, name, price, image, quantity: qty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // feedback
    document.body.classList.add("cart-toast-visible"); // CSS optional
    showToast(`${name} added to cart (${qty})`);

    // close modal
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  });

  // Favourite button (toggle heart class)
  if (favBtn) {
    favBtn.addEventListener("click", () => {
      // simple local favorite toggle (by name)
      const name = modalName.textContent.trim();
      let favs = JSON.parse(localStorage.getItem("favs")) || [];
      if (favs.includes(name)) {
        favs = favs.filter(x => x !== name);
      } else {
        favs.push(name);
      }
      localStorage.setItem("favs", JSON.stringify(favs));
      favBtn.classList.toggle("active");
      showToast(favBtn.classList.contains("active") ? "Added to favourites" : "Removed from favourites");
    });
  }

  // Small toast (reusable)
  function showToast(text) {
    const toast = document.createElement("div");
    toast.className = "cart-toast";
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
  }
}

// export for modules (if using modules); otherwise global function is fine
// window.setupModal = setupModal;
